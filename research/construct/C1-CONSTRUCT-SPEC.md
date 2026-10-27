# Construct specification: method-conditioned evidential calibration (C1)

*Conceptual Development phase. Draft 0.1, 27 October 2026 (AEDT). Status: for independent research review.*

**Nothing in this document is validated.**
- It is an agent-drafted proposal for the project owner's review.
- It does **not** finalise the G1–G7 taxonomy or the codebook. No benchmark items are built here.
- Every example is **fictional**, written for this document, and is not drawn from any real paper.

**Question this document addresses.**

> On what information and inference rules is a scholarly claim judged *warranted*, *overreaching* or *unassessable*, and how can two experts apply those rules consistently?

## 1. Working definition

> **Method-conditioned evidential calibration** is the assessment of whether the type, scope and strength of a scholarly claim are justified by the evidence, methodological information and assumptions available for examination.

This is a **[Proposed]** working definition. It is not an established definition in the literature.

**Unit of judgement.** One claim, in a supplied excerpt, together with whatever evidence and method information that excerpt contains. The judgement is always **excerpt-relative** (`../taxonomy/STRUCTURE-MEMO.md` §5).

**Three boundaries** (from `../CONCEPT-NOTE.md` §3):
1. **Reported warrant ≠ study validity.** The judgement concerns the inference as presented, not whether the study is sound.
2. **Unavailable ≠ inadequate ≠ contradictory evidence.**
3. **Method information ≠ method keywords.**

## 2. Six components

The components are judged **jointly**. A claim cannot be classified from its wording alone, nor from its method alone.

### 2.1 Claim: type, scope and strength

| Attribute | What to record | Candidate values (provisional) |
|---|---|---|
| **Type** | What kind of relation or conclusion is asserted | Descriptive · associational · predictive · causal effect · mechanism (how or why X affects Y) · theory-level (supports, confirms or validates a theory) · contribution or implication |
| **Scope** | To whom, where and when the claim is said to hold | Sample only · stated population · unbounded or universal ("all organisations", "users") |
| **Strength** | The epistemic commitment expressed | Tentative ("consistent with", "may") · moderate ("suggests", "indicates") · strong ("shows", "demonstrates") · conclusive ("proves", "confirms", "fully explains") |

**Notes.**
- *Strength* is judged from the commitment the sentence makes, not by keyword lookup. "We find that X is associated with Y" is a strong commitment to an associational claim, and that may be fully warranted.
- A hedge lowers strength but does **not** change type or scope. "May suggest that X causes Y in all firms" is still a causal, universal claim.
- Whether a hedge is enough to make such a claim calibrated is a boundary question (§5, B3).

### 2.2 Reported evidence

What result is offered for the claim:
- **Kind:** an estimate or test (with direction and size where given), a comparison, a model fit, or a qualitative finding.
- **Location:** the same paragraph, another supplied section, or "cited elsewhere".
- **Relation to the claim:** whether the evidence concerns the *same constructs and relation* the claim states. For example, the evidence may concern intention while the claim concerns behaviour.

### 2.3 Methodological information and assumptions

| Attribute | Examples of what is relevant |
|---|---|
| **Design** | Was X manipulated or assigned? By whom, to which units, and how (random, lottery, self-selected)? Cross-sectional, longitudinal or panel? Qualitative or interpretive? |
| **Measurement** | How the constructs in the claim were operationalised |
| **Sampling** | Who was studied, and how they were selected |
| **Analysis** | The estimation or analytic approach, if it bears on the claim (e.g. a mediation analysis) |
| **Assumptions** | *Stated:* assumptions the text makes explicit. *Required but unstated:* assumptions the inference needs that are not mentioned (e.g. no unmeasured confounding; temporal order of mediator and outcome; measurement validity) |

### 2.4 Inferential warrant

The **rule** that would connect this kind of evidence, obtained by this method under these assumptions, to this kind of claim. The candidate warrant patterns below are provisional, not a taxonomy:

| Pattern | Licenses (under the stated conditions) | Does not license on its own |
|---|---|---|
| **W-assoc** Observed covariation | Association in the sample (or the population, given suitable sampling) | Causal effect, mechanism |
| **W-rand** Random or lottery assignment of X, with Y measured | An average effect of X on Y for the studied units and setting | A mechanism; effects in other populations or settings |
| **W-ident** An identification strategy for observational data (e.g. a natural experiment), with its assumptions stated | A causal effect, conditional on those assumptions | A causal effect when the assumptions are unstated or implausible |
| **W-med** A measured mediator, with temporal order and a mediation analysis | Evidence consistent with a pathway, under the mediation assumptions | A "proven" mechanism |
| **W-sample** Probability or justified sampling | Generalisation to the sampled population | Generalisation beyond it |
| **W-theory** Results consistent with a theory's predictions | "Consistent with" or "supports" the theory, in this context | Validates, confirms or "fully explains" the theory |
| **W-qual** Interpretive or process evidence | Accounts of how participants experience or describe a process | Population-level effect sizes; claims outside the qualitative tradition's own warrant standards (to be defined with qualitative experts) |

### 2.5 Assessability

The question is whether claim, evidence and method information can each be determined from the excerpt well enough to apply a warrant.

| Assessability state | Meaning | Resulting judgement |
|---|---|---|
| **Assessable** | The information needed to apply a warrant is present | Proceed to §2.6 |
| **Unassessable: information absent** | Needed design, measurement or sampling information is not in the excerpt | *Unassessable*. Record **what is missing**. **Never** label this overreach |
| **Unassessable: claim unclear** | It cannot be determined what is claimed (e.g. irreducible ambiguity) | *Unassessable*. Record why |

### 2.6 Potential overreach

When a claim is assessable, compare what is **claimed** (type, scope, strength) with what the applicable **warrant licenses**. Four candidate outcomes:

| Outcome | Condition | What must be recorded |
|---|---|---|
| **Warranted (calibrated)** | The claim does not exceed what the warrant licenses on any dimension | — |
| **Overreaching** | The evidence and method are present but **inadequate** for the claim on one or more dimensions | Which dimension (type, scope or strength), and the specific missing inferential step |
| **Contradicted** | The supplied evidence points **against** the claim (e.g. no difference reported, but improvement claimed) | The contradicting evidence. *[Open question] whether this is a separate outcome or a sub-type of overreaching* |
| *Unassessable* (from §2.5) | Information absent | What is missing |

The word *potential* is deliberate. Overreach is a judgement about the excerpt, not a verdict on the study.

## 3. Decision procedure (provisional order)

1. **Identify** the claim (in the first pilot this is pre-segmented).
2. **Characterise** the claim: type, scope and strength (§2.1).
3. **Identify** the evidence offered for it (§2.2).
4. **Identify** the method information and assumptions, stated and required (§2.3).
5. **Assessability gate** (§2.5). If information is absent, stop: *unassessable*, recording what is missing.
6. **Select the applicable warrant** pattern (§2.4) from the *described* design, not from keywords.
7. **Compare** claim with warrant on each dimension. Record *warranted*, *overreaching* (with the dimension and gap) or *contradicted*.
8. **Record** confidence, and whether the judgement would plausibly change with more of the paper.

Whether experts actually follow this order, or reach judgements another way, is something the pilot should observe. The order is **not** imposed as the correct procedure.

## 4. Examples (all fictional)

### 4.1 Matched set: the claim is constant, the design varies

**Claim held constant:** *"Access to the analytics dashboard increases managers' data-driven decision-making."* (type: causal effect; scope: managers, unbounded; strength: strong)

| # | Supplied evidence and method information | Expected judgement (proposed) | Why |
|---|---|---|---|
| M1 | Cross-sectional survey of 412 managers. Self-reported dashboard use correlates with a data-driven decision-making scale (r = .38) | **Overreaching** (type) | W-assoc licenses association only. A causal claim needs an assignment or identification warrant |
| M2 | Field experiment. 60 teams were assigned by lottery to receive access or not; decision-making was coded from meeting minutes three months later. Treated teams scored higher | **Warranted** for an effect in these firms. **Overreaching** (scope) if read as applying to all managers | W-rand applies. The unbounded scope exceeds the studied setting |
| M3 | Like M1, but "respondents were randomised to one of two questionnaire orders" | **Overreaching** (type). The keyword does not change the warrant | Randomisation of *questionnaire order* does not assign X |
| M4 | Like M2, but the text never uses "randomised" ("teams were allocated by drawing lots") | **Warranted** (as M2) | The described design is a random assignment even without the keyword |
| M5 | A Discussion excerpt only: "Our results show that dashboard access increases data-driven decision-making." No design information is supplied | **Unassessable** (information absent: design, sample) | The excerpt gives no basis to judge. *Not* overreach |

### 4.2 Positive examples (warranted)

- **P1.** *"In our sample, dashboard use was positively associated with data-driven decision-making (r = .38)."* With M1's design. Associational type and sample scope match W-assoc. The strong wording ("was positively associated") is a firm commitment to an association, which is licensed.
- **P2.** *"These results are consistent with the information-processing view of dashboards."* With M2's design. "Consistent with" is a theory-level claim at tentative strength, and W-theory licenses it.

### 4.3 Counterexamples (they look like one judgement but are another)

- **X1. Strong wording, but warranted.** *"The data clearly demonstrate that 71% of respondents used the dashboard weekly."* This is a descriptive claim about the sample, directly reported. "Clearly demonstrate" is not overreach here.
- **X2. Hedged, but still overreaching.** *"This may suggest that dashboards transform decision cultures across industries."* With a single-firm cross-sectional design. The hedge lowers strength, but the type (causal) and scope (across industries) still exceed W-assoc and W-sample. This is offered as a counterexample to "hedges fix overreach". Its final status is boundary case B3.
- **X3. Keyword present, warrant absent.** This is M3.
- **X4. Keyword absent, warrant present.** This is M4.
- **X5. Absent, not inadequate.** This is M5, which contrasts with M1. In M1 the design information is *present and inadequate*; in M5 it is *absent*.
- **X6. Contradicted, not overreaching.** The Results report *"no significant difference between treated and control teams (d = 0.04)"*. The Discussion says *"dashboard access improved decision-making"*. The evidence points against the claim.

### 4.4 Ambiguous boundary cases (to examine in the pilot, not to resolve now)

| # | Case | Why it is ambiguous |
|---|---|---|
| B1 | M2 plus a mediator ("perceived transparency") measured at month 1 and the outcome at month 3, with a mediation analysis. Claim: "dashboards improve decisions **through** transparency" | W-med gives evidence consistent with a pathway, but mediation rests on assumptions (e.g. no mediator–outcome confounding) that are rarely stated. Is "through" warranted, or overreaching on strength? |
| B2 | Convenience sample of 412 managers recruited on a professional networking site. Claim about "managers" | How explicit must scope be? Is an implicit population claim overreach, or a normal convention of the genre? |
| B3 | X2: hedged causal and universal claim | Does sufficient hedging make a claim calibrated, or does type and scope dominate strength? |
| B4 | Three-wave panel. Earlier dashboard use predicts later decision-making, controlling for earlier decision-making. Claim: "dashboard use **leads to**…" | Is a lagged panel an identification warrant (W-ident) or association (W-assoc)? Experts may reasonably differ |
| B5 | Interview study (n = 18). Claim: "dashboards change decisions by making uncertainty visible" | Mechanism claims under an interpretive warrant (W-qual). The standards must come from qualitative experts, not from the quantitative patterns |
| B6 | "Prior studies show dashboards improve performance [cite]" | An attributed claim. Is it in scope at all? (`../taxonomy/STRUCTURE-MEMO.md` §1.4) |
| B7 | Conditional phrasing: "If dashboards increase transparency, they may improve decisions" | Isch et al. counted conditional causal language as overreach in their prevalence measure. Should a claim-level judgement do the same? |
| B8 | Practice implication: "Managers should adopt dashboards" | A normative claim. What warrant is required, and is it in scope? |

## 5. What this document deliberately leaves open

- **The taxonomy.** The relation between these dimensions (type, scope, strength) and the provisional gap labels G1–G7 is not decided. A tentative correspondence is that the type dimension covers G3 (causal) and G1 (mechanism), scope covers G5, and theory-level claims cover G2. This is a hypothesis for the pilot, not a mapping.
- **Annotation structure.** Whether annotators record each component separately, or only the final outcome with a rationale.
- **The "contradicted" outcome.** Whether it is a separate outcome (§2.6).
- **The warrant patterns.** Whether the list in §2.4 is complete or appropriately grained. Patterns for design science and interpretive research are not developed.
- **Thresholds and statistics** for any later confirmatory study (`../CONCEPT-NOTE.md` §7, Stage 2).

## 6. Questions the exploratory pilot should answer

1. Can experts separate **absent** from **inadequate** information consistently (M1 versus M5)?
2. Do experts' judgements respond to **design changes** in matched sets, and *not* to keyword changes (M1 to M4)?
3. Do experts agree on **which dimension** (type, scope or strength) is exceeded, even when they agree a claim overreaches?
4. Which boundary cases (B1–B8) produce disagreement, and is the cause the definition, the item, or genuine expert disagreement?
5. Does hedging change experts' judgements (B3, X2)?
