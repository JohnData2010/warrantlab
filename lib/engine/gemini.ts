import { ApiError, FinishReason, GoogleGenAI, ThinkingLevel } from "@google/genai";
import type { GenerateStructured, LlmFailure, StructuredRequest } from "./llm";

const DEFAULT_TIMEOUT_MS = 90_000;
// Gemini 3 thinking tokens count against this limit; 16k truncated a three-paragraph judgement.
const DEFAULT_MAX_OUTPUT_TOKENS = 32_768;
const SEED = 7;
const THINKING_LEVEL = { minimal: ThinkingLevel.MINIMAL, low: ThinkingLevel.LOW, medium: ThinkingLevel.MEDIUM, high: ThinkingLevel.HIGH } as const;

export function classifyFinish(finishReason: string | undefined, blockReason: string | undefined): LlmFailure | null {
  if (blockReason) return "blocked";
  if (!finishReason || finishReason === FinishReason.STOP) return null;
  if (finishReason === FinishReason.MAX_TOKENS) return "truncated";
  return "blocked";
}

export function classifyError(error: unknown): { reason: LlmFailure; retryable: boolean } {
  if (error instanceof ApiError) {
    if (error.status === 429) {
      const perMinute = /PerMinute/i.test(error.message) && !/PerDay/i.test(error.message);
      return { reason: perMinute ? "rate_limited" : "quota", retryable: false };
    }
    if (error.status >= 500) return { reason: "model_error", retryable: true };
    return { reason: "model_error", retryable: false };
  }
  const name = error instanceof Error ? error.name : "";
  const message = error instanceof Error ? error.message.toLowerCase() : "";
  if (name === "AbortError" || name === "TimeoutError" || message.includes("timed out") || message.includes("timeout")) {
    return { reason: "timeout", retryable: false };
  }
  return { reason: "model_error", retryable: true };
}

export function createGeminiGenerator(apiKey: string | undefined): GenerateStructured {
  return async function generateStructured(request: StructuredRequest) {
    const started = Date.now();
    const elapsed = () => Date.now() - started;
    if (!apiKey) {
      return { ok: false, reason: "model_error", model: request.model, latencyMs: 0, detail: "GEMINI_API_KEY is not set" };
    }
    const client = new GoogleGenAI({ apiKey, httpOptions: { timeout: request.timeoutMs ?? DEFAULT_TIMEOUT_MS } });

    for (let attempt = 0; attempt < 2; attempt++) {
      try {
        const response = await client.models.generateContent({
          model: request.model,
          contents: [{ role: "user", parts: [{ text: request.user }] }],
          config: {
            systemInstruction: request.system,
            temperature: 0,
            seed: SEED,
            maxOutputTokens: request.maxOutputTokens ?? DEFAULT_MAX_OUTPUT_TOKENS,
            responseMimeType: "application/json",
            responseJsonSchema: request.jsonSchema,
            ...(request.thinkingLevel ? { thinkingConfig: { thinkingLevel: THINKING_LEVEL[request.thinkingLevel] } } : {}),
          },
        });
        const failure = classifyFinish(response.candidates?.[0]?.finishReason, response.promptFeedback?.blockReason);
        if (failure) {
          return { ok: false, reason: failure, model: request.model, latencyMs: elapsed(), attempts: attempt + 1, detail: `finish=${response.candidates?.[0]?.finishReason ?? "none"}` };
        }
        const text = response.text;
        if (!text) return { ok: false, reason: "invalid_output", model: request.model, latencyMs: elapsed(), attempts: attempt + 1, detail: "empty response" };
        try {
          return { ok: true, json: JSON.parse(text), model: request.model, latencyMs: elapsed(), attempts: attempt + 1 };
        } catch {
          return { ok: false, reason: "invalid_output", model: request.model, latencyMs: elapsed(), attempts: attempt + 1, detail: "response was not valid JSON" };
        }
      } catch (error) {
        const { reason, retryable } = classifyError(error);
        if (((retryable && request.retryOnServerError !== false) || (reason === "timeout" && request.retryOnTimeout)) && attempt === 0) continue;
        const detail = error instanceof ApiError ? `status=${error.status}` : error instanceof Error ? error.name : "unknown";
        return { ok: false, reason, model: request.model, latencyMs: elapsed(), attempts: attempt + 1, detail };
      }
    }
    return { ok: false, reason: "model_error", model: request.model, latencyMs: elapsed(), attempts: 2 };
  };
}
