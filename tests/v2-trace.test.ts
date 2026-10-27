import { describe, expect, it } from "vitest";
import { buildMarkSegments } from "../components/v2/SourceAnnotated";
import type { GenerateStructured } from "../lib/engine/llm";
import { emptyContext, isWorkspaceCurrent } from "../lib/v2/contract";
import { createRequestGate } from "../lib/v2/requestGate";
import { analyseTrace } from "../lib/v2/trace/analyseTrace";
import type { TraceClaim, TraceResponse } from "../lib/v2/trace/types";
import { locateInSource, sourceText, verifyLocate, verifyRelate } from "../lib/v2/trace/verify";
import {
  C1_SUPPORTED,
  C2_BEYOND,
  C3_ABSENT,
  DISCUSSION,
  D_C1,
  D_C2,
  RESULTS,
  R_E1,
  R_E2,
  fail,
  locateOutput,
  ok,
  relateClaim,
  relateOutput,
  scripted,
  traceInput,
} from "./traceFixtures";

const deps = (generate: GenerateStructured) => ({ generate, locateModel: "locate-model", relateModel: "relate-model", relateRetryOnServerError: false });

function complete(response: TraceResponse) {
  if (response.status !== "complete") throw new Error(`expected complete, got ${JSON.stringify(response)}`);
  return response;
}
function claim(response: TraceResponse, id: string): TraceClaim {
  return complete(response).claims.find((c) => c.id === id)!;
}
function sliceOf(text: string, loc: TraceClaim["location"]) {
  if (loc.status === "ambiguous") throw new Error("ambiguous");
  return text.slice(loc.start, loc.end);
}

const D = sourceText("discussion", DISCUSSION);
const R = sourceText("results", RESULTS);

describe("1 and 3: a claim linked to its Results evidence (calibrated)", () => {
  it("links C1 to E1 with exact spans in each original source", async () => {
    const { generate } = scripted(ok(locateOutput()), ok(relateOutput()));
    const { response } = await analyseTrace(traceInput(), deps(generate));
    const c1 = claim(response, "C1");
    expect(c1.location).toMatchObject({ sourceId: "discussion", status: "exact" });
    expect(sliceOf(DISCUSSION, c1.location)).toBe(D_C1);
    expect(c1.linkStatus).toBe("linked");
    expect(c1.assessment).toBe("supported_as_stated");
    const e1 = complete(response).evidence.find((e) => e.id === c1.links[0].evidenceId)!;
    expect(e1.location).toMatchObject({ sourceId: "results" });
    if (e1.location.status === "ambiguous") throw new Error();
    expect(RESULTS.slice(e1.location.start, e1.location.end)).toBe(R_E1);
  });
});

describe("2 and 5: evidence present but insufficient for a mechanism claim", () => {
  it("keeps the evidence linked and names the gap instead of treating it as missing", async () => {
    const { generate } = scripted(ok(locateOutput()), ok(relateOutput()));
    const c2 = claim((await analyseTrace(traceInput(), deps(generate))).response, "C2");
    expect(sliceOf(DISCUSSION, c2.location)).toBe(D_C2);
    expect(c2.linkStatus).toBe("linked");
    expect(c2.assessment).toBe("goes_beyond_evidence");
    expect(c2.gapExplanation).toMatch(/do not report a measure/);
    expect(c2.missingInformation).toBe("");
  });
  it("rejects a 'goes beyond' assessment that does not name the gap", () => {
    const v = verifyLocate(D, R, locateOutput());
    if (!v.ok) throw new Error();
    const bad = relateOutput([C1_SUPPORTED, { ...C2_BEYOND, gap_explanation: " " }, C3_ABSENT]);
    expect(verifyRelate(v, bad, traceInput())).toMatchObject({ ok: false, reason: "invalid_output" });
  });
});

describe("4: necessary evidence absent from the supplied Results", () => {
  it("reports no located evidence and cannot-assess, never a negative verdict", async () => {
    const { generate } = scripted(ok(locateOutput()), ok(relateOutput()));
    const c3 = claim((await analyseTrace(traceInput(), deps(generate))).response, "C3");
    expect(c3).toMatchObject({ linkStatus: "no_relevant_evidence_located", assessment: "cannot_assess", links: [] });
    expect(c3.missingInformation).toMatch(/turnover/);
  });
  it("rejects any verdict other than cannot-assess when no evidence was located", () => {
    const v = verifyLocate(D, R, locateOutput());
    if (!v.ok) throw new Error();
    for (const assessment of ["goes_beyond_evidence", "conflicts_with_evidence", "supported_as_stated"] as const) {
      const bad = relateOutput([C1_SUPPORTED, C2_BEYOND, { ...C3_ABSENT, assessment, gap_explanation: "x" }]);
      expect(verifyRelate(v, bad, traceInput())).toMatchObject({ ok: false, reason: "invalid_output" });
    }
  });
  it("marks every claim as 'Results not supplied' without a second model call", async () => {
    const located = locateOutput({ results_paragraphs_covered: [], evidence: [], links: [] });
    const { generate, requests } = scripted(ok(located));
    const { response } = await analyseTrace(traceInput({ results: "" }), deps(generate));
    expect(requests).toHaveLength(1);
    expect(complete(response).claims.every((c) => c.linkStatus === "results_not_supplied" && c.assessment === "cannot_assess")).toBe(true);
  });
});

describe("6: duplicate, fabricated, unknown and cross-source references", () => {
  it("resolves a repeated quotation by its declared paragraph", () => {
    const repeated = sourceText("results", "Scores were higher (d = 0.45).\n\nScores were higher (d = 0.45).");
    const loc = locateInSource(repeated, D, "Scores were higher (d = 0.45)", "Scores were higher (d = 0.45).", 2);
    expect(loc).toMatchObject({ status: "exact", sourceId: "results", start: 32 });
  });
  it("leaves a quotation ambiguous rather than picking an arbitrary occurrence", () => {
    const repeated = sourceText("results", "Scores rose. Scores rose.");
    expect(locateInSource(repeated, D, "Scores rose", "Scores rose.", 1)).toEqual({ status: "ambiguous", sourceId: "results" });
  });
  it("retries once on a fabricated quotation, then reports incomplete", async () => {
    const fabricated = locateOutput({ evidence: [{ id: "E1", quote: "(p < .001, n = 900)", sentence: "x", paragraph: 1, evidence_kind: "other" }], links: [] });
    const { generate, requests } = scripted(ok(fabricated), ok(fabricated));
    const { response } = await analyseTrace(traceInput(), deps(generate));
    expect(response).toEqual({ status: "incomplete", version: 2, reason: "fabricated_span" });
    expect(requests).toHaveLength(2);
  });
  it("rejects a claim quoted from Results or evidence quoted from Discussion", () => {
    const claimFromResults = locateOutput({ claims: [{ id: "C1", quote: R_E2, sentence: `${R_E2}.`, paragraph: 1, claim_kind: "other" }], links: [] });
    expect(verifyLocate(D, R, claimFromResults)).toMatchObject({ ok: false, reason: "fabricated_span", detail: expect.stringContaining("other source") });
    const evidenceFromDiscussion = locateOutput({ evidence: [{ id: "E1", quote: D_C1, sentence: "x", paragraph: 1, evidence_kind: "other" }], links: [] });
    expect(verifyLocate(D, R, evidenceFromDiscussion)).toMatchObject({ ok: false, reason: "fabricated_span" });
  });
  it("rejects unknown ids, duplicate ids and paragraphs that do not exist", () => {
    expect(verifyLocate(D, R, locateOutput({ links: [{ claim_id: "C9", evidence_id: "E1" }] }))).toMatchObject({ reason: "invalid_output" });
    expect(verifyLocate(D, R, locateOutput({ links: [{ claim_id: "C1", evidence_id: "E9" }] }))).toMatchObject({ reason: "invalid_output" });
    const dup = locateOutput();
    dup.evidence[1] = { ...dup.evidence[1], id: "E1" };
    expect(verifyLocate(D, R, dup)).toMatchObject({ reason: "invalid_output" });
    const badPara = locateOutput();
    badPara.claims[0] = { ...badPara.claims[0], paragraph: 7 };
    expect(verifyLocate(D, R, badPara)).toMatchObject({ reason: "invalid_output" });

    const v = verifyLocate(D, R, locateOutput());
    if (!v.ok) throw new Error();
    const unknownEvidence = relateOutput([{ ...C1_SUPPORTED, evidence_links: [{ evidence_id: "E7", relevance: "direct", role: "x" }] }, C2_BEYOND, C3_ABSENT]);
    expect(verifyRelate(v, unknownEvidence, traceInput())).toMatchObject({ reason: "invalid_output" });
    const unknownClaim = relateOutput([C1_SUPPORTED, C2_BEYOND, C3_ABSENT, relateClaim({ claim_id: "C8", missing_information: "x" })]);
    expect(verifyRelate(v, unknownClaim, traceInput())).toMatchObject({ reason: "invalid_output" });
  });
  it("rejects citing Study Context fields that were not supplied", () => {
    const v = verifyLocate(D, R, locateOutput());
    if (!v.ok) throw new Error();
    const cites = relateOutput([{ ...C1_SUPPORTED, context_fields_used: ["assignment"] }, C2_BEYOND, C3_ABSENT]);
    expect(verifyRelate(v, cites, traceInput())).toMatchObject({ ok: false, reason: "invalid_output" });
    expect(verifyRelate(v, cites, traceInput({ context: { ...emptyContext(), assignment: "Allocated by lot." } })).ok).toBe(true);
  });
  it("rejects inconsistent link status and links", () => {
    const v = verifyLocate(D, R, locateOutput());
    if (!v.ok) throw new Error();
    const linkedWithout = relateOutput([{ ...C1_SUPPORTED, evidence_links: [] }, C2_BEYOND, C3_ABSENT]);
    expect(verifyRelate(v, linkedWithout, traceInput())).toMatchObject({ reason: "invalid_output" });
    const unlinkedWith = relateOutput([C1_SUPPORTED, C2_BEYOND, { ...C3_ABSENT, evidence_links: [{ evidence_id: "E2", relevance: "partial", role: "x" }] }]);
    expect(verifyRelate(v, unlinkedWith, traceInput())).toMatchObject({ reason: "invalid_output" });
  });
});

describe("7: several claims and several Results passages", () => {
  it("links two claims to one passage and one claim to two passages", async () => {
    const c2Two = { ...C2_BEYOND, evidence_links: [...C2_BEYOND.evidence_links, { evidence_id: "E2", relevance: "partial" as const, role: "An association with meeting length." }] };
    const { generate } = scripted(ok(locateOutput()), ok(relateOutput([C1_SUPPORTED, c2Two, C3_ABSENT])));
    const response = complete((await analyseTrace(traceInput(), deps(generate))).response);
    expect(response.claims.filter((c) => c.links.some((l) => l.evidenceId === "E1")).map((c) => c.id)).toEqual(["C1", "C2"]);
    expect(claim(response, "C2").links.map((l) => l.evidenceId)).toEqual(["E1", "E2"]);
    expect(response.claims.map((c) => c.id)).toEqual(["C1", "C2", "C3"]);
  });
});

describe("8: stale links after edits and overlapping requests", () => {
  it("rejects an older response that arrives after a newer request", () => {
    const gate = createRequestGate(isWorkspaceCurrent);
    const first = gate.begin();
    const sentFirst = traceInput();
    const second = gate.begin();
    const sentSecond = traceInput({ results: `${RESULTS} Edited.` });
    expect(gate.accepts(first, sentFirst, sentSecond)).toBe(false);
    expect(gate.accepts(second, sentSecond, sentSecond)).toBe(true);
  });
  it("never draws a mark beyond the current text or over another mark", () => {
    const text = "Short text.";
    const { rendered } = buildMarkSegments(text, [
      { id: "old", start: 0, end: 40, tone: "evidence", active: false, label: "" },
      { id: "a", start: 0, end: 5, tone: "evidence", active: false, label: "" },
      { id: "b", start: 3, end: 8, tone: "evidence", active: false, label: "" },
    ]);
    expect([...rendered]).toEqual(["a"]);
  });
});

describe("9: provider and output failures fail safely", () => {
  it("maps a Locate quota failure to incomplete without calling Relate", async () => {
    const { generate, requests } = scripted(fail("quota"));
    expect((await analyseTrace(traceInput(), deps(generate))).response).toEqual({ status: "incomplete", version: 2, reason: "quota" });
    expect(requests).toHaveLength(1);
  });
  it("maps a Relate timeout to incomplete, discarding the located links", async () => {
    const { generate } = scripted(ok(locateOutput()), fail("timeout"));
    expect((await analyseTrace(traceInput(), deps(generate))).response).toEqual({ status: "incomplete", version: 2, reason: "timeout" });
  });
  it("maps malformed output and missing coverage to incomplete", async () => {
    const { generate } = scripted(ok({ claims: "nope" }));
    expect((await analyseTrace(traceInput(), deps(generate))).response).toMatchObject({ status: "incomplete", reason: "invalid_output" });
    const notCovered = scripted(ok(locateOutput({ results_paragraphs_covered: [1] })));
    expect((await analyseTrace(traceInput(), deps(notCovered.generate))).response).toMatchObject({ reason: "coverage" });
    const partial = scripted(ok(locateOutput()), ok(relateOutput([C1_SUPPORTED, C2_BEYOND])));
    expect((await analyseTrace(traceInput(), deps(partial.generate))).response).toMatchObject({ reason: "coverage" });
  });
});

describe("Results and Study Context change the analysis, not just the UI state", () => {
  // A deterministic stand-in for the model that reads what it is given, so the test shows the pipeline
  // passes the sources through and that different sources produce different, still-verified results.
  const readingModel: GenerateStructured = async (req) => {
    if (req.system.startsWith("You are the locating stage")) {
      const hasE1 = req.user.includes(R_E1);
      return ok(
        locateOutput({
          evidence: hasE1 ? locateOutput().evidence : [{ ...locateOutput().evidence[1], paragraph: 1 }],
          results_paragraphs_covered: hasE1 ? [1, 2] : [1],
          links: hasE1 ? [{ claim_id: "C1", evidence_id: "E1" }] : [],
        }),
      );
    }
    const allocated = req.user.includes("drawing lots");
    const hasE1 = req.user.includes(R_E1);
    const c1 = hasE1
      ? { ...C1_SUPPORTED, context_fields_used: allocated ? (["assignment"] as const).slice() : [], assessment: allocated ? ("supported_as_stated" as const) : ("cannot_assess" as const), missing_information: allocated ? "" : "How teams came to have access." }
      : relateClaim({ claim_id: "C1", missing_information: "A result about decision-making." });
    const c2 = hasE1 ? C2_BEYOND : relateClaim({ claim_id: "C2", missing_information: "A result bearing on the mechanism." });
    return ok(relateOutput([c1, c2, C3_ABSENT]));
  };

  it("changes links when the Results change", async () => {
    const withE1 = claim((await analyseTrace(traceInput(), deps(readingModel))).response, "C1");
    const withoutE1 = claim((await analyseTrace(traceInput({ results: `${R_E2}.` }), deps(readingModel))).response, "C1");
    expect(withE1.linkStatus).toBe("linked");
    expect(withoutE1.linkStatus).toBe("no_relevant_evidence_located");
  });
  it("changes the assessment when the Study Context changes, and records the context as relied on", async () => {
    const without = claim((await analyseTrace(traceInput(), deps(readingModel))).response, "C1");
    const withContext = claim(
      (await analyseTrace(traceInput({ context: { ...emptyContext(), assignment: "Teams were allocated by drawing lots." } }), deps(readingModel))).response,
      "C1",
    );
    expect(without.assessment).toBe("cannot_assess");
    expect(withContext.assessment).toBe("supported_as_stated");
    expect(withContext.contextFieldsUsed).toEqual(["assignment"]);
  });
});
