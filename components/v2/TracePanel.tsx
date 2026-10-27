import { CONTEXT_LABELS } from "../../lib/v2/contract";
import type { PreliminaryAssessment, TraceClaim, TraceEvidence, TraceResponse } from "../../lib/v2/trace/types";
import { DISCLOSURE } from "../DiagnosticPanel";
import styles from "./ResearchWorkspace.module.css";

interface Props {
  analysing: boolean;
  result: TraceResponse | null;
  requestError: string | null;
  selectedClaim: string | null;
  activeEvidence: string | null;
  highlighted: { claims: Set<string>; evidence: Set<string> };
  onShowClaim: (id: string) => void;
  onShowEvidence: (id: string) => void;
  onRetry: () => void;
}

export const ASSESSMENT_TEXT: Record<PreliminaryAssessment, { label: string; tone: "supported" | "beyond" | "conflict" | "unassessable" }> = {
  supported_as_stated: { label: "Linked evidence appears to support the claim as stated", tone: "supported" },
  goes_beyond_evidence: { label: "The claim may go beyond the linked evidence", tone: "beyond" },
  conflicts_with_evidence: { label: "The claim appears to conflict with the reported evidence", tone: "conflict" },
  cannot_assess: { label: "Cannot be assessed from the supplied text", tone: "unassessable" },
};

const KIND_LABEL: Record<TraceClaim["kind"], string> = {
  mechanism_or_theory: "Mechanism or theory claim",
  causal: "Causal claim",
  generalisation: "Generalisation",
  interpretive: "Interpretive claim",
  other: "Claim",
};

const INCOMPLETE_HINT: Partial<Record<string, string>> = {
  quota: "The free daily analysis quota may be used up. Please try again later.",
  rate_limited: "Too many analyses in a short time. Please wait a minute, then try again.",
  timeout: "The AI service took too long to respond.",
  fabricated_span: "The AI returned a quotation that could not be found in your text, so nothing was shown.",
  invalid_output: "The AI returned output that failed WarrantLab's consistency checks, so nothing was shown.",
  coverage: "The AI did not cover every paragraph or claim, so nothing was shown.",
};

function linkStatusText(claim: TraceClaim): string {
  if (claim.linkStatus === "results_not_supplied") return "No Results supplied";
  if (claim.linkStatus === "no_relevant_evidence_located") return "No relevant Results evidence located";
  return `Linked Results evidence (${claim.links.length})`;
}

function ClaimCard({ claim, evidence, props }: { claim: TraceClaim; evidence: Map<string, TraceEvidence>; props: Props }) {
  const a = ASSESSMENT_TEXT[claim.assessment];
  const claimShown = props.highlighted.claims.has(claim.id);
  return (
    <article id={`claim-card-${claim.id}`} className={styles.claimCard} data-tone={a.tone} data-active={props.selectedClaim === claim.id}>
      <div className={styles.cardHead}>
        <span className={styles.kind}>{KIND_LABEL[claim.kind]}</span>
        {claimShown ? (
          <button type="button" className={styles.linkButton} onClick={() => props.onShowClaim(claim.id)}>
            Show in Discussion
          </button>
        ) : (
          <span className={styles.sourceHint}>{claim.location.status === "ambiguous" ? "Appears more than once; not highlighted" : "Not highlighted"}</span>
        )}
      </div>
      <blockquote className={styles.quote}>“{claim.quote}”</blockquote>

      <div className={styles.linkBlock} data-linked={claim.linkStatus === "linked"}>
        <span className={styles.rowLabel}>{linkStatusText(claim)}</span>
        {claim.links.length > 0 && (
          <ul className={styles.evidenceList}>
            {claim.links.map((link) => {
              const ev = evidence.get(link.evidenceId)!;
              const shown = props.highlighted.evidence.has(ev.id);
              return (
                <li key={link.evidenceId} data-active={props.activeEvidence === ev.id}>
                  <span className={styles.inlineQuote}>“{ev.quote}”</span>
                  <span className={styles.relevance}>{link.relevance === "direct" ? "Direct" : "Partial"}</span>
                  <span className={styles.role}>{link.role}</span>
                  {shown ? (
                    <button type="button" className={styles.linkButton} onClick={() => props.onShowEvidence(ev.id)}>
                      Show in Results
                    </button>
                  ) : (
                    <span className={styles.sourceHint}>
                      {ev.location.status === "ambiguous" ? "This wording appears more than once in Results; not highlighted" : "Overlaps another passage; not highlighted"}
                    </span>
                  )}
                </li>
              );
            })}
          </ul>
        )}
      </div>

      <div className={styles.assessment} data-tone={a.tone}>
        <span className={styles.rowLabel}>Preliminary assessment</span>
        <strong>{a.label}</strong>
        <p>{claim.relationshipExplanation}</p>
        {claim.gapExplanation && (
          <p>
            <span className={styles.rowLabel}>Missing warrant</span>
            {claim.gapExplanation}
          </p>
        )}
        {claim.missingInformation && (
          <p>
            <span className={styles.rowLabel}>Information not in the supplied text</span>
            {claim.missingInformation}
          </p>
        )}
        {claim.assessment === "conflicts_with_evidence" && (
          <p className={styles.sourceHint}>This concerns the evidence reported here. It does not show that the effect itself does not exist.</p>
        )}
        {claim.linkStatus !== "linked" && (
          <p className={styles.sourceHint}>Not locating evidence in the supplied Results does not mean the claim is wrong.</p>
        )}
      </div>

      {claim.contextFieldsUsed.length > 0 && (
        <p className={styles.contextUsed}>
          Relied on your Study Context (your description, not verified): {claim.contextFieldsUsed.map((f) => CONTEXT_LABELS[f].label).join(", ")}
        </p>
      )}
      {claim.uncertaintyNote && <p className={styles.sourceHint}>{claim.uncertaintyNote}</p>}
    </article>
  );
}

function Body(props: Props) {
  const { analysing, result, requestError, onRetry } = props;
  if (analysing) {
    return (
      <div className={styles.state} role="status">
        <h3>Analysing…</h3>
        <p>Step 1 finds claims in the Discussion and results in the Results, quoting both exactly. Step 2 relates each claim to the evidence. This can take up to a minute.</p>
      </div>
    );
  }
  if (requestError) {
    return (
      <div className={styles.state} role="status">
        <h3>Not analysed</h3>
        <p>{requestError}</p>
      </div>
    );
  }
  if (!result) {
    return (
      <div className={styles.state}>
        <h3>Trace your Discussion claims to your Results.</h3>
        <p>Paste the Results and the Discussion, optionally describe the study, then select Analyse Argument.</p>
      </div>
    );
  }
  if (result.status === "incomplete") {
    return (
      <div className={styles.state} data-tone="incomplete" role="status">
        <h3>Analysis incomplete</h3>
        <p>No links or assessments are shown. This is a problem with the AI service or its output, not a judgement about your text.</p>
        {INCOMPLETE_HINT[result.reason] && <p className={styles.sourceHint}>{INCOMPLETE_HINT[result.reason]}</p>}
        <button type="button" className={styles.secondary} onClick={onRetry}>
          Try again
        </button>
      </div>
    );
  }
  if (result.claims.length === 0) {
    return (
      <div className={styles.state} role="status">
        <h3>No inferential claims identified in the Discussion.</h3>
        <p>This is not an assessment of the wider manuscript.</p>
      </div>
    );
  }
  const evidence = new Map(result.evidence.map((e) => [e.id, e]));
  const linked = result.claims.filter((c) => c.linkStatus === "linked").length;
  const unlinked = result.claims.length - linked;
  return (
    <>
      <div className={styles.summary}>
        <strong>
          {result.claims.length} {result.claims.length === 1 ? "claim" : "claims"}
        </strong>
        <span>{linked} linked to Results evidence</span>
        {unlinked > 0 && <span>{unlinked} without located evidence</span>}
        <span>
          {result.evidence.length} Results {result.evidence.length === 1 ? "passage" : "passages"} found
        </span>
      </div>
      {result.claims.map((c) => (
        <ClaimCard key={c.id} claim={c} evidence={evidence} props={props} />
      ))}
    </>
  );
}

export default function TracePanel(props: Props) {
  return (
    <div className={styles.panelInner}>
      <div className={styles.panelLabel}>Evidence trace</div>
      <p className={styles.previewBadge}>Research Preview · not academically validated</p>
      <div className={styles.scopeNotice} role="note">
        Claims come only from the Discussion and evidence only from the Results. A highlighted passage shows <em>where</em> the text says something,
        not that it is correct. Assessments are preliminary and do not yet apply method-specific standards. Study Context is your own
        description and is not verified.
      </div>
      <Body {...props} />
      <footer className={styles.panelFooter}>
        <p>Assessment limited to the supplied text. No manuscript-wide verification.</p>
        <p>{DISCLOSURE}</p>
      </footer>
    </div>
  );
}
