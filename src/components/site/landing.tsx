import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { LoopVideo } from "@/components/site/LoopVideo";
import { Reveal } from "@/components/ui/Reveal";
import { cn } from "@/lib/utils";

/* ------------------------------------------------------------------ */
/* Masthead: text on the left, the project's own animation on the right  */
/* ------------------------------------------------------------------ */
export function Masthead({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <section className="field-night relative flex min-h-dvh items-center pt-24 pb-14 sm:pt-28 sm:pb-16">
      <div className="container-x grid gap-12 lg:grid-cols-12 lg:items-center">
        <div className="lg:col-span-5">
          <h1 className="rise t-display max-w-[20ch] text-paper">{title}</h1>
          <p className="rise rise-1 t-lead mt-6 max-w-[40ch] text-[#c3c9d8]">{subtitle}</p>
          <div className="rise rise-2 mt-8 flex flex-wrap gap-3">
            <Link href="/research" className="btn bg-paper text-night hover:bg-sky">
              Explore the research
            </Link>
            <Link href="/about" className="btn text-paper ring-1 ring-inset ring-white/25 hover:bg-white/10">
              About the project
            </Link>
          </div>
        </div>
        <div className="rise rise-2 lg:col-span-7">
          <div className="overflow-hidden rounded-xl ring-1 ring-white/10">
            <LoopVideo
              src="/pathfold-folding-paths.mp4"
              poster="/pathfold-overview.jpg"
              width={1536}
              height={1024}
              label="Animation: from an amino acid sequence to predicted folding and misfolding pathways over time"
              className="aspect-[3/2] w-full object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* The problem: heading, standfirst and three columns                     */
/* ------------------------------------------------------------------ */
export function StatementTiles({
  slogan,
  text,
  items,
}: {
  slogan: React.ReactNode;
  text: string;
  items: Array<{ title: string; subtitle: string; highlight: string; body: string; tone: "neutral" | "brand" }>;
}) {
  return (
    <section id="overview" className="py-section" aria-labelledby="overview-title">
      <div className="container-x">
        <div className="grid gap-8 lg:grid-cols-12">
          <h2 id="overview-title" className="t-head lg:col-span-5">
            {slogan}
          </h2>
          <p className="t-lead text-ink-soft lg:col-span-6 lg:col-start-7">{text}</p>
        </div>
        <ul className="mt-14 grid gap-8 sm:grid-cols-3">
          {items.map((it, i) => (
            <Reveal as="li" key={it.title} delay={i * 0.08} className={cn("rule pt-6", it.tone === "brand" && "border-native")}>
              <p className="t-body font-medium text-ink-soft">{it.title}</p>
              <p className={cn("mt-3 text-[clamp(1.75rem,1.2rem+1.4vw,2.25rem)] font-semibold leading-[1.1] tracking-[-0.02em]", it.tone === "brand" && "text-native")}>
                {it.highlight}
              </p>
              <p className="t-body mt-4 text-ink-soft">{it.body}</p>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Steps written as lines (used for the research tiers)                  */
/* ------------------------------------------------------------------ */
export function Staircase({ steps, id }: { id?: string; steps: Array<{ line: string; note: string; accent?: boolean }> }) {
  return (
    <ol className="grid gap-8 sm:grid-cols-3" id={id}>
      {steps.map((s, i) => (
        <Reveal as="li" key={s.line} delay={i * 0.08} className="rule pt-6">
          <p className={cn("t-stair", s.accent && "text-native")}>{s.line}</p>
          <p className="t-body mt-3 text-ink-soft">{s.note}</p>
        </Reveal>
      ))}
    </ol>
  );
}

/* ------------------------------------------------------------------ */
/* Heading on the left, rows on the right                                 */
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
    <div className="grid gap-12 lg:grid-cols-12">
      <div className="lg:col-span-4">
        <div className="lg:sticky lg:top-28">
          <h2 className="t-head">{heading}</h2>
          {intro && <p className="t-lead mt-4 max-w-[36ch] text-ink-soft">{intro}</p>}
        </div>
      </div>
      <div className="lg:col-span-7 lg:col-start-6">
        {blocks.map((b, i) => (
          <Reveal key={b.key} as="article" className={cn("scroll-mt-28 py-10 first:pt-0 last:pb-0", i > 0 && "rule")} delay={0.05}>
            <h3 id={b.key} className="text-[1.5rem] font-semibold leading-snug tracking-[-0.015em]">
              {b.title}
            </h3>
            <p className="t-body mt-1 font-medium text-native">{b.kicker}</p>
            <p className="t-body mt-4 max-w-[60ch]">{b.summary}</p>
            {b.details.length > 0 && (
              <ul className="mt-6 space-y-3 t-body text-ink-soft">
                {b.details.map((d) => (
                  <li key={d} className="flex gap-3">
                    <span className="mt-[0.7em] h-1.5 w-1.5 shrink-0 rounded-full bg-native" aria-hidden="true" />
                    <span>{d}</span>
                  </li>
                ))}
              </ul>
            )}
            {b.href && (
              <Link href={b.href} className="link mt-6 inline-flex items-center gap-1 t-body font-medium text-native">
                Learn more <ArrowUpRight className="h-4 w-4" />
              </Link>
            )}
          </Reveal>
        ))}
      </div>
    </div>
  );
}
