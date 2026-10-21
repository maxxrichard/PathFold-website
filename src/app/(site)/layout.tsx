import { Navbar } from "@/components/site/Navbar";
import { Footer } from "@/components/site/Footer";
import { getSettings } from "@/lib/settings";

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const settings = await getSettings();
  return (
    <>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:bg-ink focus:px-4 focus:py-2 focus:text-paper"
      >
        Skip to content
      </a>
      <Navbar announcement={settings.announcement} />
      <main id="main" className="flex-1">
        {children}
      </main>
      <Footer settings={settings} />
    </>
  );
}
