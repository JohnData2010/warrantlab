import { readdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { getConfig } from "../lib/config";
import { analyse } from "../lib/engine/analyse";
import { createGeminiGenerator } from "../lib/engine/gemini";
import type { AnalysisResponse, SectionId } from "../lib/types";
import { type CheckResult, type Fixture, runChecks, signature } from "./checks";

let judgeRequests = 0;
let extractRequests = 0;

interface RunRecord {
  response: AnalysisResponse;
  checks: CheckResult[];
  latencyMs: number;
  models: string[];
  notRun: boolean;
  judgeHttp: number;
  extractHttp: number;
  failureDetail?: string;
}

function arg(name: string): string | undefined {
  return process.argv.find((a) => a.startsWith(`--${name}=`))?.slice(name.length + 3);
}

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

async function main() {
  const section = (arg("section") ?? "discussion") as SectionId;
  const runs = Number(arg("runs") ?? "3");
  const delayMs = Number(arg("delay-ms") ?? "13000"); // Judge free tier: 5 requests per minute
  const only = arg("only")?.split(",");
  const config = getConfig();
  const generate = createGeminiGenerator(config.apiKey);

  const dir = join("eval", "fixtures", section);
  const fixtures: Fixture[] = readdirSync(dir)
    .filter((f) => f.endsWith(".json"))
    .map((f) => JSON.parse(readFileSync(join(dir, f), "utf8")) as Fixture)
    .filter((f) => !only || only.includes(f.id));

  // Judge quota is 20 requests/day, so running every fixture by accident must be impossible.
  if (!only && !process.argv.includes("--all")) {
    console.error("Select fixtures explicitly with --only=id1,id2 (or pass --all to run every fixture).");
    process.exitCode = 1;
    return;
  }
  const unknown = only?.filter((id) => !fixtures.some((f) => f.id === id)) ?? [];
  if (unknown.length) {
    console.error(`Unknown fixture id(s): ${unknown.join(", ")}`);
    process.exitCode = 1;
    return;
  }
  const maxJudge = arg("max-judge") ? Number(arg("max-judge")) : Number.POSITIVE_INFINITY;
  console.log(`Fixtures: ${fixtures.map((f) => f.id).join(", ")} · runs ${runs} · Judge budget ${Number.isFinite(maxJudge) ? maxJudge : "unlimited"}\n`);

  const results = new Map<string, RunRecord[]>();
  let quotaHit = false;
  let budgetHit = false;
  for (const fixture of fixtures) {
    if (quotaHit || budgetHit) {
      console.log(`${fixture.id}: NOT RUN (${quotaHit ? "quota exhausted" : "Judge budget reached"})`);
      results.set(fixture.id, []);
      continue;
    }
    const records: RunRecord[] = [];
    for (let i = 0; i < runs; i++) {
      // Worst case per run: one Judge call plus one fabrication retry.
      if (judgeRequests + 2 > maxJudge) {
        budgetHit = true;
        console.log(`${fixture.id} run ${i + 1}/${runs}: NOT RUN (Judge budget of ${maxJudge} reached)`);
        break;
      }
      const started = Date.now();
      const { response, meta } = await analyse(
        { text: fixture.text, section },
        { generate, extractModel: config.extractModel, judgeModel: config.judgeModel, causalEnabled: fixture.development_only ? true : config.causalEnabled, judgeRetryOnServerError: config.judgeRetryOnServerError },
      );
      const notRun = response.status === "incomplete" && (response.reason === "quota" || response.reason === "rate_limited");
      const judgeHttp = meta.calls.filter((c) => c.stage === "judge").reduce((s, c) => s + c.attempts, 0);
      const extractHttp = meta.calls.filter((c) => c.stage === "extract").reduce((s, c) => s + c.attempts, 0);
      judgeRequests += judgeHttp;
      extractRequests += extractHttp;
      const record = {
        response,
        checks: runChecks(fixture, response),
        latencyMs: Date.now() - started,
        models: meta.calls.map((c) => `${c.stage}:${c.model}`),
        notRun,
        judgeHttp,
        extractHttp,
        failureDetail: meta.failureDetail,
      };
      records.push(record);
      const failed = record.checks.filter((c) => !c.pass).map((c) => c.name);
      console.log(
        `${fixture.id} run ${i + 1}/${runs}: ${notRun ? `NOT RUN (${response.status === "incomplete" ? response.reason : ""})` : signature(fixture.text, response)} ${failed.length ? `FAIL[${failed.join(", ")}]` : "ok"} ${record.latencyMs}ms · judge HTTP ${judgeHttp} · extract HTTP ${extractHttp} · Judge total ${judgeRequests}${meta.failureDetail ? ` (${meta.failureDetail})` : ""}`,
      );
      if (notRun) {
        quotaHit = true;
        break;
      }
      await sleep(delayMs);
    }
    results.set(fixture.id, records);
  }

  writeReport(section, runs, fixtures, results, config.extractModel, config.judgeModel);
}

function writeReport(section: string, runs: number, fixtures: Fixture[], results: Map<string, RunRecord[]>, extractModel: string, judgeModel: string) {
  const stamp = new Date().toISOString().replace(/[:.]/g, "-");
  const lines: string[] = [];
  lines.push(`# Eval report — ${section}`, "");
  lines.push(`- Date: ${new Date().toISOString()}`);
  lines.push(`- Extract model: \`${extractModel}\` · Judge model: \`${judgeModel}\``);
  lines.push(`- Runs per fixture: ${runs}. All fixtures are fictional and synthetic.`);
  lines.push(`- Actual HTTP requests this session: Judge ${judgeRequests}, Extract ${extractRequests} (including adapter and fabrication retries).`, "");
  lines.push("| Fixture | Runs completed | Checks passed (all runs) | Consistency (7) | Mean latency |", "|---|---|---|---|---|");

  const passed = new Map<string, boolean>();
  for (const fixture of fixtures) {
    const records = results.get(fixture.id) ?? [];
    const done = records.filter((r) => !r.notRun);
    const allChecks = done.every((r) => r.checks.every((c) => c.pass));
    const sigs = new Set(done.map((r) => signature(fixture.text, r.response)));
    const consistent = done.length > 0 && sigs.size === 1;
    const fullyRun = done.length === runs;
    passed.set(fixture.id, fullyRun && allChecks && consistent);
    const mean = done.length ? Math.round(done.reduce((s, r) => s + r.latencyMs, 0) / done.length / 100) / 10 : 0;
    lines.push(`| ${fixture.id}${fixture.gate ? ` (gate: ${fixture.gate})` : ""} | ${done.length}/${runs}${fullyRun ? "" : " — not run (quota)"} | ${allChecks && done.length ? "yes" : "NO"} | ${consistent ? "yes" : `NO (${sigs.size} variants)`} | ${mean}s |`);
  }

  const derived: string[] = [];
  const pass = (id: string) => passed.get(id) === true;
  for (const f of fixtures.filter((f) => f.variant_of)) {
    const a = results.get(f.id)?.find((r) => !r.notRun);
    const b = results.get(f.variant_of!)?.find((r) => !r.notRun);
    const base = fixtures.find((x) => x.id === f.variant_of);
    if (a && b && base) {
      const same = a.response.status === b.response.status &&
        (a.response.status !== "complete" || b.response.status !== "complete" || a.response.outcome === b.response.outcome) &&
        signature(f.text, a.response).split("|").slice(1).join("|") === signature(base.text, b.response).split("|").slice(1).join("|");
      derived.push(`- 6 irrelevant-edit stability (${f.id} vs ${f.variant_of}): ${same ? "pass" : "FAIL"}`);
    }
  }
  if (results.has("tc1-theoretical-overclaim") && results.has("tc2-calibrated")) {
    derived.push(`- 8 revision pair (TC1 → TC2): ${pass("tc1-theoretical-overclaim") && pass("tc2-calibrated") ? "pass" : "FAIL"}`);
  }
  if (results.has("cross-paragraph-calibrated")) derived.push(`- 9 cross-paragraph evidence: ${pass("cross-paragraph-calibrated") ? "pass" : "FAIL"}`);
  if (results.has("tc4-no-in-scope-claims") && results.has("tc3-insufficient")) {
    derived.push(`- 10 no claims ≠ no evidence (TC4 vs TC3): ${pass("tc4-no-in-scope-claims") && pass("tc3-insufficient") ? "pass" : "FAIL"}`);
  }
  derived.push("- 11 incomplete processing: covered by unit tests (`npm test`, tests/engine.test.ts).");
  lines.push("", "## Derived checks", "", ...derived);

  const gateFixtures = fixtures.filter((f) => f.gate);
  const gatePass = gateFixtures.length === 3 && gateFixtures.every((f) => pass(f.id)) && runs >= 3;
  lines.push("", "## Gate", "", `Gate fixtures (overclaim, calibrated, insufficient) passing checks 1–5 and 7 in ${runs}/${runs} runs: **${gatePass ? "PASS" : "NOT PASSED"}**${runs < 3 ? " (fewer than 3 runs — cannot pass)" : ""}.`);

  lines.push("", "## Details");
  for (const fixture of fixtures) {
    lines.push("", `### ${fixture.id}`, "", `Expected: \`${fixture.expect.outcome}${fixture.expect.reason ? `/${fixture.expect.reason}` : ""}\``, "");
    for (const [i, r] of (results.get(fixture.id) ?? []).entries()) {
      lines.push(`- Run ${i + 1}: ${r.notRun ? "not run (quota)" : signature(fixture.text, r.response)} — ${r.checks.map((c) => `${c.name}: ${c.pass ? "pass" : "FAIL"}${c.note ? ` (${c.note})` : ""}`).join("; ")} — ${Math.round(r.latencyMs / 1000)}s · judge HTTP ${r.judgeHttp} · extract HTTP ${r.extractHttp}${r.failureDetail ? ` · failure: ${r.failureDetail}` : ""}`);
    }
    const fixtureRuns = results.get(fixture.id) ?? [];
    const firstIndex = fixtureRuns.findIndex((r) => r.response.status === "complete");
    const first = firstIndex >= 0 ? fixtureRuns[firstIndex] : undefined;
    if (first?.response.status === "complete") {
      for (const f of first.response.findings) {
        lines.push("", `> **Missing warrant (run ${firstIndex + 1}, first completed run):** ${f.missingWarrant}`, ">", `> **Questions:** ${f.questionsToExamine.join(" / ")}`);
      }
    }
  }

  const path = join("eval", "reports", `${stamp}-${section}.md`);
  writeFileSync(path, lines.join("\n") + "\n");
  console.log(`\nReport: ${path}\nGate: ${gatePass ? "PASS" : "NOT PASSED"}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
