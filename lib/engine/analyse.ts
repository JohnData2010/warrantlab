import { getSection } from "../sections";
import { markParagraphs, splitParagraphs } from "../text/paragraphs";
import type { AnalysisResponse, SectionId } from "../types";
import { aggregate } from "./aggregate";
import { type GenerateStructured, type LlmResult, toModelJsonSchema } from "./llm";
import { EXTRACT_SYSTEM, JUDGE_SYSTEM, extractUser, judgeUser } from "./prompts";
import { ExtractionSchema, JudgementSchema } from "./schemas";
import { type VerifiedExtraction, type VerifiedJudgement, type VerifyFailure, verifyExtraction, verifyJudgement } from "./verify";

export interface AnalyseDeps {
  generate: GenerateStructured;
  extractModel: string;
  judgeModel: string;
  causalEnabled: boolean;
}

export interface AnalyseMeta {
  stage: "extract" | "judge" | "aggregate";
  calls: { stage: "extract" | "judge"; model: string; ok: boolean; latencyMs: number; attempts: number; reason?: string }[];
  failureDetail?: string;
}

const EXTRACTION_JSON_SCHEMA = toModelJsonSchema(ExtractionSchema);
const JUDGEMENT_JSON_SCHEMA = toModelJsonSchema(JudgementSchema);

// Calls the model, verifies, and retries once only when verification found a fabricated quote.
async function runStage<T extends { ok: true }>(
  stage: "extract" | "judge",
  call: () => Promise<LlmResult>,
  verify: (json: unknown) => T | VerifyFailure,
  meta: AnalyseMeta,
): Promise<T | VerifyFailure> {
  for (let attempt = 0; attempt < 2; attempt++) {
    const result = await call();
    meta.calls.push({ stage, model: result.model, ok: result.ok, latencyMs: result.latencyMs, attempts: result.attempts ?? 1, reason: result.ok ? undefined : result.reason });
    if (!result.ok) return { ok: false, reason: result.reason, detail: result.detail ?? result.reason };
    const verified = verify(result.json);
    if (verified.ok || verified.reason !== "fabricated_span" || attempt === 1) return verified;
  }
  return { ok: false, reason: "model_error", detail: "unreachable" };
}

export async function analyse(
  input: { text: string; section: SectionId },
  deps: AnalyseDeps,
): Promise<{ response: AnalysisResponse; meta: AnalyseMeta }> {
  const meta: AnalyseMeta = { stage: "extract", calls: [] };
  const section = getSection(input.section);
  const paragraphs = splitParagraphs(input.text);
  const marked = markParagraphs(input.text, paragraphs);

  const extraction = await runStage<VerifiedExtraction>(
    "extract",
    () =>
      deps.generate({
        model: deps.extractModel,
        system: EXTRACT_SYSTEM,
        user: extractUser(section.label, section.guidance, marked),
        jsonSchema: EXTRACTION_JSON_SCHEMA,
        thinkingLevel: "low",
        // Extract normally answers in 2–8 s but occasionally stalls; its quota is plentiful, so fail fast and retry once.
        timeoutMs: 30_000,
        retryOnTimeout: true,
      }),
    (json) => verifyExtraction(input.text, paragraphs, json),
    meta,
  );
  if (!extraction.ok) {
    meta.failureDetail = extraction.detail;
    return { response: { status: "incomplete", reason: extraction.reason }, meta };
  }

  meta.stage = "judge";
  const unlocated = [...extraction.claimSpans.entries()].filter(([, span]) => span === null).map(([id]) => id);
  const judgement = await runStage<VerifiedJudgement>(
    "judge",
    () =>
      deps.generate({
        model: deps.judgeModel,
        system: JUDGE_SYSTEM,
        user: judgeUser(section.label, section.guidance, marked, extraction.extraction, unlocated),
        jsonSchema: JUDGEMENT_JSON_SCHEMA,
      }),
    (json) => verifyJudgement(input.text, extraction, json),
    meta,
  );
  if (!judgement.ok) {
    meta.failureDetail = judgement.detail;
    return { response: { status: "incomplete", reason: judgement.reason }, meta };
  }

  meta.stage = "aggregate";
  return { response: aggregate(judgement.assessments, { causalEnabled: deps.causalEnabled }), meta };
}
