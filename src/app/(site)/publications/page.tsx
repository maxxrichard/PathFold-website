import type { Metadata } from "next";
import { PageHero, Section } from "@/components/ui/Section";
import { PublicationList } from "@/components/site/PublicationList";
import { getPublications } from "@/lib/data";

export const metadata: Metadata = {
  title: "Publications",
  description: "Publications, preprints, datasets and software from the PathFold project and related prior work.",
};

export default async function PublicationsPage() {
  const publications = await getPublications();
  return (
    <>
      <PageHero
        eyebrow="Publications"
        title="Publications, pre-prints and documentation"
        description="Papers, preprints and the prior work behind the project."
      />
      <Section tight>
        <PublicationList publications={publications} />
      </Section>
    </>
  );
}
