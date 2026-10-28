import type { Metadata } from "next";
import { PageHero, Section } from "@/components/ui/Section";
import { MediaGallery } from "@/components/site/MediaGallery";
import { getMedia } from "@/lib/data";

export const metadata: Metadata = {
  alternates: { canonical: "/media" },
  title: "Media",
  description: "Images, videos, posters, talks and press coverage of the PathFold project.",
};

export default async function MediaPage() {
  const items = await getMedia();
  return (
    <>
      <PageHero eyebrow="Media" title="Press release, videos and images" description="Talks, posters and media coverage from the project." />
      <Section tight>
        <MediaGallery items={items} />
      </Section>
    </>
  );
}
