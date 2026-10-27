import { CONTEXT_FIELDS, CONTEXT_FIELD_MAX_CHARS, CONTEXT_LABELS, type ContextField, type StudyContext, filledContextFields } from "../../lib/v2/contract";
import styles from "./ResearchWorkspace.module.css";

interface Props {
  value: StudyContext;
  onChange: (field: ContextField, text: string) => void;
}

export default function StudyContextPanel({ value, onChange }: Props) {
  const filled = filledContextFields(value).length;
  return (
    <details className={styles.context}>
      <summary>
        Study Context <span className={styles.sourceHint}>optional · {filled === 0 ? "none supplied" : `${filled} of ${CONTEXT_FIELDS.length} supplied`}</span>
      </summary>
      <p className={styles.contextNote}>
        Describe only what the study reports. This information is treated as your description of the study, not as verified fact, and a
        method word on its own (for example “randomised”) is never taken as evidence of a design.
      </p>
      {CONTEXT_FIELDS.map((field) => {
        const id = `context-${field}`;
        const over = value[field].length > CONTEXT_FIELD_MAX_CHARS;
        return (
          <div key={field} className={styles.contextField}>
            <label htmlFor={id} className={styles.sourceLabel}>
              {CONTEXT_LABELS[field].label}
            </label>
            <textarea
              id={id}
              className={styles.contextEditor}
              value={value[field]}
              onChange={(e) => onChange(field, e.target.value)}
              placeholder={CONTEXT_LABELS[field].prompt}
              rows={2}
            />
            {over && (
              <span className={styles.overLimit} role="status">
                Keep this field under {CONTEXT_FIELD_MAX_CHARS.toLocaleString("en-AU")} characters.
              </span>
            )}
          </div>
        );
      })}
    </details>
  );
}
