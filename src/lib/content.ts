/**
 * Static narrative content derived from the PathFold proposal.
 * Dynamic entries (news, publications, team, …) live in the database.
 */

export const PROJECT = {
  acronym: "PathFold",
  fullTitle: "PathFold – Language Modelling for Protein (Mis-)Folding Pathway Dynamics",
  tagline: "Learning protein folding pathways",
  duration: "1 October 2026 – 30 September 2029",
  months: 36,
  start: "October 2026",
  end: "September 2029",
  funding: "BMFTR – Federal Ministry of Research, Technology and Space",
  programme: "Zukunft eHealth (Postdoc Starting Grant)",
  grantNumber: "031L0342",
  coordinatorInstitution: "Universität des Saarlandes",
  coordinator: "Dr.-Ing. Maxx Richard Rahman",
  keywords: [
    "Protein folding dynamics",
    "Generative AI model",
    "Misfolding divergence detection",
    "Protein language model",
    "Neurodegenerative diseases",
    "Trajectory-based biomarkers",
    "FAIR molecular data",
    "Digital health research",
  ],
  researchTopics: ["Machine Learning & Deep Learning", "Language & Text Understanding", "Data Management & Analysis", "Image Recognition & Understanding"],
  applicationFields: ["Health & Medicine"],
};

export const PROBLEM_CARDS = [
  {
    title: "AlphaFold2 / AlphaFold3",
    subtitle: "Single end-point structure",
    body:
      "State-of-the-art structure predictors describe only the folding endpoint: one lowest-energy conformation, without kinetic or temporal information, and they capture fewer than one in seven experimentally validated fold-switching conformations.",
    tone: "neutral" as const,
  },
  {
    title: "Molecular dynamics",
    subtitle: "Too short timescales",
    body:
      "MD simulations generate atomistic folding trajectories, but clinically relevant folding and misfolding events happen on millisecond-to-second timescales that remain out of reach even with enhanced sampling and Markov state models.",
    tone: "neutral" as const,
  },
  {
    title: "PathFold",
    subtitle: "Kinetically ordered pathways from sequence",
    body:
      "PathFold models folding as a coarse-grained, kinetically ordered sequence of structural transitions, capturing the order, timing and interdependence of conformational events that decide between a stable native state and misfolding.",
    tone: "brand" as const,
  },
];

export const COMPONENTS = [
  {
    key: "pathfold-p",
    name: "PathFold-P",
    kicker: "Trajectory generation model",
    summary:
      "A transformer-based generative model that predicts coarse-grained folding trajectories from amino acid sequences while preserving kinetic order, intermediate-state plausibility and thermodynamic consistency along the whole pathway.",
    details: [
      "Encoder–decoder transformer over protein language model embeddings (ESM-2, ProtT5-XL) with geometric inputs: contact maps, dihedral angles, secondary structure.",
      "Temporal attention with causal masking introduces directed kinetic order; a score-based diffusion component in the latent space models stochastic relaxation on rugged energy landscapes.",
      "Energy-informed training: next-step reconstruction, a free-energy-consistent loss enforcing monotonic descent, and a temporal smoothness constraint.",
      "Curriculum learning from peptides under 100 residues (Chignolin, Trp-cage, WW domain) towards full-length proteins.",
    ],
    accent: "from-brand-cyan to-brand-blue",
  },
  {
    key: "pathfold-m",
    name: "PathFold-M",
    kicker: "Misfolding & aggregation model",
    summary:
      "A probabilistic model that treats misfolding as a divergence from normal folding trajectories and predicts residue-resolved misfolding and aggregation risk with calibrated uncertainty.",
    details: [
      "Multi-head cross-attention fuses four input streams: PLM sequence embeddings, intermediate trajectory embeddings from PathFold-P, physicochemical residue features and latent energy gradients.",
      "Contrastive divergence learning separates stable folding trajectories from experimentally annotated misfolded or aggregation-prone sequences (DisProt, AmyLoad, AmyPro, ClinVar).",
      "Diffusion-based augmentation generates synthetic misfolded trajectory segments for families with sparse annotations.",
      "A Bayesian variational layer (Monte-Carlo dropout) yields calibrated probabilities; attention attribution localises sequence hotspots and mutation sites driving instability.",
    ],
    accent: "from-orange-400 to-misfold",
  },
  {
    key: "toolbox",
    name: "PathFold-Toolbox & DynBench",
    kicker: "Open platform & benchmark",
    summary:
      "A modular open-source software suite that integrates both models, plus DynBench, the first standardised benchmarking framework with a public leaderboard for sequence-to-trajectory models.",
    details: [
      "Python SDK with a unified API for trajectory prediction and misfolding risk assessment.",
      "Command-line tool for HPC batch inference across protein families and a RESTful API for pipeline integration.",
      "Interactive visualisation component for trajectory display and residue-resolved misfolding risk mapping.",
      "DynBench metrics: RMSD continuity, energy-descent verification, agreement with NMR / HDX-MS intermediates, residue-resolved precision–recall on disorder and aggregation annotations.",
    ],
    accent: "from-brand-indigo to-brand-violet",
  },
];

export const RESEARCH_QUESTIONS = [
  {
    code: "RQ1",
    question: "Why do current structure prediction models fail to capture folding pathways from amino acid sequences?",
    answer:
      "Structure predictors return static end states and discard the temporal order and energetic continuity of folding. PathFold addresses this with a tiered supervision signal: Tier 1 uses long all-atom MD trajectories of fast-folding proteins and Folding@home subsets discretised with Markov state models; Tier 2 integrates experimental observables (NMR ensembles, HDX-MS protection factors, Φ-values) as partial ordering constraints; Tier 3 provides physics-informed regularisation through Gō-type energy functions, contact-order folding-rate estimates and statistical contact potentials.",
  },
  {
    code: "RQ2",
    question: "How can generative models predict misfolding divergence to identify sequence regions responsible for aggregation and instability?",
    answer:
      "Existing aggregation predictors rely on hand-crafted physicochemical features and reach roughly fifty percent accuracy on diverse protein families. PathFold treats misfolding as a divergent trajectory in the same latent space used for folding prediction. Learning from both stable and unstable sequence–trajectory pairs, it estimates the probability of deviating from low-energy pathways and identifies residue clusters or mutation hotspots linked to aggregation-prone behaviour.",
  },
];

export const HYPOTHESES = [
  {
    code: "H1",
    text: "Trajectory signatures provide molecular indicators of early instability that support variant prioritisation, aggregation risk assessment and the identification of mechanistic targets for therapeutic intervention.",
  },
  {
    code: "H2",
    text: "Such a framework is a data-driven kinetic surrogate that delivers clinically relevant folding and misfolding information orders of magnitude faster than MD simulations, without requiring existing structures or MD trajectories as input.",
  },
];

export const SUCCESS_CRITERIA = [
  "PathFold-P reconstructs the experimentally documented folding order of established fast-folder benchmarks (Chignolin, Trp-cage, WW domain) with monotonic energy descent, mean RMSD continuity below a predefined threshold and demonstrable agreement with NMR and HDX-MS intermediate states.",
  "PathFold-M outperforms established sequence-based aggregation and disorder predictors (TANGO, Zyggregator, PASTA2) and recent data-driven models in residue-resolved precision/recall and AUC on independent test sets from DisProt, AmyLoad, AmyPro and ClinVar, with calibrated uncertainty.",
  "A curated, FAIR-compliant sequence–trajectory dataset (P-Track and M-Track) harmonising PDB, AlphaFold DB, UniProt, BMRB, DisProt, AmyLoad, AmyPro, ClinVar and Folding@home is released as an open resource together with DynBench, the PathFold-Toolbox and a public leaderboard.",
];

export const DATA_SOURCES = [
  { name: "Protein Data Bank (PDB)", role: "Experimental structure ensembles incl. NMR conformers", url: "https://www.wwpdb.org/" },
  { name: "AlphaFold DB", role: "Proteome-wide predicted structures", url: "https://alphafold.ebi.ac.uk/" },
  { name: "UniProt / UniRef", role: "Canonical sequences and isoforms", url: "https://www.uniprot.org/" },
  { name: "BMRB", role: "NMR dynamics and conformational ensembles", url: "https://www.bmrb.io/" },
  { name: "DisProt & MobiDB", role: "Residue-resolved disorder annotations", url: "https://disprot.org/" },
  { name: "AmyLoad & AmyPro", role: "Amyloidogenic and aggregation-prone regions", url: "https://amypro.net/" },
  { name: "ClinVar", role: "Pathogenic variants with clinical evidence", url: "https://www.clinicalgenome.org/data-sharing/clinvar/" },
  { name: "Folding@home", role: "Coarse-grained kinetic trajectory subsets", url: "https://foldingathome.org/" },
];

export const APPLICATIONS = [
  {
    title: "Neurodegenerative diseases",
    body: "Variant-resolved dynamic misfolding maps for amyloid-β (Aβ40/Aβ42), tau and α-synuclein, developed together with DZNE as a proof of concept for dynamic biomarker discovery and variant prioritisation.",
  },
  {
    title: "Protein aggregation diseases",
    body: "Residue-level misfolding and aggregation risk scores for disease-associated variants and post-translational modifications, as molecular descriptors for early diagnosis and risk stratification.",
  },
  {
    title: "Membrane protein stability & protein engineering",
    body: "Trajectory-level stability indicators to support variant interpretation, stability services and precision-medicine oriented protein design.",
  },
];

export const FAIR_PRINCIPLES = [
  "All models, datasets and analysis outputs are curated according to the FAIR principles and published with metadata, versioning and provenance documentation following ELIXIR-DE and NFDI4Health standards.",
  "PathFold-P, PathFold-M and the PathFold-Toolbox are released as open-source software; P-Track and M-Track as versioned open datasets; DynBench as an open benchmarking platform with a public leaderboard.",
  "The project uses exclusively publicly licensed molecular and sequence resources. No human, animal or patient-identifying data are processed.",
  "PathFold is an analysis framework for naturally occurring sequences: it does not generate novel protein sequences with designed functions. Outputs are descriptive molecular descriptors, not synthesisable constructs.",
];

export const TIMELINE = [
  {
    year: "2027",
    items: [
      "Dataset release: P-Track and M-Track v1.0, FAIR-compliant via ELIXIR-DE and NFDI4Health",
      "Goal: one harmonised sequence–trajectory–annotation resource as the foundation for both models",
    ],
  },
  {
    year: "2028",
    items: [
      "Model release: PathFold-P v1.0, the folding trajectory model",
      "Benchmark release: DynBench v1.0 with a public leaderboard",
      "Goal: kinetically ordered, energy-consistent trajectories that agree with NMR and HDX-MS intermediates",
    ],
  },
  {
    year: "2029",
    items: [
      "Model release: PathFold-M v1.0, the misfolding and aggregation model",
      "Release: PathFold-Toolbox with Python SDK, CLI and REST API",
      "Dataset release: Alzheimer benchmark subset for amyloid-β, tau and α-synuclein",
      "Goal: variant-resolved dynamic misfolding maps for neurodegenerative proteins",
    ],
  },
  {
    year: "2030+",
    items: [
      "Goal: extend PathFold to multi-protein aggregation and post-translational modifications",
      "Goal: clinical validation of trajectory-based misfolding risk scores",
      "Continued DynBench and dataset releases for the community",
    ],
  },
];
