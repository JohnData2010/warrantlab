# WarrantLab V0.2 — implementation notes (Research Preview)

*Status: in development on `development`. Not academically validated. The frozen POC is tag `hackathon-poc-v0.1`.*

## Principles carried over from v0.1

- No rewriting. No AI-text detection.
- Every highlighted span is verified against the exact original text of its source.
- Missing information is never turned into a finding.
- Provider failures produce an *analysis incomplete* state. They are never shown as an academic judgement.
- Manuscript text never appears in logs and is not persisted (no browser storage, no server storage).
- Synthetic or appropriately licensed text only. No unpublished manuscripts while the free-tier Gemini configuration is in use.

## Slice A — multi-section research workspace (done)

**What it adds**
- A second workspace, **Results + Discussion** (Research Preview), selectable beside the unchanged single-passage workspace.
- Separate Results and Discussion editors, and an optional Study Context panel with free-text fields: design, assignment, sampling, measurement and reported assumptions.
- A new endpoint, `POST /api/v2/analyse`, with a strict request contract. The v0.1 endpoint `/api/analyse` is untouched.

**Request contract** (`lib/v2/contract.ts`)
```ts
{ version: 2, results: string, discussion: string,
  context: { design, assignment, sampling, measurement, assumptions } } // each ≤ 1,500 chars
```
- Validated with a strict Zod schema; unknown fields are rejected.
- Texts are never trimmed or normalised, so later spans refer to the original characters. `SourceId` names every source a span may come from: `results`, `discussion` or `context.<field>`.
- The Discussion is required. The word limit (`WARRANTLAB_MAX_WORDS`, default 3,000) applies to all sources together.

**Engine in Slice A** (`lib/v2/analyseWorkspace.ts`)
- The Discussion is analysed by the v0.1 two-pass engine, on its own text only.
- Results and Study Context are accepted and preserved but **not sent to the model**. A test asserts this. The response says so explicitly (`traceability: { status: "not_implemented" }`), and the UI states it.
- Cross-section tracing is Slice B.

**Staleness** (`lib/v2/contract.ts`, `lib/v2/requestGate.ts`)
- A diagnostic is valid only for byte-identical Results, Discussion and every context field.
- Any edit clears the diagnostics and aborts the in-flight request.
- A response is accepted only if it belongs to the **latest** request token **and** its inputs still equal the current inputs. Either check alone allows stale results.

**Route and handler**
- `app/api/v2/analyse/route.ts` is thin. The logic is in `lib/v2/handler.ts`, so it can be integration-tested with a scripted model.
- Logs contain word counts, context field *names*, status, stage and call timings only.

**Feature flag**
- `WARRANTLAB_RESEARCH_PREVIEW` is on by default in `npm run dev`, and off in production builds unless set to `true`.
- When it is off, the page shows only the v0.1 workspace and the v2 endpoint returns 404.

**Design choices**
- *Two workspaces, both kept mounted.* This keeps v0.1 behaviour identical, and switching modes never discards typed text.
- *Study Context as free text, with no design-type picker.* A menu option such as "randomised experiment" would be exactly the keyword-style signal the construct specification warns against. Context is labelled in the UI as the user's description, not verified fact.
- *A separate v2 response type.* It wraps the v0.1 section result rather than changing v0.1 types, so later slices can add traceability and dimension profiles without touching v0.1.
