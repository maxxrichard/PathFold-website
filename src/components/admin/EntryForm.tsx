"use client";

import { useActionState } from "react";
import Link from "next/link";
import { Loader2, Save } from "lucide-react";
import type { ModelDef, FieldDef } from "@/lib/admin/registry";
import { saveEntry, type ActionState } from "@/lib/admin/actions";
import { ImageField } from "./ImageField";
import { MarkdownField } from "./MarkdownField";
import { cn, toDateInputValue } from "@/lib/utils";

type Entry = Record<string, unknown> | null;

export function EntryForm({ model, entry }: { model: ModelDef; entry: Entry }) {
  const id = entry ? String(entry.id) : null;
  const bound = saveEntry.bind(null, model.key, id);
  const [state, action, pending] = useActionState<ActionState, FormData>(bound, {});

  const initial = (f: FieldDef): string => {
    if (state.values && f.name in state.values) return state.values[f.name];
    const v = entry?.[f.name];
    if (v === null || v === undefined) {
      if (f.type === "number" && f.name === "year") return String(new Date().getFullYear());
      if (f.type === "date" && f.required && !entry) return toDateInputValue(new Date());
      return "";
    }
    if (f.type === "date") return toDateInputValue(v as string);
    return String(v);
  };
  const initialBool = (f: FieldDef): boolean => {
    if (state.values && f.name in state.values) return state.values[f.name] === "on";
    const v = entry?.[f.name];
    if (v === undefined || v === null) return f.name === "published";
    return Boolean(v);
  };

  return (
    <form action={action} className="space-y-6">
      {state.error && (
        <p className="rounded-xl border border-danger/40 bg-danger/10 px-4 py-3 text-sm" role="alert">
          {state.error}
        </p>
      )}
      <div className="card grid gap-5 p-6 sm:grid-cols-6">
        {model.fields.map((f) => {
          const error = state.fieldErrors?.[f.name];
          const span = f.width === "half" ? "sm:col-span-3" : f.width === "third" ? "sm:col-span-2" : "sm:col-span-6";
          const inputId = `f-${f.name}`;
          const labelEl = (
            <label htmlFor={inputId} className="block text-sm font-medium text-fg">
              {f.label} {f.required && <span className="text-misfold">*</span>}
            </label>
          );
          const help = (
            <>
              {f.help && !error && <p className="mt-1.5 text-xs text-fg-subtle">{f.help}</p>}
              {error && (
                <p className="mt-1.5 text-xs text-danger" role="alert">
                  {error}
                </p>
              )}
            </>
          );
          switch (f.type) {
            case "checkbox":
              return (
                <div key={f.name} className={cn(span, "flex items-center gap-3 pt-6")}>
                  <input id={inputId} name={f.name} type="checkbox" defaultChecked={initialBool(f)} className="h-5 w-5 rounded border-border-strong bg-bg accent-brand-cyan" />
                  <label htmlFor={inputId} className="text-sm font-medium text-fg">
                    {f.label}
                  </label>
                </div>
              );
            case "select":
              return (
                <div key={f.name} className={span}>
                  {labelEl}
                  <select id={inputId} name={f.name} defaultValue={initial(f) || f.options?.[0]} className={cn("input mt-2", error && "border-danger")}>
                    {f.options?.map((o) => (
                      <option key={o} value={o}>
                        {o}
                      </option>
                    ))}
                  </select>
                  {help}
                </div>
              );
            case "textarea":
              return (
                <div key={f.name} className={span}>
                  {labelEl}
                  <textarea id={inputId} name={f.name} rows={f.rows ?? 4} defaultValue={initial(f)} placeholder={f.placeholder} className={cn("input mt-2", error && "border-danger")} />
                  {help}
                </div>
              );
            case "markdown":
              return (
                <div key={f.name} className={span}>
                  {labelEl}
                  <MarkdownField id={inputId} name={f.name} defaultValue={initial(f)} rows={f.rows ?? 12} />
                  {help}
                </div>
              );
            case "image":
              return (
                <div key={f.name} className={span}>
                  {labelEl}
                  <ImageField id={inputId} name={f.name} defaultValue={initial(f)} error={!!error} />
                  {help}
                </div>
              );
            default:
              return (
                <div key={f.name} className={span}>
                  {labelEl}
                  <input
                    id={inputId}
                    name={f.name}
                    type={f.type === "number" ? "number" : f.type === "date" ? "date" : f.type === "email" ? "email" : f.type === "url" ? "url" : "text"}
                    defaultValue={initial(f)}
                    placeholder={f.placeholder}
                    className={cn("input mt-2", error && "border-danger")}
                  />
                  {help}
                </div>
              );
          }
        })}
      </div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Link href={`/admin/${model.key}`} className="btn btn-ghost">
          Cancel
        </Link>
        <button type="submit" className="btn btn-primary" disabled={pending}>
          {pending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />} {id ? "Save changes" : `Create ${model.singular.toLowerCase()}`}
        </button>
      </div>
    </form>
  );
}
