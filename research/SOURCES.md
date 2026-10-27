# Source register

*Restructured 27 Oct 2026 to keep four kinds of provenance separate. Earlier versions conflated them.*

Every external source cited in the research documents is listed here with four **independent** provenance fields:

| Field | Meaning | Values used |
|---|---|---|
| **Metadata verification** | Who confirmed the DOI, authors, year and venue, and against which source | *Agent (source)*; *Project owner (source)*, only where the project owner has stated that they personally checked; *Supplied by project owner* (the details came from the project owner in conversation; the method of checking was not recorded); *Agent-recalled* (unchecked: **verify before use**); *Claimed only* (vendor claims) |
| **Full-text access** | What text was available, and to whom | *Full PDF*, *full HTML*, *abstract only*, *partial*; with the access route (e.g. PDF text extraction, a web-reading tool that summarises rather than displays text) |
| **Agent-assisted synthesis** | Where an AI agent has summarised or synthesised the source | A document reference, or *None* |
| **Researcher verification** | Whether the project owner has **personally** checked the arguments and key figures against the source | *Yes* (with what was checked and when), or *Not recorded* |

**Rules.**
- A correction supplied by the project owner is **not** evidence that the project owner personally verified it, unless they say so. Such corrections are labelled "supplied by project owner", together with any independent agent check.
- An agent reading, even of a full PDF, is **not** researcher verification.
- Statements in the research documents that rest only on agent-assisted reading must not be presented as checked by the researcher.

## Conferences and venues

| Source | Detail used | Metadata verification | Researcher verification |
|---|---|---|---|
| ECIS 2027, official website | Conference 24–26 May 2027; TREO deadline 17 Feb 2027 | Supplied by project owner, 27 Oct 2026 | Not recorded. **Re-check before any submission** |
| PACIS 2027, official website | Conference 5–9 Jul 2027, Auckland; paper deadline 1 Mar 2027; TREO deadline 7 May 2027 | Supplied by project owner, 27 Oct 2026 | Not recorded. **Re-check before any submission** |

## Primary related work

| Source | Metadata verification | Full-text access | Agent-assisted synthesis | Researcher verification |
|---|---|---|---|---|
| Hugenroth, P., Danry, V., & Maes, P. (2026). *Critical Inker: Scaffolding critical thinking in AI-assisted writing through Socratic questioning* (arXiv:2604.07167v1 [cs.HC]). https://arxiv.org/abs/2604.07167. Submitted 8 Apr 2026; CC BY 4.0; preprint, no venue listed. | Agent (arXiv record), 27 Oct 2026. Also supplied by project owner | Agent: full v1 HTML via a web-reading tool (summarising, not verbatim) | `literature/CRITICAL-INKER-ANALYSIS.md` (draft 0.2). Details marked "(check)" are unconfirmed | Not recorded. The project owner supplied two corrections (the 91.2% attribution to Figure 3; the optional `suggestion` field). Whether these came from a personal reading of the PDF is not recorded |

## Closest work: scientific claim verification, grounded critique and causal overreach

| Source | Metadata verification | Full-text access | Agent-assisted synthesis | Researcher verification |
|---|---|---|---|---|
| Ou, J., Walden, W., Sanders, K., Jiang, Z., Sun, K., Cheng, J., Jurayj, W., Wanner, M., Liang, S., Morgan, C., Han, S., Wang, W., May, C., Recknor, H., Khashabi, D., & Van Durme, B. (2025). CLAIMCHECK: How grounded are LLM critiques of scientific papers? In *Findings of the Association for Computational Linguistics: EMNLP 2025* (pp. 21712–21735). https://doi.org/10.18653/v1/2025.findings-emnlp.1185 | Agent (ACL Anthology PDF header). Also supplied by project owner | Agent: full PDF, text extraction (§1–4, §4.3, Limitations, appendices in part) | `literature/NOVELTY-POSITIONING.md` §2.2 | Not recorded. The project owner supplied the Table 1 vs prose correction. **Agent check (27 Oct 2026, PDF text):** Table 1 "Humans Only" row reads Agreement 13.1, Subjectivity 18.2; the §3.3 prose reads αAgr = 18.2, αSub = 13.1. The discrepancy is recorded, not resolved |
| Isch, C., Dörr, T., Fasching, N., Jennings, G., … Watts, D. J. (2026). Quantifying the prevalence and impact of overreaching causal claims in social science. *Nature Human Behaviour.* Published 24 Aug 2026. https://doi.org/10.1038/s41562-026-02553-x. Open access. | Agent (article page: title, date, journal; the author list was truncated). Also supplied by project owner | Agent: full HTML via a web-reading tool (main text and Methods). Supplementary information not read | `literature/NOVELTY-POSITIONING.md` §2.1 | Not recorded. The project owner supplied the "AI feedback" and 84% corrections. **Agent check (27 Oct 2026, Methods):** the article states the label and highlights were created manually "to ensure consistency across articles" and that participants were informed they were AI-generated. The 84% figure is business, cross-sectional articles, 2024 |
| Zhang, B., Bornet, A., Yazdani, A., Khlebnikov, P., Milutinovic, M., Rouhizadeh, H., Amini, P., & Teodoro, D. (2025). A dataset for evaluating clinical research claims in large language models. *Scientific Data, 12*, 86. https://doi.org/10.1038/s41597-025-04417-x. Open access (CC BY 4.0). | Agent (article page; the author list may be truncated). Also supplied by project owner | Agent: full HTML via a web-reading tool | `literature/NOVELTY-POSITIONING.md` | Not recorded |

## Contestability and reliance in human–AI decision making

| Source | Metadata verification | Full-text access | Agent-assisted synthesis | Researcher verification |
|---|---|---|---|---|
| Alfrink, K., Keller, I., Kortuem, G., & Doorn, N. (2023). Contestable AI by design: Towards a framework. *Minds and Machines, 33*, 613–639. https://doi.org/10.1007/s11023-022-09611-z. Open access. | Agent (publisher PDF), 27 Oct 2026 | Agent: full PDF, text extraction | `literature/NOVELTY-POSITIONING.md` §2.3. **Critical note:** derived from a small systematic review; the authors describe it as largely context-free and not empirically validated; concerns automated decisions about decision subjects | Not recorded |
| Yurrita, M., Verma, H., Balayn, A., Alfrink, K., Gadiraju, U., & Bozzon, A. (2025). Identifying algorithmic decision subjects' needs for meaningful contestability. *Proceedings of the ACM on Human-Computer Interaction, 9*(7), Article CSCW234, 29 pages. https://doi.org/10.1145/3757415. CC BY 4.0. Publisher version from the Utrecht University repository: https://research-portal.uu.nl/ws/portalfiles/portal/275153869/3757415.pdf | **Project owner (first page of the publisher PDF), 27 Oct 2026.** Agent (same PDF, cover page and first page), 27 Oct 2026 | Agent: full publisher PDF (30 pages including the repository cover), text extraction. Located by the project owner | `literature/NOVELTY-POSITIONING.md` §2.3. **Critical note:** qualitative, vignette-based interviews (N = 21, highly educated, mostly NL and ES) about a hypothetical public-sector enforcement decision; the authors caution that transfer beyond public-sector policy enforcement "should not be fully assumed" | Metadata only (see the first column). Arguments not recorded as checked |
| Buçinca, Z., Malaya, M. B., & Gajos, K. Z. (2021). To trust or to think: Cognitive forcing functions can reduce overreliance on AI in AI-assisted decision-making. *Proceedings of the ACM on Human-Computer Interaction, 5*(CSCW1), 1–21. https://doi.org/10.1145/3449287. Preprint: arXiv:2102.09692. | Agent (arXiv record and DOI), 27 Oct 2026. Article number not verified | Agent: partial (abstract and study design, arXiv PDF) | `literature/NOVELTY-POSITIONING.md` §2.3. **Critical note:** a lay, crowdsourced sample (N = 199, MTurk) on a nutrition task with a simulated AI | Not recorded |

## Works cited within Critical Inker (not yet verified or read)

These are listed only to scope the novelty matrix (`literature/CRITICAL-INKER-ANALYSIS.md` §9). Metadata is **agent-recalled from Critical Inker's reference list**. None has been read or synthesised, except Buçinca et al., which now appears above.

| Short reference | Line of work |
|---|---|
| Stab & Gurevych (2017) | Argument mining; the Argument Annotated Essays corpus |
| Ruiz-Dolz & Lawrence (2023) | Argument assessment and fallacies |
| Miandoab et al. (2025); Jeong et al. (2025) | LLM fallacy detection |
| Bowman et al. (2015) | The SNLI dataset |
| Jakesch et al. (2023); Kosmyna et al. (2025) | Effects of LLM co-writing on opinions and cognitive engagement |
| Paul & Elder; Chi et al.; Sweller (1988); Moreno (2004); Flower & Hayes (1981) | Socratic questioning, self-explanation, cognitive load, writing process theory |

## Products (positioning context)

| Source | Detail used | Metadata verification |
|---|---|---|
| Thesify (product website) | Reviewer-style manuscript feedback on argument, methodology, evidence and structure | Claimed only |
| Trinka, Writefull, Paperpal (product websites) | Academic language and editing assistance | Claimed only |

## Methodological and theoretical foundations

| Source | Metadata verification | Full-text access | Agent-assisted synthesis | Researcher verification |
|---|---|---|---|---|
| Hevner, A. R., March, S. T., Park, J., & Ram, S. (2004). Design science in information systems research. *MIS Quarterly, 28*(1), 75–105. https://doi.org/10.2307/25148625 | Supplied by project owner (stated source: AIS eLibrary), 27 Oct 2026 | Not read | None | Not recorded |
| Peffers, K., Tuunanen, T., Rothenberger, M. A., & Chatterjee, S. (2007). A design science research methodology for information systems research. *Journal of Management Information Systems, 24*(3), 45–77. https://doi.org/10.2753/MIS0742-1222240302 | Supplied by project owner (stated source: publisher), 27 Oct 2026 | Not read | None | Not recorded |
| Gregor, S., & Hevner, A. R. (2013). Positioning and presenting design science research for maximum impact. *MIS Quarterly, 37*(2), 337–355. https://doi.org/10.25300/MISQ/2013/37.2.01 | Supplied by project owner (stated source: MIS Quarterly), 27 Oct 2026 | Not read | None | Not recorded |
| Toulmin, S. E. (1958). *The uses of argument.* Cambridge University Press. **An updated edition was published in 2003.** Record which edition is cited. | Supplied by project owner (stated source: Cambridge University Press), 27 Oct 2026 | Not read | None | Not recorded |
| Nissenbaum, H. (2004). Privacy as contextual integrity. *Washington Law Review, 79*(1), 119–157. | Supplied by project owner (stated source: journal repository), 27 Oct 2026 | Not read | Used only as the domain content of the fictional POC fixtures | Not recorded |
| Krippendorff's α (e.g. Krippendorff, *Content analysis: An introduction to its methodology*) | Agent-recalled | Not read | None | Not recorded |
| Passonneau, R. (2006). MASI distance for set-valued annotation agreement (LREC). | Agent-recalled | Not read | None | Not recorded |

## Infrastructure and governance sources

WarrantLab is an independent personal research project. No institutional policy governs it, so none is listed here. An institutional IP-policy row was removed on 27 Oct 2026 (see `DECISIONS.md`). Policies of future collaborators will be added when relevant.

| Source | Detail used | Metadata verification |
|---|---|---|
| Google Gemini API free-tier terms | Content may be used to improve products and may be read by human reviewers | Supplied by project owner, Oct 2026 |
| Google AI Studio rate-limit page, project "Writing environment" | `gemini-3-flash-preview` 5 RPM / 20 RPD; `gemini-3.1-flash-lite` 15 RPM / 500 RPD | Project artefact: screenshot shared by the project owner, 26 Oct 2026 |
| `devpost/sources/is-source-seed.csv` | Eight JAIS bibliographic records (metadata only) | Supplied by project owner; bibliographic only |
