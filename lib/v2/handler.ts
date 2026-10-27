import type { WarrantLabConfig } from "../config";
import type { GenerateStructured } from "../engine/llm";
import { WorkspaceRequestSchema, filledContextFields, workspaceProblem, workspaceWordCounts } from "./contract";
import { type TraceMeta, analyseTrace } from "./trace/analyseTrace";
import type { TraceResponse } from "./trace/types";

export interface HandlerDeps {
  config: Pick<WarrantLabConfig, "maxWords" | "researchPreview" | "extractModel" | "judgeModel" | "judgeRetryOnServerError">;
  generate: GenerateStructured;
}

export type HandlerResult =
  | { httpStatus: 400 | 404; body: { error: string }; log: Record<string, unknown> }
  | { httpStatus: 200; body: TraceResponse; log: Record<string, unknown> };

// Kept separate from the route so it can be integration-tested with a scripted model.
export async function handleWorkspaceRequest(raw: unknown, deps: HandlerDeps): Promise<HandlerResult> {
  if (!deps.config.researchPreview) return { httpStatus: 404, body: { error: "The Research Preview is not enabled." }, log: { rejected: "disabled" } };

  const parsed = WorkspaceRequestSchema.safeParse(raw);
  if (!parsed.success) return { httpStatus: 400, body: { error: "Invalid request." }, log: { rejected: "schema" } };
  const input = parsed.data;

  const problem = workspaceProblem(input, deps.config.maxWords);
  const words = workspaceWordCounts(input);
  if (problem) return { httpStatus: 400, body: { error: problem }, log: { rejected: "input", words } };

  // The v2 passes reuse the configured v0.1 models: Locate on the Extract model, Relate on the Judge model.
  const { response, meta } = await analyseTrace(input, {
    generate: deps.generate,
    locateModel: deps.config.extractModel,
    relateModel: deps.config.judgeModel,
    relateRetryOnServerError: deps.config.judgeRetryOnServerError,
  });

  return { httpStatus: 200, body: response, log: metadataLog(words, filledContextFields(input.context), response, meta) };
}

// Metadata only: never manuscript text, context text, quotes, explanations or failure details that could echo text.
function metadataLog(words: ReturnType<typeof workspaceWordCounts>, contextFields: string[], response: TraceResponse, meta: TraceMeta) {
  const summary =
    response.status === "complete"
      ? {
          claims: response.claims.length,
          evidence: response.evidence.length,
          linked: response.claims.filter((c) => c.linkStatus === "linked").length,
          assessments: response.claims.map((c) => c.assessment),
        }
      : { reason: response.reason };
  return {
    version: 2,
    words,
    contextFields,
    status: response.status,
    ...summary,
    stage: meta.stage,
    calls: meta.calls.map((c) => `${c.stage}:${c.model}:${c.ok ? "ok" : c.reason}:${c.attempts}x:${c.latencyMs}ms`),
  };
}
