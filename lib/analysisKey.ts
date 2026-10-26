import type { SectionId } from "./types";

export interface AnalysisKey {
  section: SectionId;
  text: string;
}

// A diagnostic is only valid for the exact text and section that were analysed.
export function isCurrent(analysed: AnalysisKey | null, current: AnalysisKey): boolean {
  return analysed !== null && analysed.section === current.section && analysed.text === current.text;
}
