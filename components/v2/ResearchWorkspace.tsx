"use client";

import { type ReactNode, useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  type ContextField,
  type WorkspaceInput,
  emptyContext,
  isWorkspaceCurrent,
  workspaceProblem,
  workspaceWordCounts,
} from "../../lib/v2/contract";
import { createRequestGate } from "../../lib/v2/requestGate";
import type { TraceResponse } from "../../lib/v2/trace/types";
import ws from "../Workspace.module.css";
import SourceAnnotated, { type SourceMark, buildMarkSegments } from "./SourceAnnotated";
import SourceEditor from "./SourceEditor";
import StudyContextPanel from "./StudyContextPanel";
import TracePanel, { ASSESSMENT_TEXT } from "./TracePanel";
import styles from "./ResearchWorkspace.module.css";

interface Props {
  maxWords: number;
  modeSwitch: ReactNode;
}

type View = "editing" | "annotated";

function initialInput(): WorkspaceInput {
  return { version: 2, results: "", discussion: "", context: emptyContext() };
}

function scrollToElement(id: string) {
  requestAnimationFrame(() => {
    const el = document.getElementById(id);
    el?.scrollIntoView({ block: "center", behavior: "smooth" });
    if (el instanceof HTMLElement && el.tabIndex >= 0) el.focus({ preventScroll: true });
  });
}

export default function ResearchWorkspace({ maxWords, modeSwitch }: Props) {
  const [input, setInput] = useState<WorkspaceInput>(initialInput);
  const [discussionView, setDiscussionView] = useState<View>("editing");
  const [resultsView, setResultsView] = useState<View>("editing");
  const [analysing, setAnalysing] = useState(false);
  const [result, setResult] = useState<TraceResponse | null>(null);
  const [requestError, setRequestError] = useState<string | null>(null);
  const [selectedClaim, setSelectedClaim] = useState<string | null>(null);
  const [activeEvidence, setActiveEvidence] = useState<string | null>(null);

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
    setSelectedClaim(null);
    setActiveEvidence(null);
    setDiscussionView("editing");
    setResultsView("editing");
  }, []);

  useEffect(() => () => controllerRef.current?.abort(), []);

  // Every source counts: editing Results, Discussion or any Study Context field clears all links and highlights.
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
    setSelectedClaim(null);
    setActiveEvidence(null);

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
        const trace = body as TraceResponse;
        setResult(trace);
        if (trace.status === "complete") {
          setDiscussionView("annotated");
          setResultsView(trace.resultsSupplied ? "annotated" : "editing");
        }
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

  const complete = result?.status === "complete" ? result : null;

  // Evidence linked to the selected claim is emphasised; other located evidence stays visible but dimmed.
  const linkedToSelected = useMemo(() => {
    const claim = complete?.claims.find((c) => c.id === selectedClaim);
    return new Set(claim?.links.map((l) => l.evidenceId) ?? []);
  }, [complete, selectedClaim]);

  const claimMarks: SourceMark[] = useMemo(
    () =>
      (complete?.claims ?? []).flatMap((c) =>
        c.location.status === "ambiguous"
          ? []
          : [{ id: c.id, start: c.location.start, end: c.location.end, tone: ASSESSMENT_TEXT[c.assessment].tone, active: c.id === selectedClaim, label: `Claim ${c.id}: show its evidence` }],
      ),
    [complete, selectedClaim],
  );
  const evidenceMarks: SourceMark[] = useMemo(
    () =>
      (complete?.evidence ?? []).flatMap((e) =>
        e.location.status === "ambiguous"
          ? []
          : [
              {
                id: e.id,
                start: e.location.start,
                end: e.location.end,
                tone: "evidence" as const,
                active: e.id === activeEvidence || linkedToSelected.has(e.id),
                dim: selectedClaim !== null && !linkedToSelected.has(e.id),
                label: `Results passage ${e.id}: show the claims it relates to`,
              },
            ],
      ),
    [complete, activeEvidence, linkedToSelected, selectedClaim],
  );

  const highlighted = useMemo(
    () => ({
      claims: buildMarkSegments(input.discussion, claimMarks).rendered,
      evidence: buildMarkSegments(input.results, evidenceMarks).rendered,
    }),
    [input.discussion, input.results, claimMarks, evidenceMarks],
  );

  const showClaim = (id: string) => {
    setSelectedClaim(id);
    setActiveEvidence(null);
    setDiscussionView("annotated");
    scrollToElement(`d-${id}`);
  };
  const selectClaimMark = (id: string) => {
    setSelectedClaim(id);
    setActiveEvidence(null);
    scrollToElement(`claim-card-${id}`);
  };
  const showEvidence = (id: string) => {
    setActiveEvidence(id);
    setResultsView("annotated");
    scrollToElement(`r-${id}`);
  };
  const selectEvidenceMark = (id: string) => {
    setActiveEvidence(id);
    const firstClaim = complete?.claims.find((c) => c.links.some((l) => l.evidenceId === id));
    if (firstClaim) {
      setSelectedClaim(firstClaim.id);
      scrollToElement(`claim-card-${firstClaim.id}`);
    }
  };

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
          {resultsView === "annotated" && complete ? (
            <SourceAnnotated
              label="Results"
              text={input.results}
              marks={evidenceMarks}
              idPrefix="r"
              onSelect={selectEvidenceMark}
              onEdit={() => setResultsView("editing")}
            />
          ) : (
            <SourceEditor
              id="source-results"
              label="Results"
              hint="evidence source"
              value={input.results}
              onChange={(results) => update({ ...input, results })}
              placeholder="Paste the Results that the Discussion draws on…"
              words={counts.results}
            />
          )}

          {discussionView === "annotated" && complete ? (
            <SourceAnnotated
              label="Discussion"
              text={input.discussion}
              marks={claimMarks}
              idPrefix="d"
              onSelect={selectClaimMark}
              onEdit={() => setDiscussionView("editing")}
            />
          ) : (
            <SourceEditor
              id="source-discussion"
              label="Discussion"
              hint="required · claims are assessed here"
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

        <aside className={ws.panel} aria-label="Evidence trace">
          <TracePanel
            analysing={analysing}
            result={result}
            requestError={requestError}
            selectedClaim={selectedClaim}
            activeEvidence={activeEvidence}
            highlighted={highlighted}
            onShowClaim={showClaim}
            onShowEvidence={showEvidence}
            onRetry={runAnalysis}
          />
        </aside>
      </main>
    </div>
  );
}
