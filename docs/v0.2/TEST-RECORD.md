# WarrantLab V0.2 — technical test record

All model runs use **synthetic** text written for testing. No real manuscripts are used. Model: `gemini-3.1-flash-lite` (free tier) for both passes.

## Slice A — 27 Oct 2026 (AEDT)

| Check | Command or method | Result |
|---|---|---|
| Type check | `npx tsc --noEmit` | Pass |
| Unit and integration tests | `npx vitest run` | **58 passed** (43 existing, 15 new in `tests/v2.test.ts`) |
| Production build | `npm run build` | Pass. Routes: `/`, `/api/analyse` (v0.1, unchanged), `/api/v2/analyse` |
| Real end-to-end request (v2) | Dev server, browser: synthetic Results (team-level lottery allocation, d = 0.45), synthetic Discussion with a mechanism overclaim, Assignment context filled | `complete`, `overclaim_detected`. The highlight matched the claim text exactly. Extract 3.9 s, Judge 5.4 s, total 9.2 s |
| Stale result after an edit | Edited the Assignment context field after the result appeared | Finding and highlight cleared; the Discussion returned to the editor |
| Stale in-flight response | Started an analysis, then edited Results before the response arrived | No result shown after completion; not stuck in the busy state |
| Mode switching | Switched to Single passage and back | The v0.1 editor appears; v2 texts are kept |
| Mobile layout | 375 × 812 emulation | No horizontal overflow; editors stack |
| Logging | Dev-server log for the v2 request | Metadata only: word counts, the context field *name* `assignment`, status, stage, timings. No text |

**What the new tests cover** (`tests/v2.test.ts`)
- The contract: exact text preservation through JSON; strictness; per-field limits; Discussion required; a combined word limit.
- Staleness: each source and each context field; superseded tokens; invalidation.
- The handler, with a scripted model:
  - exact Discussion spans;
  - Results and context are **not** sent to the model;
  - quota failures map to `incomplete`;
  - invalid input is rejected without a model call;
  - the endpoint is disabled when the flag is off;
  - logs contain no text.

**Not covered**
- No browser-automation test suite. The UI checks above were done manually in the in-app browser.
- The v0.1 single-passage flow was not re-run against the live model in this slice. Its route and engine are unchanged, and its existing tests pass.

## Slice B — 27 Oct 2026 (AEDT)

**Model configuration.** `gemini-3.1-flash-lite` (free tier, no billing) for both Locate (thinking level low, 45 s timeout, up to 3 provider attempts) and Relate (default thinking, up to 3 provider attempts on 5xx). Temperature 0, seed 7. Each pass is verified, and retried once if verification rejects its output.

| Check | Result |
|---|---|
| Type check | Pass |
| Unit and integration tests | **82 passed** (6 files) |
| Production build | Pass |

**Deterministic test coverage**, using synthetic fixtures and a scripted or rule-based model (`tests/v2-trace.test.ts`, `tests/traceFixtures.ts`). The expected outcomes follow the provisional construct specification and are not expert-validated labels.

| # | Case | Covered by |
|---|---|---|
| 1, 3 | A calibrated claim linked to its Results evidence, with exact spans in each source | "a claim linked to its Results evidence" |
| 2, 5 | A group difference used as proof of a mechanism: evidence present but insufficient; gap named; a located link cannot be dropped; a verification retry | "evidence present but insufficient" (4 tests) |
| 4 | Evidence absent: `cannot_assess` only; Results not supplied without a second call | "necessary evidence absent" (3 tests) |
| 6 | Repeats resolved by paragraph or left ambiguous; fabricated quotes (retry, then incomplete); cross-source quotes; unknown or duplicate ids; missing paragraphs; a reference field that disagrees with the links; uncited context; inconsistent status | "duplicate, fabricated, unknown and cross-source" (8 tests) |
| 7 | Two claims linked to one passage, and one claim linked to two passages | "several claims and several Results passages" |
| 8 | An older overlapping response rejected; marks never drawn beyond the text or overlapping | "stale links" (2 tests) |
| 9 | Quota at Locate (no Relate call); timeout at Relate; malformed output; missing coverage | "provider and output failures" (3 tests) |
| — | Changing the Results changes the links; changing the Study Context changes the assessment and is recorded as relied on | "change the analysis, not just the UI state" (2 tests) |

**Live browser runs** (in-app browser, dev server, synthetic text only). Discussion in all runs: (C1) "Dashboard access improved data-driven decision-making in the teams studied." (C2) "These findings prove that managerial transparency is the mechanism through which dashboards change decisions." (C3) "Dashboards also reduce employee turnover." Results paragraph 2 in all runs: an association between log-ins and meeting length.

| Run | Results paragraph 1 and Assignment context | Locate | Relate | End-to-end (server) | Outcome |
|---|---|---|---|---|---|
| 1a (first prompts) | Group difference; assignment by drawing lots | ok, 1 attempt, 4.5 s | ok, 1 attempt, 2.6 s | 7.1 s | C1 linked, supported. **C2 wrongly "no evidence located"** (inadequate evidence treated as missing). C3 cannot assess |
| 1b (prompt revised) | Same | ok, 1 attempt, 3.7 s | ok, **2 provider attempts**, 7.4 s | 11.1 s | C1 supported; **C2 linked, goes beyond** (transparency not measured or tested); C3 cannot assess |
| 2a (edit) | Self-selected adoption; "teams decided for themselves" | ok, 1 attempt, 3.4 s | ok, 1 attempt, 2.9 s | 6.3 s | Edit cleared all marks and cards. **C1 wrongly "supported"** (causal claim from a self-selected comparison); C2 again unlinked |
| 2b (causal rule; no-drop rule) | Same | ok, 1 attempt, 3.2 s | ok, 1 attempt, 10.3 s | 13.5 s | **C1 goes beyond** (groups may differ in other ways); C2 still unlinked (Locate did not propose the link) |
| 2c (three-way reference field) | Same | ok, 1 attempt, 2.5 s | ok, 1 attempt, 39.1 s (slow provider) | 41.6 s | Unchanged: Locate labelled C2 "refers to result not supplied" |
| 2d (field definitions reworded) | Same | ok, 1 attempt, 2.6 s | ok, 1 attempt, 3.3 s | 5.8 s | C1 goes beyond; **C2 linked, goes beyond**; C3 cannot assess |
| 3 (edit and reanalyse) | Allocation by drawing lots; Assignment changed back | ok, 1 attempt, 5.9 s | ok, 1 attempt, 23.8 s | 29.7 s | Edit cleared all 3 old marks and every card. New marks quote the **new** Results. C1 supported; C2 goes beyond; C3 cannot assess |

**Diagnostic Locate-only calls** (`scripts/try-locate.mts`), on the run 2 text:
- Before rewording: low and medium thinking both labelled C2 "refers to result not supplied".
- After rewording: two low-thinking runs both labelled it "builds on located result" and linked C2 to E1.

**Navigation (live).**
- "Show in Results" on C2 focused span `r-E1`.
- Clicking claim mark `d-C1` activated its card, emphasised `r-E1` and dimmed `r-E2`.

**Totals.** 7 full analyses (14 model calls, 15 provider attempts) and 4 Locate-only calls, all completed. One transient provider retry occurred (run 1b, Relate). No quota, rate-limit or timeout errors.

**What the runs show, and what they do not.**
- The live runs exposed two failure modes of the Lite model that the deterministic tests could not:
  - inadequate evidence treated as missing;
  - a causal claim accepted on a self-selected comparison.
- Both were addressed by prompt changes, plus structural rules where possible (Locate decides relevance; Relate cannot drop links; the reference field must agree with the links).
- These are **single-text demonstrations** on synthetic passages. They do not show accuracy, stability across texts, or academic validity.
- The *analysis incomplete* state was verified with scripted failures only. No real provider failure occurred during the live runs.
