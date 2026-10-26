import { readFileSync } from "node:fs";
import { join } from "node:path";
import { getConfig } from "../lib/config";
import { createGeminiGenerator } from "../lib/engine/gemini";
import { toModelJsonSchema } from "../lib/engine/llm";
import { EXTRACT_SYSTEM, extractUser } from "../lib/engine/prompts";
import { ExtractionSchema } from "../lib/engine/schemas";
import { verifyExtraction } from "../lib/engine/verify";
import { getSection } from "../lib/sections";
import { markParagraphs, splitParagraphs } from "../lib/text/paragraphs";
import type { SectionId } from "../lib/types";
import { type Fixture, alternatives } from "./checks";

// Validates Pass 1 (Extract) on its own, spending only Extract-model quota.
async function main() {
  const ids = process.argv.slice(2).filter((a) => !a.startsWith("--"));
  const config = getConfig();
  const generate = createGeminiGenerator(config.apiKey);
  console.log(`Extract model: ${config.extractModel}\n`);

  for (const id of ids) {
    const fixture = JSON.parse(readFileSync(join("eval", "fixtures", "discussion", `${id}.json`), "utf8")) as Fixture;
    const section = getSection(fixture.section as SectionId);
    const paragraphs = splitParagraphs(fixture.text);
    const result = await generate({
      model: config.extractModel,
      system: EXTRACT_SYSTEM,
      user: extractUser(section.label, section.guidance, markParagraphs(fixture.text, paragraphs)),
      jsonSchema: toModelJsonSchema(ExtractionSchema),
      thinkingLevel: "low",
    });
    console.log(`## ${id} — ${result.latencyMs} ms`);
    if (!result.ok) {
      console.log(`  model call failed: ${result.reason}${result.detail ? ` (${result.detail})` : ""}\n`);
      if (result.reason === "quota") break;
      continue;
    }
    const verified = verifyExtraction(fixture.text, paragraphs, result.json);
    if (!verified.ok) {
      console.log(`  verification failed: ${verified.reason} — ${verified.detail}\n`);
      continue;
    }
    const { extraction, claimSpans } = verified;
    console.log(`  schema valid, coverage ${extraction.paragraphs_covered.join(",")}/${paragraphs.length} paragraphs, ${extraction.evidence.length} evidence, ${extraction.claims.length} claims`);
    for (const c of extraction.claims) {
      const located = claimSpans.get(c.id) ? "located" : "UNLOCATED";
      console.log(`  ${c.id} [${c.claim_kind}] P${c.paragraph} ${located} evidence=${c.evidence_ids.join(",") || "none"}${c.unresolved_reference ? " unresolved" : ""}: "${c.quote}"`);
    }
    for (const e of extraction.evidence) console.log(`  ${e.id} [${e.evidence_kind}] P${e.paragraph}: "${e.quote.slice(0, 90)}${e.quote.length > 90 ? "…" : ""}"`);
    for (const expected of fixture.expect.finding_quotes ?? []) {
      const alts = alternatives(expected);
      const exact = extraction.claims.find((c) => alts.includes(c.quote));
      const overlap = exact ?? extraction.claims.find((c) => alts.some((q) => c.quote.includes(q) || q.includes(c.quote)));
      console.log(`  expected claim ${overlap ? `found as ${overlap.id}${exact ? " (acceptable span)" : " (overlapping only)"}` : "MISSING"}: "${alts[0]}"`);
    }
    console.log("");
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
