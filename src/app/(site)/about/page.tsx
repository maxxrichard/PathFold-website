import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { PageHero, Section, SectionHeading } from "@/components/ui/Section";
import { Reveal } from "@/components/ui/Reveal";
import { Badge } from "@/components/ui/Badge";
import { getSettings } from "@/lib/settings";
import { PROJECT, RESEARCH_QUESTIONS, HYPOTHESES, FAIR_PRINCIPLES, TIMELINE } from "@/lib/content";

export const metadata: Metadata = {
  title: "About",
  description:
    "PathFold – Language Modelling for Protein (Mis-)Folding Pathway Dynamics: goals, research questions and roadmap.",
};

export default async function AboutPage() {
  const settings = await getSettings();

  return (
    <>
      <PageHero eyebrow="About the project" title="Language modelling for protein (mis-)folding pathway dynamics">
        <ul className="flex flex-wrap gap-2" aria-label="Keywords">
          {PROJECT.keywords.map((k) => (
            <li key={k}>
              <Badge>{k}</Badge>
            </li>
          ))}
        </ul>
      </PageHero>

      {/* Text page: key facts in the left zone, the argument on the axis */}
      <Section tight>
        <div className="grid-12 gap-y-12">
          <aside className="aside-zone order-2 lg:order-1">
            <dl className="t-body space-y-5 lg:sticky lg:top-24">
              <h2 className="text-[1.25rem] font-semibold tracking-[-0.015em]">Key facts</h2>
              <Fact label="Project" value={PROJECT.fullTitle} />
              <Fact label="Duration" value={PROJECT.duration} />
              <Fact label="Coordinator" value={`${settings.contactName}, ${PROJECT.coordinatorInstitution}`} />
              <Fact label="Funding authority" value={PROJECT.funding} />
              <Fact label="Programme" value={PROJECT.programme} />
              <Fact label="Grant number" value={PROJECT.grantNumber} />
              <div>
                <dt className="t-small text-ink-soft">Research topics</dt>
                <dd className="mt-1.5 flex flex-wrap gap-1.5">
                  {PROJECT.researchTopics.map((t) => (
                    <Badge key={t} tone="blue">
                      {t}
                    </Badge>
                  ))}
                </dd>
              </div>
              <div>
                <dt className="t-small text-ink-soft">Application fields</dt>
                <dd className="mt-1.5 flex flex-wrap gap-1.5">
                  {PROJECT.applicationFields.map((t) => (
                    <Badge key={t} tone="success">
                      {t}
                    </Badge>
                  ))}
                </dd>
              </div>
            </dl>
          </aside>

          <div className="axis order-1 lg:order-2">
            <div className="prose prose-pathfold max-w-[66ch]">
              <p className="t-lead">
                Protein folding is one of the most consequential molecular processes in biology. It determines whether a polypeptide chain
                reaches its native, functional conformation or diverges into a structurally aberrant state that causes disease. Instead of
                adopting a fixed shape immediately, a chain navigates a rugged, multi-dimensional energy landscape shaped by metastable
                intermediates, kinetic traps and competing transition routes before it settles into a stable native state or a misfolded
                configuration. The order, timing and cooperativity of structure formation along this trajectory decide folding efficiency,
                the stability of intermediates and the susceptibility to aggregation.
              </p>
              <p>
                In amyloid-forming proteins such as amyloid-β, tau and α-synuclein, early off-pathway conformations trigger the nucleation
                and spread of toxic oligomeric aggregates years or decades before neuronal damage becomes detectable. An estimated 9.1 million
                people in Europe live with dementia, projected to rise to 14.3 million by 2050. Despite transformative progress in static
                structure prediction, this dynamic dimension of protein biology remains computationally inaccessible at scale.
              </p>
              <p>
                <strong>PathFold closes this gap</strong> by developing a generative framework that learns and predicts how proteins fold and
                misfold over time directly from their amino acid sequences. Rather than predicting a single final structure, PathFold models
                the folding process as a coarse-grained, kinetically ordered sequence of structural transitions and captures the order, timing
                and interdependence of the conformational events that govern stability. Because direct experimental folding trajectories exist
                only for a limited set of small model proteins, PathFold combines them with indirect kinetic observables (HDX-MS protection
                factors, NMR conformational ensembles) and energy-informed surrogates into a tiered supervision signal.
              </p>
              <p>
                The framework consists of three complementary components: the trajectory generation model{" "}
                <Link href="/research#pathfold-p">PathFold-P</Link>, the probabilistic misfolding detection model{" "}
                <Link href="/research#pathfold-m">PathFold-M</Link>, and the <Link href="/research#toolbox">PathFold-Toolbox</Link> with the
                DynBench benchmarking framework.
              </p>
            </div>
          </div>
        </div>

        <Reveal as="figure" className="mt-20">
          <Image
            src="/pathfold-overview.webp"
            alt="PathFold overview infographic"
            width={1536}
            height={1024}
            sizes="100vw"
            className="w-full"
          />
          <figcaption className="t-body mt-4 max-w-[60ch] text-ink-soft lg:ml-[41.7%]">
            From sequence to dynamic folding pathways: productive folding towards the native state (blue) versus off-pathway misfolding into
            toxic oligomers and fibrils (red).
          </figcaption>
        </Reveal>
      </Section>

      {/* Research questions & hypotheses: a colour page */}
      <Section tone="sky" id="questions">
        <SectionHeading title="Two research questions, two hypotheses" />
        <div className="mt-14 grid-12 gap-y-12">
          {RESEARCH_QUESTIONS.map((rq, i) => (
            <Reveal key={rq.code} delay={i * 0.05} className="axis">
              <h3 className="t-lead max-w-[46ch] font-medium">
                <span className="text-ink-soft">{rq.code}. </span>
                {rq.question}
              </h3>
              <p className="t-body mt-5 max-w-[66ch]">{rq.answer}</p>
            </Reveal>
          ))}
          <ul className="axis grid gap-8 sm:grid-cols-2">
            {HYPOTHESES.map((h, i) => (
              <Reveal key={h.code} as="li" delay={i * 0.05} className="t-body max-w-[44ch]">
                <span className="font-medium">Hypothesis {h.code}. </span>
                {h.text}
              </Reveal>
            ))}
          </ul>
        </div>
      </Section>

      {/* Roadmap: a banded table, the year printed once per group */}
      <Section id="roadmap">
        <SectionHeading title="Roadmap" description="Exploitation and outlook, release by release." />
        <ol className="mt-14">
          {TIMELINE.map((t, i) => (
            <Reveal as="li" key={t.year} delay={i * 0.05} className="grid grid-cols-12 gap-x-6 gap-y-3 px-4 py-6 odd:band sm:px-6">
              <p className="tabular col-span-12 text-[clamp(1.75rem,1rem+2vw,2.5rem)] font-bold leading-none tracking-[-0.03em] sm:col-span-2">{t.year}</p>
              <ul className="col-span-12 space-y-2.5 t-body sm:col-span-10 lg:col-start-6 lg:col-span-7">
                {t.items.map((it) => (
                  <li key={it} className="flex gap-3">
                    <span className="mt-[0.72em] h-1.5 w-1.5 shrink-0 bg-native" aria-hidden="true" />
                    <span>{it}</span>
                  </li>
                ))}
              </ul>
            </Reveal>
          ))}
        </ol>
      </Section>

      {/* Open science: the night band */}
      <Section tone="night" id="open-science">
        <SectionHeading title="FAIR by design, open by default" description="Open science and ethics." />
        <ul className="mt-14 grid gap-x-6 gap-y-8 lg:grid-cols-12">
          {FAIR_PRINCIPLES.map((p, i) => (
            <Reveal key={i} as="li" delay={i * 0.05} className={`t-body flex max-w-[48ch] gap-3 lg:col-span-6 ${i % 2 === 0 ? "lg:col-start-1" : "lg:col-start-7"}`}>
              <span className="mt-[0.72em] h-1.5 w-1.5 shrink-0 bg-coral" aria-hidden="true" />
              <span>{p}</span>
            </Reveal>
          ))}
        </ul>
      </Section>
    </>
  );
}

function Fact({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="t-small text-ink-soft">{label}</dt>
      <dd className="mt-0.5 font-medium">{value}</dd>
    </div>
  );
}
