"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { Loader2, Upload, X } from "lucide-react";
import { cn } from "@/lib/utils";

export function ImageField({ id, name, defaultValue, error }: { id: string; name: string; defaultValue: string; error?: boolean }) {
  const [value, setValue] = useState(defaultValue);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement | null>(null);

  async function upload(file: File) {
    setUploading(true);
    setMessage(null);
    try {
      const body = new FormData();
      body.append("file", file);
      const res = await fetch("/api/upload", { method: "POST", body });
      const json = (await res.json()) as { url?: string; error?: string };
      if (!res.ok || !json.url) throw new Error(json.error || "Upload failed");
      setValue(json.url);
    } catch (e) {
      setMessage(e instanceof Error ? e.message : "Upload failed");
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  }

  const isImage = /\.(png|jpe?g|webp|gif|avif|svg)(\?|$)/i.test(value) || value.includes("blob.vercel-storage.com");

  return (
    <div className="mt-2">
      <div className="flex gap-2">
        <input
          id={id}
          name={name}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="https://… or upload a file"
          className={cn("input", error && "border-danger")}
        />
        <input
          ref={fileRef}
          type="file"
          accept="image/*,application/pdf"
          className="hidden"
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) void upload(f);
          }}
        />
        <button type="button" onClick={() => fileRef.current?.click()} className="btn btn-secondary shrink-0" disabled={uploading}>
          {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />} Upload
        </button>
        {value && (
          <button type="button" onClick={() => setValue("")} className="btn btn-ghost shrink-0" aria-label="Clear">
            <X className="h-4 w-4" />
          </button>
        )}
      </div>
      {message && <p className="mt-1.5 text-xs text-danger">{message}</p>}
      {value && isImage && (
        <div className="relative mt-3 h-36 w-full max-w-xs overflow-hidden rounded-xl border border-border bg-bg">
          <Image src={value} alt="" fill sizes="320px" className="object-contain" unoptimized />
        </div>
      )}
    </div>
  );
}
