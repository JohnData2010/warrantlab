"use client";

import { useState } from "react";
import type { SectionOption } from "../lib/types";
import ModeSwitch, { type WorkspaceMode } from "./ModeSwitch";
import ResearchWorkspace from "./v2/ResearchWorkspace";
import Workspace from "./Workspace";

interface Props {
  sections: SectionOption[];
  maxWords: number;
  researchPreview: boolean;
}

// Both workspaces stay mounted so switching never discards what the user has typed. Neither persists anything.
export default function AppShell({ sections, maxWords, researchPreview }: Props) {
  const [mode, setMode] = useState<WorkspaceMode>("single");
  if (!researchPreview) return <Workspace sections={sections} maxWords={maxWords} />;

  const modeSwitch = <ModeSwitch value={mode} onChange={setMode} />;
  return (
    <>
      <div hidden={mode !== "single"}>
        <Workspace sections={sections} maxWords={maxWords} modeSwitch={modeSwitch} />
      </div>
      <div hidden={mode !== "research"}>
        <ResearchWorkspace maxWords={maxWords} modeSwitch={modeSwitch} />
      </div>
    </>
  );
}
