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

## Slice B — cross-section evidence traceability (done)

**Pipeline** (`lib/v2/trace/`). The Slice A Discussion-only result has been removed from the Research Preview. The v0.1 engine and `/api/analyse` are unchanged.

1. **Locate** (Extract model, low thinking). Receives Discussion (`[D1]…`) and Results (`[R1]…`) as **separate, labelled sources**, never concatenated. Returns:
   - Discussion claims: id, quote, sentence, paragraph, kind and `results_reference`;
   - Results evidence: id, quote, sentence, paragraph and kind;
   - candidate links, meaning "relevant to", not "supports".
2. **Relate** (Judge model). Receives both sources, the **user-reported Study Context** (labelled not verified), and the verified Locate output. For each claim it returns:
   - `evidence_links` (relevance and role) and `link_status`;
   - a preliminary `assessment`;
   - explanations, `missing_information` and `context_fields_used`.
3. If Results are empty, or there are no claims, Relate is skipped. Every claim is then `results_not_supplied` (or has no evidence located) and `cannot_assess`.

**Response** (`lib/v2/trace/types.ts`):
```ts
{ status: "complete", version: 2, resultsSupplied, contextSupplied: ContextField[],
  claims: [{ id, quote, kind, location: SourceLocation,
             linkStatus: "linked" | "no_relevant_evidence_located" | "results_not_supplied",
             links: [{ evidenceId, relevance: "direct" | "partial", role }],
             assessment: "supported_as_stated" | "goes_beyond_evidence" | "conflicts_with_evidence" | "cannot_assess",
             relationshipExplanation, gapExplanation, missingInformation, contextFieldsUsed, uncertaintyNote }],
  evidence: [{ id, quote, kind, location: SourceLocation }] }
| { status: "incomplete", version: 2, reason }   // provider or verification failure: never a judgement
SourceLocation = { status: "exact" | "tolerant", sourceId: "results" | "discussion", start, end }
               | { status: "ambiguous", sourceId }
```

**Span verification** (`lib/v2/trace/verify.ts`)
- A quotation is searched **only in its declared source**: claims in Discussion, evidence in Results.
- Offsets refer to that source's original text. The v0.1 `locateQuote` provides exact matching first, then a match tolerant of whitespace and quote style.
- A quotation found only in the *other* source is rejected as a cross-source reference (`fabricated_span`).
- A quotation found nowhere is rejected (`fabricated_span`).
- A repeated quotation is resolved by its sentence, then by its declared paragraph. If neither resolves it, it stays **ambiguous**: it is listed but not highlighted, never assigned to an arbitrary occurrence.
- The UI never draws a mark beyond the current text or over another mark.
- A verified location proves where the words appear. It does not prove that they are correct or supportive, and the UI says so.

**Consistency rules** (output that breaks a rule is retried once, then the analysis is `incomplete`)
- Both passes must cover every paragraph of both sources and every claim. Ids must be unique and known, and declared paragraphs must exist.
- **Relevance is decided by Locate.** Relate may add links between known ids but may not drop a located link. Evidence that is inadequate therefore cannot be relabelled as missing.
- `results_reference` must agree with the links:
  - `builds_on_located_result` requires a link;
  - `refers_to_result_not_supplied` forbids one.
- `linked` requires links, and `no_relevant_evidence_located` forbids them.
- **No located evidence ⇒ `cannot_assess` only.** Not finding a result never yields a negative or positive verdict.
- `goes_beyond_evidence` must name the gap. `cannot_assess` must state the missing information.
- `context_fields_used` may name only fields the user actually filled in.

**UI** (`components/v2/`)
- After a complete analysis, Results and Discussion switch to read-only annotated views. "Edit text" returns either one to its editor.
- **Claim marks**, toned by preliminary assessment: green = supported as stated; amber = may go beyond; red = appears to conflict; dashed = cannot assess.
- **Evidence marks** are blue. Selecting a claim emphasises its linked evidence and dims the rest.
- **Claim cards** show the link status, each linked passage with relevance, role and a **Show in Results** button (which focuses the exact span), the preliminary assessment, the missing warrant or missing information, and any Study Context relied on (labelled as the user's description, not verified).
- **Distinct states:** *Linked Results evidence (n)*, *No relevant Results evidence located* (with "does not mean the claim is wrong"), *No Results supplied*, and *Analysis incomplete* (a service or output problem, not a judgement; nothing shown).
- Any edit to any source clears every link, mark and card. The request-token and exact-input checks from Slice A apply unchanged.

**Diagnostic script.** `npx tsx --env-file=.env.local scripts/try-locate.mts [low|medium|high]` runs only the Locate pass on a built-in synthetic example and prints ids, kinds, references and links. It prints no key and no free text.
