import { ApiError, FinishReason } from "@google/genai";
import { describe, expect, it } from "vitest";
import { z } from "zod";
import { classifyError, classifyFinish, createGeminiGenerator } from "../lib/engine/gemini";
import { toModelJsonSchema } from "../lib/engine/llm";

describe("classifyFinish", () => {
  it("treats a normal stop as success", () => {
    expect(classifyFinish(FinishReason.STOP, undefined)).toBeNull();
  });
  it("maps max tokens to truncated", () => {
    expect(classifyFinish(FinishReason.MAX_TOKENS, undefined)).toBe("truncated");
  });
  it("maps safety and other stops to blocked", () => {
    expect(classifyFinish(FinishReason.SAFETY, undefined)).toBe("blocked");
    expect(classifyFinish(FinishReason.OTHER, undefined)).toBe("blocked");
  });
  it("maps a blocked prompt to blocked", () => {
    expect(classifyFinish(undefined, "SAFETY")).toBe("blocked");
  });
});

describe("classifyError", () => {
  it("maps a daily 429 to quota without retry", () => {
    const daily = new ApiError({ message: '{"quotaId":"GenerateRequestsPerDayPerProjectPerModel-FreeTier"}', status: 429 });
    expect(classifyError(daily)).toEqual({ reason: "quota", retryable: false });
    expect(classifyError(new ApiError({ message: "quota", status: 429 }))).toEqual({ reason: "quota", retryable: false });
  });
  it("maps a per-minute 429 to rate_limited without retry", () => {
    const perMinute = new ApiError({ message: '{"quotaId":"GenerateRequestsPerMinutePerProjectPerModel-FreeTier"}', status: 429 });
    expect(classifyError(perMinute)).toEqual({ reason: "rate_limited", retryable: false });
  });
  it("retries server errors once", () => {
    expect(classifyError(new ApiError({ message: "unavailable", status: 503 }))).toEqual({ reason: "model_error", retryable: true });
  });
  it("does not retry client errors", () => {
    expect(classifyError(new ApiError({ message: "bad", status: 400 }))).toEqual({ reason: "model_error", retryable: false });
  });
  it("maps aborts to timeout", () => {
    const abort = new Error("aborted");
    abort.name = "AbortError";
    expect(classifyError(abort).reason).toBe("timeout");
  });
});

describe("createGeminiGenerator", () => {
  it("fails cleanly without an API key and without calling the network", async () => {
    const result = await createGeminiGenerator(undefined)({ model: "m", system: "s", user: "u", jsonSchema: {} });
    expect(result).toMatchObject({ ok: false, reason: "model_error" });
  });
});

describe("toModelJsonSchema", () => {
  it("drops $schema and keeps properties", () => {
    const schema = toModelJsonSchema(z.object({ a: z.string(), b: z.number().nullable() }));
    expect(schema.$schema).toBeUndefined();
    expect(schema.type).toBe("object");
    expect(Object.keys(schema.properties as object)).toEqual(["a", "b"]);
  });
});
