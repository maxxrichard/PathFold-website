import type { Metadata } from "next";
import { PageHero, Section, SectionHeading } from "@/components/ui/Section";
import { Reveal } from "@/components/ui/Reveal";
import { ResourceCard } from "@/components/site/cards";
import { EmptyState } from "@/components/ui/EmptyState";
import { getResources } from "@/lib/data";
import { RESOURCE_KINDS } from "@/lib/admin/registry";

export const metadata: Metadata = {
  title: "Resources",
  description: "Open-source software, benchmarks, datasets, models and documentation released by the PathFold project.",
};

export default async function ResourcesPage() {
  const resources = await getResources();
  const groups = RESOURCE_KINDS.map((k) => ({ kind: k, items: resources.filter((r) => r.kind === k) })).filter((g) => g.items.length > 0);

  return (
    <>
      <PageHero
        eyebrow="Resources"
        title="Open software, data and benchmarks"
        description="Open-source software, FAIR datasets and benchmarks released by the project."
      />
      <Section tight>
        {resources.length === 0 ? (
          <EmptyState title="Nothing released yet" description="Software, datasets and benchmarks will be listed here as they are released." />
        ) : (
          <div className="space-y-20">
            {groups.map((g) => (
              <div key={g.kind}>
                <SectionHeading title={g.kind} />
                <ul className="mt-8 divide-y divide-border border-y border-border">
                  {g.items.map((r, i) => (
                    <Reveal key={r.id} as="li" delay={(i % 4) * 0.05}>
                      <ResourceCard resource={r} />
                    </Reveal>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        )}
      </Section>
      <Section tone="elevated">
        <SectionHeading
          title="Open licences, model cards and provenance"
          description="All components are published under open-source licences together with model cards and usage documentation that meet the transparency requirements of the EU AI Act and the FAIR software principles, with explicit versioning and provenance documentation in line with the research data management policy of Saarland University. PathFold does not pursue patent protection: all model architectures, datasets and outputs are released under open-source and open-data licences."
        />
      </Section>
    </>
  );
}
