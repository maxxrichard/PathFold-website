import Link from "next/link";
import Image from "next/image";
import type { Settings } from "@/lib/settings";
import { NAV_LINKS } from "@/lib/nav";

export function Footer({ settings }: { settings: Settings }) {
  const year = new Date().getFullYear();
  const socials = [
    settings.githubUrl && { href: settings.githubUrl, label: "GitHub" },
    settings.linkedinUrl && { href: settings.linkedinUrl, label: "LinkedIn" },
    settings.twitterUrl && { href: settings.twitterUrl, label: "X" },
    settings.blueskyUrl && { href: settings.blueskyUrl, label: "Bluesky" },
    settings.contactEmail && { href: `mailto:${settings.contactEmail}`, label: "E-mail" },
  ].filter(Boolean) as Array<{ href: string; label: string }>;

  return (
    <footer className="field-night">
      <div className="container-x pt-16 pb-10 sm:pt-20">
        <div className="grid-12 gap-y-10 t-body">
          <div className="col-span-12 sm:col-span-6 lg:col-span-5">
            <Image src="/logo-dark.png" alt="PathFold - Learning protein folding pathways" width={280} height={62} className="h-12 w-auto" />
            <p className="mt-5 max-w-[40ch] text-[#c3c9d8]">
              From sequence to dynamic folding pathways: a generative AI framework that learns how proteins fold and misfold over time, for
              earlier molecular diagnosis of neurodegenerative diseases.
            </p>
            {socials.length > 0 && (
              <ul className="mt-6 flex flex-wrap gap-x-5 gap-y-2">
                {socials.map((s) => (
                  <li key={s.label}>
                    <a href={s.href} target={s.href.startsWith("http") ? "_blank" : undefined} rel="noreferrer" className="link">
                      {s.label}
                    </a>
                  </li>
                ))}
              </ul>
            )}
          </div>
          <nav className="col-span-6 sm:col-span-3 lg:col-start-7 lg:col-span-2" aria-label="Footer">
            <p className="font-medium">Explore</p>
            <ul className="mt-4 space-y-2">
              {NAV_LINKS.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="link text-[#c3c9d8]">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          <div className="col-span-12 sm:col-span-6 lg:col-start-9 lg:col-span-4">
            <p className="font-medium">Funding</p>
            <p className="mt-4 text-[#c3c9d8]">{settings.fundingText}</p>
            <p className="mt-4 text-[#9aa3b8]">{settings.footerNote}</p>
          </div>
        </div>

        <div className="mt-14 flex flex-col gap-3 t-small text-[#9aa3b8] sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {year} PathFold · {settings.contactInstitution}. All rights reserved.
          </p>
          <p className="flex gap-5">
            <Link href="/contact" className="link">
              Imprint & contact
            </Link>
            <Link href="/admin" className="link">
              Admin
            </Link>
          </p>
        </div>
      </div>
    </footer>
  );
}
