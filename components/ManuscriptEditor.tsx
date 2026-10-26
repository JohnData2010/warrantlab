import styles from "./Workspace.module.css";

interface Props {
  value: string;
  onChange: (value: string) => void;
  words: number;
  maxWords: number;
  sectionLabel: string;
}

export default function ManuscriptEditor({ value, onChange, words, maxWords, sectionLabel }: Props) {
  const over = words > maxWords;
  return (
    <div className={styles.editorWrap}>
      <div className={styles.columnLabel}>Manuscript{sectionLabel ? ` · ${sectionLabel}` : ""}</div>
      <textarea
        className={styles.editor}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Paste one or more paragraphs from your manuscript…"
        aria-label="Manuscript text"
        spellCheck
      />
      <div className={styles.meta}>
        <span className={over ? styles.overLimit : undefined}>
          {words.toLocaleString("en-AU")} / {maxWords.toLocaleString("en-AU")} words
        </span>
        {over && (
          <span className={styles.overLimit} role="status">
            This passage is longer than {maxWords.toLocaleString("en-AU")} words. Choose a shorter passage to analyse; your text has not been changed.
          </span>
        )}
      </div>
    </div>
  );
}
