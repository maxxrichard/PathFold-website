"use client";

import { useEffect, useRef } from "react";

/**
 * Muted, looping inline clip (autoplays on mobile thanks to playsInline).
 * Paused automatically for users who prefer reduced motion; the poster is shown instead.
 */
export function LoopVideo({
  src,
  poster,
  className,
  label,
  width,
  height,
}: {
  src: string;
  poster?: string;
  className?: string;
  label: string;
  width: number;
  height: number;
}) {
  const ref = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    const video = ref.current;
    if (!video) return;
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const apply = () => {
      if (mq.matches) video.pause();
      else void video.play().catch(() => {});
    };
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, []);

  return (
    <video
      ref={ref}
      className={className}
      src={src}
      poster={poster}
      width={width}
      height={height}
      autoPlay
      muted
      loop
      playsInline
      preload="metadata"
      aria-label={label}
    />
  );
}
