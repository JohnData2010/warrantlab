import { describe, expect, it } from "vitest";
import type { GenerateStructured, LlmResult } from "../lib/engine/llm";
import {
  CONTEXT_FIELDS,
  CONTEXT_FIELD_MAX_CHARS,
  type WorkspaceInput,
  WorkspaceRequestSchema,
  emptyContext,
  isWorkspaceCurrent,
  workspaceProblem,
} from "../lib/v2/contract";
import { type HandlerDeps, handleWorkspaceRequest } from "../lib/v2/handler";
import { createRequestGate } from "../lib/v2/requestGate";
import { TC1, TC1_CLAIM, assessment, tc1Extraction } from "./fixtures";

const RESULTS = "Treated teams scored higher on coded decision quality (d = 0.45, 95% CI [0.10, 0.80]).";
const CONTEXT_MARKER = "Teams were allocated by drawing lots.";

function workspace(overrides: Partial<WorkspaceInput> = {}): WorkspaceInput {
  return { version: 2, results: RESULTS, discussion: TC1, context: { ...emptyContext(), assignment: CONTEXT_MARKER }, ...overrides };
}

const ok = (json: unknown): LlmResult => ({ ok: true, json, model: "test-model", latencyMs: 1 });

// Records every prompt so tests can check exactly which source text reached the model.
function capturing(...results: LlmResult[]) {
  const prompts: string[] = [];
  const generate: GenerateStructured = async (req) => {
    prompts.push(`${req.system}\n${req.user}`);
    return results[Math.min(prompts.length - 1, results.length - 1)];
  };
  return { generate, prompts };
}

function handlerDeps(generate: GenerateStructured, overrides: Partial<HandlerDeps["config"]> = {}): HandlerDeps {
  return {
    generate,
    config: { maxWords: 3000, researchPreview: true, extractModel: "m1", judgeModel: "m2", causalEnabled: false, judgeRetryOnServerError: false, ...overrides },
  };
}

describe("v2 contract", () => {
  it("accepts a full workspace and keeps every text byte for byte", () => {
    const raw = workspace({ results: "  Results with leading space\n\n", discussion: `${TC1}\n` });
    const parsed = WorkspaceRequestSchema.parse(JSON.parse(JSON.stringify(raw)));
    expect(parsed).toEqual(raw);
  });
  it("rejects unknown fields, a missing context field and the wrong version", () => {
    expect(WorkspaceRequestSchema.safeParse({ ...workspace(), extra: 1 }).success).toBe(false);
    const { design: _omit, ...partial } = emptyContext();
    expect(WorkspaceRequestSchema.safeParse({ ...workspace(), context: partial }).success).toBe(false);
    expect(WorkspaceRequestSchema.safeParse({ ...workspace(), version: 1 }).success).toBe(false);
  });
  it("rejects an over-long context field", () => {
    const long = { ...emptyContext(), design: "x".repeat(CONTEXT_FIELD_MAX_CHARS + 1) };
    expect(WorkspaceRequestSchema.safeParse(workspace({ context: long })).success).toBe(false);
  });
  it("requires a Discussion but not Results or context", () => {
    expect(workspaceProblem(workspace({ discussion: "   " }), 3000)).toMatch(/Discussion/);
    expect(workspaceProblem(workspace({ results: "", context: emptyContext() }), 3000)).toBeNull();
  });
  it("applies the word limit to all sources together", () => {
    const fifty = Array.from({ length: 50 }, () => "word").join(" ");
    expect(workspaceProblem(workspace({ results: fifty, discussion: fifty, context: { ...emptyContext(), sampling: fifty } }), 149)).toMatch(/longer than 149/);
    expect(workspaceProblem(workspace({ results: fifty, discussion: fifty, context: { ...emptyContext(), sampling: fifty } }), 150)).toBeNull();
  });
});

describe("v2 staleness", () => {
  const sent = workspace();
  it("is current only for identical sources", () => {
    expect(isWorkspaceCurrent(sent, workspace())).toBe(true);
    expect(isWorkspaceCurrent(null, sent)).toBe(false);
  });
  it("goes stale when Results, Discussion or any context field changes", () => {
    expect(isWorkspaceCurrent(sent, workspace({ results: `${RESULTS} ` }))).toBe(false);
    expect(isWorkspaceCurrent(sent, workspace({ discussion: `${TC1}.` }))).toBe(false);
    for (const field of CONTEXT_FIELDS) {
      expect(isWorkspaceCurrent(sent, workspace({ context: { ...sent.context, [field]: `${sent.context[field]}!` } }))).toBe(false);
    }
  });
  it("drops a superseded response even if its inputs still match", () => {
    const gate = createRequestGate(isWorkspaceCurrent);
    const first = gate.begin();
    const second = gate.begin();
    expect(gate.accepts(first, sent, sent)).toBe(false);
    expect(gate.accepts(second, sent, sent)).toBe(true);
  });
  it("drops the latest response after an edit or an explicit invalidation", () => {
    const gate = createRequestGate(isWorkspaceCurrent);
    const token = gate.begin();
    expect(gate.accepts(token, sent, workspace({ discussion: "Edited." }))).toBe(false);
    gate.invalidate();
    expect(gate.accepts(token, sent, sent)).toBe(false);
  });
});

describe("v2 handler (scripted model, integration)", () => {
  it("analyses the Discussion exactly and returns spans into the original Discussion text", async () => {
    const { generate, prompts } = capturing(ok(tc1Extraction()), ok({ assessments: [assessment()], all_claims_considered: true }));
    const result = await handleWorkspaceRequest(workspace(), handlerDeps(generate));
    expect(result.httpStatus).toBe(200);
    if (result.httpStatus !== 200 || result.body.status !== "complete") throw new Error("expected complete");
    const span = result.body.discussion.findings[0].claimSpan!;
    expect(TC1.slice(span.start, span.end)).toBe(TC1_CLAIM);
    expect(result.body.traceability).toEqual({ status: "not_implemented" });
    expect(result.body.received).toEqual({ results: true, context: ["assignment"] });
    expect(prompts).toHaveLength(2);
  });
  it("does not send Results or Study Context to the model in Slice A", async () => {
    const { generate, prompts } = capturing(ok(tc1Extraction()), ok({ assessments: [assessment()], all_claims_considered: true }));
    await handleWorkspaceRequest(workspace(), handlerDeps(generate));
    for (const prompt of prompts) {
      expect(prompt).not.toContain(RESULTS);
      expect(prompt).not.toContain(CONTEXT_MARKER);
    }
  });
  it("keeps provider failures as incomplete, never as a judgement", async () => {
    const { generate } = capturing({ ok: false, reason: "quota", model: "m", latencyMs: 1 });
    const result = await handleWorkspaceRequest(workspace(), handlerDeps(generate));
    expect(result.body).toEqual({ status: "incomplete", version: 2, reason: "quota" });
  });
  it("rejects invalid input without calling the model", async () => {
    const { generate, prompts } = capturing(ok({}));
    expect((await handleWorkspaceRequest({ text: TC1, section: "discussion" }, handlerDeps(generate))).httpStatus).toBe(400);
    expect((await handleWorkspaceRequest(workspace({ discussion: "" }), handlerDeps(generate))).httpStatus).toBe(400);
    expect(prompts).toHaveLength(0);
  });
  it("is unavailable when the Research Preview is disabled", async () => {
    const { generate, prompts } = capturing(ok({}));
    const result = await handleWorkspaceRequest(workspace(), handlerDeps(generate, { researchPreview: false }));
    expect(result.httpStatus).toBe(404);
    expect(prompts).toHaveLength(0);
  });
  it("logs metadata only, never source text", async () => {
    const { generate } = capturing(ok(tc1Extraction()), ok({ assessments: [assessment()], all_claims_considered: true }));
    const result = await handleWorkspaceRequest(workspace(), handlerDeps(generate));
    const log = JSON.stringify(result.log);
    expect(log).not.toContain("privacy");
    expect(log).not.toContain("lots");
    expect(result.log).toMatchObject({ version: 2, contextFields: ["assignment"], status: "complete" });
  });
});
