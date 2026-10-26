# Discussion validation gate — summary

## Amended gate definition (learner-approved, post hoc, 27 Oct 2026 AEDT)

The original gate required each of TC1–TC3 to pass in 3 of 3 end-to-end runs in a single report. **The original strict gate did not pass.** Every attempt was recorded and every failing report is kept in `eval/reports/`.

After observing repeated Google free-tier 503/504 errors, the learner approved this amendment, which separates **academic reasoning reliability** from **API availability**:

- **Academic gate:** each of TC1, TC2 and TC3 needs at least **three independently completed evaluations that are all correct**, under an unchanged model, prompt, schema and reasoning configuration.
- A completed evaluation with a wrong outcome, a missing required span, fabricated evidence or an unacceptable inference **fails** the academic gate.
- A provider 503, 504 or timeout is an **operational failure**. It stays in the record and is excluded only from the denominator of completed academic evaluations.

## Configuration under evaluation

- Extract and Judge: `gemini-3.1-flash-lite` (Gemini API free tier), two-pass engine, prompts and schemas as of commit `a281103`.
- Extract uses `thinkingLevel: low`, a 30 s timeout and up to 3 attempts. The Judge uses default thinking, a 90 s timeout and up to 3 attempts on 5xx, with exponential backoff (3 s, 9 s).
- `temperature: 0`, `seed: 7`.

## Results for this configuration

Reports: `2026-10-26T15-14-05-834Z`, `2026-10-26T15-22-55-239Z` and `2026-10-26T15-24-03-990Z` (UTC timestamps).

| Fixture | Attempted analyses | Completed responses | Academic passes | Academic failures | Provider failures (503) | Judge HTTP | Extract HTTP |
|---|---|---|---|---|---|---|---|
| TC1 overclaim | 5 | 3 | **3** | 0 | 2 | 9 | 6 |
| TC2 calibrated | 3 | 3 | **3** | 0 | 0 | 4 | 3 |
| TC3 insufficient | 3 | 3 | **3** | 0 | 0 | 4 | 5 |

**Amended academic gate: PASSED** (3/3 completed and correct for each fixture).
**Operational reliability in this window:** 9 of 11 attempted analyses completed (2 Google 503s after retries). The app shows these failures as "Analysis incomplete" and does not report an outcome.

Every completed TC1 response highlighted exactly `prove that violations of contextual integrity are the mechanism driving privacy concerns`. No completed response contained a fabricated statistic or banned phrasing.

## Supporting checks (same configuration family, single runs)

- Cross-paragraph evidence: ✅ `no_overclaim_identified` (report `15-15-17-750Z`)
- TC4, no in-scope claims: ✅ `no_overclaim_identified` / `no_in_scope_claims` (same report)
- Strong-wording, irrelevant-edit and causal fixtures passed only under the earlier single-model setup (`03-14-16-923Z`) and **have not been re-run** on this configuration.
- Multi-paragraph (two overclaims) and TAM have **not been run** end to end on this configuration.

## Earlier attempts (kept for the record)

| Report | Configuration | Outcome |
|---|---|---|
| `03-14-16-923Z` | `gemini-3-flash-preview` for both passes | Partial: daily quota (20 RPD) exhausted mid-run |
| `07-59-47-868Z` | Extract Lite, Judge `gemini-3-flash-preview` | NOT PASSED: TC1 0/3 (504s and timeout), TC2 2/2 correct, the rest not run |
| `14-57-14-272Z` | Both Lite, no Judge retry | TC2 ✅; TC1 and TC3 Judge 503 |
| `15-00-09-199Z` | Both Lite, 1 retry | TC1, TC2 and TC3 all ✅ (1 run each) |
| `15-05-33-008Z` | Both Lite, 1 retry | NOT PASSED: 5 ✅ and 4 provider failures (504/503), no wrong outcome |

## What this does and does not show

It shows that the selected fixtures produce the expected outcomes consistently when the provider responds. It is a smoke test on fictional examples, **not** evidence of general accuracy, production reliability, or validated analysis of long (up to 3,000-word) sections.
