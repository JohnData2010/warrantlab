import styles from "./v2/ResearchWorkspace.module.css";

export type WorkspaceMode = "single" | "research";

interface Props {
  value: WorkspaceMode;
  onChange: (mode: WorkspaceMode) => void;
  disabled?: boolean;
}

export default function ModeSwitch({ value, onChange, disabled }: Props) {
  return (
    <div className={styles.modeSwitch} role="group" aria-label="Workspace">
      <button type="button" aria-pressed={value === "single"} onClick={() => onChange("single")} disabled={disabled}>
        Single passage
      </button>
      <button type="button" aria-pressed={value === "research"} onClick={() => onChange("research")} disabled={disabled}>
        Results + Discussion <span className={styles.previewTag}>Research Preview</span>
      </button>
    </div>
  );
}
