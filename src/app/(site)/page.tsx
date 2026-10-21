import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { PathwayExplorer } from "@/components/site/PathwayExplorer";
import { Section, SectionHeading } from "@/components/ui/Section";
import { Reveal } from "@/components/ui/Reveal";
import { NewsCard, PublicationCard } from "@/components/site/cards";
import { PartnerLogos } from "@/components/site/PartnerLogos";
import { Masthead, StatementTiles, PinnedRows } from "@/components/site/landing";
import { EmptyState } from "@/components/ui/EmptyState";
import { getSettings } from "@/lib/settings";
import { getPublishedNews, getFeaturedPublications } from "@/lib/data";
import { PROBLEM_CARDS, COMPONENTS } from "@/lib/content";

export default async function HomePage() {
  const [settings, news, publications] = await Promise.all([getSettings(), getPublishedNews(4), getFeaturedPublications(4)]);

  return (
    <>
      <Masthead title={settings.heroTitle} subtitle={settings.heroSubtitle} />

      {/* --------------------------------------------- Beyond static structures */}
      <StatementTiles
        slogan="Folding is a process, not a single structure"
        text="Protein misfolding, not structural damage per se, is the kinetic failure behind Alzheimer's, Parkinson's and related proteinopathies. Early off-pathway conformations of amyloid-β, tau and α-synuclein precede clinical symptoms by years, yet no existing computational tool models this process at scale."
        items={PROBLEM_CARDS}
      />

      {/* --------------------------------------------------- Explorer */}
      <Section id="explorer">
        <SectionHeading
          title="From sequence to pathway"
          description="Pick a benchmark protein or paste your own sequence to see a schematic of how PathFold reasons: residue-level propensity tracks, a kinetically ordered trajectory and the point where productive folding and off-pathway misfolding diverge."
        />
        <Reveal className="mt-10">
          <PathwayExplorer />
        </Reveal>
      </Section>

      {/* ------------------------------------------------ Components */}
      <Section tone="elevated" id="components">
        <PinnedRows
          heading="Three complementary components"
          intro="PathFold combines the representational power of protein language models with constraints from energy-landscape theory, and ships everything as open, reusable artefacts."
          blocks={COMPONENTS.map((c) => ({
            key: c.key,
            title: c.name,
            kicker: c.kicker,
            summary: c.summary,
            details: c.details,
            href: `/research#${c.key}`,
          }))}
        />
      </Section>

      {/* ----------------------------------------------------- News */}
      <Section id="news">
        <SectionHeading
          title="News & updates"
          action={
            <Link href="/news" className="link inline-flex items-center gap-1 font-medium text-ink">
              All news <ArrowUpRight className="h-4 w-4" />
            </Link>
          }
        />
        <div className="mt-8">
          {news.length === 0 ? (
            <EmptyState title="No news yet" description="Project updates will be published here." />
          ) : (
            <ul className="divide-y divide-border border-y border-border">
              {news.slice(0, 4).map((post, i) => (
                <Reveal key={post.id} as="li" delay={i * 0.06}>
                  <NewsCard post={post} />
                </Reveal>
              ))}
            </ul>
          )}
        </div>
      </Section>

      {/* ------------------------------------------------ Publications */}
      <Section tone="elevated" id="publications">
        <SectionHeading
          title="Selected publications"
          action={
            <Link href="/publications" className="link inline-flex items-center gap-1 font-medium text-ink">
              All publications <ArrowUpRight className="h-4 w-4" />
            </Link>
          }
        />
        <div className="mt-8">
          {publications.length === 0 ? (
            <EmptyState title="No publications yet" description="Papers, preprints and datasets will appear here." />
          ) : (
            <ul className="divide-y divide-border border-y border-border">
              {publications.slice(0, 4).map((pub, i) => (
                <Reveal key={pub.id} as="li" delay={i * 0.06}>
                  <PublicationCard pub={pub} />
                </Reveal>
              ))}
            </ul>
          )}
        </div>
      </Section>

      {/* --------------------------------------------------- Partners */}
      <Section id="partners">
        <SectionHeading
          title="Partners & funding"
          description="PathFold is coordinated at Saarland University and supported by two associated partners that anchor the project in Germany's AI and neurodegenerative-disease research landscape."
        />
        <div className="mt-10">
          <PartnerLogos />
        </div>
        <p className="t-body mt-8 max-w-[64ch] text-ink-soft">{settings.fundingText}</p>
      </Section>
    </>
  );
}
