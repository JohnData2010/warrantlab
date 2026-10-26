import { describe, expect, it } from "vitest";
import { aggregate } from "../lib/engine/aggregate";
import { analyse } from "../lib/engine/analyse";
import type { GenerateStructured, LlmResult } from "../lib/engine/llm";
import { type VerifiedAssessment, verifyExtraction, verifyJudgement } from "../lib/engine/verify";
import { splitParagraphs } from "../lib/text/paragraphs";
import { TC1, TC1_CLAIM, TC1_EVIDENCE, assessment, tc1Extraction } from "./fixtures";

function scripted(...results: LlmResult[]): GenerateStructured & { calls: number } {
  const fn = Object.assign(
    async () => {
      const next = results[Math.min(fn.calls, results.length - 1)];
      fn.calls++;
      return next;
    },
    { calls: 0 },
  );
  return fn;
}

const ok = (json: unknown): LlmResult => ({ ok: true, json, model: "test-model", latencyMs: 1 });
const deps = (generate: GenerateStructured) => ({ generate, extractModel: "m1", judgeModel: "m2", causalEnabled: false });

function verified(a: Partial<VerifiedAssessment> & { start?: number }): VerifiedAssessment {
  const base = assessment(a);
  const start = a.start ?? 0;
  return { ...base, claimQuote: a.claimQuote ?? "claim", claimSpan: a.claimSpan === undefined ? { start, end: start + 5 } : a.claimSpan, evidenceSpans: [] };
}

describe("verifyExtraction", () => {
  const paragraphs = splitParagraphs(TC1);
  it("accepts a faithful extraction and locates claims", () => {
    const result = verifyExtraction(TC1, paragraphs, tc1Extraction());
    expect(result.ok).toBe(true);
    if (result.ok) {
      const span = result.claimSpans.get("C1")!;
      expect(TC1.slice(span.start, span.end)).toBe(TC1_CLAIM);
    }
  });
  it("rejects missing paragraph coverage", () => {
    expect(verifyExtraction(TC1, paragraphs, tc1Extraction({ paragraphs_covered: [] }))).toMatchObject({ ok: false, reason: "coverage" });
  });
  it("rejects fabricated evidence", () => {
    const fabricated = tc1Extraction({ evidence: [{ id: "E1", quote: "(p < .001, n = 400)", sentence: "x", paragraph: 1, evidence_kind: "statistical_result" }] });
    expect(verifyExtraction(TC1, paragraphs, fabricated)).toMatchObject({ ok: false, reason: "fabricated_span" });
  });
  it("rejects schema-invalid output", () => {
    expect(verifyExtraction(TC1, paragraphs, { claims: "nope" })).toMatchObject({ ok: false, reason: "invalid_output" });
  });
});

describe("verifyJudgement", () => {
  const ex = verifyExtraction(TC1, splitParagraphs(TC1), tc1Extraction());
  if (!ex.ok) throw new Error("fixture extraction must verify");

  it("accepts an overclaim with all fields and resolves evidence spans", () => {
    const result = verifyJudgement(TC1, ex, { assessments: [assessment()], all_claims_considered: true });
    expect(result.ok).toBe(true);
    if (result.ok) expect(TC1.slice(result.assessments[0].evidenceSpans[0].start, result.assessments[0].evidenceSpans[0].end)).toBe(TC1_EVIDENCE);
  });
  it("requires every extracted claim to be assessed", () => {
    expect(verifyJudgement(TC1, ex, { assessments: [], all_claims_considered: true })).toMatchObject({ ok: false, reason: "coverage" });
  });
  it("rejects an overclaim with an empty missing warrant", () => {
    const result = verifyJudgement(TC1, ex, { assessments: [assessment({ missing_warrant: " " })], all_claims_considered: true });
    expect(result).toMatchObject({ ok: false, reason: "invalid_output" });
  });
  it("rejects fabricated evidence quotes from the judge", () => {
    const result = verifyJudgement(TC1, ex, { assessments: [assessment({ evidence_quotes: ["(r = .62)"] })], all_claims_considered: true });
    expect(result).toMatchObject({ ok: false, reason: "fabricated_span" });
  });
  it("rejects an assessment referencing both or neither claim", () => {
    const both = assessment({ new_quote: TC1_CLAIM });
    expect(verifyJudgement(TC1, ex, { assessments: [both], all_claims_considered: true })).toMatchObject({ ok: false, reason: "invalid_output" });
  });
});

describe("aggregate", () => {
  it("returns overclaim_detected with findings in text order", () => {
    const r = aggregate([verified({ start: 50, basis_clarity: 2 }), verified({ start: 10, basis_clarity: 3 })], { causalEnabled: false });
    expect(r).toMatchObject({ status: "complete", outcome: "overclaim_detected", limited: false });
    if (r.status === "complete") expect(r.findings.map((f) => f.claimSpan!.start)).toEqual([10, 50]);
  });
  it("keeps at most three findings, chosen by clarity, and flags limited", () => {
    const many = [1, 2, 3, 4].map((i) => verified({ start: i * 10, basis_clarity: i === 1 ? 1 : 3 }));
    const r = aggregate(many, { causalEnabled: false });
    if (r.status !== "complete") throw new Error();
    expect(r.findings).toHaveLength(3);
    expect(r.limited).toBe(true);
    expect(r.findings.map((f) => f.claimSpan!.start)).toEqual([20, 30, 40]);
  });
  it("shows unassessed claims alongside findings, with a count only when all are located", () => {
    const r = aggregate([verified({}), verified({ verdict: "cannot_assess", category: null, start: 80 })], { causalEnabled: false });
    expect(r).toMatchObject({ outcome: "overclaim_detected", unassessed: { count: 1 } });
    const unlocated = aggregate([verified({ verdict: "cannot_assess", category: null, claimSpan: null })], { causalEnabled: false });
    expect(unlocated).toMatchObject({ outcome: "insufficient_evidence", unassessed: { count: null } });
  });
  it("returns no_overclaim_identified for calibrated claims without a reason", () => {
    const r = aggregate([verified({ verdict: "calibrated", category: null })], { causalEnabled: false });
    expect(r).toMatchObject({ outcome: "no_overclaim_identified" });
    expect(r.status === "complete" && r.reason).toBeFalsy();
  });
  it("marks no_in_scope_claims when nothing in scope was assessed", () => {
    expect(aggregate([], { causalEnabled: false })).toMatchObject({ outcome: "no_overclaim_identified", reason: "no_in_scope_claims" });
    expect(aggregate([verified({ verdict: "out_of_scope", category: null })], { causalEnabled: false })).toMatchObject({ reason: "no_in_scope_claims" });
  });
  it("treats causal overclaims as out of scope while the flag is off", () => {
    const causal = verified({ category: "causal_overclaim" });
    expect(aggregate([causal], { causalEnabled: false })).toMatchObject({ outcome: "no_overclaim_identified", reason: "no_in_scope_claims" });
    expect(aggregate([causal], { causalEnabled: true })).toMatchObject({ outcome: "overclaim_detected" });
  });
  it("notes when a finding's location could not be marked", () => {
    const r = aggregate([verified({ claimSpan: null })], { causalEnabled: false });
    if (r.status !== "complete") throw new Error();
    expect(r.findings[0].verificationStatus).toContain("could not be marked");
  });
});

describe("analyse (mocked model)", () => {
  it("produces an exact TC1 highlight end to end", async () => {
    const gen = scripted(ok(tc1Extraction()), ok({ assessments: [assessment()], all_claims_considered: true }));
    const { response } = await analyse({ text: TC1, section: "discussion" }, deps(gen));
    expect(response).toMatchObject({ status: "complete", outcome: "overclaim_detected" });
    if (response.status === "complete") {
      const span = response.findings[0].claimSpan!;
      expect(TC1.slice(span.start, span.end)).toBe(TC1_CLAIM);
    }
  });
  it("retries once on fabricated evidence, then reports incomplete", async () => {
    const bad = tc1Extraction({ evidence: [{ id: "E1", quote: "invented", sentence: "x", paragraph: 1, evidence_kind: "other" }] });
    const gen = scripted(ok(bad), ok(bad));
    const { response } = await analyse({ text: TC1, section: "discussion" }, deps(gen));
    expect(response).toEqual({ status: "incomplete", reason: "fabricated_span" });
    expect(gen.calls).toBe(2);
  });
  it("maps model failures to incomplete without a second pass", async () => {
    for (const reason of ["quota", "truncated", "blocked", "timeout"] as const) {
      const gen = scripted({ ok: false, reason, model: "m", latencyMs: 1 });
      const { response } = await analyse({ text: TC1, section: "discussion" }, deps(gen));
      expect(response).toEqual({ status: "incomplete", reason });
      expect(gen.calls).toBe(1);
    }
  });
  it("never reports a clean outcome when the judge fails", async () => {
    const gen = scripted(ok(tc1Extraction()), { ok: false, reason: "truncated", model: "m", latencyMs: 1 });
    const { response } = await analyse({ text: TC1, section: "discussion" }, deps(gen));
    expect(response).toEqual({ status: "incomplete", reason: "truncated" });
  });
});
