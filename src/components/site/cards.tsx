import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import type { NewsPost, Publication, TeamMember, Partner, Resource } from "@prisma/client";
import { Badge, statusTone } from "@/components/ui/Badge";
import { formatDate, cn } from "@/lib/utils";

/* ------------------------------------------------------------------ */
/* News: a banded agenda row                                            */
/* ------------------------------------------------------------------ */
export function NewsCard({ post, compact = false }: { post: NewsPost; compact?: boolean }) {
  const href = `/news/${post.slug}`;
  return (
    <article className="group grid grid-cols-[auto_1fr] items-start gap-x-4 gap-y-2 py-6 sm:grid-cols-12 sm:items-center sm:gap-x-6">
      <time dateTime={post.publishedAt.toISOString()} className="tabular t-body text-ink-soft sm:col-span-2">
        {formatDate(post.publishedAt)}
      </time>
      <p className="t-body text-ink-soft sm:col-span-2 sm:order-last sm:text-right">{post.category}</p>
      <div className={cn("col-span-2 flex items-center gap-4 sm:col-span-8", compact && "sm:col-span-8")}>
        {post.coverImage && !compact && (
          <Link href={href} className="relative hidden h-16 w-24 shrink-0 overflow-hidden rounded-md bg-paper-2 sm:block" aria-hidden="true" tabIndex={-1}>
            <Image src={post.coverImage} alt="" fill sizes="96px" className="object-cover" />
          </Link>
        )}
        <div className="min-w-0">
          <h3 className="text-[1.2rem] font-semibold leading-snug tracking-[-0.015em]">
            <Link href={href} className="link decoration-transparent hover:decoration-current">
              {post.title}
              <ArrowUpRight className="ml-1 inline h-[0.9em] w-[0.9em] align-[-0.1em] opacity-0 transition-opacity group-hover:opacity-100" />
            </Link>
          </h3>
          {!compact && <p className="t-body mt-1 line-clamp-2 text-ink-soft">{post.excerpt}</p>}
        </div>
      </div>
    </article>
  );
}

/* ------------------------------------------------------------------ */
/* Publication: one row of the table                                    */
/* ------------------------------------------------------------------ */
export function PublicationCard({ pub, showYear = true }: { pub: Publication; showYear?: boolean }) {
  const doiUrl = pub.doi ? (pub.doi.startsWith("http") ? pub.doi : `https://doi.org/${pub.doi}`) : null;
  const links = [
    doiUrl && { href: doiUrl, label: "DOI" },
    pub.url && !doiUrl && { href: pub.url, label: "Link" },
    pub.url && doiUrl && { href: pub.url, label: "Publisher" },
    pub.pdfUrl && { href: pub.pdfUrl, label: "PDF" },
    pub.codeUrl && { href: pub.codeUrl, label: "Code" },
  ].filter(Boolean) as Array<{ href: string; label: string }>;

  return (
    <article className="grid grid-cols-12 gap-x-4 gap-y-2 py-6 sm:gap-x-6">
      <p className="tabular col-span-3 t-body text-ink-soft sm:col-span-1">{showYear ? pub.year : ""}</p>
      <div className="col-span-9 sm:col-span-7">
        <h3 className="text-[1.15rem] font-semibold leading-snug tracking-[-0.015em]">{pub.title}</h3>
        <p className="t-body mt-1 text-ink-soft">{pub.authors}</p>
        {pub.abstract && (
          <details className="mt-2 t-body">
            <summary className="link inline cursor-pointer list-none text-ink-soft [&::-webkit-details-marker]:hidden">Abstract</summary>
            <p className="mt-2 max-w-[62ch]">{pub.abstract}</p>
          </details>
        )}
      </div>
      <p className="col-span-9 col-start-4 t-body text-ink-soft sm:col-span-3 sm:col-start-auto">
        {pub.venue}
        <span className="block t-small">
          {pub.type}
          {pub.category !== "PathFold" ? ` · ${pub.category}` : ""}
        </span>
      </p>
      <div className="col-span-9 col-start-4 flex flex-wrap gap-x-4 gap-y-1 t-body sm:col-span-1 sm:col-start-auto sm:flex-col sm:items-end">
        {links.map(({ href, label }) => (
          <a key={label} href={href} target="_blank" rel="noreferrer" className="link font-medium">
            {label}
          </a>
        ))}
      </div>
    </article>
  );
}

function initials(name: string) {
  const words = name.split(/\s+/).filter((w) => w && !/\.$/.test(w) && !/^(Prof|Dr|PD|med|Ing)$/i.test(w) && !/^[A-Z]\.?$/.test(w));
  if (words.length === 0) return "";
  const first = words[0][0] ?? "";
  const last = words.length > 1 ? words[words.length - 1][0] ?? "" : "";
  return (first + last).toUpperCase();
}

/* ------------------------------------------------------------------ */
/* Team: a profile row, portrait on the left, details on the right        */
/* ------------------------------------------------------------------ */
export function TeamCard({ member }: { member: TeamMember }) {
  const links = [
    member.email && { href: `mailto:${member.email}`, label: "E-mail" },
    member.website && { href: member.website, label: "Website" },
    member.orcid && { href: member.orcid, label: "ORCID" },
    member.scholar && { href: member.scholar, label: "Scholar" },
    member.linkedin && { href: member.linkedin, label: "LinkedIn" },
  ].filter(Boolean) as Array<{ href: string; label: string }>;

  return (
    <article className="panel grid gap-6 p-5 sm:grid-cols-[9rem_1fr] sm:p-6 lg:grid-cols-[10rem_1fr]">
      <div className="relative aspect-square w-28 overflow-hidden rounded-lg bg-sky sm:w-full">
        {member.photo ? (
          <Image src={member.photo} alt={member.name} fill sizes="160px" className="object-cover" />
        ) : (
          <span className="absolute inset-0 flex items-center justify-center text-[2rem] font-semibold tracking-[-0.03em] text-native/70" aria-hidden="true">
            {initials(member.name)}
          </span>
        )}
      </div>
      <div className="min-w-0">
        <h3 className="text-[1.2rem] font-semibold leading-snug tracking-[-0.015em]">{member.name}</h3>
        <p className="t-body mt-1 font-medium text-native">{member.role}</p>
        <p className="t-small mt-0.5 text-ink-soft">{member.affiliation}</p>
        {member.bio && <p className="t-body mt-4 max-w-[70ch] text-ink-soft">{member.bio}</p>}
        {links.length > 0 && (
          <ul className="mt-4 flex flex-wrap gap-x-5 gap-y-1 t-body">
            {links.map(({ href, label }) => (
              <li key={label}>
                <a href={href} target={href.startsWith("http") ? "_blank" : undefined} rel="noreferrer" className="link font-medium" aria-label={`${member.name} – ${label}`}>
                  {label}
                </a>
              </li>
            ))}
          </ul>
        )}
      </div>
    </article>
  );
}

/* ------------------------------------------------------------------ */
/* Partner: a white logo tile                                           */
/* ------------------------------------------------------------------ */
export function PartnerCard({ partner }: { partner: Partner }) {
  const body = (
    <>
      <div className="flex h-28 items-center justify-center rounded-t-lg bg-white p-5">
        {partner.logo ? (
          <Image src={partner.logo} alt={partner.name} width={224} height={96} className="max-h-16 w-auto object-contain" />
        ) : (
          <span className="text-[1.5rem] font-bold text-ink">{partner.shortName ?? initials(partner.name)}</span>
        )}
      </div>
      <div className="rounded-b-lg bg-paper-2 px-4 py-3">
        <Badge tone={statusTone(partner.type)}>{partner.type}</Badge>
        <h3 className="t-body mt-2 font-semibold leading-snug">{partner.name}</h3>
        {partner.description && <p className="t-small mt-2 text-ink-soft">{partner.description}</p>}
      </div>
    </>
  );
  return partner.website ? (
    <a href={partner.website} target="_blank" rel="noreferrer" className="block h-full">
      {body}
    </a>
  ) : (
    <div className="h-full">{body}</div>
  );
}

/* ------------------------------------------------------------------ */
/* Resource: a banded row                                               */
/* ------------------------------------------------------------------ */
export function ResourceCard({ resource }: { resource: Resource }) {
  const links = [
    resource.url && { href: resource.url, label: "Website" },
    resource.repoUrl && { href: resource.repoUrl, label: "Repository" },
    resource.docsUrl && { href: resource.docsUrl, label: "Docs" },
  ].filter(Boolean) as Array<{ href: string; label: string }>;
  return (
    <article className="grid grid-cols-12 gap-x-4 gap-y-2 py-6 sm:gap-x-6">
      <div className="col-span-12 sm:col-span-4">
        <h3 className="text-[1.2rem] font-semibold leading-snug tracking-[-0.015em]">{resource.name}</h3>
        <p className="t-body mt-1 text-ink-soft">
          {resource.kind} · {resource.status}
        </p>
      </div>
      <p className="t-body col-span-12 max-w-[56ch] sm:col-span-6">{resource.description}</p>
      <div className="col-span-12 flex flex-wrap gap-x-4 gap-y-1 t-body sm:col-span-2 sm:flex-col sm:items-end">
        {links.length > 0 ? (
          links.map(({ href, label }) => (
            <a key={label} href={href} target="_blank" rel="noreferrer" className="link font-medium">
              {label}
            </a>
          ))
        ) : (
          <span className="t-small text-ink-soft sm:text-right">Links will be added on release</span>
        )}
      </div>
    </article>
  );
}

export function StatTile({ label, value, hint, className }: { label: string; value: React.ReactNode; hint?: string; className?: string }) {
  return (
    <div className={cn("panel p-5", className)}>
      <p className="t-small text-ink-soft">{label}</p>
      <p className="mt-1 text-[1.75rem] font-bold leading-none tracking-[-0.02em]">{value}</p>
      {hint && <p className="t-small mt-2 text-ink-soft">{hint}</p>}
    </div>
  );
}
