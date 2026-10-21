"use client";

import { useEffect, useRef, type CSSProperties } from "react";
import { cn } from "@/lib/utils";

/**
 * Entrance for the parts of a section. The content is rendered visible (no
 * JavaScript needed to read the page); once hydrated, elements still below the
 * viewport are held back and rise 20px with opacity the first time they enter.
 * Siblings stagger with `delay`. Under reduced motion nothing moves.
 */
export function Reveal({
  children,
  className,
  delay = 0,
  as = "div",
  y = 20,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  as?: "div" | "li" | "section" | "article" | "tr" | "figure" | "p";
  y?: number;
}) {
  const ref = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const rect = el.getBoundingClientRect();
    // Already on screen (or scrolled past): play the entrance now, keep the stagger.
    if (rect.top < window.innerHeight) {
      el.classList.add("reveal-in");
      return;
    }
    // Below the fold: hold it back until it enters.
    el.classList.add("reveal-wait");
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            el.classList.remove("reveal-wait");
            el.classList.add("reveal-in");
            io.disconnect();
          }
        }
      },
      { rootMargin: "0px 0px 12% 0px", threshold: 0 },
    );
    io.observe(el);
    // Safety net: never leave content hidden if the observer never fires.
    const safety = window.setTimeout(() => {
      if (el.classList.contains("reveal-wait")) {
        el.classList.remove("reveal-wait");
        el.classList.add("reveal-in");
      }
    }, 6000);
    return () => {
      io.disconnect();
      window.clearTimeout(safety);
    };
  }, []);

  const style = { "--reveal-delay": `${Math.round(delay * 1000)}ms`, "--reveal-y": `${y}px` } as CSSProperties;
  const Tag = as as "div";
  return (
    <Tag ref={ref as React.Ref<HTMLDivElement>} className={cn("reveal", className)} style={style}>
      {children}
    </Tag>
  );
}
