import type { Metadata } from "next";
import Link from "next/link";
import { PageHero, Section, SectionHeading } from "@/components/ui/Section";
import { Reveal } from "@/components/ui/Reveal";
import { Badge } from "@/components/ui/Badge";
import { Roadmap } from "@/components/site/Roadmap";
import { getSettings } from "@/lib/settings";
import { PROJECT, RESEARCH_QUESTIONS, HYPOTHESES, FAIR_POINTS, TIMELINE } from "@/lib/content";

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

      {/* Key facts beside the argument */}
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
                Whether a protein reaches its functional fold or misfolds is decided along its folding pathway: the order, timing and
                cooperativity of structural transitions. Static structure prediction cannot see this process.
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
              <p className="t-body mt-4 text-ink-soft">
                In amyloid-β, tau and α-synuclein, early off-pathway conformations trigger toxic aggregates years before symptoms appear.
              </p>

              <h2 className="mt-10 text-[1.25rem] font-semibold tracking-[-0.015em]">What PathFold does</h2>
              <ul className="mt-4 space-y-3 t-body text-ink-soft">
                <li className="flex gap-3">
                  <span className="mt-[0.7em] h-1.5 w-1.5 shrink-0 rounded-full bg-native" aria-hidden="true" />
                  <span>Learns how proteins fold and misfold over time, directly from the amino acid sequence.</span>
                </li>
                <li className="flex gap-3">
                  <span className="mt-[0.7em] h-1.5 w-1.5 shrink-0 rounded-full bg-native" aria-hidden="true" />
                  <span>Predicts a kinetically ordered pathway and the point where productive folding and misfolding diverge.</span>
                </li>
                <li className="flex gap-3">
                  <span className="mt-[0.7em] h-1.5 w-1.5 shrink-0 rounded-full bg-native" aria-hidden="true" />
                  <span>
                    Ships three open components:{" "}
                    <Link href="/research#pathfold-p" className="link font-medium text-ink">
                      PathFold-P
                    </Link>
                    ,{" "}
                    <Link href="/research#pathfold-m" className="link font-medium text-ink">
                      PathFold-M
                    </Link>{" "}
                    and the{" "}
                    <Link href="/research#toolbox" className="link font-medium text-ink">
                      PathFold-Toolbox
                    </Link>{" "}
                    with DynBench.
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </Section>

      {/* Research questions and hypotheses */}
      <Section tone="elevated" id="questions">
        <SectionHeading title="Two research questions, two hypotheses" />
        <div className="mt-10 grid gap-5 lg:grid-cols-2">
          {RESEARCH_QUESTIONS.map((rq, i) => (
            <Reveal key={rq.code} delay={i * 0.05} className="panel p-6 sm:p-8">
              <p className="t-body font-medium text-native">{rq.code}</p>
              <h3 className="mt-2 text-[1.2rem] font-semibold leading-snug tracking-[-0.015em]">{rq.question}</h3>
              <ul className="mt-5 space-y-2.5 t-body text-ink-soft">
                {rq.points.map((pt) => (
                  <li key={pt} className="flex gap-3">
                    <span className="mt-[0.7em] h-1.5 w-1.5 shrink-0 rounded-full bg-native" aria-hidden="true" />
                    <span>{pt}</span>
                  </li>
                ))}
              </ul>
            </Reveal>
          ))}
          {HYPOTHESES.map((h, i) => (
            <Reveal key={h.code} delay={0.1 + i * 0.05} className="flex gap-4 rounded-lg bg-white/60 p-5">
              <span className="tabular shrink-0 text-[1.25rem] font-semibold leading-none text-native">{h.code}</span>
              <div>
                <p className="t-body font-medium">{h.short}</p>
                <p className="t-small mt-1 text-ink-soft">{h.text}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </Section>

      {/* Roadmap */}
      <Section id="roadmap">
        <SectionHeading title="Roadmap" description="Release by release, from the data foundation in 2027 to the misfolding model and toolbox in 2029." />
        <div className="mt-10">
          <Roadmap stages={TIMELINE} />
        </div>
      </Section>

      {/* Open science */}
      <Section tone="elevated" id="open-science">
        <SectionHeading title="FAIR by design, open by default" />
        <ul className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {FAIR_POINTS.map((p, i) => (
            <Reveal key={p.title} as="li" delay={i * 0.05} className="panel p-5">
              <h3 className="text-[1.05rem] font-semibold tracking-[-0.01em]">{p.title}</h3>
              <p className="t-body mt-2 text-ink-soft">{p.text}</p>
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
