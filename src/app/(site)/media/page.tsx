import type { Metadata } from "next";
import { PageHero, Section } from "@/components/ui/Section";
import { MediaGallery } from "@/components/site/MediaGallery";
import { getMedia } from "@/lib/data";

export const metadata: Metadata = {
  title: "Media",
  description: "Images, videos, posters, talks and press coverage of the PathFold project.",
};

export default async function MediaPage() {
  const items = await getMedia();
  return (
    <>
      <PageHero eyebrow="Media" title={<>Press release, videos & <span className="text-gradient">images</span></>} description="Talks, posters and media coverage from the project." />
      <Section>
        <MediaGallery items={items} />
      </Section>
    </>
  );
}
