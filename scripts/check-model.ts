import { z } from "zod";
import { getConfig } from "../lib/config";
import { createGeminiGenerator } from "../lib/engine/gemini";
import { toModelJsonSchema } from "../lib/engine/llm";

const ProbeSchema = z.object({
  claim_quote: z.string(),
  evidence_quote: z.string(),
  claim_goes_beyond_evidence: z.boolean(),
});

const PROBE_TEXT =
  "Participants exposed to an external data-sharing policy reported higher privacy concerns than those exposed to an internal-sharing policy (p = .01). These findings prove that violations of contextual integrity are the mechanism driving privacy concerns.";

async function main() {
  const config = getConfig();
  const modelArg = process.argv.find((a) => a.startsWith("--model="))?.slice("--model=".length);
  const model = modelArg ?? config.extractModel;
  if (!config.apiKey) {
    console.error("GEMINI_API_KEY is not set. Add it to .env.local (never commit that file).");
    process.exitCode = 1;
    return;
  }

  const generate = createGeminiGenerator(config.apiKey);
  console.log(`Probing ${model} with a structured-output request (fictional text)...`);
  const result = await generate({
    model,
    system: "You extract claims and evidence from academic text. Quote verbatim. Respond only with JSON matching the schema.",
    user: `Text:\n${PROBE_TEXT}\n\nReturn the main claim, the evidence it relies on, and whether the claim goes beyond that evidence.`,
    jsonSchema: toModelJsonSchema(ProbeSchema),
    maxOutputTokens: 4000,
  });

  console.log(`model: ${result.model}`);
  console.log(`latency: ${result.latencyMs} ms`);
  if (!result.ok) {
    console.error(`ok: false (reason: ${result.reason}${result.detail ? `, ${result.detail}` : ""})`);
    if (result.reason === "model_error") console.error("If access is refused, retry with --model=gemini-3.8-flash and record the result.");
    process.exitCode = 1;
    return;
  }
  const parsed = ProbeSchema.safeParse(result.json);
  console.log(`ok: true, schema-valid: ${parsed.success}`);
  console.log(JSON.stringify(result.json, null, 2));
  if (!parsed.success) {
    process.exitCode = 1;
    return;
  }
  const quotesFound = PROBE_TEXT.includes(parsed.data.claim_quote) && PROBE_TEXT.includes(parsed.data.evidence_quote);
  console.log(`verbatim quotes found in input: ${quotesFound}`);
}

main().catch((error) => {
  console.error(`check failed: ${error instanceof Error ? error.name : "unknown error"}`);
  process.exitCode = 1;
});
