import type { AnalysisResponse, IncompleteReason } from "../types";
import type { ContextField } from "./contract";

export type CompleteSectionAnalysis = Extract<AnalysisResponse, { status: "complete" }>;

// Cross-section tracing arrives in Slice B. Until then the response states plainly that it was not performed.
export type Traceability = { status: "not_implemented" };

export type WorkspaceResponse =
  | {
      status: "complete";
      version: 2;
      // The Discussion assessed on its own text by the validated v0.1 engine.
      discussion: CompleteSectionAnalysis;
      traceability: Traceability;
      // Which supplied sources the server received (not whether they were used).
      received: { results: boolean; context: ContextField[] };
    }
  | { status: "incomplete"; version: 2; reason: IncompleteReason };
