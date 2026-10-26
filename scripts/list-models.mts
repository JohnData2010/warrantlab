import { GoogleGenAI } from "@google/genai";
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
const pager = await ai.models.list({ config: { pageSize: 200 } });
const names: string[] = [];
for await (const m of pager) {
  if ((m.supportedActions ?? []).includes("generateContent")) names.push(String(m.name).replace("models/", ""));
}
console.log(names.filter((n) => /gemini/.test(n)).join("\n"));
