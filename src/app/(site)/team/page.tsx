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
        title={<>The people behind <span className="text-gradient">PathFold</span></>}
        description="PathFold is led by a postdoctoral project leader at Saarland University, supported by a doctoral researcher and two associated partners with complementary expertise in AI systems engineering and neurodegenerative disease biology."
      />
      <Section>
        {members.length === 0 ? (
          <EmptyState title="Team members will be listed here" description="Add people in the admin area." />
        ) : (
          <div className="space-y-16">
            {groups.map((g) => (
              <div key={g.name}>
                <SectionHeading eyebrow={g.name} title={g.name === "Core team" ? "Project team" : g.name} />
                <div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
                  {g.members.map((m, i) => (
                    <Reveal key={m.id} delay={i * 0.06} className="h-full">
                      <TeamCard member={m} />
                    </Reveal>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </Section>
      <Section tone="elevated">
        <div className="card flex flex-col items-start gap-6 p-8 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="eyebrow">Join us</p>
            <h2 className="font-display mt-2 text-2xl font-semibold text-fg">Interested in working on protein folding dynamics?</h2>
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-fg-muted">
              PathFold offers opportunities for doctoral research, theses and collaborations at the interface of generative deep
              learning, protein biophysics and biomedical data science. Get in touch to learn more.
            </p>
          </div>
          <Link href="/contact" className="btn btn-primary shrink-0">
            Contact us
          </Link>
        </div>
      </Section>
    </>
  );
}
