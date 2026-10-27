import type { LlmResult, GenerateStructured } from "../../engine/llm";
import { toModelJsonSchema } from "../../engine/llm";
import type { Paragraph } from "../../text/paragraphs";
import { type WorkspaceInput, filledContextFields } from "../contract";
import { LOCATE_SYSTEM, RELATE_SYSTEM, locateUser, relateUser } from "./prompts";
import { LocateSchema, RelateSchema } from "./schemas";
import type { TraceClaim, TraceResponse } from "./types";
import { type TraceVerifyFailure, type VerifiedLocate, type VerifiedRelate, sourceText, verifiedEvidence, verifyLocate, verifyRelate } from "./verify";

export interface TraceDeps {
  generate: GenerateStructured;
  locateModel: string;
  relateModel: string;
  relateRetryOnServerError?: boolean;
}

export interface TraceMeta {
  stage: "locate" | "relate" | "done";
  calls: { stage: "locate" | "relate"; model: string; ok: boolean; latencyMs: number; attempts: number; reason?: string }[];
  failureDetail?: string;
}

const LOCATE_JSON_SCHEMA = toModelJsonSchema(LocateSchema);
const RELATE_JSON_SCHEMA = toModelJsonSchema(RelateSchema);

function mark(text: string, paragraphs: Paragraph[], prefix: "D" | "R"): string {
  if (paragraphs.length === 0) return "(none supplied)";
  return paragraphs.map((p) => `[${prefix}${p.number}] ${text.slice(p.start, p.end)}`).join("\n\n");
}

// Calls the model and verifies; retries once only when verification found a fabricated or misplaced quote.
async function runStage<T extends { ok: true }>(
  stage: "locate" | "relate",
  call: () => Promise<LlmResult>,
  verify: (json: unknown) => T | TraceVerifyFailure,
  meta: TraceMeta,
): Promise<T | TraceVerifyFailure> {
  for (let attempt = 0; attempt < 2; attempt++) {
    const result = await call();
    meta.calls.push({ stage, model: result.model, ok: result.ok, latencyMs: result.latencyMs, attempts: result.attempts ?? 1, reason: result.ok ? undefined : result.reason });
    if (!result.ok) return { ok: false, reason: result.reason, detail: result.detail ?? result.reason };
    const verified = verify(result.json);
    if (verified.ok || verified.reason !== "fabricated_span" || attempt === 1) return verified;
  }
  return { ok: false, reason: "model_error", detail: "unreachable" };
}

function inTextOrder(claims: TraceClaim[]): TraceClaim[] {
  const position = (c: TraceClaim) => (c.location.status === "ambiguous" ? Number.MAX_SAFE_INTEGER : c.location.start);
  return [...claims].sort((a, b) => position(a) - position(b));
}

// V0.2 Slice B: Discussion is the target of assessment; Results is a separate evidence source; Study Context is
// user-reported method information. Nothing is concatenated: each quotation is verified against its own source.
export async function analyseTrace(input: WorkspaceInput, deps: TraceDeps): Promise<{ response: TraceResponse; meta: TraceMeta }> {
  const meta: TraceMeta = { stage: "locate", calls: [] };
  const discussion = sourceText("discussion", input.discussion);
  const results = sourceText("results", input.results);
  const discussionMarked = mark(discussion.text, discussion.paragraphs, "D");
  const resultsMarked = mark(results.text, results.paragraphs, "R");
  const contextSupplied = filledContextFields(input.context);
  const resultsSupplied = results.paragraphs.length > 0;

  const located = await runStage<VerifiedLocate>(
    "locate",
    () =>
      deps.generate({
        model: deps.locateModel,
        system: LOCATE_SYSTEM,
        user: locateUser(discussionMarked, resultsMarked),
        jsonSchema: LOCATE_JSON_SCHEMA,
        thinkingLevel: "low",
        timeoutMs: 45_000,
        retryOnTimeout: true,
        maxAttempts: 3,
      }),
    (json) => verifyLocate(discussion, results, json),
    meta,
  );
  if (!located.ok) {
    meta.failureDetail = located.detail;
    return { response: { status: "incomplete", version: 2, reason: located.reason }, meta };
  }

  // Without Results there is nothing to relate claims to: report each claim as unassessable without a second call.
  if (!resultsSupplied || located.located.claims.length === 0) {
    meta.stage = "done";
    const claims: TraceClaim[] = located.located.claims.map((c) => ({
      id: c.id,
      quote: c.quote,
      kind: c.claim_kind,
      location: located.claims.get(c.id)!,
      linkStatus: resultsSupplied ? "no_relevant_evidence_located" : "results_not_supplied",
      links: [],
      assessment: "cannot_assess",
      relationshipExplanation: "No Results text was supplied, so no evidence could be located for this claim.",
      gapExplanation: "",
      missingInformation: "The Results that this claim draws on.",
      contextFieldsUsed: [],
      uncertaintyNote: "Supplying the relevant Results would allow the claim to be checked.",
    }));
    return {
      response: { status: "complete", version: 2, claims: inTextOrder(claims), evidence: verifiedEvidence(located), resultsSupplied, contextSupplied },
      meta,
    };
  }

  meta.stage = "relate";
  const related = await runStage<VerifiedRelate>(
    "relate",
    () =>
      deps.generate({
        model: deps.relateModel,
        system: RELATE_SYSTEM,
        user: relateUser(discussionMarked, resultsMarked, located.located, input.context),
        jsonSchema: RELATE_JSON_SCHEMA,
        retryOnServerError: deps.relateRetryOnServerError ?? true,
        maxAttempts: deps.relateRetryOnServerError === false ? 1 : 3,
      }),
    (json) => verifyRelate(located, json, input),
    meta,
  );
  if (!related.ok) {
    meta.failureDetail = related.detail;
    return { response: { status: "incomplete", version: 2, reason: related.reason }, meta };
  }

  meta.stage = "done";
  return {
    response: { status: "complete", version: 2, claims: inTextOrder(related.claims), evidence: related.evidence, resultsSupplied, contextSupplied },
    meta,
  };
}
