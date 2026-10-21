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
        <header className="grid-12 gap-y-6">
          <div className="aside-zone t-body text-ink-soft">
            <Link href="/news" className="link inline-flex items-center gap-1.5 text-ink">
              <ArrowLeft className="h-4 w-4" /> All news
            </Link>
            <p className="mt-6 font-medium text-ink">{post.category}</p>
            <time dateTime={post.publishedAt.toISOString()}>{formatDate(post.publishedAt)}</time>
          </div>
          <h1 className="t-title col-span-12 lg:col-start-6 lg:col-span-7">{post.title}</h1>
          <p className="t-lead col-span-12 max-w-[44ch] text-ink-soft lg:col-start-6 lg:col-span-7">{post.excerpt}</p>
        </header>

        {post.coverImage && (
          <figure className="mt-14">
            <Image src={post.coverImage} alt="" width={1600} height={900} sizes="100vw" className="aspect-[16/9] w-full object-cover" priority />
          </figure>
        )}

        <div className="grid-12 mt-14">
          <div className="axis">
            <Markdown content={post.content} className="max-w-[66ch]" />
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
          <div className="grid-12">
            <h2 className="t-head col-span-12 lg:col-start-6 lg:col-span-7">More news</h2>
          </div>
          <ul className="mt-10">
            {related.map((p) => (
              <li key={p.id} className="odd:band">
                <NewsCard post={p} compact />
              </li>
            ))}
          </ul>
        </div>
      )}
    </article>
  );
}
