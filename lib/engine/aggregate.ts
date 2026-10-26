import type { AnalysisResponse, Finding } from "../types";
import type { VerifiedAssessment } from "./verify";

export const MAX_FINDINGS = 3;

const VERIFIED_STATUS = "Mismatch identifiable within the supplied text. Full study not assessed.";
const UNMARKED_STATUS = `${VERIFIED_STATUS} Location could not be marked in the text.`;

function position(a: VerifiedAssessment): number {
  return a.claimSpan?.start ?? Number.MAX_SAFE_INTEGER;
}

export function aggregate(assessments: VerifiedAssessment[], options: { causalEnabled: boolean }): AnalysisResponse {
  const effective = assessments.map((a) =>
    a.verdict === "overclaim" && a.category === "causal_overclaim" && !options.causalEnabled ? { ...a, verdict: "out_of_scope" as const } : a,
  );

  const overclaims = effective.filter((a) => a.verdict === "overclaim");
  const selected = [...overclaims]
    .sort((x, y) => y.basis_clarity - x.basis_clarity || position(x) - position(y))
    .slice(0, MAX_FINDINGS)
    .sort((x, y) => position(x) - position(y));

  const findings: Finding[] = selected.map((a, i) => ({
    id: `f${i + 1}`,
    category: a.category ?? "theoretical_overclaim",
    claimSpan: a.claimSpan,
    claimQuote: a.claimQuote,
    evidenceSpans: a.evidenceSpans,
    evidenceIdentified: a.evidence_identified,
    missingWarrant: a.missing_warrant,
    claimSummary: a.claim_summary,
    whatClaimAssumes: a.what_claim_assumes,
    whyItMatters: a.why_it_matters,
    evidenceStillNeeded: a.evidence_still_needed,
    questionsToExamine: a.questions_to_examine,
    verificationStatus: a.claimSpan ? VERIFIED_STATUS : UNMARKED_STATUS,
  }));

  const cannotAssess = effective.filter((a) => a.verdict === "cannot_assess");
  const items = cannotAssess
    .map((a) => ({ quote: a.claimQuote, span: a.claimSpan, needsOtherSection: a.needs_other_section }))
    .sort((x, y) => (x.span?.start ?? Number.MAX_SAFE_INTEGER) - (y.span?.start ?? Number.MAX_SAFE_INTEGER));
  const unassessed = { count: items.every((i) => i.span !== null) ? items.length : null, items };

  const base = { findings, limited: overclaims.length > MAX_FINDINGS, unassessed };
  if (findings.length > 0) return { status: "complete", outcome: "overclaim_detected", ...base };
  if (items.length > 0) return { status: "complete", outcome: "insufficient_evidence", ...base };

  const inScope = effective.filter((a) => a.verdict !== "out_of_scope");
  if (inScope.length === 0) return { status: "complete", outcome: "no_overclaim_identified", ...base, reason: "no_in_scope_claims" };
  return { status: "complete", outcome: "no_overclaim_identified", ...base };
}
