import { describe, expect, it } from "vitest";
import { isCurrent } from "../lib/analysisKey";

describe("isCurrent", () => {
  const sent = { section: "discussion" as const, text: "A claim." };
  it("accepts a response for the same text and section", () => {
    expect(isCurrent(sent, { section: "discussion", text: "A claim." })).toBe(true);
  });
  it("drops a response once the text has changed", () => {
    expect(isCurrent(sent, { section: "discussion", text: "A claim. Revised." })).toBe(false);
  });
  it("drops a response once the section has changed", () => {
    expect(isCurrent(sent, { section: "results", text: "A claim." })).toBe(false);
  });
  it("drops when nothing was analysed", () => {
    expect(isCurrent(null, sent)).toBe(false);
  });
});
