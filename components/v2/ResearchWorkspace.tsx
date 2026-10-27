"use client";

import { type ReactNode, useCallback, useEffect, useRef, useState } from "react";
import type { AnalysisResponse } from "../../lib/types";
import {
  type ContextField,
  type WorkspaceInput,
  emptyContext,
  isWorkspaceCurrent,
  workspaceProblem,
  workspaceWordCounts,
} from "../../lib/v2/contract";
import { createRequestGate } from "../../lib/v2/requestGate";
import type { WorkspaceResponse } from "../../lib/v2/types";
import AnnotatedText from "../AnnotatedText";
import DiagnosticPanel from "../DiagnosticPanel";
import ws from "../Workspace.module.css";
import SourceEditor from "./SourceEditor";
import StudyContextPanel from "./StudyContextPanel";
import styles from "./ResearchWorkspace.module.css";

interface Props {
  maxWords: number;
  modeSwitch: ReactNode;
}

const PREVIEW_LABEL = "Research Preview · Results + Discussion · not academically validated";

function initialInput(): WorkspaceInput {
  return { version: 2, results: "", discussion: "", context: emptyContext() };
}

export default function ResearchWorkspace({ maxWords, modeSwitch }: Props) {
  const [input, setInput] = useState<WorkspaceInput>(initialInput);
  const [discussionView, setDiscussionView] = useState<"editing" | "annotated">("editing");
  const [analysing, setAnalysing] = useState(false);
  const [result, setResult] = useState<WorkspaceResponse | null>(null);
  const [requestError, setRequestError] = useState<string | null>(null);
  const [activeFinding, setActiveFinding] = useState<string | null>(null);

  const controllerRef = useRef<AbortController | null>(null);
  const gateRef = useRef(createRequestGate<WorkspaceInput>(isWorkspaceCurrent));
  const latestRef = useRef(input);
  latestRef.current = input;

  const counts = workspaceWordCounts(input);
  const problem = workspaceProblem(input, maxWords);
  const overLimit = counts.total > maxWords;
  const canAnalyse = !analysing && problem === null;

  const clearResults = useCallback(() => {
    controllerRef.current?.abort();
    controllerRef.current = null;
    gateRef.current.invalidate();
    setAnalysing(false);
    setResult(null);
    setRequestError(null);
    setActiveFinding(null);
    setDiscussionView("editing");
  }, []);

  useEffect(() => () => controllerRef.current?.abort(), []);

  // Every source counts: editing Results, Discussion or any Study Context field makes diagnostics stale.
  const update = (next: WorkspaceInput) => {
    setInput(next);
    if (result || requestError || analysing) clearResults();
  };
  const setContextField = (field: ContextField, text: string) => update({ ...input, context: { ...input.context, [field]: text } });

  const runAnalysis = async () => {
    if (!canAnalyse) return;
    controllerRef.current?.abort();
    const controller = new AbortController();
    controllerRef.current = controller;
    const token = gateRef.current.begin();
    const sent = input;
    setAnalysing(true);
    setResult(null);
    setRequestError(null);
    setActiveFinding(null);

    try {
      const response = await fetch("/api/v2/analyse", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(sent),
        signal: controller.signal,
      });
      const body = await response.json();
      if (controller.signal.aborted || !gateRef.current.accepts(token, sent, latestRef.current)) return;
      if (!response.ok) {
        setRequestError(typeof body?.error === "string" ? body.error : "The request could not be processed.");
      } else {
        setResult(body as WorkspaceResponse);
        if ((body as WorkspaceResponse).status === "complete") setDiscussionView("annotated");
      }
    } catch {
      if (controller.signal.aborted || !gateRef.current.accepts(token, sent, latestRef.current)) return;
      setResult({ status: "incomplete", version: 2, reason: "model_error" });
    } finally {
      if (controllerRef.current === controller) {
        controllerRef.current = null;
        setAnalysing(false);
      }
    }
  };

  const focusFinding = (id: string) => {
    setActiveFinding(id);
    setDiscussionView("annotated");
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

  const panelResult: AnalysisResponse | null =
    result === null ? null : result.status === "complete" ? result.discussion : { status: "incomplete", reason: result.reason };
  const findings = result?.status === "complete" ? result.discussion.findings : [];

  const notice = (
    <div className={styles.scopeNotice} role="note">
      <strong>What this preview does so far.</strong> The Discussion is assessed on its own text, using the v0.1 engine. Cross-section
      evidence tracing is not available yet, so the Results and Study Context you supply are kept exactly as typed but are{" "}
      <strong>not used</strong> in the analysis.
    </div>
  );

  return (
    <div className={ws.page}>
      <header className={ws.header}>
        <div className={ws.brand}>
          <span className={ws.wordmark}>WarrantLab</span>
          <span className={ws.descriptor}>Scholarly Argument Intelligence</span>
        </div>
        <div className={ws.controls}>
          {modeSwitch}
          <button type="button" className={ws.primary} onClick={runAnalysis} disabled={!canAnalyse} aria-busy={analysing}>
            {analysing ? "Analysing…" : "Analyse Argument"}
          </button>
        </div>
      </header>

      <main className={ws.grid}>
        <section className={`${ws.manuscript} ${styles.sources}`} aria-label="Manuscript sources">
          <SourceEditor
            id="source-results"
            label="Results"
            hint="optional"
            value={input.results}
            onChange={(results) => update({ ...input, results })}
            placeholder="Paste the Results that the Discussion draws on…"
            words={counts.results}
          />

          {discussionView === "annotated" && result?.status === "complete" ? (
            <AnnotatedText
              text={input.discussion}
              findings={findings}
              activeFinding={activeFinding}
              onSelect={focusCard}
              onEdit={() => setDiscussionView("editing")}
              label="Discussion · read-only"
            />
          ) : (
            <SourceEditor
              id="source-discussion"
              label="Discussion"
              hint="required"
              value={input.discussion}
              onChange={(discussion) => update({ ...input, discussion })}
              placeholder="Paste the Discussion paragraphs to analyse…"
              words={counts.discussion}
              rows={12}
            />
          )}

          <StudyContextPanel value={input.context} onChange={setContextField} />

          <div className={ws.meta}>
            <span className={overLimit ? ws.overLimit : undefined}>
              {counts.total.toLocaleString("en-AU")} / {maxWords.toLocaleString("en-AU")} words in total
            </span>
            {overLimit && (
              <span className={ws.overLimit} role="status">
                Together, the texts are longer than {maxWords.toLocaleString("en-AU")} words. Shorten one of them; nothing has been changed.
              </span>
            )}
          </div>
        </section>

        <aside className={ws.panel} aria-label="Diagnostics">
          <DiagnosticPanel
            analysing={analysing}
            result={panelResult}
            requestError={requestError}
            devPreview={false}
            noSectionAvailable={false}
            activeFinding={activeFinding}
            onShowInText={focusFinding}
            onRetry={runAnalysis}
            previewLabel={PREVIEW_LABEL}
            notice={notice}
          />
        </aside>
      </main>
    </div>
  );
}
