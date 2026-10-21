"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

type Component = {
  key: string;
  name: string;
  kicker: string;
  summary: string;
  highlights: Array<{ title: string; text: string }>;
};

/**
 * The three components as a switcher: pick one on the left, read its summary
 * and highlights on the right. A hash such as #pathfold-m selects the tab.
 */
export function ComponentTabs({ components }: { components: Component[] }) {
  const [active, setActive] = useState(0);
  const reduce = useReducedMotion();
  const current = components[active];

  useEffect(() => {
    const pick = () => {
      const hash = window.location.hash.replace("#", "");
      const i = components.findIndex((c) => c.key === hash);
      if (i >= 0) setActive(i);
    };
    pick();
    window.addEventListener("hashchange", pick);
    return () => window.removeEventListener("hashchange", pick);
  }, [components]);

  return (
    <div className="panel grid overflow-hidden lg:grid-cols-12">
      <div className="border-b border-border lg:col-span-4 lg:border-b-0 lg:border-r" role="tablist" aria-label="Components">
        {components.map((c, i) => {
          const on = i === active;
          return (
            <button
              key={c.key}
              id={c.key}
              type="button"
              role="tab"
              aria-selected={on}
              aria-controls={`${c.key}-panel`}
              onClick={() => setActive(i)}
              className={cn(
                "flex w-full scroll-mt-28 items-start gap-3 border-l-2 px-5 py-5 text-left transition-colors",
                on ? "border-native bg-paper-2" : "border-transparent hover:bg-paper-2/60",
              )}
            >
              <span>
                <span className={cn("block text-[1.1rem] font-semibold tracking-[-0.01em]", on ? "text-ink" : "text-ink-soft")}>{c.name}</span>
                <span className="mt-0.5 block t-small text-ink-soft">{c.kicker}</span>
              </span>
            </button>
          );
        })}
      </div>
      <div className="p-6 sm:p-8 lg:col-span-8" role="tabpanel" id={`${current.key}-panel`} aria-live="polite">
        <AnimatePresence mode="wait">
          <motion.div
            key={current.key}
            initial={reduce ? false : { opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduce ? undefined : { opacity: 0, y: -6 }}
            transition={{ duration: 0.22 }}
          >
            <p className="t-body font-medium text-native">{current.kicker}</p>
            <h3 className="mt-1 text-[1.5rem] font-semibold leading-snug tracking-[-0.015em]">{current.name}</h3>
            <p className="t-body mt-4 max-w-[60ch] text-ink-soft">{current.summary}</p>
            <ul className="mt-8 grid gap-4 sm:grid-cols-2">
              {current.highlights.map((h) => (
                <li key={h.title} className="rounded-md bg-paper-2 p-4">
                  <p className="font-semibold">{h.title}</p>
                  <p className="t-small mt-1.5 text-ink-soft">{h.text}</p>
                </li>
              ))}
            </ul>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
