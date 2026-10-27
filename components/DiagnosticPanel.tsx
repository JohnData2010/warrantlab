import type { ReactNode } from "react";
import type { AnalysisResponse, Finding, UnassessedClaim } from "../lib/types";
import styles from "./Workspace.module.css";

interface Props {
  analysing: boolean;
  result: AnalysisResponse | null;
  requestError: string | null;
  devPreview: boolean;
  noSectionAvailable: boolean;
  activeFinding: string | null;
  onShowInText: (id: string) => void;
  onRetry: () => void;
  // Research Preview only: replaces the development-preview label and adds a notice above the result.
  previewLabel?: string;
  notice?: ReactNode;
}

const CATEGORY_LABEL: Record<Finding["category"], string> = {
  theoretical_overclaim: "Theoretical overclaim",
  causal_overclaim: "Causal overclaim",
};

export const DISCLOSURE =
  "WarrantLab does not save your manuscript or analysis history. This demonstration sends your text to Google’s Gemini API free tier. Google may have human reviewers read free-tier inputs and outputs, and may use them to improve its products. Please do not paste unpublished or confidential research.";

function FindingCard({ finding, active, onShowInText }: { finding: Finding; active: boolean; onShowInText: (id: string) => void }) {
  return (
    <article id={`finding-${finding.id}`} className={styles.finding} data-active={active} aria-label={CATEGORY_LABEL[finding.category]}>
      <div className={styles.findingHead}>
        <span className={styles.category}>{CATEGORY_LABEL[finding.category]}</span>
        {finding.claimSpan && (
          <button type="button" className={styles.linkButton} onClick={() => onShowInText(finding.id)}>
            Show in text
          </button>
        )}
      </div>
      <blockquote className={styles.claimQuote}>“{finding.claimQuote}”</blockquote>

      <div className={styles.warrantCheck}>
        <div className={styles.wcRow}>
          <span className={styles.wcLabel}>Evidence identified</span>
          <p>{finding.evidenceIdentified}</p>
        </div>
        <div className={`${styles.wcRow} ${styles.wcMissing}`}>
          <span className={styles.wcLabel}>Missing warrant</span>
          <p>{finding.missingWarrant}</p>
        </div>
        <div className={styles.wcRow}>
          <span className={styles.wcLabel}>Claim</span>
          <p>{finding.claimSummary}</p>
        </div>
      </div>

      <h4 className={styles.subhead}>What the claim assumes</h4>
      <p>{finding.whatClaimAssumes}</p>
      <h4 className={styles.subhead}>Why this matters</h4>
      <p>{finding.whyItMatters}</p>

      <details className={styles.more}>
        <summary>Evidence still needed</summary>
        <p>{finding.evidenceStillNeeded}</p>
      </details>
      <details className={styles.more}>
        <summary>What to examine</summary>
        <ol>
          {finding.questionsToExamine.map((q, i) => (
            <li key={i}>{q}</li>
          ))}
        </ol>
      </details>

      <p className={styles.status}>Verification status: {finding.verificationStatus}</p>
      <p className={styles.ownership}>Your argument, your decision. No rewritten text.</p>
    </article>
  );
}

function UnassessedSummary({ unassessed }: { unassessed: { count: number | null; items: UnassessedClaim[] } }) {
  if (unassessed.items.length === 0) return null;
  const { count } = unassessed;
  return (
    <section className={styles.neutral} aria-label="Claims that could not be assessed">
      <h3 className={styles.noticeTitle}>
        {count === null ? "Some claims may need evidence not available in the supplied text" : `${count} ${count === 1 ? "claim" : "claims"} could not be assessed`}
      </h3>
      <p>These claims may depend on evidence or methodological details not included here. They have not been classified as overclaims.</p>
      {count !== null && (
        <ul className={styles.unassessedList}>
          {unassessed.items.map((item, i) => (
            <li key={i}>
              <span className={styles.inlineQuote}>“{item.quote}”</span>
              {item.needsOtherSection && <span className={styles.hint}> This claim may require evidence from another section.</span>}
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

function Body(props: Props) {
  const { analysing, result, requestError, noSectionAvailable, activeFinding, onShowInText, onRetry } = props;

  if (analysing) {
    return (
      <div className={styles.neutral} role="status">
        <h3 className={styles.noticeTitle}>Analysing your argument…</h3>
        <p>Step 1 identifies claims and evidence, quoting them exactly. Step 2 checks the inferential link between them. This can take up to a minute.</p>
      </div>
    );
  }
  if (requestError) {
    return (
      <div className={styles.neutral} role="status">
        <h3 className={styles.noticeTitle}>Not analysed</h3>
        <p>{requestError}</p>
      </div>
    );
  }
  if (!result) {
    return (
      <div className={styles.empty}>
        <h2 className={styles.emptyTitle}>Check whether your claims go beyond your evidence.</h2>
        <p>
          Paste a passage and select <strong>Analyse Argument</strong>. WarrantLab highlights claims whose evidence, as presented, does not
          establish them, names the missing warrant, and asks questions to help you judge your own argument. It never rewrites your text.
        </p>
        {noSectionAvailable && <p className={styles.hint}>No manuscript section has passed validation yet, so analysis is not available.</p>}
      </div>
    );
  }
  if (result.status === "incomplete") {
    return (
      <div className={styles.neutral} role="status">
        <h3 className={styles.noticeTitle}>Analysis incomplete</h3>
        <p>Part of the text could not be analysed, so no result is shown. Your text has not been changed.</p>
        {result.reason === "quota" && <p className={styles.hint}>The free daily analysis quota may be used up. Please try again later.</p>}
        {result.reason === "rate_limited" && <p className={styles.hint}>Too many analyses in a short time. Please wait a minute, then try again.</p>}
        <button type="button" className={styles.secondary} onClick={onRetry}>
          Try again
        </button>
      </div>
    );
  }

  if (result.outcome === "overclaim_detected") {
    const n = result.findings.length;
    return (
      <>
        <div className={styles.outcomeHead}>
          <span className={styles.outcomeLabel}>Overclaim detected</span>
          <span className={styles.outcomeCount}>
            {n} {n === 1 ? "finding" : "findings"}
          </span>
        </div>
        {result.findings.map((f) => (
          <FindingCard key={f.id} finding={f} active={activeFinding === f.id} onShowInText={onShowInText} />
        ))}
        {result.limited && <p className={styles.hint}>Showing selected findings from the supplied text. This is not an exhaustive review.</p>}
        <UnassessedSummary unassessed={result.unassessed} />
      </>
    );
  }
  if (result.outcome === "insufficient_evidence") {
    return (
      <>
        <div className={styles.neutral} role="status">
          <h3 className={styles.noticeTitle}>Not enough information to verify these claims</h3>
          <p>The supplied text does not include the findings or methodological detail needed to check the claims below. This is not a judgement about the research itself.</p>
        </div>
        <UnassessedSummary unassessed={result.unassessed} />
      </>
    );
  }
  if (result.reason === "no_in_scope_claims") {
    return (
      <div className={styles.neutral} role="status">
        <h3 className={styles.noticeTitle}>No in-scope claims identified.</h3>
        <p>The supplied text does not contain a substantive claim that can be assessed for claim–evidence alignment. This is not an assessment of the wider manuscript.</p>
      </div>
    );
  }
  return (
    <div className={styles.calm} role="status">
      <h3 className={styles.noticeTitle}>No claim–evidence mismatch identified in the supplied text.</h3>
      <p>This is not a verification of the wider study.</p>
    </div>
  );
}

export default function DiagnosticPanel(props: Props) {
  return (
    <div className={styles.panelInner}>
      <div className={styles.columnLabel}>Diagnostics</div>
      {props.previewLabel ? (
        <p className={styles.preview}>{props.previewLabel}</p>
      ) : (
        props.devPreview && <p className={styles.preview}>Development preview — not yet validated</p>
      )}
      {props.notice}
      <Body {...props} />
      <footer className={styles.panelFooter}>
        <p>Assessment limited to the supplied text. No manuscript-wide verification.</p>
        <p>
          Proof of concept: Discussion analysis has been validated on short fictional passages only. The free AI service is sometimes busy; if an
          analysis is incomplete, please try again.
        </p>
        <p>{DISCLOSURE}</p>
      </footer>
    </div>
  );
}
