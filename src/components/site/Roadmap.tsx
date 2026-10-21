"use client";

import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

type Stage = { year: string; title: string; items: string[] };

/**
 * The roadmap as a timeline: the years sit on a line, the active year's
 * releases and goals appear beneath. Arrow keys move along the line.
 */
export function Roadmap({ stages }: { stages: Stage[] }) {
  const [active, setActive] = useState(0);
  const reduce = useReducedMotion();
  const current = stages[active];

  const onKey = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowRight") setActive((a) => Math.min(a + 1, stages.length - 1));
    if (e.key === "ArrowLeft") setActive((a) => Math.max(a - 1, 0));
    if (e.key === "Home") setActive(0);
    if (e.key === "End") setActive(stages.length - 1);
  };

  return (
    <div className="panel p-5 sm:p-8">
      {/* The line of years */}
      <div className="relative" role="tablist" aria-label="Roadmap years" onKeyDown={onKey}>
        <div className="absolute left-0 right-0 top-[11px] hidden h-0.5 bg-paper-3 sm:block" aria-hidden="true" />
        <div
          className="absolute left-0 top-[11px] hidden h-0.5 bg-native transition-[width] duration-500 ease-out sm:block"
          style={{ width: `${(active / (stages.length - 1)) * 100}%` }}
          aria-hidden="true"
        />
        <ol className="relative grid grid-cols-2 gap-y-6 sm:flex sm:justify-between">
          {stages.map((s, i) => {
            const on = i === active;
            const done = i < active;
            return (
              <li key={s.year} className={cn("sm:flex-1", i === stages.length - 1 && "sm:flex-none")}>
                <button
                  type="button"
                  role="tab"
                  aria-selected={on}
                  tabIndex={on ? 0 : -1}
                  onClick={() => setActive(i)}
                  className={cn("group flex items-start gap-3 text-left sm:flex-col sm:gap-4", i === stages.length - 1 && "sm:items-end sm:text-right")}
                >
                  <span
                    className={cn(
                      "mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 bg-white transition-colors sm:mt-0",
                      on ? "border-native" : done ? "border-native" : "border-paper-3 group-hover:border-ink-faint",
                    )}
                    aria-hidden="true"
                  >
                    <span className={cn("h-2.5 w-2.5 rounded-full transition-colors", on || done ? "bg-native" : "bg-transparent")} />
                  </span>
                  <span>
                    <span className={cn("block tabular text-[1.25rem] font-semibold leading-none tracking-[-0.015em]", on ? "text-ink" : "text-ink-soft")}>{s.year}</span>
                    <span className="mt-1.5 block t-small text-ink-soft">{s.title}</span>
                  </span>
                </button>
              </li>
            );
          })}
        </ol>
      </div>

      {/* The active year's items */}
      <div className="mt-8 border-t border-border pt-6" role="tabpanel" aria-live="polite">
        <AnimatePresence mode="wait">
          <motion.div
            key={current.year}
            initial={reduce ? false : { opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduce ? undefined : { opacity: 0, y: -6 }}
            transition={{ duration: 0.22 }}
          >
            <p className="t-body font-medium">
              {current.year}: {current.title}
            </p>
            <ul className="mt-4 grid gap-3 sm:grid-cols-2">
              {current.items.map((it) => {
                const [kind, rest] = it.includes(": ") ? [it.slice(0, it.indexOf(": ")), it.slice(it.indexOf(": ") + 2)] : ["", it];
                return (
                  <li key={it} className="flex gap-3 rounded-md bg-paper-2 px-4 py-3 t-body">
                    <span className="mt-[0.7em] h-1.5 w-1.5 shrink-0 rounded-full bg-native" aria-hidden="true" />
                    <span>
                      {kind && <span className="font-medium">{kind}: </span>}
                      <span className="text-ink-soft">{rest}</span>
                    </span>
                  </li>
                );
              })}
            </ul>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
