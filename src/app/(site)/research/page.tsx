import type { Metadata } from "next";
import { ArrowUpRight } from "lucide-react";
import { PageHero, Section, SectionHeading } from "@/components/ui/Section";
import { Reveal } from "@/components/ui/Reveal";
import { Staircase, PinnedRows } from "@/components/site/landing";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { COMPONENTS, DATA_SOURCES, APPLICATIONS } from "@/lib/content";

export const metadata: Metadata = {
  title: "Research",
  description: "How PathFold works: energy-based latent representation learning, PathFold-P, PathFold-M, the PathFold-Toolbox, DynBench and the open data sources.",
};

const TIERS = [
  {
    line: "Tier 1: direct MD trajectories.",
    note: "Long all-atom MD simulations of ~12 fast-folding proteins under 80 residues and Folding@home subsets, discretised with Markov state models into backbone dihedral distributions, contact probability maps and secondary-structure assignments.",
  },
  {
    line: "Tier 2: indirect kinetic observables.",
    note: "For larger proteins without complete trajectories: NMR conformational ensembles, HDX-MS protection factors and Φ-value data serve as partial ordering constraints.",
  },
  {
    line: "Tier 3: physics-informed surrogates.",
    note: "Gō-type energy functions, contact-order folding-rate estimates and statistical contact potentials enforce thermodynamic plausibility across the whole dataset, even without direct experimental supervision.",
  },
];

const COMPONENT_CROPS = [
  { src: "/pathfold-overview.jpg", position: "82% 32%", alt: "Detail of the PathFold overview: the native fold" },
  { src: "/pathfold-overview.jpg", position: "84% 52%", alt: "Detail of the PathFold overview: off-pathway misfolding into fibrils" },
  { src: "/pathfold-overview.jpg", position: "70% 80%", alt: "Detail of the PathFold overview: the kinetically ordered pathway" },
];

export default function ResearchPage() {
  return (
    <>
      <PageHero
        eyebrow="Research"
        title="How PathFold learns folding dynamics"
        description="PathFold combines the representational power of large protein language models with constraints from energy-landscape theory to act as a scalable surrogate for molecular dynamics, enabling kinetic inference and misfolding divergence detection across large and diverse protein families."
      />

      {/* Tiered supervision: the three tiers step across the page */}
      <Section id="supervision" tight>
        <SectionHeading
          title="A tiered supervision signal"
          description="Direct folding trajectories exist only for a handful of small proteins. PathFold therefore integrates three complementary data tiers, which also makes the central data-availability problem of trajectory-based modelling explicit and tractable."
        />
        <div className="mt-16">
          <Staircase steps={TIERS} />
        </div>
      </Section>

      {/* Energy-based latent space: figure in the left zone, text on the axis */}
      <Section tone="elevated" id="latent">
        <div className="grid-12 gap-y-10">
          <div className="aside-zone order-2 lg:order-1">
            <Reveal className="lg:sticky lg:top-24">
              <LatentFigure />
            </Reveal>
          </div>
          <div className="axis order-1 lg:order-2">
            <h2 className="t-head">Energy-based latent representation learning</h2>
            <p className="t-lead mt-6 max-w-[42ch] text-ink-soft">
              Pre-trained protein language models such as ESM-2 and ProtT5-XL capture rich co-evolutionary dependencies, but their latent spaces
              are not organised by free energy and do not encode the directed, downhill nature of folding trajectories.
            </p>
            <p className="t-body mt-8 max-w-[64ch]">
              PathFold adapts these embeddings with an energy-informed contrastive learning scheme grounded in energy-landscape theory. Every
              conformation is described by residue-resolved geometric descriptors (contact maps, torsion angles, solvent exposure,
              secondary-structure states). A free-energy surrogate, the fraction of native contacts Q combined with a statistical contact
              potential, assigns a scalar energy to each conformation. Conformations with similar Q form positive pairs, distant ones negative
              pairs, and an InfoNCE loss in the residue-resolved embedding space pulls energetically adjacent conformations together.
            </p>
            <p className="t-body mt-5 max-w-[64ch]">
              The result is a thermodynamically ordered latent manifold in which neighbouring points represent plausible sequential steps along
              a folding pathway, the geometric foundation for PathFold-P. A lightweight two-layer MLP projects PLM embeddings (ESM-2 650M: 1280
              dims; ProtT5-XL: 1024 dims) into this energy-aligned space.
            </p>
          </div>
        </div>
      </Section>

      {/* Components in depth */}
      <Section tone="sky" id="components">
        <PinnedRows
          heading="The three components in depth"
          intro="The trajectory model, the misfolding model and the open platform that ships both."
          blocks={COMPONENTS.map((c, i) => ({
            key: c.key,
            title: c.name,
            kicker: c.kicker,
            summary: c.summary,
            details: c.details,
            image: COMPONENT_CROPS[i],
          }))}
        />
      </Section>

      {/* Open data sources: a table without lines */}
      <Section id="datasets">
        <SectionHeading
          title="Open data sources"
          description="PathFold relies exclusively on publicly licensed, FAIR-compliant molecular and sequence resources. They are harmonised through standardised identifier mappings between UniProt accessions, PDB entry IDs and the annotation databases, so that sequence, structure, dynamics, disorder, aggregation and variant information line up for every protein."
        />
        <Reveal className="mt-14">
          <Table className="t-body">
            <TableHeader>
              <TableRow className="border-0 hover:bg-transparent">
                <TableHead className="h-auto px-4 pb-3 t-small font-medium text-ink-soft sm:px-6">Resource</TableHead>
                <TableHead className="h-auto px-4 pb-3 t-small font-medium text-ink-soft sm:px-6">What it contributes</TableHead>
                <TableHead className="h-auto px-4 pb-3 text-right t-small font-medium text-ink-soft sm:px-6">Link</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {DATA_SOURCES.map((s) => (
                <TableRow key={s.name} className="border-0 odd:bg-paper-2 hover:bg-sky/60">
                  <TableCell className="whitespace-normal px-4 py-4 align-top font-semibold sm:px-6">{s.name}</TableCell>
                  <TableCell className="whitespace-normal px-4 py-4 align-top sm:px-6">{s.role}</TableCell>
                  <TableCell className="px-4 py-4 text-right align-top sm:px-6">
                    <a href={s.url} target="_blank" rel="noreferrer" className="link inline-flex items-center gap-1 font-medium whitespace-nowrap">
                      Visit <ArrowUpRight className="h-4 w-4" />
                    </a>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Reveal>
      </Section>

      {/* Applications: a colour page in the misfold colour */}
      <Section tone="coral" id="applications">
        <SectionHeading
          title="Neurodegenerative diseases"
          description="Application to neurodegenerative diseases: as a concrete health-relevance deliverable, PathFold produces variant-resolved dynamic misfolding maps for amyloid-β (Aβ40, Aβ42), tau and α-synuclein in collaboration with DZNE, the three clinically most important proteinopathies."
        />
        <ul className="mt-16 grid gap-10 sm:grid-cols-3 sm:gap-6">
          {APPLICATIONS.map((a, i) => (
            <Reveal key={a.title} as="li" delay={i * 0.07} className="max-w-[38ch]">
              <h3 className="text-[1.5rem] font-semibold leading-tight tracking-[-0.02em]">{a.title}</h3>
              <p className="t-body mt-4">{a.body}</p>
            </Reveal>
          ))}
        </ul>
      </Section>
    </>
  );
}

function LatentFigure() {
  return (
    <figure className="bg-white p-4 sm:p-6">
      <svg viewBox="0 0 520 320" className="w-full" role="img" aria-label="Schematic energy-aligned latent space with folding and misfolding trajectories">
        {[0, 1, 2, 3, 4].map((i) => (
          <ellipse key={`n${i}`} cx="400" cy="110" rx={30 + i * 26} ry={20 + i * 18} fill="none" stroke="#1d5fe0" strokeOpacity={0.5 - i * 0.09} />
        ))}
        {[0, 1, 2, 3].map((i) => (
          <ellipse key={`m${i}`} cx="380" cy="250" rx={22 + i * 22} ry={16 + i * 14} fill="none" stroke="#d9462b" strokeOpacity={0.5 - i * 0.11} />
        ))}
        <circle cx="400" cy="110" r="26" fill="#bfdbff" />
        <circle cx="380" cy="250" r="20" fill="#ff8a6a" />
        <path d="M30 170 C 110 120, 170 230, 240 160 S 340 110, 398 112" fill="none" stroke="#1d5fe0" strokeWidth="3" strokeLinecap="round" className="animate-dash" />
        <path d="M30 170 C 110 120, 170 230, 240 160 S 310 240, 378 248" fill="none" stroke="#d9462b" strokeWidth="3" strokeLinecap="round" strokeDasharray="6 6" />
        <circle cx="30" cy="170" r="6" fill="#ffffff" stroke="#0c1424" strokeWidth="2" />
        <circle cx="240" cy="160" r="6" fill="#ffffff" stroke="#0c1424" strokeWidth="2" />
        <circle cx="398" cy="112" r="7" fill="#ffffff" stroke="#1d5fe0" strokeWidth="2.5" />
        <circle cx="378" cy="248" r="7" fill="#ffffff" stroke="#d9462b" strokeWidth="2.5" />
        <text x="18" y="200" fill="#46506a" fontSize="12" fontFamily="inherit">Unfolded</text>
        <text x="206" y="192" fill="#46506a" fontSize="12" fontFamily="inherit">Shared intermediate</text>
        <text x="414" y="100" fill="#0f3fb0" fontSize="12" fontFamily="inherit">Native basin</text>
        <text x="392" y="280" fill="#b8361e" fontSize="12" fontFamily="inherit">Kinetic trap</text>
      </svg>
      <figcaption className="t-small mt-3 text-ink-soft">
        Energy-aligned latent space (schematic) · solid: productive folding · dashed: off-pathway divergence
      </figcaption>
    </figure>
  );
}
