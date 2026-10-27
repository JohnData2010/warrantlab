import { type AnalyseDeps, type AnalyseMeta, analyse } from "../engine/analyse";
import { type WorkspaceInput, filledContextFields } from "./contract";
import type { WorkspaceResponse } from "./types";

// Slice A: the Discussion is analysed exactly as in v0.1, on its own original text.
// Results and Study Context are accepted and preserved but deliberately not yet passed to any model.
export async function analyseWorkspace(input: WorkspaceInput, deps: AnalyseDeps): Promise<{ response: WorkspaceResponse; meta: AnalyseMeta }> {
  const { response, meta } = await analyse({ text: input.discussion, section: "discussion" }, deps);
  if (response.status === "incomplete") {
    return { response: { status: "incomplete", version: 2, reason: response.reason }, meta };
  }
  return {
    response: {
      status: "complete",
      version: 2,
      discussion: response,
      traceability: { status: "not_implemented" },
      received: { results: input.results.trim() !== "", context: filledContextFields(input.context) },
    },
    meta,
  };
}
