"use client";

import { useEffect, useRef } from "react";

/**
 * Animated background for the hero: particles travelling along two families of
 * trajectories through a schematic "energy landscape". The blue family converges
 * to a compact native basin, the coral family diverges into an off-pathway basin.
 */
export function HeroCanvas({ className }: { className?: string }) {
  const ref = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let raf = 0;
    let width = 0;
    let height = 0;
    let dpr = 1;

    type Particle = { t: number; speed: number; lane: number; kind: "native" | "misfold"; size: number };
    const particles: Particle[] = [];
    const COUNT = 140;

    const rand = (a: number, b: number) => a + Math.random() * (b - a);

    for (let i = 0; i < COUNT; i++) {
      particles.push({
        t: Math.random(),
        speed: rand(0.0009, 0.0022),
        lane: rand(-1, 1),
        kind: Math.random() < 0.62 ? "native" : "misfold",
        size: rand(0.8, 2.2),
      });
    }

    function resize() {
      if (!canvas) return;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = canvas.clientWidth;
      height = canvas.clientHeight;
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    // Path functions: t in [0,1] → {x,y}. Starting unfolded on the left, converging/diverging on the right.
    function nativePath(t: number, lane: number) {
      const x = -40 + t * (width + 80);
      const amp = (1 - t) * 90 + 6;
      const y = height * 0.48 - t * height * 0.16 + Math.sin(t * 9 + lane * 2.2) * amp + lane * (1 - t) * 160;
      return { x, y };
    }
    function misfoldPath(t: number, lane: number) {
      const x = -40 + t * (width + 80);
      const amp = 40 + t * 60;
      const y = height * 0.52 + t * height * 0.22 + Math.sin(t * 11 + lane * 1.7) * amp * (0.5 + t) + lane * (1 - t) * 160;
      return { x, y };
    }

    function drawGuides() {
      ctx!.lineWidth = 1;
      for (let k = -2; k <= 2; k++) {
        const lane = k * 0.45;
        ctx!.beginPath();
        for (let i = 0; i <= 80; i++) {
          const t = i / 80;
          const { x, y } = nativePath(t, lane);
          if (i === 0) ctx!.moveTo(x, y);
          else ctx!.lineTo(x, y);
        }
        ctx!.strokeStyle = `rgba(56,189,248,${0.08 - Math.abs(k) * 0.015})`;
        ctx!.stroke();

        ctx!.beginPath();
        for (let i = 0; i <= 80; i++) {
          const t = i / 80;
          const { x, y } = misfoldPath(t, lane);
          if (i === 0) ctx!.moveTo(x, y);
          else ctx!.lineTo(x, y);
        }
        ctx!.strokeStyle = `rgba(251,113,133,${0.07 - Math.abs(k) * 0.012})`;
        ctx!.stroke();
      }
    }

    function drawBasins() {
      const native = nativePath(0.97, 0);
      const g1 = ctx!.createRadialGradient(native.x, native.y, 0, native.x, native.y, 220);
      g1.addColorStop(0, "rgba(59,130,246,0.28)");
      g1.addColorStop(1, "rgba(59,130,246,0)");
      ctx!.fillStyle = g1;
      ctx!.fillRect(0, 0, width, height);

      const mis = misfoldPath(0.97, 0);
      const g2 = ctx!.createRadialGradient(mis.x, mis.y, 0, mis.x, mis.y, 200);
      g2.addColorStop(0, "rgba(244,63,94,0.2)");
      g2.addColorStop(1, "rgba(244,63,94,0)");
      ctx!.fillStyle = g2;
      ctx!.fillRect(0, 0, width, height);
    }

    function frame() {
      ctx!.clearRect(0, 0, width, height);
      drawBasins();
      drawGuides();

      for (const p of particles) {
        const { x, y } = p.kind === "native" ? nativePath(p.t, p.lane) : misfoldPath(p.t, p.lane);
        const alpha = Math.min(1, p.t * 4) * Math.min(1, (1 - p.t) * 6 + 0.2);
        const color = p.kind === "native" ? `rgba(125,211,252,${0.55 * alpha})` : `rgba(253,164,175,${0.5 * alpha})`;
        ctx!.beginPath();
        ctx!.arc(x, y, p.size + p.t * 1.2, 0, Math.PI * 2);
        ctx!.fillStyle = color;
        ctx!.fill();
        if (!reduce) {
          p.t += p.speed;
          if (p.t > 1) {
            p.t = 0;
            p.lane = rand(-1, 1);
          }
        }
      }
      if (!reduce) raf = requestAnimationFrame(frame);
    }

    resize();
    frame();
    const ro = new ResizeObserver(() => {
      resize();
      if (reduce) frame();
    });
    ro.observe(canvas);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
    };
  }, []);

  return <canvas ref={ref} aria-hidden="true" className={className} />;
}
