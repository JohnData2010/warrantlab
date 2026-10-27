# Designing AI-Assisted Information Systems for Evidence-Calibrated Scholarly Reasoning

*Research concept note, version 0.1, 27 October 2026 (AEDT). WarrantLab 2027, Study A.*

*Status: for critical feedback from IS scholars and potential collaborators. Every claim in this note is provisional. Nothing here has been evaluated against experts or strong baselines.*

**About this project.** WarrantLab is an independent personal research project. It is not part of a university research programme and has no institutional supervision or funding. The project owner is responsible for its scientific direction and makes all final research decisions. Readers are invited to act as critical reviewers, advisers or possible future collaborators. Detailed working documents are in this repository: `ROADMAP.md`, `literature/NOVELTY-POSITIONING.md` and `taxonomy/STRUCTURE-MEMO.md`.

---

## 1. Problem

Empirical research often states conclusions more strongly than its reported evidence and design allow. Common cases include:
- treating an association as a causal effect;
- treating a group difference as evidence of a theoretical mechanism;
- treating a single study as validation of a whole theory.

This kind of overreach is common and growing in at least one large corpus. In cross-sectional social-science articles, causal language appeared in about 46% of titles and abstracts between 1980 and 2024. In 2024, it appeared in 84% of the cross-sectional articles classified as business in that corpus (Isch et al., 2026). How prevalent it is in IS research is **unknown**.

Authors find these gaps hard to see in their own writing. General-purpose LLMs can amplify overstatement when they summarise research (Isch et al., 2026). They can also produce critiques that often differ from what expert reviewers identify (Ou et al., 2025).

The design problem is therefore *not* fluent feedback. It is a system that:
- judges whether **the type and strength of a claim** is licensed by **the evidence and research design reported**;
- shows exactly which text that judgement rests on;
- **withholds judgement** when the supplied text cannot support one.

## 2. Closest prior work

| Work | What it establishes | What it leaves open for this study |
|---|---|---|
| **Isch et al. (2026)**, *Nature Human Behaviour* | Design-conditioned causal overreach can be detected at scale with validated classifiers for one rule (cross-sectional design plus causal language). Methodological feedback can shift readers' interpretations, but that feedback was **manually prepared** and presented as AI-generated | Overreach types beyond causation; designs that license some claims but not others; claim-level judgement for authors; automated feedback quality |
| **CLAIMCHECK** (Ou et al., 2025), *Findings of EMNLP* | Grounding critiques in specific paper claims is a hard, benchmarked task. Pilot agreement on weakness labels varies widely by label. Model critiques frequently **differed from** reviewer critiques, as judged by a GPT-4o judge (different is not necessarily wrong) | Method-conditioned standards; abstention; author-facing use |
| **CliniFact** (Zhang et al., 2025), *Scientific Data* | Claim–evidence verification with a not-enough-information label | Here the NEI label is derived from document links, not from a content judgement of what the text can support |
| **Critical Inker** (Hugenroth et al., 2026), arXiv preprint | LLM argument-structure extraction, quote-grounded support checks and reflective, non-corrective feedback for writers | Judges support *assuming the evidence is true*. Does not condition on research design. No abstention is described |
| **Contestability and reliance** (Alfrink et al., 2023; Yurrita et al., 2025; Buçinca et al., 2021) | Contestability frameworks for automated decisions. Decision subjects' needs for sense-making and responsibility attribution. Cognitive forcing reduces overreliance at an experiential cost | Treated as a **later** direction (§4), not part of Study A |

Several elements are therefore **not** contributions on their own: detecting causal overreach, grounding critiques in claims, an NEI class, quote-anchored feedback, and applying any of these to IS text.

## 3. Research question

> **How can AI-assisted information systems be designed to help researchers assess whether scholarly claims are warranted by the available evidence and research methods, while appropriately withholding judgement when information is insufficient?**

Sub-questions, in dependency order:

1. **Construct.** Can domain experts reliably distinguish (a) calibrated claims, (b) claims that overreach the reported evidence and design, and (c) claims that cannot be assessed from the supplied text? Where do they disagree?
2. **Design.** Which design mechanisms improve the judgements, how inspectable they are, and how well they abstain, compared with strong baselines? Candidate mechanisms are method-conditioned assessment, explicit abstention and explicit evidence links.
3. **Outcome** (later). Do such systems help researchers make more accurate final decisions about their own claims, without increasing reliance on the AI?

## 4. Candidate IS contribution

Following the design-science tradition in IS (Hevner et al., 2004; Gregor & Hevner, 2013), the intended contribution is **design knowledge**: tested design principles for evidence-calibrated reasoning support, instantiated in an artefact. It is not the artefact alone.

| Priority | Candidate | Status |
|---|---|---|
| **Core** | **C1 Method-conditioned evidential calibration.** Judging claim type and strength against the reported design and evidence, across several kinds of overreach (association → cause, effect → mechanism, study → theory, sample → population) | [Hypothesis] |
| Supporting mechanism | **C2 Principled abstention.** A content-based "cannot be assessed from this excerpt" judgement, kept distinct from "flawed" | [Hypothesis] |
| Supporting mechanism | **C3 Evidence traceability.** Explicit links from Discussion claims to the Results spans offered as evidence | [Hypothesis]. A design test, not a separate contribution |
| Longer term | **C4 Contestability in expert self-assessment.** When a researcher should accept, dispute or ask for more evidence about an AI diagnosis of their own work | Not part of Study A |
| Context only | **C5 Author-facing, pre-submission use** | Not claimed as a contribution |

Three kinds of claim are kept separate:
- **Predictive superiority:** better accuracy than baselines.
- **Design knowledge:** specific mechanisms produce measurable, explainable benefits.
- **Human decision outcomes.**

A strong LLM that matches WarrantLab's accuracy would falsify predictive superiority. It would not, by itself, falsify the design-knowledge claims. Those can rest on inspectability, abstention behaviour or the accuracy of human decisions, and are tested through ablations and controlled comparisons.

## 5. Theoretical uncertainties

1. **The construct may not be unitary.** "Evidential calibration" may combine distinct judgements, such as causal licence, construct validity and generalisation scope, that need separate treatment.
2. **The representation is undecided.** Toulmin's data–claim–warrant model (Toulmin, 1958/2003) is a candidate *representation*, not an explanatory theory. Argumentation schemes and epistemic calibration are alternatives that have not yet been reviewed.
3. **Method standards differ across paradigms.** What licenses a claim differs between experimental, observational, qualitative-interpretive and design-science research. The first cycle may have to restrict itself to two quantitative designs. Whether the approach extends to interpretive IS research is open.
4. **The judgement is excerpt-relative.** "Overreach" here means that the inference is not warranted by the evidence *in the supplied text*. It is not a judgement that the underlying study is flawed. Whether experts can keep these apart is itself an empirical question.
5. **Wording is not warrant.** Strong wording is not necessarily overreach, and hedged wording is not necessarily calibrated. The construct must not collapse into detecting hedges.
6. **Several valid diagnoses.** A claim may admit more than one legitimate criticism, so agreement with a single expert critique is an incomplete measure of correctness (cf. Ou et al., 2025).
7. **The design-theory form is open.** It is not yet decided what form the design knowledge should take, for example design principles or a nascent design theory. The DSR sources are verified but not yet read in full.

## 6. Falsifiable evaluation strategy

No benchmark has been built and no participants have been recruited. The plan is staged, and each stage can stop the programme or redirect it.

**Stage 1: construct feasibility (sub-question 1).**
- A small expert pilot (2–3 IS researchers) on pre-segmented claim–evidence units.
- Agreement is reported per task (assessability, calibration, gap type), together with an analysis of disagreements.
- *Disconfirming result:* experts cannot separate "unassessable" from "overreaching", or agree on calibration only at levels too low to support labels. Thresholds will be fixed before the pilot.
- A pilot this small is a feasibility check. It is **not evidence of reliability**.

**Stage 2: benchmark with controlled items (sub-question 2).** Items cover five conditions. The expected behaviours are to be agreed by independent experts, not by the designers:

| Evidence condition | Claim | Expected behaviour |
|---|---|---|
| Sufficient and appropriate | Calibrated | No warning |
| Sufficient, but it does not license the conclusion | Overclaim | Identify the specific inferential gap |
| Necessary information missing | Not assessable | Abstain and state what is missing |
| Evidence in Results, claim in Discussion | Assessable once linked | Trace the evidence, then judge |
| Keyword-only change, with method information unchanged | Unchanged | No change in diagnosis |

Counterfactual sets hold the claim constant and vary only the design description (e.g. cross-sectional; randomised; randomised with a tested mediator). They test whether judgements respond to *design*, not to keywords such as "randomised".

**Stage 3: comparisons and ablations (sub-question 2).**
- **Baselines:** a strong single-prompt LLM; a design-rule baseline in the style of Isch et al.; a support-validity pipeline in the style of Critical Inker; and a claim-grounded critique baseline in the style of CLAIMCHECK. All use the same model family and the same inputs.
- **Ablations:** with and without method-conditioning, abstention, explicit evidence links, and the two-pass extract-and-judge structure.
- **Abstention (C2)** is evaluated by error rates **together with decision coverage**, for example risk–coverage curves. A system that abstains on everything must score poorly.
- **Traceability (C3)** is tested on **identical content** with and without explicit claim–evidence links, both for the system and for human checkers.
- *Disconfirming results:*
  - Baselines match C1 judgements on the counterfactual sets.
  - At matched coverage, abstention does not reduce errors.
  - Explicit links change neither accuracy nor human verification time and accuracy.
  - An ablated component makes no measurable difference. In that case it is dropped from the design principles.

**Stage 4 (later): human decision outcomes (sub-question 3).** The primary measure is the **accuracy of researchers' final decisions**, including rejection of deliberately wrong diagnoses and acceptance of correct ones, compared with self-review and with a general-purpose LLM. The frequency of disagreement is not a measure of success. This stage requires an ethics review pathway that has not yet been identified.

## 7. Current evidence and its limits

A small proof of concept exists (frozen at Git tag `hackathon-poc-v0.1`).
- **What it does:** it uses two LLM passes with deterministic span verification. Its outcomes are "overclaim", "no overclaim identified" and "insufficient evidence", plus a separate "analysis incomplete" state.
- **Evidence so far:** a smoke test only. Three fictional passages, three completed runs each, with a validation gate amended after the fact to separate provider outages from reasoning errors.
- **What it does not show:** accuracy, usefulness or novelty.
- **Data limits:** it runs on a free-tier API whose terms rule out unpublished manuscripts.

## 8. Feedback sought

1. Is method-conditioned evidential calibration a distinct and worthwhile IS design problem, or is it subsumed by existing work we have missed?
2. Is the central research question well formed for design science research, and is the scope (two quantitative designs first) defensible?
3. Are the disconfirming results in §6 the right ones, and are any important baselines missing?
4. Which theoretical lens would you use for the construct?

## References

Full metadata and reading status for each source are in `SOURCES.md`.

- Alfrink, K., Keller, I., Kortuem, G., & Doorn, N. (2023). Contestable AI by design: Towards a framework. *Minds and Machines, 33*, 613–639. https://doi.org/10.1007/s11023-022-09611-z
- Buçinca, Z., Malaya, M. B., & Gajos, K. Z. (2021). To trust or to think: Cognitive forcing functions can reduce overreliance on AI in AI-assisted decision-making. *Proceedings of the ACM on Human-Computer Interaction, 5*(CSCW1), 1–21. https://doi.org/10.1145/3449287
- Gregor, S., & Hevner, A. R. (2013). Positioning and presenting design science research for maximum impact. *MIS Quarterly, 37*(2), 337–355. https://doi.org/10.25300/MISQ/2013/37.2.01
- Hevner, A. R., March, S. T., Park, J., & Ram, S. (2004). Design science in information systems research. *MIS Quarterly, 28*(1), 75–105. https://doi.org/10.2307/25148625
- Hugenroth, P., Danry, V., & Maes, P. (2026). *Critical Inker: Scaffolding critical thinking in AI-assisted writing through Socratic questioning* (arXiv:2604.07167). https://arxiv.org/abs/2604.07167
- Isch, C., et al. (2026). Quantifying the prevalence and impact of overreaching causal claims in social science. *Nature Human Behaviour.* https://doi.org/10.1038/s41562-026-02553-x
- Ou, J., et al. (2025). CLAIMCHECK: How grounded are LLM critiques of scientific papers? In *Findings of the Association for Computational Linguistics: EMNLP 2025* (pp. 21712–21735). https://doi.org/10.18653/v1/2025.findings-emnlp.1185
- Toulmin, S. E. (2003). *The uses of argument* (Updated ed.). Cambridge University Press. (Original work published 1958)
- Yurrita, M., Verma, H., Balayn, A., Alfrink, K., Gadiraju, U., & Bozzon, A. (2025). Identifying algorithmic decision subjects' needs for meaningful contestability. *Proceedings of the ACM on Human-Computer Interaction, 9*, 1–29. https://doi.org/10.1145/3757415 *(abstract read only)*
- Zhang, B., et al. (2025). A dataset for evaluating clinical research claims in large language models. *Scientific Data, 12*, 86. https://doi.org/10.1038/s41597-025-04417-x
