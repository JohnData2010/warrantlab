# WarrantLab

**Scholarly Argument Intelligence** — find the missing reasoning between your evidence and your claims.

WarrantLab is a proof of concept built for the Devpost *Build With AI: Basics* hackathon. It helps PhD and research students writing Information Systems papers see when a claim goes further than the evidence presented in their own text. For each overclaim it highlights the exact words and shows a **Warrant Check**: the evidence identified, the missing warrant (the unproven link), and the claim. It then asks questions so the author can judge the argument themselves.

It **never rewrites your text**, it is **not an AI detector**, and it does not grade grammar or style.

> **Status:** Discussion analysis is implemented and runs as a *development preview*. It is not yet marked supported, because it has not yet passed its real-model validation gate (see [Tests and evaluation](#tests-and-evaluation)). Other manuscript sections are planned but disabled.

**Planning documents:** [scope](devpost/scope.md) · [product requirements (PRD)](devpost/prd.md) · [technical spec](devpost/spec.md) · [build checklist](devpost/checklist.md)

## How it works

1. You choose a manuscript section and paste up to 3,000 words.
2. **Pass 1 — Extract** (`gemini-3.1-flash-lite`) lists every claim and piece of evidence as exact quotes.
3. Deterministic code checks every quote exists in your text, every paragraph was covered, and the output matches the schema.
4. **Pass 2 — Judge** (also `gemini-3.1-flash-lite`, in a separate call) reads the whole text plus the verified extraction and decides, claim by claim, whether the claim overreaches its evidence, fits it, or cannot be assessed from what you supplied.
5. Code verifies again and aggregates one outcome:
   - **Overclaim detected:** up to three findings, highlighted in amber
   - **No overclaim identified:** neutral, not a verification of the wider study
   - **Insufficient evidence:** neutral; missing information is never treated as an error
   - **Analysis incomplete:** any model failure, truncation, quota limit or invented quote, never a clean result

WarrantLab only says what *the supplied text* establishes. It never says a study is wrong or that something was not tested.

## Run it locally

Requires Node.js 24+.

```bash
npm install
cp .env.example .env.local   # then set GEMINI_API_KEY in .env.local
npm run dev                  # open http://localhost:3000
```

Create the key in [Google AI Studio](https://aistudio.google.com/) in a project **without billing**. With billing off, exceeding the free quota returns an error instead of a charge.

To try Discussion before it has passed its validation gate, set `WARRANTLAB_DEV_PREVIEW=true` in `.env.local` (local development only).

## Tests and evaluation

```bash
npm test                                                   # deterministic unit tests (no API calls)
npm run eval -- --section=discussion --runs=3              # real-model evaluation (uses free-tier quota)
npm run list:models                                        # models your key can call
npm run check:model -- --model=gemini-3.1-flash-lite      # one structured-output probe
```

Evaluation fixtures in `eval/fixtures/` are fictional and marked synthetic. Reports land in `eval/reports/`. A section becomes selectable only when its overclaim, calibrated and insufficient-evidence fixtures pass every check in 3 of 3 real-model runs.

## Privacy

WarrantLab does not save your manuscript or analysis history, and it never writes manuscript text to logs. **This demonstration sends your text to Google's Gemini API free tier. Google may have human reviewers read free-tier inputs and outputs, and may use them to improve its products. Please do not paste unpublished or confidential research.**

## Limits

- Paragraph and section-level analysis only. It doesn't check consistency across a whole manuscript.
- Only sections that have passed the validation gate can be selected.
- Theoretical overclaim is the committed category. Causal overclaim is off by default.
- The free tier allows a small number of requests per day per model. When it is exhausted, analysis reports *incomplete*.
- Passing the fixtures is a smoke test, not evidence of general accuracy.

## Planning documents

WarrantLab was planned and built with the Devpost Learn Skill Pack, working plan-first:

- [`devpost/scope.md`](devpost/scope.md): the kernel, the user and the proof-of-concept boundary
- [`devpost/prd.md`](devpost/prd.md): journeys, decision rules, golden test cases and acceptance criteria
- [`devpost/spec.md`](devpost/spec.md): architecture, the two-pass engine, verification and the evaluation harness
- [`devpost/checklist.md`](devpost/checklist.md): build slices and every revision the build forced

## Licence

The original WarrantLab code in this repository is released under the [MIT License](LICENSE). Third-party dependencies keep their own licences.
