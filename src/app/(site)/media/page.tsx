import type { Metadata } from "next";
import { Download } from "lucide-react";
import { PageHero, Section, SectionHeading } from "@/components/ui/Section";
import { MediaGallery } from "@/components/site/MediaGallery";
import { getMedia } from "@/lib/data";

export const metadata: Metadata = {
  title: "Media",
  description: "Images, videos, posters, talks and press coverage of the PathFold project, plus logo downloads for press use.",
};

const PRESS_KIT = [
  { label: "Logo (colour, PNG)", href: "/logo.png" },
  { label: "Logo for dark backgrounds (PNG)", href: "/logo-dark.png" },
  { label: "Logo mark (PNG)", href: "/logo-mark.png" },
  { label: "Overview infographic (JPG)", href: "/pathfold-overview.jpg" },
];

export default async function MediaPage() {
  const items = await getMedia();
  return (
    <>
      <PageHero eyebrow="Media" title={<>Images, videos & <span className="text-gradient">press</span></>} description="Visual material, talks, posters and media coverage from the project." />
      <Section>
        <MediaGallery items={items} />
      </Section>
      <Section tone="elevated" id="press-kit">
        <SectionHeading eyebrow="Press kit" title="Logos & visuals" description="Official PathFold assets for press and partner use. Please keep proportions and clear space intact." />
        <ul className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {PRESS_KIT.map((f) => (
            <li key={f.href}>
              <a href={f.href} download className="card card-hover flex items-center justify-between gap-3 p-4 text-sm font-medium text-fg">
                {f.label} <Download className="h-4 w-4 text-fg-subtle" />
              </a>
            </li>
          ))}
        </ul>
      </Section>
    </>
  );
}
