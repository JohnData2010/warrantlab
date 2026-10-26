import { z } from "zod";

export type LlmFailure = "quota" | "blocked" | "truncated" | "model_error" | "timeout" | "invalid_output";

export type LlmResult =
  | { ok: true; json: unknown; model: string; latencyMs: number }
  | { ok: false; reason: LlmFailure; model: string; latencyMs: number; detail?: string };

export interface StructuredRequest {
  model: string;
  system: string;
  user: string;
  jsonSchema: Record<string, unknown>;
  maxOutputTokens?: number;
  timeoutMs?: number;
}

export type GenerateStructured = (request: StructuredRequest) => Promise<LlmResult>;

// Gemini's responseJsonSchema accepts a JSON Schema subset; the $schema keyword is not in it.
export function toModelJsonSchema(schema: z.ZodType): Record<string, unknown> {
  const { $schema: _ignored, ...rest } = z.toJSONSchema(schema, { target: "draft-2020-12" }) as Record<string, unknown>;
  return rest;
}
