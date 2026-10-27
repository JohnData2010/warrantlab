# Construct specification: method-conditioned evidential calibration (C1)

*Conceptual Development phase. Draft 0.3, 27 October 2026 (AEDT). Status: provisional conceptual foundation, accepted by the project owner at 0.2 (refined in 0.3). Operationalised for internal testing in `../annotation/CODEBOOK-v0.1.md`.*

**Nothing in this document is validated.**
- It is an agent-drafted proposal for the project owner's review.
- It does **not** finalise the G1–G7 taxonomy or the codebook. No benchmark items are built here.
- Every example is **fictional**, written for this document, and is not drawn from any real paper.
- Every label, value, rule and expected judgement is **provisional**.

**Question this document addresses.**

> On what information and inference rules is a scholarly claim judged *warranted*, *overreaching* or *unassessable*, and how can two experts apply those rules consistently?

## Changes in 0.3

These follow the project owner's decisions on 0.2. The five corrections made in 0.2 are not reopened.

| # | Decision or refinement | Change in 0.3 | Where |
|---|---|---|---|
| a | **Construct correspondence** becomes a provisional fourth dimension | Defined and added. Self-report is **not** treated as automatically invalid. Whether experts can distinguish this dimension from type is a pilot question | §2.1, §4.1 (Me), §6 |
| b | **Contradicted** is kept as a separate dimension-level relationship between evidence and claim | Defined at dimension level only. It is not a mutually exclusive overall outcome and has no automatic precedence. It means conflict with the reported evidence, not proof that the effect is false | §2.6, §3 |
| c | **Dimension-level profiles** are preferred over a mandatory aggregate verdict | Profiles are the default output for initial testing. Rules A–D are kept only as candidates | §3 |
| d | T3 and U2 changed the **claim**, not the timing or unit of the evidence | Both moved to a new **Family W (claim wording varies, evidence held constant)**. Family U now contains a genuine unit-of-assignment contrast (U3). The IDs T3 and U2 are retired to avoid confusion | §4.1 |
| e | **Reporting differences between D1 and D2** | Reporting is now held constant (retention, baseline scores by group), and each remaining difference is listed | §4.1 |
| f | **Epistemic strength** was mixed with explicit conditions | Strength and *qualification* are recorded as separate attributes | §2.1 |
| g | **Assigned access versus actual use**; estimand; clustering | The base case states the estimand (the team-level effect of assigned access, intention-to-treat), compliance, and how clustering is handled. A claim about *use* is a different claim | §4.1, §2.4 |
| h | Assumption-status rules were too categorical | Restated as conditional and provisional. Unmentioned standard assumptions are **recorded**, not automatically penalised | §2.4 |

## Changes in 0.2

These follow the project owner's review of 0.1.

| # | Issue in 0.1 | Change in 0.2 | Where |
|---|---|---|---|
| 1 | Matched sets M1 and M2 differed in sample, measurement, analysis unit and timing, as well as design | The design family now holds sample, unit, measurement, timing and the reported result constant, and varies only how dashboard access came about. Contrasts for sample, measurement, timing and unit are separate families, each varying one factor. Residual confounds that cannot be removed are stated | §4.1 |
| 2 | The claim's population scope was ambiguous, and M2 and M4 were judged warranted by implicitly narrowing the claim to "these firms" | **Original-claim rule.** The claim is judged as written and is never silently narrowed. Type, scope and strength are judged separately. A generic plural such as "managers" is recorded as an interpretation question | §2.1, §2.6, §4.1 |
| 3 | X6 treated a non-significant result (d = 0.04) as contradictory evidence | The case is now classified as **insufficient statistical evidence**. "Contradicted" is reserved for evidence in the **opposite direction**. A genuinely contradictory example is added | §2.6, §4.3 |
| 4 | Assessability was judged for the claim as a whole | Assessability and overreach are now judged **per dimension**. A **provisional** aggregation rule is proposed for expert review, together with alternatives | §2.5, §2.6, §3 |
| 5 | W-rand and W-ident treated reported random assignment, or a stated assumption, as close to sufficient | Both are restated as **conditional warrants** that separate three things: reported design features, required identifying assumptions, and what cannot be established from the documentation. An assumption-status field is added | §2.4 |

## 1. Working definition

> **Method-conditioned evidential calibration** is the assessment of whether the type, scope and strength of a scholarly claim are justified by the evidence, methodological information and assumptions available for examination.

This is a **[Proposed]** working definition. It is not an established definition in the literature.

**Unit of judgement.** One claim, in a supplied excerpt, together with whatever evidence and method information the excerpt contains. The judgement is always **excerpt-relative** (`../taxonomy/STRUCTURE-MEMO.md` §5).

**Three boundaries** (from `../CONCEPT-NOTE.md` §3):
1. Reported warrant is not study validity.
2. Unavailable, inadequate and contradictory evidence are all different.
3. Method information is not the same as method keywords.

**Original-claim rule (new in 0.2).**
- The claim is assessed **as written**. Annotators and systems must not reinterpret it into a narrower claim that the evidence would support (for example, "managers" read as "managers in these two firms").
- If the scope is genuinely ambiguous, that ambiguity is recorded (§2.1). It is not resolved in the claim's favour.
- A narrower claim is a **different claim** and is judged separately.

## 2. Components

The components are judged **jointly**. A claim cannot be classified from its wording alone, nor from its method alone.

### 2.1 Claim: four dimensions and one attribute, recorded separately

| Dimension | What to record | Candidate values (provisional) |
|---|---|---|
| **Type** | What kind of relation or conclusion is asserted, including its **direction** | Descriptive · associational · predictive · causal effect · mechanism · theory-level · contribution or implication |
| **Scope** | To whom, where and **when** the claim is said to hold. This covers population, setting, time and **unit of inference** (individual, group or organisation) | Sample only · stated bounded population · generic plural (an interpretation question) · explicitly universal · temporal qualifiers · unit qualifiers ("each manager") |
| **Strength** | The **epistemic commitment** expressed, independent of any conditions attached to it | Tentative · moderate · strong · conclusive |
| **Construct correspondence** *(provisional, new in 0.3)* | Whether the **operationalised measures** of X and Y adequately represent the **constructs asserted in the claim** | Corresponds · partly corresponds (record the gap) · does not correspond · unassessable (the measure is not described) |

| Attribute | What to record | Candidate values (provisional) |
|---|---|---|
| **Qualification** *(separated from strength in 0.3)* | Explicit conditions or limits the claim attaches to itself | None · conditional on an assumption ("under the assumption of no unmeasured confounding") · bounded by a stated limitation ("within the limits of self-reported data") · other (describe) |

**Notes.**
- **Strength and qualification are recorded separately.** A claim can be strong and qualified ("under these assumptions, X clearly increases Y") or tentative and unqualified ("X may increase Y"). How qualification interacts with the warrant is set out in §2.4.
- Strength is judged from the commitment the sentence makes, not by keyword lookup.
- A hedge lowers strength but does not change type, scope or construct.
- **Generic plurals** can be read in several ways: as "managers in general", as "the average manager in the kind of setting studied", or as a loose reference to the sample. The annotator records the reading adopted and why (boundary case B2).
- **Construct correspondence.**
  - The question is whether the measure adequately represents the construct **the claim names**. It is not whether the measure is "good" in general.
  - Self-report is **not** automatically invalid. A self-report scale can correspond well to an attitudinal or perceptual construct, and poorly to a behavioural one.
  - The judgement considers what the excerpt reports: the measure's content, its source (self, other, record), any validation information, and conditions that might bias it (e.g. unblinded responses).
  - Whether experts can distinguish this dimension from **type** is a pilot question (§6). If they cannot, it may be merged or dropped.

### 2.2 Reported evidence

What result is offered for the claim:
- **Kind:** an estimate or test, with direction, size, **precision** (a confidence interval or standard error) and the test result where given; a comparison; a model fit; or a qualitative finding.
- **Location:** the same paragraph, another supplied section, or "cited elsewhere".
- **Relation to the claim:** whether the evidence concerns the same constructs, relation and direction as the claim.

### 2.3 Methodological information and assumptions

| Attribute | What is relevant |
|---|---|
| **Design** | Was X manipulated or assigned? By whom, to which units, and how? Cross-sectional, longitudinal or panel? Qualitative? |
| **Measurement** | How the claim's constructs were operationalised, and whether outcome assessment could be influenced by knowing who received X |
| **Sampling** | Who was studied and how they were selected (this bears on scope) |
| **Unit of analysis** | The level at which X was assigned and Y measured (e.g. team versus individual) |
| **Timing** | When Y was measured relative to X (this bears on temporal scope) |
| **Assumptions** | See the assumption-status field in §2.4 |

### 2.4 Inferential warrant: conditional warrants

A warrant is a rule connecting a kind of evidence, obtained under a kind of design, to a kind of claim, **subject to assumptions**. No warrant is satisfied by the mere presence of a design label or an assumption statement.

**Assumption-status field (new).** For each identifying assumption a warrant requires, the annotator records one status:

| Status | Meaning |
|---|---|
| **Addressed** | The text reports information bearing on the assumption, such as a balance check, attrition by arm, a pre-trend test or a first-stage strength. *Addressed* does not mean the assumption is proven |
| **Stated, not addressed** | The assumption is named ("we assume…") but no supporting information is given |
| **Unmentioned** | The warrant requires it, but the text is silent |
| **Reported threat** | The text reports information suggesting the assumption may be violated (e.g. high differential attrition), and the claim does not take it into account |

**W-rand: random assignment.**

| Element | Content (provisional) |
|---|---|
| **Reported design features to look for** | What was assigned (X itself, not something incidental); the unit of assignment; the assignment mechanism (random number, lottery, alternation); timing relative to the outcome; the analysis population (intention-to-treat or per-protocol) |
| **Required identifying assumptions** | Assignment was random as described and not subverted · no differential attrition or exclusion by arm · compliance as reported (or the claim concerns assignment, not receipt) · no interference between units (e.g. control teams using treated teams' dashboards) · outcome assessment not influenced by knowledge of assignment |
| **Text that may address them** | Balance table · attrition and exclusions by arm · compliance rates · blinding of outcome coders · an ITT analysis |
| **Cannot be established from the documentation** | Whether randomisation was actually implemented as described · undisclosed deviations from the protocol · selective reporting of outcomes or analyses · whether reported checks were conducted as described |
| **What it can license** | An average effect of *assignment* (or receipt, under compliance assumptions) of X on Y, for the studied units, setting and time, **as reported and conditional on the assumptions above** |
| **What it cannot license on its own** | A mechanism · effects beyond the studied population, setting or time (a scope matter) · individual-level effects from group-level assignment · certainty about an unassessed assumption |

**W-ident: identification strategies for observational data** (e.g. difference-in-differences, instrumental variables, regression discontinuity, natural experiments).

| Element | Content (provisional) |
|---|---|
| **Reported design features to look for** | The named strategy, **and** a description of the source of variation: what creates variation in X that is plausibly unrelated to other causes of Y |
| **Required identifying assumptions** (strategy-specific; illustrative) | Difference-in-differences: parallel trends without treatment, and no anticipation · instrumental variables: relevance, exclusion restriction, independence · regression discontinuity: no manipulation of the running variable, and continuity at the cut-off |
| **Text that may address them** | Pre-trend or event-study estimates · first-stage strength · placebo or falsification tests · density tests at the cut-off |
| **Cannot be established from the documentation** | The truth of untestable assumptions (e.g. the exclusion restriction; parallel trends in the post-treatment period). Reported tests are consistent with an assumption; they do not prove it |
| **What it can license** | A causal effect for the population or margin the strategy identifies (e.g. compliers, units near the cut-off), **conditional on the assumptions** |
| **Key rule** | **An assumption statement is not an identification strategy.** "We assume no unmeasured confounding", added to a cross-sectional regression, does not move the evidence from W-assoc to W-ident. At most it licenses a causal claim whose **strength is explicitly conditional** on that assumption |

**Assigned versus received treatment (W-rand).**
- Random assignment of *access* licenses, at most, a claim about the effect of **assigned access** (an intention-to-treat estimand).
- A claim about the effect of **actual use** is a different claim. It needs compliance information, and an estimand for those who comply (e.g. via instrumental-variable estimation with assignment as the instrument), under further assumptions such as no effect of assignment except through use.
- When X is assigned to **groups** (teams) and the claim concerns individuals, the estimand is a group-level average effect. Uncertainty must account for clustering: analysis at team level, or cluster-robust standard errors.

**Provisional application rules for both warrants.** These are conditional, are to be tested with experts, and are **not final**:
- *Qualified claim.* If the claim carries an explicit qualification ("under the assumption that…"), a warrant whose assumptions are stated but not addressed **may** still license it, provided strength is not conclusive.
- *Unqualified conclusive claim.* An unqualified conclusive claim ("proves", "establishes") resting on assumptions that are only stated or threatened is a **candidate** for overreaching on strength.
- *Reported threat.* If the text reports a threat that the claim ignores, this is a **candidate** for overreaching on strength. The annotator records the threat.
- *Unmentioned standard assumptions.* These are **recorded** in the assumption-status field. They are **not** automatically penalised. A strongly worded experimental result is not judged overreaching solely because standard assumptions go unmentioned: excerpts rarely address every assumption, and experts may reasonably treat some as default for a described design. How experts weigh unmentioned assumptions is boundary case B9 and a pilot question.

**Other patterns, unchanged from 0.1 but also conditional:**

| Pattern | Can license | Cannot license on its own |
|---|---|---|
| **W-assoc** Observed covariation | Association in the sample (or the population, given suitable sampling) | Causal effect, mechanism |
| **W-med** A measured mediator with temporal order and a mediation analysis | Evidence consistent with a pathway, conditional on mediation assumptions (e.g. no mediator–outcome confounding) | A "proven" mechanism |
| **W-sample** Probability or justified sampling | Generalisation to the sampled population | Generalisation beyond it |
| **W-theory** Results consistent with a theory's predictions | "Consistent with" or "supports", in this context | Validates, confirms or "fully explains" |
| **W-qual** Interpretive or process evidence | Accounts of how participants experience or describe a process | Population effect sizes. Its own warrant standards are to be defined with qualitative experts |

### 2.5 Assessability, judged per dimension

Each claim dimension (type, scope, strength, construct correspondence) receives its own assessability state:

| State | Meaning |
|---|---|
| **Assessable** | The information needed to apply a warrant to this dimension is present |
| **Unassessable: information absent** | The information needed for this dimension is not in the excerpt. Record what is missing |
| **Unassessable: claim unclear** | What the claim asserts on this dimension cannot be determined |

**Example.** A claim can be assessable on **type**, because the excerpt describes random assignment, but unassessable on **scope**, because it says nothing about how the teams were sampled (family S, item S3).

### 2.6 Dimension-level judgements

For each **assessable** dimension, compare what is claimed with what the applicable warrant licenses, given the assumption statuses.

| Judgement | Condition (provisional) |
|---|---|
| **Warranted** | The claim does not exceed what the warrant licenses on this dimension |
| **Overreaching** | The evidence and method information are present but **inadequate** for the claim on this dimension. **Insufficient statistical evidence** is a sub-case: a result too imprecise or too small to support the claimed effect (§4.3, X6) |
| **Contradicted** | The supplied evidence points in the **opposite direction** to the claim on this dimension (e.g. a reported negative effect, while improvement is claimed). This applies mainly to type and direction |
| **Unassessable** | From §2.5 |

**Status of "contradicted" (project-owner decision, 0.3).**
- It is a **dimension-level relationship between evidence and claim**, distinct from *overreaching* and *unassessable*.
- It means the claim **conflicts with the evidence reported in the excerpt**. It does **not** mean that the underlying scientific effect is false. Other evidence, or a different analysis, might support the claim.
- It is **not** yet an overall outcome. It is not mutually exclusive with other dimension judgements, and it does not take automatic precedence over them.

**Insufficient versus contradicting evidence.**
- A non-significant or near-zero estimate is **not** evidence that the effect is absent or reversed. It may be compatible with small positive, null and small negative effects, depending on its precision.
- Claiming a positive effect from such a result is **overreaching**: the evidence is insufficient for the claim.
- Evidence of **absence** would require, for example, an equivalence test or a precise interval excluding effects of a meaningful size. Evidence of the **opposite** requires an estimate in the other direction with adequate precision.

## 3. Dimension profiles and candidate aggregation rules

**Default for initial conceptual testing (project-owner decision, 0.3).**
- The output for each claim is a **dimension-level profile**: a judgement on each dimension, plus assumption statuses and missing information.
- **No mandatory aggregate verdict** is produced.
- Because dimension judgements are recorded first, any aggregation rule can be applied, compared or discarded later without re-annotation.

Rules A–D below are **candidates only**. None is adopted. Rule A's ordering, which places contradicted first, is a candidate ordering. It is not a decision to give contradiction precedence.

**Candidate rule A:**
1. If any dimension is **contradicted**, the overall judgement is *contradicted*.
2. Otherwise, if any dimension is **overreaching**, it is *overreaching*. List every overreaching dimension, **and** list any unassessable dimensions alongside, never hiding them.
3. Otherwise, if any dimension is **unassessable**, it is *partly unassessable*, listing which dimensions are assessable and warranted.
4. Otherwise, it is *warranted*.

Rule A parallels the frozen POC's aggregation principle: missing information must not become overreach, and unverifiable parts must not be hidden. Here it is applied within a claim rather than across claims.

**Alternatives to examine with experts:**
- **Rule B:** no overall judgement; report only the dimension profile. *This is the default during initial testing. It is not a final choice.*
- **Rule C:** an unassessable *type* dimension blocks any overall judgement, because type may be logically prior to scope and strength.
- **Rule D:** contradicted and overreaching are not ranked; both are reported.

**Questions for expert review.**
- Is "partly unassessable" a usable category?
- Do experts' holistic judgements match any rule?
- Is any dimension logically prior to the others?

## 4. Examples (all fictional)

**Claim held constant across §4.1:**

> *"Access to the analytics dashboard increases managers' data-driven decision-making."*

| Dimension or attribute | As written |
|---|---|
| Type | Causal effect of **access** (not of use), positive direction |
| Scope | Generic plural "managers", with no setting, time or unit stated. **Ambiguous**; preserved as written |
| Strength | Strong |
| Qualification | None |
| Construct | "Data-driven decision-making": a behavioural construct (how decisions are made), not an attitude |

### 4.1 Controlled matched sets

**Common base, held constant unless a family varies it:**
- **Sample:** 60 teams (about 410 managers) in two logistics firms in one country, recruited by convenience.
- **Treatment and estimand:** *access* to the dashboard, provided to a team. The estimand is the **team-level average effect of assigned access** (intention-to-treat). Actual use is reported separately:
  - 26 of the 30 teams given access logged in at least weekly;
  - 2 of the 30 teams without access obtained it informally.
- **Unit and clustering:** access is provided at team level, and the outcome is scored per team. The analysis is at team level (n = 60). Managers are nested in teams, so any manager-level analysis would need cluster-robust uncertainty.
- **Measurement:** data-driven decision-making coded from meeting minutes, by coders who do not know which teams had access, using the same scheme throughout.
- **Timing:** outcome measured three months after access began.
- **Reporting, held constant across D1–D4:**
  - all 60 teams retained (no attrition);
  - baseline decision-making scores reported by group, and similar (difference d = 0.05).
- **Reported result:** teams with access scored higher (d = 0.45, 95% CI [0.10, 0.80]).

**Family D: research design varies (how access came about); everything else is held constant, including what is reported.**

| # | How access came about (the only change) | Type | Scope | Strength | Construct | Notes |
|---|---|---|---|---|---|---|
| D1 | Teams chose whether to adopt the dashboard (self-selection) | **Overreaching** (W-assoc only) | Overreaching (generic plural beyond two convenience-sampled firms; reading recorded) | Overreaching (strong causal language on an associational warrant) | Corresponds | Similar baseline scores do not rule out selection on unmeasured factors |
| D2 | Access assigned to teams by computer-generated random allocation | **Warranted, conditional** (W-rand; for **assigned access**) | **Overreaching**: the claim is **not** narrowed to "these firms" | Warranted for the effect of assigned access. Strength does not offset the scope judgement | Corresponds | Retention and baseline similarity bear on W-rand assumptions |
| D3 | As D1, plus "the order in which teams were interviewed was randomised" | Overreaching (keyword only) | As D1 | As D1 | As D1 | Randomising the interview order does not assign X |
| D4 | As D2, but described as "allocated by drawing lots", with the word "randomised" absent | As D2 | As D2 | As D2 | As D2 | The described mechanism is random assignment |
| D5 | Discussion excerpt only; no design, sample, measure or result information | **Unassessable** (design absent) | **Unassessable** (sampling absent) | Unassessable | **Unassessable** (measure absent) | Not overreach |

*Differences that remain within Family D:*
1. **Comparison groups.** Self-selection changes which teams receive access. Holding the reported sample frame, measures and results constant does not make the underlying treated and untreated groups equivalent.
2. **The meaning of identical reporting.** In D2, retention and baseline similarity are checks on randomisation (balance and attrition). In D1, the same information is descriptive and **cannot** address confounding by unmeasured factors. The same reported numbers bear differently on the two warrants. That is intended: the warrant, not the numbers, changes.
3. **Allocation description.** D2 and D4 add a description of the allocation mechanism. That is the design manipulation itself.
4. **Reporting variant.** D2-nr is D2 with retention and baseline scores **not** reported. It is used to examine how experts treat unmentioned standard assumptions (B9). It is **not** automatically overreaching (§2.4).

**Family S: sample varies; the design is D2 throughout.**

| # | Sampling information (the only change) | Type | Scope (claim preserved as written) |
|---|---|---|---|
| S1 | Two logistics firms, convenience (the base) | Warranted, conditional | Overreaching for a general reading of "managers" |
| S2 | 60 teams sampled at random from a national registry of firms with at least 50 staff, across sectors | Warranted, conditional | Warranted for that national population. Still overreaching for a cross-national reading. The reading must be recorded |
| S3 | No sampling information in the excerpt | Warranted, conditional | **Unassessable** (sampling absent). This illustrates dimension-level assessability |

**Family Me: outcome measurement varies; the design is D2. This family tests construct correspondence.**

| # | Outcome measure (the only change) | Construct correspondence | Note |
|---|---|---|---|
| Me1 | Coded meeting minutes, blind coders (the base) | Corresponds | — |
| Me2 | Managers' self-reported agreement with "I base decisions on data", collected after unblinded access | **Partly corresponds or does not correspond** (boundary) | Self-report is not invalid in itself. The gap is between a **belief about one's practice** and the **behavioural** construct claimed, compounded by unblinded responses. If the claim were "increases managers' **perceived** reliance on data", Me2 could correspond well |
| Me3 | A validated self-report scale of decision practices (validation reported), collected before managers knew the study's hypothesis | Partly corresponds or corresponds (boundary) | Shows that self-report can correspond. Experts may differ on the remaining gap between reported and observed behaviour |

**Family T: timing of outcome measurement varies; the design and the claim are unchanged.**

| # | Timing (the only change) | Scope, temporal |
|---|---|---|
| T1 | Outcome at three months (the base) | No temporal qualifier in the claim. Boundary: is "increases" read as lasting? Record the reading |
| T2 | Outcome at one week | As T1, but a lasting reading is less supported. Record the reading |

**Family U: unit of assignment varies; the claim is unchanged.**

| # | Unit (the only change) | Note |
|---|---|---|
| U1 | Team-level assignment and outcome (the base) | "Managers'" can be read as a group-level average effect |
| U3 (new; ID U2 retired) | Access assigned to **individual managers** within teams, with each manager's decisions coded individually; manager-level analysis | Changes the estimand to an individual-level average effect. Introduces a risk of **interference**: managers without access may see colleagues' dashboards in shared meetings. Whether W-rand's no-interference assumption is addressed must be recorded |

**Family W: claim wording varies; the evidence is held at D2 with the base sample, measure, timing and unit.** *(New in 0.3. Former T3 and U2 moved here, because they change the claim, not the evidence.)*

| # | Claim wording (the only change) | Dimension affected | Proposed judgement |
|---|---|---|---|
| W1 (was T3) | "Access to the analytics dashboard **sustainably** increases managers' data-driven decision-making" | Scope (temporal) | **Overreaching**: a three-month outcome does not show persistence |
| W2 (was U2) | "Access to the analytics dashboard improves **each** manager's data-driven decision-making" | Scope (unit of inference) | **Overreaching**: a team-level average effect does not show change for every individual |
| W3 | "**Using** the analytics dashboard increases managers' data-driven decision-making" | Type (treatment: use, not access) | **Boundary**. Random assignment of access does not directly license an effect of use. Compliance is reported, but no estimate for those who used it is given (§2.4) |
| W4 | "Under the assumption that randomisation was not compromised, access increased decision-making in the firms studied" | Qualification; scope | Warranted. Shows qualification recorded separately from strength |

### 4.2 Positive examples (warranted)

- **P1.** *"Teams that adopted the dashboard scored higher on coded data-driven decision-making than teams that did not (d = 0.45)."* With D1's design. An associational, sample-scope claim matches W-assoc.
- **P2.** *"In the two firms studied, teams randomly assigned dashboard access showed higher coded data-driven decision-making after three months."* With D2's design. Type, scope and timing are all bounded to what was studied, so it is warranted, conditional on the W-rand assumptions. This is a **different claim** from the one held constant in §4.1, and it is judged as written.
- **P3.** *"These results are consistent with the information-processing view of dashboards."* With D2's design. A tentative theory-level claim, matched by W-theory.

### 4.3 Counterexamples

- **X1. Strong wording, but warranted.** *"The data clearly demonstrate that 71% of respondents used the dashboard weekly."* A descriptive claim, directly reported.
- **X2. Hedged, but still overreaching.** *"This may suggest that dashboards transform decision cultures across industries."* With D1's design. The hedge lowers strength, but type and scope still exceed the warrant. Its final status is boundary case B3.
- **X3. Keyword present, warrant absent.** D3.
- **X4. Keyword absent, warrant present.** D4.
- **X5. Absent, not inadequate.** D5, contrasted with D1.
- **X6 (corrected). Insufficient statistical evidence, not contradiction.** With D2's design, the Results report *"no significant difference between teams with and without access (d = 0.04, 95% CI [−0.31, 0.39])"*. The Discussion says *"dashboard access improved decision-making"*. The interval is compatible with small positive, null and small negative effects. The claim is **overreaching** because the evidence is **insufficient** for a positive effect. It is **not contradicted**, and the result is not evidence that no effect exists.
- **X7 (new). Genuinely contradicted.** With D2's design, the Results report *"teams with access scored lower (d = −0.42, 95% CI [−0.78, −0.06])"*. The Discussion says *"dashboard access improved decision-making"*. The estimate is in the opposite direction and its interval excludes zero, so the type dimension (direction) is **contradicted**.
- **X8 (new). Assumption statement, not an identification strategy.** With D1's design plus *"assuming no unmeasured confounding, dashboard access causes better decisions"*.
- Record qualification as "conditional on an assumption", with the assumption status "stated, not addressed".
- Under the provisional rules in §2.4, the qualified claim **may** be licensed. If the Discussion later states, without qualification, *"we have shown that dashboards cause better decisions"*, that claim is a **candidate** for overreaching on strength.
- The stated assumption does not turn the evidence into W-ident.

### 4.4 Ambiguous boundary cases (to examine in the pilot, not to resolve now)

| # | Case | Why it is ambiguous |
|---|---|---|
| B1 | D2 plus a mediator ("perceived transparency") measured at month 1 and a mediation analysis. Claim: "dashboards improve decisions **through** transparency" | W-med is conditional on rarely stated assumptions. Is "through" overreaching on strength? |
| B2 | A generic plural ("managers") after a bounded sample (D2, S1) | Does field convention license generic plurals as shorthand for the studied population, or do they make a general claim? How should the annotator's reading be recorded and compared? |
| B3 | X2: a hedged causal and universal claim | Does sufficient hedging make a claim calibrated, or do type and scope take precedence over strength? |
| B4 | Three-wave panel; earlier use predicts later decision-making, controlling for earlier decision-making. Claim: "use **leads to**…" | Is a lagged panel W-ident or W-assoc? Which assumptions apply? |
| B5 | Interview study (n = 18). Claim: "dashboards change decisions by making uncertainty visible" | The mechanism claim falls under W-qual, whose standards must come from qualitative experts |
| B6 | "Prior studies show dashboards improve performance [cite]" | An attributed claim. Is it in scope? |
| B7 | "If dashboards increase transparency, they may improve decisions" | A conditional causal phrasing. Isch et al. counted such phrasing in their prevalence measure. Should claim-level judgement do the same? |
| B8 | "Managers should adopt dashboards" | A normative implication. What warrant is required? |
| B9 (new) | D2-nr: D2 with no balance, attrition or blinding information reported. Claim strength "shows" | Do experts treat unmentioned standard assumptions as lowering a strong claim, or as reasonable defaults for a described randomised design? **Not automatically penalised** (§2.4) |
| B10 (new) | Like X6, but the interval is wide (d = 0.04, 95% CI [−0.60, 0.68]) and the Discussion says "dashboards had **no effect**" | The claim of *no effect* overreaches in the other direction: imprecision does not show absence |

## 5. What this document deliberately leaves open

- **The taxonomy.** The relation between these dimensions and G1–G7 is not decided. A tentative correspondence, not a mapping: type covers G3 and G1, scope covers G5, theory-level claims cover G2, and construct correspondence (if adopted) covers G4.
- **Aggregation.** Profiles are the default. Whether any aggregation rule (§3) is adopted is open.
- **Construct correspondence.** Adopted provisionally as a fourth dimension (0.3). Whether it can be distinguished from type is open.
- **"Contradicted".** Kept as a dimension-level relationship (0.3). Whether it ever becomes an overall outcome, and with what precedence, is open.
- **Assumption-status rules** (§2.4). These remain candidates.
- **The completeness and grain of the warrant patterns.** Patterns for design science and interpretive research are not developed.
- **Thresholds and statistics** for any later confirmatory study (`../CONCEPT-NOTE.md` §7).

## 6. Questions the exploratory pilot should answer

1. Can experts separate **absent** from **inadequate** information consistently (D1 versus D5), **per dimension** (S3)?
2. Within each family, do judgements change **only on the dimension that the varied factor bears on**?
3. Do judgements respond to design changes (D1 versus D2) and **not** to keyword changes (D3, D4)?
4. Do experts preserve the claim as written, or do they implicitly narrow it (D2, S1, B2)? How do their readings of generic plurals differ?
5. Do experts distinguish insufficient from contradicting statistical evidence (X6, X7, B10)?
6. Do experts' holistic judgements match any aggregation rule in §3?
7. How do experts treat stated-but-unaddressed and unmentioned assumptions (X8, B9)?
8. Can experts distinguish **construct correspondence** from **type** (Me1–Me3, W3)? Do they avoid treating self-report as automatically invalid?
9. Do experts distinguish a claim about **assigned access** from a claim about **use** (W3)?
10. Do experts record strength and qualification separately (W4, X8)?
