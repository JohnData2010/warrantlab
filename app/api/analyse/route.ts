import { randomUUID } from "node:crypto";
import { NextResponse } from "next/server";
import { z } from "zod";
import { getConfig } from "../../../lib/config";
import { analyse } from "../../../lib/engine/analyse";
import { createGeminiGenerator } from "../../../lib/engine/gemini";
import { getSection, isSelectable } from "../../../lib/sections";
import { countWords } from "../../../lib/text/wordCount";
import { SECTION_IDS } from "../../../lib/types";

export const runtime = "nodejs";
export const maxDuration = 120;

const RequestSchema = z.object({ text: z.string(), section: z.enum(SECTION_IDS) });
const NO_STORE = { "cache-control": "no-store" };

function reject(message: string) {
  return NextResponse.json({ error: message }, { status: 400, headers: NO_STORE });
}

export async function POST(request: Request) {
  const id = randomUUID().slice(0, 8);
  const started = Date.now();
  const config = getConfig();

  const body = RequestSchema.safeParse(await request.json().catch(() => null));
  if (!body.success) return reject("Invalid request.");
  const { text, section } = body.data;

  const words = countWords(text);
  if (words === 0) return reject("Paste some text to analyse.");
  if (words > config.maxWords) return reject(`This passage is longer than ${config.maxWords.toLocaleString("en-AU")} words.`);
  if (!isSelectable(getSection(section), config.devPreview)) return reject("This section is not available yet.");

  const { response, meta } = await analyse(
    { text, section },
    {
      generate: createGeminiGenerator(config.apiKey),
      extractModel: config.extractModel,
      judgeModel: config.judgeModel,
      causalEnabled: config.causalEnabled,
    },
  );

  // Log metadata only — never manuscript text, quotes or diagnostics.
  console.info(
    JSON.stringify({
      id,
      ms: Date.now() - started,
      section,
      words,
      status: response.status,
      result: response.status === "complete" ? response.outcome : response.reason,
      stage: meta.stage,
      calls: meta.calls.map((c) => `${c.stage}:${c.model}:${c.ok ? "ok" : c.reason}:${c.latencyMs}ms`),
      ...(response.status === "incomplete" && !config.apiKey ? { hint: "GEMINI_API_KEY is not set in .env.local" } : {}),
    }),
  );

  return NextResponse.json(response, { headers: NO_STORE });
}
