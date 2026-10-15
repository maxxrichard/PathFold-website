import Link from "next/link";
import Image from "next/image";
import { Mail, ExternalLink } from "lucide-react";
import { Github, Linkedin } from "@/components/ui/BrandIcons";
import type { Settings } from "@/lib/settings";
import { NAV_LINKS } from "@/lib/nav";

export function Footer({ settings }: { settings: Settings }) {
  const year = new Date().getFullYear();
  const socials = [
    settings.githubUrl && { href: settings.githubUrl, label: "GitHub", Icon: Github },
    settings.linkedinUrl && { href: settings.linkedinUrl, label: "LinkedIn", Icon: Linkedin },
    settings.contactEmail && { href: `mailto:${settings.contactEmail}`, label: "E-mail", Icon: Mail },
  ].filter(Boolean) as Array<{ href: string; label: string; Icon: typeof Github }>;

  return (
    <footer className="relative mt-4 border-t border-border bg-bg-elevated">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-brand-cyan/50 to-transparent" />
      <div className="container-x grid gap-12 py-16 md:grid-cols-12">
        <div className="md:col-span-5">
          <Image src="/logo-dark.png" alt="PathFold – Learning protein folding pathways" width={280} height={62} className="h-14 w-auto" />
          <p className="mt-5 max-w-md text-sm leading-relaxed text-fg-muted">
            From sequence to dynamic folding pathways: a generative AI framework that learns how proteins fold and
            misfold over time, for earlier molecular diagnosis of neurodegenerative diseases.
          </p>
          {socials.length > 0 && (
            <div className="mt-6 flex gap-2">
              {socials.map(({ href, label, Icon }) => (
                <a
                  key={label}
                  href={href}
                  target={href.startsWith("http") ? "_blank" : undefined}
                  rel="noreferrer"
                  aria-label={label}
                  className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-border text-fg-muted transition hover:border-border-strong hover:text-fg"
                >
                  <Icon className="h-4.5 w-4.5" />
                </a>
              ))}
            </div>
          )}
        </div>

        <div className="md:col-span-3">
          <h3 className="eyebrow">Explore</h3>
          <ul className="mt-4 grid grid-cols-2 gap-x-4 gap-y-2.5 text-sm md:grid-cols-1">
            {NAV_LINKS.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="text-fg-muted transition hover:text-fg">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="md:col-span-4">
          <h3 className="eyebrow">Funding</h3>
          <p className="mt-4 text-sm leading-relaxed text-fg-muted">{settings.fundingText}</p>
          <p className="mt-4 text-sm text-fg-subtle">{settings.footerNote}</p>
          {settings.dfkiProjectUrl && (
            <a
              href={settings.dfkiProjectUrl}
              target="_blank"
              rel="noreferrer"
              className="mt-4 inline-flex items-center gap-1.5 text-sm text-brand-cyan hover:underline"
            >
              Project page at DFKI <ExternalLink className="h-3.5 w-3.5" />
            </a>
          )}
        </div>
      </div>
      <div className="border-t border-border">
        <div className="container-x flex flex-col gap-3 py-6 text-xs text-fg-subtle sm:flex-row sm:items-center sm:justify-between">
          <p>© {year} PathFold · {settings.contactInstitution}. All rights reserved.</p>
          <div className="flex gap-5">
            <Link href="/contact" className="hover:text-fg">
              Imprint & contact
            </Link>
            <Link href="/admin" className="hover:text-fg">
              Admin
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
