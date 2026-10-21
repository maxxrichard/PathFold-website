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

/** A gutterless mosaic of white logo tiles, each with its role in a paper bar. */
export function PartnerLogos() {
  return (
    <ul className="grid grid-cols-2 gap-2 lg:grid-cols-4">
      {PARTNER_LOGOS.map((p, i) => (
        <Reveal key={p.name} as="li" delay={i * 0.06} className="h-full">
          <a href={p.href} target="_blank" rel="noreferrer" className="group flex h-full flex-col" aria-label={`${p.name} (${p.role})`}>
            <div className="flex h-32 items-center justify-center bg-white p-6 transition-colors group-hover:bg-sky sm:h-40">
              <Image src={p.src} alt={p.name} width={p.width} height={p.height} className="max-h-full w-auto max-w-full object-contain" />
            </div>
            <div className="bg-paper-2 px-4 py-3">
              <p className="t-small font-medium text-ink-soft">{p.role}</p>
            </div>
          </a>
        </Reveal>
      ))}
    </ul>
  );
}
