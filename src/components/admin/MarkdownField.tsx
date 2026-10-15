"use client";

import { useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { cn } from "@/lib/utils";

export function MarkdownField({ id, name, defaultValue, rows }: { id: string; name: string; defaultValue: string; rows: number }) {
  const [value, setValue] = useState(defaultValue);
  const [tab, setTab] = useState<"write" | "preview">("write");
  return (
    <div className="mt-2 overflow-hidden rounded-xl border border-border-strong bg-bg/60">
      <div className="flex items-center gap-1 border-b border-border px-2 py-1.5 text-xs">
        {(["write", "preview"] as const).map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setTab(t)}
            className={cn("rounded-md px-2.5 py-1 font-medium capitalize", tab === t ? "bg-white/10 text-fg" : "text-fg-muted hover:text-fg")}
            aria-pressed={tab === t}
          >
            {t}
          </button>
        ))}
        <span className="ml-auto text-fg-subtle">Markdown supported</span>
      </div>
      <textarea
        id={id}
        name={name}
        rows={rows}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        className={cn("block w-full resize-y bg-transparent px-3.5 py-3 font-mono text-sm leading-relaxed text-fg focus:outline-none", tab === "preview" && "hidden")}
        spellCheck
      />
      {tab === "preview" && (
        <div className="prose prose-invert prose-pathfold prose-sm max-w-none px-4 py-3" style={{ minHeight: rows * 1.6 + "rem" }}>
          {value.trim() ? <ReactMarkdown remarkPlugins={[remarkGfm]}>{value}</ReactMarkdown> : <p className="text-fg-subtle">Nothing to preview.</p>}
        </div>
      )}
    </div>
  );
}
