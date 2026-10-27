# Decision log

Decisions that shape the research programme, recorded with their reasons. Newest first. Decisions about the frozen hackathon POC are kept for traceability. Entries are never rewritten; any reversal is added as a new entry.

| Date (AEDT) | Decision | Decided by | Reason | Reference |
|---|---|---|---|---|
| 27 Oct 2026 | Accept ROADMAP v0.1 as a provisional planning baseline. The taxonomy, RQs and design principles stay subject to scientific review. No single foundational theory is chosen yet (Toulmin is treated as a possible representation, not an explanatory theory) | Researcher | Critical Inker's full text showed substantial overlap. Positioning must be revised before taxonomy, benchmark or V0.2 design | `literature/CRITICAL-INKER-ANALYSIS.md` |
| 27 Oct 2026 | Move WarrantLab from a hackathon POC to a long-term IS research programme ("WarrantLab 2027"), and work on branch `development` | Researcher | The Devpost deadline passed. The problem is better pursued as design-science and behavioural research | `research/ROADMAP.md` |
| 27 Oct 2026 | Prioritise the concept paper, taxonomy and annotation protocol over new features. Do not implement the Argument Provenance Graph or start participant studies yet | Researcher | The scientific direction must be evaluated first. Experts' ability to label inferential gaps is a prerequisite for evaluating any system | ROADMAP §6, §11 |
| 27 Oct 2026 | Treat a 2–3-expert pilot as a feasibility check, not evidence of reliability | Researcher | A sample that small cannot support generalisable reliability claims | ROADMAP §6.2 |
| 27 Oct 2026 | Freeze the POC at annotated tag `hackathon-poc-v0.1` (commit `6e5448b`) without rewriting history | Researcher | Preserves the full pass and fail record | Git tag |
| 27 Oct 2026 | Amend the validation gate post hoc to separate academic correctness from provider availability (3 completed and correct evaluations per fixture; 503/504 failures kept as operational failures) | Researcher | Provider outages are not evidence about reasoning quality. The original strict gate is recorded as not passed | `eval/GATE-SUMMARY.md` |
| 27 Oct 2026 | Use `gemini-3.1-flash-lite` for both passes | Researcher | `gemini-3-flash-preview` had repeated 504s and timeouts and only 20 requests a day | `devpost/checklist.md` revisions |
| 26 Oct 2026 | Zero additional paid services for the hackathon; Gemini API free tier; fictional text only | Researcher | Budget constraint. The free-tier data terms rule out real manuscripts | `devpost/spec.md` |
| 26 Oct 2026 | No AI-text detection and no rewriting | Researcher | Detection is unreliable and harms non-native writers. Author agency is a core principle | `devpost/scope.md` |
