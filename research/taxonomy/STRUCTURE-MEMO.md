# Memo: structure of the inferential-gap taxonomy

*Phase 2 preparation. Draft 0.1, 27 October 2026 (AEDT). Status: recommendation for review. **The taxonomy is not finalised and no annotation dataset is built.***

This memo addresses the provisional taxonomy in `../ROADMAP.md` §5 (G1–G7, N1–N4). It identifies conceptual overlaps, proposes how to separate substantive gaps from missing context, compares three classification structures, and recommends one. All definitions remain provisional.

## 1. Overlaps that affect reliability

### 1.1 G1 mechanism leap and G4 construct leap

**Overlap.** In TC1, "These findings prove that violations of contextual integrity are the mechanism…" can be read as two problems:
- **G1:** a condition difference is treated as evidence of a mechanism.
- **G4:** the manipulated condition (external sharing) is treated as an instance of the construct (contextual-integrity violation) without operationalisation.

**Proposed distinction by locus:**
- **G4** concerns the **evidence-to-construct link**: whether what was measured or manipulated is the construct the claim talks about.
- **G1** concerns the **construct-to-explanation link**: whether a relationship among constructs is shown to operate through the claimed mechanism.

A single claim can have both problems. A mutually exclusive scheme would force annotators to choose, which would show up as artificial disagreement.

### 1.2 G2 theory-validation leap and G7 contribution leap

**Overlap.** "This confirms that TAM fully explains adoption, a key contribution to IS theory" asserts a theory's truth (G2) and, separately, the paper's contribution (G7).

**Proposed distinction by object of the claim:**
- **G2:** about the **theory** (its validity, scope or explanatory completeness).
- **G7:** about **this study's contribution** (novelty, significance, implications).

They often occur in the same sentence but are conceptually separable.

### 1.3 Substantive gap versus insufficient contextual evidence (G3/G5 vs N2/N3)

**The problem.** The text not mentioning causal identification does not mean the study lacks it. The same applies to sampling or scope information. If annotators label G3 whenever identification is not visible, the taxonomy turns *missing context* into *error*, which is the POC's core design principle reversed.

**Proposed rule: an assessability decision comes before classification.**
- A **gap** (G-class) requires positive evidence in the supplied text that the inferential step exceeds what is shown. For example, the text describes a cross-sectional survey and then claims causation, or it reports a sample from one platform and then generalises to "all platforms".
- If the supplied text simply **lacks** the design information needed to judge the claim, the label is **N2** (evidence likely elsewhere) or **N3** (no evidence presented), not a gap.

### 1.4 G5 scope leap versus reported prior findings

A sentence that **attributes** a generalisation to other studies ("Prior work shows this holds across cultures [cite]") is a citation claim. It is not a scope leap by the authors. **Proposed:** reported or attributed claims are either out of scope (N4) or a separate *attributed claim* category to be defined. This is an open decision.

## 2. Separate annotation tasks

Disagreement can arise at different stages, so each should be a separately measurable task:

| Task | Question | Output | Agreement measure (to be decided) |
|---|---|---|---|
| T1 Claim identification | Which spans are substantive inferential claims? | Claim spans | Span overlap (e.g. token-level F1 between annotators) |
| T2 Evidence linking | Which spans are offered as evidence for each claim? | Claim–evidence links | Link-level agreement |
| T3 Assessability | Can the claim be assessed from the supplied text? | Assessable / N2 / N3 / N4 | Krippendorff's α (nominal) |
| T4 Gap classification | For assessable claims: calibrated, or which gap? | N1 or gap label(s) | Depends on structure (§3) |
| T5 Warrant articulation | What inferential link is missing? | Free text | Qualitative comparison; possibly expert rating of equivalence |

**Pilot sequencing.** Start the pilot with **pre-segmented claim–evidence units**, so that T1 and T2 are fixed and the clarity of T3 and T4 can be tested in isolation. Expert span identification (T1, T2) can be added in a later round. Report agreement **separately per task**.

## 3. Three classification structures

| Criterion | A. Mutually exclusive (one label per claim) | B. Flat multi-label (any number of labels) | C. Hierarchical (assessability gate → one primary gap → optional secondary gaps) |
|---|---|---|---|
| Fit to the overlaps in §1 | Poor: forces an arbitrary choice for G1/G4 and G2/G7 | Good: co-occurrence captured | Good: co-occurrence captured as secondary labels |
| Reliability measurement | Simplest: nominal α | Harder: set-based agreement (e.g. α with a set distance such as MASI); results are harder to interpret | Primary label measured with nominal α; secondary labels reported descriptively or with a set-based measure |
| Annotator burden | Low | Higher, and scales with the number of categories | Moderate: one decision at each level |
| Separation of missing context from gaps (§1.3) | Possible only if N-labels compete with G-labels, which invites confusion | Same weakness | **Built in**: assessability is decided first |
| Usefulness for system feedback | One message per claim | Can produce cluttered feedback | One primary message, with secondary issues available on demand |
| Risk | Artificial disagreement; information loss | Inflated label counts; weak agreement on rare labels | Primary-label rules need careful decision guidance; still more complex than A |

## 4. Recommendation (for review, not final)

**Adopt structure C (hierarchical), for these reasons:**

1. It makes the assessability decision (T3) explicit and logically prior. This directly encodes the programme's central distinction between *unsupported by the supplied text* and *flawed*, and keeps G3 and G5 separate from N2 and N3.
2. It accommodates the real co-occurrences (G1/G4, G2/G7) without forcing arbitrary single choices, while keeping a **single primary label** that supports a straightforward, interpretable reliability statistic.
3. It matches how feedback should be presented: one main inferential problem per claim, with further issues available.
4. It keeps *disagreement* analysable. Disagreement at the assessability level, at the primary-gap level and at the secondary-gap level carries different meanings, and contested inferences can be recorded as findings rather than treated as noise.

**Decision rules to draft for the primary label:**
- The primary label is the gap that, if resolved, would most change whether the claim as stated is warranted (the *load-bearing* gap).
- Ties are resolved by locus order: construct (G4) → relation (G3, G6) → explanation (G1) → theory or scope (G2, G5) → contribution (G7). This ordering is a proposal to test in the pilot.

**What would change this recommendation:**
- If the pilot shows that annotators cannot agree on a primary label even when the set of gaps is shared, consider flat multi-label (B) with a set-based agreement measure.
- If co-occurrence turns out to be rare, simplify to A plus the assessability gate.

## 5. Open questions for the researcher and supervisor

1. Should G1 and G2 remain separate, or become levels of one "explanatory overreach" family?
2. How should attributed or cited claims be treated (§1.4)?
3. Is statistical over-interpretation (G6) in scope for the first designs, or deferred?
4. Should annotators rate the *contestability* of a judgement (e.g. "reasonable experts could disagree") as a separate field, so that genuine disagreement can be studied?
5. Which research designs enter the first pilot? (ROADMAP §12.3)

## References used in this memo

- Krippendorff's α and set-based distances such as MASI (Passonneau, 2006) are named as candidate measures. Both are **agent-recalled** and must be verified and cited properly before use (see `../SOURCES.md`).
