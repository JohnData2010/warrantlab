import type { Span } from "../types";

export type LocateStatus = "exact" | "tolerant" | "ambiguous" | "not_found";

export interface Located {
  span: Span | null;
  status: LocateStatus;
}

const QUOTE_EQUIVALENTS: Record<string, string> = {
  "‘": "'",
  "’": "'",
  "‚": "'",
  "‛": "'",
  "“": '"',
  "”": '"',
  "„": '"',
  "‟": '"',
};

// Collapses whitespace runs and unifies quote styles, keeping a map back to original offsets.
function normalise(text: string): { value: string; map: number[] } {
  let value = "";
  const map: number[] = [];
  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    if (/\s/.test(char)) {
      if (value.endsWith(" ")) continue;
      value += " ";
      map.push(i);
      continue;
    }
    value += QUOTE_EQUIVALENTS[char] ?? char;
    map.push(i);
  }
  return { value, map };
}

function allIndexes(haystack: string, needle: string): number[] {
  const found: number[] = [];
  let from = 0;
  while (needle.length > 0) {
    const index = haystack.indexOf(needle, from);
    if (index === -1) break;
    found.push(index);
    from = index + 1;
  }
  return found;
}

function locateOnce(original: string, quote: string): { spans: Span[]; status: "exact" | "tolerant" | "not_found" } {
  const exact = allIndexes(original, quote);
  if (exact.length > 0) return { spans: exact.map((start) => ({ start, end: start + quote.length })), status: "exact" };

  const source = normalise(original);
  const target = normalise(quote).value.trim();
  if (!target) return { spans: [], status: "not_found" };
  const hits = allIndexes(source.value, target);
  if (hits.length === 0) return { spans: [], status: "not_found" };
  return {
    spans: hits.map((i) => ({ start: source.map[i], end: source.map[i + target.length - 1] + 1 })),
    status: "tolerant",
  };
}

export function locateQuote(original: string, quote: string, sentence?: string): Located {
  const trimmed = quote.trim();
  if (!trimmed) return { span: null, status: "not_found" };
  const { spans, status } = locateOnce(original, trimmed);
  if (status === "not_found") return { span: null, status };
  if (spans.length === 1) return { span: spans[0], status };

  if (sentence?.trim()) {
    const container = locateOnce(original, sentence.trim());
    if (container.spans.length === 1) {
      const { start, end } = container.spans[0];
      const inside = spans.filter((s) => s.start >= start && s.end <= end);
      if (inside.length === 1) return { span: inside[0], status };
    }
  }
  return { span: null, status: "ambiguous" };
}
