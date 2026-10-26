import { z } from "zod";

export const ClaimKind = z.enum(["theoretical", "causal", "interpretive", "other"]);
export const EvidenceKind = z.enum([
  "statistical_result",
  "group_comparison",
  "association",
  "qualitative",
  "citation",
  "methodological",
  "other",
]);

export const ExtractionSchema = z.object({
  paragraphs_covered: z.array(z.number().int()),
  claims: z.array(
    z.object({
      id: z.string(),
      quote: z.string(),
      sentence: z.string(),
      paragraph: z.number().int(),
      claim_kind: ClaimKind,
      evidence_ids: z.array(z.string()),
      unresolved_reference: z.boolean(),
    }),
  ),
  evidence: z.array(
    z.object({
      id: z.string(),
      quote: z.string(),
      sentence: z.string(),
      paragraph: z.number().int(),
      evidence_kind: EvidenceKind,
    }),
  ),
});
export type Extraction = z.infer<typeof ExtractionSchema>;

// Reasoning fields come before the verdict so the model states the evidence and the inferential step first.
export const AssessmentSchema = z.object({
  claim_id: z.string().nullable(),
  new_quote: z.string().nullable(),
  new_sentence: z.string().nullable(),
  evidence_quotes: z.array(z.string()),
  evidence_identified: z.string(),
  claim_summary: z.string(),
  what_claim_assumes: z.string(),
  missing_warrant: z.string(),
  verdict: z.enum(["overclaim", "calibrated", "cannot_assess", "out_of_scope"]),
  category: z.enum(["theoretical_overclaim", "causal_overclaim"]).nullable(),
  why_it_matters: z.string(),
  evidence_still_needed: z.string(),
  questions_to_examine: z.array(z.string()),
  needs_other_section: z.boolean(),
  basis_clarity: z.number().int().min(1).max(3),
});
export type Assessment = z.infer<typeof AssessmentSchema>;

export const JudgementSchema = z.object({
  assessments: z.array(AssessmentSchema),
  all_claims_considered: z.boolean(),
});
export type Judgement = z.infer<typeof JudgementSchema>;
