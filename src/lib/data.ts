import "server-only";
import { prisma } from "./db";
import { safe } from "./safe";

export async function getPublishedNews(limit?: number) {
  return safe(
    () =>
      prisma.newsPost.findMany({
        where: { published: true },
        orderBy: { publishedAt: "desc" },
        take: limit,
      }),
    [],
  );
}

export async function getNewsBySlug(slug: string) {
  return safe(() => prisma.newsPost.findFirst({ where: { slug, published: true } }), null);
}

export async function getPublications() {
  return safe(
    () =>
      prisma.publication.findMany({
        orderBy: [{ year: "desc" }, { order: "asc" }, { createdAt: "desc" }],
      }),
    [],
  );
}

export async function getFeaturedPublications(limit = 3) {
  return safe(async () => {
    const featured = await prisma.publication.findMany({
      where: { featured: true },
      orderBy: [{ year: "desc" }, { order: "asc" }],
      take: limit,
    });
    if (featured.length >= limit) return featured;
    const rest = await prisma.publication.findMany({
      where: { featured: false },
      orderBy: [{ year: "desc" }, { order: "asc" }],
      take: limit - featured.length,
    });
    return [...featured, ...rest];
  }, []);
}

export async function getTeam() {
  return safe(() => prisma.teamMember.findMany({ orderBy: [{ order: "asc" }, { name: "asc" }] }), []);
}

export async function getPartners() {
  return safe(() => prisma.partner.findMany({ orderBy: [{ order: "asc" }, { name: "asc" }] }), []);
}

export async function getMedia() {
  return safe(() => prisma.mediaItem.findMany({ orderBy: [{ order: "asc" }, { date: "desc" }, { createdAt: "desc" }] }), []);
}

export async function getResources() {
  return safe(() => prisma.resource.findMany({ orderBy: [{ order: "asc" }, { name: "asc" }] }), []);
}

export async function getWorkPackages() {
  return safe(() => prisma.workPackage.findMany({ orderBy: [{ order: "asc" }, { number: "asc" }] }), []);
}

export async function getMilestones() {
  return safe(() => prisma.milestone.findMany({ orderBy: [{ order: "asc" }, { code: "asc" }] }), []);
}
