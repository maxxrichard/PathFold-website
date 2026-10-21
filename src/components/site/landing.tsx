import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import type { NewsPost, Publication } from "@prisma/client";
import { LoopVideo } from "@/components/site/LoopVideo";
import { Reveal } from "@/components/ui/Reveal";
import { formatDate, cn } from "@/lib/utils";

/* ------------------------------------------------------------------ */
/* Masthead: the text tile and the project's own animation, shown whole */
/* ------------------------------------------------------------------ */
export function Masthead({
  title,
  subtitle,
  latestNews,
  latestPublication,
}: {
  title: string;
  subtitle: string;
  latestNews?: NewsPost | null;
  latestPublication?: Publication | null;
}) {
  const cards = [
    latestNews && {
      key: "news",
      href: `/news/${latestNews.slug}`,
      kicker: `${latestNews.category} · ${formatDate(latestNews.publishedAt, { day: undefined })}`,
      title: latestNews.title,
      image: latestNews.coverImage,
      tone: "sky" as const,
    },
    latestPublication && {
      key: "pub",
      href: "/publications",
      kicker: `${latestPublication.type} · ${latestPublication.year}`,
      title: latestPublication.title,
      image: null,
      tone: "coral" as const,
    },
  ].filter(Boolean) as Array<{ key: string; href: string; kicker: string; title: string; image: string | null; tone: "sky" | "coral" }>;

  return (
    <section className="field-night relative isolate grid min-h-dvh grid-rows-[auto_1fr] lg:grid-cols-12 lg:grid-rows-1">
      {/* The animation tile: the project's own clip, whole, on its own dark ground */}
      <div className="flex items-center pt-16 sm:pt-18 lg:order-2 lg:col-span-6 lg:pt-0">
        <LoopVideo
          src="/pathfold-folding-paths.mp4"
          poster="/pathfold-overview.jpg"
          width={1536}
          height={1024}
          label="Animation: from an amino acid sequence to predicted folding and misfolding pathways over time"
          className="aspect-[3/2] w-full object-contain"
        />
      </div>

      {/* The text tile */}
      <div className="relative flex flex-col justify-end px-gutter pb-10 pt-8 lg:order-1 lg:col-span-6 lg:justify-center lg:pt-28">
        <h1 className="rise t-display max-w-[24ch] text-paper">{title}</h1>
        <p className="rise rise-1 t-lead mt-6 max-w-[36ch] text-[#c3c9d8]">{subtitle}</p>
        <div className="rise rise-2 mt-9 flex flex-wrap gap-3">
          <Link href="/research" className="btn bg-paper text-night hover:bg-sky">
            Explore the research
          </Link>
          <Link href="/about" className="btn text-paper underline decoration-[1.5px] underline-offset-[0.3em] hover:bg-night-2">
            About the project
          </Link>
        </div>
        {cards.length > 0 && (
          <ul className="rise rise-3 mt-12 flex gap-3 sm:gap-4">
            {cards.map((c) => (
              <li key={c.key} className="w-1/2 sm:w-[min(48%,15rem)]">
                <Link href={c.href} className="group block">
                  <div className={cn("relative aspect-[3/2] w-full overflow-hidden", c.tone === "sky" ? "bg-sky" : "bg-coral")}>
                    {c.image ? (
                      <Image src={c.image} alt="" fill sizes="(max-width: 640px) 50vw, 240px" className="object-cover" />
                    ) : (
                      <p className="absolute inset-0 flex items-end p-3 text-[1.05rem] font-semibold leading-[1.1] tracking-[-0.02em] text-night sm:p-4 sm:text-[1.25rem]">
                        {c.kicker}
                      </p>
                    )}
                    {c.image && <span className="absolute left-3 top-3 bg-paper px-2 py-1 text-[0.8125rem] font-medium text-night">{c.kicker}</span>}
                  </div>
                  <div className="flex min-h-10 items-center justify-between gap-3 bg-paper px-3 py-2 text-night">
                    <span className="line-clamp-1 text-[0.9rem] font-medium sm:text-[0.95rem]">{c.title}</span>
                    <ArrowUpRight className="h-4 w-4 shrink-0 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Statement: the problem, as a slogan tile and three columns            */
/* ------------------------------------------------------------------ */
export function StatementTiles({
  slogan,
  text,
  items,
}: {
  slogan: React.ReactNode;
  text: string;
  items: Array<{ title: string; subtitle: string; body: string; tone: "neutral" | "brand" }>;
}) {
  return (
    <section id="overview" className="px-2 pt-2" aria-labelledby="overview-title">
      <Reveal className="field-night flex min-h-[46svh] items-end p-5 sm:p-8" y={0}>
        <h2 id="overview-title" className="t-slogan text-paper">
          {slogan}
        </h2>
      </Reveal>

      <div className="container-x grid-12 gap-y-10 pt-16 pb-6 sm:pt-20">
        <p className="t-lead col-span-12 text-ink lg:col-start-6 lg:col-span-7">{text}</p>
        <ul className="col-span-12 mt-6 grid gap-10 sm:grid-cols-3 sm:gap-6">
          {items.map((it, i) => (
            <Reveal as="li" key={it.title} delay={i * 0.08} className={cn("max-w-[38ch]", it.tone === "brand" && "text-native")}>
              <h3 className="text-[1.5rem] font-semibold leading-tight tracking-[-0.02em]">{it.title}</h3>
              <p className={cn("t-body mt-1 font-medium", it.tone === "brand" ? "text-native" : "text-ink-soft")}>{it.subtitle}</p>
              <p className="t-body mt-4 text-ink">{it.body}</p>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Staircase: a sequence written as lines that step across               */
/* ------------------------------------------------------------------ */
export function Staircase({ steps, id }: { id?: string; steps: Array<{ line: string; note: string; accent?: boolean }> }) {
  const starts = ["lg:col-start-1", "lg:col-start-3", "lg:col-start-5", "lg:col-start-7"];
  const indents = ["ml-0", "ml-[6vw]", "ml-[12vw]", "ml-[18vw]"];
  return (
    <ol className="grid-12 gap-y-10 lg:gap-y-14" id={id}>
      {steps.map((s, i) => (
        <Reveal as="li" key={s.line} delay={i * 0.1} className={cn("col-span-12 lg:col-span-6", starts[i] ?? "lg:col-start-7", indents[i] ?? "ml-[18vw]", "lg:ml-0")}>
          <p className={cn("t-stair", s.accent && "text-native")}>{s.line}</p>
          <p className="t-body mt-3 max-w-[38ch] text-ink-soft">{s.note}</p>
        </Reveal>
      ))}
    </ol>
  );
}

/* ------------------------------------------------------------------ */
/* Pinned heading, passing rows                                          */
/* ------------------------------------------------------------------ */
export function PinnedRows({
  heading,
  intro,
  blocks,
}: {
  heading: React.ReactNode;
  intro?: React.ReactNode;
  blocks: Array<{
    key: string;
    title: string;
    kicker: string;
    summary: string;
    details: string[];
    href?: string;
  }>;
}) {
  return (
    <div className="grid-12 gap-y-10">
      <div className="col-span-12 lg:col-span-5">
        <div className="lg:sticky lg:top-24">
          <h2 className="t-head text-[clamp(2.1rem,1.2rem+3.2vw,3.3rem)]">{heading}</h2>
          {intro && <p className="t-body mt-6 max-w-[36ch] text-ink-soft">{intro}</p>}
        </div>
      </div>
      <div className="col-span-12 flex flex-col gap-16 lg:col-start-7 lg:col-span-6 lg:gap-20">
        {blocks.map((b) => (
          <Reveal key={b.key} as="article" className="scroll-mt-28" delay={0.05}>
            <h3 id={b.key} className="text-[1.75rem] font-semibold leading-tight tracking-[-0.02em]">
              {b.title}
            </h3>
            <p className="t-body mt-1 font-medium text-ink-soft">{b.kicker}</p>
            <p className="t-body mt-5 max-w-[52ch]">{b.summary}</p>
            <ul className="mt-8 space-y-3.5 t-body">
              {b.details.map((d) => (
                <li key={d} className="flex gap-3">
                  <span className="mt-[0.72em] h-1.5 w-1.5 shrink-0 bg-native" aria-hidden="true" />
                  <span>{d}</span>
                </li>
              ))}
            </ul>
            {b.href && (
              <Link href={b.href} className="link mt-7 inline-flex items-center gap-1 t-body font-medium">
                Learn more <ArrowUpRight className="h-4 w-4" />
              </Link>
            )}
          </Reveal>
        ))}
      </div>
    </div>
  );
}
