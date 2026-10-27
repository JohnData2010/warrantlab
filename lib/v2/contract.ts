import { z } from "zod";
import { countWords } from "../text/wordCount";

// V0.2 Research Preview request contract. Texts are carried exactly as typed: no trimming or normalisation,
// so any span the engine returns refers to the original characters of its source.

export const CONTEXT_FIELDS = ["design", "assignment", "sampling", "measurement", "assumptions"] as const;
export type ContextField = (typeof CONTEXT_FIELDS)[number];

export const CONTEXT_FIELD_MAX_CHARS = 1500;

export const CONTEXT_LABELS: Record<ContextField, { label: string; prompt: string }> = {
  design: { label: "Design", prompt: "How the study was conducted, as reported (e.g. survey at one time point; field experiment over three months)." },
  assignment: { label: "Assignment", prompt: "How participants or units came to receive each condition, as reported (e.g. chose themselves; allocated by lottery)." },
  sampling: { label: "Sampling", prompt: "Who was studied and how they were selected, as reported." },
  measurement: { label: "Measurement", prompt: "How the main constructs were measured, as reported." },
  assumptions: { label: "Reported assumptions", prompt: "Assumptions the study states, and any checks it reports." },
};

const contextText = z.string().max(CONTEXT_FIELD_MAX_CHARS);

export const StudyContextSchema = z
  .object({
    design: contextText,
    assignment: contextText,
    sampling: contextText,
    measurement: contextText,
    assumptions: contextText,
  })
  .strict();
export type StudyContext = z.infer<typeof StudyContextSchema>;

export const WorkspaceRequestSchema = z
  .object({
    version: z.literal(2),
    results: z.string(),
    discussion: z.string(),
    context: StudyContextSchema,
  })
  .strict();
export type WorkspaceInput = z.infer<typeof WorkspaceRequestSchema>;

// Every place a quoted span may come from. Spans are always relative to one source's original text.
export type SourceId = "results" | "discussion" | `context.${ContextField}`;

export function emptyContext(): StudyContext {
  return { design: "", assignment: "", sampling: "", measurement: "", assumptions: "" };
}

export function filledContextFields(context: StudyContext): ContextField[] {
  return CONTEXT_FIELDS.filter((field) => context[field].trim() !== "");
}

export function workspaceWordCounts(input: Pick<WorkspaceInput, "results" | "discussion" | "context">) {
  const results = countWords(input.results);
  const discussion = countWords(input.discussion);
  const context = CONTEXT_FIELDS.reduce((sum, field) => sum + countWords(input.context[field]), 0);
  return { results, discussion, context, total: results + discussion + context };
}

// Returns a user-facing reason the input cannot be analysed, or null when it can.
export function workspaceProblem(input: WorkspaceInput, maxWords: number): string | null {
  const counts = workspaceWordCounts(input);
  if (counts.discussion === 0) return "Paste the Discussion text to analyse.";
  if (counts.total > maxWords) return `Together, the supplied texts are longer than ${maxWords.toLocaleString("en-AU")} words.`;
  return null;
}

// A diagnostic is valid only for the exact sources that were analysed: any edit to any source makes it stale.
export function isWorkspaceCurrent(analysed: WorkspaceInput | null, current: WorkspaceInput): boolean {
  if (analysed === null) return false;
  if (analysed.results !== current.results || analysed.discussion !== current.discussion) return false;
  return CONTEXT_FIELDS.every((field) => analysed.context[field] === current.context[field]);
}
