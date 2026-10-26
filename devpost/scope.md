---
doc: scope
status: approved
---

# Scholarly Writing Intelligence (working title)

A browser-based writing companion that checks whether an academic claim is backed by the evidence in the same paragraph. Its explanations are informed by how published Information Systems research calibrates claims, and it never rewrites the author's text.

## The Unique Kernel
**Claim–Evidence Alignment.** It finds passages that *sound* academic but don't do the academic work they claim to do. Grammar and style checkers miss this. The tool sets what the evidence shows against what the claim asserts, names the inferential step that overreaches, and says what evidence would be needed to defend it.

A forcefully worded claim is not automatically an overclaim. An overclaim is flagged only when there is a *visible inferential step beyond the evidence supplied in the paragraph* and the tool can name that step specifically. If the paragraph lacks the information to judge, the result is "insufficient evidence", not an overclaim.

Each diagnostic separates three things: the **observed evidence**, the **inferential claim**, and the **missing warrant**, which is the unproven logic that would connect the evidence to the claim. That's what moves feedback beyond "your claim is too strong".

Two rules are non-negotiable:
1. **"Unsupported by the supplied text" is not the same as "scientifically incorrect."** The tool may only say a paragraph doesn't provide evidence for a claim. It must never conclude that the study itself is wrong.
2. **The user's evidence and published scholarship never blend.** Only the user's paragraph decides whether a claim is overclaimed. Published IS sources may explain disciplinary norms, but they can't supply missing evidence or prove the user wrong.

## Disciplinary Grounding (IS Scholarship)
The audience writes for premier IS journals, so the tool's reasoning should reflect how published IS research builds arguments, uses evidence, and limits conclusions. Generic academic-prose rules aren't enough. Publication is treated as a reference for published practice, not as proof that every claim in a paper is correct.

- **Source universe:** the AIS Senior Scholars' List of Premier Journals (11 journals since 2023). Record AIS premier status and ABDC rating separately.
- **POC seed:** `devpost/sources/is-source-seed.csv`, eight JAIS records (editorials on theory testing, research writing and experiments, plus empirical privacy, field-experiment and observational papers).
- **Verification status, kept separate:**
  - The 11-journal AIS list: verified by the learner against the AIS page.
  - Bibliographic records (title, authors, DOI) for 8 of 8 articles: verified by the learner against the official JAIS pages.
  - Full-text methodological review: **not completed**.
  - Expert-labelled argument examples: **not completed**.
- **Rule:** metadata verification is not methodological review. The app must not claim to use IS scholarly grounding until verified methodological notes exist. Never fabricate claim or evidence spans from a source that has only had its abstract checked. Bibliographic metadata is not permission to reuse full text.

## Who It's For
The primary POC user is a PhD or Master of Research student drafting an Information Systems paper, starting with the **Discussion** section. That's the learner first: "I'm a PhD student writing my thesis and Information Systems papers." Other research students, especially less confident writers, come next. Researchers and academics are possible later users, not separate POC personas. Today they find out about overclaims from supervisor feedback or reviewer rejections, or not at all, because grammar tools only polish wording.

## The Core Loop
The user chooses the section type (Discussion by default), pastes one paragraph, and selects **Analyse Argument**. The tool returns one of three outcomes:
- **Overclaim detected:** the exact claim span is highlighted. A diagnostic panel shows what the evidence shows, what the claim assumes, the evidence still needed, questions to examine, and a verification status.
- **No overclaim identified:** no highlight and no warning.
- **Insufficient evidence:** a neutral notice that the paragraph doesn't contain enough to check the claim. It is not a softer warning.

The user revises in their own words and analyses the paragraph again.

## Inspiration & Identity
- It should feel like a serious research environment, not an AI paraphraser. Calm, credible, scholarly.
- The model diagnostic is reviewer-style: *Why this matters*, *Evidence identified*, *What the claim assumes*, *Evidence still needed*, *What to examine*, and a *Verification status*, ending with "Your argument, your decision. No rewritten text."
- Tagline: **"Stronger arguments. Your own words."**
- Market context the learner raised: Thesify (reviewer-style feedback without rewriting), Trinka, Writefull, and Paperpal (academic language tools that mostly edit). The edge isn't "feedback without rewriting". It's argument-level diagnosis that is evidence-calibrated and grounded in IS scholarship.
- Academic citations from the earlier research draft (e.g. Holmström & Davison 2026) are **unverified**. Check the DOI, metadata, and content before citing any of them in the app or the Devpost submission.

## Why This Matters to the Learner
"It's for me first." The aim isn't to show that AI writes better than scholars. It's to help users "write, argue, and critique better over time", while authors keep ownership of their own reasoning.

## What "Working" Looks Like
A 60-second demo using an illustrative (fictional) Discussion paragraph. The cross-platform validity clause has been removed so there is one diagnostic target:

> "Participants exposed to an external data-sharing policy reported higher privacy concerns than those exposed to an internal-sharing policy (p = .01). These findings prove that violations of contextual integrity are the mechanism driving privacy concerns."

The "oh, that's cool" moment: the paragraph looks like ordinary, polished academic writing. Then the tool highlights *"prove that violations of contextual integrity are the mechanism driving privacy concerns"* and explains that a group difference is consistent with the theory but doesn't establish the mechanism.

**Finish line: three golden test cases must pass, using the real analysis flow rather than hard-coded answers.**
1. **Overclaiming paragraph:** highlights the exact claim and explains the mismatch.
2. **Cautious, well-calibrated paragraph:** raises **no** warning. It doesn't invent problems to look useful.
3. **Paragraph without enough evidence to judge:** reports "insufficient evidence" neutrally, without inventing evidence or a verdict on the study.

These three cases are a smoke test, not proof of accuracy. Run them repeatedly. Any failure blocks the demo.

## The POC Boundary
- One paragraph in, a section-type selector (Discussion by default), and an **Analyse Argument** action.
- **Theoretical overclaim** is the committed category.
- **Causal overclaim** is conditional. It's in only if a development check (association presented as causation) passes reliably. Otherwise it's explicitly deferred. One reliable category beats two misleading ones.
- Three mutually exclusive outcomes: overclaim detected, no overclaim identified, insufficient evidence.
- Highlights only spans that exactly match the original text. The original text is never altered, and no replacement wording is generated.
- An LLM does the analysis. The choice of model, prompt, and schema is for the spec.
- **IS grounding in the POC:** the seed source file plus a small set (3–5) of curated methodological notes, each traceable to a source DOI. Notes may go into the analysis only if the learner has actually reviewed the underlying source. If that can't be done and validated before the demo, the sources stay in documentation only and the app makes **no** claim to scholarly grounding at runtime.

## Later
- Rights-cleared full-text corpus from premier IS journals, starting with MISQ, ISR, ISJ and JAIS: segmentation into Results, Discussion and Limitations, expert-annotated claim–evidence units, and a retrieval (RAG) layer with traceable citations.
- Expert-labelled contrast pairs (calibrated, overclaimed, insufficient), with synthetic variants clearly marked and never presented as the original authors' errors.
- Calibration by research method (qualitative and interpretive work isn't judged by causal-identification standards).
- A "Disciplinary context" card showing a verified source and DOI with a traceable reason for its relevance.
- External-validity and generalisation diagnostics (e.g. "across all platforms").
- Writing-pattern diagnostics (formulaic phrases like "delve into", stacked hedges): an optional add-on, kept out of the main demo.
- Gap-spotting and problematisation checks for Introductions.
- Multi-paragraph and whole-manuscript consistency, and evidence uploads (results tables, Methods).
- A journal lens and AI-use policy display, adaptive mentorship, and an argument map.
- A benchmark study with IS researchers: accuracy and false-positive rate compared with plain ChatGPT, a commercial tool, and expert feedback. This is the real test of novelty, which the POC doesn't claim to prove.

## Explicitly Cut
- **AI-detection score or percentage:** unreliable, with false positives that fall hardest on non-native English writers. The learner decided: no detector.
- **Rewriting or suggesting replacement sentences:** the core principle. It teaches, and the author decides.
- **Bulk PDF scraping or fine-tuning on journal articles in the POC:** rights haven't been checked, and it isn't needed to prove the kernel.
- **Treating publication as proof:** a published paper is a reference for practice, not an answer key.
- **"Big platform" polish** (dashboards, integrations, multiple models or agents): not needed to prove the kernel in 2–4 hours.
