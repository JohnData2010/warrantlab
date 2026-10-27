import styles from "./ResearchWorkspace.module.css";

interface Props {
  id: string;
  label: string;
  hint: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  words: number;
  rows?: number;
}

export default function SourceEditor({ id, label, hint, value, onChange, placeholder, words, rows = 9 }: Props) {
  return (
    <div className={styles.source}>
      <label htmlFor={id} className={styles.sourceLabel}>
        {label}
        <span className={styles.sourceHint}>{hint}</span>
      </label>
      <textarea
        id={id}
        className={styles.sourceEditor}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={rows}
        spellCheck
      />
      <div className={styles.sourceMeta}>{words.toLocaleString("en-AU")} words</div>
    </div>
  );
}
