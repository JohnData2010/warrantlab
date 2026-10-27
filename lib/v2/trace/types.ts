import type { IncompleteReason } from "../../types";
import type { ContextField } from "../contract";
import type { ASSESSMENTS, LINK_STATUSES, Locate } from "./schemas";

export type QuoteSource = "results" | "discussion";

// Where a quotation sits in its ORIGINAL source text. A verified location proves where the words appear,
// not that the statement is correct or that it supports anything.
export type SourceLocation =
  | { status: "exact" | "tolerant"; sourceId: QuoteSource; start: number; end: number }
  | { status: "ambiguous"; sourceId: QuoteSource };

export type ClaimKind = Locate["claims"][number]["claim_kind"];
export type EvidenceKind = Locate["evidence"][number]["evidence_kind"];

export interface TraceEvidence {
  id: string;
  quote: string;
  kind: EvidenceKind;
  location: SourceLocation;
}

export interface TraceLink {
  evidenceId: string;
  relevance: "direct" | "partial";
  role: string;
}

export type LinkStatus = (typeof LINK_STATUSES)[number] | "results_not_supplied";
export type PreliminaryAssessment = (typeof ASSESSMENTS)[number];

export interface TraceClaim {
  id: string;
  quote: string;
  kind: ClaimKind;
  location: SourceLocation;
  linkStatus: LinkStatus;
  links: TraceLink[];
  assessment: PreliminaryAssessment;
  relationshipExplanation: string;
  gapExplanation: string;
  missingInformation: string;
  contextFieldsUsed: ContextField[];
  uncertaintyNote: string;
}

export type TraceResponse =
  | {
      status: "complete";
      version: 2;
      claims: TraceClaim[];
      evidence: TraceEvidence[];
      resultsSupplied: boolean;
      contextSupplied: ContextField[];
    }
  | { status: "incomplete"; version: 2; reason: IncompleteReason };
