import styles from "./ResearchWorkspace.module.css";

export interface SourceMark {
  id: string;
  start: number;
  end: number;
  tone: "supported" | "beyond" | "conflict" | "unassessable" | "evidence";
  active: boolean;
  dim?: boolean;
  label: string;
}

type Segment = { text: string; mark?: SourceMark };

// Marks never overlap in the output: a mark that would overlap an earlier one is left out (and reported),
// rather than being drawn over another passage.
export function buildMarkSegments(text: string, marks: SourceMark[]): { segments: Segment[]; rendered: Set<string> } {
  const ordered = [...marks].sort((a, b) => a.start - b.start || b.end - a.end);
  const segments: Segment[] = [];
  const rendered = new Set<string>();
  let cursor = 0;
  for (const m of ordered) {
    if (m.start < cursor || m.end > text.length || m.start >= m.end) continue;
    if (m.start > cursor) segments.push({ text: text.slice(cursor, m.start) });
    segments.push({ text: text.slice(m.start, m.end), mark: m });
    rendered.add(m.id);
    cursor = m.end;
  }
  if (cursor < text.length) segments.push({ text: text.slice(cursor) });
  return { segments, rendered };
}

interface Props {
  label: string;
  text: string;
  marks: SourceMark[];
  idPrefix: string;
  onSelect: (id: string) => void;
  onEdit: () => void;
}

export default function SourceAnnotated({ label, text, marks, idPrefix, onSelect, onEdit }: Props) {
  const { segments } = buildMarkSegments(text, marks);
  return (
    <div className={styles.source}>
      <div className={styles.sourceLabel}>
        {label}
        <span className={styles.sourceHint}>read-only · original text preserved</span>
      </div>
      <div className={styles.annotated}>
        {segments.map((s, i) =>
          s.mark ? (
            <mark
              key={i}
              id={`${idPrefix}-${s.mark.id}`}
              className={styles.traceMark}
              data-tone={s.mark.tone}
              data-active={s.mark.active}
              data-dim={s.mark.dim ?? false}
              tabIndex={0}
              role="button"
              aria-label={s.mark.label}
              onClick={() => onSelect(s.mark!.id)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  onSelect(s.mark!.id);
                }
              }}
            >
              {s.text}
            </mark>
          ) : (
            <span key={i}>{s.text}</span>
          ),
        )}
      </div>
      <div className={styles.sourceMeta}>
        <button type="button" className={styles.linkButton} onClick={onEdit}>
          Edit text
        </button>
      </div>
    </div>
  );
}
