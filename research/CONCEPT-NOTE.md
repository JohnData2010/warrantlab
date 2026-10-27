# Designing AI-Assisted Information Systems for Evidence-Calibrated Scholarly Reasoning

*Research concept note, version 0.2, 27 October 2026 (AEDT). WarrantLab 2027, Study A.*

*Status: for critical feedback from IS scholars and potential collaborators. Every claim in this note is provisional. Nothing here has been evaluated against experts or strong baselines.*

**About this project.** WarrantLab is an independent personal research project. It is not part of a university research programme and has no institutional supervision or funding. The project owner is responsible for its scientific direction and makes all final research decisions. Readers are invited to act as critical reviewers, advisers or possible future collaborators.

**About the sources.** The literature summaries behind this note were prepared with AI assistance. For each source, `SOURCES.md` records separately:
- who verified the metadata;
- how the full text was accessed;
- where an agent synthesised it;
- whether the project owner has personally checked its arguments and figures.

Detailed working documents: `literature/NOVELTY-POSITIONING.md`, `construct/C1-CONSTRUCT-SPEC.md`, `taxonomy/STRUCTURE-MEMO.md`, `ROADMAP.md`.

*Changes from 0.1:*
- *The problem statement is now grounded in specific evidence.*
- *A working definition of the construct and its boundaries has been added (§3).*
- *Exploratory pilot findings are kept separate from later confirmatory claims.*
- *Evidence-link quality checks have been added.*
- *Yurrita et al. (2025) has been read in full.*

---

## 1. Problem

Isch et al. (2026) analysed 194,631 cross-sectional articles in social-science databases, using classifiers validated against expert coding:
- Causal language appeared in about **46%** of titles and abstracts (1980–2024).
- The rate rose over time in each of five disciplines. In 2024 it reached **84% of the cross-sectional articles classified as business**.
- In a preregistered experiment, such language shifted how readers interpreted findings.
- LLM summaries amplified causal overstatement.

These results concern **one kind of overreach** (causal language about non-causal designs) in **one body of literature**. They do not establish how common overreach is across empirical research, or in IS specifically.

Whether similar gaps are common in other kinds of inference is an **open question this programme investigates**. Examples include treating a group difference as evidence of a mechanism, or a single study as validation of a theory.

Two further observations motivate a design study:
- Authors may find such gaps hard to see in their own writing. This is a [Hypothesis].
- Grounding machine critiques in specific paper claims is difficult. In CLAIMCHECK, model-generated critiques frequently differed from reviewer critiques, as judged by a GPT-4o judge. A difference is not necessarily an error (Ou et al., 2025).

The design problem is therefore *not* fluent feedback. It is a system that:
- judges whether the **type, scope and strength of a claim** are justified by the **evidence, methodological information and assumptions** supplied;
- shows what that judgement rests on;
- **withholds judgement** when the supplied text cannot support one.

## 2. Closest prior work

| Work | What it establishes | What it leaves open for this study |
|---|---|---|
| **Isch et al. (2026)**, *Nature Human Behaviour* | Design-conditioned causal overreach can be detected at scale for one rule (cross-sectional design plus causal language). Methodological feedback can shift readers' interpretations, but that feedback was **created manually** and presented as AI-generated | Overreach types beyond causation; designs that license some claims but not others; claim-level judgement for authors; the quality of automated feedback |
| **CLAIMCHECK** (Ou et al., 2025), *Findings of EMNLP* | Claim-grounded critique is a hard, benchmarked task. In a small pilot, expert agreement on weakness labels varied widely by label. Table 1 and the prose report reversed α values for two labels; this is recorded, not resolved | Method-conditioned standards; abstention; author-facing use |
| **CliniFact** (Zhang et al., 2025), *Scientific Data* | Claim–evidence verification with a not-enough-information label | Its NEI label is derived from document links, not from a content judgement |
| **Critical Inker** (Hugenroth et al., 2026), arXiv preprint | LLM argument-structure extraction, quote-grounded support checks, and reflective feedback for writers | Judges support *assuming the evidence is true*. Does not condition on research design. No abstention is described |
| **Contestability and reliance** (Alfrink et al., 2023; Yurrita et al., 2025; Buçinca et al., 2021) | A contestability framework for automated decisions. Lay decision subjects facing a public-sector decision wanted reasons rather than feature scores, layered information, support, and fair attribution of responsibility. Cognitive forcing reduces overreliance at an experiential cost | Their settings (adverse decisions about lay subjects; lay crowd workers) differ from **advisory diagnoses given to expert authors**. Treated as a later direction (§5) |

The following are **not** contributions on their own: detecting causal overreach, grounding critiques in claims, an NEI class, quote-anchored feedback, and applying any of these to IS text.

## 3. The construct: a working definition

> **Method-conditioned evidential calibration** is the assessment of whether the type, scope and strength of a scholarly claim are justified by the evidence, methodological information and assumptions available for examination.

This is a **proposed working definition** for this programme. It is not a definition established in the literature.

Four elements are judged **together**, not one at a time:
- the **claim** (its type, scope and strength);
- the **evidence** reported for it;
- the **methodological information** (design, sampling, measurement, analysis);
- the **assumptions** the inference relies on.

The same sentence can be calibrated after one design and overreaching after another. The programme's central test cases are therefore **matched sets** in which the conclusion is held constant and only the design or method information changes.

**Three boundaries:**

1. **Reported warrant versus actual study validity.** The judgement concerns the inference **as presented in the supplied documentation**. It does not certify, or impugn, the validity of the underlying study. A sound study can be described in an overreaching way, and a weak study can be described cautiously.
2. **Unavailable evidence versus contradictory or inadequate evidence.** If the information needed to judge a claim is *absent*, the claim is **unassessable** from the excerpt. That is different from information that is *present and inadequate* (for example, a cross-sectional design offered for a causal claim), and from evidence that *contradicts* the claim.
3. **Methodological information versus methodological keywords.** A causal claim is not licensed because the text contains the word "randomised". It is licensed only if what was randomised, and how, supports the claim (for example, "randomised survey order" does not support a causal claim). The reverse also holds: a randomised design described without that word still counts.

Wording strength is not the construct. Strong wording is not necessarily overreach, and hedged wording is not necessarily calibrated.

The full specification, with positive examples, counterexamples and boundary cases, is in `construct/C1-CONSTRUCT-SPEC.md`.

## 4. Research question

> **How can AI-assisted information systems be designed to help researchers assess whether scholarly claims are warranted by the available evidence and research methods, while appropriately withholding judgement when information is insufficient?**

The question that must be answered first is a conceptual one:

> On what information and inference rules is a scholarly claim judged *warranted*, *overreaching* or *unassessable*, and how can two experts apply those rules consistently?

Sub-questions, in dependency order:
1. **Construct.** Can the definition in §3 be applied by experts? Where, and why, do they disagree?
2. **Design.** Which design mechanisms improve judgements, inspectability and abstention, compared with strong baselines? Candidate mechanisms are method-conditioned assessment, explicit abstention and explicit evidence links.
3. **Outcome** (later). Do such systems help researchers make more accurate final decisions about their own claims, without increasing reliance on the AI?

## 5. Candidate IS contribution

Following the design-science tradition in IS (Hevner et al., 2004; Gregor & Hevner, 2013), the intended contribution is **design knowledge**: tested design principles for evidence-calibrated reasoning support, instantiated in an artefact. It is not the artefact alone.

| Priority | Candidate | Status |
|---|---|---|
| **Core** | **C1 Method-conditioned evidential calibration** (§3) | [Hypothesis] |
| Mechanism to test | **C2 Principled abstention.** A content-based "unassessable from this excerpt" judgement, kept distinct from "overreaching" | [Hypothesis] |
| Mechanism to test | **C3 Evidence traceability.** Explicit links from Discussion claims to the Results spans offered as evidence | [Hypothesis] |
| Longer term | **C4 Contestability in expert self-assessment.** When a researcher should accept, dispute or ask for more evidence about an AI diagnosis of their own work | Not part of Study A |
| Context only | **C5 Author-facing, pre-submission use** | Not claimed |

C2 and C3 are design mechanisms to be tested. They are not assumed to be independent contributions.

Three kinds of claim are kept separate:
- **predictive superiority;**
- **design knowledge** (specific mechanisms produce measurable, explainable benefits);
- **human decision outcomes.**

A strong LLM that matches WarrantLab's accuracy would falsify predictive superiority. It would not, by itself, falsify the design-knowledge claims, which are tested through ablations and controlled comparisons. Having more features than existing systems is not evidence of design knowledge.

## 6. Theoretical uncertainties

1. **The construct may not be unitary.** Causal licence, construct validity, theoretical scope and generalisation may need separate treatment.
2. **The representation is undecided.** Toulmin's data–claim–warrant model (Toulmin, 1958/2003) is a candidate *representation*, not an explanatory theory. Argumentation schemes and epistemic calibration are alternatives that have not yet been reviewed.
3. **Method standards differ across paradigms.** The first cycle may be restricted to two quantitative designs. Whether the approach extends to interpretive IS research is open.
4. **Boundary 1 is itself empirical.** Whether experts can keep reported warrant separate from beliefs about the study's actual validity has to be tested.
5. **There may be several valid diagnoses.** Agreement with a single expert critique is an incomplete measure of correctness.
6. **The design-theory form is open.** The DSR sources are verified for metadata but not yet read.

## 7. Evaluation strategy

No benchmark has been built and no participants have been recruited. Exploratory and confirmatory work are kept **separate**.

**Stage 1: exploratory construct development (sub-question 1).**
- A small expert pilot (2–3 IS researchers) on pre-segmented claim–evidence units, including matched sets.
- **Purpose:**
  - test whether the definition and decision rules in §3 are **usable**;
  - locate disagreements;
  - analyse *why* they occur (definition, item, or genuine expert disagreement);
  - revise the codebook.
- **Analysis rules are set before the pilot** so that categories are not adjusted arbitrarily: which tasks are reported, how disagreements are coded, and what triggers a codebook revision.
- Agreement from 2–3 annotators is reported **descriptively only**. It is **not** used as a decisive test of the construct, and **no reliability claim** is made from the pilot.

**Stage 2: confirmatory reliability (after the codebook stabilises).**
- A separate study with more annotators and fresh items.
- Hypotheses and thresholds will be preregistered **before** any confirmatory reliability claim is made.

**Stage 3: benchmark, comparisons and ablations (sub-question 2).**
- **Items cover five conditions.** Expected behaviours are agreed by independent experts, not by the designers:

  | Evidence condition | Claim | Expected behaviour |
  |---|---|---|
  | Sufficient and appropriate | Calibrated | No warning |
  | Sufficient, but it does not license the conclusion | Overclaim | Identify the specific inferential gap |
  | Necessary information missing | Unassessable | Abstain and state what is missing |
  | Evidence in Results, claim in Discussion | Assessable once linked | Trace the evidence, then judge |
  | Keyword-only change, with method information unchanged | Unchanged | No change in diagnosis |

- **Baselines.** All use the same model family and the same inputs:
  - a strong single-prompt LLM;
  - an Isch-style design-rule baseline;
  - a Critical Inker-style support-validity pipeline;
  - a CLAIMCHECK-style claim-grounded critique baseline.
- **Ablations:** with and without method-conditioning, abstention, explicit evidence links, and the two-pass structure.
- **Abstention** is evaluated by error rates **together with decision coverage**, for example risk–coverage curves. A system that abstains on everything must score poorly.
- **Traceability** is tested on **identical content** with and without explicit links. **Link quality is controlled.**
  - Link accuracy is measured against expert links.
  - Conditions with deliberately **incorrect or misleading links** test whether wrong links make human or system judgements worse.
  - Such cases are analysed as findings, not removed from the data.
- **Disconfirming results:**
  - Baselines match C1 judgements on matched sets.
  - At matched coverage, abstention does not reduce errors.
  - Links give no net benefit once link errors are taken into account.
  - An ablated component makes no measurable difference. It is then dropped from the design principles.

**Stage 4 (later): human decision outcomes (sub-question 3).**
- The primary measure is the **accuracy of researchers' final decisions**, including rejection of deliberately wrong diagnoses.
- The frequency of disagreement is not a measure of success.
- This stage requires an ethics review pathway that has not yet been identified.

## 8. Current evidence and its limits

A small proof of concept is frozen at Git tag `hackathon-poc-v0.1`.
- **What it does:** two LLM passes with deterministic span verification. Outcomes are "overclaim", "no overclaim identified" and "insufficient evidence", plus a separate "analysis incomplete" state.
- **Evidence so far:** a smoke test only. Three fictional passages, three completed runs each, with a validation gate amended after the fact to separate provider outages from reasoning errors.
- **What it does not show:** accuracy, usefulness or novelty.
- **Data limits:** it runs on a free-tier API whose terms rule out unpublished manuscripts.

## 9. Feedback sought

1. Is the working definition in §3 usable, and are its three boundaries the right ones?
2. Is method-conditioned evidential calibration a distinct IS design problem, or is it covered by work we have missed?
3. Is the central research question well formed for design science research, and is a first scope of two quantitative designs defensible?
4. Are the disconfirming results in §7 the right ones, and are any important baselines missing?

## References

Full metadata and provenance fields are in `SOURCES.md`.

- Alfrink, K., Keller, I., Kortuem, G., & Doorn, N. (2023). Contestable AI by design: Towards a framework. *Minds and Machines, 33*, 613–639. https://doi.org/10.1007/s11023-022-09611-z
- Buçinca, Z., Malaya, M. B., & Gajos, K. Z. (2021). To trust or to think: Cognitive forcing functions can reduce overreliance on AI in AI-assisted decision-making. *Proceedings of the ACM on Human-Computer Interaction, 5*(CSCW1), 1–21. https://doi.org/10.1145/3449287
- Gregor, S., & Hevner, A. R. (2013). Positioning and presenting design science research for maximum impact. *MIS Quarterly, 37*(2), 337–355. https://doi.org/10.25300/MISQ/2013/37.2.01
- Hevner, A. R., March, S. T., Park, J., & Ram, S. (2004). Design science in information systems research. *MIS Quarterly, 28*(1), 75–105. https://doi.org/10.2307/25148625
- Hugenroth, P., Danry, V., & Maes, P. (2026). *Critical Inker: Scaffolding critical thinking in AI-assisted writing through Socratic questioning* (arXiv:2604.07167). https://arxiv.org/abs/2604.07167
- Isch, C., et al. (2026). Quantifying the prevalence and impact of overreaching causal claims in social science. *Nature Human Behaviour.* https://doi.org/10.1038/s41562-026-02553-x
- Ou, J., et al. (2025). CLAIMCHECK: How grounded are LLM critiques of scientific papers? In *Findings of the Association for Computational Linguistics: EMNLP 2025* (pp. 21712–21735). https://doi.org/10.18653/v1/2025.findings-emnlp.1185
- Toulmin, S. E. (2003). *The uses of argument* (Updated ed.). Cambridge University Press. (Original work published 1958)
- Yurrita, M., Verma, H., Balayn, A., Alfrink, K., Gadiraju, U., & Bozzon, A. (2025). Identifying algorithmic decision subjects' needs for meaningful contestability. *Proceedings of the ACM on Human-Computer Interaction, 9*(7), Article CSCW234. https://doi.org/10.1145/3757415
- Zhang, B., et al. (2025). A dataset for evaluating clinical research claims in large language models. *Scientific Data, 12*, 86. https://doi.org/10.1038/s41597-025-04417-x
