import Link from "next/link";
import Image from "next/image";
import type { Settings } from "@/lib/settings";
import { NAV_LINKS } from "@/lib/nav";
import { Reveal } from "@/components/ui/Reveal";

/**
 * The designed close of every page: a closing row (sentence, the campus, the
 * links), then the name returning at full width on the night band.
 */
export function Footer({ settings }: { settings: Settings }) {
  const year = new Date().getFullYear();
  const socials = [
    settings.githubUrl && { href: settings.githubUrl, label: "GitHub" },
    settings.linkedinUrl && { href: settings.linkedinUrl, label: "LinkedIn" },
    settings.twitterUrl && { href: settings.twitterUrl, label: "X" },
    settings.blueskyUrl && { href: settings.blueskyUrl, label: "Bluesky" },
  ].filter(Boolean) as Array<{ href: string; label: string }>;

  return (
    <footer className="field-night">
      <div className="container-x pt-20 pb-10 sm:pt-28">
        {/* Closing row */}
        <div className="grid-12 gap-y-10">
          <Reveal as="p" className="col-span-12 max-w-[22ch] text-[clamp(1.5rem,1rem+2vw,2.25rem)] font-semibold leading-[1.1] tracking-[-0.02em] lg:col-span-5">
            Questions about the project, collaboration ideas, data or media requests: write to us.
          </Reveal>
          <Reveal as="figure" delay={0.08} className="col-span-6 lg:col-start-8 lg:col-span-2">
            <Image
              src="/images/saarland-university-campus.jpg"
              alt="The campus of Saarland University in Saarbrücken"
              width={1600}
              height={1070}
              sizes="(max-width: 1024px) 50vw, 170px"
              className="aspect-square w-full max-w-[170px] object-cover"
            />
          </Reveal>
          <Reveal delay={0.16} className="col-span-12 sm:col-span-6 lg:col-start-10 lg:col-span-3">
            <p className="t-body font-medium">How to reach the project</p>
            <ul className="mt-5 space-y-2.5 t-body">
              <li>
                <a href={`mailto:${settings.contactEmail}`} className="link break-all">
                  {settings.contactEmail}
                </a>
              </li>
              {socials.map((s) => (
                <li key={s.label}>
                  <a href={s.href} target="_blank" rel="noreferrer" className="link">
                    {s.label}
                  </a>
                </li>
              ))}
              <li>
                <Link href="/contact" className="link">
                  Contact form
                </Link>
              </li>
            </ul>
            <p className="mt-5 t-small text-[#9aa3b8]">
              {settings.contactInstitution}, Saarbrücken · we usually reply within a few working days
            </p>
          </Reveal>
        </div>

        {/* The name returns at full width */}
        <p
          className="mt-24 select-none font-display text-[clamp(4.5rem,15.5vw,15rem)] font-bold leading-[0.82] tracking-[-0.05em] text-paper sm:mt-32"
          aria-hidden="true"
        >
          PathFold
        </p>

        <div className="mt-12 grid-12 gap-y-10 t-small">
          <div className="col-span-12 sm:col-span-6 lg:col-span-4">
            <Image src="/logo-dark.png" alt="PathFold – Learning protein folding pathways" width={280} height={62} className="h-11 w-auto" />
            <p className="mt-5 max-w-[46ch] text-[#c3c9d8]">
              From sequence to dynamic folding pathways: a generative AI framework that learns how proteins fold and misfold over time,
              for earlier molecular diagnosis of neurodegenerative diseases.
            </p>
          </div>
          <nav className="col-span-6 sm:col-span-3 lg:col-start-6 lg:col-span-2" aria-label="Footer">
            <ul className="space-y-2">
              {NAV_LINKS.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="link">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          <div className="col-span-12 sm:col-span-6 lg:col-start-9 lg:col-span-4">
            <p className="text-[#c3c9d8]">{settings.fundingText}</p>
            <p className="mt-4 text-[#9aa3b8]">{settings.footerNote}</p>
          </div>
        </div>

        <div className="mt-14 flex flex-col gap-3 text-[0.8125rem] text-[#9aa3b8] sm:flex-row sm:items-start sm:justify-between">
          <p>
            © {year} PathFold · {settings.contactInstitution}. All rights reserved. ·{" "}
            <Link href="/contact" className="link">
              Imprint & contact
            </Link>{" "}
            ·{" "}
            <Link href="/admin" className="link">
              Admin
            </Link>
          </p>
          <p className="max-w-[64ch] sm:text-right">
            Pictures:{" "}
            <a className="link" href="https://commons.wikimedia.org/wiki/File:20200414Universit%C3%A4t_des_Saarlandes_02.jpg" target="_blank" rel="noreferrer">
              “Universität des Saarlandes”
            </a>{" "}
            by Flocci Nivis, CC BY-SA 4.0;{" "}
            <a
              className="link"
              href="https://commons.wikimedia.org/wiki/File:Neurofibrillary_tangles_in_the_Hippocampus_of_an_old_person_with_Alzheimer-related_pathology,_HE_5.JPG"
              target="_blank"
              rel="noreferrer"
            >
              “Neurofibrillary tangles in the hippocampus”
            </a>{" "}
            by Patho, CC BY-SA 3.0;{" "}
            <a className="link" href="https://commons.wikimedia.org/wiki/File:Alzheimer_type_II_astrocyte_high_mag.jpg" target="_blank" rel="noreferrer">
              “Alzheimer type II astrocyte”
            </a>{" "}
            by Nephron, CC BY-SA 3.0, via Wikimedia Commons.
          </p>
        </div>
      </div>
    </footer>
  );
}
