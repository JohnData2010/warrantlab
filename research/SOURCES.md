# Source register

Every external source cited in the research documents is listed here. Each source has three separate statuses:

| Dimension | Values |
|---|---|
| **Metadata** | *Verified (researcher)*, *Verified (agent)*, *Agent-recalled* (unchecked; **verify before use**), *Claimed only* (vendor claims) |
| **Full text** | *Read (researcher)*, *Read (agent, tool-assisted)*, *Not read* |
| **Synthesis** | *Synthesised* (with a document reference), *Not synthesised* |

Verifying a source's metadata does **not** mean its arguments have been read or synthesised.

## Conferences and venues

| Source | Detail used | Metadata | Notes |
|---|---|---|---|
| ECIS 2027, official website | Conference 24–26 May 2027; TREO deadline 17 Feb 2027 | Verified (researcher), 27 Oct 2026 | Re-check before submission |
| PACIS 2027, official website | Conference 5–9 Jul 2027, Auckland; paper deadline 1 Mar 2027; TREO deadline 7 May 2027 | Verified (researcher), 27 Oct 2026 | Re-check before submission |

## Primary related work

| Source | Metadata | Full text | Synthesis |
|---|---|---|---|
| Hugenroth, P., Danry, V., & Maes, P. (2026). *Critical Inker: Scaffolding critical thinking in AI-assisted writing through Socratic questioning* (arXiv:2604.07167v1 [cs.HC]). https://arxiv.org/abs/2604.07167. Submitted 8 Apr 2026; CC BY 4.0; preprint, with no venue listed. | Verified (researcher); verified (agent, arXiv record), 27 Oct 2026 | Read (researcher), including the Appendix A prompts; read (agent, tool-assisted, v1 HTML) | Synthesised: `literature/CRITICAL-INKER-ANALYSIS.md` (draft 0.1). Some details are marked "(check)" for confirmation against the PDF. |

## Closest work: scientific claim verification, grounded critique and causal overreach

| Source | Metadata | Full text | Synthesis |
|---|---|---|---|
| Ou, J., Walden, W., Sanders, K., Jiang, Z., Sun, K., Cheng, J., Jurayj, W., Wanner, M., Liang, S., Morgan, C., Han, S., Wang, W., May, C., Recknor, H., Khashabi, D., & Van Durme, B. (2025). CLAIMCHECK: How grounded are LLM critiques of scientific papers? In *Findings of the Association for Computational Linguistics: EMNLP 2025* (pp. 21712–21735). https://doi.org/10.18653/v1/2025.findings-emnlp.1185 | Verified (researcher); verified (agent, ACL Anthology PDF header) | Read (agent, PDF text extraction of §1–4, §4.3 and Limitations); researcher checked Table 1 and §4.3 (27 Oct 2026). **Table 1 and the prose report reversed α values for agreement and subjectivity; recorded, not resolved** | Synthesised: `literature/NOVELTY-POSITIONING.md` |
| Isch, C., Dörr, T., Fasching, N., Jennings, G., … Watts, D. J. (2026). Quantifying the prevalence and impact of overreaching causal claims in social science. *Nature Human Behaviour.* Published 24 Aug 2026. https://doi.org/10.1038/s41562-026-02553-x. Open access. | Verified (researcher). The agent confirmed title, date and journal; the full author list was truncated on the page | Read (agent, tool-assisted summary of the main text and methods; the supplementary information was not read); researcher checked the reader-experiment stimuli (the "AI feedback" was manually prepared and presented as AI-generated) | Synthesised: `literature/NOVELTY-POSITIONING.md` |
| Zhang, B., Bornet, A., Yazdani, A., Khlebnikov, P., Milutinovic, M., Rouhizadeh, H., Amini, P., & Teodoro, D. (2025). A dataset for evaluating clinical research claims in large language models. *Scientific Data, 12*, 86. https://doi.org/10.1038/s41597-025-04417-x. Open access (CC BY 4.0). | Verified (researcher); verified (agent, article page); the author list may be truncated | Read (agent, tool-assisted summary) | Synthesised: `literature/NOVELTY-POSITIONING.md` |

## Contestability and reliance in human–AI decision making

| Source | Metadata | Full text | Synthesis |
|---|---|---|---|
| Alfrink, K., Keller, I., Kortuem, G., & Doorn, N. (2023). Contestable AI by design: Towards a framework. *Minds and Machines, 33*, 613–639. https://doi.org/10.1007/s11023-022-09611-z. Open access. | Verified (agent, publisher PDF), 27 Oct 2026 | Read (agent, PDF text extraction). Researcher reading pending | Synthesised: `literature/NOVELTY-POSITIONING.md` §2.3, §4.4. **Critical note:** derived from a small systematic review; the authors describe it as largely context-free and not empirically validated; it concerns automated decisions about decision subjects, not advisory feedback to expert authors |
| Yurrita, M., Verma, H., Balayn, A., Alfrink, K., Gadiraju, U., & Bozzon, A. (2025). Identifying algorithmic decision subjects' needs for meaningful contestability. *Proceedings of the ACM on Human-Computer Interaction, 9*, 1–29. https://doi.org/10.1145/3757415. CC BY. | Verified (agent, Semantic Scholar record and DOI), 27 Oct 2026. Issue and article number not verified | **Abstract only** (the ACM full text was not accessible to the agent) | Synthesised from the abstract only: `literature/NOVELTY-POSITIONING.md` §2.3. **Critical note:** 21 interviews in one public-sector scenario; claims about method and findings beyond the abstract must not be made until the full text is read |
| Buçinca, Z., Malaya, M. B., & Gajos, K. Z. (2021). To trust or to think: Cognitive forcing functions can reduce overreliance on AI in AI-assisted decision-making. *Proceedings of the ACM on Human-Computer Interaction, 5*(CSCW1), 1–21. https://doi.org/10.1145/3449287. Preprint: arXiv:2102.09692. | Verified (agent, arXiv record and DOI), 27 Oct 2026. Article number not verified | Read in part (agent: abstract and study design, arXiv version). Researcher reading pending | Synthesised: `literature/NOVELTY-POSITIONING.md` §2.3, §4.4. **Critical note:** a lay, crowdsourced sample (N = 199, MTurk) on a nutrition task with a simulated AI; transfer to expert researchers judging their own work is untested |

## Works cited within Critical Inker (not yet verified or read by this programme)

These are listed only to scope the novelty matrix (`literature/CRITICAL-INKER-ANALYSIS.md` §9). Metadata for all of them is **Agent-recalled from Critical Inker's reference list**; none has been read or synthesised.

| Short reference | Line of work |
|---|---|
| Stab & Gurevych (2017) | Argument mining; the Argument Annotated Essays corpus |
| Ruiz-Dolz & Lawrence (2023) | Argument assessment and fallacies |
| Miandoab et al. (2025); Jeong et al. (2025) | LLM fallacy detection |
| Buçinca et al. (2021) | Cognitive forcing and overreliance in human–AI decision making. *Now verified and partly read: see the contestability section above* |
| Bowman et al. (2015) | The SNLI dataset |
| Jakesch et al. (2023); Kosmyna et al. (2025) | Effects of LLM co-writing on opinions and cognitive engagement |
| Paul & Elder; Chi et al.; Sweller (1988); Moreno (2004); Flower & Hayes (1981) | Socratic questioning, self-explanation, cognitive load, writing process theory |

## Products (positioning context)

| Source | Detail used | Metadata |
|---|---|---|
| Thesify (product website) | Reviewer-style manuscript feedback on argument, methodology, evidence and structure | Claimed only |
| Trinka, Writefull, Paperpal (product websites) | Academic language and editing assistance | Claimed only |

## Methodological and theoretical foundations

| Source | Metadata | Full text | Synthesis |
|---|---|---|---|
| Hevner, A. R., March, S. T., Park, J., & Ram, S. (2004). Design science in information systems research. *MIS Quarterly, 28*(1), 75–105. https://doi.org/10.2307/25148625 | Verified (researcher, AIS eLibrary), 27 Oct 2026 | Not read | Not synthesised |
| Peffers, K., Tuunanen, T., Rothenberger, M. A., & Chatterjee, S. (2007). A design science research methodology for information systems research. *Journal of Management Information Systems, 24*(3), 45–77. https://doi.org/10.2753/MIS0742-1222240302 | Verified (researcher, publisher), 27 Oct 2026 | Not read | Not synthesised |
| Gregor, S., & Hevner, A. R. (2013). Positioning and presenting design science research for maximum impact. *MIS Quarterly, 37*(2), 337–355. https://doi.org/10.25300/MISQ/2013/37.2.01 | Verified (researcher, MIS Quarterly), 27 Oct 2026 | Not read | Not synthesised |
| Toulmin, S. E. (1958). *The uses of argument.* Cambridge University Press. **An updated edition was published in 2003.** Record which edition is cited. | Verified (researcher, Cambridge University Press), 27 Oct 2026 | Not read | Not synthesised |
| Nissenbaum, H. (2004). Privacy as contextual integrity. *Washington Law Review, 79*(1), 119–157. | Verified (researcher, journal repository), 27 Oct 2026 | Not read | Used only as the domain content of the fictional fixtures |
| Krippendorff's α (e.g. Krippendorff, *Content analysis: An introduction to its methodology*) | Agent-recalled | Not read | Named in `taxonomy/STRUCTURE-MEMO.md` as a candidate measure |
| Passonneau, R. (2006). MASI distance for set-valued annotation agreement (LREC). | Agent-recalled | Not read | Named in `taxonomy/STRUCTURE-MEMO.md` as a candidate measure |

## Infrastructure and governance sources

WarrantLab is an independent personal research project. No institutional policy governs it, so none is listed here. An institutional IP policy row was removed on 27 Oct 2026 (see `DECISIONS.md`). Policies of future collaborators will be added when relevant.

| Source | Detail used | Metadata |
|---|---|---|
| Google Gemini API free-tier terms | Content may be used to improve products and may be read by human reviewers | Verified (researcher), Oct 2026 |
| Google AI Studio rate-limit page, project "Writing environment" | `gemini-3-flash-preview` 5 RPM / 20 RPD; `gemini-3.1-flash-lite` 15 RPM / 500 RPD | Verified (artefact: screenshot), 26 Oct 2026 |
| `devpost/sources/is-source-seed.csv` | Eight JAIS bibliographic records (metadata only) | Verified (researcher), bibliographic only |
