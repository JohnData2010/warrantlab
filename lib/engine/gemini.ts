import { ApiError, FinishReason, GoogleGenAI } from "@google/genai";
import type { GenerateStructured, LlmFailure, StructuredRequest } from "./llm";

const DEFAULT_TIMEOUT_MS = 90_000;
const DEFAULT_MAX_OUTPUT_TOKENS = 16_000;
const SEED = 7;

export function classifyFinish(finishReason: string | undefined, blockReason: string | undefined): LlmFailure | null {
  if (blockReason) return "blocked";
  if (!finishReason || finishReason === FinishReason.STOP) return null;
  if (finishReason === FinishReason.MAX_TOKENS) return "truncated";
  return "blocked";
}

export function classifyError(error: unknown): { reason: LlmFailure; retryable: boolean } {
  if (error instanceof ApiError) {
    if (error.status === 429) return { reason: "quota", retryable: false };
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
          },
        });
        const failure = classifyFinish(response.candidates?.[0]?.finishReason, response.promptFeedback?.blockReason);
        if (failure) {
          return { ok: false, reason: failure, model: request.model, latencyMs: elapsed(), detail: `finish=${response.candidates?.[0]?.finishReason ?? "none"}` };
        }
        const text = response.text;
        if (!text) return { ok: false, reason: "invalid_output", model: request.model, latencyMs: elapsed(), detail: "empty response" };
        try {
          return { ok: true, json: JSON.parse(text), model: request.model, latencyMs: elapsed() };
        } catch {
          return { ok: false, reason: "invalid_output", model: request.model, latencyMs: elapsed(), detail: "response was not valid JSON" };
        }
      } catch (error) {
        const { reason, retryable } = classifyError(error);
        if (retryable && attempt === 0) continue;
        const detail = error instanceof ApiError ? `status=${error.status}` : error instanceof Error ? error.name : "unknown";
        return { ok: false, reason, model: request.model, latencyMs: elapsed(), detail };
      }
    }
    return { ok: false, reason: "model_error", model: request.model, latencyMs: elapsed() };
  };
}
