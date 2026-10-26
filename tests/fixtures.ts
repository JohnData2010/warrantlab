import type { Assessment, Extraction } from "../lib/engine/schemas";

export const TC1 =
  "Participants exposed to an external data-sharing policy reported higher privacy concerns than those exposed to an internal-sharing policy (p = .01). These findings prove that violations of contextual integrity are the mechanism driving privacy concerns.";
export const TC1_CLAIM = "prove that violations of contextual integrity are the mechanism driving privacy concerns";
export const TC1_EVIDENCE =
  "Participants exposed to an external data-sharing policy reported higher privacy concerns than those exposed to an internal-sharing policy (p = .01)";

export function tc1Extraction(overrides: Partial<Extraction> = {}): Extraction {
  return {
    paragraphs_covered: [1],
    claims: [
      {
        id: "C1",
        quote: TC1_CLAIM,
        sentence: "These findings prove that violations of contextual integrity are the mechanism driving privacy concerns.",
        paragraph: 1,
        claim_kind: "theoretical",
        evidence_ids: ["E1"],
        unresolved_reference: false,
      },
    ],
    evidence: [{ id: "E1", quote: TC1_EVIDENCE, sentence: `${TC1_EVIDENCE}.`, paragraph: 1, evidence_kind: "group_comparison" }],
    ...overrides,
  };
}

export function assessment(overrides: Partial<Assessment> = {}): Assessment {
  return {
    claim_id: "C1",
    new_quote: null,
    new_sentence: null,
    evidence_quotes: [TC1_EVIDENCE],
    evidence_identified: "A difference in privacy concerns between two policy conditions (p = .01).",
    claim_summary: "The findings prove the theoretical mechanism.",
    what_claim_assumes: "That the condition difference identifies contextual-integrity violation as the mechanism.",
    missing_warrant: "The supplied text does not establish that contextual-integrity violation was measured or tested as the mechanism.",
    verdict: "overclaim",
    category: "theoretical_overclaim",
    why_it_matters: "A group difference is consistent with the theory but does not establish its mechanism.",
    evidence_still_needed: "A measure or manipulation of the proposed mechanism and a test of it.",
    questions_to_examine: ["Was the mechanism measured or manipulated?", "Does the text report a test of the mechanism itself?"],
    needs_other_section: false,
    basis_clarity: 3,
    ...overrides,
  };
}
