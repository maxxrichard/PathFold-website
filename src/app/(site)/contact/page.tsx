import type { Metadata } from "next";
import { PageHero, Section } from "@/components/ui/Section";
import { ContactForm } from "@/components/site/ContactForm";
import { getSettings } from "@/lib/settings";
import { Reveal } from "@/components/ui/Reveal";

export const metadata: Metadata = {
  alternates: { canonical: "/contact" },
  title: "Contact",
  description: "Get in touch with the PathFold project team at Saarland University.",
};

export default async function ContactPage() {
  const settings = await getSettings();
  return (
    <>
      <PageHero eyebrow="Contact" title="Let's talk" description="Questions about the project, collaboration ideas, data or media requests: we are happy to hear from you." />
      <Section tight>
        <div className="grid gap-12 lg:grid-cols-12">
          <Reveal as="section" delay={0.1} className="order-2 lg:order-1 lg:col-span-4" aria-label="Contact details">
            <div className="panel p-6 lg:sticky lg:top-28">
              <h2 className="text-[1.5rem] font-semibold leading-tight tracking-[-0.02em]">{settings.contactName}</h2>
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
          <Reveal className="order-1 lg:order-2 lg:col-span-7 lg:col-start-6">
            <h2 className="t-head">Send a message</h2>
            <p className="t-body mt-3 text-ink-soft">We usually reply within a few working days.</p>
            <div className="mt-8 max-w-[64ch]">
              <ContactForm />
            </div>
          </Reveal>
        </div>
      </Section>
    </>
  );
}
