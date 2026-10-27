import type { WarrantLabConfig } from "../config";
import type { AnalyseMeta } from "../engine/analyse";
import type { GenerateStructured } from "../engine/llm";
import { CONTEXT_FIELDS, WorkspaceRequestSchema, filledContextFields, workspaceProblem, workspaceWordCounts } from "./contract";
import { analyseWorkspace } from "./analyseWorkspace";
import type { WorkspaceResponse } from "./types";

export interface HandlerDeps {
  config: Pick<WarrantLabConfig, "maxWords" | "researchPreview" | "extractModel" | "judgeModel" | "causalEnabled" | "judgeRetryOnServerError">;
  generate: GenerateStructured;
}

export type HandlerResult =
  | { httpStatus: 400 | 404; body: { error: string }; log: Record<string, unknown> }
  | { httpStatus: 200; body: WorkspaceResponse; log: Record<string, unknown> };

// Kept separate from the route so it can be integration-tested with a scripted model.
export async function handleWorkspaceRequest(raw: unknown, deps: HandlerDeps): Promise<HandlerResult> {
  if (!deps.config.researchPreview) return { httpStatus: 404, body: { error: "The Research Preview is not enabled." }, log: { rejected: "disabled" } };

  const parsed = WorkspaceRequestSchema.safeParse(raw);
  if (!parsed.success) return { httpStatus: 400, body: { error: "Invalid request." }, log: { rejected: "schema" } };
  const input = parsed.data;

  const problem = workspaceProblem(input, deps.config.maxWords);
  const words = workspaceWordCounts(input);
  if (problem) return { httpStatus: 400, body: { error: problem }, log: { rejected: "input", words } };

  const { response, meta } = await analyseWorkspace(input, {
    generate: deps.generate,
    extractModel: deps.config.extractModel,
    judgeModel: deps.config.judgeModel,
    causalEnabled: deps.config.causalEnabled,
    judgeRetryOnServerError: deps.config.judgeRetryOnServerError,
  });

  return { httpStatus: 200, body: response, log: metadataLog(words, filledContextFields(input.context), response, meta) };
}

// Metadata only: never manuscript text, context text, quotes or diagnostics.
function metadataLog(
  words: ReturnType<typeof workspaceWordCounts>,
  contextFields: string[],
  response: WorkspaceResponse,
  meta: AnalyseMeta,
): Record<string, unknown> {
  return {
    version: 2,
    words,
    contextFields: CONTEXT_FIELDS.filter((f) => contextFields.includes(f)),
    status: response.status,
    result: response.status === "complete" ? response.discussion.outcome : response.reason,
    stage: meta.stage,
    calls: meta.calls.map((c) => `${c.stage}:${c.model}:${c.ok ? "ok" : c.reason}:${c.latencyMs}ms`),
  };
}
