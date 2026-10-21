import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function seedAdmin() {
  const email = (process.env.ADMIN_EMAIL || "admin@pathfold.local").trim().toLowerCase();
  const password = process.env.ADMIN_PASSWORD || "change-me-now";
  const name = process.env.ADMIN_NAME || "PathFold Admin";
  const existing = await prisma.adminUser.findUnique({ where: { email } });
  if (existing) {
    console.log(`• admin user ${email} already exists`);
    return;
  }
  await prisma.adminUser.create({ data: { email, name, passwordHash: await bcrypt.hash(password, 12) } });
  console.log(`✔ created admin user ${email}`);
}

async function seedPartners() {
  if (await prisma.partner.count()) return console.log("• partners already seeded");
  await prisma.partner.createMany({
    data: [
      {
        name: "Saarland University",
        shortName: "UdS",
        logo: "/partners/uds.png",
        type: "Coordinator",
        website: "https://www.uni-saarland.de/en/",
        description:
          "Project coordinator and host institution. Saarland University's Faculty of Computer Science hosts more than 900 researchers in AI, bioinformatics and data science; PathFold uses the UdS HPC cluster for data preprocessing, hyper-parameter search and parallel benchmarking and is embedded in the Centre for Bioinformatics (ZBI) environment.",
        order: 1,
      },
      {
        name: "Deutsches Forschungszentrum für Künstliche Intelligenz GmbH (DFKI)",
        shortName: "DFKI",
        logo: "/partners/dfki.png",
        type: "Associated partner",
        website: "https://www.dfki.de/en/web",
        description:
          "Smart Service Engineering department, Saarbrücken. Primary scientific advisor for AI system design and digital health service paradigms: expert input on the PathFold-Toolbox architecture, knowledge representation and explainability strategies for PathFold-M, and dissemination into Germany's eHealth research community.",
        order: 2,
      },
      {
        name: "Deutsches Zentrum für Neurodegenerative Erkrankungen e. V. (DZNE)",
        shortName: "DZNE",
        logo: "/partners/dzne.png",
        type: "Associated partner",
        website: "https://www.dzne.de/en/",
        description:
          "Systems Medicine, Bonn. Expert partner for neurodegenerative disease biology and translational biomedical research: scientific advice on the clinical and mechanistic relevance of trajectory-based misfolding signatures for amyloid-β, tau and α-synuclein, and access to national research networks for validation beyond the project.",
        order: 3,
      },
      {
        name: "Federal Ministry of Research, Technology and Space (BMFTR)",
        shortName: "BMFTR",
        logo: "/partners/bmftr.png",
        type: "Funding",
        website: "https://www.bmftr.bund.de/",
        description: "Funding authority. PathFold is supported under the “Zukunft eHealth” funding guideline (Postdoc Starting Grant), grant number 031L0342.",
        order: 4,
      },
      {
        name: "NHR-NORD@Göttingen (GWDG)",
        shortName: "NHR",
        type: "Infrastructure",
        website: "https://docs.hpc.gwdg.de/",
        description: "National High-Performance Computing alliance (NHR) Tier-2 centre providing GPU compute for the most compute-intensive training phases.",
        order: 5,
      },
      {
        name: "ELIXIR Germany & NFDI4Health",
        shortName: "ELIXIR-DE",
        type: "Infrastructure",
        website: "https://www.nfdi4health.de/en/",
        description: "Deposition and standardisation pathways for the FAIR publication of the P-Track / M-Track datasets, models and benchmarks.",
        order: 6,
      },
    ],
  });
  console.log("✔ partners");
}

async function seedTeam() {
  if (await prisma.teamMember.count()) return console.log("• team already seeded");
  await prisma.teamMember.createMany({
    data: [
      {
        name: "Dr.-Ing. Maxx Richard Rahman",
        role: "Principal investigator & project leader",
        affiliation: "Saarland University",
        group: "Core team",
        email: "m.rahman@iss.uni-saarland.de",
        website: "https://www.dfki.de/en/web/research/projects-and-publications/project/pathfold",
        bio:
          "Interdisciplinary researcher at the interface of artificial intelligence and biomedical analysis. He obtained his doctorate in computer science at Saarland University on anomaly detection in longitudinal clinical and biological data, combining statistical inference with deep-learning architectures. Before that he worked on data-driven analyses in particle physics at CERN. Since 2021 he has led five externally funded projects in AI-based biomedical analysis at DFKI (3S, 3S-II, EPOPredictII, EPOPredictIII, MARVIN) in collaboration with the World Anti-Doping Agency and the German Sport University Cologne, with publications at ICML, AAAI, NeurIPS, IJCAI, IEEE and Nature Scientific Reports.",
        order: 1,
      },
      {
        name: "Doctoral researcher (to be appointed)",
        role: "PhD researcher – data engineering, PathFold-Toolbox & DynBench",
        affiliation: "Saarland University, Graduate School of Computer Science",
        group: "Open positions",
        bio:
          "The doctoral researcher implements the large-scale data integration pipeline and the versioned FAIR dataset infrastructure, takes full responsibility for the software engineering of the PathFold-Toolbox (Python SDK, CLI, REST API) and the DynBench framework, and leads the computational workflow of the neurodegenerative-disease case study.",
        order: 2,
      },
      {
        name: "Prof. Dr.-Ing. Wolfgang Maaß",
        role: "Scientific advisor – AI systems engineering & digital health",
        affiliation: "DFKI Saarbrücken (Smart Service Engineering) & Saarland University",
        group: "Associated partners",
        website: "https://www.dfki.de/en/web/about-us/employee/person/woma01",
        bio: "Scientific Director of the Smart Service Engineering department at DFKI. Advises on AI system design, the PathFold-Toolbox architecture and dissemination into the eHealth research community, and acts as primary supervisor of the doctoral researcher.",
        order: 3,
      },
      {
        name: "Prof. Dr. med. Joachim L. Schultze",
        role: "Scientific advisor – neurodegenerative disease biology",
        affiliation: "DZNE Bonn (Systems Medicine)",
        group: "Associated partners",
        website: "https://www.dzne.de/en/research/research-areas/systems-medicine/research-groups/schultze/",
        bio: "Director of Systems Medicine at DZNE and Helmholtz Program Speaker Neurodegenerative Diseases and Brain Health. Provides expertise on multi-omics integration, biomarker discovery and the translational interpretation of dynamic misfolding maps for early Alzheimer's disease risk detection.",
        order: 4,
      },
    ],
  });
  console.log("✔ team");
}

async function seedPublications() {
  if (await prisma.publication.count()) return console.log("• publications already seeded");
  await prisma.publication.createMany({
    data: [
      {
        title: "STT-LLM: Structural-Temporal Tokenization for Adapting LLMs to Longitudinal Clinical Profiles",
        authors: "Rahman, M. R., Hammouda, M., & Maass, W.",
        venue: "International Conference on Machine Learning (ICML 2026)",
        year: 2026,
        type: "Conference",
        category: "Related work",
        featured: true,
        abstract:
          "A structural-temporal tokenisation framework that adapts large language models to longitudinal biomedical profiles without modifying the backbone architecture, establishing trajectory-aware sequence modelling that directly informs PathFold-P.",
        order: 1,
      },
      {
        title: "DiGAN: Diffusion-Guided Attention Network for Early Alzheimer's Disease Detection",
        authors: "Rahman, M. R., Hammouda, M., & Maass, W.",
        venue: "1st AI for Healthy Aging and Longevity Workshop (AIAA), AAAI Conference on Artificial Intelligence (AAAI 2026)",
        year: 2026,
        type: "Workshop",
        category: "Related work",
        url: "https://arxiv.org/abs/2602.03881",
        featured: true,
        abstract:
          "Combines latent diffusion modelling with an attention-guided convolutional architecture to synthesise longitudinal neuroimaging trajectories from sparse clinical observations, outperforming the state of the art on established benchmarks.",
        order: 2,
      },
      {
        title: "Detection of sample swapping in anti-doping investigations using machine learning",
        authors: "Rahman, M. R., Piper, T., Thevis, M., et al.",
        venue: "Nature Scientific Reports, 16, 9230",
        year: 2026,
        type: "Journal",
        category: "Related work",
        doi: "10.1038/s41598-026-43502-y",
        order: 3,
      },
      {
        title: "SACNN: Self attention-based convolutional neural network for fraudulent behaviour detection in sports",
        authors: "Rahman, M. R., Khaliq, L. A., Piper, T., Geyer, H., Equey, T., Baume, N., Aikin, R., & Maass, W.",
        venue: "International Joint Conference on Artificial Intelligence (IJCAI 2024), pp. 6017–6025",
        year: 2024,
        type: "Conference",
        category: "Related work",
        featured: true,
        order: 4,
      },
      {
        title: "Incorporating Metabolic Information into LLMs for Anomaly Detection in Clinical Time-Series",
        authors: "Rahman, M. R., Liu, R., & Maass, W.",
        venue: "NeurIPS 2024 Workshop on Time Series in the Age of Large Models (TSALM)",
        year: 2024,
        type: "Workshop",
        category: "Related work",
        order: 5,
      },
      {
        title: "Analysing the Unseen: Leveraging Data Analytics to Combat the Societal Challenge of Doping in Sports",
        authors: "Rahman, M. R., Abdel Khaliq, L., Piper, T., Geyer, H., Equey, T., Baume, N., et al., & Maass, W.",
        venue: "Proceedings of the International Conference on Information Systems (ICIS 2024)",
        year: 2024,
        type: "Conference",
        category: "Related work",
        order: 6,
      },
      {
        title: "AI-based detection of steroid doping in sports",
        authors: "Rahman, M. R., & Maass, W.",
        venue: "In: Artificial Intelligence in Sports, Movement, and Health (Springer Nature)",
        year: 2024,
        type: "Book chapter",
        category: "Related work",
        order: 7,
      },
      {
        title: "Modelling metabolism pathways using graph representation learning for fraud detection in sports",
        authors: "Rahman, M. R., Hussain, M., Piper, T., Geyer, H., Equey, T., Baume, N., Aikin, R., & Maass, W.",
        venue: "IEEE International Conference on Digital Health (ICDH 2023)",
        year: 2023,
        type: "Conference",
        category: "Related work",
        order: 8,
      },
      {
        title: "Detection of erythropoietin in blood to uncover doping in sports using machine learning",
        authors: "Rahman, M. R., Bejder, J., Bonne, T. C., Andersen, A. B., Huertas, J. R., Aikin, R., et al., & Maass, W.",
        venue: "IEEE International Conference on Digital Health (ICDH 2022)",
        year: 2022,
        type: "Conference",
        category: "Related work",
        order: 9,
      },
      {
        title: "Data analytics for uncovering fraudulent behaviour in elite sports",
        authors: "Rahman, M. R., Piper, T., Geyer, H., Equey, T., Baume, N., Aikin, R., & Maass, W.",
        venue: "Proceedings of the International Conference on Information Systems (ICIS 2022)",
        year: 2022,
        type: "Conference",
        category: "Related work",
        order: 10,
      },
    ],
  });
  console.log("✔ publications");
}

async function seedNews() {
  if (await prisma.newsPost.count()) return console.log("• news already seeded");
  await prisma.newsPost.createMany({
    data: [
      {
        title: "PathFold website launched",
        slug: "pathfold-website-launched",
        category: "News",
        publishedAt: new Date("2026-10-15"),
        featured: true,
        excerpt: "The PathFold project website is live. Here you will find background on the project, its research programme, news, publications, media and open resources as they are released.",
        content: `The PathFold project website is now online.

PathFold (*Language Modelling for Protein (Mis-)Folding Pathway Dynamics*) develops a generative AI framework that learns and predicts how proteins fold and misfold over time, directly from their amino acid sequences. The project is coordinated at **Saarland University** and supported by the **German Research Center for Artificial Intelligence (DFKI)** and the **German Center for Neurodegenerative Diseases (DZNE)** as associated partners. It is funded by the Federal Ministry of Research, Technology and Space (BMFTR) under the *Zukunft eHealth* programme.

On this site you will find:

- an [overview of the project](/about), its research questions, work plan and milestones,
- a deeper look at the [methods](/research) behind PathFold-P, PathFold-M, the PathFold-Toolbox and DynBench,
- the [team](/team), [publications](/publications), [media](/media) and [open resources](/resources),
- and a [contact form](/contact) for questions and collaboration requests.

Follow this page for updates on releases, publications and events.`,
      },
      {
        title: "PathFold starts in October 2026",
        slug: "pathfold-project-start",
        category: "News",
        publishedAt: new Date("2026-10-01"),
        excerpt: "PathFold officially begins its 36-month research programme on protein folding and misfolding pathway dynamics, funded by BMFTR under the Zukunft eHealth programme.",
        content: `PathFold officially starts on **1 October 2026** and runs for 36 months until September 2029.

The project is organised in five work packages: data integration and FAIR infrastructure, the trajectory generation model **PathFold-P**, the misfolding and aggregation model **PathFold-M**, integration into the **PathFold-Toolbox** together with the **DynBench** benchmark suite, and a case study on neurodegenerative diseases carried out with DZNE.

Within the first year the team will assemble the P-Track and M-Track datasets, harmonising sequence, structure, disorder and aggregation annotations from open molecular resources such as PDB, AlphaFold DB, UniProt, BMRB, DisProt, AmyLoad, AmyPro, ClinVar and Folding@home.

We are looking for a doctoral researcher to join the project. See the [team page](/team) and get in [touch](/contact) if you are interested.`,
      },
    ],
  });
  console.log("✔ news");
}

async function seedMedia() {
  if (await prisma.mediaItem.count()) return console.log("• media already seeded");
  await prisma.mediaItem.createMany({
    data: [
      {
        title: "PathFold overview: from sequence to dynamic folding pathways",
        type: "Image",
        url: "/pathfold-overview.jpg",
        description: "Infographic contrasting static structure prediction and molecular dynamics with PathFold's generative, kinetically ordered folding and misfolding pathways.",
        source: "PathFold",
        date: new Date("2026-10-01"),
        order: 1,
      },
      {
        title: "PathFold logo",
        type: "Image",
        url: "/logo.png",
        description: "Official PathFold logo: learning protein folding pathways.",
        source: "PathFold",
        date: new Date("2026-10-01"),
        order: 2,
      },
    ],
  });
  console.log("✔ media");
}

async function seedResources() {
  if (await prisma.resource.count()) return console.log("• resources already seeded");
  await prisma.resource.createMany({
    data: [
      {
        name: "PathFold-Toolbox",
        kind: "Software",
        status: "Planned",
        description: "Modular, documented open-source suite integrating PathFold-P and PathFold-M: Python SDK with a unified API, command-line tool for HPC batch inference, RESTful API for pipeline integration and an interactive visualisation component for trajectories and residue-resolved misfolding risk maps.",
        order: 1,
      },
      {
        name: "PathFold-P",
        kind: "Model",
        status: "Planned",
        description: "Transformer-based generative model predicting coarse-grained, kinetically ordered folding trajectories from amino acid sequences. Release v1.0 planned for September 2028 with model card and evaluation report.",
        order: 2,
      },
      {
        name: "PathFold-M",
        kind: "Model",
        status: "Planned",
        description: "Probabilistic model predicting residue-resolved misfolding divergence, aggregation risk and instability hotspots with calibrated uncertainty. Release v1.0 planned for March 2029.",
        order: 3,
      },
      {
        name: "DynBench",
        kind: "Benchmark",
        status: "Planned",
        description: "Standardised benchmarking framework for sequence-to-trajectory models: trajectory accuracy (RMSD continuity, Q-based energy descent), misfolding-risk prediction accuracy and computational scalability, with a public leaderboard for reproducible comparison.",
        order: 4,
      },
      {
        name: "P-Track dataset",
        kind: "Dataset",
        status: "Planned",
        description: "FAIR sequence–trajectory pairs for folded, structurally well-characterised proteins from PDB ensembles, NMR conformers and Folding@home subsets, with PLM embeddings and data cards.",
        order: 5,
      },
      {
        name: "M-Track dataset",
        kind: "Dataset",
        status: "Planned",
        description: "FAIR sequence–annotation pairs for intrinsically disordered and amyloidogenic proteins with residue-resolved misfolding and aggregation labels from DisProt, AmyLoad, AmyPro and ClinVar.",
        order: 6,
      },
      {
        name: "Alzheimer benchmark subset",
        kind: "Dataset",
        status: "Planned",
        description: "Validated dynamic misfolding maps for amyloid-β (Aβ40/Aβ42), tau and α-synuclein released through the PathFold-Toolbox as an open benchmark subset (planned September 2029).",
        order: 7,
      },
      {
        name: "Model cards & documentation",
        kind: "Documentation",
        status: "Planned",
        description: "Model cards, data cards, usage documentation and provenance records for all releases, following EU AI Act transparency requirements and the FAIR software principles.",
        order: 8,
      },
    ],
  });
  console.log("✔ resources");
}

async function seedWorkPackages() {
  if (await prisma.workPackage.count()) return console.log("• work packages already seeded");
  await prisma.workPackage.createMany({
    data: [
      {
        number: 1,
        title: "Data integration and FAIR infrastructure",
        period: "M01–M12 · Oct 2026 – Sep 2027",
        lead: "PhD researcher & postdoc",
        summary: "Build a standardised, FAIR-compliant dataset linking protein sequences, structures, disorder and aggregation annotations and coarse-grained trajectory information for training PathFold-P and PathFold-M.",
        objectives: `1. **Consolidate open molecular resources**: UniProt (canonical sequences and isoforms), PDB (experimental structure ensembles incl. NMR conformers), AlphaFold DB (structurally uncharacterised sequences), BMRB (NMR dynamics) and HDX-MS protection factors, DisProt and MobiDB (residue-resolved disorder), AmyLoad and AmyPro (amyloid and aggregation annotations), ClinVar (pathogenic variants) and Folding@home trajectory subsets (coarse-grained kinetic supervision).
2. **Generate embeddings and structural features** with pre-trained PLMs (ESM-2, ProtT5-XL): contact maps, dihedral angles, secondary-structure states and solvent exposure as supervision for the energy-based contrastive learning component.
3. **Construct two supervised tracks**: *P-Track* (sequence–trajectory pairs for folded proteins) and *M-Track* (sequence–annotation pairs for disordered and amyloidogenic proteins), harmonised through standardised identifier mappings.
4. **Implement FAIR metadata, versioning and documentation** following ELIXIR-DE, NFDI4Health and the Saarland University research-data policy, including machine-readable data cards for every release.`,
        deliverables: "Integrated FAIR dataset (P-Track and M-Track), embedding library, dataset data cards, FAIR metadata schema.",
        order: 1,
      },
      {
        number: 2,
        title: "PathFold-P: protein folding pathway model",
        period: "M07–M24 · Apr 2027 – Sep 2028",
        lead: "Postdoc",
        summary: "Develop PathFold-P, a transformer-based generative model that predicts coarse-grained folding trajectories from amino acid sequences while preserving kinetic order, intermediate plausibility and thermodynamic consistency.",
        objectives: `1. **Encoder–decoder transformer** combining PLM embeddings with geometric inputs; the encoder maps the sequence to a contextual latent state, the decoder autoregressively generates conformational steps described by dihedral angles, contact probabilities and secondary-structure states.
2. **Temporal attention with causal masking** for kinetic order plus a score-based diffusion component in the latent space for stochastic relaxation on rugged energy landscapes; a variational regulariser captures the multiplicity of folding routes.
3. **Three energy-informed loss terms**: next-step reconstruction, free-energy-consistent descent and temporal smoothness.
4. **Distributed mixed-precision training** on the UdS cluster and NHR-NORD@Göttingen; evaluation via RMSD continuity, energy-descent verification and agreement with NMR / HDX-MS intermediate data.
5. **Curriculum learning** from peptides under 100 residues (Chignolin, Trp-cage, WW domain) to full-length proteins.
6. **Ablation and hyper-parameter studies** on temporal attention, diffusion and energy constraints.`,
        deliverables: "PathFold-P v1.0 model, quantitative evaluation report, model documentation and publication.",
        order: 2,
      },
      {
        number: 3,
        title: "PathFold-M: misfolding and aggregation model",
        period: "M13–M30 · Oct 2027 – Mar 2029",
        lead: "PhD researcher",
        summary: "Develop PathFold-M, a probabilistic model that predicts misfolding divergence, aggregation risk and instability-driving sequence regions at residue level with calibrated uncertainty.",
        objectives: `1. **Multi-head cross-attention fusion** of four input streams: PLM sequence embeddings, intermediate trajectory embeddings from PathFold-P, physicochemical residue features (charge, hydrophobicity, β-sheet propensity, polarity) and latent energy gradients.
2. **Contrastive divergence learning** separating stable folding trajectories from experimentally annotated misfolded or aggregation-prone sequences (DisProt, AmyLoad, AmyPro, ClinVar).
3. **Diffusion-based augmentation** generating synthetic misfolded trajectory segments for families with sparse annotations.
4. **Bayesian variational layer** (Monte-Carlo dropout) for calibrated residue-resolved risk scores; calibration assessed by Expected Calibration Error and post-hoc temperature scaling.
5. **Evaluation** via AUC and residue-resolved precision–recall against TANGO, Zyggregator, PASTA2 and recent data-driven models.
6. **Stage gate**: if trajectory conditioning brings no significant gain for a protein family, a reduced sequence-only model is deployed for that family.
7. **Attention attribution and saliency** to localise hotspots and mutation sites driving instability.`,
        deliverables: "PathFold-M v1.0 model, quantitative evaluation report, model documentation and publication.",
        order: 3,
      },
      {
        number: 4,
        title: "Integration, benchmarking and PathFold-Toolbox development",
        period: "M22–M33 · Jul 2028 – Jun 2029",
        lead: "PhD researcher",
        summary: "Integrate PathFold-P and PathFold-M into a modular platform (PathFold-Toolbox), establish the DynBench benchmarking framework and prepare all resources for open scientific use under FAIR principles and EU AI Act transparency requirements.",
        objectives: `1. **Standardised data interfaces and I/O formats** for interoperability between trajectory generation and misfolding-risk analysis.
2. **PathFold-Toolbox** with four components: Python SDK, CLI for HPC batch inference, RESTful API and an interactive visualisation component.
3. **DynBench**: trajectory accuracy (RMSD continuity, Q-based energy descent), misfolding-risk accuracy (AUC, precision–recall on DisProt / AmyLoad / AmyPro) and scalability across datasets and protein families, with a public leaderboard.
4. **Packaging** with documentation, usage examples, model cards and FAIR metadata for open-source publication via ELIXIR-DE and NFDI4Health.`,
        deliverables: "PathFold-Toolbox (Python SDK, CLI, REST API, visualisation), DynBench suite with public leaderboard, open-access release of all models, datasets and documentation.",
        order: 4,
      },
      {
        number: 5,
        title: "Application to neurodegenerative diseases",
        period: "M25–M36 · Oct 2028 – Sep 2029",
        lead: "Postdoc, with DZNE",
        summary: "Demonstrate the translational value of PathFold by applying both models to proteins involved in Alzheimer's disease, Parkinson's disease and related proteinopathies as a proof of concept for dynamic biomarker discovery and variant prioritisation.",
        objectives: `1. **Simulate folding trajectories** with PathFold-P for amyloid-β (Aβ40, Aβ42), tau (including disease-associated phosphorylation variants) and α-synuclein, focusing on intermediates linked to instability and nucleation risk.
2. **Estimate residue-resolved misfolding and aggregation risk** with PathFold-M across disease-associated variants and post-translational modifications from ClinVar and the literature.
3. **Generate dynamic misfolding maps** linking trajectory behaviour with aggregation propensity as sequence-derived molecular descriptors for early diagnosis and risk stratification.
4. **Assess scientific and translational relevance** with DZNE, which provides the clinical contextualisation and positioning within existing biomarker research programmes.
5. **Publish results and release Alzheimer-specific benchmark subsets** through the PathFold-Toolbox.`,
        deliverables: "Case study on neurodegenerative diseases, joint publication with DZNE, Alzheimer-specific benchmark subsets in the PathFold-Toolbox.",
        order: 5,
      },
    ],
  });
  console.log("✔ work packages");
}

async function seedMilestones() {
  if (await prisma.milestone.count()) return console.log("• milestones already seeded");
  await prisma.milestone.createMany({
    data: [
      {
        code: "M1",
        title: "FAIR dataset and embedding infrastructure",
        due: "Sep 2027",
        workPackage: "WP1",
        status: "Planned",
        description: "Completion of the integrated PathFold dataset (P-Track and M-Track) with harmonised identifiers, metadata schema, PLM-derived embeddings and FAIR documentation. Internal validation report completed; dataset data card published.",
        order: 1,
      },
      {
        code: "M2",
        title: "PathFold-P v1.0 (folding trajectory model)",
        due: "Sep 2028",
        workPackage: "WP2",
        status: "Planned",
        description: "Release of PathFold-P v1.0 trained on benchmark datasets; evaluation report demonstrating continuous trajectories, energy-consistent transitions and agreement with experimental NMR and HDX-MS intermediate states; submission of the first manuscript.",
        order: 2,
      },
      {
        code: "M3",
        title: "PathFold-M v1.0 (misfolding and aggregation model)",
        due: "Mar 2029",
        workPackage: "WP3",
        status: "Planned",
        description: "Release of PathFold-M v1.0 with residue-resolved misfolding and aggregation-risk predictions with calibrated uncertainty; benchmarking report on pathogenic and aggregation-prone proteins from DisProt, AmyLoad and ClinVar; reduced model delivered if the stage gate requires it.",
        order: 3,
      },
      {
        code: "M4",
        title: "PathFold-Toolbox and DynBench suite",
        due: "Jun 2029",
        workPackage: "WP4",
        status: "Planned",
        description: "Integration of PathFold-P and PathFold-M into the PathFold-Toolbox with Python SDK, CLI and RESTful API; release of DynBench v1.0 with a public leaderboard; open-access publication of all models, datasets and documentation via ELIXIR-DE and NFDI4Health.",
        order: 4,
      },
      {
        code: "M5",
        title: "Alzheimer case study",
        due: "Sep 2029",
        workPackage: "WP5",
        status: "Planned",
        description: "Completion of the Alzheimer case study: validated dynamic misfolding maps for amyloid-β (Aβ40/Aβ42), tau and α-synuclein; release of the AD benchmark subset through the PathFold-Toolbox; joint publication with DZNE; dissemination via AI-for-Health and national eHealth networks.",
        order: 5,
      },
    ],
  });
  console.log("✔ milestones");
}

async function main() {
  await seedAdmin();
  await seedPartners();
  await seedTeam();
  await seedPublications();
  await seedNews();
  await seedMedia();
  await seedResources();
  await seedWorkPackages();
  await seedMilestones();
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
