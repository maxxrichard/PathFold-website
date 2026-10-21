"use client";

import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import type { Publication } from "@prisma/client";
import { PublicationCard } from "./cards";
import { EmptyState } from "@/components/ui/EmptyState";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Reveal } from "@/components/ui/Reveal";

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
      {/* Filters: a form keeps its lines */}
      <div className="grid-12 gap-y-5" data-ui>
        <div className="aside-zone">
          <Label htmlFor="pub-search" className="t-small text-ink-soft">
            Search
          </Label>
          <div className="relative mt-2">
            <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-faint" />
            <Input
              id="pub-search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Title, authors, venue…"
              className="h-12 rounded-none border-border-strong bg-white pl-10 text-base"
            />
          </div>
        </div>
        <div className="axis flex flex-wrap items-end gap-x-6 gap-y-5">
          <div>
            <p className="t-small text-ink-soft">Category</p>
            <Tabs value={category} onValueChange={(v) => setCategory(String(v))} className="mt-2">
              <TabsList className="h-12 rounded-none bg-paper-2 p-1">
                {categories.map((c) => (
                  <TabsTrigger key={c} value={c} className="h-10 rounded-none px-3.5 text-[0.95rem] data-[state=active]:bg-ink data-[state=active]:text-paper data-active:bg-ink data-active:text-paper">
                    {c}
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
          </div>
          <FilterSelect label="Type" value={type} onChange={setType} options={types} />
          <FilterSelect label="Year" value={year} onChange={setYear} options={years} />
          <p className="t-small pb-3 text-ink-soft" aria-live="polite">
            {filtered.length} of {publications.length}
          </p>
        </div>
      </div>

      {byYear.length === 0 ? (
        <div className="mt-12">
          <EmptyState title="Nothing matches" description="Try a different search term or clear the filters." />
        </div>
      ) : (
        <div className="mt-16 space-y-20">
          {byYear.map(([y, pubs]) => (
            <section key={y} aria-labelledby={`year-${y}`} className="grid-12 gap-y-6">
              <h2 id={`year-${y}`} className="aside-zone tabular t-head lg:sticky lg:top-24 lg:self-start">
                {y}
              </h2>
              <ul className="col-span-12 lg:col-start-5 lg:col-span-8">
                {pubs.map((p, i) => (
                  <Reveal key={p.id} as="li" delay={(i % 4) * 0.05} className="odd:band">
                    <PublicationCard pub={p} showYear={false} />
                  </Reveal>
                ))}
              </ul>
            </section>
          ))}
        </div>
      )}
    </div>
  );
}

function FilterSelect({ label, value, onChange, options }: { label: string; value: string; onChange: (v: string) => void; options: string[] }) {
  return (
    <div>
      <p className="t-small text-ink-soft">{label}</p>
      <Select value={value} onValueChange={(v) => onChange(String(v ?? "All"))}>
        <SelectTrigger className="mt-2 h-12 min-w-36 rounded-none border-border-strong bg-white text-base" aria-label={label}>
          <SelectValue />
        </SelectTrigger>
        <SelectContent className="rounded-none">
          {options.map((o) => (
            <SelectItem key={o} value={o} className="rounded-none">
              {o}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
