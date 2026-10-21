"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { X, Play, FileText, Newspaper, Mic2, ImageIcon, ArrowUpRight, Presentation } from "lucide-react";
import type { MediaItem } from "@prisma/client";
import { EmptyState } from "@/components/ui/EmptyState";
import { Reveal } from "@/components/ui/Reveal";
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
  const reduce = useReducedMotion();
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
    return <EmptyState title="No media yet" description="Images, videos and press coverage will be added here." />;
  }

  return (
    <div>
      <div>
        <nav className="flex flex-wrap gap-x-6 gap-y-2 t-body" aria-label="Filter media by type">
          {types.map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setFilter(t)}
              className={cn("link py-2", filter === t ? "font-semibold decoration-current" : "text-ink-soft")}
              aria-pressed={filter === t}
            >
              {t}
            </button>
          ))}
        </nav>
      </div>

      <ul className="mt-8 grid grid-cols-2 gap-5 lg:grid-cols-3">
        {visible.map((item, i) => {
          const Icon = ICONS[item.type] ?? FileText;
          const yt = item.type === "Video" ? youtubeId(item.url) : null;
          const thumb = item.thumbnail || (yt ? `https://img.youtube.com/vi/${yt}/hqdefault.jpg` : isImageUrl(item.url) ? item.url : null);
          const openable = item.type === "Image" || item.type === "Video";
          const content = (
            <>
              <div className="relative aspect-[4/3] overflow-hidden bg-sky">
                {thumb ? (
                  <Image src={thumb} alt={item.title} fill sizes="(max-width: 1024px) 50vw, 33vw" className="object-cover transition-transform duration-700 group-hover:scale-[1.03]" />
                ) : (
                  <div className="flex h-full items-end p-4 text-ink">
                    <Icon className="h-9 w-9" />
                  </div>
                )}
                {item.type === "Video" && (
                  <span className="absolute inset-0 flex items-center justify-center">
                    <span className="flex h-14 w-14 items-center justify-center rounded-full bg-paper text-ink">
                      <Play className="ml-0.5 h-6 w-6" />
                    </span>
                  </span>
                )}
              </div>
              <div className="flex flex-1 flex-col bg-white p-4">
                <p className="t-body text-ink-soft">
                  {item.type}
                  {item.date && <> · {formatDate(item.date, { day: undefined })}</>}
                  {item.source && <> · {item.source}</>}
                </p>
                <h3 className="mt-2 text-[1.1rem] font-semibold leading-snug tracking-[-0.015em]">{item.title}</h3>
                {item.description && <p className="t-body mt-2 line-clamp-3 text-ink-soft">{item.description}</p>}
                {!openable && (
                  <span className="link mt-auto inline-flex items-center gap-1 pt-3 t-small font-medium">
                    Open <ArrowUpRight className="h-3.5 w-3.5" />
                  </span>
                )}
              </div>
            </>
          );
          return (
            <Reveal as="li" key={item.id} delay={(i % 3) * 0.06} className="flex">
              {openable ? (
                <button type="button" onClick={() => setOpen(item)} className="group panel flex w-full flex-col overflow-hidden text-left">
                  {content}
                </button>
              ) : (
                <a href={item.url} target="_blank" rel="noreferrer" className="group panel flex w-full flex-col overflow-hidden">
                  {content}
                </a>
              )}
            </Reveal>
          );
        })}
      </ul>

      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-[100] flex items-center justify-center bg-night/90 p-4"
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
              initial={reduce ? false : { scale: 0.97, y: 10 }}
              animate={{ scale: 1, y: 0 }}
              exit={reduce ? undefined : { scale: 0.97, y: 10 }}
              transition={{ duration: 0.2 }}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                type="button"
                onClick={() => setOpen(null)}
                className="absolute -top-12 right-0 inline-flex h-11 w-11 items-center justify-center bg-paper text-ink hover:bg-sky"
                aria-label="Close"
              >
                <X className="h-5 w-5" />
              </button>
              <div className="overflow-hidden rounded-xl bg-night shadow-[0_24px_60px_-20px_rgba(0,0,0,0.6)]">
                {open.type === "Video" ? (
                  youtubeId(open.url) ? (
                    <iframe
                      className="aspect-video w-full"
                      src={`https://www.youtube-nocookie.com/embed/${youtubeId(open.url)}?autoplay=1`}
                      title={open.title}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  ) : (
                    <video src={open.url} controls autoPlay playsInline className="aspect-video w-full bg-black" />
                  )
                ) : (
                  <Image src={open.url} alt={open.title} width={1600} height={1200} className="max-h-[80vh] w-full object-contain" />
                )}
              </div>
              <div className="mt-3 flex items-start justify-between gap-4 text-paper">
                <div>
                  <p className="font-semibold">{open.title}</p>
                  {open.description && <p className="t-small mt-1 text-[#c3c9d8]">{open.description}</p>}
                </div>
                <a href={open.url} target="_blank" rel="noreferrer" className="link inline-flex shrink-0 items-center gap-1 t-small font-medium">
                  Open original <ArrowUpRight className="h-3.5 w-3.5" />
                </a>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
