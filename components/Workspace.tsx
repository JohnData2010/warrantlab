"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { isCurrent } from "../lib/analysisKey";
import { countWords } from "../lib/text/wordCount";
import type { AnalysisResponse, SectionId, SectionOption } from "../lib/types";
import AnnotatedText from "./AnnotatedText";
import DiagnosticPanel from "./DiagnosticPanel";
import ManuscriptEditor from "./ManuscriptEditor";
import SectionSelector from "./SectionSelector";
import styles from "./Workspace.module.css";

interface Props {
  sections: SectionOption[];
  maxWords: number;
}

function defaultSection(sections: SectionOption[]): SectionId {
  const discussion = sections.find((s) => s.id === "discussion" && s.selectable);
  return (discussion ?? sections.find((s) => s.selectable) ?? sections.find((s) => s.id === "discussion") ?? sections[0]).id;
}

export default function Workspace({ sections, maxWords }: Props) {
  const [section, setSection] = useState<SectionId>(() => defaultSection(sections));
  const [text, setText] = useState("");
  const [mode, setMode] = useState<"editing" | "annotated">("editing");
  const [analysing, setAnalysing] = useState(false);
  const [result, setResult] = useState<AnalysisResponse | null>(null);
  const [requestError, setRequestError] = useState<string | null>(null);
  const [activeFinding, setActiveFinding] = useState<string | null>(null);

  const controllerRef = useRef<AbortController | null>(null);
  const latestRef = useRef({ section, text });
  latestRef.current = { section, text };

  const selected = sections.find((s) => s.id === section);
  const words = countWords(text);
  const overLimit = words > maxWords;
  const canAnalyse = !analysing && words > 0 && !overLimit && Boolean(selected?.selectable);

  const clearResults = useCallback(() => {
    controllerRef.current?.abort();
    controllerRef.current = null;
    setAnalysing(false);
    setResult(null);
    setRequestError(null);
    setActiveFinding(null);
    setMode("editing");
  }, []);

  useEffect(() => () => controllerRef.current?.abort(), []);

  const handleTextChange = (value: string) => {
    setText(value);
    if (result || requestError || analysing) clearResults();
  };

  const handleSectionChange = (value: SectionId) => {
    setSection(value);
    clearResults();
  };

  const runAnalysis = async () => {
    if (!canAnalyse) return;
    controllerRef.current?.abort();
    const controller = new AbortController();
    controllerRef.current = controller;
    const sent = { section, text };
    setAnalysing(true);
    setResult(null);
    setRequestError(null);
    setActiveFinding(null);

    try {
      const response = await fetch("/api/analyse", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(sent),
        signal: controller.signal,
      });
      const body = await response.json();
      if (controller.signal.aborted || !isCurrent(sent, latestRef.current)) return;
      if (!response.ok) {
        setRequestError(typeof body?.error === "string" ? body.error : "The request could not be processed.");
      } else {
        setResult(body as AnalysisResponse);
        if ((body as AnalysisResponse).status === "complete") setMode("annotated");
      }
    } catch {
      if (controller.signal.aborted || !isCurrent(sent, latestRef.current)) return;
      setResult({ status: "incomplete", reason: "model_error" });
    } finally {
      if (controllerRef.current === controller) {
        controllerRef.current = null;
        setAnalysing(false);
      }
    }
  };

  const focusFinding = (id: string) => {
    setActiveFinding(id);
    setMode("annotated");
    requestAnimationFrame(() => {
      const mark = document.getElementById(`mark-${id}`);
      mark?.scrollIntoView({ block: "center", behavior: "smooth" });
      mark?.focus({ preventScroll: true });
    });
  };

  const focusCard = (id: string) => {
    setActiveFinding(id);
    requestAnimationFrame(() => document.getElementById(`finding-${id}`)?.scrollIntoView({ block: "nearest", behavior: "smooth" }));
  };

  const findings = result?.status === "complete" ? result.findings : [];

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <div className={styles.brand}>
          <span className={styles.wordmark}>WarrantLab</span>
          <span className={styles.descriptor}>Scholarly Argument Intelligence</span>
        </div>
        <div className={styles.controls}>
          <SectionSelector sections={sections} value={section} onChange={handleSectionChange} disabled={analysing} />
          <button type="button" className={styles.primary} onClick={runAnalysis} disabled={!canAnalyse} aria-busy={analysing}>
            {analysing ? "Analysing…" : "Analyse Argument"}
          </button>
        </div>
      </header>

      <main className={styles.grid}>
        <section className={styles.manuscript} aria-label="Manuscript">
          {mode === "annotated" && result?.status === "complete" ? (
            <AnnotatedText
              text={text}
              findings={findings}
              activeFinding={activeFinding}
              onSelect={focusCard}
              onEdit={() => setMode("editing")}
            />
          ) : (
            <ManuscriptEditor value={text} onChange={handleTextChange} words={words} maxWords={maxWords} sectionLabel={selected?.label ?? ""} />
          )}
        </section>

        <aside className={styles.panel} aria-label="Diagnostics">
          <DiagnosticPanel
            analysing={analysing}
            result={result}
            requestError={requestError}
            devPreview={Boolean(selected && selected.selectable && !selected.supported)}
            noSectionAvailable={!sections.some((s) => s.selectable)}
            activeFinding={activeFinding}
            onShowInText={focusFinding}
            onRetry={runAnalysis}
          />
        </aside>
      </main>
    </div>
  );
}
