import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight, ExternalLink, FileText, Code2, Globe, Mail, GraduationCap, Calendar } from "lucide-react";
import { Linkedin } from "@/components/ui/BrandIcons";
import type { NewsPost, Publication, TeamMember, Partner, Resource } from "@prisma/client";
import { Badge, statusTone } from "@/components/ui/Badge";
import { formatDate, cn } from "@/lib/utils";

const CATEGORY_TONE: Record<string, "cyan" | "violet" | "misfold" | "success" | "blue" | "neutral"> = {
  News: "cyan",
  Event: "violet",
  Press: "misfold",
  Talk: "blue",
  Release: "success",
};

export function NewsCard({ post, compact = false }: { post: NewsPost; compact?: boolean }) {
  const href = `/news/${post.slug}`;
  return (
    <article className="card card-hover group flex h-full flex-col overflow-hidden">
      {post.coverImage && !compact && (
        <Link href={href} className="relative aspect-[16/9] overflow-hidden border-b border-border bg-bg">
          <Image
            src={post.coverImage}
            alt=""
            fill
            sizes="(max-width: 768px) 100vw, 33vw"
            className="object-cover transition duration-500 group-hover:scale-[1.03]"
          />
        </Link>
      )}
      <div className="flex flex-1 flex-col p-6">
        <div className="flex items-center gap-3 text-xs text-fg-subtle">
          <Badge tone={CATEGORY_TONE[post.category] ?? "neutral"}>{post.category}</Badge>
          <time dateTime={post.publishedAt.toISOString()}>{formatDate(post.publishedAt)}</time>
        </div>
        <h3 className="font-display mt-4 text-xl font-semibold leading-snug text-fg">
          <Link href={href} className="transition hover:text-brand-cyan">
            {post.title}
          </Link>
        </h3>
        <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-fg-muted">{post.excerpt}</p>
        <div className="mt-auto pt-5">
          <Link href={href} className="inline-flex items-center gap-1 text-sm font-semibold text-brand-cyan">
            Read more <ArrowUpRight className="h-4 w-4 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </Link>
        </div>
      </div>
    </article>
  );
}

export function PublicationCard({ pub }: { pub: Publication }) {
  const doiUrl = pub.doi ? (pub.doi.startsWith("http") ? pub.doi : `https://doi.org/${pub.doi}`) : null;
  const links = [
    doiUrl && { href: doiUrl, label: "DOI", Icon: ExternalLink },
    pub.url && !doiUrl && { href: pub.url, label: "Link", Icon: ExternalLink },
    pub.url && doiUrl && { href: pub.url, label: "Publisher", Icon: Globe },
    pub.pdfUrl && { href: pub.pdfUrl, label: "PDF", Icon: FileText },
    pub.codeUrl && { href: pub.codeUrl, label: "Code", Icon: Code2 },
  ].filter(Boolean) as Array<{ href: string; label: string; Icon: typeof ExternalLink }>;

  return (
    <article className="card card-hover p-6">
      <div className="flex flex-wrap items-center gap-2 text-xs">
        <Badge tone={pub.category === "PathFold" ? "cyan" : "neutral"}>{pub.category}</Badge>
        <Badge>{pub.type}</Badge>
        <span className="text-fg-subtle">{pub.year}</span>
        {pub.featured && <Badge tone="violet">Featured</Badge>}
      </div>
      <h3 className="font-display mt-4 text-lg font-semibold leading-snug text-fg">{pub.title}</h3>
      <p className="mt-2 text-sm text-fg-muted">{pub.authors}</p>
      <p className="mt-1 text-sm italic text-fg-subtle">{pub.venue}</p>
      {pub.abstract && (
        <details className="group/abs mt-3">
          <summary className="cursor-pointer text-sm font-medium text-fg-muted hover:text-fg">Abstract</summary>
          <p className="mt-2 text-sm leading-relaxed text-fg-muted">{pub.abstract}</p>
        </details>
      )}
      {links.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-2">
          {links.map(({ href, label, Icon }) => (
            <a key={label} href={href} target="_blank" rel="noreferrer" className="btn btn-secondary btn-sm">
              <Icon className="h-3.5 w-3.5" /> {label}
            </a>
          ))}
        </div>
      )}
    </article>
  );
}

function initials(name: string) {
  return name
    .replace(/^(Prof\.|Dr\.|Dr\.-Ing\.|PD|M\.Sc\.|B\.Sc\.)\s*/g, "")
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase())
    .join("");
}

export function TeamCard({ member }: { member: TeamMember }) {
  const links = [
    member.email && { href: `mailto:${member.email}`, label: "E-mail", Icon: Mail },
    member.website && { href: member.website, label: "Website", Icon: Globe },
    member.orcid && { href: member.orcid, label: "ORCID", Icon: GraduationCap },
    member.scholar && { href: member.scholar, label: "Google Scholar", Icon: GraduationCap },
    member.linkedin && { href: member.linkedin, label: "LinkedIn", Icon: Linkedin },
  ].filter(Boolean) as Array<{ href: string; label: string; Icon: typeof Mail }>;

  return (
    <article className="card card-hover flex h-full flex-col p-6">
      <div className="flex items-start gap-4">
        <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-2xl border border-border bg-gradient-to-br from-brand-blue/30 to-brand-violet/30">
          {member.photo ? (
            <Image src={member.photo} alt={member.name} fill sizes="80px" className="object-cover" />
          ) : (
            <span className="font-display flex h-full w-full items-center justify-center text-2xl font-bold text-fg">
              {initials(member.name)}
            </span>
          )}
        </div>
        <div className="min-w-0">
          <h3 className="font-display text-lg font-semibold leading-tight text-fg">{member.name}</h3>
          <p className="mt-1 text-sm font-medium text-brand-cyan">{member.role}</p>
          <p className="mt-1 text-sm text-fg-muted">{member.affiliation}</p>
        </div>
      </div>
      {member.bio && <p className="mt-4 text-sm leading-relaxed text-fg-muted">{member.bio}</p>}
      {links.length > 0 && (
        <div className="mt-auto flex flex-wrap gap-2 pt-5">
          {links.map(({ href, label, Icon }) => (
            <a
              key={label}
              href={href}
              target={href.startsWith("http") ? "_blank" : undefined}
              rel="noreferrer"
              aria-label={`${member.name} – ${label}`}
              title={label}
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-border text-fg-muted transition hover:border-border-strong hover:text-fg"
            >
              <Icon className="h-4 w-4" />
            </a>
          ))}
        </div>
      )}
    </article>
  );
}

export function PartnerCard({ partner }: { partner: Partner }) {
  const body = (
    <>
      <div className="flex items-center gap-4">
        <div className="flex h-16 w-28 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-border bg-white p-2">
          {partner.logo ? (
            <Image src={partner.logo} alt={partner.name} width={112} height={56} className="max-h-12 w-auto object-contain" />
          ) : (
            <span className="font-display text-lg font-bold text-slate-800">{partner.shortName ?? initials(partner.name)}</span>
          )}
        </div>
        <div className="min-w-0">
          <Badge tone={statusTone(partner.type)}>{partner.type}</Badge>
          <h3 className="font-display mt-2 text-base font-semibold leading-snug text-fg">{partner.name}</h3>
        </div>
      </div>
      {partner.description && <p className="mt-4 text-sm leading-relaxed text-fg-muted">{partner.description}</p>}
    </>
  );
  return partner.website ? (
    <a href={partner.website} target="_blank" rel="noreferrer" className="card card-hover block h-full p-6">
      {body}
    </a>
  ) : (
    <div className="card h-full p-6">{body}</div>
  );
}

export function ResourceCard({ resource }: { resource: Resource }) {
  const links = [
    resource.url && { href: resource.url, label: "Website", Icon: Globe },
    resource.repoUrl && { href: resource.repoUrl, label: "Repository", Icon: Code2 },
    resource.docsUrl && { href: resource.docsUrl, label: "Docs", Icon: FileText },
  ].filter(Boolean) as Array<{ href: string; label: string; Icon: typeof Globe }>;
  return (
    <article className="card card-hover flex h-full flex-col p-6">
      <div className="flex flex-wrap items-center gap-2">
        <Badge>{resource.kind}</Badge>
        <Badge tone={statusTone(resource.status)}>{resource.status}</Badge>
      </div>
      <h3 className="font-display mt-4 text-xl font-semibold text-fg">{resource.name}</h3>
      <p className="mt-2 text-sm leading-relaxed text-fg-muted">{resource.description}</p>
      <div className="mt-auto pt-5">
        {links.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {links.map(({ href, label, Icon }) => (
              <a key={label} href={href} target="_blank" rel="noreferrer" className="btn btn-secondary btn-sm">
                <Icon className="h-3.5 w-3.5" /> {label}
              </a>
            ))}
          </div>
        ) : (
          <p className="inline-flex items-center gap-1.5 text-xs text-fg-subtle">
            <Calendar className="h-3.5 w-3.5" /> Links will be added on release
          </p>
        )}
      </div>
    </article>
  );
}

export function StatTile({ label, value, hint, className }: { label: string; value: React.ReactNode; hint?: string; className?: string }) {
  return (
    <div className={cn("card p-5", className)}>
      <p className="text-xs font-semibold uppercase tracking-wider text-fg-subtle">{label}</p>
      <p className="font-display mt-2 text-2xl font-bold text-fg">{value}</p>
      {hint && <p className="mt-1 text-xs text-fg-subtle">{hint}</p>}
    </div>
  );
}
