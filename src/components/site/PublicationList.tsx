"use client";

import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import type { Publication } from "@prisma/client";
import { PublicationCard } from "./cards";
import { EmptyState } from "@/components/ui/EmptyState";
import { cn } from "@/lib/utils";

export function PublicationList({ publications }: { publications: Publication[] }) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<string>("All");
  const [type, setType] = useState<string>("All");
  const [year, setYear] = useState<string>("All");

  const categories = useMemo(() => ["All", ...Array.from(new Set(publications.map((p) => p.category)))], [publications]);
  const types = useMemo(() => ["All", ...Array.from(new Set(publications.map((p) => p.type)))], [publications]);
  const years = useMemo(() => ["All", ...Array.from(new Set(publications.map((p) => String(p.year)))).sort((a, b) => Number(b) - Number(a))], [publications]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return publications.filter(
      (p) =>
        (category === "All" || p.category === category) &&
        (type === "All" || p.type === type) &&
        (year === "All" || String(p.year) === year) &&
        (!q || [p.title, p.authors, p.venue, p.abstract ?? ""].join(" ").toLowerCase().includes(q)),
    );
  }, [publications, query, category, type, year]);

  const byYear = useMemo(() => {
    const map = new Map<number, Publication[]>();
    for (const p of filtered) map.set(p.year, [...(map.get(p.year) ?? []), p]);
    return Array.from(map.entries()).sort((a, b) => b[0] - a[0]);
  }, [filtered]);

  if (publications.length === 0) {
    return <EmptyState title="No publications yet" description="Papers, preprints and datasets will appear here as the project progresses." />;
  }

  return (
    <div>
      <div className="card flex flex-col gap-4 p-4 sm:p-5 lg:flex-row lg:items-center">
        <label className="relative flex-1">
          <span className="sr-only">Search publications</span>
          <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-fg-subtle" />
          <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search title, authors, venue…" className="input pl-10" />
        </label>
        <div className="flex flex-wrap gap-2">
          <Select label="Category" value={category} onChange={setCategory} options={categories} />
          <Select label="Type" value={type} onChange={setType} options={types} />
          <Select label="Year" value={year} onChange={setYear} options={years} />
        </div>
      </div>

      <div className="mt-6 flex flex-wrap gap-2">
        {categories.map((c) => (
          <button
            key={c}
            type="button"
            onClick={() => setCategory(c)}
            className={cn("chip cursor-pointer transition", category === c ? "border-brand-cyan/50 bg-brand-cyan/15 text-brand-cyan" : "hover:text-fg")}
            aria-pressed={category === c}
          >
            {c}
          </button>
        ))}
        <span className="ml-auto self-center text-xs text-fg-subtle" aria-live="polite">
          {filtered.length} of {publications.length}
        </span>
      </div>

      {byYear.length === 0 ? (
        <div className="mt-8">
          <EmptyState title="Nothing matches" description="Try a different search term or clear the filters." />
        </div>
      ) : (
        <div className="mt-8 space-y-12">
          {byYear.map(([y, pubs]) => (
            <section key={y} aria-labelledby={`year-${y}`}>
              <h2 id={`year-${y}`} className="font-display text-3xl font-bold text-gradient">
                {y}
              </h2>
              <div className="mt-5 grid gap-5 lg:grid-cols-2">
                {pubs.map((p) => (
                  <PublicationCard key={p.id} pub={p} />
                ))}
              </div>
            </section>
          ))}
        </div>
      )}
    </div>
  );
}

function Select({ label, value, onChange, options }: { label: string; value: string; onChange: (v: string) => void; options: string[] }) {
  return (
    <label className="flex items-center gap-2 text-xs text-fg-subtle">
      {label}
      <select value={value} onChange={(e) => onChange(e.target.value)} className="input w-auto min-w-28 py-2 text-sm">
        {options.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
    </label>
  );
}
