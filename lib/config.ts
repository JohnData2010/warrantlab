// Server-side only: never import this from a client component (it reads the API key).
export interface WarrantLabConfig {
  apiKey: string | undefined;
  extractModel: string;
  judgeModel: string;
  maxWords: number;
  causalEnabled: boolean;
  devPreview: boolean;
}

function readBool(value: string | undefined): boolean {
  return value?.trim().toLowerCase() === "true";
}

export function getConfig(): WarrantLabConfig {
  const maxWords = Number.parseInt(process.env.WARRANTLAB_MAX_WORDS ?? "", 10);
  return {
    apiKey: process.env.GEMINI_API_KEY || undefined,
    extractModel: process.env.WARRANTLAB_EXTRACT_MODEL || "gemini-3-flash-preview",
    judgeModel: process.env.WARRANTLAB_JUDGE_MODEL || "gemini-3-flash-preview",
    maxWords: Number.isFinite(maxWords) && maxWords > 0 ? maxWords : 3000,
    causalEnabled: readBool(process.env.WARRANTLAB_CAUSAL_ENABLED),
    devPreview: process.env.NODE_ENV !== "production" && readBool(process.env.WARRANTLAB_DEV_PREVIEW),
  };
}
