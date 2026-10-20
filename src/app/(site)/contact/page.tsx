import type { Metadata } from "next";
import { Mail, MapPin, Building2, ExternalLink } from "lucide-react";
import { PageHero, Section } from "@/components/ui/Section";
import { ContactForm } from "@/components/site/ContactForm";
import { getSettings } from "@/lib/settings";

export const metadata: Metadata = {
  title: "Contact",
  description: "Get in touch with the PathFold project team at Saarland University.",
};

export default async function ContactPage() {
  const settings = await getSettings();
  return (
    <>
      <PageHero eyebrow="Contact" title={<>Let&apos;s <span className="text-gradient">talk</span></>} description="Questions about the project, collaboration ideas, data or media requests: we are happy to hear from you." />
      <Section>
        <div className="grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <div className="card p-7">
              <p className="eyebrow">Project coordinator</p>
              <h2 className="font-display mt-2 text-2xl font-semibold text-fg">{settings.contactName}</h2>
              <p className="text-sm text-fg-muted">{settings.contactRole}</p>
              <dl className="mt-6 space-y-4 text-sm">
                <div className="flex gap-3">
                  <Building2 className="mt-0.5 h-4.5 w-4.5 shrink-0 text-brand-cyan" />
                  <div>
                    <dt className="sr-only">Institution</dt>
                    <dd className="text-fg">{settings.contactInstitution}</dd>
                  </div>
                </div>
                <div className="flex gap-3">
                  <MapPin className="mt-0.5 h-4.5 w-4.5 shrink-0 text-brand-cyan" />
                  <div>
                    <dt className="sr-only">Address</dt>
                    <dd className="whitespace-pre-line text-fg">{settings.contactAddress}</dd>
                  </div>
                </div>
                <div className="flex gap-3">
                  <Mail className="mt-0.5 h-4.5 w-4.5 shrink-0 text-brand-cyan" />
                  <div>
                    <dt className="sr-only">E-mail</dt>
                    <dd>
                      <a href={`mailto:${settings.contactEmail}`} className="text-brand-cyan hover:underline">
                        {settings.contactEmail}
                      </a>
                    </dd>
                  </div>
                </div>
              </dl>
              {settings.dfkiProjectUrl && (
                <a href={settings.dfkiProjectUrl} target="_blank" rel="noreferrer" className="btn btn-secondary btn-sm mt-6">
                  Project page at DFKI <ExternalLink className="h-3.5 w-3.5" />
                </a>
              )}
            </div>
          </div>
          <div className="lg:col-span-7">
            <div className="card p-7">
              <h2 className="font-display text-2xl font-semibold text-fg">Send a message</h2>
              <p className="mt-1 text-sm text-fg-muted">We usually reply within a few working days.</p>
              <div className="mt-6">
                <ContactForm />
              </div>
            </div>
          </div>
        </div>
      </Section>
    </>
  );
}
