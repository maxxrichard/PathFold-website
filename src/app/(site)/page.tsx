import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { PathwayExplorer } from "@/components/site/PathwayExplorer";
import { Section, SectionHeading } from "@/components/ui/Section";
import { Reveal } from "@/components/ui/Reveal";
import { NewsCard, PublicationCard } from "@/components/site/cards";
import { PartnerLogos } from "@/components/site/PartnerLogos";
import { Masthead, StatementTiles, Staircase, PinnedRows } from "@/components/site/landing";
import { EmptyState } from "@/components/ui/EmptyState";
import { getSettings } from "@/lib/settings";
import { getPublishedNews, getFeaturedPublications } from "@/lib/data";
import { PROBLEM_CARDS, COMPONENTS, PROJECT } from "@/lib/content";

// Crops of the project's own overview artwork, one per component.
const COMPONENT_CROPS = [
  { src: "/pathfold-overview.jpg", position: "82% 32%", alt: "Detail of the PathFold overview: the native fold" },
  { src: "/pathfold-overview.jpg", position: "84% 52%", alt: "Detail of the PathFold overview: off-pathway misfolding into fibrils" },
  { src: "/pathfold-overview.jpg", position: "70% 80%", alt: "Detail of the PathFold overview: the kinetically ordered pathway" },
];

export default async function HomePage() {
  const [settings, news, publications] = await Promise.all([getSettings(), getPublishedNews(5), getFeaturedPublications(5)]);

  return (
    <>
      <Masthead title={settings.heroTitle} subtitle={settings.heroSubtitle} latestNews={news[0]} latestPublication={publications[0]} />

      {/* --------------------------------------------- Beyond static structures */}
      <StatementTiles
        slogan={
          <>
            Folding is a process,
            <br />
            not a single structure.
          </>
        }
        figure="9.1 million"
        figureNote="people in Europe live with dementia today; 14.3 million are projected by 2050."
        image="/images/neurofibrillary-tangles.jpg"
        imageAlt="Micrograph of neurofibrillary tangles in the hippocampus of a person with Alzheimer-related pathology"
        text="Protein misfolding, not structural damage per se, is the kinetic failure behind Alzheimer's, Parkinson's and related proteinopathies. Early off-pathway conformations of amyloid-β, tau and α-synuclein precede clinical symptoms by years, yet no existing computational tool models this process at scale."
        items={PROBLEM_CARDS}
      />

      {/* --------------------------------------------------- Explorer */}
      <Section id="explorer">
        <Staircase
          steps={[
            { line: "Pick a protein.", note: "A benchmark fast-folder or an amyloid peptide, or paste your own sequence." },
            { line: "Read its sequence.", note: "Residue-level hydropathy and β-propensity tracks mark the aggregation-prone windows." },
            { line: "Follow the trajectory.", note: "A kinetically ordered sequence of states, from the unfolded chain onwards." },
            { line: "See where it diverges.", note: "The point where productive folding and off-pathway misfolding part.", accent: true },
          ]}
        />
        <p className="t-body mt-14 max-w-[52ch] text-ink-soft lg:ml-[50%]">
          A schematic of how PathFold reasons. The propensity track uses classical hydropathy and β-propensity scales, not PathFold predictions;
          PathFold-P and PathFold-M will replace it once released.
        </p>
        <Reveal className="mt-10">
          <PathwayExplorer />
        </Reveal>
      </Section>

      {/* ------------------------------------------------ Components */}
      <Section tone="sky" id="components">
        <PinnedRows
          heading="Three complementary components"
          intro="PathFold combines the representational power of protein language models with constraints from energy-landscape theory, and ships everything as open, reusable artefacts."
          blocks={COMPONENTS.map((c, i) => ({
            key: c.key,
            title: c.name,
            kicker: c.kicker,
            summary: c.summary,
            details: c.details,
            image: COMPONENT_CROPS[i],
            href: `/research#${c.key}`,
          }))}
        />
      </Section>

      {/* ----------------------------------------------------- News */}
      <Section id="news">
        <SectionHeading
          title={
            <>
              <span className="text-ink-soft">Latest</span>
              <br />
              News & updates
            </>
          }
          action={
            <Link href="/news" className="link inline-flex items-center gap-1 font-medium text-ink">
              All news <ArrowUpRight className="h-4 w-4" />
            </Link>
          }
        />
        <div className="mt-12">
          {news.length === 0 ? (
            <EmptyState title="No news yet" description="Project updates will be published here." />
          ) : (
            <ul>
              {news.slice(0, 4).map((post, i) => (
                <Reveal key={post.id} as="li" delay={i * 0.06} className="odd:band">
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
          title={
            <>
              <span className="text-ink-soft">Selected</span>
              <br />
              Publications
            </>
          }
          action={
            <Link href="/publications" className="link inline-flex items-center gap-1 font-medium text-ink">
              All publications <ArrowUpRight className="h-4 w-4" />
            </Link>
          }
        />
        <div className="mt-12">
          {publications.length === 0 ? (
            <EmptyState title="No publications yet" description="Papers, preprints and datasets will appear here." />
          ) : (
            <ul>
              {publications.slice(0, 4).map((pub, i) => (
                <Reveal key={pub.id} as="li" delay={i * 0.06} className="odd:band">
                  <PublicationCard pub={pub} />
                </Reveal>
              ))}
            </ul>
          )}
        </div>
      </Section>

      {/* --------------------------------------------------- Partners */}
      <Section id="partners">
        <div className="grid-12 gap-y-6">
          <h2 className="t-head col-span-12 lg:col-span-6">Partners & funding</h2>
          <p className="t-lead col-span-12 max-w-[40ch] text-ink-soft lg:col-span-6">
            PathFold is coordinated at Saarland University and supported by two associated partners that anchor the project in Germany&apos;s AI and
            neurodegenerative-disease research landscape.
          </p>
        </div>

        <div className="mt-16 grid grid-cols-1 gap-4 lg:grid-cols-12 lg:items-start">
          <Reveal as="figure" className="relative lg:col-span-8">
            <Image
              src="/pathfold-overview.webp"
              alt="PathFold overview: from an amino acid sequence to productive folding (blue) and off-pathway misfolding (red)"
              width={1536}
              height={1024}
              sizes="(max-width: 1024px) 100vw, 66vw"
              className="aspect-[16/10] w-full object-cover"
            />
            <figcaption className="t-body bg-paper p-5 lg:absolute lg:right-0 lg:top-0 lg:w-[320px]">{settings.fundingText}</figcaption>
          </Reveal>
          <Reveal delay={0.1} className="lg:col-span-4">
            <figure className="relative">
              <Image
                src="/images/saarland-university-campus.jpg"
                alt="The campus of Saarland University in Saarbrücken"
                width={1600}
                height={1070}
                sizes="(max-width: 1024px) 100vw, 33vw"
                className="aspect-[4/3] w-full object-cover"
              />
              <figcaption className="field-coral px-4 py-3 t-body font-medium">Saarbrücken, Saarland · campus A5 4</figcaption>
            </figure>
            <dl className="mt-4 grid grid-cols-2 gap-x-6 gap-y-4 t-small">
              <div>
                <dt className="text-ink-soft">Coordinator</dt>
                <dd className="mt-0.5 font-medium">{PROJECT.coordinatorInstitution}</dd>
              </div>
              <div>
                <dt className="text-ink-soft">Duration</dt>
                <dd className="mt-0.5 font-medium">
                  {PROJECT.start} – {PROJECT.end}
                </dd>
              </div>
              <div>
                <dt className="text-ink-soft">Programme</dt>
                <dd className="mt-0.5 font-medium">{PROJECT.programme}</dd>
              </div>
              <div>
                <dt className="text-ink-soft">Funding authority</dt>
                <dd className="mt-0.5 font-medium">{PROJECT.funding}</dd>
              </div>
            </dl>
          </Reveal>
        </div>

        <div className="mt-4">
          <PartnerLogos />
        </div>
      </Section>
    </>
  );
}
