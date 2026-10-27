# WarrantLab Research Roadmap (2026–2027)

*Status: draft for independent research review. Version 0.1, prepared 27 October 2026 (AEDT). Governance wording revised on the same day (see "Project status" below).*

**Project status.** WarrantLab is the project owner's **independent personal research project**:
- It is not part of a university research programme. There are no supervisors, and the project is not institutionally governed or funded.
- The project owner is responsible for its scientific direction and makes all final research decisions.
- External IS scholars are treated as potential reviewers, advisers or future collaborators.
- Ethics, participant protection, data governance and intellectual property are assessed when they become relevant. No existing institutional pathway is assumed.

This document sets out a research programme, not a product plan. It records what the frozen proof of concept has and has not shown, the questions the programme should investigate, and the dependencies that must be resolved before those questions can be studied responsibly. Nothing here commits the programme to a feature, a theory, or a study design until the open decisions in §12 are resolved.

## Epistemic labels used in this document

Every substantive statement carries one of these labels:

- **[Verified]**: checked against a primary source or a committed project artefact (reference given).
- **[Hypothesis]**: a claim the programme intends to test. It is not established.
- **[Proposed principle]**: a candidate design principle, to be justified and evaluated.
- **[Open question]**: unresolved and requiring a research decision by the project owner, or further investigation.
- **[Plan]**: an intended activity, which depends on the conditions stated.

Bibliographic details for every external source are tracked in [`SOURCES.md`](SOURCES.md) together with their verification status. Decisions taken so far are logged in [`DECISIONS.md`](DECISIONS.md).

---

## 1. Research vision and problem

**Working title:** *WarrantLab 2027: an AI-assisted research environment for evidence-grounded scholarly reasoning.*

**Problem.** In empirical Information Systems (IS) research, conclusions are often stated more strongly than the evidence presented for them warrants. Examples include treating a group difference as proof of a theoretical mechanism, an association as causation, or a single study as validation of a whole theory. These *inferential gaps* are hard for authors to see in their own writing, and they are costly when reviewers find them late. **[Hypothesis]** that the problem is common and consequential enough to justify a dedicated system; this has not yet been established by systematic evidence.

**Vision.** WarrantLab aims to help researchers make the inferential path from evidence to claim **traceable** (every diagnostic points to exact source text), **contestable** (the researcher can dispute a diagnostic, supply evidence from elsewhere, and record their reasoning), and **method-aware** (what counts as adequate warrant depends on the research design). The researcher remains responsible for the argument. The system does not rewrite text or generate arguments.

**Guiding question.** *How should an information system be designed so that people can trace, interrogate and take responsibility for their own scientific inferences?* **[Open question]**, and the long-term orientation of the programme.

The programme starts in IS because that is the researcher's discipline and because IS has an established design-science tradition (§4). Whether the principles generalise to other fields is itself an **[Open question]**.

## 2. Current evidence: what the frozen POC shows

The hackathon proof of concept is frozen at Git tag `hackathon-poc-v0.1` (commit `6e5448b`). Its full evaluation record, including failures, is in `eval/GATE-SUMMARY.md` and `eval/reports/`.

### 2.1 Demonstrated [Verified]

- **Engine.** A two-pass pipeline (Extract → deterministic verification → Judge → verification → aggregation) using `gemini-3.1-flash-lite` on the Gemini API free tier. It returns one of three outcomes (`overclaim_detected`, `no_overclaim_identified`, `insufficient_evidence`) or `analysis_incomplete`. Every highlighted span is checked against the original text, and quoted evidence that cannot be found causes a retry and then `analysis_incomplete`.
- **Amended academic gate** (learner-approved, post hoc): on three fictional Discussion fixtures (TC1 theoretical overclaim, TC2 calibrated claim, TC3 claim without evidence), each fixture produced 3 completed and correct evaluations, with 0 academic failures. 2 of 11 attempts failed with provider 503 errors and were shown to the user as incomplete.
- **The original strict gate (3 of 3 end-to-end runs in one report) did not pass.**
- **Single-run supporting checks:** a calibrated claim whose evidence is two paragraphs earlier was not misclassified as unassessable, and a purely structural passage returned `no_in_scope_claims`.
- **A real browser revision loop worked** (overclaim → author edits → no overclaim), with latencies of 50–90 s per analysis during provider congestion.

### 2.2 Not established

- **General accuracy.** The fixtures are a smoke test: three short fictional paragraphs written by the project team. They show nothing about performance on real manuscripts, other research designs, other sections, or long input.
- **Novelty or superiority** over existing systems or a well-prompted general-purpose LLM. No baseline comparison has been run.
- **Usefulness to researchers.** No user or expert evaluation has been conducted.
- **Several fixtures** (multi-paragraph with two overclaims, strong-wording calibrated, irrelevant-edit stability, causal) **have not been run on the final configuration.**
- **A known weakness:** on one multi-paragraph fixture, the extraction stage did not link evidence in paragraph 1 to claims in paragraph 3. The design relies on the Judge, which sees the full text, to compensate. This has not been evaluated.

### 2.3 Constraints inherited from the POC [Verified]

- The free tier allows only a small number of requests a day, depending on the model, and was intermittently unavailable (503/504).
- Under the free-tier terms, Google may use submitted content and have it reviewed by people. The POC therefore discloses this and is limited to fictional text. **Unpublished manuscripts must not be processed under the current configuration.**

## 3. Research positioning and competing systems

The programme should not claim novelty until it has mapped existing work systematically. Several of the components already exist in the research literature or in commercial products.

| System or work | What it does (as reported) | Status of our knowledge |
|---|---|---|
| **Critical Inker** (Hugenroth, Danry & Maes, 2026, arXiv:2604.07167) | A multi-stage pipeline: atomic-quote argument graphs with independent and joined support, per-relation validity checking (assuming the evidence is true), visual feedback and a Socratic chatbot. Evaluated on essay and NLI data (n = 100 each), plus a pilot with n = 7. | Full text read (agent-assisted; see `SOURCES.md` for provenance). **Substantial overlap with WarrantLab.** See `literature/CRITICAL-INKER-ANALYSIS.md`. Preprint; no venue listed. |
| **Thesify** | Commercial reviewer-style feedback on manuscripts across argument, methodology, evidence and structure, without rewriting. | Product claims only. Its method and evaluation are unknown. |
| Academic writing assistants (e.g. Trinka, Writefull, Paperpal) | Mainly language-level editing, with some structural feedback. | Product claims only. They are not argument-level. |
| General-purpose LLMs with a careful prompt | Can identify the TC1 overclaim. The POC itself shows a small model doing so. | **This must be treated as the strongest baseline.** |
| Argument mining and argumentation-scheme research | Computational identification of claims, premises and argument structure. | Not yet reviewed for this roadmap. **[Plan]** to include in the positioning review. |
| **CLAIMCHECK** (Ou et al., 2025, Findings of EMNLP) | An expert-annotated benchmark linking reviewer weaknesses to the paper claims they dispute (NeurIPS, 41 papers), with a multi-label weakness ontology. LLMs underperform humans at grounded critique. | Read (agent-assisted). See `literature/NOVELTY-POSITIONING.md`. |
| **Isch et al.** (2026, Nature Human Behaviour) | Design-conditioned causal overreach in 194,631 cross-sectional social-science articles (≈46% of titles and abstracts); a reader experiment (N = 1,105); LLM summaries amplify overstatement. | Read (agent-assisted, main text and Methods). Strengthens the problem statement and is close to C1. See `NOVELTY-POSITIONING.md`. |
| **CliniFact** (Zhang et al., 2025, Scientific Data) | 1,970 clinical claim–evidence pairs, including a not-enough-information label (derived from link type). | Read (agent-assisted). Abstention has precedent. |

**Candidate points of difference.** All are **[Hypothesis]**, to be tested against the systems above rather than asserted:

1. **Inference accountability rather than writing feedback.** The diagnosis concerns a specific inferential step (evidence → warrant → claim), not prose quality or general "logic problems".
2. **Verifiable traceability.** Every diagnostic is grounded in exact, checkable spans, and the system abstains when the supplied text cannot support a judgement.
3. **Cross-section traceability.** A claim in a Discussion can be linked to, or found unsupported by, specific results in a Results section.
4. **Method awareness.** What counts as adequate warrant depends on the research design.
5. **Contestability.** Researchers can dispute diagnostics, and both the dispute and the final human decision are recorded.

**Novelty uncertainties [Open question].** Critical Inker may already cover points 1, 2 or 5 in substance. Whether point 3 or 4 is distinctive depends on a full reading of the related work. If WarrantLab's distinctive contribution turns out to be narrow, the programme should say so and focus on the evaluation and design knowledge rather than on artefact novelty.

## 4. Candidate research questions and contributions to IS

The programme distinguishes **design-science contributions** (artefacts, design principles, evaluation evidence) from **behavioural contributions** (how people reason, learn and rely on such systems). Design science research (DSR) is the established IS tradition for the former (Hevner et al., 2004; Peffers et al., 2007; Gregor & Hevner, 2013; see `SOURCES.md`).

| | Candidate question | Contribution type |
|---|---|---|
| **RQ1** | How can an AI-assisted information system make the inferential relationships between scholarly claims and evidence traceable, contestable and methodologically appropriate? | Design science: design principles and an instantiated artefact |
| **RQ2** | How reliably can domain experts identify and classify inferential gaps in IS writing, and where do they disagree? | Foundational and measurement: taxonomy, codebook, agreement evidence |
| **RQ3** | How does warrant-centred AI diagnosis compare with strong baselines (including a well-prompted general-purpose LLM) on expert-labelled cases? | Design science evaluation |
| **RQ4** | Under what conditions does warrant-centred AI feedback improve researchers' independent argument evaluation, rather than encourage reliance on AI judgements? | Behavioural |

All four are **[Open question]**: their wording, scope and order are subject to independent research review. RQ2 is a prerequisite for RQ3.

**Revision (27 Oct 2026).** The research priorities were set after the novelty review (`literature/NOVELTY-POSITIONING.md` §4):
- Method-conditioned evidential calibration (C1) is the core.
- Abstention (C2) and evidence traceability (C3) are supporting design mechanisms.
- Contestability (C4) is a longer-term direction.

A single central question for Study A is proposed in `CONCEPT-NOTE.md`. Without an agreed and reasonably reliable labelling scheme, the system cannot be evaluated meaningfully.

## 5. Provisional taxonomy of scholarly inferential gaps

**Status: provisional, version 0.1.** It is drafted from the POC fixtures and common methodological critique and has not yet been grounded in a systematic literature review or tested with experts. Category boundaries, names and granularity are expected to change.

Conceptual starting point: Toulmin's (1958) distinction between *data* (evidence), *claim* and *warrant*. Whether Toulmin's model, argumentation schemes, or another framework is the most suitable lens is an **[Open question]** (§12).

### 5.1 Candidate gap types

| ID | Candidate gap | Definition (draft) | Illustrative pattern |
|---|---|---|---|
| G1 | Mechanism leap | An observed difference or association is presented as establishing a specific explanatory mechanism, without evidence linking the mechanism to the outcome. | "The group difference proves that X is the mechanism." |
| G2 | Theory-validation leap | A finding is presented as validating, confirming or fully explaining a theory, beyond what the evidence can support. | "This confirms that theory T fully explains Y." |
| G3 | Causal leap | An association is presented as causation without a design or analysis that supports causal identification. | "The correlation shows that X causes Y." |
| G4 | Construct leap | Evidence about a proxy, manipulated condition or measure is treated as evidence about the theoretical construct itself, without addressing operationalisation. | A sharing-policy manipulation is treated as a measured norm violation. |
| G5 | Scope leap | Conclusions are extended beyond the sampled population, context, time or platform. | "…across all platforms." |
| G6 | Statistical-inference leap | Statistical results are over-interpreted, e.g. significance read as importance, or non-significance as evidence of no effect. | "No significant difference, so X has no effect." |
| G7 | Contribution leap | Claimed theoretical or practical contributions exceed what the reported findings support. | A single association is presented as a new theory. |

### 5.2 Non-gap and abstention categories

| ID | Category | Definition (draft) |
|---|---|---|
| N1 | Calibrated claim | The claim stays within the limits of the evidence presented, including explicit hedging or stated limits. |
| N2 | Unassessable: evidence elsewhere | A substantive claim whose evidence is likely to be in another section or source not supplied. This is not a gap. |
| N3 | Unassessable: no evidence presented | A substantive claim with no assessable evidence in the supplied text. This is not automatically a gap. |
| N4 | Out of scope | Structural or descriptive statements that are not inferential claims. |

### 5.3 Known boundary problems [Open question]

- Whether G1 and G2 are distinct, or degrees of one category.
- How method shapes the categories. For example, G3 may not apply in the same way to interpretive qualitative research, and design science research has its own warrant structures.
- Whether *strength of language* ("prove", "clearly") should ever count as a gap in itself. The POC treats it as insufficient on its own.
- Whether expert disagreement about a case reflects an unclear definition or a genuinely contestable inference. **The programme should not assume disagreement is always a flaw in the taxonomy.** Contestable inferences may be a substantive finding.

## 6. Expert annotation protocol and benchmark design

### 6.1 Annotation task [Plan, draft]

For each item (a paragraph, or a paired Results and Discussion excerpt), annotators work independently and:

1. Mark claim spans and evidence spans.
2. For each claim, decide: gap (with gap type), calibrated, unassessable (with reason), or out of scope.
3. Write the missing warrant in their own words, where they identify a gap.
4. Rate their confidence, and optionally note why the case is contestable.

The protocol skeleton is in [`annotation/PROTOCOL.md`](annotation/PROTOCOL.md).

### 6.2 Feasibility pilot (Phase 3) [Plan]

- **Purpose:** to test whether the definitions are usable, whether categories can be distinguished, and where disagreement concentrates. **The purpose is not to establish reliability.**
- **Scale:** 2–3 IS researchers, roughly 30–40 items (to be decided). Items mix synthetic variants with excerpts whose reuse is permitted.
- **Analysis:** agreement statistics reported descriptively (e.g. Krippendorff's α for categories, span-overlap agreement), together with qualitative analysis of disagreements and codebook revisions.
- **Limitation, stated in advance:** results from 2–3 annotators cannot support claims of generalisable inter-rater reliability.

### 6.3 Larger benchmark (later phase) [Plan, conditional on pilot]

- The number of annotators and items is to be set from the pilot's variance and the precision required, not fixed in advance.
- Stratify items by research design (at least two designs first, e.g. experimental and observational quantitative), by section, by length, and by phrasing.
- Keep the full distribution of expert judgements, not only an adjudicated gold label, so that contested cases can be analysed.
- Record the licence status of every source excerpt. Synthetic variants are clearly marked and are never presented as errors by the original authors.
- **[Open question]** Whether expert annotation counts as human research requiring ethics review, and which review pathway is available to an independent project (for example through a future collaborating institution). This must be assessed before recruitment.

## 7. Study A: designing and evaluating traceable, contestable, method-aware reasoning support

**Approach:** design science research. Build and evaluate the artefact, and derive design principles from the evaluation.

**Candidate design principles** (each **[Proposed principle]**, to be justified and evaluated):

- **DP1 Traceability:** every diagnostic is grounded in exact, verifiable spans of the researcher's text.
- **DP2 Calibrated abstention:** the system states when the supplied text cannot support a judgement, rather than guessing.
- **DP3 Contestability:** researchers can dispute a diagnostic, supply evidence or reasoning, and have the human decision recorded as final. *(Revised 27 Oct 2026: a longer-term direction, not evaluated in Study A. See `literature/NOVELTY-POSITIONING.md` §4.4.)*
- **DP4 Method awareness:** criteria for adequate warrant are conditioned on the research design.
- **DP5 Author agency:** the system diagnoses and asks; it never rewrites text or generates arguments.

**Evaluation design [Plan, draft]:**

- **Technical evaluation against expert labels:** precision and recall per gap type, the false-positive rate on calibrated claims, abstention accuracy on unassessable claims, span accuracy, and stability across repeated runs.
- **Strong baselines (required):** (b1) a frontier general-purpose LLM with a careful single prompt; (b2) the same model with a Toulmin-structured prompt; (b3) existing tools where their terms permit and outputs can be compared fairly; (b4) the approach reported for Critical Inker, if it can be reproduced faithfully (an **[Open question]**). *(Revised 27 Oct 2026: see `literature/NOVELTY-POSITIONING.md` §3 for the updated baselines, ablations, and the distinction between predictive, design-knowledge and human-outcome contributions.)*
- **Expert usefulness evaluation:** whether diagnostics identify problems experts consider real and important, and whether contestability features are used and trusted.

## 8. Study B (future): independent reasoning, learning transfer and overreliance

**Status: design only. No data collection can begin until an appropriate ethics review pathway has been identified and approval obtained.**

**Candidate design [Plan, draft]:** three conditions:

1. Self-review without AI.
2. Feedback from a general-purpose LLM.
3. WarrantLab-style warrant-centred feedback.

**Candidate outcomes:**

- Revision quality.
- **Transfer:** identification of inferential gaps in new, unassisted passages.
- **Reliance:** acceptance of deliberately incorrect AI diagnoses.
- Willingness and ability to contest AI judgements.

**Dependencies:** an identified ethics review pathway and application, preregistration, a power analysis, participant recruitment, and a decision on the AI infrastructure suitable for participant data.

## 9. Technical research prototype V0.2

**Scope principle:** depth over breadth. V0.2 targets **traceability across Results and Discussion** and nothing more.

**Target scenario [Plan]:** a researcher supplies the Results and Discussion of the same study. Results report a difference between two groups; the Discussion claims a mechanism has been demonstrated. V0.2 identifies the inferential gap, links the Discussion claim to the specific Results spans offered as evidence, and lets the researcher confirm, reject or supply evidence from elsewhere. Each decision is recorded.

**Out of scope for V0.2:** additional manuscript sections beyond Results and Discussion, chat interfaces, dashboards, AI-text detection, rewriting, and grammar or style feedback.

**Prerequisites:** the provisional taxonomy (§5) and the pilot findings (§6.2) should inform the data model before the Argument Provenance Graph is implemented. The POC's deterministic span verification and abstention behaviour should be retained.

## 10. Data governance, ethics, IP, licensing, funding and infrastructure

| Area | Current status | Required before |
|---|---|---|
| **Inference provider** | Gemini API free tier. Google may use content and have it reviewed. Daily limits are tight and availability intermittent. **[Verified]** | Any real manuscript, expert annotation of non-public text, or participant study |
| **Data governance** | No data is stored by the app. Fixtures are fictional. | A data management plan covering storage, retention and access for annotation and study data |
| **Ethics and participant protection** | No human-participant research has been conducted. No institutional ethics pathway is assumed. | Expert pilot (assess whether review is needed) and Study B (review certainly needed). Identify a suitable review pathway when relevant, for example through a collaborating institution **[Open question]** |
| **Intellectual property** | Independent personal project. No institutional IP arrangement is assumed. | Any collaboration or contribution by others: agree ownership, authorship and licensing in writing. Assess when relevant whether any other agreement held by the project owner affects ownership **[Open question]** |
| **Licensing** | The POC code is public under the MIT License; that version cannot be withdrawn. **[Verified]** | A decision on the licence for future research code and for the benchmark data |
| **Funding** | $0 so far. No institutional funding. | Paid inference, annotator honoraria, and any participant payments |
| **Infrastructure** | Local Next.js app; free-tier API. | Options to evaluate include a paid API with no-training terms, local models, or infrastructure provided through a future collaboration **[Open question]** |

## 11. Research plan: November 2026 – March 2027

**Nearest milestone:** a *Research Preview* seminar for invited international IS scholars in February 2027 (format, host and invitees to be confirmed). The four deliverables it requires are D1–D4 below.

| Month | Phase | Work | Measurable deliverable | Depends on |
|---|---|---|---|---|
| Nov 2026 | 1 | Positioning review: Critical Inker in full, argument mining, related products. Concept development and RQ refinement. | **D1** research concept paper draft (problem, positioning, RQs, intended IS contribution). A first concept note is in `CONCEPT-NOTE.md` | Optional critical feedback from external IS scholars |
| Nov 2026 | 2 | Taxonomy v0.1 → v0.2 grounded in the literature. Codebook and annotation guide with counter-examples. | Taxonomy v0.2 and codebook draft | D1 positioning |
| Dec 2026 | 2–3 | Item sourcing (licence-checked excerpts and marked synthetic variants). Ethics assessment for the expert pilot. Pilot recruitment. | Pilot item set and a recorded ethics assessment | An identified review pathway (if needed), licence checks |
| Dec 2026 | 4 (design) | V0.2 design document for Results↔Discussion traceability. Infrastructure decision. | V0.2 design document and infrastructure choice | Taxonomy v0.2, budget |
| Jan 2027 | 3 | Expert pilot annotation. Agreement and disagreement analysis. Codebook revision. | **D3** pilot report, including disagreements | Recruitment, ethics |
| Jan 2027 | 4 | V0.2 build on licence-cleared or synthetic text. Baseline harness (b1, b2). | **D4** V0.2 demo with documented limits | Design document, infrastructure |
| Feb 2027 | — | Research Preview seminar. Working paper. Optional ECIS 2027 TREO submission (deadline 17 Feb 2027). | **D2** taxonomy and protocol (revised). Seminar held. | D1–D4 |
| Mar 2027 | — | Decide on the PACIS 2027 paper (deadline 1 Mar 2027) only if the evidence is sufficient. Otherwise consider PACIS TREO (deadline 7 May 2027). | Submission decision recorded | Pilot and evaluation evidence |

Conference deadlines were verified on the official ECIS 2027 and PACIS 2027 websites (see `SOURCES.md`). They must be re-checked before submission, because deadlines change.

**Deliverables for the February Research Preview:**

- **D1:** a research concept paper with a clearly defined problem and IS contribution.
- **D2:** a theoretically grounded taxonomy and annotation protocol.
- **D3:** an expert pilot report, including the cases where experts disagreed.
- **D4:** a V0.2 demo that traces reasoning between Results and Discussion, with its limits stated.

## 12. Open scientific decisions (research decisions by the project owner)

1. **Theoretical lens:** Toulmin's argument model, argumentation schemes, epistemic calibration, or a combination.
2. **Unit of analysis:** paragraph, claim–evidence pair, or section pair.
3. **First research designs to support** (e.g. experimental and observational quantitative), and when qualitative or design science research enter scope.
4. **Positioning relative to Critical Inker:** what WarrantLab claims to add, and how it will be evaluated.
5. **Ethics pathway:** whether the expert pilot needs review, which review pathway is available to an independent project, and when to prepare the Study B application.
6. **Inference infrastructure and budget**, given that the free tier is unsuitable for real manuscripts.
7. **IP and collaboration arrangements**, to be agreed with any future collaborators. No host institution is assumed.
8. **Licensing** of future code and of the benchmark data.
9. **Venue strategy:** ECIS TREO (February), the PACIS paper (March) or PACIS TREO (May), decided on the strength of the evidence rather than on the calendar.
10. **Whether Study B belongs in this programme's first cycle** or follows Study A.
