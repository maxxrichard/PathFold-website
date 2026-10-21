import Link from "next/link";
import Image from "next/image";
import type { Settings } from "@/lib/settings";
import { NAV_LINKS } from "@/lib/nav";

const linkClass = "text-[#aab3c5] transition-colors duration-150 hover:text-white";

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
    <footer className="field-night text-[0.9375rem] leading-relaxed">
      <div className="container-x pt-14 pb-8 sm:pt-16">
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-5">
            <Image src="/logo-dark.png" alt="PathFold - Learning protein folding pathways" width={280} height={62} className="h-10 w-auto" />
            <p className="mt-5 max-w-[38ch] text-[#aab3c5]">
              A generative AI framework that learns how proteins fold and misfold over time, for earlier molecular diagnosis of
              neurodegenerative diseases.
            </p>
            {socials.length > 0 && (
              <ul className="mt-5 flex flex-wrap gap-x-5 gap-y-2">
                {socials.map((s) => (
                  <li key={s.label}>
                    <a href={s.href} target={s.href.startsWith("http") ? "_blank" : undefined} rel="noreferrer" className={linkClass}>
                      {s.label}
                    </a>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <nav className="lg:col-span-3 lg:col-start-7" aria-label="Footer">
            <p className="font-medium text-white">Explore</p>
            <ul className="mt-4 grid grid-cols-2 gap-x-6 gap-y-2.5">
              {NAV_LINKS.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className={linkClass}>
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="lg:col-span-3 lg:col-start-10">
            <p className="font-medium text-white">Funding</p>
            <p className="mt-4 text-[#aab3c5]">{settings.fundingText}</p>
            <p className="mt-3 text-[#7d879c]">{settings.footerNote}</p>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-3 border-t border-white/10 pt-6 text-[0.8125rem] text-[#7d879c] sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {year} PathFold · {settings.contactInstitution}. All rights reserved.
          </p>
          <p className="flex gap-6">
            <Link href="/contact" className="transition-colors duration-150 hover:text-white">
              Imprint & contact
            </Link>
            <Link href="/admin" className="transition-colors duration-150 hover:text-white">
              Admin
            </Link>
          </p>
        </div>
      </div>
    </footer>
  );
}
