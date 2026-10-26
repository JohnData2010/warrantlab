export interface Paragraph {
  number: number;
  start: number;
  end: number;
}

// Paragraphs are separated by blank lines; offsets always point into the untouched original.
export function splitParagraphs(text: string): Paragraph[] {
  const paragraphs: Paragraph[] = [];
  const separator = /\n[ \t]*\n\s*/g;
  let cursor = 0;
  const pushBlock = (from: number, to: number) => {
    let start = from;
    let end = to;
    while (start < end && /\s/.test(text[start])) start++;
    while (end > start && /\s/.test(text[end - 1])) end--;
    if (end > start) paragraphs.push({ number: paragraphs.length + 1, start, end });
  };
  for (const match of text.matchAll(separator)) {
    pushBlock(cursor, match.index);
    cursor = match.index + match[0].length;
  }
  pushBlock(cursor, text.length);
  return paragraphs;
}

export function markParagraphs(text: string, paragraphs: Paragraph[]): string {
  return paragraphs.map((p) => `[P${p.number}] ${text.slice(p.start, p.end)}`).join("\n\n");
}
