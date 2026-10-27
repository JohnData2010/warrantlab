import { z } from "zod";
import { CONTEXT_FIELDS } from "../contract";

// Pass 1 (Locate): Discussion claims, Results evidence and candidate links, all quoted exactly.
export const LocateSchema = z.object({
  discussion_paragraphs_covered: z.array(z.number().int()),
  results_paragraphs_covered: z.array(z.number().int()),
  claims: z.array(
    z.object({
      id: z.string(),
      quote: z.string(),
      sentence: z.string(),
      paragraph: z.number().int(),
      claim_kind: z.enum(["mechanism_or_theory", "causal", "generalisation", "interpretive", "other"]),
    }),
  ),
  evidence: z.array(
    z.object({
      id: z.string(),
      quote: z.string(),
      sentence: z.string(),
      paragraph: z.number().int(),
      evidence_kind: z.enum(["statistical_result", "group_comparison", "association", "descriptive", "qualitative", "other"]),
    }),
  ),
  links: z.array(z.object({ claim_id: z.string(), evidence_id: z.string() })),
});
export type Locate = z.infer<typeof LocateSchema>;

export const LINK_STATUSES = ["linked", "no_relevant_evidence_located"] as const;
export const ASSESSMENTS = ["supported_as_stated", "goes_beyond_evidence", "conflicts_with_evidence", "cannot_assess"] as const;

// Pass 2 (Relate): per claim, which located evidence bears on it and a preliminary, qualified assessment.
// Explanations come before the assessment so the model states what the evidence shows first.
export const RelateSchema = z.object({
  claims: z.array(
    z.object({
      claim_id: z.string(),
      evidence_links: z.array(
        z.object({
          evidence_id: z.string(),
          relevance: z.enum(["direct", "partial"]),
          role: z.string(),
        }),
      ),
      link_status: z.enum(LINK_STATUSES),
      relationship_explanation: z.string(),
      gap_explanation: z.string(),
      missing_information: z.string(),
      context_fields_used: z.array(z.enum(CONTEXT_FIELDS)),
      uncertainty_note: z.string(),
      assessment: z.enum(ASSESSMENTS),
    }),
  ),
  all_claims_considered: z.boolean(),
});
export type Relate = z.infer<typeof RelateSchema>;
