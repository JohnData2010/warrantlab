import type { SectionId, SectionOption } from "../lib/types";
import styles from "./Workspace.module.css";

interface Props {
  sections: SectionOption[];
  value: SectionId;
  onChange: (value: SectionId) => void;
  disabled?: boolean;
}

function optionLabel(section: SectionOption): string {
  if (section.supported) return section.label;
  if (section.selectable) return `${section.label} — development preview`;
  return `${section.label} — in development`;
}

export default function SectionSelector({ sections, value, onChange, disabled }: Props) {
  return (
    <label className={styles.selectLabel}>
      <span className={styles.visuallyHidden}>Manuscript section</span>
      <select
        className={styles.select}
        value={value}
        onChange={(e) => onChange(e.target.value as SectionId)}
        disabled={disabled}
      >
        {sections.map((s) => (
          <option key={s.id} value={s.id} disabled={!s.selectable}>
            {optionLabel(s)}
          </option>
        ))}
      </select>
    </label>
  );
}
