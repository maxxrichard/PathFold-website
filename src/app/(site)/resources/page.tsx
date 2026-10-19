import type { Metadata } from "next";
import { Package } from "lucide-react";
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
        title={<>Open <span className="text-gradient">software, data & benchmarks</span></>}
        description="PathFold-P, PathFold-M and the PathFold-Toolbox are released as open-source software; P-Track and M-Track as FAIR, versioned datasets via ELIXIR-DE and NFDI4Health; DynBench as an open benchmarking platform with a public leaderboard."
      />
      <Section>
        {resources.length === 0 ? (
          <EmptyState icon={Package} title="Nothing released yet" description="Software, datasets and benchmarks will be listed here as they are released." />
        ) : (
          <div className="space-y-14">
            {groups.map((g) => (
              <div key={g.kind}>
                <SectionHeading eyebrow={g.kind} title={g.kind} />
                <div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
                  {g.items.map((r, i) => (
                    <Reveal key={r.id} delay={i * 0.06} className="h-full">
                      <ResourceCard resource={r} />
                    </Reveal>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </Section>
      <Section tone="elevated">
        <div className="card p-8">
          <p className="eyebrow">Licensing</p>
          <h2 className="font-display mt-2 text-2xl font-semibold text-fg">Open licences, model cards and provenance</h2>
          <p className="mt-3 max-w-3xl text-sm leading-relaxed text-fg-muted">
            All components are published under open-source licences together with model cards and usage documentation that meet
            the transparency requirements of the EU AI Act and the FAIR software principles, with explicit versioning and
            provenance documentation in line with the research data management policy of Universität des Saarlandes. PathFold does not
            pursue patent protection: all model architectures, datasets and outputs are released under open-source and open-data
            licences.
          </p>
        </div>
      </Section>
    </>
  );
}
