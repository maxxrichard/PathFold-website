"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { ArrowUpRight } from "lucide-react";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { NAV_LINKS } from "@/lib/nav";

/**
 * A plain bar: wordmark, the page links, one action. Transparent over the
 * landing masthead, solid paper everywhere else and once the page has moved.
 */
export function Navbar({ announcement }: { announcement?: string }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const onMasthead = pathname === "/";

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const inverted = onMasthead && !scrolled;

  return (
    <header className="fixed inset-x-0 top-0 z-50">
      {announcement ? <div className="bg-sky px-4 py-2 text-center t-small font-medium text-ink">{announcement}</div> : null}
      <div className={cn("transition-colors duration-300", inverted ? "bg-transparent text-paper" : "bg-paper text-ink")}>
        <nav className="container-x flex h-16 items-center justify-between gap-6 sm:h-18" aria-label="Main">
          <Link href="/" className="flex items-center gap-2.5 shrink-0" aria-label="PathFold home">
            <Image
              src="/logo-mark.png"
              alt=""
              width={44}
              height={20}
              priority
              className={cn("h-5 w-auto", inverted && "brightness-0 invert")}
            />
            <span className="font-display text-[1.35rem] font-bold tracking-tight">PathFold</span>
          </Link>

          <ul className="hidden items-center gap-7 lg:flex">
            {NAV_LINKS.filter((l) => l.href !== "/contact").map((link) => {
              const active = pathname === link.href || pathname.startsWith(link.href + "/");
              return (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className={cn(
                      "relative py-2 text-[0.95rem] font-medium transition-opacity",
                      active ? "underline decoration-[1.5px] underline-offset-[0.45em]" : "opacity-75 hover:opacity-100",
                    )}
                    aria-current={active ? "page" : undefined}
                  >
                    {link.label}
                  </Link>
                </li>
              );
            })}
          </ul>

          <div className="flex items-center gap-3">
            <Link
              href="/contact"
              className={cn(
                "inline-flex min-h-10 items-center gap-1.5 px-3 py-2 text-[0.95rem] font-medium transition-colors sm:px-4 sm:py-2.5",
                inverted ? "bg-paper text-ink hover:bg-sky" : "bg-ink text-paper hover:bg-native",
              )}
            >
              Contact <ArrowUpRight className="h-4 w-4" />
            </Link>

            <Sheet open={open} onOpenChange={setOpen}>
              <SheetTrigger
                className={cn("inline-flex h-11 items-center px-2 text-[0.95rem] font-medium lg:hidden")}
                aria-label={open ? "Close menu" : "Open menu"}
              >
                Menu
              </SheetTrigger>
              <SheetContent side="top" showCloseButton={false} className="field-night border-0 p-0 text-paper data-[side=top]:h-dvh">
                <SheetTitle className="sr-only">Site menu</SheetTitle>
                <div className="container-x flex h-16 items-center justify-between sm:h-18">
                  <span className="font-display text-[1.35rem] font-bold tracking-tight">PathFold</span>
                  <button type="button" onClick={() => setOpen(false)} className="inline-flex h-11 items-center px-2 text-[0.95rem] font-medium">
                    Close
                  </button>
                </div>
                <ul className="container-x mt-6 flex flex-col">
                  {NAV_LINKS.map((link, i) => {
                    const active = pathname === link.href || pathname.startsWith(link.href + "/");
                    return (
                      <li key={link.href} className="rise" style={{ animationDelay: `${60 + i * 40}ms` }}>
                        <Link
                          href={link.href}
                          onClick={() => setOpen(false)}
                          className={cn("block py-3 t-head font-semibold", active ? "text-coral" : "text-paper")}
                          aria-current={active ? "page" : undefined}
                        >
                          {link.label}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
                <p className="container-x safe-bottom mt-auto pb-8 t-small text-[#9aa3b8]">Learning protein folding pathways · Saarland University</p>
              </SheetContent>
            </Sheet>
          </div>
        </nav>
      </div>
    </header>
  );
}
