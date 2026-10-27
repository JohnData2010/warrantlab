import { randomUUID } from "node:crypto";
import { NextResponse } from "next/server";
import { getConfig } from "../../../../lib/config";
import { createGeminiGenerator } from "../../../../lib/engine/gemini";
import { handleWorkspaceRequest } from "../../../../lib/v2/handler";

export const runtime = "nodejs";
export const maxDuration = 120;

const NO_STORE = { "cache-control": "no-store" };

// V0.2 Research Preview. The v0.1 route at /api/analyse is unchanged.
export async function POST(request: Request) {
  const id = randomUUID().slice(0, 8);
  const started = Date.now();
  const config = getConfig();

  const raw = await request.json().catch(() => null);
  const result = await handleWorkspaceRequest(raw, { config, generate: createGeminiGenerator(config.apiKey) });

  console.info(
    JSON.stringify({
      id,
      ms: Date.now() - started,
      ...result.log,
      ...(result.httpStatus === 200 && result.body.status === "incomplete" && !config.apiKey ? { hint: "GEMINI_API_KEY is not set in .env.local" } : {}),
    }),
  );

  return NextResponse.json(result.body, { status: result.httpStatus, headers: NO_STORE });
}
