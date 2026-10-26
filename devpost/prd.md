---
doc: prd
status: approved
---

# WarrantLab — Product Requirements

**WarrantLab · Scholarly Argument Intelligence.** A browser-based workspace for PhD and research students writing Information Systems papers. It finds the missing reasoning between the evidence they present and the claims they make, and it never rewrites their text.

**Taglines:** "Stronger arguments. Your own words." (closing line) · "Find the missing reasoning between your evidence and your claims." (product promise)

Develops: `scope.md > The Unique Kernel`, `The Core Loop`, `What "Working" Looks Like`, `The POC Boundary`. Started from the learner's PRD v0.2 and reconciled with the approved scope. Scope changes made during this PRD are listed under **Scope Amendments**.

"WarrantLab" is a provisional working name for the POC and Devpost. Trademark and domain availability have not been checked and must not be claimed.

## The Core Journey

1. **Arrive.** The user opens WarrantLab in a browser. They see a two-column workspace: a manuscript editor on the left and an empty diagnostic panel on the right that explains what the tool does and doesn't do.
2. **Choose a section.** The section selector defaults to **Discussion**. Only sections that have passed the **Section Validation Gate** can be selected. The others are shown as *In development* and can't be chosen.
3. **Paste text.** The user pastes or types one or more paragraphs, up to 3,000 words. A live word count shows how close they are to the limit.
4. **Analyse.** The user selects **Analyse Argument**. A loading state appears, and further submissions are blocked until it finishes.
5. **Read the result.** The editor becomes a read-only annotated view of the user's exact text. The panel shows one of three outcomes:
   - **Overclaim detected:** up to three findings, each with an amber highlight on the exact claim span and a Warrant Check (Evidence → Missing warrant → Claim).
   - **No overclaim identified:** a calm, neutral confirmation with no highlights.
   - **Insufficient evidence:** a neutral notice saying what would be needed to assess the claim, with no highlight and no warning styling.
6. **Explore a finding.** Selecting a finding scrolls to and emphasises its span in the text. Selecting a highlight opens its finding.
7. **Revise.** The user selects **Edit text** and returns to the editor with their original text unchanged. They revise in their own words. Old results are cleared as soon as the text changes.
8. **Re-analyse.** They select **Analyse Argument** again. **Success** is when a revised, well-calibrated claim now returns *No overclaim identified*, and the user understands why.

## Screens and Layout

There is **one screen, the workspace**, which switches between an *editing* state and an *annotated* state.

- **Header:** the WarrantLab wordmark, the descriptor "Scholarly Argument Intelligence", the section selector, and the primary **Analyse Argument** action.
- **Desktop:** two columns, about **58% manuscript** on the left and **42% diagnostic panel** on the right, so the user never has to switch screens to compare text and feedback.
- **Mobile:** the columns stack vertically, with the manuscript above the diagnostic panel.
- **Manuscript column:** in the editing state, a plain text editor with a word count. In the annotated state, a read-only rendering of the exact original text with amber highlights, the line "Original text preserved", and an **Edit text** action.
- **Diagnostic panel:** an empty state before analysis, then the outcome view (see **Features and Behavior > Findings and the Warrant Check**). A permanent footer line reads: "Assessment limited to the supplied text. No manuscript-wide verification."

The editing-to-annotated switch is a deliberate cut. It gives exact-span highlighting without building a rich-text editor.

## Look and Feel

Contemporary journal editorial meets a professional peer-review interface: credible, calm, precise, and visually refined. It's usable by a professor and immediately clear to a less experienced PhD student.

- **Colours:** warm off-white canvas `#F7F6F2`, white manuscript surface `#FFFFFF`, dark ink text `#243746`, muted navy accent `#315675`, and restrained amber `#B17B36` for overclaim highlights only.
- **Typography:** **Source Serif 4** for manuscript text and quoted research passages. **Inter or IBM Plex Sans** for interface elements, labels, buttons, and explanations (see **Open Questions**).
- **Style:** generous whitespace, fine borders, disciplined typography, and restrained colour. Invest in typography, highlight legibility, clear diagnostic states, and readability of long passages.
- **Avoid:** purple gradients, glassmorphism, lots of heavily rounded cards, generic chatbot styling, unnecessary animation, and decorative "AI" imagery. Avoid an Overleaf-like authoring look and a dated print-journal imitation.
- **State styling:** only *Overclaim detected* uses amber or warning styling. *No overclaim identified* and *Insufficient evidence* are neutral and must never look like errors.

## Features and Behavior

### Section Selector and Availability
Source: `scope.md > The Core Loop`; amended (see **Scope Amendments**).

Eight sections are planned: Abstract, Introduction, Literature Review / Theoretical Background, Hypotheses / Theory Development, Methodology, Results / Findings, Discussion, and Conclusion. The selected section must genuinely shape the analysis, not decorate it. It tells the analysis what argumentative function the text serves and what counts as appropriate evidential justification there.

| Section | Build priority | Diagnostic boundary |
|---|---|---|
| Discussion | P0 | Theoretical mechanisms and interpretation of findings |
| Results / Findings | P0 | Whether conclusions match the reported results |
| Introduction | P0 | Claims supported within the supplied text. Doesn't verify literature gaps. |
| Hypotheses / Theory Development | P1 | The link between theoretical justification and the hypothesised relationship |
| Conclusion | P1 | Claims compared with the supplied evidential limits |
| Literature Review | P1 | Claims about prior research. Doesn't confirm the content of sources not supplied. |
| Methodology | P1 | Methodological claims compared with the described design |
| Abstract | P1 | Conclusions compared with the summarised evidence, cautiously, because abstracts compress evidence |

P0 and P1 are build priorities, not implementation or test status.

- A section can be selected only after it passes the **Section Validation Gate**. Before that it's shown as *In development* and is disabled.
- Section awareness is **not** methodological awareness. The POC doesn't judge causal validity, construct validity, or methodological rigour from the pasted text. When the methodological context needed to judge a claim is missing, the result is a request for more evidence or *Insufficient evidence*.
- **Changing the section** keeps all of the user's text, clears the old highlights, findings, and verification status, returns to the editing state, and requires a new **Analyse Argument** for the new section. If an analysis is still running when the section changes, its response is cancelled or ignored. A Discussion result must never appear under a Results label.
- Each section is analysed on its own. The POC must not claim consistency checks across sections.

### Text Input and Limits
Source: `scope.md > The POC Boundary`; amended.

- The editor accepts one or more paragraphs, up to **3,000 words per analysis**. That's a POC design limit, not a journal norm.
- **Empty or whitespace-only input:** Analyse Argument is disabled.
- **Over 3,000 words:** the text isn't analysed and isn't silently truncated. The user sees a message asking them to choose a shorter passage, and their text stays in the editor.
- Whitespace is trimmed only to check for emptiness. The stored and displayed text is exactly what the user entered.
- **Length release gate:** if end-to-end tests at longer lengths aren't stable before submission, the enabled limit is lowered to the longest length that passed, and the UI shows that limit. The product must never advertise reliable 3,000-word analysis it hasn't passed.

### Analysis and the Three Outcomes
Source: `scope.md > The Unique Kernel` (both non-negotiable rules).

The issue is never an emphatic word on its own. It's a **visible inferential step beyond the evidence supplied in the text that can be named specifically**. Every analysis returns exactly one of three academic outcomes:

| Outcome | Necessary conditions | UI treatment | Permitted statement |
|---|---|---|---|
| `overclaim_detected` | The text presents identifiable evidence **and** a theoretical (or, conditionally, causal) conclusion that requires a further inference the evidence doesn't establish, **and** that inferential step can be named. | Amber highlights and finding cards (at most 3) | "The evidence described here does not establish …" |
| `no_overclaim_identified` | Interpretable evidence is present, and the conclusions stay within its stated limits after a meaningful comparison. | No highlight, no warning. Neutral confirmation. | "No claim–evidence mismatch identified in the supplied text. This is not a verification of the wider study." |
| `insufficient_evidence` | A substantive claim appears, but the text gives no assessable evidence or not enough detail to compare claim and evidence responsibly. This includes claims whose evidence would sit in another section. | Neutral notice. No highlight, no warning. | "There is not enough information in the supplied text to verify this claim." When relevant: "This claim may require evidence from another section." |

**Decision priority:** use `overclaim_detected` only when concrete evidence and a nameable inference beyond it are both present. If no defensible comparison is possible, use `insufficient_evidence`. Use `no_overclaim_identified` only after a real comparison. *No warning* never means *the research is correct*.

**No in-scope claims (amended in `4-spec`):** if the text contains no substantive claim that can be assessed (e.g. a passage describing the paper's structure), the outcome is `no_overclaim_identified` with the reason `no_in_scope_claims`. It's shown as a neutral notice, never as a success or a verified argument:
> **No in-scope claims identified.** The supplied text does not contain a substantive claim that can be assessed for claim–evidence alignment. This is not an assessment of the wider manuscript.

"No claims" is different from "a claim without evidence". The latter is always `insufficient_evidence`. Empty input remains a validation error.

**Overclaim categories:**
- **Theoretical overclaim (committed):** an observed relationship or contrast is presented as proof of a theoretical mechanism, or as validation of a whole theory, without the intermediate inferential step.
- **Causal overclaim (conditional):** an association is presented as proof of causation without any causal identification described in the text. It's included only if the **Causal Development Check** passes. Otherwise it's explicitly deferred. Causal wording must **not** be flagged automatically when the text describes a randomised manipulation. A properly designed experiment may support a causal effect of the assigned condition, but not necessarily the proposed mechanism.

**Analysis incomplete (a processing state, not an academic outcome):** if any part of the submitted text fails to be analysed, the product must **not** report `no_overclaim_identified` for the whole text. It shows "Analysis incomplete", keeps the user's text, and offers **Try again**.

### Findings and the Warrant Check
Source: `scope.md > The Unique Kernel` (observed evidence, inferential claim, missing warrant).

When the outcome is `overclaim_detected`, the panel shows a header such as "2 findings" and up to **three findings**. Findings appear in the order of their position in the text. They are never labelled "most serious", because there's no validated severity scale. If more than three are identified, the three with the clearest basis are shown, with the note "Showing selected findings from the supplied text. This is not an exhaustive review."

Each finding contains the following.

**Shown immediately:**
- **Category:** e.g. "Theoretical overclaim".
- **The Warrant Check:** three linked parts.
  - **Evidence identified:** what the text actually reports.
  - **Missing warrant:** the unproven logic that would be needed to connect the evidence to the claim.
  - **Claim:** what the text asserts, tied to the highlighted span.
- **What the claim assumes:** the inferential step taken.
- **Why this matters:** a short plain-language explanation.
- **Verification status:** e.g. "Mismatch identifiable within the supplied text. Full study not assessed."

**In expandable sections, easy to find:**
- **Evidence still needed:** what would be required to defend the claim.
- **What to examine:** questions for the author to judge their own argument, including at least one about whether the mechanism was tested.

Each finding ends with "Your argument, your decision. No rewritten text." The **Copy feedback** action is optional (see **Deferred From the POC**).

**Bounded language everywhere:** phrases like "in the supplied text" and "based on the evidence presented". It never says "your study is wrong", "this mechanism was not tested", or "the theory is disproven".

### Annotated View and Revision Loop
Source: `scope.md > The Core Loop`.

- After analysis, the manuscript column shows a read-only rendering of the **exact original text**. Highlights cover only spans that match the original text exactly at their character positions.
- If a span can't be matched to the original text unambiguously, its highlight is suppressed. The finding still appears, with a neutral note that its location couldn't be marked.
- **Edit text** returns to the editor with the original text, unchanged byte for byte.
- A diagnostic is valid only for the exact text **and** section that were analysed. Any change to either clears the stale highlights and findings, but never the user's text. A response from a superseded request is never displayed.
- There's no replacement sentence, rewritten paragraph, "apply fix", or one-click correction anywhere.

### Scope Transparency and Disciplinary Grounding
Source: `scope.md > Disciplinary Grounding (IS Scholarship)`.

- The empty state and the panel footer say that analysis is limited to the supplied text, isn't manuscript-wide, and isn't peer review.
- **Two kinds of evidence never blend.** Only the user's text decides the outcome. Published IS sources may explain disciplinary norms, but they never supply missing evidence or force an `overclaim_detected` result.
- **Default for the POC: no runtime grounding claim.** Bibliographic metadata has been verified (`devpost/sources/is-source-seed.csv`), but methodological review is **not** complete. The app shows no "grounded in IS scholarship" claim and no source cards unless verified methodological notes exist, each traceable to a DOI from a source the learner has actually reviewed.
- If grounding is enabled later, any journal or article reference shown must link to a verified publisher page or DOI and state the document type. "ISJ requires X" may only appear if current primary journal policy says so.

### Privacy of Unpublished Work
- **Session-only, in-memory operation.** No accounts, database, manuscript history, or autosave. The app doesn't write manuscript text or results to `localStorage`, `sessionStorage`, or any database.
- The empty state shows this disclosure *(amended in `4-spec` for the Gemini API Free Tier)*:
  > WarrantLab does not save your manuscript or analysis history. This demonstration sends your text to Google's Gemini API free tier. Google may have human reviewers read free-tier inputs and outputs, and may use them to improve its products. Please do not paste unpublished or confidential research.
- The hackathon demonstration uses fictional research excerpts only. If the provider changes (e.g. to a paid API with different data terms), the disclosure must be rewritten to match that provider's verified terms.
- **No absolute deletion promise.** The UI must not say that closing the tab permanently deletes all data, because browser session restoration and the AI provider's retention are outside the app's control.
- Manuscript content never appears in application logs, analytics, or error logs.
- Any specific privacy or retention claim about the AI provider may be shown only after its actual retention and processing policy has been verified.

## Golden Test Cases

All fixtures are **fictional illustrative text**, not study findings. They run through the real analysis flow, never through hard-coded answers.

### Discussion

**TC1: theoretical overclaim → `overclaim_detected`**
> Participants exposed to an external data-sharing policy reported higher privacy concerns than those exposed to an internal-sharing policy (p = .01). These findings prove that violations of contextual integrity are the mechanism driving privacy concerns.

- **Exact highlight:** `prove that violations of contextual integrity are the mechanism driving privacy concerns`
- **Category:** theoretical overclaim.
- **Evidence identified:** a difference in reported privacy concerns between two experimental conditions (p = .01).
- **Missing warrant:** the condition difference hasn't been shown, in the supplied text, to identify contextual-integrity violation as the explanatory mechanism. External sharing isn't automatically a contextual-integrity violation, because that depends on the contextual information norms involved (Nissenbaum), and the text doesn't show those norms were specified or measured.
- **Claim:** the study proves the theoretical mechanism.
- **What to examine:** (1) Was the mechanism measured or manipulated? (2) Does the text report a test of the mechanism itself, rather than only the difference between conditions? (3) Could another explanation account for the result?
- **Verification status:** "Mismatch identifiable within the supplied text. Full study not assessed."
- **Must not say:** "the study never tested contextual integrity", "the theory is invalid", or "the condition cannot have a causal effect".

**TC2: well-calibrated → `no_overclaim_identified`**
> Participants exposed to an external data-sharing policy reported higher privacy concerns than those exposed to an internal-sharing policy (p = .01). This difference is consistent with contextual integrity theory, but the comparison alone does not establish the underlying mechanism.

- No highlight and zero warnings. A neutral confirmation only.
- **Must not** flag "consistent with", "contextual integrity", or "reported higher", or flag the lack of a mediation analysis as an error. No unnecessary suggestions for improvement.

**TC3: cannot verify → `insufficient_evidence`**
> External data sharing increases privacy concerns through violations of contextual integrity. Our research provides strong evidence for this mechanism.

- No highlight and zero overclaim warnings.
- **Message:** "This text does not include findings or methodological information that would allow the mechanism claim to be checked."
- **What to examine:** "Which result supports this mechanism, and where is the test reported?"
- **Must not** infer unreported data, invent a statistical test, or state that the paper didn't test the mechanism. "Strong evidence" on its own doesn't justify `overclaim_detected`.

**TC4: no in-scope claims → `no_overclaim_identified` with reason `no_in_scope_claims`**
> Section 2 reviews prior research on privacy concerns. Section 3 describes the experimental design, and Section 4 reports the results.

- No highlight, no finding, and no warning. The neutral "No in-scope claims identified" notice is shown.
- **Must not** be presented as a successful claim–evidence check. Contrast it with TC3, a claim without evidence, which must stay `insufficient_evidence`.

**Revision demo pair:** TC1 revised by the user into TC2 must move from `overclaim_detected` to `no_overclaim_identified`. This is the core demo moment.

### Multi-paragraph case
A 2–4 paragraph Discussion passage containing **two** separate theoretical overclaims. Both must be highlighted with their own findings, and well-calibrated sentences in between must not be flagged. *(Fixture still to be written. See **Open Questions**.)*

### Causal Development Check (not a demo scenario)
> Higher perceived data sharing was associated with greater privacy concerns (r = .32). This association proves that data sharing causes privacy concerns.

Expected: `causal_overclaim`, highlighting exactly `proves that data sharing causes privacy concerns`. If this isn't reliable across repeated runs, causal overclaim is deferred and not advertised.

### Results and Introduction
Each needs its own overclaim, well-calibrated, and insufficient-evidence fixtures before it can pass the gate. *(Still to be written. See **Open Questions**.)*

## Section Validation Gate

A section becomes selectable (**Supported**) only when all four criteria pass:

- [ ] **Overclaim case:** the unsupported inference is identified, and the exact original span is highlighted.
- [ ] **Well-calibrated case:** no false warning.
- [ ] **Insufficient-evidence case:** it abstains without inventing missing study details.
- [ ] **Section awareness:** the explanation fits the section, the original text is preserved, and the result is stable across repeated real-model runs. Each golden case passes **at least 3 times** through the real flow.

Passing the gate confirms that the smoke tests are stable on the chosen examples. It doesn't prove general accuracy. If a section contains no in-scope claim, the tool must not invent a problem to show that the section works.

## Acceptance Criteria

| ID | Requirement | Pass condition |
|---|---|---|
| AC1 | Text preservation | The input is unchanged byte for byte by analysis and display. Only the user edits it. |
| AC2 | Literal highlights | Every highlight is an exact substring at verified character positions in the current text. Ambiguous matches suppress the highlight and show a neutral note. |
| AC3 | TC1 positive | The exact target span is highlighted. The Warrant Check separates the group difference from evidence of a mechanism. |
| AC4 | TC2 negative | No finding, highlight, or warning. A neutral confirmation only. |
| AC5 | TC3 uncertainty | A neutral `insufficient_evidence` result, no overclaim warning, and no invented evidence or verdict on the study. |
| AC6 | No rewriting | No replacement sentence, rewritten text, "apply fix", or one-click correction anywhere. |
| AC7 | Error and editing states | Empty input can't be submitted, and failures are recoverable without losing text. Edits or section changes clear old results but keep the text, and a superseded response is never shown. |
| AC8 | Scope transparency | The UI says analysis is limited to the supplied text. It never promises manuscript-wide or scientific validation, or peer review. |
| AC9 | Source provenance | Any journal or article reference shown links to a verified publisher page or DOI and states the document type. |
| AC10 | Evidence separation | Published sources never replace missing user evidence or force `overclaim_detected`. |
| AC11 | Licence gate | No full-text source passages are used at runtime without a version-specific permission check. Metadata and links only. |
| AC12 | Genre calibration | Qualitative or interpretive writing isn't required to show quantitative causal identification by default. |
| AC13 | Warrant Check structure | Every finding shows Evidence identified, Missing warrant, and Claim, plus What the claim assumes and the Verification status. |
| AC14 | Finding limit | At most 3 findings, in text order, never labelled by severity, with the "not an exhaustive review" note when findings were limited. |
| AC15 | Input limit | Text over the enabled word limit isn't analysed or truncated. A clear message appears and the text is kept. |
| AC16 | Incomplete analysis | Partial failure shows "Analysis incomplete" with Try again, and never `no_overclaim_identified`. |
| AC17 | Section availability | Only gate-passed sections can be selected. Others show *In development* and are disabled. |
| AC18 | Revision loop | TC1 revised into TC2 and re-analysed changes from `overclaim_detected` to `no_overclaim_identified`. |
| AC19 | Neutral states | Neither `no_overclaim_identified` nor `insufficient_evidence` uses amber or warning styling. |
| AC20 | Privacy disclosure | The empty state shows the agreed disclosure. Manuscript text isn't written to browser storage, logs, or analytics. |

**LLM reality check:** these fixtures are a smoke test, not empirical evidence of accuracy. Any golden-case failure in a supported section blocks the demo for that section.

## States and Boundaries

- **First use / empty:** the editor is empty, the word count is 0, and Analyse is disabled. The panel explains what WarrantLab checks, says it never rewrites, states that analysis is limited to the supplied text, and shows the privacy disclosure.
- **Ready:** there's text within the limit and a supported section is selected, so Analyse is enabled.
- **Over limit:** the word count shows it's over the limit, and the "choose a shorter passage" message appears. Analyse is blocked and the text is kept.
- **Analysing:** a loading state appears, duplicate submissions are blocked, and the text is still visible.
- **Overclaim detected:** the annotated view with amber highlights and up to 3 finding cards.
- **No overclaim identified:** the annotated view with no highlights and a neutral confirmation.
- **Insufficient evidence:** the annotated view with no highlights and a neutral notice explaining what's needed.
- **Analysis incomplete / failed:** a neutral error with Try again. The text is kept and no outcome is claimed.
- **Stale:** the text or section changed after analysis. Results are cleared, the text is kept, and the workspace returns to editing. Any response still arriving is ignored.
- **Persistence:** in memory only. The app keeps no session history and writes nothing to browser storage. No absolute deletion promise is made.

## Demo Script (under 3 minutes, about 2:20)
Source: `scope.md > What "Working" Looks Like`; amended.

| Time | What the viewer sees |
|---|---|
| 0–15s | The problem: academic-sounding text can contain conclusions that go beyond the evidence. Who it's for. |
| 15–35s | Open WarrantLab, choose Discussion, paste TC1. |
| 35–65s | Analyse Argument. The exact span is highlighted and the Warrant Check appears (Evidence → Missing warrant → Claim). |
| 65–95s | Open the finding: why it matters, evidence still needed, questions to examine. |
| 95–115s | Edit text, the author revises it into TC2 in their own words, then re-analyses: *No overclaim identified*. |
| 115–130s | Paste TC3 and show the neutral *Insufficient evidence* state and the verification limits. |
| 130–140s | A brief look at `scope.md`, `prd.md`, `spec.md` and how the Learn Skill Pack shaped them. Close on "Stronger arguments. Your own words." |

The demo uses the working analysis flow, never pre-built results. The product must appear within the first minute. A second section is shown only if it has passed the gate.

## Product Decisions

- **Name: WarrantLab**, because a *warrant* is what connects evidence to a claim, and the name doesn't lock the product into overclaim detection forever. It's provisional and no trademark or domain claim is made.
- **Two-column 58/42 workspace**, because the user compares text and feedback without switching screens. It stacks on mobile.
- **Read-only annotated view plus Edit text** instead of a rich-text editor. That's much simpler while still guaranteeing text preservation and exact highlights.
- **Journal-editorial × peer-review look** with the agreed palette and fonts, so it's credible to professors, clear to students, and not generic AI styling.
- **No AI detector, no rewriting.** These are carried from scope.
- **Three academic outcomes plus a separate "Analysis incomplete" processing state**, so a processing failure is never reported as a clean result.
- **Overclaim only when a specific inferential step can be named.** Otherwise the result is insufficient evidence, so missing context never becomes a false allegation.
- **Up to 3,000 words and up to 3 findings.** A real section-sized passage fits, and the feedback stays readable. No severity ranking, because no validated scale exists.
- **Eight sections planned and enabled only after the validation gate.** There's no "Experimental" mode, because unverified academic commentary shouldn't reach users.
- **Section-aware, not methodology-aware.** Missing methodological context leads to insufficient evidence rather than a rigour verdict.
- **Build order:** one accurate Discussion diagnostic, then the revision loop, then multiple findings, then Results and Introduction once they pass the gate. If time runs out, Discussion alone is a complete POC.
- **A section change clears results but keeps the text**, so a diagnostic is only ever shown for the exact text and section it analysed, and the user never loses work.
- **Session-only, in-memory, with an honest disclosure**, because unpublished manuscripts are sensitive and the app can't control browser restoration or provider retention.
- **The button is "Edit text", not "Edit paragraph"**, because input can be several paragraphs.
- **Reliability over breadth:** "a tool that dares to say *I cannot verify this claim from the supplied evidence*."

## Scope Amendments
These change `scope.md` as approved and are agreed during this PRD:

| Approved scope said | PRD now says | Why |
|---|---|---|
| One paragraph in | One or more paragraphs, up to 3,000 words (subject to the length release gate) | A real Discussion or Results section is the normal use. One paragraph undersold the product. |
| Section selector, Discussion by default | 8 planned sections, enabled only when they pass the gate. P0: Discussion, Results, Introduction. | IS papers need claim–evidence alignment across sections, not just in the Discussion. |
| One highlight | Up to 3 independently justified findings | Multi-paragraph input needs more than one finding. |
| 60-second demo | A video under 3 minutes (about 2:20) including the revision loop | Official rules allow under 3 minutes. The revision moment is the strongest proof. |
| Working title "Scholarly Writing Intelligence" | WarrantLab · Scholarly Argument Intelligence | Names the missing warrant directly. |

## What We're Building
- A one-screen, two-column WarrantLab workspace (editing and annotated states), responsive on mobile, in the agreed look and feel.
- A section selector with gate-controlled availability. Discussion must be supported. Results and Introduction are supported if they pass the gate in time.
- Input of up to 3,000 words with a word count, an empty-input block, and over-limit rejection.
- Real LLM analysis returning one of three outcomes, plus the Analysis incomplete state.
- Up to 3 findings, each with the Warrant Check, what the claim assumes, why it matters, the verification status, and expandable *Evidence still needed* and *What to examine* sections.
- Exact-span highlighting verified against the original text, with linking between highlights and findings.
- The Edit text revision loop with invalidation of stale results.
- Scope-transparency and privacy disclosure text.
- Golden fixtures and repeated real-model runs for each supported section.

## Deferred From the POC
- **Sections beyond those that pass the gate:** shown as *In development*. Enabled after validation.
- **Causal overclaim:** only if the Causal Development Check passes.
- **Runtime IS grounding and source cards:** not until verified methodological notes exist.
- **Reliable analysis of the full 3,000 words:** subject to the length release gate.
- **Copy feedback:** a nice-to-have, only if time allows. It copies the finding, never rewritten text.
- **Cross-section consistency** (e.g. Introduction promises compared with Discussion claims): needs manuscript-level analysis.

## Possible Later Enhancements
- Manuscript analysis: several sections at once, matching research questions, hypotheses, findings, and claimed contributions.
- Section analysis beyond 3,000 words using argument units.
- A rights-cleared full-text corpus from premier IS journals with expert-annotated claim–evidence units and retrieval with citations.
- Methodology-specific calibration (experimental, observational, qualitative-interpretive, design science).
- External-validity and generalisation diagnostics, and gap-spotting or problematisation for Introductions.
- Writing-pattern diagnostics as an optional add-on.
- Adaptive mentorship, a journal lens and AI-policy display, and an argument map.
- A benchmark study with IS researchers measuring accuracy, false positives, and learning transfer.

## Non-Goals
- **AI-content detection:** unreliable, and it harms non-native English writers.
- **Rewriting or suggesting replacement wording:** it teaches, and the author decides.
- **Grammar, style, or citation checking:** generic tools already do this, and it dilutes the kernel.
- **Peer-review or publication-readiness scores:** unvalidated numbers like "92% ready" mislead.
- **Judging methodological rigour or validating literature gaps:** not possible responsibly from pasted text.
- **Accounts, saved history, dashboards, or integrations:** not needed to prove the kernel.
- **Bulk scraping or fine-tuning on journal articles:** rights haven't been checked.

## Notes for 4-spec (learner's technical direction, not yet decided)
- Analyse long input in groups of about 400–600 words with some neighbouring context, then merge duplicate findings. Don't trust a single call for 3,000 words.
- Validate highlights with exact character positions on the original text. Check the model's output against a schema and drop spans that don't exist in the text.
- A structured result with claim span, evidence span, issue type, reason, missing warrant, missing evidence, questions to examine, and verification status.
- Partial chunk failure must produce *Analysis incomplete*, never a clean result.

## Open Questions
1. **Fixtures for the multi-paragraph case, Results, and Introduction:** who writes them, and when? *Doesn't block `4-spec`. Must exist before those sections or behaviours can pass the gate.* The learner should write or approve the expected outcomes.
2. **Interface font, Inter or IBM Plex Sans:** *doesn't block. Can be decided in `4-spec`.*
3. ~~Section change and persistence assumptions~~ **Resolved at review:** results are cleared but the text is kept, and operation is in memory only (see **Product Decisions**).
4. ~~AI provider's retention and processing policy~~ **Resolved in `4-spec`:** Gemini API Free Tier ($0 constraint). Free-tier content may be used by Google to improve its products, so the disclosure was amended and the demo uses fictional text only.
