---
doc: spec
status: approved
---

# WarrantLab — Technical Spec

Implements `prd.md` (approved, with the privacy amendment noted under **Decisions and Open Issues**). Kernel: `scope.md > The Unique Kernel`.

**Budget constraint (learner decision): zero additional paid services.** Inference uses the Gemini API Free Tier. No paid billing, automatic top-ups, or paid model fallbacks. The model integration sits behind one small adapter, so Anthropic or OpenAI can be evaluated later. The demo uses fictional research excerpts only.

## How This Works, In Plain Language

WarrantLab is one **Next.js** app: a single project containing both the web page and a small server.

1. **The page** (what runs in your browser) holds your text in memory, shows the two-column workspace, and draws the highlights. It never talks to the AI provider directly.
2. **The analysis route** (`POST /api/analyse`, on the server) receives your text and the chosen section, checks the limits, and runs the **Claim–Evidence Alignment Engine**. The Gemini API key lives only here.
3. **The engine** works in four stages:
   - **Prepare:** count words, split the text into numbered paragraphs, and keep the original string untouched.
   - **Pass 1, Extract:** a model reads the whole text and lists every candidate **claim** and every piece of **evidence**, each as a word-for-word quote, including claims it can't connect to any evidence. It also reports which paragraphs it covered.
   - **Verify:** plain code checks that every quote really exists in your text, that every paragraph was covered, and that the output matches the schema. Anything invented or missing stops here.
   - **Pass 2, Judge:** the model gets your **whole original text** plus the verified extraction. It decides, claim by claim, whether the claim overreaches its evidence, fits it, or can't be assessed from what's supplied. It may find evidence or links that Pass 1 missed, but every new quote is verified again.
   - **Aggregate:** plain code turns the verified judgements into exactly one outcome (**overclaim detected**, **no overclaim identified**, or **insufficient evidence**), or **analysis incomplete** if anything failed.
4. **The panel** shows up to three findings as Warrant Checks (Evidence → Missing warrant → Claim), plus a neutral list of claims that couldn't be assessed.

**Why this shape:** a model is good at reading arguments but can't be trusted to quote accurately or report its own completeness. So the model does the reading and judging, and deterministic code does the checking. Splitting extraction from judgement makes every comment traceable to exact words in your text. Giving the judge the full text stops a weak extraction from silently hiding evidence.

**Where your text goes:** the app stores nothing. Each analysis sends the text to Google's Gemini API on the **free tier**, where Google says submitted content **may be read by human reviewers and used to improve its products**. That's acceptable for fictional demo passages but not for unpublished manuscripts, and the app says so plainly.

**What "covered" means:** Pass 1 reports which paragraphs it read, and code checks that list. That's a *structural* check that no paragraph was skipped, not proof that every claim was found. The app never says its review is exhaustive.

**A note on consistency:** Gemini accepts a `temperature` setting, so both passes run at `0` to reduce variation. That still doesn't guarantee identical outputs, so stability is *measured* by repeated runs in the evaluation harness.

## The Core Journey Through the System
PRD ref: `prd.md > The Core Journey`.

1. **Arrive.** The browser loads `app/page.tsx`, which renders `Workspace` in its *editing* state. The text is empty, so Analyse is disabled. `DiagnosticPanel` shows the empty state with the free-tier privacy disclosure.
2. **Choose a section.** `SectionSelector` reads the section flags passed from the server. Only entries with `supported: true` can be selected. The others show *In development*. Changing the section clears any result and keeps the text.
3. **Paste text.** `ManuscriptEditor` updates `text` in React state. `countWords()` from `lib/text/wordCount.ts` drives the live counter. Over the limit, Analyse is blocked and a message appears.
4. **Analyse.** `Workspace` computes `analysisKey = section + hash(text)` and sends `POST /api/analyse {text, section}` with an `AbortController`. The panel shows *Analysing…* and the button is disabled.
5. **Server.** `route.ts` validates the request again (same `countWords`, supported section, non-empty), then calls `analyse()` in `lib/engine/analyse.ts`. That runs Prepare → Extract → Verify → Judge → Verify → Aggregate and returns an `AnalysisResponse`. No manuscript text is logged.
6. **Read the result.** The client accepts the response only if its `analysisKey` still matches the current text and section. Otherwise it's discarded. The workspace switches to the *annotated* state. `AnnotatedText` renders the original string, split at the verified character offsets, with amber marks for findings only. `DiagnosticPanel` renders the outcome, the finding cards, and the unassessed summary.
7. **Explore.** Clicking a finding scrolls to and focuses its `<mark>`. Clicking a mark expands its finding. Both use the shared `findingId`.
8. **Revise.** **Edit text** returns to `ManuscriptEditor` with the same `text` value, untouched. Any edit or section change clears `result`.
9. **Re-analyse.** The same path again. With TC1 revised into TC2, the outcome becomes `no_overclaim_identified` (PRD AC18).

## Stack

| Piece | Choice | Why (learner decision unless noted) | Docs |
|---|---|---|---|
| Framework | **Next.js** (App Router), latest stable at build time | One project for the UI and the server route. The API key stays server-side. | https://nextjs.org/docs |
| Language | **TypeScript** (strict) | Typed schemas end to end | https://www.typescriptlang.org/docs/ |
| Validation | **Zod** | Validates model JSON and API requests. Schema validity is never treated as correctness. | https://zod.dev |
| LLM SDK | **Google Gen AI SDK for JavaScript** (`@google/genai`) | The official Gemini client, with JSON structured output | https://ai.google.dev/gemini-api/docs |
| Model (both passes) | **`gemini-2.5-flash`** to start, configured separately per pass through env. **If the AI Studio project can't access it, use `gemini-3.8-flash`** (also Free Tier) | Learner-verified: both are listed on the Free Tier, but Google warns that new projects may have restricted access to the 2.5 family. One model for both passes keeps quota use predictable. Model changes are manual, documented in the eval report, and must pass the same gate. **No paid fallback, ever.** | https://ai.google.dev/gemini-api/docs/models |
| Sampling | `temperature: 0` on both passes *(agent default)* | Reduces run-to-run variation. Consistency is still measured. | https://ai.google.dev/gemini-api/docs |
| Unit tests | **Vitest** *(agent default)* | Fast tests for the deterministic code: spans, aggregation, word count, schemas | https://vitest.dev |
| Script runner | **tsx** *(agent default)* | Runs the evaluation harness in TypeScript | https://tsx.is |
| Fonts | `next/font/google`: **Source Serif 4** and **Inter** *(Inter is an agent default resolving PRD Open Question 2; it can be swapped for IBM Plex Sans)* | Self-hosted at build time, so there are no runtime font requests | https://nextjs.org/docs/app/building-your-application/optimizing/fonts |
| Styling | Plain CSS with custom properties and CSS Modules *(agent default)* | No extra framework. The palette maps directly to tokens. | https://nextjs.org/docs/app/building-your-application/styling/css |

**Provider rules for the build:**
- **Never enable billing** on the Google Cloud project linked to the key. Without billing, exceeding the quota is rejected (HTTP 429), not charged. Check in Google AI Studio that the project is really on the Free Tier.
- Use JSON structured output (a response MIME type of JSON plus a response schema), then validate the parsed result again with Zod.
- Treat any finish reason other than a normal stop (e.g. max tokens, safety, recitation, other) as **analysis incomplete**.
- There are no paid fallbacks. The only model switch is a manual env change.

**Verify early in the build (not checked yet by the agent):**
- The exact `@google/genai` call shape for structured output **for the chosen model and the installed SDK version**. The learner found that current docs mark `responseSchema` as deprecated in favour of `responseFormat`. Confirm against the live SDK and docs, and don't copy older examples. Also confirm the schema format it accepts and how it reports the finish reason.
- That the AI Studio project can actually call `gemini-2.5-flash` (or else `gemini-3.8-flash`), and that project's per-minute and per-day request limits.
- Whether the schema needs simplifying for Gemini's structured-output subset (e.g. union types for `claim_ref`).
- The current Next.js version and how long a route can run locally and on Vercel Hobby.

## Where It Runs and How Someone Tries It

**Runtime:** Node.js 24 (installed) and npm 11. Local-first.

```bash
npm install
cp .env.example .env.local   # then set GEMINI_API_KEY in .env.local
npm run dev                  # open http://localhost:3000
```

- `npm test` runs the Vitest unit tests (deterministic, no API use).
- `npm run eval -- --section discussion --runs 3` runs the real-model evaluation harness. It uses Free Tier quota, and requests are spaced out by `--delay-ms` (default chosen from the quota found in AI Studio). Results go to `eval/reports/`.
- **`.env.example` keys:** `GEMINI_API_KEY=`, `WARRANTLAB_EXTRACT_MODEL=gemini-2.5-flash`, `WARRANTLAB_JUDGE_MODEL=gemini-2.5-flash`, `WARRANTLAB_MAX_WORDS=3000`, `WARRANTLAB_CAUSAL_ENABLED=false`. Never commit real values. `.gitignore` already ignores `.env*` except `.env.example`.
- **Getting a key:** Google AI Studio → create an API key in a project **without billing**.

**Demo recording:** run locally, open `http://localhost:3000`, and follow `prd.md > Demo Script` (TC1 → revise into TC2 → TC3) using the fictional fixtures only. The video must be under 3 minutes and use the real flow. Check the quota before recording, because a 429 mid-take would show "Analysis incomplete".

**Submission:** a public GitHub repository and the video. The project folder isn't a git repository yet, so `5-build` initialises it.

**Optional deployment (learner decision):** Vercel Hobby ($0, personal and non-commercial), **only behind protection** (Deployment Protection) or kept local. A public, unprotected endpoint would let anyone exhaust the free quota and send arbitrary text through your key. Deployment never replaces the video.

## Look and Feel
Carries `prd.md > Look and Feel` forward unchanged.

- **Tokens** (`app/globals.css`): `--canvas #F7F6F2`, `--paper #FFFFFF`, `--ink #243746`, `--navy #315675`, `--amber #B17B36` (overclaim only). Add a soft amber tint for the highlight background, a muted ink for secondary text, and a 1px warm-grey `--line` for borders.
- **Typography:** Source Serif 4 for the manuscript, annotated text, and quoted passages, at 17–18px with a line-height of about 1.7. Inter for the interface, labels, and diagnostic prose at 14–15px. Small uppercase tracked labels for section headings in the panel.
- **Layout:** a desktop grid at `58fr 42fr`. Below about 768px it stacks, with the manuscript first. Generous whitespace, fine borders, and a corner radius of 4–6px at most.
- **States:** only `overclaim_detected` uses amber. `no_overclaim_identified` uses a quiet green-grey or navy accent, and `insufficient_evidence` and `analysis_incomplete` use navy or neutral. Status is always written in text as well as shown in colour.
- **Avoid:** gradients, glassmorphism, heavy shadows, large rounded cards, chatbot bubbles, decorative AI imagery, and non-essential animation (respect `prefers-reduced-motion`).
- **Copy tone:** precise, calm, bounded ("in the supplied text"), Australian spelling.

## Components

### Workspace
`components/Workspace.tsx` (client component). `app/page.tsx` (a server component) reads `lib/config.ts` and `lib/sections.ts` and passes `maxWords` and each section's `{id, label, supported}` as props, so the client and server always share one limit. Owns all UI state: `section`, `text`, `mode` (`editing` | `annotated`), `request` (`idle` | `analysing`), `result`, `analysisKey`. Changing the section or text clears `result`, sets `mode = editing`, and aborts any in-flight request. Responses with a stale `analysisKey` are dropped.
PRD ref: `prd.md > Annotated View and Revision Loop`, `prd.md > States and Boundaries`.

### SectionSelector
`components/SectionSelector.tsx`. Renders the 8 sections. Unsupported ones are `disabled` and labelled *In development*.
PRD ref: `prd.md > Section Selector and Availability`.

### ManuscriptEditor
`components/ManuscriptEditor.tsx`. A plain `<textarea>` (serif) with a live word count and the over-limit message. Its value is never transformed.
PRD ref: `prd.md > Text Input and Limits`.

### AnnotatedText
`components/AnnotatedText.tsx`. Renders the **original** string as text nodes split at verified `[start, end)` offsets. Findings become `<mark data-finding-id>` (amber). Unassessed claims are never marked. It uses no `dangerouslySetInnerHTML`. It shows "Original text preserved" and **Edit text**.
PRD ref: `prd.md > Annotated View and Revision Loop`, AC1, AC2.

### DiagnosticPanel
`components/DiagnosticPanel.tsx` with sub-components:
- `OutcomeNotice`: the outcome header, neutral confirmation, insufficient-evidence notice, and analysis-incomplete notice with **Try again**. For `reason: "no_in_scope_claims"`, it uses a neutral style with no success icon: **"No in-scope claims identified."** *"The supplied text does not contain a substantive claim that can be assessed for claim–evidence alignment. This is not an assessment of the wider manuscript."* When the cause is a quota limit, it adds: "The free analysis quota may be temporarily used up. Please try again later."
- `FindingCard`: category, the Warrant Check (Evidence identified / Missing warrant / Claim), What the claim assumes, Why this matters, Verification status, expandable *Evidence still needed* and *What to examine*, and the line "Your argument, your decision. No rewritten text."
- `UnassessedSummary`: neutral. "N claims could not be assessed" (with a list of quotes) only when every item has a verified quote. Otherwise "Some claims may need evidence not available in the supplied text."
- `PanelFooter`: "Assessment limited to the supplied text. No manuscript-wide verification." Plus the privacy disclosure (see **Privacy Disclosure**).

PRD ref: `prd.md > Findings and the Warrant Check`, `prd.md > Scope Transparency and Disciplinary Grounding`, `prd.md > Privacy of Unpublished Work`.

### Privacy Disclosure
Shown in the empty state and kept reachable in the footer. The wording follows the PRD amendment:
> WarrantLab does not save your manuscript or analysis history. This demonstration sends your text to Google's Gemini API free tier. Google may have human reviewers read free-tier inputs and outputs, and may use them to improve its products. Please do not paste unpublished or confidential research.

It must never claim zero retention or private processing.
PRD ref: `prd.md > Privacy of Unpublished Work`, AC20.

### Analysis Route
`app/api/analyse/route.ts`. `POST` with `{text: string, section: SectionId}`, validated by Zod. Rejects (400) empty text, text over the limit, or an unsupported section, using the same shared `countWords`. Calls `analyse()`, returns `AnalysisResponse` as JSON, and sets `cache-control: no-store`. Logs only the request id, duration, token counts if reported, outcome, and failure stage. **Never text, quotes, or diagnostics.**
PRD ref: `prd.md > Text Input and Limits`, `prd.md > Privacy of Unpublished Work`.

### Claim–Evidence Alignment Engine
`lib/engine/`. The orchestrator is `analyse.ts`. Each stage is a pure function, except the two model calls, which both go through the **LLM Adapter**.

#### LLM Adapter
`lib/engine/llm.ts` defines one function, `generateStructured({model, system, user, jsonSchema}) → {ok: true, json, finish} | {ok: false, reason}`. `lib/engine/gemini.ts` implements it with `@google/genai` (`temperature: 0`, JSON output plus schema). It maps a 429 to `reason: "quota"`, safety or other blocks to `"blocked"`, max tokens to `"truncated"`, and network or 5xx errors to `"model_error"`. There's no retry on 429, because retrying burns quota. One retry is allowed on 5xx or network errors. This adapter is the **only** file that knows the provider. Swapping to Anthropic or OpenAI later means adding a sibling file and an env switch.

#### Prepare
`lib/text/paragraphs.ts`. Splits on blank lines into paragraphs with `{index, start, end}` offsets into the original string. The model sees the text with `[P1]`, `[P2]`… markers. Offsets always refer to the unmarked original.

#### Pass 1 — Extract
`lib/engine/extract.ts`, prompt in `lib/engine/prompts.ts`. Model `WARRANTLAB_EXTRACT_MODEL`. Input: the section id, the section guidance, and the full marked text. Output (`ExtractionSchema`):
- `paragraphs_covered: number[]`
- `claims[]: {id, quote, sentence, paragraph, claim_kind: "theoretical"|"causal"|"interpretive"|"other", evidence_ids: string[], unresolved_reference: boolean}`. Claims with no linked evidence **must** still be listed.
- `evidence[]: {id, quote, sentence, paragraph, evidence_kind: "statistical_result"|"group_comparison"|"association"|"qualitative"|"citation"|"methodological"|"other"}`

The prompt tells the model to quote verbatim, include unresolved claims, and not to judge anything.

#### Verify
`lib/engine/verify.ts` and `lib/text/spans.ts`. Deterministic checks:
1. **Adapter result:** `ok: false` → incomplete, carrying the reason.
2. **Schema:** Zod-parse the output. Failure → incomplete.
3. **Coverage (structural only):** `paragraphs_covered` must equal every paragraph index. Otherwise → incomplete. Passing this check means no paragraph was skipped. It does **not** prove that every substantive claim was found, and no UI text may suggest an exhaustive review.
4. **Span location** (`locateQuote(original, quote, sentence)`): exact substring search first. If not found, a tolerant search that ignores only whitespace and quote-style differences, mapped back to **original** offsets. One match gives offsets. Several matches are disambiguated with `sentence`. Still ambiguous → `located: false`, so the item is kept without a highlight (AC2).
5. **Fabrication:** any **evidence** quote that can't be found at all is treated as fabricated. That retries the pass once, then → incomplete. An unlocatable **claim** quote keeps its claim, flagged unlocated.

#### Pass 2 — Judge
`lib/engine/judge.ts`. Model `WARRANTLAB_JUDGE_MODEL`. Input: the section id and guidance, the **full marked original text**, and the verified extraction (with located/unlocated flags). The prompt rules include:
- An overclaim needs a nameable inferential step beyond the supplied evidence. Emphatic wording alone is never enough.
- Separate the observed evidence, the inferential claim, and the missing warrant.
- Abstain (`cannot_assess`) when the evidence or methodological detail isn't in the text, including when it may be in another section.
- Never say a study didn't test something or is wrong. Only say the supplied text doesn't establish it.
- A randomised manipulation may support a causal effect of the condition, but not necessarily the mechanism.
- Qualitative or interpretive work isn't required to show causal identification.
- The judge may re-link evidence or quote new passages from the original. All quotes are verbatim.
- Write in English with Australian spelling and bounded phrasing.

Output (`JudgementSchema`):
- `assessments[]: {claim_id: string | null, new_quote: string | null, new_sentence: string | null, verdict: "overclaim"|"calibrated"|"cannot_assess"|"out_of_scope", category: "theoretical_overclaim"|"causal_overclaim"|null, evidence_quotes: string[], evidence_identified, claim_summary, what_claim_assumes, missing_warrant, why_it_matters, evidence_still_needed, questions_to_examine: string[], needs_other_section: boolean, basis_clarity: 1–3}`. Exactly one of `claim_id` or `new_quote` must be set. The schema uses nullable fields rather than a union, for compatibility with Gemini's schema subset. Zod enforces the rule.
- `all_claims_considered: boolean`

Pass 2's output then goes through **Verify** again: the adapter result, the schema, every claim id from Pass 1 assessed, the location of new quotes, and evidence quotes checked for fabrication (one retry, then incomplete). Overclaim text fields must be non-empty, or the assessment is invalid and the result is incomplete.

#### Aggregate
`lib/engine/aggregate.ts`. A pure function, and the main unit-test target:
- If any verification failed → `status: "incomplete"` (no outcome).
- If `causal_overclaim` is disabled (`WARRANTLAB_CAUSAL_ENABLED=false`), causal verdicts are treated as `out_of_scope`. They aren't shown and don't count.
- **Findings** are the `overclaim` assessments. Choose at most 3 by `basis_clarity`, ties broken by text position, then **display them in text order**. Set `limited = true` when more than 3 existed.
- **Unassessed** are the `cannot_assess` assessments. Give `count` only if every one has a located quote, otherwise `count: null`.
- **Outcome:**
  - At least one finding → `overclaim_detected`.
  - Otherwise, unassessed is not empty → `insufficient_evidence`.
  - Otherwise, all claims were considered and every in-scope one was assessed `calibrated` → `no_overclaim_identified`.
  - **No in-scope claims** (Pass 1 extracted no theoretical, causal, or interpretive claims, and Pass 2 added none) → `no_overclaim_identified` with `reason: "no_in_scope_claims"`. This is shown as a neutral notice, never as a success state (see **OutcomeNotice**). *(Learner-confirmed.)*
  - A substantive claim **without** assessable evidence is never "no claims". It goes to `cannot_assess`, giving `insufficient_evidence`. Empty input is a validation error (400) and never reaches the engine.

PRD ref: `prd.md > Analysis and the Three Outcomes`, `prd.md > Findings and the Warrant Check`, AC3–AC5, AC13, AC14, AC16.

#### Section Guidance
`lib/sections.ts`. For each of the 8 sections: `id`, `label`, `priority` (P0/P1), `supported` (a boolean **set by hand only after the gate passes**, with a link to the eval report in a comment), `devPreview` (a boolean letting the section be selected locally when `WARRANTLAB_DEV_PREVIEW=true`, labelled "Development preview — not yet validated", and never in a release build), and `guidance` (2–4 sentences on the argumentative function and appropriate evidence, from the PRD table). The same guidance is fed into both passes. Initially only `discussion` is `supported: true` once TC1–TC3 pass.
PRD ref: `prd.md > Section Selector and Availability`, `prd.md > Section Validation Gate`.

### Evaluation Harness
`eval/`. Implements `prd.md > Golden Test Cases`, `prd.md > Section Validation Gate`, and the learner's **Epistemic Reliability Tests**.
- **Fixtures** (`eval/fixtures/<section>/*.json`): `{id, section, text, expect: {outcome, finding_quotes?, category?, forbid_finding_on?: string[]}, synthetic: true}`. All are fictional and labelled synthetic.
- **Runner** (`eval/run.ts`): calls `analyse()` directly (not over HTTP) `--runs N` times per fixture, spacing calls by `--delay-ms`. It writes `eval/reports/<timestamp>-<section>.md` with pass/fail per check, the model used, and request counts. **If a run stops on quota (429), the report marks that fixture "not run (quota)"**, never as passed. A section can't pass the gate with any "not run" entry.
- **Checks** (`eval/checks.ts`):
  1. **Outcome match** with the expected outcome.
  2. **Exact span:** expected quotes are highlighted at the correct offsets.
  3. **No fabrication:** every number or statistic token in the diagnostics (e.g. `p = .01`, `r = .32`, `n = 120`) appears in the input, and every quote is located.
  4. **Strong wording ≠ overclaim:** TC3 and a "strongly worded but calibrated" variant must not produce `overclaim_detected`.
  5. **No "untested" assertions:** the diagnostic text must not match banned phrases ("was not tested", "never tested", "did not test", "is invalid", "disproven", "your study is wrong", "fails to").
  6. **Irrelevant-edit stability:** fixture variants that change only wording unrelated to any claim produce the same outcome and the same highlighted claims.
  7. **Repeat consistency:** across N runs of the same input, the outcome and highlighted claim spans are identical. The report shows the agreement rate.
  8. **Revision pair:** TC1 → `overclaim_detected` and TC2 → `no_overclaim_identified`.
  9. **Cross-paragraph evidence:** evidence in paragraph 1 and a calibrated claim in paragraph 3 must **not** produce `insufficient_evidence`.
  10. **No claims ≠ no evidence:** a purely descriptive passage (TC4) → `no_overclaim_identified` with `reason: "no_in_scope_claims"`, while a claim with no evidence (TC3) → `insufficient_evidence`.
  11. **Incomplete processing:** unit-level tests with mocked adapter results (truncated, blocked, quota, malformed) give `incomplete`.
- **Gate rule:** a section is marked `supported` only when its overclaim, calibrated, and insufficient fixtures each pass checks 1–5 and 7 in **3 of 3** runs, with no "not run" entries. TC4 (no claims) is also run for Discussion.
- **Model provenance:** every report records the model id used for each pass. A model change re-opens the gate.
- **Quota budget:** the Discussion gate is 3 fixtures × 3 runs × 2 passes, which is about 18 requests plus retries. The extra checks (6, 8, 9) add roughly the same again. Plan eval sessions around the daily limit found in AI Studio.
- **Optional (if time and quota allow):** `--single-pass` runs the same fixtures through one combined prompt as a baseline, to compare false positives and missed evidence with the two-pass design.

## Data Model
`lib/types.ts`. Everything is in memory. Nothing is persisted by the app.

| Data | Where it lives | How it updates | Leave and return |
|---|---|---|---|
| `text` | React state in `Workspace` | Typing or pasting | Lost when the tab closes. No app storage of any kind. |
| `section` | React state | The selector | Reset to Discussion |
| `result: AnalysisResponse` | React state | Set by a matching response, cleared on any edit or section change | Lost |
| `analysisKey` | React state | `section + ":" + sha256(text)` computed when Analyse is pressed | Lost |
| Model I/O | Server memory during one request | — | Discarded by the app. **Google's Free Tier terms apply to what's sent**, and content may be used to improve its products. |
| Section support flags | `lib/sections.ts` (code) | Edited by hand after the gate passes | — |
| Eval reports | `eval/reports/*.md` (fictional fixtures only) | `npm run eval` | Committed as evidence |

```ts
type Outcome = "overclaim_detected" | "no_overclaim_identified" | "insufficient_evidence";
type IncompleteReason = "quota" | "blocked" | "truncated" | "model_error" | "timeout"
  | "invalid_output" | "fabricated_span" | "coverage";
type AnalysisResponse =
  | { status: "complete"; outcome: Outcome; findings: Finding[]; limited: boolean;
      unassessed: { count: number | null; items: UnassessedClaim[] }; reason?: "no_in_scope_claims" }
  | { status: "incomplete"; reason: IncompleteReason };
interface Span { start: number; end: number }                 // offsets into the original text
interface Finding { id: string; category: "theoretical_overclaim" | "causal_overclaim";
  claimSpan: Span | null; claimQuote: string; evidenceSpans: Span[];
  evidenceIdentified: string; missingWarrant: string; claimSummary: string;
  whatClaimAssumes: string; whyItMatters: string; evidenceStillNeeded: string;
  questionsToExamine: string[]; verificationStatus: string }
interface UnassessedClaim { quote: string; span: Span | null; needsOtherSection: boolean }
```

The user sees one neutral "Analysis incomplete" message. The only user-facing variant is the quota hint.

## File Structure

```
clear-writing-basics/
├── app/
│   ├── layout.tsx            # fonts (Source Serif 4, Inter), metadata, <html lang="en-AU">
│   ├── page.tsx              # server component: passes maxWords + section flags to <Workspace/>
│   ├── globals.css           # colour/typography tokens, base styles
│   └── api/analyse/route.ts  # POST: validate → analyse() → JSON (no text in logs)
├── components/
│   ├── Workspace.tsx         # all UI state, stale-response guard
│   ├── SectionSelector.tsx
│   ├── ManuscriptEditor.tsx
│   ├── AnnotatedText.tsx     # original text split at verified offsets
│   ├── DiagnosticPanel.tsx   # OutcomeNotice, FindingCard, UnassessedSummary, PanelFooter + disclosure
│   └── *.module.css
├── lib/
│   ├── config.ts             # env-driven models, word limit, causal flag
│   ├── sections.ts           # 8 sections: priority, supported flag, guidance
│   ├── types.ts
│   ├── text/
│   │   ├── wordCount.ts      # shared by client and server
│   │   ├── paragraphs.ts     # split + [Pn] markers + offsets
│   │   └── spans.ts          # locateQuote: exact → tolerant → disambiguate
│   └── engine/
│       ├── llm.ts            # provider-neutral generateStructured() contract
│       ├── gemini.ts         # the only provider-specific file (@google/genai)
│       ├── prompts.ts        # extract + judge system prompts
│       ├── schemas.ts        # Zod + JSON schemas for both passes
│       ├── extract.ts        # Pass 1
│       ├── judge.ts          # Pass 2
│       ├── verify.ts         # adapter result, schema, coverage, spans, fabrication
│       ├── aggregate.ts      # outcome rules, finding limit, unassessed summary
│       └── analyse.ts        # orchestrator, one retry per pass on fabrication
├── eval/
│   ├── fixtures/discussion/  # TC1–TC3, multi-paragraph, cross-paragraph, perturbations
│   ├── fixtures/results/     # written before Results can pass the gate
│   ├── fixtures/introduction/
│   ├── checks.ts             # Epistemic Reliability checks
│   ├── run.ts                # npm run eval (with --runs, --delay-ms, --single-pass)
│   └── reports/              # dated markdown reports (fictional text only)
├── tests/                    # Vitest: spans, paragraphs, wordCount, verify, aggregate (mocked adapter)
├── .env.example
├── .gitignore                # already ignores .env*, learner profile
├── package.json              # dev, build, test, eval scripts
├── README.md                 # what it is, run steps, free-tier privacy note, limits
└── devpost/                  # planning docs (scope, prd, spec, sources)
```

## External Services and Dependencies

### Gemini API (Free Tier)
- **Access:** the `@google/genai` SDK, server-side only. Auth comes from `GEMINI_API_KEY`, created in Google AI Studio for a project **without billing**.
- **Pass 1 request:** model `WARRANTLAB_EXTRACT_MODEL`, a system instruction (extract rules), one user content part (section, guidance, marked text), `temperature: 0`, JSON response with the Extraction schema, and a generous output-token limit.
- **Pass 2 request:** model `WARRANTLAB_JUDGE_MODEL`, the same pattern with the Judgement schema, and the full marked text plus the verified extraction.
- **Response handling:** check the finish reason and block status before reading the text. Parse the JSON, then Zod-validate. The adapter maps errors to incomplete reasons.
- **Timeout:** about 90 s per call. An overall timeout → incomplete.
- **Cost:** $0 within the Free Tier. Over the quota, requests are rejected (429), not billed, as long as billing stays off.
- **Rate limits:** per project and per model. **Read the current numbers in AI Studio before the first eval run**, and set `--delay-ms` to match.
- **Data use (verified by the learner):** Google says free-tier inputs and outputs may be read by human reviewers and used to improve its products. Hence the disclosure, fictional demo text only, and no confidential manuscripts.
- Docs: https://ai.google.dev/gemini-api/docs · Models and limits: https://ai.google.dev/gemini-api/docs/models

### Vercel (optional)
Hobby plan ($0, personal and non-commercial), only with Deployment Protection enabled or not deployed at all. The env vars are set in the project settings. https://vercel.com/docs

## Important Failure Modes

- **Free quota used up (429)** → "Analysis incomplete" plus "The free analysis quota may be temporarily used up. Please try again later." The text is kept. There's no automatic retry, which would burn more quota. In eval, the fixture is reported "not run (quota)".
- **The model is slow (two passes, perhaps 10–40 s)** → an *Analysing…* state that explains the two-step check. The button stays disabled. Past the timeout → "Analysis incomplete" with Try again, and the text is kept.
- **The model invents or garbles a quote, skips paragraphs, truncates, or is blocked by safety filters** → deterministic Verify catches it. One retry for fabricated evidence, otherwise "Analysis incomplete". It never degrades into a clean outcome.
- **A highlight can't be located unambiguously** → the finding is shown without a mark, with the note "Location could not be marked in the text."
- **The API key is missing or invalid** → the route returns incomplete (`model_error`). The server console prints a configuration hint without any manuscript content.
- **The user edits or changes section mid-analysis** → the request is aborted and any late response is dropped by the `analysisKey` check.

## What Was Simplified and Why

- **Free-tier Gemini** instead of a paid frontier model. That meets the $0 constraint. The fuller version would compare Claude, OpenAI, and Gemini on the same eval through the adapter, with paid, retention-controlled access for real manuscripts.
- **One model for both passes** to start. It keeps quota use predictable, and a separate Judge model is a one-line env change if the eval shows it's needed.
- **No chunking** instead of 400–600-word chunks. 3,000 words fits in one request, and chunking would cut claims off from evidence in other paragraphs.
- **Section support flags are edited by hand** rather than set automatically from eval results. That's simpler and auditable.
- **Protected or local-only deployment** instead of building rate limiting and abuse controls.
- **Banned-phrase and fabrication checks run in the eval harness**, plus the runtime span and fabrication verification, rather than a runtime content filter on the model's prose.
- **No runtime IS grounding:** `devpost/sources/is-source-seed.csv` stays as documentation until verified methodological notes exist.
- **Causal overclaim is behind a flag (off)** until the Causal Development Check passes.

## Decisions and Open Issues

**Learner decisions (this spec):**
- **Zero additional paid services.** Gemini API Free Tier for inference, subject to eligibility, quota, and the reliability tests. No billing, top-ups, or paid fallbacks. The integration stays replaceable. Fictional excerpts for the demo, and no confidential manuscripts sent to the free API.
- Next.js + TypeScript + Zod. All model calls are server-side and credentials live in env vars.
- Local-first. Vercel Hobby is optional and only behind protection.
- Two passes with no default chunking. **Pass 2 gets the full original text** and may re-link or add evidence. Every new span is re-verified.
- Any failure, truncation, block, quota error, or incomplete coverage → `analysis_incomplete`.
- Aggregation follows the four-row rule above. Unassessed claims stay visible and neutral, with counts only when supported by verified extraction.
- No section passes the gate without the full set of real-model runs. Quota-limited "not run" never counts as a pass.
- The earlier Anthropic research (Opus 5.5 as Judge, effort tuning, 30-day retention) is **superseded** for the hackathon build. The adapter keeps it available as a later comparison.

**PRD amendment required by this decision:** `prd.md > Privacy of Unpublished Work` changes its disclosure from a generic "AI provider" to the free-tier wording in **Components > Privacy Disclosure**, and adds that real unpublished work should not be pasted into the demonstration. Without this, the built app would understate how the text may be used.

**Implementation details derived by the agent** (changeable): `temperature: 0`, Vitest, tsx, CSS Modules, Inter over IBM Plex Sans, `[Pn]` paragraph markers, tolerant span matching limited to whitespace and quote style, one retry on fabricated evidence and none on 429, nullable `claim_id`/`new_quote` instead of a union, and `basis_clarity` used for selecting findings.

**Learner-confirmed at review:** no in-scope claims → `no_overclaim_identified` with `reason: "no_in_scope_claims"`, shown neutrally. Model-reported coverage is a structural check only. Human review is named in the disclosure. `gemini-3.8-flash` is the manual alternative if 2.5 is inaccessible.

**One useful unknown:** whether the two-pass design actually reasons better than a single pass, or only makes results more traceable. With a free Flash-class model, there's a second question: **is it good enough at academic inference at all?** **Agreed investigation:** keep two passes as the default. Run the Discussion gate first. If quota allows, run the same fixtures with `--single-pass` and compare false positives, missed cross-paragraph evidence, and latency in the eval report. If the free model fails the gate, Discussion stays unsupported and the demo says so honestly. Nothing is faked.

**Open issues:**
1. Fixtures still to write before their gates: multi-paragraph (two overclaims), cross-paragraph evidence, irrelevant-edit and strong-wording variants, and Results and Introduction sets. *Doesn't block approval.*
2. **First build step:** in AI Studio, confirm the project can call `gemini-2.5-flash` (else `gemini-3.8-flash`) and read its rate limits. In the live SDK and docs, confirm the current structured-output syntax (`responseFormat` vs the deprecated `responseSchema`).
3. **Quota risk during recording:** run the demo flow once shortly before recording, and keep a spare day of quota.
4. Git isn't initialised yet. `5-build` sets up the repository and checks that `.gitignore` covers `.env.local` and the learner profile before the first commit.
