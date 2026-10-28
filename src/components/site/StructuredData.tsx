import { SITE_URL } from "@/lib/site";

/** JSON-LD describing PathFold as a funded research project of Saarland University. */
export function StructuredData() {
  const data = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "ResearchProject",
        "@id": `${SITE_URL}/#project`,
        name: "PathFold",
        alternateName: "PathFold: Language Modelling for Protein (Mis-)Folding Pathway Dynamics",
        url: SITE_URL,
        logo: `${SITE_URL}/logo.png`,
        image: `${SITE_URL}/og.png`,
        description:
          "PathFold is a generative AI framework that learns and predicts how proteins fold and misfold over time, directly from their amino acid sequence, for earlier molecular diagnosis of neurodegenerative diseases.",
        foundingDate: "2026-10-01",
        keywords: ["protein folding", "protein misfolding", "generative AI", "protein language model", "neurodegenerative diseases"],
        parentOrganization: { "@type": "CollegeOrUniversity", name: "Saarland University", url: "https://www.uni-saarland.de/en/" },
        funder: { "@type": "GovernmentOrganization", name: "Federal Ministry of Research, Technology and Space (BMFTR)", url: "https://www.bmftr.bund.de/" },
        memberOf: [
          { "@type": "Organization", name: "German Research Center for Artificial Intelligence (DFKI)", url: "https://www.dfki.de/en/web" },
          { "@type": "Organization", name: "German Center for Neurodegenerative Diseases (DZNE)", url: "https://www.dzne.de/en/" },
        ],
        location: { "@type": "Place", name: "Saarland University", address: { "@type": "PostalAddress", addressLocality: "Saarbrücken", postalCode: "66123", addressCountry: "DE" } },
      },
      {
        "@type": "WebSite",
        "@id": `${SITE_URL}/#website`,
        url: SITE_URL,
        name: "PathFold",
        description: "Learning protein folding pathways",
        publisher: { "@id": `${SITE_URL}/#project` },
        inLanguage: "en",
      },
    ],
  };
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />;
}
