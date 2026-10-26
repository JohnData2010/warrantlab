import { z } from "zod";

// "quota" = daily request limit reached; "rate_limited" = per-minute limit reached. Neither is retried automatically.
export type LlmFailure = "quota" | "rate_limited" | "blocked" | "truncated" | "model_error" | "timeout" | "invalid_output";

export type LlmResult =
  | { ok: true; json: unknown; model: string; latencyMs: number; attempts?: number }
  | { ok: false; reason: LlmFailure; model: string; latencyMs: number; detail?: string; attempts?: number };

export interface StructuredRequest {
  model: string;
  system: string;
  user: string;
  jsonSchema: Record<string, unknown>;
  maxOutputTokens?: number;
  timeoutMs?: number;
  thinkingLevel?: "minimal" | "low" | "medium" | "high";
  // Only for calls whose quota is plentiful: a timed-out attempt is retried once.
  retryOnServerError?: boolean;
  retryOnTimeout?: boolean;
}

export type GenerateStructured = (request: StructuredRequest) => Promise<LlmResult>;

// Gemini's responseJsonSchema accepts a JSON Schema subset; the $schema keyword is not in it.
export function toModelJsonSchema(schema: z.ZodType): Record<string, unknown> {
  const { $schema: _ignored, ...rest } = z.toJSONSchema(schema, { target: "draft-2020-12" }) as Record<string, unknown>;
  return rest;
}
