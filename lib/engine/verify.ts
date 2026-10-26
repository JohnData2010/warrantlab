import type { Paragraph } from "../text/paragraphs";
import { locateQuote } from "../text/spans";
import type { IncompleteReason, Span } from "../types";
import { type Assessment, type Extraction, ExtractionSchema, JudgementSchema } from "./schemas";

export type VerifyFailure = { ok: false; reason: IncompleteReason; detail: string };

export interface VerifiedExtraction {
  ok: true;
  extraction: Extraction;
  claimSpans: Map<string, Span | null>;
}

export interface VerifiedAssessment extends Assessment {
  claimQuote: string;
  claimSpan: Span | null;
  evidenceSpans: Span[];
}

export interface VerifiedJudgement {
  ok: true;
  assessments: VerifiedAssessment[];
}

const OVERCLAIM_TEXT_FIELDS = [
  "evidence_identified",
  "claim_summary",
  "what_claim_assumes",
  "missing_warrant",
  "why_it_matters",
  "evidence_still_needed",
] as const;

export function verifyExtraction(original: string, paragraphs: Paragraph[], raw: unknown): VerifiedExtraction | VerifyFailure {
  const parsed = ExtractionSchema.safeParse(raw);
  if (!parsed.success) return { ok: false, reason: "invalid_output", detail: "extraction failed schema validation" };
  const extraction = parsed.data;

  const covered = new Set(extraction.paragraphs_covered);
  const missing = paragraphs.filter((p) => !covered.has(p.number)).map((p) => p.number);
  if (missing.length > 0) return { ok: false, reason: "coverage", detail: `paragraphs not covered: ${missing.join(", ")}` };

  for (const evidence of extraction.evidence) {
    if (locateQuote(original, evidence.quote, evidence.sentence).status === "not_found") {
      return { ok: false, reason: "fabricated_span", detail: `evidence ${evidence.id} not found in text` };
    }
  }

  const claimSpans = new Map<string, Span | null>();
  for (const claim of extraction.claims) {
    claimSpans.set(claim.id, locateQuote(original, claim.quote, claim.sentence).span);
  }
  return { ok: true, extraction, claimSpans };
}

export function verifyJudgement(original: string, verified: VerifiedExtraction, raw: unknown): VerifiedJudgement | VerifyFailure {
  const parsed = JudgementSchema.safeParse(raw);
  if (!parsed.success) return { ok: false, reason: "invalid_output", detail: "judgement failed schema validation" };
  const judgement = parsed.data;
  if (!judgement.all_claims_considered) return { ok: false, reason: "coverage", detail: "judge did not consider all claims" };

  const claimsById = new Map(verified.extraction.claims.map((c) => [c.id, c]));
  const assessedIds = new Set<string>();
  const assessments: VerifiedAssessment[] = [];

  for (const a of judgement.assessments) {
    const hasId = a.claim_id !== null && a.claim_id !== "";
    const hasNew = a.new_quote !== null && a.new_quote.trim() !== "";
    if (hasId === hasNew) return { ok: false, reason: "invalid_output", detail: "assessment must reference exactly one claim" };

    let claimQuote: string;
    let claimSpan: Span | null;
    if (hasId) {
      const claim = claimsById.get(a.claim_id as string);
      if (!claim) return { ok: false, reason: "invalid_output", detail: `unknown claim id ${a.claim_id}` };
      if (assessedIds.has(claim.id)) continue;
      assessedIds.add(claim.id);
      claimQuote = claim.quote;
      claimSpan = verified.claimSpans.get(claim.id) ?? null;
    } else {
      const located = locateQuote(original, a.new_quote as string, a.new_sentence ?? undefined);
      if (located.status === "not_found") return { ok: false, reason: "fabricated_span", detail: "new claim quote not found in text" };
      claimQuote = a.new_quote as string;
      claimSpan = located.span;
    }

    const evidenceSpans: Span[] = [];
    for (const quote of a.evidence_quotes) {
      const located = locateQuote(original, quote);
      if (located.status === "not_found") return { ok: false, reason: "fabricated_span", detail: "judge evidence quote not found in text" };
      if (located.span) evidenceSpans.push(located.span);
    }

    if (a.verdict === "overclaim") {
      if (!a.category) return { ok: false, reason: "invalid_output", detail: "overclaim without category" };
      if (OVERCLAIM_TEXT_FIELDS.some((f) => a[f].trim() === "")) {
        return { ok: false, reason: "invalid_output", detail: "overclaim with empty explanation field" };
      }
    }
    assessments.push({ ...a, claimQuote, claimSpan, evidenceSpans });
  }

  const unassessed = [...claimsById.keys()].filter((id) => !assessedIds.has(id));
  if (unassessed.length > 0) return { ok: false, reason: "coverage", detail: `claims not assessed: ${unassessed.join(", ")}` };
  return { ok: true, assessments };
}
