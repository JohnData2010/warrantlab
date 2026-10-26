import type { AnalysisResponse, Outcome } from "../lib/types";

export interface Fixture {
  id: string;
  section: string;
  text: string;
  synthetic: true;
  gate?: "overclaim" | "calibrated" | "insufficient";
  variant_of?: string;
  development_only?: boolean;
  // Each expected finding is one exact quote, or a list of acceptable boundaries for the same claim.
  expect: { outcome: Outcome; reason?: "no_in_scope_claims"; finding_quotes?: (string | string[])[]; category?: string };
}

export function alternatives(expected: string | string[]): string[] {
  return Array.isArray(expected) ? expected : [expected];
}

export interface CheckResult {
  name: string;
  pass: boolean;
  note?: string;
}

export const BANNED_PHRASES = [
  "was not tested",
  "were not tested",
  "never tested",
  "did not test",
  "didn't test",
  "is invalid",
  "are invalid",
  "disproven",
  "disproves",
  "your study is wrong",
  "the study is wrong",
  "fails to",
  "failed to",
];

// Statistic-like tokens such as "p = .01", "r = .48", "N = 412", "β = −0.31".
const STAT = /\b(?:p|r|n|N|t|F|β|b|d|R²|R2|OR|CI)\s*[=<>≤≥]\s*[−-]?\d*[.,]?\d+/g;

function normaliseStat(s: string): string {
  return s.replace(/\s+/g, "").replace(/−/g, "-").toLowerCase();
}

export function highlightedQuotes(text: string, response: AnalysisResponse): string[] {
  if (response.status !== "complete") return [];
  return response.findings.filter((f) => f.claimSpan).map((f) => text.slice(f.claimSpan!.start, f.claimSpan!.end));
}

function diagnosticStrings(response: AnalysisResponse): string[] {
  if (response.status !== "complete") return [];
  return response.findings.flatMap((f) => [
    f.evidenceIdentified,
    f.missingWarrant,
    f.claimSummary,
    f.whatClaimAssumes,
    f.whyItMatters,
    f.evidenceStillNeeded,
    ...f.questionsToExamine,
  ]);
}

export function runChecks(fixture: Fixture, response: AnalysisResponse): CheckResult[] {
  const results: CheckResult[] = [];
  const complete = response.status === "complete";

  const outcomeOk =
    complete && response.outcome === fixture.expect.outcome && (fixture.expect.reason === undefined || response.reason === fixture.expect.reason);
  results.push({
    name: "1 outcome",
    pass: outcomeOk,
    note: complete ? `${response.outcome}${response.reason ? ` (${response.reason})` : ""}` : `incomplete: ${response.reason}`,
  });

  if (fixture.expect.finding_quotes) {
    const got = highlightedQuotes(fixture.text, response);
    const missing = fixture.expect.finding_quotes.filter((q) => !alternatives(q).some((alt) => got.includes(alt)));
    results.push({
      name: "2 exact span",
      pass: complete && missing.length === 0,
      note: missing.length ? `missing: ${missing.map((q) => alternatives(q)[0]).join(" | ")}; got: ${got.join(" | ") || "none"}` : undefined,
    });
  }

  const inputStats = new Set((fixture.text.match(STAT) ?? []).map(normaliseStat));
  const outputStats = diagnosticStrings(response).flatMap((s) => s.match(STAT) ?? []);
  const invented = outputStats.filter((s) => !inputStats.has(normaliseStat(s)));
  const unlocated = complete ? response.findings.filter((f) => !f.claimSpan).length : 0;
  results.push({
    name: "3 no fabrication",
    pass: complete && invented.length === 0,
    note: [invented.length ? `invented stats: ${invented.join(", ")}` : "", unlocated ? `${unlocated} finding(s) unlocated` : ""].filter(Boolean).join("; ") || undefined,
  });

  if (fixture.expect.outcome !== "overclaim_detected") {
    results.push({ name: "4 strong wording ≠ overclaim", pass: complete && response.outcome !== "overclaim_detected" });
  }

  const lowered = diagnosticStrings(response).map((s) => s.toLowerCase());
  const banned = BANNED_PHRASES.filter((p) => lowered.some((s) => s.includes(p)));
  results.push({ name: "5 bounded language", pass: banned.length === 0, note: banned.length ? `banned: ${banned.join(", ")}` : undefined });

  return results;
}

export function signature(text: string, response: AnalysisResponse): string {
  if (response.status !== "complete") return `incomplete:${response.reason}`;
  return `${response.outcome}${response.reason ? `/${response.reason}` : ""}|${highlightedQuotes(text, response).sort().join("|")}`;
}
