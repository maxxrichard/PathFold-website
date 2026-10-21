import type { Metadata } from "next";
import { ExternalLink } from "lucide-react";
import { PageHero, Section, SectionHeading } from "@/components/ui/Section";
import { Reveal } from "@/components/ui/Reveal";
import { Badge } from "@/components/ui/Badge";
import { COMPONENTS, DATA_SOURCES, APPLICATIONS } from "@/lib/content";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Research",
  description: "How PathFold works: energy-based latent representation learning, PathFold-P, PathFold-M, the PathFold-Toolbox, DynBench and the open data sources.",
};

const TIERS = [
  {
    tier: "Tier 1",
    title: "Direct MD trajectories",
    body: "Long all-atom MD simulations of ~12 fast-folding proteins under 80 residues and Folding@home subsets, discretised with Markov state models into backbone dihedral distributions, contact probability maps and secondary-structure assignments.",
  },
  {
    tier: "Tier 2",
    title: "Indirect kinetic observables",
    body: "For larger proteins without complete trajectories: NMR conformational ensembles, HDX-MS protection factors and Φ-value data serve as partial ordering constraints.",
  },
  {
    tier: "Tier 3",
    title: "Physics-informed surrogates",
    body: "Gō-type energy functions, contact-order folding-rate estimates and statistical contact potentials enforce thermodynamic plausibility across the whole dataset, even without direct experimental supervision.",
  },
];

export default function ResearchPage() {
  return (
    <>
      <PageHero
        eyebrow="Research"
        title={<>How <span className="text-gradient">PathFold</span> learns folding dynamics</>}
        description="PathFold combines the representational power of large protein language models with constraints from energy-landscape theory to act as a scalable surrogate for molecular dynamics, enabling kinetic inference and misfolding divergence detection across large and diverse protein families."
      />

      {/* Tiered supervision */}
      <Section id="supervision">
        <SectionHeading
          eyebrow="Training signal"
          title="A tiered supervision signal"
          description="Direct folding trajectories exist only for a handful of small proteins. PathFold therefore integrates three complementary data tiers, which also makes the central data-availability problem of trajectory-based modelling explicit and tractable."
        />
        <div className="mt-10 grid gap-5 lg:grid-cols-3">
          {TIERS.map((t, i) => (
            <Reveal key={t.tier} delay={i * 0.07}>
              <article className="card h-full p-7">
                <Badge tone="cyan">{t.tier}</Badge>
                <h3 className="font-display mt-4 text-xl font-semibold text-fg">{t.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-fg-muted">{t.body}</p>
              </article>
            </Reveal>
          ))}
        </div>
      </Section>

      {/* Energy-based latent space */}
      <Section tone="elevated" id="latent">
        <div className="grid gap-10 lg:grid-cols-12 lg:items-center">
          <div className="lg:col-span-6">
            <SectionHeading
              eyebrow="Foundation"
              title="Energy-based latent representation learning"
              description="Pre-trained protein language models such as ESM-2 and ProtT5-XL capture rich co-evolutionary dependencies, but their latent spaces are not organised by free energy and do not encode the directed, downhill nature of folding trajectories."
            />
            <p className="mt-5 text-sm leading-relaxed text-fg-muted">
              PathFold adapts these embeddings with an energy-informed contrastive learning scheme grounded in energy-landscape
              theory. Every conformation is described by residue-resolved geometric descriptors (contact maps, torsion angles,
              solvent exposure, secondary-structure states). A free-energy surrogate, the fraction of native contacts Q combined with a
              statistical contact potential, assigns a scalar energy to each conformation. Conformations with similar Q form positive
              pairs, distant ones negative pairs, and an InfoNCE loss in the residue-resolved embedding space pulls energetically
              adjacent conformations together.
            </p>
            <p className="mt-4 text-sm leading-relaxed text-fg-muted">
              The result is a thermodynamically ordered latent manifold in which neighbouring points represent plausible sequential
              steps along a folding pathway, the geometric foundation for PathFold-P. A lightweight two-layer MLP projects PLM
              embeddings (ESM-2 650M: 1280 dims; ProtT5-XL: 1024 dims) into this energy-aligned space.
            </p>
          </div>
          <div className="lg:col-span-6">
            <Reveal>
              <LatentFigure />
            </Reveal>
          </div>
        </div>
      </Section>

      {/* Components in depth */}
      {COMPONENTS.map((c, i) => (
        <Section key={c.key} id={c.key} tone={i % 2 === 1 ? "elevated" : "default"}>
          <div className="grid gap-10 lg:grid-cols-12">
            <div className="lg:col-span-5">
              <p className="eyebrow">{c.kicker}</p>
              <h2 className="font-display mt-3 text-3xl font-bold tracking-tight text-fg sm:text-4xl">
                <span className={cn("bg-gradient-to-r bg-clip-text text-transparent", c.accent)}>{c.name}</span>
              </h2>
              <p className="mt-4 text-lg leading-relaxed text-fg-muted">{c.summary}</p>
            </div>
            <div className="lg:col-span-7">
              <ul className="grid gap-4 sm:grid-cols-2">
                {c.details.map((d, j) => (
                  <Reveal key={j} as="li" delay={j * 0.05} className="card p-5 text-sm leading-relaxed text-fg-muted">
                    <span className={cn("mb-3 block h-1 w-10 rounded-full bg-gradient-to-r", c.accent)} />
                    {d}
                  </Reveal>
                ))}
              </ul>
            </div>
          </div>
        </Section>
      ))}

      {/* Open data sources */}
      <Section tone="elevated" id="datasets">
        <SectionHeading
          eyebrow="Data"
          title="Open data sources"
          description="PathFold relies exclusively on publicly licensed, FAIR-compliant molecular and sequence resources. They are harmonised through standardised identifier mappings between UniProt accessions, PDB entry IDs and the annotation databases, so that sequence, structure, dynamics, disorder, aggregation and variant information line up for every protein."
        />
        <ul className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {DATA_SOURCES.map((s, i) => (
            <Reveal key={s.name} as="li" delay={i * 0.03}>
              <a href={s.url} target="_blank" rel="noreferrer" className="card card-hover flex h-full flex-col p-4">
                <span className="flex items-center justify-between gap-2 text-sm font-semibold text-fg">
                  {s.name} <ExternalLink className="h-3.5 w-3.5 text-fg-subtle" />
                </span>
                <span className="mt-1 text-xs leading-relaxed text-fg-muted">{s.role}</span>
              </a>
            </Reveal>
          ))}
        </ul>
      </Section>

      {/* Applications */}
      <Section id="applications">
        <SectionHeading
          eyebrow="Translational relevance"
          title="Application to neurodegenerative diseases"
          description="As a concrete health-relevance deliverable, PathFold produces variant-resolved dynamic misfolding maps for amyloid-β (Aβ40, Aβ42), tau and α-synuclein in collaboration with DZNE, the three clinically most important proteinopathies."
        />
        <div className="mt-10 grid gap-5 lg:grid-cols-3">
          {APPLICATIONS.map((a, i) => (
            <Reveal key={a.title} delay={i * 0.07}>
              <article className="card h-full p-7">
                <h3 className="font-display text-xl font-semibold text-fg">{a.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-fg-muted">{a.body}</p>
              </article>
            </Reveal>
          ))}
        </div>
      </Section>

    </>
  );
}

function LatentFigure() {
  return (
    <div className="card relative overflow-hidden p-6">
      <svg viewBox="0 0 520 320" className="w-full" role="img" aria-label="Schematic energy-aligned latent space with folding and misfolding trajectories">
        <defs>
          <radialGradient id="basinN" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="basinM" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#f43f5e" stopOpacity="0.45" />
            <stop offset="100%" stopColor="#f43f5e" stopOpacity="0" />
          </radialGradient>
          <linearGradient id="pathN" x1="0" x2="1">
            <stop offset="0" stopColor="#38bdf8" />
            <stop offset="1" stopColor="#6366f1" />
          </linearGradient>
          <linearGradient id="pathM" x1="0" x2="1">
            <stop offset="0" stopColor="#fb923c" />
            <stop offset="1" stopColor="#f43f5e" />
          </linearGradient>
        </defs>
        {/* contour lines */}
        {[0, 1, 2, 3, 4].map((i) => (
          <ellipse key={`n${i}`} cx="400" cy="110" rx={30 + i * 26} ry={20 + i * 18} fill="none" stroke="#38bdf8" strokeOpacity={0.18 - i * 0.03} />
        ))}
        {[0, 1, 2, 3].map((i) => (
          <ellipse key={`m${i}`} cx="380" cy="250" rx={22 + i * 22} ry={16 + i * 14} fill="none" stroke="#fb7185" strokeOpacity={0.18 - i * 0.04} />
        ))}
        <circle cx="400" cy="110" r="90" fill="url(#basinN)" />
        <circle cx="380" cy="250" r="70" fill="url(#basinM)" />
        <path d="M30 170 C 110 120, 170 230, 240 160 S 340 110, 398 112" fill="none" stroke="url(#pathN)" strokeWidth="3" strokeLinecap="round" className="animate-dash" />
        <path d="M30 170 C 110 120, 170 230, 240 160 S 310 240, 378 248" fill="none" stroke="url(#pathM)" strokeWidth="3" strokeLinecap="round" strokeDasharray="6 6" />
        <circle cx="30" cy="170" r="6" fill="#070b14" stroke="#e8eef8" strokeWidth="2" />
        <circle cx="240" cy="160" r="6" fill="#070b14" stroke="#a78bfa" strokeWidth="2" />
        <circle cx="398" cy="112" r="7" fill="#070b14" stroke="#38bdf8" strokeWidth="2.5" />
        <circle cx="378" cy="248" r="7" fill="#070b14" stroke="#fb7185" strokeWidth="2.5" />
        <text x="18" y="200" fill="#a3b1c6" fontSize="11">Unfolded</text>
        <text x="206" y="192" fill="#a3b1c6" fontSize="11">Shared intermediate</text>
        <text x="414" y="100" fill="#7dd3fc" fontSize="11">Native basin</text>
        <text x="392" y="280" fill="#fda4af" fontSize="11">Kinetic trap</text>
        <text x="20" y="306" fill="#74839c" fontSize="10">Energy-aligned latent space (schematic) · solid: productive folding · dashed: off-pathway divergence</text>
      </svg>
    </div>
  );
}
