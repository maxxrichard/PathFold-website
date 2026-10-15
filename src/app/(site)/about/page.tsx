import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { CheckCircle2, ExternalLink } from "lucide-react";
import { PageHero, Section, SectionHeading } from "@/components/ui/Section";
import { Reveal } from "@/components/ui/Reveal";
import { Badge, statusTone } from "@/components/ui/Badge";
import { Markdown } from "@/components/ui/Markdown";
import { PartnerCard } from "@/components/site/cards";
import { getPartners, getWorkPackages, getMilestones } from "@/lib/data";
import { getSettings } from "@/lib/settings";
import { PROJECT, RESEARCH_QUESTIONS, HYPOTHESES, SUCCESS_CRITERIA, FAIR_PRINCIPLES, TIMELINE } from "@/lib/content";

export const metadata: Metadata = {
  title: "About",
  description:
    "PathFold – Language Modelling for Protein (Mis-)Folding Pathway Dynamics: goals, research questions, work plan, milestones and partners.",
};

export default async function AboutPage() {
  const [partners, workPackages, milestones, settings] = await Promise.all([getPartners(), getWorkPackages(), getMilestones(), getSettings()]);

  return (
    <>
      <PageHero eyebrow="About the project" title={<>Language modelling for protein <span className="text-gradient">(mis-)folding</span> pathway dynamics</>}>
        <div className="mt-8 flex flex-wrap gap-2">
          {PROJECT.keywords.map((k) => (
            <Badge key={k}>{k}</Badge>
          ))}
        </div>
      </PageHero>

      <Section>
        <div className="grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-8">
            <div className="prose prose-invert prose-pathfold max-w-none prose-p:text-[1.05rem] prose-p:leading-relaxed">
              <p>
                Protein folding is one of the most consequential molecular processes in biology. It determines whether a
                polypeptide chain reaches its native, functional conformation or diverges into a structurally aberrant state
                that causes disease. Instead of adopting a fixed shape immediately, a chain navigates a rugged,
                multi-dimensional energy landscape shaped by metastable intermediates, kinetic traps and competing
                transition routes before it settles into a stable native state or a misfolded configuration. The order,
                timing and cooperativity of structure formation along this trajectory decide folding efficiency, the
                stability of intermediates and the susceptibility to aggregation.
              </p>
              <p>
                In amyloid-forming proteins such as amyloid-β, tau and α-synuclein, early off-pathway conformations trigger
                the nucleation and spread of toxic oligomeric aggregates years or decades before neuronal damage becomes
                detectable. An estimated 9.1 million people in Europe live with dementia, projected to rise to 14.3 million
                by 2050. Despite transformative progress in static structure prediction, this dynamic dimension of protein
                biology remains computationally inaccessible at scale.
              </p>
              <p>
                <strong>PathFold closes this gap</strong> by developing a generative framework that learns and predicts how
                proteins fold and misfold over time directly from their amino acid sequences. Rather than predicting a
                single final structure, PathFold models the folding process as a coarse-grained, kinetically ordered
                sequence of structural transitions and captures the order, timing and interdependence of the conformational
                events that govern stability. Because direct experimental folding trajectories exist only for a limited set
                of small model proteins, PathFold combines them with indirect kinetic observables (HDX-MS protection
                factors, NMR conformational ensembles) and energy-informed surrogates into a tiered supervision signal.
              </p>
              <p>
                The framework consists of three complementary components: the trajectory generation model{" "}
                <Link href="/research#pathfold-p">PathFold-P</Link>, the probabilistic misfolding detection model{" "}
                <Link href="/research#pathfold-m">PathFold-M</Link>, and the <Link href="/research#toolbox">PathFold-Toolbox</Link>{" "}
                with the DynBench benchmarking framework.
              </p>
            </div>

            <Reveal className="mt-12">
              <figure className="card overflow-hidden p-1.5">
                <Image
                  src="/pathfold-overview.webp"
                  alt="PathFold overview infographic"
                  width={1536}
                  height={1024}
                  className="w-full rounded-[1rem]"
                />
                <figcaption className="px-4 py-3 text-xs text-fg-subtle">
                  From sequence to dynamic folding pathways: productive folding towards the native state (blue) versus
                  off-pathway misfolding into toxic oligomers and fibrils (red).
                </figcaption>
              </figure>
            </Reveal>
          </div>

          {/* Key facts sidebar (mirrors the DFKI project-page layout) */}
          <aside className="lg:col-span-4">
            <div className="card sticky top-24 p-6">
              <h2 className="font-display text-lg font-semibold text-fg">Key facts</h2>
              <dl className="mt-5 space-y-4 text-sm">
                <Fact label="Project" value={PROJECT.fullTitle} />
                <Fact label="Duration" value={PROJECT.duration} />
                <Fact label="Coordinator" value={`${settings.contactName}, ${PROJECT.coordinatorInstitution}`} />
                <Fact label="Funding authority" value={PROJECT.funding} />
                <Fact label="Programme" value={PROJECT.programme} />
                <Fact label="Grant number" value={PROJECT.grantNumber} />
                <div>
                  <dt className="text-fg-subtle">Research topics</dt>
                  <dd className="mt-1.5 flex flex-wrap gap-1.5">
                    {PROJECT.researchTopics.map((t) => (
                      <Badge key={t} tone="blue">
                        {t}
                      </Badge>
                    ))}
                  </dd>
                </div>
                <div>
                  <dt className="text-fg-subtle">Application fields</dt>
                  <dd className="mt-1.5 flex flex-wrap gap-1.5">
                    {PROJECT.applicationFields.map((t) => (
                      <Badge key={t} tone="success">
                        {t}
                      </Badge>
                    ))}
                  </dd>
                </div>
              </dl>
              {settings.dfkiProjectUrl && (
                <a href={settings.dfkiProjectUrl} target="_blank" rel="noreferrer" className="btn btn-secondary btn-sm mt-6 w-full">
                  DFKI project page <ExternalLink className="h-3.5 w-3.5" />
                </a>
              )}
            </div>
          </aside>
        </div>
      </Section>

      {/* Research questions & hypotheses */}
      <Section tone="elevated" id="questions">
        <SectionHeading eyebrow="Scientific objectives" title="Two research questions, two hypotheses" />
        <div className="mt-10 grid gap-5 lg:grid-cols-2">
          {RESEARCH_QUESTIONS.map((rq, i) => (
            <Reveal key={rq.code} delay={i * 0.07}>
              <article className="card h-full p-7">
                <Badge tone="cyan">{rq.code}</Badge>
                <h3 className="font-display mt-4 text-xl font-semibold leading-snug text-fg">{rq.question}</h3>
                <p className="mt-4 text-sm leading-relaxed text-fg-muted">{rq.answer}</p>
              </article>
            </Reveal>
          ))}
        </div>
        <div className="mt-5 grid gap-5 lg:grid-cols-2">
          {HYPOTHESES.map((h, i) => (
            <Reveal key={h.code} delay={i * 0.07}>
              <article className="card h-full border-brand-violet/30 p-7">
                <Badge tone="violet">Hypothesis {h.code}</Badge>
                <p className="mt-4 text-base leading-relaxed text-fg">{h.text}</p>
              </article>
            </Reveal>
          ))}
        </div>
        <div className="mt-12">
          <h3 className="font-display text-2xl font-semibold text-fg">Project success will be measured against</h3>
          <ul className="mt-6 space-y-4">
            {SUCCESS_CRITERIA.map((c, i) => (
              <Reveal key={i} as="li" delay={i * 0.05} className="flex gap-3 text-sm leading-relaxed text-fg-muted">
                <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-success" />
                <span>{c}</span>
              </Reveal>
            ))}
          </ul>
        </div>
      </Section>

      {/* Work plan */}
      <Section id="workplan">
        <SectionHeading
          eyebrow="Work plan"
          title="Five work packages over 36 months"
          description="Each work package contributes a modular deliverable towards the PathFold-Toolbox, an open-science platform for trajectory simulation and molecular stability analysis."
        />
        <div className="mt-10 space-y-4">
          {workPackages.map((wp, i) => (
            <Reveal key={wp.id} delay={i * 0.04}>
              <details className="card group overflow-hidden" open={i === 0}>
                <summary className="flex cursor-pointer list-none items-start gap-5 p-6 [&::-webkit-details-marker]:hidden">
                  <span className="font-display flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-cyan to-brand-indigo text-lg font-bold text-bg">
                    {wp.number}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="flex flex-wrap items-center gap-2 text-xs text-fg-subtle">
                      <span className="font-mono">{wp.period}</span>
                      {wp.lead && <span>· Lead: {wp.lead}</span>}
                    </span>
                    <span className="font-display mt-1 block text-xl font-semibold text-fg">{wp.title}</span>
                    <span className="mt-2 block text-sm leading-relaxed text-fg-muted">{wp.summary}</span>
                  </span>
                  <span className="ml-auto mt-2 text-fg-subtle transition group-open:rotate-180">▾</span>
                </summary>
                <div className="border-t border-border px-6 py-6 sm:pl-[5.75rem]">
                  <Markdown content={wp.objectives} className="prose-sm" />
                  {wp.deliverables && (
                    <p className="mt-5 text-sm">
                      <span className="font-semibold text-fg">Deliverables: </span>
                      <span className="text-fg-muted">{wp.deliverables}</span>
                    </p>
                  )}
                </div>
              </details>
            </Reveal>
          ))}
        </div>
      </Section>

      {/* Milestones */}
      <Section tone="elevated" id="milestones">
        <SectionHeading eyebrow="Milestones" title="Measurable checkpoints" />
        <ol className="relative mt-12 space-y-8 border-l border-border pl-8">
          {milestones.map((m, i) => (
            <Reveal key={m.id} as="li" delay={i * 0.05} className="relative">
              <span className="absolute -left-[2.4rem] top-1 flex h-5 w-5 items-center justify-center rounded-full border-2 border-brand-cyan bg-bg">
                <span className="h-1.5 w-1.5 rounded-full bg-brand-cyan" />
              </span>
              <div className="flex flex-wrap items-center gap-2 text-xs">
                <Badge tone="cyan">{m.code}</Badge>
                <span className="font-mono text-fg-subtle">{m.due}</span>
                {m.workPackage && <span className="text-fg-subtle">· {m.workPackage}</span>}
                <Badge tone={statusTone(m.status)}>{m.status}</Badge>
              </div>
              <h3 className="font-display mt-2 text-lg font-semibold text-fg">{m.title}</h3>
              <p className="mt-1.5 max-w-3xl text-sm leading-relaxed text-fg-muted">{m.description}</p>
            </Reveal>
          ))}
        </ol>
      </Section>

      {/* Roadmap */}
      <Section id="roadmap">
        <SectionHeading eyebrow="Exploitation & outlook" title="Roadmap" />
        <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
          {TIMELINE.map((t, i) => (
            <Reveal key={t.year} delay={i * 0.06}>
              <div className="card h-full p-6">
                <p className="font-display text-3xl font-bold text-gradient">{t.year}</p>
                <ul className="mt-4 space-y-2 text-sm text-fg-muted">
                  {t.items.map((it) => (
                    <li key={it} className="flex gap-2">
                      <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-brand-cyan" />
                      <span>{it}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          ))}
        </div>
      </Section>

      {/* Open science */}
      <Section tone="elevated" id="open-science">
        <SectionHeading eyebrow="Open science & ethics" title="FAIR by design, open by default" />
        <ul className="mt-10 grid gap-5 md:grid-cols-2">
          {FAIR_PRINCIPLES.map((p, i) => (
            <Reveal key={i} as="li" delay={i * 0.05} className="card flex gap-4 p-6 text-sm leading-relaxed text-fg-muted">
              <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-brand-cyan" />
              <span>{p}</span>
            </Reveal>
          ))}
        </ul>
      </Section>

      {/* Partners */}
      <Section id="partners">
        <SectionHeading eyebrow="Consortium" title="Partners" />
        <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {partners.map((p, i) => (
            <Reveal key={p.id} delay={i * 0.06} className="h-full">
              <PartnerCard partner={p} />
            </Reveal>
          ))}
        </div>
        <p className="mt-8 max-w-3xl text-sm leading-relaxed text-fg-subtle">{settings.fundingText}</p>
      </Section>
    </>
  );
}

function Fact({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-fg-subtle">{label}</dt>
      <dd className="mt-0.5 font-medium text-fg">{value}</dd>
    </div>
  );
}
