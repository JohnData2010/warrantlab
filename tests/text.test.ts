import { describe, expect, it } from "vitest";
import { markParagraphs, splitParagraphs } from "../lib/text/paragraphs";
import { locateQuote } from "../lib/text/spans";
import { countWords } from "../lib/text/wordCount";

describe("countWords", () => {
  it("counts zero for empty or whitespace", () => {
    expect(countWords("")).toBe(0);
    expect(countWords("   \n\t ")).toBe(0);
  });
  it("counts words across lines", () => {
    expect(countWords(" one two\nthree   four ")).toBe(4);
  });
});

describe("splitParagraphs", () => {
  it("splits on blank lines with offsets into the original", () => {
    const text = "  First para.\nStill first.\n\n\nSecond para.  \n \nThird.";
    const paragraphs = splitParagraphs(text);
    expect(paragraphs.map((p) => text.slice(p.start, p.end))).toEqual(["First para.\nStill first.", "Second para.", "Third."]);
    expect(paragraphs.map((p) => p.number)).toEqual([1, 2, 3]);
  });
  it("marks paragraphs for the model", () => {
    const text = "A.\n\nB.";
    expect(markParagraphs(text, splitParagraphs(text))).toBe("[P1] A.\n\n[P2] B.");
  });
});

describe("locateQuote", () => {
  const text = "These findings prove that violations of contextual integrity are the mechanism driving privacy concerns.";
  it("finds an exact quote", () => {
    const quote = "prove that violations of contextual integrity are the mechanism driving privacy concerns";
    const located = locateQuote(text, quote);
    expect(located.status).toBe("exact");
    expect(text.slice(located.span!.start, located.span!.end)).toBe(quote);
  });
  it("tolerates whitespace and quote-style differences, mapping to original offsets", () => {
    const original = "They said “privacy”   matters\na lot.";
    const located = locateQuote(original, 'said "privacy" matters a lot');
    expect(located.status).toBe("tolerant");
    expect(original.slice(located.span!.start, located.span!.end)).toBe("said “privacy”   matters\na lot");
  });
  it("reports not_found for fabricated quotes", () => {
    expect(locateQuote(text, "p = .001").status).toBe("not_found");
  });
  it("disambiguates repeated quotes by sentence, otherwise ambiguous", () => {
    const repeated = "Trust matters here. In this context trust matters for adoption.";
    expect(locateQuote(repeated, "rust matters").status).toBe("ambiguous");
    const located = locateQuote(repeated, "rust matters", "In this context trust matters for adoption.");
    expect(located.span!.start).toBeGreaterThan(20);
  });
});
