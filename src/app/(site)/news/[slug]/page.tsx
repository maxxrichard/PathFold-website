import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
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
    alternates: { canonical: `/news/${post.slug}` },
    openGraph: post.coverImage ? { images: [{ url: post.coverImage }] } : undefined,
  };
}

export default async function NewsDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getNewsBySlug(slug);
  if (!post) notFound();
  const related = (await getPublishedNews(4)).filter((p) => p.id !== post.id).slice(0, 3);

  return (
    <article className="pt-28 sm:pt-36">
      <div className="container-x">
        <header className="max-w-[64rem]">
          <Link href="/news" className="link inline-flex items-center gap-1.5 t-body text-ink-soft">
            <ArrowLeft className="h-4 w-4" /> All news
          </Link>
          <p className="t-body mt-8 font-medium text-native">
            {post.category} · <time dateTime={post.publishedAt.toISOString()}>{formatDate(post.publishedAt)}</time>
          </p>
          <h1 className="t-title mt-3 max-w-[22ch]">{post.title}</h1>
          <p className="t-lead mt-6 max-w-[62ch] text-ink-soft">{post.excerpt}</p>
        </header>

        {post.coverImage && (
          <figure className="mt-12">
            <Image src={post.coverImage} alt="" width={1600} height={900} sizes="(max-width: 1280px) 100vw, 1216px" className="aspect-[16/9] w-full rounded-xl object-cover" priority />
          </figure>
        )}

        <div className="mt-12">
          <div className="max-w-[66ch]">
            <Markdown content={post.content} />
            {post.externalUrl && (
              <a href={post.externalUrl} target="_blank" rel="noreferrer" className="btn btn-primary mt-10">
                Read the original <ArrowUpRight className="h-4 w-4" />
              </a>
            )}
          </div>
        </div>
      </div>

      {related.length > 0 && (
        <div className="container-x mt-section">
          <h2 className="t-head">More news</h2>
          <ul className="mt-8 divide-y divide-border border-y border-border">
            {related.map((p) => (
              <li key={p.id}>
                <NewsCard post={p} compact />
              </li>
            ))}
          </ul>
        </div>
      )}
    </article>
  );
}
