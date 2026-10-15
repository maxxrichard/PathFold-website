"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { NAV_LINKS } from "@/lib/nav";

export function Navbar({ announcement }: { announcement?: string }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);


  return (
    <header className="fixed inset-x-0 top-0 z-50">
      {announcement ? (
        <div className="bg-gradient-to-r from-brand-blue/30 via-brand-violet/30 to-brand-cyan/30 border-b border-border text-center text-sm px-4 py-2 text-fg">
          {announcement}
        </div>
      ) : null}
      <div
        className={cn(
          "transition-colors duration-300",
          open ? "border-b border-border bg-bg/95 backdrop-blur" : scrolled ? "glass border-b border-border" : "bg-transparent",
        )}
      >
        <nav className="container-x flex h-16 items-center justify-between gap-6" aria-label="Main">
          <Link href="/" className="flex items-center gap-2.5 shrink-0" aria-label="PathFold home">
            <Image src="/logo-mark.png" alt="" width={44} height={20} priority className="h-5 w-auto" />
            <span className="font-display text-xl font-bold tracking-tight">
              <span className="text-fg">Path</span>
              <span className="text-gradient">Fold</span>
            </span>
          </Link>

          <ul className="hidden lg:flex items-center gap-1">
            {NAV_LINKS.map((link) => {
              const active = pathname === link.href || pathname.startsWith(link.href + "/");
              return (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className={cn(
                      "relative rounded-full px-3.5 py-2 text-sm font-medium transition-colors",
                      active ? "text-fg bg-white/8" : "text-fg-muted hover:text-fg hover:bg-white/5",
                    )}
                    aria-current={active ? "page" : undefined}
                  >
                    {link.label}
                  </Link>
                </li>
              );
            })}
          </ul>

          <div className="hidden lg:flex items-center gap-2">
            <Link href="/contact" className="btn btn-primary btn-sm">
              Get in touch
            </Link>
          </div>

          <button
            type="button"
            className="lg:hidden inline-flex h-11 w-11 items-center justify-center rounded-full text-fg hover:bg-white/8"
            aria-expanded={open}
            aria-controls="mobile-nav"
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </nav>

        <div
          id="mobile-nav"
          className={cn(
            "lg:hidden overflow-hidden transition-[max-height,opacity] duration-300 ease-out",
            open ? "max-h-[32rem] opacity-100" : "max-h-0 opacity-0",
          )}
        >
          <ul className="container-x flex flex-col gap-1 pb-5 pt-1">
            {NAV_LINKS.map((link) => {
              const active = pathname === link.href || pathname.startsWith(link.href + "/");
              return (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    onClick={() => setOpen(false)}
                    className={cn(
                      "block rounded-xl px-4 py-3 text-base font-medium",
                      active ? "text-fg bg-white/8" : "text-fg-muted hover:text-fg hover:bg-white/5",
                    )}
                    aria-current={active ? "page" : undefined}
                  >
                    {link.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </header>
  );
}
