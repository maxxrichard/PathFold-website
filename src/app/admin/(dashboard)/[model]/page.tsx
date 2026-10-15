import Link from "next/link";
import { notFound } from "next/navigation";
import { Plus, Search, Pencil, ExternalLink, Check, Minus } from "lucide-react";
import { prisma } from "@/lib/db";
import { getModel } from "@/lib/admin/registry";
import { formatDate, cn } from "@/lib/utils";
import { Flash } from "@/components/admin/Flash";
import { DeleteButton } from "@/components/admin/DeleteButton";

type Row = Record<string, unknown> & { id: string };

export default async function AdminListPage({
  params,
  searchParams,
}: {
  params: Promise<{ model: string }>;
  searchParams: Promise<{ q?: string; saved?: string; deleted?: string }>;
}) {
  const { model: key } = await params;
  const { q = "", saved, deleted } = await searchParams;
  const model = getModel(key);
  if (!model) notFound();

  const where = q
    ? { OR: model.searchFields.map((f) => ({ [f]: { contains: q, mode: "insensitive" } })) }
    : undefined;
  const delegate = (prisma as unknown as Record<string, { findMany: (args: unknown) => Promise<Row[]> }>)[model.key];
  const rows = await delegate.findMany({ where, orderBy: model.orderBy, take: 500 });

  return (
    <div className="mx-auto max-w-6xl">
      <Flash saved={!!saved} deleted={!!deleted} />
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="eyebrow">{model.label}</p>
          <h1 className="font-display mt-2 text-3xl font-bold text-fg">{model.label}</h1>
          <p className="mt-1 text-sm text-fg-muted">{model.description}</p>
        </div>
        <div className="flex gap-2">
          {model.publicPath && (
            <Link href={model.publicPath} target="_blank" className="btn btn-secondary btn-sm">
              <ExternalLink className="h-4 w-4" /> View on site
            </Link>
          )}
          {!model.readOnly && (
            <Link href={`/admin/${model.key}/new`} className="btn btn-primary btn-sm">
              <Plus className="h-4 w-4" /> New {model.singular.toLowerCase()}
            </Link>
          )}
        </div>
      </div>

      <form className="mt-6 flex gap-2" role="search">
        <label className="relative flex-1">
          <span className="sr-only">Search</span>
          <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-fg-subtle" />
          <input name="q" defaultValue={q} placeholder={`Search ${model.label.toLowerCase()}…`} className="input pl-10" />
        </label>
        <button type="submit" className="btn btn-secondary">
          Search
        </button>
        {q && (
          <Link href={`/admin/${model.key}`} className="btn btn-ghost">
            Clear
          </Link>
        )}
      </form>

      <div className="card mt-6 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-white/3 text-left text-xs uppercase tracking-wider text-fg-subtle">
              <tr>
                {model.listColumns.map((c) => (
                  <th key={c.name} className="px-5 py-3 font-semibold">
                    {c.label}
                  </th>
                ))}
                <th className="px-5 py-3 text-right font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {rows.length === 0 && (
                <tr>
                  <td colSpan={model.listColumns.length + 1} className="px-5 py-12 text-center text-fg-subtle">
                    {q ? "No entries match your search." : `No ${model.label.toLowerCase()} yet.`}
                  </td>
                </tr>
              )}
              {rows.map((row) => (
                <tr key={row.id} className={cn("hover:bg-white/3", row.read === false && "bg-brand-blue/5")}>
                  {model.listColumns.map((c, i) => (
                    <td key={c.name} className={cn("px-5 py-3 align-top", i === 0 && "font-medium text-fg")}>
                      {i === 0 ? (
                        <Link href={`/admin/${model.key}/${row.id}`} className="hover:text-brand-cyan">
                          <Cell value={row[c.name]} type={c.type} />
                        </Link>
                      ) : (
                        <span className="text-fg-muted">
                          <Cell value={row[c.name]} type={c.type} />
                        </span>
                      )}
                    </td>
                  ))}
                  <td className="px-5 py-3 text-right align-top">
                    <div className="inline-flex gap-1">
                      <Link href={`/admin/${model.key}/${row.id}`} className="btn btn-ghost btn-sm" aria-label="Edit">
                        <Pencil className="h-3.5 w-3.5" /> Edit
                      </Link>
                      <DeleteButton modelKey={model.key} id={row.id} label={model.singular} compact />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <p className="mt-3 text-xs text-fg-subtle">{rows.length} entries</p>
    </div>
  );
}

function Cell({ value, type }: { value: unknown; type?: "date" | "boolean" | "text" }) {
  if (value === null || value === undefined || value === "") return <span className="text-fg-subtle">—</span>;
  if (type === "boolean" || typeof value === "boolean") {
    return value ? <Check className="h-4 w-4 text-success" aria-label="Yes" /> : <Minus className="h-4 w-4 text-fg-subtle" aria-label="No" />;
  }
  if (type === "date" || value instanceof Date) return <>{formatDate(value as Date)}</>;
  const s = String(value);
  return <>{s.length > 90 ? s.slice(0, 90) + "…" : s}</>;
}
