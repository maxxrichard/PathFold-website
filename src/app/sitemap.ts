import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";
import { getPublishedNews } from "@/lib/data";

export const dynamic = "force-dynamic";

const STATIC: Array<{ path: string; priority: number; changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"] }> = [
  { path: "/", priority: 1, changeFrequency: "weekly" },
  { path: "/about", priority: 0.9, changeFrequency: "monthly" },
  { path: "/research", priority: 0.9, changeFrequency: "monthly" },
  { path: "/team", priority: 0.7, changeFrequency: "monthly" },
  { path: "/publications", priority: 0.8, changeFrequency: "weekly" },
  { path: "/news", priority: 0.8, changeFrequency: "weekly" },
  { path: "/media", priority: 0.5, changeFrequency: "monthly" },
  { path: "/resources", priority: 0.7, changeFrequency: "monthly" },
  { path: "/contact", priority: 0.5, changeFrequency: "yearly" },
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const news = await getPublishedNews();
  const now = new Date();
  return [
    ...STATIC.map((s) => ({ url: `${SITE_URL}${s.path}`, lastModified: now, changeFrequency: s.changeFrequency, priority: s.priority })),
    ...news.map((p) => ({
      url: `${SITE_URL}/news/${p.slug}`,
      lastModified: p.updatedAt ?? p.publishedAt,
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
  ];
}
