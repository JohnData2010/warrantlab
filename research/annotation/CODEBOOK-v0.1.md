# Annotation codebook: method-conditioned evidential calibration

*Version 0.1, 27 October 2026 (AEDT). **Draft for internal conceptual testing only.***

**Status and limits.**
- Every definition, code, field and example is **provisional**.
- This codebook operationalises `../construct/C1-CONSTRUCT-SPEC.md` (draft 0.3). Where the two differ, the specification governs, and the difference is logged as a codebook issue (§10).
- It is for **internal conceptual testing** by the project owner: checking that the definitions can be applied, and finding gaps and ambiguities.
- It is **not** for expert recruitment, benchmark construction or model evaluation. None of these has begun.
- It does **not** finalise the G1–G7 taxonomy.
- All examples are **fictional**.

---

## 1. What is annotated

**Item.** One **claim span**, already segmented, together with the **supplied excerpt**: the text that contains the claim and any evidence or method information supplied with it. During internal testing, claim spans and evidence spans are given. Annotators do not identify them (tasks T1 and T2 in `../taxonomy/STRUCTURE-MEMO.md` §2 are deferred).

**Every judgement is excerpt-relative.** It concerns whether the inference **as presented in the supplied text** is warranted. It is not a judgement on whether the study is sound or its conclusion true.

**Three rules apply throughout:**

| Rule | Instruction |
|---|---|
| **R1 Original claim** | Judge the claim **as written**. Do not narrow it into a claim the evidence would support. If its meaning is ambiguous, record the ambiguity and the reading you adopt (field `reading`) |
| **R2 Information, not keywords** | Judge from the **described** design, measures and results, never from the presence of words such as "randomised", "causal" or "significant" |
| **R3 Absent is not inadequate** | If the information needed for a dimension is **absent**, record *unassessable* for that dimension. Never record *overreaching* for missing information |

## 2. Annotation record

Each item produces one record. Fields marked *per dimension* are completed separately for each of the four dimensions in §3.

| Field | Content | Values |
|---|---|---|
| `item_id` | Item identifier | Text |
| `annotator_id` | Annotator identifier | Text |
| `claim_span` | The claim, as given | Quoted text (pre-filled) |
| `reading` | The interpretation adopted where the claim is ambiguous (e.g. how a generic plural is read), with a reason | Free text, or "no ambiguity" |
| `alt_reading` | A second plausible reading, if one exists | Free text, or blank |
| `claimed_value` *(per dimension)* | What the claim asserts on this dimension | See §3 |
| `qualification` | Explicit conditions or limits the claim attaches to itself | `none` · `conditional_assumption` · `stated_limitation` · `other` (describe) |
| `evidence_spans` | The evidence offered for the claim, as given | Quoted text (pre-filled) |
| `method_info` | The design, measurement, sampling, unit and timing information found in the excerpt | Short notes, quoting the text |
| `warrant` | The applicable warrant pattern (spec §2.4) | `W-assoc` · `W-rand` · `W-ident` · `W-med` · `W-sample` · `W-theory` · `W-qual` · `none_applicable` · `unsure` |
| `assumptions` | For each identifying assumption of the warrant: its status | `addressed` · `stated_not_addressed` · `unmentioned` · `reported_threat` (spec §2.4) |
| `assessability` *(per dimension)* | Whether this dimension can be judged from the excerpt | `assessable` · `unassessable_absent` · `unassessable_unclear` (§4) |
| `missing` *(per dimension, if unassessable)* | What information would be needed | Free text |
| `relation` *(per dimension, if assessable)* | The relationship between evidence and claim on this dimension | `warranted` · `overreaching` · `contradicted` (§5) |
| `overreach_basis` *(if overreaching)* | Why | `design_inadequate` · `insufficient_statistical_evidence` · `exceeds_sample` · `exceeds_time` · `exceeds_unit` · `measure_gap` · `assumption_threat` · `other` (describe) |
| `rationale` *(per dimension)* | One or two sentences naming the specific inferential step | Free text (required for every non-`warranted` judgement) |
| `confidence` *(per dimension)* | The annotator's confidence | `low` · `medium` · `high` |
| `more_text_would_change` | Whether the judgement would plausibly change with more of the paper | `yes` · `no` · `unsure` |
| `disagreement` | Whether reasonable experts could disagree, and on what (§8) | See §8 |
| `codebook_issue` | Any problem applying this codebook to the item | Free text, or blank |

**Output.** The record **is** the result: a **dimension-level profile**. No overall verdict is required (spec §3). Candidate aggregation rules may be applied to the records later, for analysis only.

## 3. Dimensions

### 3.1 Type (`TYPE`)

**Definition.** The kind of relation or conclusion the claim asserts, including its **direction** and **what X is**. For example, *access to* a system is a different X from *use of* it.

| `claimed_value` | Meaning |
|---|---|
| `descriptive` | Reports a state or frequency |
| `associational` | X and Y covary |
| `predictive` | X predicts Y, with no causal commitment |
| `causal_effect` | X changes Y |
| `mechanism` | X changes Y *through* M, or *because of* a process |
| `theory_level` | The result bears on a theory (supports, confirms, validates) |
| `implication` | Contribution, practice or policy implication |

Also record the **direction** (`positive`, `negative`, `none`, `n/a`) and **X as stated** (quote it).

### 3.2 Scope (`SCOPE`)

**Definition.** To whom, where, when and at what **unit** the claim is asserted to hold.

Record four parts:
- **population:** `sample_only` · `bounded` (quote the bound) · `generic_plural` · `universal`
- **setting:** quote it, or "not stated"
- **time:** quote it, or "not stated"
- **unit of inference:** `individual` · `group` · `organisation` · `not_stated`

A **generic plural** (e.g. "managers") requires a `reading`. Do not resolve it in the claim's favour (R1).

### 3.3 Strength (`STRENGTH`)

**Definition.** The **epistemic commitment** the claim expresses, *independent of* any conditions attached to it.

| `claimed_value` | Typical commitment (not a keyword list) |
|---|---|
| `tentative` | Possibility ("may", "is consistent with") |
| `moderate` | Indication ("suggests", "indicates") |
| `strong` | Assertion ("shows", "increases", "we find") |
| `conclusive` | Certainty or completeness ("proves", "establishes", "fully explains") |

Record conditions separately in `qualification`, **not** as a strength level. A hedge lowers strength but does not change type, scope or construct.

### 3.4 Construct correspondence (`CONSTRUCT`) — provisional

**Definition.** Whether the **operationalised measures** of X and Y adequately represent the **constructs the claim names**.

| `claimed_value` | Meaning |
|---|---|
| (the construct as named) | Quote the construct in the claim, and note its kind (behavioural, attitudinal, perceptual, outcome) |

**Guidance.**
- Compare the measure's **content**, **source** (self, other, record, observation) and **conditions** (e.g. unblinded responses) with the construct named.
- **Self-report is not automatically invalid.** It may correspond well to perceptual or attitudinal constructs. Its correspondence to behavioural constructs is a judgement, not a rule.
- Validation information reported in the excerpt is relevant. Its absence is recorded but is not by itself a gap.
- **Mapping to the shared codes** (provisional). The spec's correspondence values (spec §2.1) are recorded with the shared relation and assessability codes:

  | Spec value | Recorded as |
  |---|---|
  | Corresponds | `relation = warranted` |
  | Partly corresponds | `relation = overreaching`, `overreach_basis = measure_gap`, with the gap described. If you judge the gap minor, code `warranted` and record `D-construct` under `disagreement` |
  | Does not correspond | `relation = overreaching`, `overreach_basis = measure_gap` |
  | Measure not described | `assessability = unassessable_absent` |

- This dimension must be kept separate from `TYPE`. A measure gap is about **what Y is**, not about whether the relation is causal. If you cannot separate the two for an item, record that in `codebook_issue`, because it is a pilot question.

## 4. Assessability states (per dimension)

| Code | Use when | Do not use when |
|---|---|---|
| `assessable` | The information needed to apply a warrant to this dimension is in the excerpt | — |
| `unassessable_absent` | The needed information is **missing** (e.g. no sampling information, so scope cannot be judged). Record `missing` | The information is present but weak or inadequate. That is `overreaching` |
| `unassessable_unclear` | What the claim asserts on this dimension cannot be determined, even after recording a `reading` | One plausible reading exists. Record it and judge |

Dimensions are independent. A claim can be `assessable` on `TYPE` and `unassessable_absent` on `SCOPE`.

## 5. Relations between evidence and claim (per assessable dimension)

| Code | Definition | Key distinction |
|---|---|---|
| `warranted` | The claim does not exceed what the applicable warrant licenses on this dimension, given the assumption statuses | Strong wording can be warranted |
| `overreaching` | The evidence and method information are **present but inadequate** for the claim on this dimension. Record `overreach_basis` | Includes **insufficient statistical evidence**: an estimate too imprecise or small to support the claimed effect |
| `contradicted` | The reported evidence points in the **opposite direction** to the claim on this dimension | Conflict with the **reported evidence**, not proof that the effect is false. Not an overall verdict, and no automatic precedence |

**Insufficient versus contradicted.**
- A non-significant or near-zero result with an interval spanning both directions is **insufficient** (`overreaching`, basis `insufficient_statistical_evidence`), not `contradicted`.
- Use `contradicted` only when the estimate is in the opposite direction **and** is reasonably precise. Record the interval in the `rationale`.
- A claim of *no effect* drawn from an imprecise null is also `overreaching`, because imprecision does not show absence.

## 6. Decision guidance

### 6.1 Order of work (suggested, not mandatory)

1. Read the claim. Record `reading` and `alt_reading`.
2. Record `claimed_value` for each dimension, and `qualification`.
3. Read the evidence and record `method_info`.
4. Select the `warrant` from the **described** design (R2). Record `assumptions`.
5. For each dimension, decide `assessability` (R3). If assessable, decide `relation` and `overreach_basis`.
6. Write a `rationale` for each non-`warranted` judgement, naming the **specific inferential step**.
7. Record `confidence`, `more_text_would_change`, `disagreement` and any `codebook_issue`.

If you reach a judgement by another route, note it in `codebook_issue`. Whether annotators follow this order is itself of interest.

### 6.2 Guidance by dimension

**TYPE**
- Causal claims need a causal warrant (`W-rand` or `W-ident`). Association-only evidence makes a causal claim `overreaching` (basis `design_inadequate`).
- **Assigned access versus use.** Random assignment of access warrants claims about **assigned access**. A claim about **use** needs compliance information and an appropriate estimand. Without them, treat it as a boundary case and record it as `disagreement`.
- **An assumption statement is not an identification strategy.** "Assuming no unmeasured confounding" does not turn `W-assoc` into `W-ident`. A claim qualified by such a statement (`qualification = conditional_assumption`) **may** be licensed. Record the assumption as `stated_not_addressed`.
- Mechanism claims need mediator evidence (`W-med`) or an interpretive warrant (`W-qual`). An effect estimate alone does not warrant a mechanism.

**SCOPE**
- Compare each scope part with the sample, setting, time and unit **as described**.
- When X is assigned to groups, the estimate is a **group-level average**. A claim about **each** individual exceeds the unit (basis `exceeds_unit`).
- Clustering: if individuals are nested in groups, check whether the reported uncertainty reflects this. If it does not, note it in the `rationale`. It bears on strength more than scope.

**STRENGTH**
- Compare the commitment with what the warrant and its assumption statuses support.
- **Provisional:**
  - An unqualified *conclusive* claim resting on `stated_not_addressed` or `reported_threat` assumptions is a **candidate** for `overreaching` (basis `assumption_threat`).
  - **Unmentioned standard assumptions are recorded, not automatically penalised.** A strongly worded experimental result is not `overreaching` *solely* because balance, attrition or blinding go unreported. If your judgement depends on this, say so in the `rationale` and in `disagreement`.

**CONSTRUCT**
- Name the gap between the measure and the construct, if there is one: content, source or conditions.
- Do not code `does not correspond` just because the measure is self-reported.

## 7. Worked examples

All examples use the fictional base case and claim from the spec (§4). The claim is:

> *"Access to the analytics dashboard increases managers' data-driven decision-making."*

### 7.1 Example A: D2, random assignment of access

`reading`: "managers" read as managers in general (no bound stated). `alt_reading`: managers in comparable firms.

| Dimension | `claimed_value` | `assessability` | `relation` | `overreach_basis` | `rationale` |
|---|---|---|---|---|---|
| TYPE | causal_effect, positive; X = *access* | assessable | warranted | — | Team-level random assignment of access (`W-rand`). Retention complete and baseline similar (`addressed`) |
| SCOPE | generic_plural; setting not stated; time not stated; unit not stated | assessable | overreaching | exceeds_sample | The evidence comes from two convenience-sampled logistics firms in one country; the claim, as read, is general |
| STRENGTH | strong; `qualification = none` | assessable | warranted | — | Strong assertion of an effect of assigned access is supported by `W-rand` with assumptions addressed |
| CONSTRUCT | "data-driven decision-making" (behavioural) | assessable | warranted | — | Coded meeting minutes, with blind coders, correspond to a behavioural construct |

`disagreement`: yes, on SCOPE (reading of the generic plural: B2).

### 7.2 Example B: D5, Discussion excerpt only

| Dimension | `assessability` | `missing` |
|---|---|---|
| TYPE | unassessable_absent | How access came about |
| SCOPE | unassessable_absent | Sample and setting |
| STRENGTH | unassessable_absent | Any result or design to compare the commitment with |
| CONSTRUCT | unassessable_absent | How decision-making was measured |

**No dimension is `overreaching`** (R3).

### 7.3 Example C: X6, a non-significant result

Evidence: *"no significant difference (d = 0.04, 95% CI [−0.31, 0.39])"*. Design as D2.

| Dimension | `relation` | `overreach_basis` | `rationale` |
|---|---|---|---|
| TYPE | overreaching | insufficient_statistical_evidence | The interval spans small negative, null and small positive effects. It does not support a positive effect. It is **not** contradicted |

### 7.4 Example D: Me2, self-reported outcome

Measure: managers' agreement with "I base decisions on data", collected after unblinded access. Design as D2.

| Dimension | `relation` | `overreach_basis` | `rationale` |
|---|---|---|---|
| TYPE | warranted (for an effect on *the measured outcome*) | — | Random assignment of access |
| CONSTRUCT | overreaching (or partly corresponds; `disagreement = yes`) | measure_gap | A self-reported belief about practice, under unblinded conditions, is weaker evidence for the **behavioural** construct claimed. Self-report as such is not the problem |

This example tests whether `TYPE` and `CONSTRUCT` can be kept apart.

### 7.5 Example E: S3, scope unassessable, type assessable

Design as D2, with no sampling information. TYPE: `assessable` and `warranted`. SCOPE: `unassessable_absent`, with `missing` = "how teams and firms were selected". This shows dimension-level assessability.

## 8. Recording legitimate expert disagreement

Disagreement is **data**, not noise. The codebook records it rather than forcing consensus.

**Field `disagreement`.** Code one or more of the following, each with a short note:

| Code | Disagreement about… | Example |
|---|---|---|
| `D-read` | How to read the claim | A generic plural; "increases" read as lasting or not |
| `D-info` | What information the excerpt contains, or whether it was noticed | Whether a sentence describes allocation |
| `D-warrant` | Which warrant applies, or what it requires | Whether a lagged panel counts as `W-ident` (B4) |
| `D-assume` | How to weigh assumption statuses | Unmentioned balance checks (B9) |
| `D-threshold` | Whether a gap is large enough to count | Whether a hedge makes a claim calibrated (B3) |
| `D-construct` | Whether a measure represents the construct | Self-report of practice versus behaviour (Me2) |
| `D-codebook` | The codebook itself is ambiguous or incomplete | Any; also log it in `codebook_issue` |

**Practices:**
- **Alternative readings.** If two readings are plausible, an annotator may complete the dimension judgements for **both** (`reading` and `alt_reading`), labelled accordingly.
- **No forced adjudication.** If annotators disagree after discussion, keep **both** judgements with their rationales. A consensus label, if one is ever produced, is stored **alongside** the individual judgements, never in place of them.
- **Codebook disagreement versus expert disagreement.** Disagreement caused by unclear codebook wording (`D-codebook`) leads to a codebook revision. Disagreement that persists under clear wording is recorded as **genuine** expert disagreement and reported as a finding.
- **Confidence is not agreement.** A high-confidence judgement can still be one on which reasonable experts differ.

## 9. Counterexamples to keep in mind

| # | Looks like… | Is actually… | Why |
|---|---|---|---|
| X1 | Overclaim ("clearly demonstrate") | Warranted | A descriptive frequency, directly reported |
| X2 | Calibrated (hedged) | Overreaching on type and scope (boundary B3) | A hedge does not change type or scope |
| D3 | Warranted ("randomised") | Overreaching on type | The interview order was randomised, not access (R2) |
| D4 | Unwarranted (no "randomised") | Warranted, conditional | Allocation by lots is random assignment (R2) |
| D5 | Overreach | Unassessable | Information is absent (R3) |
| X6 | Contradicted | Overreaching (insufficient statistical evidence) | An imprecise null is not opposite-direction evidence |
| X7 | — | Contradicted (type, direction) | A reasonably precise estimate in the opposite direction |
| X8 | Causal warrant ("assuming no confounding") | `W-assoc`, with a qualified claim that may be licensed | An assumption statement is not identification |
| Me2 | Invalid (self-report) | A construct gap for a behavioural claim, not self-report as such | Self-report is not automatically invalid |

## 10. Internal conceptual testing (project owner only)

**Purpose.** To check that each definition, code and rule can be applied to the fictional items in the spec **without the codebook author's tacit knowledge**.

**Procedure:**
1. Code every item in spec §4 (families D, S, Me, T, U, W; P1–P3; X1–X8; B1–B10) using only this codebook.
2. Compare each record with the spec's proposed judgements. Log each mismatch as a `codebook_issue`: whether it reflects an unclear code, a missing rule, or a disagreement with the spec.
3. Record every boundary case where the codebook gives no clear answer.
4. Revise the codebook and record each change in a revision log.

**Not part of this test:** expert annotators, agreement statistics, model runs, and new or real items.

**Codebook issue log** (to be filled during testing):

| # | Item | Field | Issue | Proposed change | Status |
|---|---|---|---|---|---|
| | | | | | |

## 11. Open issues carried from the specification

- Whether `CONSTRUCT` can be distinguished from `TYPE` (spec §6, Q8).
- Whether `contradicted` should ever become an overall outcome (spec §2.6).
- Whether any aggregation rule is adopted (spec §3). Profiles are the default.
- How unmentioned standard assumptions should be weighed (spec §2.4; B9).
- How generic plurals should be read (B2).
- Warrant standards for qualitative and design science research (`W-qual`).
- The relation to the G1–G7 taxonomy. This is **not** decided.
