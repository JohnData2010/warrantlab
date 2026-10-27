# Novelty positioning: WarrantLab against its closest prior work

*Phase 1. Draft 0.3, 27 October 2026 (AEDT). Status: for independent research review. **Novelty is not finalised.** This memo closes the novelty-mapping phase (see `../DECISIONS.md`).*

*Revision 0.3:*
- *Provenance corrected. The source corrections in 0.2 were supplied by the project owner. Whether the project owner verified them personally is not recorded. They are now attributed accordingly and were independently re-checked by the agent where possible.*
- *Yurrita et al. (2025) has now been read in full (agent) and synthesised (§2.3). C4 has been revised accordingly.*

*Revision 0.2, following source corrections supplied by the project owner:*
- *Corrected the interpretations of Isch et al. (the "AI feedback" stimuli; the 84% figure) and CLAIMCHECK (a Table 1 versus prose discrepancy; pilot versus main data; the GPT-4o-judged "different" result).*
- *Separated predictive, design-science and human-outcome contributions.*
- *Added coverage-aware evaluation of abstention, controlled comparisons for evidence links, and ablations.*
- *Narrowed C4 after reading the contestability and reliance literature.*
- *Set research priorities: C1 is the core; C2 and C3 are supporting design mechanisms; C4 is a longer-term direction.*

This memo positions the frozen WarrantLab POC (tag `hackathon-poc-v0.1`) against its closest prior work in four lines of research: **argument support**, **grounded scientific criticism**, **method-dependent evidential overreach** and **contestability and reliance in human–AI decision making**.

**Sources.** Full metadata and all four provenance fields are in `../SOURCES.md`. **None of the arguments synthesised below has been recorded as personally verified by the project owner**; every synthesis is agent-assisted.

| Short name | Work | Text access (agent) | Researcher verification |
|---|---|---|---|
| **CI** | Hugenroth, Danry & Maes (2026), *Critical Inker*, arXiv:2604.07167 | Full HTML via a summarising web-reading tool. See `CRITICAL-INKER-ANALYSIS.md` | Not recorded. Corrections supplied by the project owner |
| **CC** | Ou et al. (2025), *CLAIMCHECK*, Findings of EMNLP 2025 | Full PDF, text extraction | Not recorded. The Table 1 correction was supplied by the project owner and re-checked by the agent |
| **IS26** | Isch et al. (2026), *Quantifying the prevalence and impact of overreaching causal claims in social science*, Nature Human Behaviour | Full HTML via a summarising web-reading tool (main text and Methods). Supplementary information not read | Not recorded. The stimulus and 84% corrections were supplied by the project owner and re-checked by the agent |
| **CF** | Zhang et al. (2025), *CliniFact*, Scientific Data | Full HTML via a summarising web-reading tool | Not recorded |
| **AF** | Alfrink, Keller, Kortuem & Doorn (2023), *Contestable AI by Design: Towards a Framework*, Minds and Machines | Full PDF, text extraction | Not recorded |
| **YU** | Yurrita et al. (2025), *Identifying Algorithmic Decision Subjects' Needs for Meaningful Contestability*, PACM HCI 9(7), CSCW234 | Full publisher PDF (Utrecht University repository, located by the project owner), text extraction | Metadata only (project owner, first page) |
| **BU** | Buçinca, Malaya & Gajos (2021), *To Trust or to Think*, PACM HCI | Partial: abstract and study design (arXiv 2102.09692) | Not recorded |

---

## 1. Comparison across eight dimensions (closest scholarly-claim work)

| Dimension | Critical Inker (CI) | CLAIMCHECK (CC) | Isch et al. (IS26) | CliniFact (CF) | WarrantLab POC |
|---|---|---|---|---|---|
| **Research problem** | AI writing assistants risk cognitive deskilling. Scaffold writers' critical reflection | LLM peer-review critiques are often not grounded in the claims a paper makes | How prevalent causal overreach is in cross-sectional social science, and what it does to readers and LLM summaries | Evaluating LLMs on verifying clinical research claims against evidence | Researchers do not see when their own claims exceed what their reported evidence licenses |
| **Unit of analysis** | Argument relations in a short essay | A reviewer weakness linked to target claims in full ML papers (text, figures and related work) | Titles and abstracts (194,631 articles); claim level in a subsample of 100 articles | Constructed claim plus a linked abstract (1,970 pairs) | A claim in a supplied passage (≤ 3,000 words), with evidence quoted from the same passage |
| **Epistemic judgement** | Whether the support relation is valid, **assuming the evidence is true** | Whether a weakness disputes a claim; multi-label weakness type; ordinal agreement and subjectivity ratings | Causal language in a design that cannot establish causation (cross-sectional), i.e. **design-conditioned overreach**; distinguishes direct, implied and conditional claims | Whether evidence supports the claim, using labels largely derived from trial statistics (p < 0.05) and link type | Overclaim (a nameable inferential step beyond the evidence), calibrated, or insufficient evidence |
| **Treatment of missing evidence** | Not described | 48 of 168 weaknesses had no groundable target claim. An "insufficient evidence" weakness type exists. No model abstention is described | Not central. Prevalence counts language, not evidential gaps | An explicit **NEI** label, assigned from link type rather than from a content judgement | An explicit `insufficient_evidence` outcome, judged from the content of the supplied text |
| **Method awareness** | Not described | Not described as a design dimension | **Core.** Design is the conditioning variable, with design classification validated against expert coding | Statistical test type and a p-value threshold only | Prompt-level rules for two cases only. No method-specific rubric |
| **Human involvement** | Writer-facing. Socratic verbalisation. Pilot with n = 7 | Expert annotators (all authors). The use case is reviewer and meta-reviewer assistance | Expert coding for validation. Preregistered reader experiment (N = 1,105) with **manually prepared** feedback stimuli (see §2.1) | Two reviewer groups revised test labels (κ = 0.85) | Writer-facing. Edit and re-analyse. No contestation. No user study |
| **Evaluation** | Structure overlap and validity accuracy on essay and NLI data (n = 100 each) | Pilot agreement (span F1; Krippendorff's α by label; see §2.2); LLM benchmarks on three tasks | Classifier validation (causal-language F1 ≈ 0.81–0.83); prevalence trends; experimental effects; LLM summary experiments | Model accuracy and F1 (e.g. BioBERT 80.2%; best zero-shot generative 43.4%) | 3 fictional fixtures × 3 completed runs (smoke test) |
| **Contribution type** | Interaction design plus an LLM pipeline | Dataset, task suite and benchmark | Meta-science evidence plus validated classifiers | Dataset plus a benchmark | Prototype only |

## 2. Source corrections and careful readings

### 2.1 Isch et al. (2026)

- **The 84% figure** is the rate of causal language among the **cross-sectional articles classified as business in their corpus, in 2024**. It is not a rate for all business research, and says nothing about IS research. The overall figure (≈ 46%, 1980–2024) likewise concerns cross-sectional articles in the five ProQuest social-science databases they searched.
- **The "AI feedback" condition** in the reader experiment consisted of methodological notes and highlights that the **researchers prepared manually** and **presented to participants as AI-generated**, to keep the stimuli consistent. This correction was supplied by the project owner. The agent re-checked it in the Methods: the label and highlights were created manually "to ensure consistency across articles".
  - What this supports: feedback of that *form* can shift readers' interpretations.
  - What it does not establish: anything about how well an *automated* AI system performs on real manuscripts.
- **Claim-level overreach** (≈ 27% of matched claims in a 100-article subsample) is lower than the abstract-level rate. The headline rate counts any causal language about a cross-sectional study's own results, including conditional phrasing, as overreach.

### 2.2 CLAIMCHECK (Ou et al., 2025)

- **A discrepancy between Table 1 and the prose, recorded and not resolved.** It was identified by the project owner and re-checked by the agent in the PDF text extraction:
  - Table 1 ("Humans Only") reports Agreement α = 0.131, Subjectivity α = 0.182, Clarity α = 0.0 and Novelty α = 0.776.
  - The prose reverses the first two (Agreement 18.2, Subjectivity 13.1).
  - This memo cites the **table values with that caveat**, and does not decide which is correct.
- **Scope of the agreement figures:** they come from the **pilot** (5 paper–review pairs; 5–6 annotators). The main annotation was **singly annotated**. These coefficients must not be described as the reliability of the whole dataset.
- **The "more than 80% different" result** came from a **GPT-4o judge** comparing model-written weaknesses with reviewer weaknesses distilled per claim. The authors note that "different" does not necessarily mean wrong.
  - Correct reading: *model-generated critiques frequently differed from reviewer-identified critiques, indicating a substantial challenge in producing comparable, claim-specific criticism.*
  - It is **not** evidence that more than 80% of the critiques were incorrect.
  - **Lesson for WarrantLab:** similarity to an expert's critique is not the same as correctness when a claim admits several legitimate criticisms. Evaluation must allow for multiple valid diagnoses.

### 2.3 Contestability and reliance (AF, YU, BU)

- **AF** (Alfrink et al., 2023) synthesises, from a systematic literature review with reflexive thematic analysis, a design framework for **contestable AI in automated decision-making**:
  - **five system features:** built-in safeguards against harmful behaviour; interactive control over automated decisions; explanations of system behaviour; human review and intervention requests; tools for scrutiny by subjects or third parties.
  - **six development practices:** ex-ante safeguards; agonistic approaches to ML development; quality assurance during development; quality assurance after deployment; risk-mitigation strategies; third-party oversight.

  Contestability is framed as a dialectical, procedural relationship between **decision subjects** and **human controllers**. The authors state the framework is based on a small sample of papers, is largely "context-free" and has **not been empirically validated**.
- **YU** (Yurrita et al., 2025; full text read by the agent). An empirical complement to AF from the decision subject's side.
  - **Design.** A preregistered qualitative study. There were 21 vignette-prompted interviews with people who rent out homes short term, stratified by AI literacy (7 low, 7 medium, 7 high). The scenario was a hypothetical letter from a municipality whose (undeployed) random-forest risk-scoring system had flagged the participant for illegal holiday rental. Participants saw an information sheet including a simulated feature-based (SHAP-style) explanation. The analysis was reflexive thematic analysis.
  - **Findings.** Three themes:
    - **T1 cooperation in sense-making:** strategising information requests; dialogue with human controllers.
    - **T2 social support in contestation acts:** organisational support (a preference for an empathetic human reviewer; a third party to offset power and knowledge differentials); peer and collective support.
    - **T3 distributed responsibility:** algorithmic accountability; social transparency.
  - **Detailed observations.**
    - Participants unanimously prioritised knowing *why* they were flagged.
    - They found the feature-based explanation unhelpful because it offered no actionable path. One participant asked for "concrete reasoning", not "numbers".
    - Interest in *how* the system worked rose with AI literacy and experience with AI fairness.
    - Participants did not want to "know everything". They were selective about information they could act on.
    - Participants rejected the burden of correcting the system's false positives, which they saw as the controllers' responsibility.
  - **Limits stated by the authors.** The sample was small, highly educated and concentrated in two countries. The materials came from a single case. Transfer beyond public-sector policy enforcement "should not be fully assumed".

  **Why YU does not map directly onto WarrantLab.** In YU:
  - the AI output is a **consequential, adversarial decision** imposed by an organisation on a citizen, with penalties;
  - contesting it is a **procedural right**, exercised through human reviewers and institutions;
  - the subject usually lacks domain expertise;
  - the burden of contesting is itself experienced as unfair.

  In WarrantLab, the AI output is **advisory**. The "subject" is an **expert author** who is also the **only decision-maker**. No institution enforces the diagnosis, and accepting or rejecting it is a matter of epistemic judgement, not procedural justice. YU's findings therefore cannot be transferred as requirements. At most they suggest **hypotheses** to test in the expert-author setting:
  - *Diagnostic reasons over scores.* Diagnostics should state the inferential reason and the specific evidence relied on, not a confidence number. This parallels the preference for "concrete reasoning" in YU.
  - *Selective, layered information.* Show the inferential gap first, then evidence and method details on demand.
  - *Expertise-dependent use.* How much researchers interrogate a diagnosis may depend on their methodological expertise, as interest in system details depended on AI literacy in YU.
  - *Responsibility.* Who is responsible for a wrong diagnosis, and whether the burden of rejecting one is acceptable to authors, is an open question in this setting.
- **BU** (Buçinca et al., 2021) ran an online experiment (N = 199, Amazon Mechanical Turk) on a nutrition task with a **simulated** AI and controlled errors, across six conditions: no AI, explanation, uncertainty, and three cognitive-forcing designs (on demand, update, wait).
  - Cognitive forcing reduced overreliance compared with simple explanation conditions.
  - The designs that reduced overreliance most received the **least favourable subjective ratings**.
  - The benefits were larger for people higher in **Need for Cognition**.

**What this means for C4.** "Letting users dispute AI output" is already well theorised (AF), with empirically grounded needs (YU) and evidence that interaction design shapes reliance at a cost to user experience (BU). WarrantLab's setting differs in one way that matters: the **researcher is both the expert controller and the author whose work is judged**. The AI's output is advisory, not a decision imposed on a subject. Whether this changes what contestability requires is open. It is the only defensible angle for C4 (§4.4).

## 3. Contribution framework: three kinds of claim

Being matched by a strong baseline challenges some contributions but not others. Each candidate below is assessed against the kind of contribution it would make.

| Kind of contribution | What must be shown | What a strong-baseline match implies |
|---|---|---|
| **Predictive superiority** | WarrantLab outperforms baselines on the same benchmark, compared fairly (same model family, same inputs, tuned prompts) | **Falsifies** incremental predictive benefit |
| **Design knowledge (design science)** | Specific design principles produce measurable, explainable benefits, such as faster and more accurate checking of diagnostics, clearer location of disagreement, or more reliable rejection of wrong diagnoses | Does **not** by itself falsify the contribution. Benefits may lie in inspectability, abstention behaviour or human outcomes rather than raw accuracy |
| **Human decision outcomes** | Researchers using the system make better, more independent or less AI-reliant judgements, including on transfer tasks | Irrelevant to this contribution, which is assessed in user studies |

**Ablations (required for any design-knowledge claim).** Using the same model and the same inputs, compare variants with and without:
- (a) method-conditioned assessment;
- (b) explicit abstention;
- (c) explicit evidence links;
- (d) the two-pass extract-and-judge structure.

Otherwise it cannot be known which component produces any benefit. Comparing WarrantLab only with a weaker-prompted LLM would be uninformative.

**Baselines for Study A:**
- (b1) a strong single-prompt LLM;
- (b2) an IS26-style design-rule baseline;
- (b3) a CI-style support-validity pipeline;
- (b4) a CC-style claim-grounded critique baseline.

## 4. Candidate contributions, priority and falsification

Every candidate is a **[Hypothesis]**. Research priority was set by the project owner.

### 4.1 C1 Method-conditioned evidential calibration *(priority: core)*

- **Claim:** design knowledge for systems that judge, per claim, whether the *type and strength* of a scholarly claim (association, causal effect, mechanism, theory validation, scope) is licensed by the *reported design and evidence*. This extends IS26's single rule (cross-sectional plus causal language) to several overreach types and to designs that license some claims but not others.
- **Closest work:** IS26, CI.
- **Falsification:**
  - *Predictive:* an IS26-style design-rule baseline, or a strong LLM, matches C1 judgements on expert-labelled items, including **counterfactual sets** where only the design information changes (§5).
  - *Foundational:* experts cannot agree on claim-level calibration with usable reliability. That would undermine the construct itself, not only the system.
  - *Design:* ablating method-conditioning produces no difference in accuracy, inspectability or human outcomes.

### 4.2 C2 Principled abstention *(priority: supporting design mechanism)*

- **Claim:** a content-based judgement that the supplied text cannot support an assessment, kept distinct from "flawed". Unlike CF, the NEI judgement is not inferred from document links.
- **Evaluation requirement:** abstention must be assessed by **error rates together with decision coverage**, the proportion of cases where the system commits to a judgement, for example through risk–coverage curves. A system that always abstains would reduce false flags to zero while being useless, and **must not be rewarded**.
- **Falsification:**
  - Experts cannot reliably separate "unassessable from this excerpt" from "flawed" (low agreement on the assessability task).
  - At matched coverage, abstention does not reduce errors relative to baselines.

### 4.3 C3 Cross-section evidential traceability *(priority: supporting design mechanism; a design test, not an independent contribution)*

- **Claim:** linking Discussion claims to the specific Results spans offered as evidence improves calibration judgements and makes them inspectable.
- **Controlled comparison:** **identical manuscript content** under two conditions:
  - (i) sections supplied without explicit links;
  - (ii) the same sections with explicit claim–evidence links, for the system and, separately, for human checkers.
- **Link quality must be controlled.** Machine-generated links can be wrong or misleading. Evaluation must:
  - assess link accuracy against expert links;
  - include conditions with deliberately **incorrect or misleading links**.

  Whether wrong links degrade human judgement is a finding to measure. Cases with wrong links must **not** be removed from the data.
- **Falsification:** no difference in accuracy, coverage or human verification time and accuracy between (i) and (ii), or net harm once link errors are taken into account.

### 4.4 C4 Contestability in AI-assisted expert judgement *(priority: longer-term direction; not part of Study A)*

- **Narrowed question:** *When should a researcher accept, dispute or ask for more evidence about an AI-generated inferential diagnosis of their own work, and how should a system support that process?*
- **Constrained by:** AF (contestability features), YU and BU (forcing functions reduce overreliance at an experiential cost).
  - YU's needs (cooperative sense-making, support in contestation acts, responsibility attribution) arose for **lay decision subjects facing an adverse public-sector decision**.
  - They are **not** assumed to hold for expert authors receiving advisory diagnoses. Whether they do is part of what C4 would test (§2.3).
- **Evaluation requirement:** the **correctness of final decisions**, including rejection of seeded wrong diagnoses and acceptance of correct ones, not the frequency of "disagree" actions.
- **Falsification:**
  - Contestation features do not improve final-decision accuracy over a plain accept-or-ignore interface.
  - They increase wrongful dismissal of correct diagnoses.
  - The benefits are fully explained by known cognitive-forcing effects (BU), with nothing specific to the expert-author setting.

### 4.5 C5 Author-facing, pre-submission context *(not a contribution)*

This is a use-context difference. It shapes Study B but is not claimed as theory.

## 5. Benchmark design matrix (for later phases; nothing is constructed yet)

| Evidence condition | Claim | Expected system behaviour |
|---|---|---|
| Sufficient and appropriate | Calibrated | No warning |
| Sufficient, but it does not license the stated conclusion | Overclaim | Identify the specific inferential gap |
| Necessary information missing from the excerpt | Not assessable from the excerpt | Abstain, stating what information is missing |
| Evidence in Results, claim in Discussion | Assessable once linked | Trace the evidence before judging |
| Keyword-only change (e.g. "randomised" mentioned without a randomised design, or vice versa) with no real change in method information | Unchanged | No change in diagnosis |

Expected behaviours must be agreed by independent expert annotators before use. They must not be set by the system designers alone. See `../taxonomy/STRUCTURE-MEMO.md` §6 for the counterfactual item design.

## 6. What prior work already establishes (summary)

1. Causal overreach is common and has grown in cross-sectional social science (IS26). Prevalence in IS is unknown.
2. Design-conditioned overreach detection is feasible at scale for one rule (IS26).
3. Feedback of the form tested in IS26 (methodological notes and highlights, manually prepared) can shift readers' interpretations. LLM summaries can amplify causal overstatement (IS26).
4. Claim-grounded critique is an established benchmark problem, and model critiques often differ from reviewers' (CC).
5. Expert agreement on weakness types varies widely by label in a small pilot (CC). This is a warning for WarrantLab's taxonomy.
6. NEI classes are standard in claim verification (CF).
7. Argument-structure extraction, quote grounding and reflective, non-corrective writer feedback exist (CI).
8. Contestability is theorised as a set of system features and practices (AF). In one public-sector enforcement scenario, lay decision subjects wanted reasons rather than feature scores, selective and layered information, human and peer support, and fair responsibility attribution (YU; qualitative, N = 21). Forcing functions reduce overreliance at an experiential cost and unevenly across users (BU).

**None of the following is a contribution on its own:** detecting causal overreach, grounding critiques in claims, an abstention or NEI class, quote-anchored writer feedback, contestation buttons, or applying any of these to IS text. **Domain adaptation to IS is not a theoretical contribution.**

## 7. Candidate positioning (for independent review)

> WarrantLab investigates how AI-assisted information systems can be designed to help researchers judge whether scholarly claims are warranted by the reported evidence and research design (**method-conditioned evidential calibration**), with principled abstention and explicit evidence tracing as candidate design mechanisms. It builds on design-conditioned overreach detection (Isch et al., 2026), grounded scientific critique (Ou et al., 2025), claim–evidence verification with not-enough-information labels (Zhang et al., 2025) and argument-support feedback for writers (Hugenroth et al., 2026). Contestability in AI-assisted expert judgement (cf. Alfrink et al., 2023; Yurrita et al., 2025; Buçinca et al., 2021) is a later research direction.

This is a **[Hypothesis]**, not an established contribution.
