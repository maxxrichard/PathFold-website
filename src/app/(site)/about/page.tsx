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
        <div className="grid gap-12 lg:grid-cols-12">
          <aside className="order-2 lg:order-1 lg:col-span-4">
            <dl className="panel t-body space-y-5 p-6 lg:sticky lg:top-28">
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

          <div className="order-1 lg:order-2 lg:col-span-8 lg:col-start-5">
            <div className="max-w-[66ch]">
              <p className="t-lead">
                Protein folding decides whether a polypeptide chain reaches its native, functional conformation or diverges into a state that
                causes disease. A chain navigates a rugged energy landscape of intermediates, kinetic traps and competing routes, and the
                order, timing and cooperativity of that trajectory decide stability and the susceptibility to aggregation.
              </p>

              <div className="mt-8 grid gap-4 sm:grid-cols-2">
                <div className="panel p-5">
                  <p className="text-[2rem] font-semibold leading-none tracking-[-0.02em] text-native">9.1 million</p>
                  <p className="t-body mt-2 text-ink-soft">people in Europe live with dementia today</p>
                </div>
                <div className="panel p-5">
                  <p className="text-[2rem] font-semibold leading-none tracking-[-0.02em] text-native">14.3 million</p>
                  <p className="t-body mt-2 text-ink-soft">projected by 2050</p>
                </div>
              </div>
              <p className="t-body mt-5 text-ink-soft">
                In amyloid-forming proteins such as amyloid-β, tau and α-synuclein, early off-pathway conformations trigger toxic aggregates
                years or decades before neuronal damage becomes detectable. This dynamic dimension of protein biology remains computationally
                inaccessible at scale.
              </p>

              <h2 className="mt-10 text-[1.25rem] font-semibold tracking-[-0.015em]">PathFold closes this gap</h2>
              <ul className="mt-4 space-y-3 t-body text-ink-soft">
                <li className="flex gap-3">
                  <span className="mt-[0.7em] h-1.5 w-1.5 shrink-0 rounded-full bg-native" aria-hidden="true" />
                  <span>A generative framework that learns how proteins fold and misfold over time, directly from their amino acid sequence.</span>
                </li>
                <li className="flex gap-3">
                  <span className="mt-[0.7em] h-1.5 w-1.5 shrink-0 rounded-full bg-native" aria-hidden="true" />
                  <span>Folding modelled as a kinetically ordered sequence of structural transitions, not a single final structure.</span>
                </li>
                <li className="flex gap-3">
                  <span className="mt-[0.7em] h-1.5 w-1.5 shrink-0 rounded-full bg-native" aria-hidden="true" />
                  <span>A tiered supervision signal: experimental trajectories, indirect kinetic observables (HDX-MS, NMR) and energy-informed surrogates.</span>
                </li>
                <li className="flex gap-3">
                  <span className="mt-[0.7em] h-1.5 w-1.5 shrink-0 rounded-full bg-native" aria-hidden="true" />
                  <span>
                    Three components: <Link href="/research#pathfold-p" className="link font-medium text-ink">PathFold-P</Link>,{" "}
                    <Link href="/research#pathfold-m" className="link font-medium text-ink">PathFold-M</Link> and the{" "}
                    <Link href="/research#toolbox" className="link font-medium text-ink">PathFold-Toolbox</Link> with DynBench.
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <Reveal as="figure" className="mt-16">
          <Image
            src="/pathfold-overview.webp"
            alt="PathFold overview infographic"
            width={1536}
            height={1024}
            sizes="(max-width: 1280px) 100vw, 1216px"
            className="w-full rounded-xl"
          />
          <figcaption className="t-small mt-3 max-w-[70ch] text-ink-soft">
            From sequence to dynamic folding pathways: productive folding towards the native state (blue) versus off-pathway misfolding into
            toxic oligomers and fibrils (red).
          </figcaption>
        </Reveal>
      </Section>

      {/* Research questions & hypotheses: a colour page */}
      <Section tone="elevated" id="questions">
        <SectionHeading title="Two research questions, two hypotheses" />
        <div className="mt-12 grid gap-10 lg:grid-cols-2 lg:gap-12">
          {RESEARCH_QUESTIONS.map((rq, i) => (
            <Reveal key={rq.code} delay={i * 0.05} className="panel p-6 sm:p-8">
              <h3 className="t-lead max-w-[46ch] font-medium">
                <span className="text-ink-soft">{rq.code}. </span>
                {rq.question}
              </h3>
              <ul className="mt-5 space-y-2.5 t-body text-ink-soft">
                {rq.answer.split(/(?<=[.;])\s+(?=[A-Z])/).map((sentence) => (
                  <li key={sentence} className="flex gap-3">
                    <span className="mt-[0.7em] h-1.5 w-1.5 shrink-0 rounded-full bg-native" aria-hidden="true" />
                    <span>{sentence}</span>
                  </li>
                ))}
              </ul>
            </Reveal>
          ))}
          <ul className="grid gap-8 sm:grid-cols-2 lg:col-span-2">
            {HYPOTHESES.map((h, i) => (
              <Reveal key={h.code} as="li" delay={i * 0.05} className="t-body rule pt-5">
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
        <ol className="mt-10 divide-y divide-border border-y border-border">
          {TIMELINE.map((t, i) => (
            <Reveal as="li" key={t.year} delay={i * 0.05} className="grid grid-cols-12 gap-x-6 gap-y-3 py-7">
              <p className="tabular col-span-12 text-[1.5rem] font-semibold leading-none tracking-[-0.02em] sm:col-span-2">{t.year}</p>
              <ul className="col-span-12 space-y-2.5 t-body sm:col-span-10 lg:col-span-8">
                {t.items.map((it) => (
                  <li key={it} className="flex gap-3">
                    <span className="mt-[0.7em] h-1.5 w-1.5 shrink-0 rounded-full bg-native" aria-hidden="true" />
                    <span>{it}</span>
                  </li>
                ))}
              </ul>
            </Reveal>
          ))}
        </ol>
      </Section>

      {/* Open science: the night band */}
      <Section id="open-science" className="border-t border-border">
        <SectionHeading title="FAIR by design, open by default" description="Open science and ethics." />
        <ul className="mt-12 grid gap-x-10 gap-y-8 sm:grid-cols-2">
          {FAIR_PRINCIPLES.map((p, i) => (
            <Reveal key={i} as="li" delay={i * 0.05} className="t-body flex max-w-[52ch] gap-3 text-ink-soft">
              <span className="mt-[0.7em] h-1.5 w-1.5 shrink-0 rounded-full bg-native" aria-hidden="true" />
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
