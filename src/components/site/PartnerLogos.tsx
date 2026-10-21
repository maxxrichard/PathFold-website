import Image from "next/image";
import { Reveal } from "@/components/ui/Reveal";

export const PARTNER_LOGOS = [
  {
    name: "Saarland University",
    role: "Coordinator",
    href: "https://www.uni-saarland.de/en/",
    src: "/partners/uds.png",
    width: 1600,
    height: 642,
  },
  {
    name: "DFKI – German Research Center for Artificial Intelligence",
    role: "Associated partner",
    href: "https://www.dfki.de/en/web",
    src: "/partners/dfki.png",
    width: 1600,
    height: 437,
  },
  {
    name: "DZNE – German Center for Neurodegenerative Diseases",
    role: "Associated partner",
    href: "https://www.dzne.de/en/",
    src: "/partners/dzne.png",
    width: 297,
    height: 154,
  },
  {
    name: "BMFTR – Federal Ministry of Research, Technology and Space",
    role: "Funded by",
    href: "https://www.bmftr.bund.de/",
    src: "/partners/bmftr.png",
    width: 332,
    height: 202,
  },
];

export function PartnerLogos() {
  return (
    <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
      {PARTNER_LOGOS.map((p, i) => (
        <Reveal key={p.name} as="li" delay={i * 0.06} className="h-full">
          <a
            href={p.href}
            target="_blank"
            rel="noreferrer"
            className="card card-hover flex h-full flex-col overflow-hidden"
            aria-label={`${p.name} (${p.role})`}
          >
            <div className="flex h-36 items-center justify-center bg-white p-6">
              <Image src={p.src} alt={p.name} width={p.width} height={p.height} className="max-h-full w-auto max-w-full object-contain" />
            </div>
            <div className="border-t border-border px-5 py-3">
              <p className="text-xs font-semibold uppercase tracking-wider text-fg-subtle">{p.role}</p>
            </div>
          </a>
        </Reveal>
      ))}
    </ul>
  );
}
