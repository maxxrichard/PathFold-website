import type { Metadata } from "next";
import Link from "next/link";
import { PageHero, Section, SectionHeading } from "@/components/ui/Section";
import { Reveal } from "@/components/ui/Reveal";
import { TeamCard } from "@/components/site/cards";
import { EmptyState } from "@/components/ui/EmptyState";
import { getTeam } from "@/lib/data";
import { TEAM_GROUPS } from "@/lib/admin/registry";

export const metadata: Metadata = {
  title: "Team",
  description: "The people behind PathFold at Saarland University, DFKI and DZNE.",
};

export default async function TeamPage() {
  const members = await getTeam();
  const groups = TEAM_GROUPS.map((g) => ({ name: g, members: members.filter((m) => m.group === g) })).filter((g) => g.members.length > 0);

  return (
    <>
      <PageHero
        eyebrow="Team"
        title="The people behind PathFold"
        description="PathFold is led by Saarland University, supported by two associated partners with complementary expertise in AI systems engineering and neurodegenerative disease biology."
      />
      <Section tight>
        {members.length === 0 ? (
          <EmptyState title="Team members will be listed here" description="Add people in the admin area." />
        ) : (
          <div className="space-y-24">
            {groups.map((g) => (
              <div key={g.name}>
                <SectionHeading title={g.name === "Core team" ? "Project team" : g.name} />
                <ul className="mt-10 grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4">
                  {g.members.map((m, i) => (
                    <Reveal key={m.id} as="li" delay={(i % 4) * 0.06} className="h-full">
                      <TeamCard member={m} />
                    </Reveal>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        )}
      </Section>
      <Section tone="elevated">
        <div className="grid gap-8 lg:grid-cols-12">
          <h2 className="t-head lg:col-span-6">Interested in working on protein folding dynamics?</h2>
          <div className="lg:col-span-5 lg:col-start-8">
            <p className="t-body max-w-[44ch] text-ink-soft">
              PathFold offers opportunities for doctoral research, theses and collaborations at the interface of generative deep learning,
              protein biophysics and biomedical data science. Get in touch to learn more.
            </p>
            <Link href="/contact" className="btn btn-primary mt-8">
              Contact us
            </Link>
          </div>
        </div>
      </Section>
    </>
  );
}
