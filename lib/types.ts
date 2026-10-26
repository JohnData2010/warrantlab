export const SECTION_IDS = [
  "abstract",
  "introduction",
  "literature_review",
  "hypotheses",
  "methodology",
  "results",
  "discussion",
  "conclusion",
] as const;
export type SectionId = (typeof SECTION_IDS)[number];

export interface SectionOption {
  id: SectionId;
  label: string;
  supported: boolean;
  devPreview: boolean;
  selectable: boolean;
}

export type Outcome = "overclaim_detected" | "no_overclaim_identified" | "insufficient_evidence";

export type IncompleteReason =
  | "quota"
  | "blocked"
  | "truncated"
  | "model_error"
  | "timeout"
  | "invalid_output"
  | "fabricated_span"
  | "coverage";

export interface Span {
  start: number;
  end: number;
}

export type OverclaimCategory = "theoretical_overclaim" | "causal_overclaim";

export interface Finding {
  id: string;
  category: OverclaimCategory;
  claimSpan: Span | null;
  claimQuote: string;
  evidenceSpans: Span[];
  evidenceIdentified: string;
  missingWarrant: string;
  claimSummary: string;
  whatClaimAssumes: string;
  whyItMatters: string;
  evidenceStillNeeded: string;
  questionsToExamine: string[];
  verificationStatus: string;
}

export interface UnassessedClaim {
  quote: string;
  span: Span | null;
  needsOtherSection: boolean;
}

export type AnalysisResponse =
  | {
      status: "complete";
      outcome: Outcome;
      findings: Finding[];
      limited: boolean;
      unassessed: { count: number | null; items: UnassessedClaim[] };
      reason?: "no_in_scope_claims";
    }
  | { status: "incomplete"; reason: IncompleteReason };
