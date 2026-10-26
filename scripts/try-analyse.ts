import { readFileSync } from "node:fs";
import { getConfig } from "../lib/config";
import { analyse } from "../lib/engine/analyse";
import { createGeminiGenerator } from "../lib/engine/gemini";
import type { SectionId } from "../lib/types";

// Developer tool: runs one fictional text file through the real engine and prints the result.
async function main() {
  const [file, section = "discussion"] = process.argv.slice(2);
  if (!file) {
    console.error("usage: npm run try -- <text-file> [section]");
    process.exitCode = 1;
    return;
  }
  const text = readFileSync(file, "utf8");
  const config = getConfig();
  const { response, meta } = await analyse(
    { text, section: section as SectionId },
    { generate: createGeminiGenerator(config.apiKey), extractModel: config.extractModel, judgeModel: config.judgeModel, causalEnabled: config.causalEnabled, judgeRetryOnServerError: config.judgeRetryOnServerError },
  );
  console.log(JSON.stringify({ meta, response }, null, 2));
  if (response.status === "complete") {
    for (const f of response.findings) console.log(`HIGHLIGHT: ${f.claimSpan ? JSON.stringify(text.slice(f.claimSpan.start, f.claimSpan.end)) : "(unmarked)"}`);
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
