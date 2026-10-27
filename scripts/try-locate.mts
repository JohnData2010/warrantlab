// Diagnostic: runs only the v2 Locate pass on a built-in synthetic example and prints the structured output
// (claim ids, kinds, results_reference and links). Synthetic text only. Usage:
//   npx tsx --env-file=.env.local scripts/try-locate.mts [low|medium|high]
import { getConfig } from "../lib/config";
import { createGeminiGenerator } from "../lib/engine/gemini";
import { toModelJsonSchema } from "../lib/engine/llm";
import { LOCATE_SYSTEM, locateUser } from "../lib/v2/trace/prompts";
import { LocateSchema } from "../lib/v2/trace/schemas";
import { sourceText } from "../lib/v2/trace/verify";

const RESULTS =
  "Teams that chose to adopt the dashboard scored higher on coded data-driven decision-making than teams that did not adopt it (d = 0.45, 95% CI [0.10, 0.80]).\n\nWeekly dashboard log-ins were associated with shorter meetings (r = .21, p = .04).";
const DISCUSSION =
  "Dashboard access improved data-driven decision-making in the teams studied. These findings prove that managerial transparency is the mechanism through which dashboards change decisions.\n\nDashboards also reduce employee turnover.";

function mark(text: string, prefix: string) {
  return sourceText("results", text).paragraphs.map((p) => `[${prefix}${p.number}] ${text.slice(p.start, p.end)}`).join("\n\n");
}

const level = (process.argv[2] ?? "low") as "low" | "medium" | "high";
const config = getConfig();
const result = await createGeminiGenerator(config.apiKey)({
  model: config.extractModel,
  system: LOCATE_SYSTEM,
  user: locateUser(mark(DISCUSSION, "D"), mark(RESULTS, "R")),
  jsonSchema: toModelJsonSchema(LocateSchema),
  thinkingLevel: level,
  timeoutMs: 60_000,
});
if (!result.ok) {
  console.log({ level, ok: false, reason: result.reason, latencyMs: result.latencyMs });
} else {
  const parsed = LocateSchema.safeParse(result.json);
  console.log(
    JSON.stringify(
      parsed.success
        ? { level, latencyMs: result.latencyMs, claims: parsed.data.claims.map((c) => [c.id, c.claim_kind, c.results_reference]), links: parsed.data.links }
        : { level, schema: "invalid" },
    ),
  );
}
