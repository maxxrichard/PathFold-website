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
    line: "Tier 1: direct MD trajectories",
    note: "Long all-atom simulations of about 12 fast-folding proteins and Folding@home subsets, discretised with Markov state models.",
  },
  {
    line: "Tier 2: indirect kinetic observables",
    note: "NMR ensembles, HDX-MS protection factors and Φ-value data serve as partial ordering constraints for larger proteins.",
  },
  {
    line: "Tier 3: physics-informed surrogates",
    note: "Gō-type energy functions, contact-order folding rates and statistical contact potentials enforce thermodynamic plausibility.",
  },
];

export default function ResearchPage() {
  return (
    <>
      <PageHero
        eyebrow="Research"
        title="How PathFold learns folding dynamics"
        description="Protein language models plus energy-landscape constraints: a scalable surrogate for molecular dynamics that infers kinetics and detects misfolding divergence across diverse protein families."
      />

      {/* Tiered supervision: the three tiers step across the page */}
      <Section id="supervision" tight>
        <SectionHeading
          title="A tiered supervision signal"
          description="Direct folding trajectories exist only for a handful of small proteins, so PathFold integrates three complementary data tiers."
        />
        <div className="mt-12">
          <Staircase steps={TIERS} />
        </div>
      </Section>

      {/* Energy-based latent space: figure in the left zone, text on the axis */}
      <Section id="latent" className="border-y border-border">
        <div className="grid gap-10 lg:grid-cols-12">
          <div className="order-2 lg:order-1 lg:col-span-5">
            <Reveal className="lg:sticky lg:top-28">
              <LatentFigure />
            </Reveal>
          </div>
          <div className="order-1 lg:order-2 lg:col-span-6 lg:col-start-7">
            <h2 className="t-head">Energy-based latent representation learning</h2>
            <p className="t-lead mt-5 max-w-[42ch] text-ink-soft">
              Pre-trained protein language models such as ESM-2 and ProtT5-XL capture rich co-evolutionary dependencies, but their latent spaces
              are not organised by free energy and do not encode the directed, downhill nature of folding trajectories.
            </p>
            <ul className="mt-8 space-y-5 t-body">
              <li className="rule pt-5">
                <p className="font-semibold">Energy-informed contrastive learning</p>
                <p className="mt-1 text-ink-soft">
                  Each conformation is described by residue-resolved geometric descriptors: contact maps, torsion angles, solvent exposure and
                  secondary-structure states.
                </p>
              </li>
              <li className="rule pt-5">
                <p className="font-semibold">A free-energy surrogate orders the space</p>
                <p className="mt-1 text-ink-soft">
                  The fraction of native contacts Q with a statistical contact potential assigns each conformation an energy; an InfoNCE loss
                  pulls energetically adjacent conformations together.
                </p>
              </li>
              <li className="rule pt-5">
                <p className="font-semibold">A thermodynamically ordered latent manifold</p>
                <p className="mt-1 text-ink-soft">
                  Neighbouring points are plausible sequential folding steps, the geometric foundation for PathFold-P. A two-layer MLP projects
                  ESM-2 and ProtT5-XL embeddings into this space.
                </p>
              </li>
            </ul>
          </div>
        </div>
      </Section>

      {/* Components in depth */}
      <Section tone="elevated" id="components">
        <PinnedRows
          heading="The three components in depth"
          intro="The trajectory model, the misfolding model and the open platform that ships both."
          blocks={COMPONENTS.map((c) => ({
            key: c.key,
            title: c.name,
            kicker: c.kicker,
            summary: c.summary,
            details: c.details,
          }))}
        />
      </Section>

      {/* Open data sources: a table without lines */}
      <Section id="datasets">
        <SectionHeading
          title="Open data sources"
          description="Publicly licensed, FAIR-compliant resources, harmonised through UniProt and PDB identifiers so that sequence, structure, dynamics, disorder, aggregation and variant data line up for every protein."
        />
        <Reveal className="panel mt-12 overflow-hidden">
          <Table className="t-body">
            <TableHeader>
              <TableRow className="border-0 hover:bg-transparent">
                <TableHead className="h-auto px-4 py-3 t-small font-medium text-ink-soft sm:px-6">Resource</TableHead>
                <TableHead className="h-auto px-4 py-3 t-small font-medium text-ink-soft sm:px-6">What it contributes</TableHead>
                <TableHead className="h-auto px-4 py-3 text-right t-small font-medium text-ink-soft sm:px-6">Link</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {DATA_SOURCES.map((s) => (
                <TableRow key={s.name} className="border-t border-border hover:bg-paper-2">
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
      <Section id="applications">
        <SectionHeading
          title="Application to neurodegenerative diseases"
          description="Variant-resolved dynamic misfolding maps for amyloid-β, tau and α-synuclein, developed with DZNE."
        />
        <ul className="mt-12 grid gap-8 sm:grid-cols-3">
          {APPLICATIONS.map((a, i) => (
            <Reveal key={a.title} as="li" delay={i * 0.07} className="rule pt-6">
              <h3 className="text-[1.25rem] font-semibold leading-snug tracking-[-0.015em]">{a.title}</h3>
              <p className="t-body mt-3 text-ink-soft">{a.body}</p>
            </Reveal>
          ))}
        </ul>
      </Section>
    </>
  );
}

function LatentFigure() {
  return (
    <figure className="panel p-4 sm:p-6">
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
