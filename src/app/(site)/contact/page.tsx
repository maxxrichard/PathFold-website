import type { Metadata } from "next";
import Image from "next/image";
import { PageHero, Section } from "@/components/ui/Section";
import { ContactForm } from "@/components/site/ContactForm";
import { getSettings } from "@/lib/settings";
import { Reveal } from "@/components/ui/Reveal";

export const metadata: Metadata = {
  title: "Contact",
  description: "Get in touch with the PathFold project team at Saarland University.",
};

export default async function ContactPage() {
  const settings = await getSettings();
  return (
    <>
      <PageHero eyebrow="Contact" title="Let's talk" description="Questions about the project, collaboration ideas, data or media requests: we are happy to hear from you." />
      <Section tight>
        <div className="grid-12 gap-y-12">
          <Reveal as="section" delay={0.1} className="aside-zone order-2 lg:order-1" aria-label="Contact details">
            <div className="lg:sticky lg:top-24">
              <Image
                src="/images/saarland-university-campus.jpg"
                alt="The campus of Saarland University in Saarbrücken"
                width={1600}
                height={1070}
                sizes="(max-width: 1024px) 100vw, 33vw"
                className="aspect-[4/3] w-full object-cover"
              />
              <h2 className="mt-4 text-[1.5rem] font-semibold leading-tight tracking-[-0.02em]">{settings.contactName}</h2>
              <p className="t-body mt-1 text-ink-soft">{settings.contactRole}</p>
              <dl className="t-body mt-5 space-y-3">
                <div>
                  <dt className="sr-only">Institution</dt>
                  <dd>{settings.contactInstitution}</dd>
                </div>
                <div>
                  <dt className="sr-only">Address</dt>
                  <dd className="whitespace-pre-line">{settings.contactAddress}</dd>
                </div>
                <div>
                  <dt className="sr-only">E-mail</dt>
                  <dd>
                    <a href={`mailto:${settings.contactEmail}`} className="link font-medium">
                      {settings.contactEmail}
                    </a>
                  </dd>
                </div>
              </dl>
            </div>
          </Reveal>
          <Reveal className="axis order-1 lg:order-2">
            <h2 className="t-head">Send a message</h2>
            <p className="t-body mt-3 text-ink-soft">We usually reply within a few working days.</p>
            <div className="mt-10 max-w-[64ch]">
              <ContactForm />
            </div>
          </Reveal>
        </div>
      </Section>
    </>
  );
}
