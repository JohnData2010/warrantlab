# Novelty positioning: WarrantLab against its closest prior work

*Phase 1. Draft 0.1, 27 October 2026 (AEDT). Status: for researcher and supervisor review. **Novelty is not finalised.***

This memo positions the frozen WarrantLab POC (tag `hackathon-poc-v0.1`) against four pieces of closest prior work, spanning three lines of research: **argument support**, **grounded scientific criticism** and **method-dependent evidential overreach**. For each candidate difference it separates what prior work already establishes, what WarrantLab might contribute, and what evidence would falsify the claimed difference.

**Sources** (full metadata and reading status in `../SOURCES.md`):
- **CI:** Hugenroth, Danry & Maes (2026), *Critical Inker*, arXiv:2604.07167. Full text read (see `CRITICAL-INKER-ANALYSIS.md`).
- **CC:** Ou et al. (2025), *CLAIMCHECK*, Findings of EMNLP 2025. Read by the agent from PDF text extraction (§1–4, §4.3, Limitations).
- **IS26:** Isch et al. (2026), *Quantifying the prevalence and impact of overreaching causal claims in social science*, Nature Human Behaviour. Read by the agent through a tool-assisted summary of the main text and methods; the supplementary information was not read.
- **CF:** Zhang et al. (2025), *A dataset for evaluating clinical research claims in large language models* (CliniFact), Scientific Data. Read by the agent through a tool-assisted summary.

The researcher's full reading of CC and IS26 is still pending. **Figures quoted here should be checked against the papers before they are cited.**

---

## 1. Comparison across eight dimensions

| Dimension | Critical Inker (CI) | CLAIMCHECK (CC) | Isch et al. (IS26) | CliniFact (CF) | WarrantLab POC |
|---|---|---|---|---|---|
| **Research problem** | AI writing assistants risk cognitive deskilling. Scaffold writers' critical reflection | LLM peer-review critiques are often not grounded in the claims a paper actually makes | How prevalent causal overreach is in cross-sectional social science, and what it does to readers and LLM summaries | Evaluating LLMs on verifying clinical research claims against evidence | Researchers do not see when their own claims exceed what their reported evidence licenses |
| **Unit of analysis** | Argument relations in a short essay | A reviewer weakness linked to target claims in full ML papers (text, figures and related work) | Titles and abstracts (194,631 articles); claim level in a subsample of 100 articles | Constructed claim plus a linked abstract (1,970 pairs) | A claim in a supplied passage (≤ 3,000 words), with evidence quoted from the same passage |
| **Epistemic judgement** | Whether the support relation is valid, **assuming the evidence is true** | Whether a weakness disputes a claim; multi-label weakness type (insufficient evidence, contradictory evidence, novelty, clarity, related work, other); ordinal agreement and subjectivity | Whether causal language is present in a design that cannot establish causation (cross-sectional), i.e. **design-conditioned overreach**; also distinguishes direct, implied and conditional claims | Whether evidence supports the claim, using labels largely derived from trial statistics (p < 0.05) and link type | Overclaim (a nameable inferential step beyond the evidence), calibrated, or insufficient evidence |
| **Treatment of missing evidence** | Not described | 48 of 168 weaknesses had no groundable target claim. An "insufficient evidence" weakness type exists. No abstention by models is described | Not central. Prevalence counts language, not evidential gaps | An explicit **NEI** label, assigned from link type (background versus results abstract) rather than from a content judgement | An explicit `insufficient_evidence` outcome, judged from the content of the supplied text, with a "may need another section" note |
| **Method awareness** | Not described | Not described as a design dimension | **Core.** Design (cross-sectional) is the conditioning variable for overreach, with design classification validated against experts | Only statistical test type (superiority, non-inferiority, equivalence) and a p-value threshold | Prompt-level rules for two cases only (randomisation versus mechanism; qualitative work not held to causal standards). No method-specific rubric |
| **Human involvement** | Writer-facing. Socratic verbalisation. Pilot with n = 7 | Expert annotators (all authors, unpaid). The use case is reviewer and meta-reviewer assistance | Expert coding for validation (α = 0.86 on causal language). Preregistered reader experiment (N = 1,105) | Two reviewer groups revised test labels (κ = 0.85) | Writer-facing. Edit and re-analyse. No contestation. No user study |
| **Evaluation** | Structure overlap and validity accuracy on essay and NLI data (n = 100 each) | Agreement between humans and with LLMs (span F1; Krippendorff's α from 0.00 (clarity) to 0.78 (novelty) among humans, depending on label); LLM benchmarks on three tasks | Classifier validation (e.g. causal-language F1 ≈ 0.81–0.83); prevalence trends; experimental effects of interventions; LLM summary experiments | Model accuracy and F1 (e.g. BioBERT 80.2%; best zero-shot generative 43.4%) | 3 fictional fixtures × 3 completed runs (smoke test) |
| **Contribution type** | Interaction design plus an LLM pipeline | Dataset, task suite and benchmark | Meta-science evidence (prevalence, trends, effects) plus validated classifiers | Dataset plus a benchmark | Prototype only |

## 2. What prior work already establishes

1. **The problem is real and growing, at least in social science.** IS26 reports causal language in the titles or abstracts of about 46% of cross-sectional social-science articles (1980–2024), rising from about 20% to about 60% since 2000. Business was at 84% in 2024. At claim level, about 27% of claims in a 100-article subsample were overreaching. *This supports WarrantLab's problem statement for adjacent fields. It does not establish prevalence in IS, and not all causal language is erroneous.*
2. **Design-conditioned overreach detection is feasible and has been validated at scale** for one rule: cross-sectional design plus causal language (IS26).
3. **Interventions can change how readers interpret overreaching claims**, including a methodological note and an "AI feedback" condition (IS26). LLM summaries can amplify causal overstatement, and cautious prompting reduces this (IS26).
4. **Grounding critiques in specific paper claims is an established research problem**, with an expert-annotated benchmark. LLMs struggle to produce specific, claim-grounded weaknesses: over 80% of model weaknesses were judged different from the reviewers' (CC).
5. **Expert agreement on weakness types is limited and varies by label** (α from 0.00 for clarity to 0.78 for novelty; 0.18 for the ordinal agreement rating). Annotators confuse "insufficient" with "contradictory" evidence, and long, compounded critiques lower agreement (CC). *This directly warns that WarrantLab's taxonomy may face the same problems.*
6. **A "not enough information" class is standard** in scientific claim verification (CF; also the earlier FEVER-style tradition cited by CC).
7. **Argument-structure extraction, quote grounding and reflective, non-corrective feedback for writers** already exist (CI).

**Implication:** the following are **not** contributions on their own: (a) detecting causal overreach, (b) grounding critiques in claims, (c) having an abstention or NEI class, (d) quote-anchored writer feedback, and (e) applying any of these to IS text. **Domain adaptation to IS is not a theoretical contribution.**

## 3. Candidate unique contributions, and how each could be falsified

Each candidate is a **[Hypothesis]**. A candidate survives only if the falsification test fails to falsify it.

### C1 Claim-level calibration conditioned on design and claim type

- **Claim:** whether a claim's *type and strength* (association, causal effect, mechanism, theory validation, scope) is licensed by the *reported design and evidence*, judged per claim in context. This extends IS26's single, design-level rule (cross-sectional → causal language = overreach) to multiple overreach types and to designs that license some claims but not others. For example, an RCT supports a causal effect of the condition but not necessarily the proposed mechanism.
- **Closest prior work:** IS26 (design-conditioned overreach), CI (validity assuming true evidence).
- **What would falsify it:**
  - An **IS26-style baseline** (design classifier plus claim-type or causal-language classifier, with a fixed licensing table) matches WarrantLab's calibration judgements on expert-labelled items.
  - A **strong single-prompt LLM** matches it.
  - Experts cannot agree on claim-level calibration beyond chance-corrected levels comparable to CC's weakest labels.

### C2 Excerpt-relative abstention as a judgement, distinct from flaw

- **Claim:** the system judges, from content, that the supplied text cannot support an assessment, and keeps this distinct from "flawed". Unlike CF, NEI is not inferred from document links.
- **Closest prior work:** CF (NEI from link type); CC (weaknesses without target claims).
- **What would falsify it:**
  - Experts cannot reliably separate "unassessable from this excerpt" from "flawed" (low agreement on the assessability task, T3 in `../taxonomy/STRUCTURE-MEMO.md`).
  - Abstention does not reduce false flags relative to baselines without it, at comparable recall.

### C3 Cross-section evidential traceability in support of calibration

- **Claim:** linking Discussion claims to the specific Results spans offered as evidence improves calibration judgements, and makes them inspectable.
- **Closest prior work:** CC provides full papers and related work to models for verification, so whole-document grounding exists in a *verification* setting. CI grounds within a single essay.
- **What would falsify it:**
  - Explicit span linking does not improve calibration accuracy over giving the model the same sections unlinked.
  - Experts do not find the links more useful for checking diagnostics.

### C4 Contestability and accountable human decisions

- **Claim:** design knowledge about letting authors dispute a diagnostic, supply evidence and have the human decision recorded as final, and about whether this improves decision quality without increasing reliance.
- **Closest prior work:** none of the four records author disputes. Contestability in wider AI and HCI work has **not yet been reviewed**, and must be before this candidate is asserted.
- **What would falsify it:**
  - Authors rarely use contestation.
  - Contestation does not improve the correctness of final decisions, or worsens them (e.g. users dismiss correct diagnostics).
  - Existing contestable-AI frameworks already specify these mechanisms for this kind of task.

### C5 Author-facing, pre-submission use context (not a theoretical contribution by itself)

- CC is reviewer-facing, IS26 is reader- and corpus-facing, and CI is writer-facing but logic-generic. Combining author-facing use with scholarly calibration is a **use-context difference**. It matters for Study B, but it is not novelty on its own.
- **What would falsify its relevance:** author-facing feedback produces the same outcomes as reader-facing methodological notes (cf. IS26's interventions).

## 4. Implications

**For the problem statement.**
- Ground the problem in IS26's evidence for adjacent social sciences (including business), together with an explicit statement that IS-specific prevalence is unknown.
- **[Plan, candidate]** A small replication of IS26's approach on an IS corpus could establish IS prevalence, subject to corpus licensing and supervisor approval. This would be a separate meta-science contribution.

**For Study A.**
- Required baselines are now:
  - (b1) a strong single-prompt LLM;
  - (b2) an **IS26-style design-rule baseline**;
  - (b3) a **CI-style support-validity pipeline**;
  - (b4) a **claim-grounded critique baseline** in the style of CC's claim-verification task.
- The benchmark must include items where these baselines and calibration-focused judgement are expected to **diverge**, including controlled counterfactual variants that change only the design information (see the taxonomy memo §6).
- CC's agreement results (α as low as 0.00 on clarity and 0.18 on agreement) mean the pilot should expect, and report, label-specific disagreement.

**For Study B.**
- IS26 already shows that a methodological note or AI feedback can reduce *readers'* causal interpretation.
- Study B's distinctive questions must therefore concern *authors*:
  - independent transfer to new passages;
  - resistance to wrong AI diagnoses;
  - whether contestability changes reliance.
- IS26's finding that LLM summaries amplify overstatement also supports WarrantLab's no-rewriting principle as a safeguard. This should be tested, not assumed.

## 5. Revised candidate positioning (for discussion)

> WarrantLab investigates how author-facing information systems can support **claim-level, design-conditioned judgements about whether scholarly claims are warranted by the reported evidence**, with **principled abstention** when the supplied text is insufficient and **contestable, human-accountable decisions**. It builds on design-conditioned overreach detection (Isch et al., 2026), grounded scientific critique (Ou et al., 2025), claim–evidence verification with not-enough-information labels (Zhang et al., 2025) and argument-support feedback for writers (Hugenroth et al., 2026).

This is a **[Hypothesis]** about where a contribution might lie. Applying it to IS text is not itself the contribution.

## 6. Next reading priorities

1. **The researcher's full reading of CC and IS26**, including IS26's supplementary information on claim-level coding and the "AI feedback" condition.
2. **Contestable AI and human–AI reliance**, before asserting C4.
3. **Scientific claim verification surveys**, e.g. the overview cited by CC, to check for design-conditioned calibration beyond causal language.
