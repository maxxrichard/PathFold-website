import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Dna, Activity, Boxes, Sparkles } from "lucide-react";
import { HeroCanvas } from "@/components/site/HeroCanvas";
import { PathwayExplorer } from "@/components/site/PathwayExplorer";
import { Section, SectionHeading } from "@/components/ui/Section";
import { Reveal } from "@/components/ui/Reveal";
import { Badge } from "@/components/ui/Badge";
import { NewsCard, PublicationCard, PartnerCard, StatTile } from "@/components/site/cards";
import { EmptyState } from "@/components/ui/EmptyState";
import { getSettings } from "@/lib/settings";
import { getPublishedNews, getFeaturedPublications, getPartners } from "@/lib/data";
import { PROJECT, PROBLEM_CARDS, COMPONENTS } from "@/lib/content";
import { cn } from "@/lib/utils";

const COMPONENT_ICONS = [Dna, Activity, Boxes];

export default async function HomePage() {
  const [settings, news, publications, partners] = await Promise.all([
    getSettings(),
    getPublishedNews(3),
    getFeaturedPublications(3),
    getPartners(),
  ]);

  return (
    <>
      {/* ------------------------------------------------------------ Hero */}
      <section className="relative isolate overflow-hidden pt-28 sm:pt-32">
        <HeroCanvas className="absolute inset-0 -z-10 h-full w-full opacity-90" />
        <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(60%_60%_at_50%_0%,rgba(59,130,246,0.18),transparent_70%)]" />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 -z-10 h-40 bg-gradient-to-b from-transparent to-bg" />

        <div className="container-x">
          <div className="mx-auto max-w-4xl text-center">
            <Reveal>
              <div className="inline-flex flex-wrap items-center justify-center gap-2">
                <Badge tone="cyan">
                  <Sparkles className="h-3 w-3" /> BMFTR · Zukunft eHealth
                </Badge>
                <Badge>{PROJECT.start} – {PROJECT.end}</Badge>
              </div>
            </Reveal>
            <Reveal delay={0.05}>
              <h1 className="font-display mt-6 text-balance text-5xl font-bold leading-[1.05] tracking-tight text-fg sm:text-6xl lg:text-7xl">
                <span className="text-gradient">{settings.heroTitle}</span>
              </h1>
            </Reveal>
            <Reveal delay={0.1}>
              <p className="mx-auto mt-6 max-w-2xl text-pretty text-lg leading-relaxed text-fg-muted sm:text-xl">
                {settings.heroSubtitle}
              </p>
            </Reveal>
            <Reveal delay={0.15}>
              <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
                <Link href="/research" className="btn btn-primary">
                  Explore the research <ArrowRight className="h-4 w-4" />
                </Link>
                <Link href="/about" className="btn btn-secondary">
                  About the project
                </Link>
              </div>
            </Reveal>
          </div>

          <Reveal delay={0.2} className="mt-16 sm:mt-20">
            <div className="relative mx-auto max-w-5xl">
              <div className="absolute -inset-1 rounded-[1.6rem] bg-gradient-to-r from-brand-cyan/30 via-brand-blue/20 to-misfold/30 blur-xl" />
              <div className="card relative overflow-hidden rounded-[1.5rem] p-1.5">
                <Image
                  src="/pathfold-overview.webp"
                  alt="PathFold overview: from an amino acid sequence to predicted folding and misfolding pathways over time"
                  width={1536}
                  height={1024}
                  priority
                  className="w-full rounded-[1.1rem]"
                />
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ------------------------------------------------------- Key facts */}
      <Section className="pt-10 sm:pt-12">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Reveal>
            <StatTile label="Duration" value="36 months" hint={PROJECT.duration} />
          </Reveal>
          <Reveal delay={0.05}>
            <StatTile label="Coordinated by" value="Saarland University" hint="with DFKI and DZNE as associated partners" />
          </Reveal>
          <Reveal delay={0.1}>
            <StatTile label="Funded by" value="BMFTR" hint={`${PROJECT.programme} · ${PROJECT.grantNumber}`} />
          </Reveal>
          <Reveal delay={0.15}>
            <StatTile label="Open science" value="FAIR by design" hint="Open-source models, datasets and benchmark" />
          </Reveal>
        </div>
      </Section>

      {/* --------------------------------------------- Beyond static structures */}
      <Section tone="elevated">
        <SectionHeading
          eyebrow="Beyond static structures"
          title="Folding is a process, not a single structure"
          description="Protein misfolding, not structural damage per se, is the kinetic failure behind Alzheimer's, Parkinson's and related proteinopathies. Early off-pathway conformations of amyloid-β, tau and α-synuclein precede clinical symptoms by years, yet no existing computational tool models this process at scale."
        />
        <div className="mt-12 grid gap-5 lg:grid-cols-3">
          {PROBLEM_CARDS.map((card, i) => (
            <Reveal key={card.title} delay={i * 0.07}>
              <div
                className={cn(
                  "card relative h-full overflow-hidden p-7",
                  card.tone === "brand" && "border-brand-cyan/40 shadow-[0_0_80px_-30px_rgba(56,189,248,0.6)]",
                )}
              >
                {card.tone === "brand" && (
                  <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-brand-cyan to-transparent" />
                )}
                <p className={cn("text-xs font-semibold uppercase tracking-wider", card.tone === "brand" ? "text-brand-cyan" : "text-fg-subtle")}>
                  {card.subtitle}
                </p>
                <h3 className="font-display mt-2 text-2xl font-semibold text-fg">{card.title}</h3>
                <p className="mt-4 text-sm leading-relaxed text-fg-muted">{card.body}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </Section>

      {/* --------------------------------------------------- Explorer */}
      <Section id="explorer">
        <SectionHeading
          eyebrow="Interactive"
          title="From sequence to pathway"
          description="Pick a benchmark protein or paste your own sequence to see a schematic of how PathFold reasons: residue-level propensity tracks, a kinetically ordered trajectory and the point where productive folding and off-pathway misfolding diverge."
        />
        <Reveal className="mt-10">
          <PathwayExplorer />
        </Reveal>
      </Section>

      {/* ------------------------------------------------ Components */}
      <Section tone="elevated" id="components">
        <SectionHeading
          eyebrow="The framework"
          title="Three complementary components"
          description="PathFold combines the representational power of protein language models with constraints from energy-landscape theory, and ships everything as open, reusable artefacts."
        />
        <div className="mt-12 grid gap-5 lg:grid-cols-3">
          {COMPONENTS.map((c, i) => {
            const Icon = COMPONENT_ICONS[i];
            return (
              <Reveal key={c.key} delay={i * 0.07} className="h-full">
                <article className="card card-hover flex h-full flex-col p-7">
                  <div className={cn("inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br text-white", c.accent)}>
                    <Icon className="h-6 w-6" />
                  </div>
                  <p className="mt-5 text-xs font-semibold uppercase tracking-wider text-fg-subtle">{c.kicker}</p>
                  <h3 className="font-display mt-1 text-2xl font-semibold text-fg">{c.name}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-fg-muted">{c.summary}</p>
                  <Link href={`/research#${c.key}`} className="mt-auto inline-flex items-center gap-1 pt-6 text-sm font-semibold text-brand-cyan">
                    Learn more <ArrowRight className="h-4 w-4" />
                  </Link>
                </article>
              </Reveal>
            );
          })}
        </div>
      </Section>

      {/* ----------------------------------------------------- News */}
      <Section id="news">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <SectionHeading eyebrow="Latest" title="News & updates" />
          <Link href="/news" className="btn btn-secondary btn-sm">
            All news <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="mt-10">
          {news.length === 0 ? (
            <EmptyState title="No news yet" description="Project updates will be published here." />
          ) : (
            <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {news.map((post, i) => (
                <Reveal key={post.id} delay={i * 0.07} className="h-full">
                  <NewsCard post={post} />
                </Reveal>
              ))}
            </div>
          )}
        </div>
      </Section>

      {/* ------------------------------------------------ Publications */}
      <Section tone="elevated" id="publications">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <SectionHeading eyebrow="Selected" title="Publications" />
          <Link href="/publications" className="btn btn-secondary btn-sm">
            All publications <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="mt-10">
          {publications.length === 0 ? (
            <EmptyState title="No publications yet" description="Papers, preprints and datasets will appear here." />
          ) : (
            <div className="grid gap-5 lg:grid-cols-3">
              {publications.map((pub, i) => (
                <Reveal key={pub.id} delay={i * 0.07} className="h-full">
                  <PublicationCard pub={pub} />
                </Reveal>
              ))}
            </div>
          )}
        </div>
      </Section>

      {/* --------------------------------------------------- Partners */}
      <Section id="partners">
        <SectionHeading
          eyebrow="Consortium"
          title="Partners & funding"
          description="PathFold is coordinated at Saarland University and supported by two associated partners that anchor the project in Germany's AI and neurodegenerative-disease research landscape."
        />
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
