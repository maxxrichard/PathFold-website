import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ExternalLink } from "lucide-react";
import { prisma } from "@/lib/db";
import { getModel } from "@/lib/admin/registry";
import { EntryForm } from "@/components/admin/EntryForm";
import { DeleteButton } from "@/components/admin/DeleteButton";

export default async function EditEntryPage({ params }: { params: Promise<{ model: string; id: string }> }) {
  const { model: key, id } = await params;
  const model = getModel(key);
  if (!model) notFound();
  const delegate = (prisma as unknown as Record<string, { findUnique: (args: unknown) => Promise<Record<string, unknown> | null> }>)[model.key];
  const entry = await delegate.findUnique({ where: { id } });
  if (!entry) notFound();

  // Mark messages as read when opened
  if (model.key === "contactMessage" && entry.read === false) {
    await prisma.contactMessage.update({ where: { id }, data: { read: true } });
    entry.read = true;
  }

  const title = String(entry.title ?? entry.name ?? entry.subject ?? entry.code ?? model.singular);
  const viewHref = model.key === "newsPost" && entry.slug ? `/news/${entry.slug}` : model.publicPath;

  return (
    <div className="mx-auto max-w-4xl">
      <Link href={`/admin/${model.key}`} className="inline-flex items-center gap-1.5 text-sm text-fg-muted hover:text-fg">
        <ArrowLeft className="h-4 w-4" /> {model.label}
      </Link>
      <div className="mt-4 flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="eyebrow">Edit {model.singular.toLowerCase()}</p>
          <h1 className="font-display mt-1 text-3xl font-bold text-fg">{title}</h1>
        </div>
        <div className="flex gap-2">
          {viewHref && (
            <Link href={viewHref} target="_blank" className="btn btn-secondary btn-sm">
              <ExternalLink className="h-4 w-4" /> View
            </Link>
          )}
          <DeleteButton modelKey={model.key} id={id} label={model.singular} />
        </div>
      </div>
      {model.key === "contactMessage" && (
        <a href={`mailto:${String(entry.email)}?subject=${encodeURIComponent("Re: " + String(entry.subject))}`} className="btn btn-primary btn-sm mt-6">
          Reply by e-mail
        </a>
      )}
      <div className="mt-8">
        <EntryForm model={model} entry={JSON.parse(JSON.stringify(entry))} />
      </div>
    </div>
  );
}
