import type { GenerateStructured, LlmResult, StructuredRequest } from "../lib/engine/llm";
import { type WorkspaceInput, emptyContext } from "../lib/v2/contract";
import type { Locate, Relate } from "../lib/v2/trace/schemas";

// Synthetic texts written for these tests. Expected outcomes follow the provisional construct specification;
// they are NOT expert-validated gold labels.
export const R_E1 = "Teams with dashboard access scored higher on coded data-driven decision-making than teams without access (d = 0.45, 95% CI [0.10, 0.80])";
export const R_E2 = "Weekly dashboard log-ins were associated with shorter meetings (r = .21, p = .04)";
export const RESULTS = `${R_E1}.\n\n${R_E2}.`;

export const D_C1 = "improved data-driven decision-making in the teams studied";
export const D_C1_SENTENCE = "Dashboard access improved data-driven decision-making in the teams studied.";
export const D_C2 = "prove that managerial transparency is the mechanism through which dashboards change decisions";
export const D_C2_SENTENCE = "These findings prove that managerial transparency is the mechanism through which dashboards change decisions.";
export const D_C3 = "also reduce employee turnover";
export const D_C3_SENTENCE = "Dashboards also reduce employee turnover.";
export const DISCUSSION = `${D_C1_SENTENCE} ${D_C2_SENTENCE}\n\n${D_C3_SENTENCE}`;

export function traceInput(overrides: Partial<WorkspaceInput> = {}): WorkspaceInput {
  return { version: 2, results: RESULTS, discussion: DISCUSSION, context: emptyContext(), ...overrides };
}

export function locateOutput(overrides: Partial<Locate> = {}): Locate {
  return {
    discussion_paragraphs_covered: [1, 2],
    results_paragraphs_covered: [1, 2],
    claims: [
      { id: "C1", quote: D_C1, sentence: D_C1_SENTENCE, paragraph: 1, claim_kind: "causal", results_reference: "builds_on_located_result" as const },
      { id: "C2", quote: D_C2, sentence: D_C2_SENTENCE, paragraph: 1, claim_kind: "mechanism_or_theory", results_reference: "builds_on_located_result" as const },
      { id: "C3", quote: D_C3, sentence: D_C3_SENTENCE, paragraph: 2, claim_kind: "causal", results_reference: "no_reference" as const },
    ],
    evidence: [
      { id: "E1", quote: R_E1, sentence: `${R_E1}.`, paragraph: 1, evidence_kind: "group_comparison" },
      { id: "E2", quote: R_E2, sentence: `${R_E2}.`, paragraph: 2, evidence_kind: "association" },
    ],
    links: [
      { claim_id: "C1", evidence_id: "E1" },
      { claim_id: "C2", evidence_id: "E1" },
    ],
    ...overrides,
  };
}

type RelateClaim = Relate["claims"][number];

export function relateClaim(overrides: Partial<RelateClaim> & { claim_id: string }): RelateClaim {
  return {
    evidence_links: [],
    link_status: "no_relevant_evidence_located",
    relationship_explanation: "No located Results passage addresses this claim.",
    gap_explanation: "",
    missing_information: "",
    context_fields_used: [],
    uncertainty_note: "Information elsewhere in the paper could change this.",
    assessment: "cannot_assess",
    ...overrides,
  };
}

export const C1_SUPPORTED = relateClaim({
  claim_id: "C1",
  evidence_links: [{ evidence_id: "E1", relevance: "direct", role: "Reports the difference the claim describes." }],
  link_status: "linked",
  relationship_explanation: "The located result reports higher scores for teams with access, as the claim states for these teams.",
  assessment: "supported_as_stated",
});
export const C2_BEYOND = relateClaim({
  claim_id: "C2",
  evidence_links: [{ evidence_id: "E1", relevance: "partial", role: "Reports the group difference the mechanism claim builds on." }],
  link_status: "linked",
  relationship_explanation: "The located result reports a difference between groups.",
  gap_explanation: "The supplied Results do not report a measure of managerial transparency or a test linking it to the difference.",
  assessment: "goes_beyond_evidence",
});
export const C3_ABSENT = relateClaim({ claim_id: "C3", missing_information: "A result about employee turnover." });

export function relateOutput(claims: RelateClaim[] = [C1_SUPPORTED, C2_BEYOND, C3_ABSENT], all = true): Relate {
  return { claims, all_claims_considered: all };
}

export const ok = (json: unknown): LlmResult => ({ ok: true, json, model: "test-model", latencyMs: 1 });
export const fail = (reason: "quota" | "timeout" | "rate_limited" | "model_error"): LlmResult => ({ ok: false, reason, model: "test-model", latencyMs: 1 });

// Returns scripted results in order and records each request.
export function scripted(...results: LlmResult[]) {
  const requests: StructuredRequest[] = [];
  const generate: GenerateStructured = async (req) => {
    requests.push(req);
    return results[Math.min(requests.length - 1, results.length - 1)];
  };
  return { generate, requests };
}
