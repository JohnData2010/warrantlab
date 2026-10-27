import type { Finding } from "../lib/types";
import styles from "./Workspace.module.css";

interface Props {
  text: string;
  findings: Finding[];
  activeFinding: string | null;
  onSelect: (id: string) => void;
  onEdit: () => void;
  label?: string;
}

type Segment = { text: string; findingId?: string };

export function buildSegments(text: string, findings: Finding[]): Segment[] {
  const marks = findings
    .filter((f) => f.claimSpan)
    .map((f) => ({ id: f.id, ...f.claimSpan! }))
    .sort((a, b) => a.start - b.start);
  const segments: Segment[] = [];
  let cursor = 0;
  for (const m of marks) {
    if (m.start < cursor || m.end > text.length) continue;
    if (m.start > cursor) segments.push({ text: text.slice(cursor, m.start) });
    segments.push({ text: text.slice(m.start, m.end), findingId: m.id });
    cursor = m.end;
  }
  if (cursor < text.length) segments.push({ text: text.slice(cursor) });
  return segments;
}

export default function AnnotatedText({ text, findings, activeFinding, onSelect, onEdit, label = "Manuscript · read-only" }: Props) {
  return (
    <div className={styles.annotatedWrap}>
      <div className={styles.columnLabel}>{label}</div>
      <div className={styles.annotated}>
        {buildSegments(text, findings).map((segment, i) =>
          segment.findingId ? (
            <mark
              key={i}
              id={`mark-${segment.findingId}`}
              className={styles.mark}
              data-active={activeFinding === segment.findingId}
              tabIndex={0}
              role="button"
              aria-label="Show the finding for this claim"
              onClick={() => onSelect(segment.findingId!)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  onSelect(segment.findingId!);
                }
              }}
            >
              {segment.text}
            </mark>
          ) : (
            <span key={i}>{segment.text}</span>
          ),
        )}
      </div>
      <div className={styles.meta}>
        <span>Original text preserved</span>
        <button type="button" className={styles.linkButton} onClick={onEdit}>
          Edit text
        </button>
      </div>
    </div>
  );
}
