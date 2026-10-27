# Construct specification: method-conditioned evidential calibration (C1)

*Conceptual Development phase. Draft 0.2, 27 October 2026 (AEDT). Status: for independent research review.*

**Nothing in this document is validated.**
- It is an agent-drafted proposal for the project owner's review.
- It does **not** finalise the G1–G7 taxonomy or the codebook. No benchmark items are built here.
- Every example is **fictional**, written for this document, and is not drawn from any real paper.
- Every label, value, rule and expected judgement is **provisional**.

**Question this document addresses.**

> On what information and inference rules is a scholarly claim judged *warranted*, *overreaching* or *unassessable*, and how can two experts apply those rules consistently?

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

### 2.1 Claim: three dimensions recorded separately

| Dimension | What to record | Candidate values (provisional) |
|---|---|---|
| **Type** | What kind of relation or conclusion is asserted, including its **direction** | Descriptive · associational · predictive · causal effect · mechanism · theory-level · contribution or implication |
| **Scope** | To whom, where and **when** the claim is said to hold. This covers population, setting and time | Sample only · stated bounded population · generic plural (e.g. "managers"; an interpretation question) · explicitly universal ("all organisations") · temporal qualifiers ("sustainably", "in the long term") |
| **Strength** | The epistemic commitment expressed | Tentative · moderate · strong · conclusive · *conditional* (explicitly made conditional on an assumption: "under the assumption that…") |

**Notes.**
- Strength is judged from the commitment the sentence makes, not by keyword lookup.
- A hedge lowers strength but does not change type or scope.
- **Generic plurals** are common in scholarly writing and can be read in several ways: as "managers in general", as "the average manager in the kind of setting studied", or as a loose reference to the sample. The annotator records which reading they adopt and why. Whether the field convention licenses a generic plural is boundary case B2.
- **Construct correspondence** may be a fourth dimension: whether the measured Y is the Y in the claim (see family Me, §4.1). *[Open question]* It is not added as a dimension until the pilot shows whether it can be judged separately from type.

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

**Provisional application rules for both warrants:**
- *Conditional claim, conditional warrant.* If a claim's strength is explicitly conditional ("under these assumptions, X affects Y"), a warrant whose assumptions are stated but not addressed may still license it.
- *Unconditional strong claim.* An unconditional strong or conclusive claim ("proves", "demonstrates that X causes Y") resting on assumptions that are only stated, unmentioned or threatened is **overreaching on strength**. This holds even when the design type is appropriate.
- *Reported threat.* If the text reports a threat that the claim ignores, the strength dimension is overreaching, at least.
- *Unmentioned standard assumptions.* Whether these lower the judgement is **open**: requiring every assumption to be addressed in an excerpt may be unrealistic. This is boundary case B9 in the pilot.

**Other patterns, unchanged from 0.1 but also conditional:**

| Pattern | Can license | Cannot license on its own |
|---|---|---|
| **W-assoc** Observed covariation | Association in the sample (or the population, given suitable sampling) | Causal effect, mechanism |
| **W-med** A measured mediator with temporal order and a mediation analysis | Evidence consistent with a pathway, conditional on mediation assumptions (e.g. no mediator–outcome confounding) | A "proven" mechanism |
| **W-sample** Probability or justified sampling | Generalisation to the sampled population | Generalisation beyond it |
| **W-theory** Results consistent with a theory's predictions | "Consistent with" or "supports", in this context | Validates, confirms or "fully explains" |
| **W-qual** Interpretive or process evidence | Accounts of how participants experience or describe a process | Population effect sizes. Its own warrant standards are to be defined with qualitative experts |

### 2.5 Assessability, judged per dimension

Each claim dimension (type, scope, strength) receives its own assessability state:

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

**Insufficient versus contradicting evidence.**
- A non-significant or near-zero estimate is **not** evidence that the effect is absent or reversed. It may be compatible with small positive, null and small negative effects, depending on its precision.
- Claiming a positive effect from such a result is **overreaching**: the evidence is insufficient for the claim.
- Evidence of **absence** would require, for example, an equivalence test or a precise interval excluding effects of a meaningful size. Evidence of the **opposite** requires an estimate in the other direction with adequate precision.

## 3. Aggregation into an overall judgement (provisional; not final)

**Annotation design principle.** Annotators record **dimension-level judgements first**. The overall judgement is **derived** from them. The aggregation rule can then be compared and revised after expert review without re-annotation.

**Candidate rule A (proposed for review):**
1. If any dimension is **contradicted**, the overall judgement is *contradicted*.
2. Otherwise, if any dimension is **overreaching**, it is *overreaching*. List every overreaching dimension, **and** list any unassessable dimensions alongside, never hiding them.
3. Otherwise, if any dimension is **unassessable**, it is *partly unassessable*, listing which dimensions are assessable and warranted.
4. Otherwise, it is *warranted*.

Rule A parallels the frozen POC's aggregation principle: missing information must not become overreach, and unverifiable parts must not be hidden. Here it is applied within a claim rather than across claims.

**Alternatives to examine with experts:**
- **Rule B:** no overall judgement; report only the dimension profile.
- **Rule C:** an unassessable *type* dimension blocks any overall judgement, because type may be logically prior to scope and strength.
- **Rule D:** contradicted and overreaching are not ranked; both are reported.

**Questions for expert review.**
- Is "partly unassessable" a usable category?
- Do experts' holistic judgements match any rule?
- Is any dimension logically prior to the others?

## 4. Examples (all fictional)

**Claim held constant across §4.1:**

> *"Access to the analytics dashboard increases managers' data-driven decision-making."*

| Dimension | As written |
|---|---|
| Type | Causal effect, positive direction |
| Scope | Generic plural "managers", with no setting or time stated. **Ambiguous**; preserved as written |
| Strength | Strong, unconditional |

### 4.1 Controlled matched sets

**Common base, held constant unless a family varies it:**
- **Sample:** 60 teams (about 410 managers) in two logistics firms in one country, recruited by convenience.
- **Unit:** team-level access, team-level outcome.
- **Measurement:** data-driven decision-making coded from meeting minutes by coders blind to dashboard access, using the same scheme throughout.
- **Timing:** outcome measured three months after access began.
- **Reported result:** teams with access scored higher (d = 0.45, 95% CI [0.10, 0.80]).

**Family D: design varies; everything else is held constant.**

| # | How access came about (the only change) | Type | Scope | Strength | Notes |
|---|---|---|---|---|---|
| D1 | Teams chose whether to adopt the dashboard (self-selection) | **Overreaching** (W-assoc only) | Overreaching (generic plural beyond two convenience-sampled firms; reading recorded) | Overreaching | — |
| D2 | Access assigned by computer-generated random allocation at team level; balance table and attrition by arm reported | **Warranted, conditional** (W-rand; assumptions addressed) | **Overreaching**, not warranted. The claim is **not** narrowed to "these firms" | Warranted for the effect, because the assumptions are addressed. Strength does not offset the scope judgement | — |
| D3 | As D1, plus "the order in which teams were interviewed was randomised" | Overreaching (keyword only) | As D1 | As D1 | Randomising the interview order does not assign X |
| D4 | As D2, but described as "allocated by drawing lots", with the word "randomised" absent | As D2 | As D2 | As D2 | The described mechanism is random assignment |
| D5 | Discussion excerpt only; no design, sample or result information | **Unassessable** (design absent) | **Unassessable** (sampling absent) | Unassessable | Not overreach |

*Residual confounds that cannot be removed.* A self-selected design and a randomised one cannot be identical in every other respect. Self-selection changes which teams receive access, and therefore the comparison groups. The family holds constant everything the **text reports** (sample frame, unit, measure, timing and result). It does not claim that the underlying populations of treated teams are identical.

**Family S: sample varies; the design is D2 throughout.**

| # | Sampling information (the only change) | Type | Scope (claim preserved as written) |
|---|---|---|---|
| S1 | Two logistics firms, convenience (the base) | Warranted, conditional | Overreaching for a general reading of "managers" |
| S2 | 60 teams sampled at random from a national registry of firms with at least 50 staff, across sectors | Warranted, conditional | Warranted for that national population. Still overreaching for a cross-national reading. The reading must be recorded |
| S3 | No sampling information in the excerpt | Warranted, conditional | **Unassessable** (sampling absent). This illustrates dimension-level assessability |

**Family Me: measurement varies; the design is D2.**

| # | Outcome measure (the only change) | Proposed judgement | Note |
|---|---|---|---|
| Me1 | Coded meeting minutes, blind coders (the base) | Type warranted, conditional | — |
| Me2 | Managers' self-reported agreement with "I base decisions on data", collected after unblinded access | Type: **overreaching or boundary** | The measure is self-reported belief, not decision-making, and responses may be shaped by knowing who had access. This raises the open question of construct correspondence as a dimension (§2.1) |

**Family T: timing varies; the design is D2.**

| # | Timing (the only change) | Scope, temporal |
|---|---|---|
| T1 | Outcome at three months (the base) | No temporal qualifier in the claim. Boundary: is "increases" read as lasting? |
| T2 | Outcome at one week | As T1, but a lasting reading is less supported. Record the reading |
| T3 | As T1, but the claim says "**sustainably** increases" | **Overreaching** (temporal scope): three months does not show persistence |

**Family U: unit varies; the design is D2.**

| # | Unit (the only change) | Note |
|---|---|---|
| U1 | Team-level assignment and outcome (the base) | "Managers'" can be read as an average group-level effect |
| U2 | Team-level assignment; claim reworded to "**each** manager's decision-making improves" | **Overreaching** (scope, unit). A team-level average effect does not show change in each individual |

### 4.2 Positive examples (warranted)

- **P1.** *"Teams that adopted the dashboard scored higher on coded data-driven decision-making than teams that did not (d = 0.45)."* With D1's design. An associational, sample-scope claim matches W-assoc.
- **P2.** *"In the two firms studied, random assignment of dashboard access increased coded data-driven decision-making over three months."* With D2's design. Type, scope and timing are all bounded to what was studied, so it is warranted, conditional on the W-rand assumptions. This is a **different claim** from the one held constant in §4.1, and it is judged as written.
- **P3.** *"These results are consistent with the information-processing view of dashboards."* With D2's design. A tentative theory-level claim, matched by W-theory.

### 4.3 Counterexamples

- **X1. Strong wording, but warranted.** *"The data clearly demonstrate that 71% of respondents used the dashboard weekly."* A descriptive claim, directly reported.
- **X2. Hedged, but still overreaching.** *"This may suggest that dashboards transform decision cultures across industries."* With D1's design. The hedge lowers strength, but type and scope still exceed the warrant. Its final status is boundary case B3.
- **X3. Keyword present, warrant absent.** D3.
- **X4. Keyword absent, warrant present.** D4.
- **X5. Absent, not inadequate.** D5, contrasted with D1.
- **X6 (corrected). Insufficient statistical evidence, not contradiction.** With D2's design, the Results report *"no significant difference between teams with and without access (d = 0.04, 95% CI [−0.31, 0.39])"*. The Discussion says *"dashboard access improved decision-making"*. The interval is compatible with small positive, null and small negative effects. The claim is **overreaching** because the evidence is **insufficient** for a positive effect. It is **not contradicted**, and the result is not evidence that no effect exists.
- **X7 (new). Genuinely contradicted.** With D2's design, the Results report *"teams with access scored lower (d = −0.42, 95% CI [−0.78, −0.06])"*. The Discussion says *"dashboard access improved decision-making"*. The estimate is in the opposite direction and its interval excludes zero, so the type dimension (direction) is **contradicted**.
- **X8 (new). Assumption statement, not an identification strategy.** With D1's design plus *"assuming no unmeasured confounding, dashboard access causes better decisions"*. Under §2.4, this is warranted **only** if the claim's strength is read as explicitly conditional. If the Discussion later states *"we have shown that dashboards cause better decisions"*, that claim is **overreaching on strength**.

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
| B9 (new) | D2 with no balance, attrition or blinding information reported. Claim strength "shows" | Do unmentioned standard assumptions lower a strong claim to overreaching, or is that an unrealistic demand for an excerpt? |
| B10 (new) | Like X6, but the interval is wide (d = 0.04, 95% CI [−0.60, 0.68]) and the Discussion says "dashboards had **no effect**" | The claim of *no effect* overreaches in the other direction: imprecision does not show absence |

## 5. What this document deliberately leaves open

- **The taxonomy.** The relation between these dimensions and G1–G7 is not decided. A tentative correspondence, not a mapping: type covers G3 and G1, scope covers G5, theory-level claims cover G2, and construct correspondence (if adopted) covers G4.
- **The aggregation rule** (§3).
- **Construct correspondence** as a fourth dimension (§2.1).
- **"Contradicted"** as a separate outcome, versus a sub-type of overreaching.
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
