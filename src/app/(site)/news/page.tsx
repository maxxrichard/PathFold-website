import type { Metadata } from "next";
import { PageHero, Section } from "@/components/ui/Section";
import { Reveal } from "@/components/ui/Reveal";
import { NewsCard } from "@/components/site/cards";
import { EmptyState } from "@/components/ui/EmptyState";
import { getPublishedNews } from "@/lib/data";
import { NewsFilter } from "@/components/site/NewsFilter";

export const metadata: Metadata = {
  title: "News",
  description: "News, events, talks and press coverage from the PathFold project.",
};

export default async function NewsPage({ searchParams }: { searchParams: Promise<{ category?: string }> }) {
  const { category } = await searchParams;
  const all = await getPublishedNews();
  const categories = Array.from(new Set(all.map((p) => p.category)));
  const posts = category && category !== "All" ? all.filter((p) => p.category === category) : all;

  return (
    <>
      <PageHero eyebrow="News" title="Updates from PathFold" description="Announcements, events, talks, releases and press coverage." />
      <Section tight>
        {all.length > 0 && (
          <NewsFilter categories={categories} active={category ?? "All"} />
        )}
        <div className="mt-8">
          {posts.length === 0 ? (
            <EmptyState title="No news yet" description="Updates will be published here as the project progresses." />
          ) : (
            <ul className="divide-y divide-border border-y border-border">
              {posts.map((post, i) => (
                <Reveal key={post.id} as="li" delay={(i % 4) * 0.05}>
                  <NewsCard post={post} />
                </Reveal>
              ))}
            </ul>
          )}
        </div>
      </Section>
    </>
  );
}
