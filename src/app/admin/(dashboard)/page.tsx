import Link from "next/link";
import { ArrowRight, Plus, MailOpen } from "lucide-react";
import { prisma } from "@/lib/db";
import { MODELS } from "@/lib/admin/registry";
import { formatDate } from "@/lib/utils";

export default async function AdminDashboard() {
  const counts = await Promise.all(
    MODELS.map(async (m) => {
      const d = (prisma as unknown as Record<string, { count: () => Promise<number> }>)[m.key];
      return { model: m, count: await d.count() };
    }),
  );
  const [messages, unread, latestNews] = await Promise.all([
    prisma.contactMessage.findMany({ orderBy: { createdAt: "desc" }, take: 5 }),
    prisma.contactMessage.count({ where: { read: false } }),
    prisma.newsPost.findMany({ orderBy: { updatedAt: "desc" }, take: 5 }),
  ]);

  return (
    <div className="mx-auto max-w-6xl">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="eyebrow">Dashboard</p>
          <h1 className="font-display mt-2 text-3xl font-bold text-fg">Content overview</h1>
        </div>
        <Link href="/admin/newsPost/new" className="btn btn-primary btn-sm">
          <Plus className="h-4 w-4" /> New news post
        </Link>
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {counts.map(({ model, count }) => (
          <Link key={model.key} href={`/admin/${model.key}`} className="card card-hover p-5">
            <p className="text-xs font-semibold uppercase tracking-wider text-fg-subtle">{model.label}</p>
            <p className="font-display mt-2 text-3xl font-bold text-fg">
              {count}
              {model.key === "contactMessage" && unread > 0 && <span className="ml-2 align-middle text-sm font-semibold text-brand-cyan">{unread} unread</span>}
            </p>
            <p className="mt-1 line-clamp-2 text-xs text-fg-subtle">{model.description}</p>
          </Link>
        ))}
      </div>

      <div className="mt-10 grid gap-6 lg:grid-cols-2">
        <section className="card p-6">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-lg font-semibold text-fg">Recent messages</h2>
            <Link href="/admin/contactMessage" className="inline-flex items-center gap-1 text-sm text-brand-cyan">
              All <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
          <ul className="mt-4 divide-y divide-border">
            {messages.length === 0 && <li className="py-6 text-sm text-fg-subtle">No messages yet.</li>}
            {messages.map((m) => (
              <li key={m.id}>
                <Link href={`/admin/contactMessage/${m.id}`} className="flex items-start gap-3 py-3 hover:bg-white/3">
                  <MailOpen className={m.read ? "mt-0.5 h-4 w-4 text-fg-subtle" : "mt-0.5 h-4 w-4 text-brand-cyan"} />
                  <div className="min-w-0 flex-1">
                    <p className={m.read ? "truncate text-sm text-fg-muted" : "truncate text-sm font-semibold text-fg"}>{m.subject}</p>
                    <p className="truncate text-xs text-fg-subtle">
                      {m.name} · {formatDate(m.createdAt)}
                    </p>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </section>
        <section className="card p-6">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-lg font-semibold text-fg">Recently edited news</h2>
            <Link href="/admin/newsPost" className="inline-flex items-center gap-1 text-sm text-brand-cyan">
              All <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
          <ul className="mt-4 divide-y divide-border">
            {latestNews.length === 0 && <li className="py-6 text-sm text-fg-subtle">No posts yet.</li>}
            {latestNews.map((p) => (
              <li key={p.id}>
                <Link href={`/admin/newsPost/${p.id}`} className="block py-3 hover:bg-white/3">
                  <p className="truncate text-sm font-medium text-fg">{p.title}</p>
                  <p className="text-xs text-fg-subtle">
                    {p.published ? "Published" : "Draft"} · {formatDate(p.publishedAt)}
                  </p>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
}
