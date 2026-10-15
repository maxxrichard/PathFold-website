import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { getModel } from "@/lib/admin/registry";
import { EntryForm } from "@/components/admin/EntryForm";

export default async function NewEntryPage({ params }: { params: Promise<{ model: string }> }) {
  const { model: key } = await params;
  const model = getModel(key);
  if (!model || model.readOnly) notFound();

  return (
    <div className="mx-auto max-w-4xl">
      <Link href={`/admin/${model.key}`} className="inline-flex items-center gap-1.5 text-sm text-fg-muted hover:text-fg">
        <ArrowLeft className="h-4 w-4" /> {model.label}
      </Link>
      <h1 className="font-display mt-4 text-3xl font-bold text-fg">New {model.singular.toLowerCase()}</h1>
      <div className="mt-8">
        <EntryForm model={model} entry={null} />
      </div>
    </div>
  );
}
