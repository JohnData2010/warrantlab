import { type Paragraph, splitParagraphs } from "../../text/paragraphs";
import { locateQuote } from "../../text/spans";
import type { IncompleteReason } from "../../types";
import { type ContextField, type WorkspaceInput, filledContextFields } from "../contract";
import { type Locate, LocateSchema, type Relate, RelateSchema } from "./schemas";
import type { QuoteSource, SourceLocation, TraceClaim, TraceEvidence, TraceLink } from "./types";

export type TraceVerifyFailure = { ok: false; reason: IncompleteReason; detail: string };

export interface SourceText {
  id: QuoteSource;
  text: string;
  paragraphs: Paragraph[];
}

export function sourceText(id: QuoteSource, text: string): SourceText {
  return { id, text, paragraphs: splitParagraphs(text) };
}

type LocateOutcome = SourceLocation | { fail: "not_found" | "cross_source" | "bad_paragraph" };

// Locates a quotation in its declared source only. Offsets always refer to that source's original text.
// A repeated quotation is resolved by its sentence, then by its declared paragraph; otherwise it stays ambiguous
// rather than being assigned to an arbitrary occurrence.
export function locateInSource(source: SourceText, other: SourceText, quote: string, sentence: string, paragraph: number): LocateOutcome {
  const declared = source.paragraphs[paragraph - 1];
  if (!declared) return { fail: "bad_paragraph" };

  const whole = locateQuote(source.text, quote, sentence);
  if (whole.status === "not_found") {
    return locateQuote(other.text, quote, sentence).status === "not_found" ? { fail: "not_found" } : { fail: "cross_source" };
  }
  if (whole.span) return { status: whole.status === "exact" ? "exact" : "tolerant", sourceId: source.id, ...whole.span };

  const within = locateQuote(source.text.slice(declared.start, declared.end), quote, sentence);
  if (within.span) {
    return {
      status: within.status === "exact" ? "exact" : "tolerant",
      sourceId: source.id,
      start: declared.start + within.span.start,
      end: declared.start + within.span.end,
    };
  }
  return { status: "ambiguous", sourceId: source.id };
}

export interface VerifiedLocate {
  ok: true;
  located: Locate;
  claims: Map<string, SourceLocation>;
  evidence: Map<string, SourceLocation>;
  links: { claim_id: string; evidence_id: string }[];
}

function coverageGap(paragraphs: Paragraph[], covered: number[]): number[] {
  const set = new Set(covered);
  return paragraphs.filter((p) => !set.has(p.number)).map((p) => p.number);
}

function hasDuplicates(ids: string[]): boolean {
  return new Set(ids).size !== ids.length;
}

export function verifyLocate(discussion: SourceText, results: SourceText, raw: unknown): VerifiedLocate | TraceVerifyFailure {
  const parsed = LocateSchema.safeParse(raw);
  if (!parsed.success) return { ok: false, reason: "invalid_output", detail: "locate output failed schema validation" };
  const located = parsed.data;

  const missingD = coverageGap(discussion.paragraphs, located.discussion_paragraphs_covered);
  const missingR = coverageGap(results.paragraphs, located.results_paragraphs_covered);
  if (missingD.length || missingR.length) {
    return { ok: false, reason: "coverage", detail: `not covered: D[${missingD.join(",")}] R[${missingR.join(",")}]` };
  }
  if (hasDuplicates(located.claims.map((c) => c.id)) || hasDuplicates(located.evidence.map((e) => e.id))) {
    return { ok: false, reason: "invalid_output", detail: "duplicate ids" };
  }

  const claims = new Map<string, SourceLocation>();
  for (const c of located.claims) {
    const result = locateInSource(discussion, results, c.quote, c.sentence, c.paragraph);
    if ("fail" in result) return failureFor(result.fail, `claim ${c.id}`);
    claims.set(c.id, result);
  }
  const evidence = new Map<string, SourceLocation>();
  for (const e of located.evidence) {
    const result = locateInSource(results, discussion, e.quote, e.sentence, e.paragraph);
    if ("fail" in result) return failureFor(result.fail, `evidence ${e.id}`);
    evidence.set(e.id, result);
  }

  const seen = new Set<string>();
  const links: VerifiedLocate["links"] = [];
  for (const link of located.links) {
    if (!claims.has(link.claim_id) || !evidence.has(link.evidence_id)) {
      return { ok: false, reason: "invalid_output", detail: `link references unknown id ${link.claim_id}->${link.evidence_id}` };
    }
    const key = `${link.claim_id}->${link.evidence_id}`;
    if (!seen.has(key)) {
      seen.add(key);
      links.push(link);
    }
  }
  // The stated reference and the links must agree: a claim building on a located finding must point to it,
  // and a claim whose findings are not in the supplied Results must not be given a stand-in link.
  for (const c of located.claims) {
    const linked = links.some((l) => l.claim_id === c.id);
    if (c.results_reference === "builds_on_located_result" && !linked) {
      return { ok: false, reason: "invalid_output", detail: `claim ${c.id} builds on a located result but has no link` };
    }
    if (c.results_reference === "refers_to_result_not_supplied" && linked) {
      return { ok: false, reason: "invalid_output", detail: `claim ${c.id} says its results are not supplied but is linked` };
    }
  }
  return { ok: true, located, claims, evidence, links };
}

function failureFor(fail: "not_found" | "cross_source" | "bad_paragraph", what: string): TraceVerifyFailure {
  if (fail === "bad_paragraph") return { ok: false, reason: "invalid_output", detail: `${what}: paragraph does not exist in its source` };
  if (fail === "cross_source") return { ok: false, reason: "fabricated_span", detail: `${what}: quote belongs to the other source` };
  return { ok: false, reason: "fabricated_span", detail: `${what}: quote not found in its source` };
}

export interface VerifiedRelate {
  ok: true;
  claims: TraceClaim[];
  evidence: TraceEvidence[];
}

export function verifiedEvidence(verified: VerifiedLocate): TraceEvidence[] {
  return verified.located.evidence.map((e) => ({ id: e.id, quote: e.quote, kind: e.evidence_kind, location: verified.evidence.get(e.id)! }));
}

export function verifyRelate(verified: VerifiedLocate, raw: unknown, input: WorkspaceInput): VerifiedRelate | TraceVerifyFailure {
  const parsed = RelateSchema.safeParse(raw);
  if (!parsed.success) return { ok: false, reason: "invalid_output", detail: "relate output failed schema validation" };
  const relate: Relate = parsed.data;
  if (!relate.all_claims_considered) return { ok: false, reason: "coverage", detail: "relate did not consider all claims" };

  const filled = new Set<ContextField>(filledContextFields(input.context));
  const byId = new Map(verified.located.claims.map((c) => [c.id, c]));
  const assessed = new Map<string, TraceClaim>();

  for (const r of relate.claims) {
    const claim = byId.get(r.claim_id);
    if (!claim) return { ok: false, reason: "invalid_output", detail: `unknown claim id ${r.claim_id}` };
    if (assessed.has(claim.id)) continue;

    const links: TraceLink[] = [];
    for (const l of r.evidence_links) {
      if (!verified.evidence.has(l.evidence_id)) return { ok: false, reason: "invalid_output", detail: `unknown evidence id ${l.evidence_id}` };
      if (!links.some((x) => x.evidenceId === l.evidence_id)) links.push({ evidenceId: l.evidence_id, relevance: l.relevance, role: l.role });
    }

    // Relevance is decided by Locate; Relate may add links but never drop one, so inadequate evidence cannot become "missing".
    const dropped = verified.links.filter((l) => l.claim_id === claim.id && !links.some((x) => x.evidenceId === l.evidence_id));
    if (dropped.length > 0) return { ok: false, reason: "invalid_output", detail: `${claim.id}: dropped located link(s) ${dropped.map((l) => l.evidence_id).join(",")}` };

    // Link status and assessment must agree: absence of located evidence can never ground a verdict.
    if (r.link_status === "linked" && links.length === 0) return { ok: false, reason: "invalid_output", detail: `${claim.id}: linked without evidence` };
    if (r.link_status === "no_relevant_evidence_located" && links.length > 0) return { ok: false, reason: "invalid_output", detail: `${claim.id}: unlinked with evidence` };
    if (r.link_status === "no_relevant_evidence_located" && r.assessment !== "cannot_assess") {
      return { ok: false, reason: "invalid_output", detail: `${claim.id}: verdict without located evidence` };
    }
    if (r.relationship_explanation.trim() === "") return { ok: false, reason: "invalid_output", detail: `${claim.id}: empty relationship explanation` };
    if (r.assessment === "goes_beyond_evidence" && r.gap_explanation.trim() === "") return { ok: false, reason: "invalid_output", detail: `${claim.id}: gap not named` };
    if (r.assessment === "cannot_assess" && r.missing_information.trim() === "") return { ok: false, reason: "invalid_output", detail: `${claim.id}: missing information not stated` };
    const unknownContext = r.context_fields_used.filter((f) => !filled.has(f));
    if (unknownContext.length > 0) return { ok: false, reason: "invalid_output", detail: `${claim.id}: cites context not supplied (${unknownContext.join(",")})` };

    assessed.set(claim.id, {
      id: claim.id,
      quote: claim.quote,
      kind: claim.claim_kind,
      location: verified.claims.get(claim.id)!,
      linkStatus: r.link_status,
      links,
      assessment: r.assessment,
      relationshipExplanation: r.relationship_explanation,
      gapExplanation: r.assessment === "goes_beyond_evidence" ? r.gap_explanation : "",
      missingInformation: r.assessment === "cannot_assess" ? r.missing_information : "",
      contextFieldsUsed: [...new Set(r.context_fields_used)],
      uncertaintyNote: r.uncertainty_note,
    });
  }

  const unassessed = [...byId.keys()].filter((id) => !assessed.has(id));
  if (unassessed.length > 0) return { ok: false, reason: "coverage", detail: `claims not assessed: ${unassessed.join(", ")}` };

  // Claims in Discussion order.
  const claims = verified.located.claims.map((c) => assessed.get(c.id)!);
  return { ok: true, claims, evidence: verifiedEvidence(verified) };
}
