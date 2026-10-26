---
doc: checklist
status: approved
---

# Build Checklist

Build mode: fast. Learner checkpoints after slice 2 and before final submission. Automated tests run at every slice.

## Slices

- [x] **1. A real Gemini call returns schema-valid JSON from this project**
  Becomes usable: `npm run check:model` sends one small structured request through the WarrantLab adapter and prints the model id, finish reason, latency and the parsed JSON. The Next.js app starts locally (an empty workspace shell).
  Why now: The riskiest unknown is external. If the AI Studio project can't reach `gemini-2.5-flash` (or `gemini-3.8-flash`), or the structured-output syntax differs from the docs, every later slice is built on sand. This is the allowed single-layer exception, because it proves a critical risk and leaves a runnable script as evidence. Bootstrapping (git, Next.js, TypeScript, Zod, Vitest, env files) rides along.
  PRD ref: `prd.md > Privacy of Unpublished Work` (server-side key, no text in logs)
  Spec ref: `spec.md > Stack`, `spec.md > Where It Runs and How Someone Tries It`, `spec.md > Components > Claim–Evidence Alignment Engine > LLM Adapter`, `spec.md > External Services and Dependencies > Gemini API (Free Tier)`
  Build: Initialise git (with consent) and confirm `.gitignore`. Scaffold Next.js (App Router, TypeScript strict) in the project root without overwriting `devpost/` or curriculum folders. Add Zod, `@google/genai`, Vitest and tsx, and create `.env.example`. Write `lib/config.ts`, `lib/engine/llm.ts` and `lib/engine/gemini.ts` using the structured-output syntax confirmed from the live SDK and docs (`responseFormat` vs `responseSchema`), with `temperature: 0`, finish-reason mapping, 429 → `quota`, and no retry on 429. Add `scripts/check-model.ts` and the `check:model` script. Add Vitest tests for the adapter's error and finish-reason mapping, using mocks.
  Verify (mechanical): `npm test` passes the adapter mapping tests. `npm run check:model` against the learner's key returns `ok: true` with schema-valid JSON and records which model worked. If 2.5 is refused, retry with `gemini-3.8-flash` and record it. `npm run build` succeeds. `git status` shows no `.env.local` or learner profile staged.
  Learner check: Create a key in Google AI Studio (project without billing), put it in `.env.local`, run `npm run check:model`, and tell me which model answered and roughly how long it took.
  Commit: `Scaffold WarrantLab and prove Gemini structured output`

- [x] **2. Paste TC1 into the workspace and see the overclaim highlighted with a Warrant Check**
  Becomes usable: In the browser, with Discussion selected, pasting TC1 and pressing **Analyse Argument** runs the real two-pass engine. The exact claim span is highlighted in amber in a read-only view, and a finding card shows Evidence identified → Missing warrant → Claim, plus what the claim assumes, why it matters, the verification status and the expandable sections.
  Why now: This is the kernel. Everything distinctive about WarrantLab is the claim–evidence diagnosis with exact, verified spans, so it comes immediately after the risk is cleared, in the agreed look and feel rather than framework defaults.
  PRD ref: `prd.md > The Core Journey` (steps 1–6), `prd.md > Findings and the Warrant Check`, `prd.md > Golden Test Cases` (TC1), AC1, AC2, AC3, AC6, AC13
  Spec ref: `spec.md > Components` (Workspace, ManuscriptEditor, AnnotatedText, DiagnosticPanel, Analysis Route, Claim–Evidence Alignment Engine: Prepare, Pass 1 — Extract, Verify, Pass 2 — Judge, Aggregate, Section Guidance), `spec.md > Data Model`, `spec.md > Look and Feel`
  Build: Write `lib/text/` (wordCount, paragraphs with `[Pn]` markers, spans with exact → tolerant → sentence-disambiguated location). Write `lib/engine/` (schemas, prompts, extract, verify, judge, aggregate, analyse) and `lib/sections.ts` with **separate `devPreview` and `supported` flags**. Discussion is `devPreview: true, supported: false`. A section is selectable when it's `supported`, or when it's `devPreview` and `WARRANTLAB_DEV_PREVIEW=true` (local only). The panel then shows "Development preview — not yet validated". A release build never advertises an unvalidated section. Add `app/api/analyse/route.ts` with Zod validation and logging that contains no text. Build the workspace UI (two columns 58/42, tokens, Source Serif 4 and Inter, annotated text with `<mark>`, finding card, finding ↔ highlight linking). Add Vitest tests for spans, paragraphs, wordCount, verify and aggregate (overclaim path), using mocked adapter output.
  Verify (mechanical): `npm test` passes. `npm run build` succeeds. With the dev server running, a `curl` POST of TC1 to `/api/analyse` returns `status: complete`, `outcome: overclaim_detected`, and a finding whose `claimSpan` slices the original text to exactly `prove that violations of contextual integrity are the mechanism driving privacy concerns`. Server logs contain no TC1 text.
  Learner check: Run `npm run dev`, open http://localhost:3000, paste TC1, press Analyse Argument, and read the finding. Does the Warrant Check say something a supervisor would recognise as the real problem, and does anything in the wording feel wrong or too strong?
  Commit: `Detect theoretical overclaims with verified Warrant Checks`

- [ ] **3. All four outcomes behave correctly, including the neutral ones and failures**
  Becomes usable: TC2 shows a neutral "no claim–evidence mismatch" confirmation. TC3 shows a neutral insufficient-evidence notice with what to examine. TC4 shows "No in-scope claims identified" with no success styling. Claims that can't be assessed appear in a neutral summary alongside findings. Any model failure, quota error, truncation, fabricated quote or coverage gap shows "Analysis incomplete" with Try again (and the quota hint where relevant). Multi-paragraph text shows up to 3 findings in text order with the "not an exhaustive review" note.
  Why now: The product's credibility depends on *not* warning. A tool that cries wolf on TC2 fails the learner's most important criterion. Building these right after the kernel stops the prompts from being tuned only for detection.
  PRD ref: `prd.md > Analysis and the Three Outcomes`, `prd.md > Golden Test Cases` (TC2, TC3, TC4, multi-paragraph case), `prd.md > States and Boundaries`, AC4, AC5, AC14, AC16, AC19
  Spec ref: `spec.md > Components > Claim–Evidence Alignment Engine > Aggregate`, `spec.md > Components > DiagnosticPanel`, `spec.md > Components > Claim–Evidence Alignment Engine > Verify`, `spec.md > Important Failure Modes`
  Build: Complete the aggregation rules (no in-scope claims, unassessed counts only when every quote is located, `basis_clarity` selection, `limited` flag, causal treated as out of scope while the flag is off). Add `OutcomeNotice` variants and `UnassessedSummary`. Add one retry on fabricated evidence and the full incomplete-reason mapping. Tune the prompts against TC1–TC4 and write the multi-paragraph fixture. Extend the Vitest tests for every aggregation branch and for mocked truncated, blocked, quota and malformed adapter results.
  Verify (mechanical): `npm test` passes all aggregation and incomplete-path tests. `curl` POSTs of TC2, TC3 and TC4 return `no_overclaim_identified`, `insufficient_evidence` and `no_overclaim_identified` with `reason: "no_in_scope_claims"` respectively. TC1 still returns its exact span. Run each once.
  Learner check: Paste TC2, TC3 and TC4 one after another. Do the three neutral states feel clearly different from each other and from a warning, without implying the research is verified?
  Commit: `Add neutral outcomes, unassessed summary and incomplete handling`

- [ ] **4. Edit, revise and re-analyse: the full revision loop and input guards**
  Becomes usable: **Edit text** returns the original text unchanged. Editing or changing the section clears stale results and keeps the text. A late response from an aborted request is never shown. TC1 revised into TC2 moves from overclaim to no overclaim. Empty input is blocked, input over the word limit shows a message and is never truncated, the section selector shows the other 7 sections as *In development*, and the empty state shows the free-tier privacy disclosure and scope limits.
  Why now: The revision moment is the core demo beat and AC18. It depends on slices 2–3 being trustworthy, and it finishes the whole PRD journey before evaluation starts.
  PRD ref: `prd.md > Annotated View and Revision Loop`, `prd.md > Section Selector and Availability`, `prd.md > Text Input and Limits`, `prd.md > Privacy of Unpublished Work`, `prd.md > Scope Transparency and Disciplinary Grounding`, AC7, AC8, AC15, AC17, AC18, AC20
  Spec ref: `spec.md > Components > Workspace`, `spec.md > Components > SectionSelector`, `spec.md > Components > ManuscriptEditor`, `spec.md > Components > Privacy Disclosure`, `spec.md > Data Model`
  Build: Add the Workspace state machine (`analysisKey`, AbortController, stale-response drop, clearing on edit or section change), the Edit text flow, `page.tsx` passing `maxWords` and the section flags, the SectionSelector with disabled entries, the word count with over-limit blocking (shared `countWords` on both sides), the PanelFooter disclosure, and keyboard focus and `prefers-reduced-motion`. Confirm nothing touches `localStorage` or `sessionStorage`.
  Verify (mechanical): `npm test` passes, including a unit test for the stale-key guard logic. In the browser pane: TC1 → overclaim, Edit text shows identical text, revise to TC2 → no overclaim. The section selector is disabled while analysing, and editing the text mid-analysis shows no stale result. Text over the limit is blocked with the text kept. Unsupported sections are disabled. `grep` finds no `localStorage` or `sessionStorage` in `app/`, `components/` or `lib/`.
  Learner check: Do the demo flow yourself: TC1, read the finding, Edit text, rewrite the claim in your own words, re-analyse. Then try to break it: edit the text while it's analysing, paste a very long passage, clear the box.
  Commit: `Complete edit and re-analyse loop with input guards`

- [ ] **5. Discussion passes the validation gate on repeated real-model runs**
  Becomes usable: `npm run eval -- --section discussion --runs 3` produces a dated report in `eval/reports/` showing all Epistemic Reliability checks per fixture, the model ids used, and an agreement rate. Discussion is marked `supported` in `lib/sections.ts` only if the gate passes, with the report linked. Otherwise it stays *In development* and the gap is recorded honestly.
  Why now: Until this runs, "it worked once" is all we know. The gate is what entitles the demo to say Discussion is supported. It needs the complete flow (slices 2–4), and running it before polish means any prompt fixes happen while there's time.
  PRD ref: `prd.md > Section Validation Gate`, `prd.md > Golden Test Cases` (including the causal development check), `prd.md > Acceptance Criteria`
  Spec ref: `spec.md > Components > Evaluation Harness`, `spec.md > Components > Claim–Evidence Alignment Engine > Section Guidance`
  Build: Write the fixtures in `eval/fixtures/discussion/` (TC1–TC4, multi-paragraph, cross-paragraph evidence, strong-wording calibrated variant, irrelevant-edit variants, revision pair, causal development check), all marked synthetic. Write `eval/checks.ts` with checks 1–11 and `eval/run.ts` with `--runs`, `--delay-ms`, "not run (quota)" handling, model provenance and an optional `--single-pass`. Fix prompts or verification where the checks fail, then re-run. If the two-pass engine can't pass, run the same fixtures with `--single-pass` and adopt it only if it passes the same accuracy requirements, recording both results honestly. Set `supported: true` for Discussion only from a passing report. Decide the causal flag from its check.
  Verify (mechanical): The eval report exists and shows TC1–TC3 passing checks 1–5 and 7 in 3/3 runs, with no "not run" entries, before the flag is set to `supported`. TC4 and the cross-paragraph fixture pass. `npm test` and `npm run build` still pass.
  Learner check: Open the newest file in `eval/reports/` and read it. Do the fixtures I wrote test what you meant? Do you accept the result as the evidence behind "Discussion supported"?
  Commit: `Add epistemic reliability eval and gate Discussion`

- [ ] **6. Demo-ready polish, responsiveness and README**
  Becomes usable: The workspace looks finished on desktop and mobile (stacked layout, legible highlights, visible focus states, status text as well as colour). The analysing state explains the two-step check. The README explains what WarrantLab is, how to run it, the free-tier privacy note, the limits and how to run the eval.
  Why now: Design and presentation are half of the judging criteria, but polish is only worth doing on behaviour that has passed the gate.
  PRD ref: `prd.md > Look and Feel`, `prd.md > Screens and Layout`, `prd.md > Demo Script`
  Spec ref: `spec.md > Look and Feel`, `spec.md > Where It Runs and How Someone Tries It`
  Build: Refine the CSS tokens and spacing, mobile stacking below about 768px, the highlight contrast in both colour schemes if supported, loading copy and empty-state copy (Australian spelling). Write `README.md`. Do a final pass for any stray framework default styling.
  Verify (mechanical): `npm run build` and `npm test` pass. Screenshots in the browser pane at desktop width and at 375px show no horizontal overflow and the agreed palette and fonts. A `grep` for common US spellings ("analyze", "behavior", "color" in UI copy) finds none in user-facing strings.
  Learner check: Run through the demo script as if recording. Does it feel like a serious research tool rather than a generic AI app, and is anything distracting?
  Commit: `Polish workspace for demo and document setup`

- [ ] **7. Results and Introduction pass the gate (if quota and time allow)**
  Becomes usable: Results / Findings and Introduction become selectable, each with its own section guidance and passing gate report. Any section that doesn't pass stays *In development*.
  Why now: These are the P0 sections after Discussion, but only after the full Discussion journey is demo-ready. Last, because a missed deadline here costs nothing the demo depends on.
  PRD ref: `prd.md > Section Selector and Availability`, `prd.md > Section Validation Gate`
  Spec ref: `spec.md > Components > Claim–Evidence Alignment Engine > Section Guidance`, `spec.md > Components > Evaluation Harness`
  Build: Write the fixtures in `eval/fixtures/results/` and `eval/fixtures/introduction/` (overclaim, calibrated and insufficient, synthetic, with expected outcomes approved by the learner). Refine the section guidance. Run the gate for each and set the flags only from passing reports.
  Verify (mechanical): Each enabled section has a report showing 3/3 passes on its three fixtures with no "not run" entries. Discussion results are unchanged (re-run TC1–TC3 once). `npm test` and `npm run build` pass.
  Learner check: Select Results, paste its overclaim fixture, and say whether the explanation fits how Results claims should be judged rather than reading like a copy of the Discussion feedback.
  Commit: `Enable gated Results and Introduction analysis`

## Hands-on Checkpoints

- [x] Early usable behavior explored — after slice 2 (the first real Warrant Check on TC1: feedback on diagnostic wording and layout while prompts and UI can still change)
  Outcome: learner accepted slice 2 for continued development (not release validation) based on the agent's report; they hadn't yet viewed the running app. They confirmed `gemini-3-flash-preview` for both passes, fixed during evaluation. Academic refinement requested: Contextual Integrity concerns flows relative to contextual informational norms, so diagnostics must name the missing inferential connection without imposing a method (no default requirement for perceived-violation measures or mediation tests). Also requested: an extra theoretical-overclaim fixture that isn't a TC1 paraphrase, and measured TC1 → TC2 demo latency.
- [ ] Submission readiness — after slice 5: public repo, demo video and draft Devpost submission prepared early (deadline 27 Oct 2026, 8:00 AM AEDT), then slices 6–7 continue only if time allows
- [ ] Final kick-the-tires exploration and feedback completed — before final submission: end-to-end app, eval results and demo

## Final Review

- [ ] Final review complete — feedback resolved and learner confirms ready to ship

## Code Tour and App Map

- [ ] Learning activity complete — guided route, focused alternative, prior practice connected, or brief recap
- [ ] Optional edit and transfer reflection addressed — offered/declined/already covered/not applicable as appropriate
- [ ] `devpost/app-map.html` generated from finished code, checked, and shown, including a project-grounded practice to reuse

Activity and evidence: 
Route and stops: 
Edit outcome: 
Reflection: 
Activity mode: 

## Revisions

- Separate `devPreview` and `supported` flags per section — local testing in slice 2 needs Discussion selectable before the gate, but the release must not advertise unvalidated sections.
- Structured output uses `responseMimeType: "application/json"` with `responseJsonSchema` (plus `temperature: 0` and a fixed `seed`) — the installed `@google/genai` 2.31.0 types show that `responseFormat` exists only on the lower-level `GenerationConfig`, not on the `GenerateContentConfig` that `models.generateContent` accepts. `responseJsonSchema` takes a JSON Schema subset, so the Zod schemas convert directly (minus `$schema`).
- Provisional model `gemini-3-flash-preview` for both passes (pending learner confirmation) — on 26 Oct 2026 the new AI Studio project got 404 for `gemini-2.5-flash` (it's listed by the API but not accessible) and repeated 503/504 for `gemini-3.8-flash`, `gemini-3.7-flash`, `gemini-3.5-flash` and `gemini-flash-latest`, even on a one-word prompt. `gemini-3-flash-preview` returned schema-valid structured JSON with verbatim quotes in about 2.5 s, and `gemini-3.1-flash-lite` did too but took about 44 s. Billing stays off, so cost remains $0. The model change re-opens the gate as agreed.
- Extract moved to `gemini-3.1-flash-lite` and Judge kept on `gemini-3-flash-preview` (learner decision; provisional until the gate passes) — the free tier for `gemini-3-flash-preview` is 20 requests a day per project per model (`GenerateRequestsPerDayPerProjectPerModel-FreeTier`), and a two-pass run spends 2. With the next reset at 00:00 PT (about 18:00 Melbourne) as the last one before the deadline, a single model couldn't cover the gate plus the demo. Judge budget: at most about 13 requests for evaluation and at least 6 reserved for recording and final checks. Earlier single-model TC1 passes don't count for this configuration.
- Multi-paragraph run hit `MAX_TOKENS` at 16k output (Gemini 3 thinking counts against it) — candidate fix of a 32k output cap plus `thinkingLevel: low` for Extract only. Not verified until the real-model test passes.
- Extract validated on its own with Flash-Lite (5 Extract requests, 0 Judge). It responds in 3–6 s, stays schema-valid, covers every paragraph and quotes verbatim, finds both multi-paragraph claims exactly, and links cross-paragraph evidence. It did **not** link P1 evidence to the P3 claims in the multi-paragraph case; the Judge, which sees the full text, has to cover that. The prompt was clarified to keep the asserting verb ("confirms that …") and treat result-only sentences as evidence, and a re-check on TAM then gave the expected span. Non-PRD fixtures now list acceptable span boundaries for the same claim, while TC1 keeps the PRD's fixed span.
- The section selector is disabled while an analysis runs, and PRD AC7 and the spec failure modes were updated to match (learner-accepted) — the original criterion assumed the section could change mid-analysis. What was actually tested: the selector is disabled while analysing (browser), and a text edit mid-analysis drops the late response (browser, stubbed API). A section-mismatch drop is covered only by the `isCurrent` unit test. "Section change mid-analysis" was **not** tested as a user action, because the UI prevents it.
- Confirmed quotas (AI Studio Rate Limit, project "Writing environment", Free tier, no billing): the Judge `gemini-3-flash-preview` allows 5 RPM, 250K TPM and 20 RPD (21/20 used on 26 Oct). The Extract `gemini-3.1-flash-lite` allows 15 RPM, 250K TPM and **500 RPD**. Only Judge quota is scarce, so Extract-only validation can run on every fixture. The eval runner now spaces calls 13 s apart by default to stay under 5 RPM.
- Extract-only validation on the other six fixtures (Flash-Lite, no Judge quota) — TC1 and the irrelevant-edit variant give the exact span, TC4 gives 0 claims and 0 evidence, the TC2 and strong-wording claims link to their evidence, and the causal check gives the expected span. Latency is mostly 1.5–8 s, with outliers at 44 s and 90 s. So Extract now uses a 30 s timeout with one retry on timeout (a forced 50 ms timeout confirmed the SDK's `AbortError` is classified as `timeout` and retried). Judge keeps 90 s with no retry, to protect quota.
- 429s are now split into `quota` (daily, `…PerDay…` quota id) and `rate_limited` (per-minute). Neither is retried automatically. Both are "not run" in eval, and each has its own UI hint. Final Judge budget (learner-confirmed): 9 for the gate, 2 for TC4 and cross-paragraph, 6 for the demo recording, and 3 in reserve, run sequentially and 13 s apart. The 21/20 figure in AI Studio is a 28-day peak, not today's count.
- Judge quota plan after the 18:00 reset (learner-revised priority): (1) the gate, TC1–TC3 × 3 runs (9 requests); (2) TC4 and cross-paragraph × 1 (2); (3) the remainder reserved for recording and error handling. TAM and multi-paragraph run only if the confirmed quota leaves room after the reserve, so the multi-paragraph `MAX_TOKENS` fix may stay unverified and has to be reported that way. Cross-paragraph, strong-wording, irrelevant-edit and causal fixtures passed only under the earlier single-model setup and are reported as not re-run on the split configuration.
- Implemented code is now committed separately from validated code (learner instruction). Slices 3–4 are implemented and committed after unit, build and browser (stubbed API) checks, but their boxes stay **unchecked** until the real-model checks pass: TC2, TC3 and TC4 outcomes for slice 3, and a real TC1 → Edit text → TC2 loop with measured latency for slice 4. Discussion stays `supported: false` until slice 5's gate passes.
- Slices 1 and 2 were coded together while waiting for the API key — commits stay separate. Slice 1's commit stages a minimal page shell so it builds on its own, and slice 2 replaces it.
- Submission readiness moved ahead of slices 6–7 — the deadline is about 19 hours away (27 Oct 2026, 8:00 AM AEDT), so the public repo, video and draft submission come as soon as the core flow passes the gate. Slices 6–7 are improvements made only if time remains.

