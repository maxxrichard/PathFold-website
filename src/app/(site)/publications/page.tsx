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
        title={<>Publications, pre-prints & <span className="text-gradient">documentation</span></>}
        description="Peer-reviewed publications and preprints from PathFold, together with the prior work that laid its methodological foundations in trajectory-aware sequence modelling, pathway-based machine learning and generative modelling for neurodegenerative disease research."
      />
      <Section>
        <PublicationList publications={publications} />
      </Section>
    </>
  );
}
