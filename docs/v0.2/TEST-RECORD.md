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
