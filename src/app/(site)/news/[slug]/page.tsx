import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { ArrowLeft, ExternalLink } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Markdown } from "@/components/ui/Markdown";
import { NewsCard } from "@/components/site/cards";
import { getNewsBySlug, getPublishedNews } from "@/lib/data";
import { formatDate } from "@/lib/utils";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const post = await getNewsBySlug(slug);
  if (!post) return { title: "Not found" };
  return {
    title: post.title,
    description: post.excerpt,
    openGraph: post.coverImage ? { images: [{ url: post.coverImage }] } : undefined,
  };
}

export default async function NewsDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getNewsBySlug(slug);
  if (!post) notFound();
  const related = (await getPublishedNews(4)).filter((p) => p.id !== post.id).slice(0, 3);

  return (
    <article className="pt-28 sm:pt-32">
      <div className="container-x">
        <Link href="/news" className="inline-flex items-center gap-1.5 text-sm text-fg-muted transition hover:text-fg">
          <ArrowLeft className="h-4 w-4" /> All news
        </Link>
        <header className="mx-auto mt-8 max-w-3xl">
          <div className="flex flex-wrap items-center gap-3 text-sm text-fg-subtle">
            <Badge tone="cyan">{post.category}</Badge>
            <time dateTime={post.publishedAt.toISOString()}>{formatDate(post.publishedAt)}</time>
          </div>
          <h1 className="font-display mt-4 text-balance text-4xl font-bold leading-tight tracking-tight text-fg sm:text-5xl">{post.title}</h1>
          <p className="mt-5 text-lg leading-relaxed text-fg-muted">{post.excerpt}</p>
        </header>
        {post.coverImage && (
          <figure className="card mx-auto mt-10 max-w-5xl overflow-hidden p-1.5">
            <Image src={post.coverImage} alt="" width={1600} height={900} className="w-full rounded-[1rem] object-cover" priority />
          </figure>
        )}
        <div className="mx-auto mt-10 max-w-3xl">
          <Markdown content={post.content} className="prose-lg" />
          {post.externalUrl && (
            <a href={post.externalUrl} target="_blank" rel="noreferrer" className="btn btn-secondary mt-8">
              Read the original <ExternalLink className="h-4 w-4" />
            </a>
          )}
        </div>
      </div>
      {related.length > 0 && (
        <div className="container-x mt-20">
          <h2 className="font-display text-2xl font-semibold text-fg">More news</h2>
          <div className="mt-6 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {related.map((p) => (
              <NewsCard key={p.id} post={p} compact />
            ))}
          </div>
        </div>
      )}
    </article>
  );
}
