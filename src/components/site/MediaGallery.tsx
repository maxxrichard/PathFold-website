"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { X, Play, FileText, Newspaper, Mic2, ImageIcon, ExternalLink, Presentation } from "lucide-react";
import type { MediaItem } from "@prisma/client";
import { EmptyState } from "@/components/ui/EmptyState";
import { Badge } from "@/components/ui/Badge";
import { cn, formatDate } from "@/lib/utils";

const ICONS: Record<string, typeof Play> = { Image: ImageIcon, Video: Play, Press: Newspaper, Talk: Mic2, Poster: Presentation, Document: FileText };

function youtubeId(url: string) {
  const m = url.match(/(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([\w-]{6,})/);
  return m?.[1] ?? null;
}

function isImageUrl(url: string) {
  return /\.(png|jpe?g|webp|gif|avif|svg)(\?|$)/i.test(url);
}

export function MediaGallery({ items }: { items: MediaItem[] }) {
  const [filter, setFilter] = useState("All");
  const [open, setOpen] = useState<MediaItem | null>(null);
  const types = useMemo(() => ["All", ...Array.from(new Set(items.map((i) => i.type)))], [items]);
  const visible = filter === "All" ? items : items.filter((i) => i.type === filter);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(null);
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open]);

  if (items.length === 0) {
    return <EmptyState icon={ImageIcon} title="No media yet" description="Images, videos and press coverage will be added here." />;
  }

  return (
    <div>
      <div className="flex flex-wrap gap-2">
        {types.map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setFilter(t)}
            className={cn("chip cursor-pointer transition", filter === t ? "border-brand-cyan/50 bg-brand-cyan/15 text-brand-cyan" : "hover:text-fg")}
            aria-pressed={filter === t}
          >
            {t}
          </button>
        ))}
      </div>

      <ul className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {visible.map((item) => {
          const Icon = ICONS[item.type] ?? FileText;
          const yt = item.type === "Video" ? youtubeId(item.url) : null;
          const thumb = item.thumbnail || (yt ? `https://img.youtube.com/vi/${yt}/hqdefault.jpg` : isImageUrl(item.url) ? item.url : null);
          const openable = item.type === "Image" || item.type === "Video";
          const content = (
            <>
              <div className="relative aspect-[4/3] overflow-hidden bg-bg">
                {thumb ? (
                  <Image src={thumb} alt={item.title} fill sizes="(max-width: 768px) 100vw, 33vw" className="object-cover transition duration-500 group-hover:scale-[1.03]" />
                ) : (
                  <div className="flex h-full items-center justify-center text-fg-subtle">
                    <Icon className="h-10 w-10" />
                  </div>
                )}
                {item.type === "Video" && (
                  <span className="absolute inset-0 flex items-center justify-center">
                    <span className="flex h-14 w-14 items-center justify-center rounded-full bg-bg/70 text-fg backdrop-blur">
                      <Play className="ml-0.5 h-6 w-6" />
                    </span>
                  </span>
                )}
              </div>
              <div className="p-5">
                <div className="flex items-center gap-2 text-xs text-fg-subtle">
                  <Badge>
                    <Icon className="h-3 w-3" /> {item.type}
                  </Badge>
                  {item.date && <span>{formatDate(item.date, { day: undefined })}</span>}
                  {item.source && <span>· {item.source}</span>}
                </div>
                <h3 className="font-display mt-3 text-lg font-semibold leading-snug text-fg">{item.title}</h3>
                {item.description && <p className="mt-2 line-clamp-3 text-sm text-fg-muted">{item.description}</p>}
              </div>
            </>
          );
          return (
            <li key={item.id}>
              {openable ? (
                <button type="button" onClick={() => setOpen(item)} className="card card-hover group block w-full cursor-pointer overflow-hidden text-left">
                  {content}
                </button>
              ) : (
                <a href={item.url} target="_blank" rel="noreferrer" className="card card-hover group block overflow-hidden">
                  {content}
                  <span className="flex items-center gap-1 px-5 pb-5 text-xs font-semibold text-brand-cyan">
                    Open <ExternalLink className="h-3 w-3" />
                  </span>
                </a>
              )}
            </li>
          );
        })}
      </ul>

      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-[100] flex items-center justify-center bg-bg/85 p-4 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpen(null)}
            role="dialog"
            aria-modal="true"
            aria-label={open.title}
          >
            <motion.div
              className="relative w-full max-w-5xl"
              initial={{ scale: 0.96, y: 10 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.96, y: 10 }}
              transition={{ duration: 0.2 }}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                type="button"
                onClick={() => setOpen(null)}
                className="absolute -top-12 right-0 inline-flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-fg hover:bg-white/20"
                aria-label="Close"
              >
                <X className="h-5 w-5" />
              </button>
              <div className="card overflow-hidden p-1.5">
                {open.type === "Video" ? (
                  youtubeId(open.url) ? (
                    <iframe
                      className="aspect-video w-full rounded-[1rem]"
                      src={`https://www.youtube-nocookie.com/embed/${youtubeId(open.url)}?autoplay=1`}
                      title={open.title}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  ) : (
                    <video src={open.url} controls autoPlay className="aspect-video w-full rounded-[1rem] bg-black" />
                  )
                ) : (
                  <Image src={open.url} alt={open.title} width={1600} height={1200} className="max-h-[80vh] w-full rounded-[1rem] object-contain" />
                )}
              </div>
              <div className="mt-3 flex items-start justify-between gap-4 px-1">
                <div>
                  <p className="font-display font-semibold text-fg">{open.title}</p>
                  {open.description && <p className="mt-1 text-sm text-fg-muted">{open.description}</p>}
                </div>
                <a href={open.url} target="_blank" rel="noreferrer" className="btn btn-secondary btn-sm shrink-0">
                  Open original <ExternalLink className="h-3.5 w-3.5" />
                </a>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
