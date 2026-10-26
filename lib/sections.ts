import type { SectionId, SectionOption } from "./types";

interface SectionDefinition {
  id: SectionId;
  label: string;
  priority: "P0" | "P1";
  // Set to true only from a passing gate report in eval/reports/ (see prd.md > Section Validation Gate).
  supported: boolean;
  // Local development only (WARRANTLAB_DEV_PREVIEW=true); never advertised in a release build.
  devPreview: boolean;
  guidance: string;
}

export const SECTIONS: SectionDefinition[] = [
  {
    id: "abstract",
    label: "Abstract",
    priority: "P1",
    supported: false,
    devPreview: false,
    guidance:
      "An abstract compresses the whole study. Check whether stated conclusions and contributions go beyond the evidence it summarises, but remember that abstracts rarely contain full evidence, so prefer abstaining when the support may sit in the full paper.",
  },
  {
    id: "introduction",
    label: "Introduction",
    priority: "P0",
    supported: false,
    devPreview: false,
    guidance:
      "An introduction motivates the study: research gaps, novelty and significance. Check whether claims are supported within the supplied text. Never judge whether a literature gap really exists, because that requires literature not supplied here.",
  },
  {
    id: "literature_review",
    label: "Literature Review / Theoretical Background",
    priority: "P1",
    supported: false,
    devPreview: false,
    guidance:
      "A literature review synthesises prior work and theory. Check for claims about prior research or theory that go beyond what the supplied text presents. Never confirm or deny the content of sources that are not supplied.",
  },
  {
    id: "hypotheses",
    label: "Hypotheses / Theory Development",
    priority: "P1",
    supported: false,
    devPreview: false,
    guidance:
      "Theory development justifies hypothesised relationships. Check whether the theoretical reasoning supplied actually leads to the direction and form of each hypothesis.",
  },
  {
    id: "methodology",
    label: "Methodology",
    priority: "P1",
    supported: false,
    devPreview: false,
    guidance:
      "A methodology section describes design, sample and measures. Check whether claims about validity, representativeness or causal identification go beyond the design as described.",
  },
  {
    id: "results",
    label: "Results / Findings",
    priority: "P0",
    supported: false,
    devPreview: false,
    guidance:
      "A results section reports what the data show. Check whether the interpretation of statistical or qualitative evidence goes beyond what the reported results support, for example treating an association as an effect or a non-significant result as evidence of no effect.",
  },
  {
    id: "discussion",
    label: "Discussion",
    priority: "P0",
    supported: false,
    devPreview: true,
    guidance:
      "A discussion interprets findings and relates them to theory. Check whether theoretical interpretations, proposed mechanisms or claims of theory validation go beyond the empirical findings presented. Evidence for a claim may legitimately appear earlier in the paper; when the supplied text does not contain it, abstain rather than flag.",
  },
  {
    id: "conclusion",
    label: "Conclusion",
    priority: "P1",
    supported: false,
    devPreview: false,
    guidance:
      "A conclusion states contributions and implications. Check whether generalisations and claimed contributions go beyond the evidence and limits presented in the supplied text.",
  },
];

export function getSection(id: SectionId): SectionDefinition {
  const section = SECTIONS.find((s) => s.id === id);
  if (!section) throw new Error(`Unknown section: ${id}`);
  return section;
}

export function isSelectable(section: SectionDefinition, devPreviewEnabled: boolean): boolean {
  return section.supported || (section.devPreview && devPreviewEnabled);
}

export function getSectionOptions(devPreviewEnabled: boolean): SectionOption[] {
  return SECTIONS.map((s) => ({
    id: s.id,
    label: s.label,
    supported: s.supported,
    devPreview: s.devPreview,
    selectable: isSelectable(s, devPreviewEnabled),
  }));
}
