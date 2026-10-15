"use client";

import { useMemo, useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { Info } from "lucide-react";
import { cn } from "@/lib/utils";

/* ------------------------------------------------------------------ */
/* Sample proteins (public sequences)                                   */
/* ------------------------------------------------------------------ */
const SAMPLES: Array<{ id: string; name: string; note: string; sequence: string; kind: "fast-folder" | "amyloid" }> = [
  {
    id: "chignolin",
    name: "Chignolin",
    note: "10-residue designed β-hairpin; Tier-1 fast-folder benchmark",
    sequence: "GYDPETGTWG",
    kind: "fast-folder",
  },
  {
    id: "trp-cage",
    name: "Trp-cage",
    note: "20-residue miniprotein, folds in ~4 µs",
    sequence: "NLYIQWLKDGGPSSGRPPPS",
    kind: "fast-folder",
  },
  {
    id: "villin",
    name: "Villin headpiece (HP35)",
    note: "Three-helix bundle, classic fast-folding benchmark",
    sequence: "LSDEDFKAVFGMTRSAFANLPLWKQQNLKKEKGLF",
    kind: "fast-folder",
  },
  {
    id: "ww",
    name: "WW domain (Pin1)",
    note: "Three-stranded β-sheet, Tier-1 benchmark",
    sequence: "KLPPGWEKRMSRSSGRVYYFNHITNASQWERPSG",
    kind: "fast-folder",
  },
  {
    id: "abeta42",
    name: "Amyloid-β (1–42)",
    note: "Alzheimer's disease peptide; off-pathway aggregation",
    sequence: "DAEFRHDSGYEVHHQKLVFFAEDVGSNKGAIIGLMVGGVVIA",
    kind: "amyloid",
  },
  {
    id: "asyn-nac",
    name: "α-Synuclein NAC region (61–95)",
    note: "Parkinson's disease; aggregation-prone core",
    sequence: "EQVTNVGGAVVTGVTAVAQKTVEGAGSIAAATGFV",
    kind: "amyloid",
  },
];

/* Kyte–Doolittle hydropathy and simple β-propensity (Chou–Fasman) scales */
const KD: Record<string, number> = {
  A: 1.8, R: -4.5, N: -3.5, D: -3.5, C: 2.5, Q: -3.5, E: -3.5, G: -0.4, H: -3.2, I: 4.5,
  L: 3.8, K: -3.9, M: 1.9, F: 2.8, P: -1.6, S: -0.8, T: -0.7, W: -0.9, Y: -1.3, V: 4.2,
};
const BETA: Record<string, number> = {
  A: 0.83, R: 0.93, N: 0.89, D: 0.54, C: 1.19, Q: 1.1, E: 0.37, G: 0.75, H: 0.87, I: 1.6,
  L: 1.3, K: 0.74, M: 1.05, F: 1.38, P: 0.55, S: 0.75, T: 1.19, W: 1.37, Y: 1.47, V: 1.7,
};

function residueColor(aa: string) {
  const h = KD[aa] ?? 0;
  if (h >= 2.5) return "text-sky-300";
  if (h >= 1) return "text-sky-200/80";
  if (h <= -3) return "text-rose-300";
  if (h <= -1) return "text-rose-200/70";
  return "text-fg-muted";
}

/** Sliding-window aggregation-propensity heuristic (illustration only). */
function propensity(seq: string, window = 5) {
  const half = Math.floor(window / 2);
  return seq.split("").map((_, i) => {
    let s = 0;
    let n = 0;
    for (let j = i - half; j <= i + half; j++) {
      const aa = seq[j];
      if (!aa) continue;
      const kd = (KD[aa] ?? 0) / 4.5; // -1..1
      const beta = ((BETA[aa] ?? 1) - 1) / 0.7; // ≈ -1..1
      s += 0.6 * kd + 0.4 * beta;
      n++;
    }
    const v = n ? s / n : 0;
    return Math.max(0, Math.min(1, (v + 0.6) / 1.4));
  });
}

const STATES = {
  native: [
    { label: "Unfolded chain", desc: "Extended, disordered polypeptide after synthesis." },
    { label: "Early collapse", desc: "Hydrophobic collapse; first transient contacts form." },
    { label: "Secondary structure", desc: "Local helices and hairpins nucleate (ms–µs)." },
    { label: "Intermediate", desc: "Partially ordered state in a local energy minimum." },
    { label: "Transition state", desc: "Rate-limiting barrier; native contacts become cooperative." },
    { label: "Near-native", desc: "Topology fixed; side chains pack and anneal." },
    { label: "Native fold", desc: "Functional, thermodynamically stable conformation." },
  ],
  misfold: [
    { label: "Unfolded chain", desc: "Extended, disordered polypeptide after synthesis." },
    { label: "Early collapse", desc: "Shared early intermediate: here the pathways still overlap." },
    { label: "Off-pathway intermediate", desc: "Exposed hydrophobic/β-prone segments remain solvent-accessible." },
    { label: "Kinetic trap", desc: "Misfolded state stabilised by non-native contacts." },
    { label: "Oligomer nucleation", desc: "Intermolecular β-contacts seed small toxic oligomers." },
    { label: "Protofibril", desc: "Ordered cross-β assemblies grow by elongation." },
    { label: "Amyloid fibril", desc: "Insoluble aggregate; hallmark of Alzheimer's and Parkinson's disease." },
  ],
};

export function PathwayExplorer() {
  const [sampleId, setSampleId] = useState(SAMPLES[0].id);
  const [custom, setCustom] = useState("");
  const [mode, setMode] = useState<"native" | "misfold">("native");
  const [active, setActive] = useState(2);
  const reduce = useReducedMotion();

  const sample = SAMPLES.find((s) => s.id === sampleId)!;
  const seq = (custom.trim() ? custom : sample.sequence).toUpperCase().replace(/[^ACDEFGHIKLMNPQRSTVWY]/g, "").slice(0, 120);
  const prop = useMemo(() => propensity(seq), [seq]);
  const meanProp = prop.length ? prop.reduce((a, b) => a + b, 0) / prop.length : 0;
  const hotspots = useMemo(() => {
    const idx: number[] = [];
    prop.forEach((p, i) => p > 0.72 && idx.push(i + 1));
    // compress into ranges
    const ranges: string[] = [];
    let start: number | null = null;
    let prev = -2;
    for (const i of idx) {
      if (start === null) start = i;
      else if (i !== prev + 1) {
        ranges.push(start === prev ? `${start}` : `${start}–${prev}`);
        start = i;
      }
      prev = i;
    }
    if (start !== null) ranges.push(start === prev ? `${start}` : `${start}–${prev}`);
    return ranges;
  }, [prop]);

  const states = STATES[mode];
  const current = states[Math.min(active, states.length - 1)];

  return (
    <div className="card overflow-hidden">
      <div className="grid lg:grid-cols-[minmax(0,1fr)_20rem]">
        {/* Left: sequence + trajectory */}
        <div className="p-6 sm:p-8">
          <div className="flex flex-wrap items-center gap-2">
            {SAMPLES.map((s) => (
              <button
                key={s.id}
                type="button"
                onClick={() => {
                  setSampleId(s.id);
                  setCustom("");
                  setMode(s.kind === "amyloid" ? "misfold" : "native");
                }}
                className={cn(
                  "chip cursor-pointer transition",
                  sampleId === s.id && !custom
                    ? s.kind === "amyloid"
                      ? "border-misfold/50 bg-misfold/15 text-misfold"
                      : "border-brand-cyan/50 bg-brand-cyan/15 text-brand-cyan"
                    : "hover:border-border-strong hover:text-fg",
                )}
                aria-pressed={sampleId === s.id && !custom}
              >
                {s.name}
              </button>
            ))}
          </div>

          <label className="mt-5 block">
            <span className="text-xs font-semibold uppercase tracking-wider text-fg-subtle">Amino acid sequence</span>
            <input
              value={custom}
              onChange={(e) => setCustom(e.target.value)}
              placeholder={sample.sequence}
              spellCheck={false}
              className="input mt-2 font-mono text-sm tracking-[0.08em]"
              aria-label="Enter an amino acid sequence (one-letter code)"
            />
          </label>
          <p className="mt-2 text-xs text-fg-subtle">
            {custom ? "Custom sequence" : sample.note} · {seq.length} residues
          </p>

          {/* residue strip */}
          <div className="mt-5 overflow-x-auto rounded-xl border border-border bg-bg/60 p-4">
            <div className="flex gap-[3px] font-mono text-sm" aria-label="Sequence with per-residue hydropathy colouring">
              {seq.split("").map((aa, i) => (
                <div key={i} className="flex flex-col items-center gap-1.5">
                  <span className={cn("w-4 text-center", residueColor(aa))}>{aa}</span>
                  <span
                    className="h-10 w-4 rounded-sm bg-gradient-to-t from-brand-blue/30 to-brand-cyan/50"
                    style={{
                      backgroundImage:
                        prop[i] > 0.72
                          ? "linear-gradient(to top, rgba(244,63,94,0.35), rgba(251,113,133,0.9))"
                          : "linear-gradient(to top, rgba(59,130,246,0.3), rgba(56,189,248,0.7))",
                      clipPath: `inset(${Math.round((1 - prop[i]) * 100)}% 0 0 0)`,
                    }}
                    title={`Residue ${i + 1} (${aa}): propensity ${(prop[i] * 100).toFixed(0)}%`}
                  />
                </div>
              ))}
            </div>
          </div>
          <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-1 text-xs text-fg-subtle">
            <span>
              <span className="mr-1 inline-block h-2 w-2 rounded-sm bg-brand-cyan" /> hydrophobic / β-prone window
            </span>
            <span>
              <span className="mr-1 inline-block h-2 w-2 rounded-sm bg-misfold" /> aggregation-prone hotspot
            </span>
            <span>
              Hotspots: <span className="font-mono text-fg-muted">{hotspots.length ? hotspots.join(", ") : "none"}</span>
            </span>
          </div>

          {/* trajectory */}
          <div className="mt-8 flex items-center justify-between gap-4">
            <h3 className="font-display text-lg font-semibold text-fg">Kinetically ordered trajectory</h3>
            <div className="inline-flex rounded-full border border-border bg-bg/60 p-1" role="tablist" aria-label="Pathway">
              {(["native", "misfold"] as const).map((m) => (
                <button
                  key={m}
                  type="button"
                  role="tab"
                  aria-selected={mode === m}
                  onClick={() => setMode(m)}
                  className={cn(
                    "cursor-pointer rounded-full px-3.5 py-1.5 text-xs font-semibold transition",
                    mode === m
                      ? m === "native"
                        ? "bg-brand-blue/30 text-sky-200"
                        : "bg-misfold/25 text-misfold"
                      : "text-fg-muted hover:text-fg",
                  )}
                >
                  {m === "native" ? "Productive folding" : "Off-pathway misfolding"}
                </button>
              ))}
            </div>
          </div>

          <div className="relative mt-6">
            <svg viewBox="0 0 700 120" className="h-28 w-full" aria-hidden="true">
              <defs>
                <linearGradient id="pe-native" x1="0" x2="1">
                  <stop offset="0" stopColor="#38bdf8" />
                  <stop offset="1" stopColor="#6366f1" />
                </linearGradient>
                <linearGradient id="pe-misfold" x1="0" x2="1">
                  <stop offset="0" stopColor="#fb923c" />
                  <stop offset="1" stopColor="#f43f5e" />
                </linearGradient>
              </defs>
              <motion.path
                key={mode}
                d={
                  mode === "native"
                    ? "M10 60 C 80 20, 120 100, 200 60 S 300 20, 380 55 S 500 95, 580 60 S 650 40, 690 48"
                    : "M10 60 C 80 20, 120 100, 200 60 S 300 100, 380 85 S 500 40, 580 90 S 650 110, 690 100"
                }
                fill="none"
                stroke={mode === "native" ? "url(#pe-native)" : "url(#pe-misfold)"}
                strokeWidth="3"
                strokeLinecap="round"
                initial={reduce ? false : { pathLength: 0, opacity: 0.4 }}
                animate={{ pathLength: 1, opacity: 1 }}
                transition={{ duration: 1.4, ease: "easeOut" }}
              />
              {states.map((_, i) => {
                const x = 10 + (i * 680) / (states.length - 1);
                const yNative = [60, 50, 68, 55, 50, 62, 48];
                const yMis = [60, 50, 72, 85, 60, 90, 100];
                const y = (mode === "native" ? yNative : yMis)[i];
                return (
                  <g key={i} className="cursor-pointer" onClick={() => setActive(i)}>
                    <circle cx={x} cy={y} r={active === i ? 9 : 6} fill="#070b14" stroke={mode === "native" ? "#38bdf8" : "#fb7185"} strokeWidth="2.5" />
                    {active === i && (
                      <circle cx={x} cy={y} r={14} fill="none" stroke={mode === "native" ? "#38bdf8" : "#fb7185"} strokeOpacity="0.35" strokeWidth="2" />
                    )}
                    <rect x={x - 24} y={y - 24} width="48" height="48" fill="transparent" />
                  </g>
                );
              })}
            </svg>
            <div className="mt-1 grid grid-cols-7 gap-1">
              {states.map((s, i) => (
                <button
                  key={s.label}
                  type="button"
                  onClick={() => setActive(i)}
                  className={cn(
                    "cursor-pointer rounded-md px-1 py-1.5 text-center text-[10px] leading-tight transition sm:text-xs",
                    active === i ? "text-fg" : "text-fg-subtle hover:text-fg-muted",
                  )}
                  aria-pressed={active === i}
                >
                  {s.label}
                </button>
              ))}
            </div>
            <input
              type="range"
              min={0}
              max={states.length - 1}
              value={active}
              onChange={(e) => setActive(Number(e.target.value))}
              className="mt-3 w-full accent-brand-cyan"
              aria-label="Position along the trajectory"
            />
          </div>
        </div>

        {/* Right: state description */}
        <aside className="border-t border-border bg-bg/50 p-6 sm:p-8 lg:border-l lg:border-t-0">
          <p className="eyebrow">{mode === "native" ? "Productive pathway" : "Off-pathway divergence"}</p>
          <AnimatePresence mode="wait">
            <motion.div
              key={`${mode}-${active}`}
              initial={reduce ? false : { opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reduce ? undefined : { opacity: 0, y: -6 }}
              transition={{ duration: 0.22 }}
            >
              <p className="mt-2 text-xs text-fg-subtle">
                State {active + 1} of {states.length}
              </p>
              <h4 className="font-display mt-1 text-2xl font-semibold text-fg">{current.label}</h4>
              <p className="mt-3 text-sm leading-relaxed text-fg-muted">{current.desc}</p>
            </motion.div>
          </AnimatePresence>

          <dl className="mt-8 space-y-4 text-sm">
            <div>
              <dt className="text-fg-subtle">Mean hydrophobic / β-propensity</dt>
              <dd className="mt-1.5 h-2 w-full overflow-hidden rounded-full bg-white/8">
                <div
                  className={cn("h-full rounded-full", meanProp > 0.55 ? "bg-gradient-to-r from-orange-400 to-misfold" : "bg-gradient-to-r from-brand-cyan to-brand-indigo")}
                  style={{ width: `${Math.round(meanProp * 100)}%` }}
                />
              </dd>
              <dd className="mt-1 text-xs text-fg-subtle">{(meanProp * 100).toFixed(0)}% of scale</dd>
            </div>
            <div>
              <dt className="text-fg-subtle">Divergence risk (heuristic)</dt>
              <dd className="mt-1 font-semibold text-fg">
                {meanProp > 0.6 || hotspots.length >= 2 ? "Elevated" : meanProp > 0.45 || hotspots.length === 1 ? "Moderate" : "Low"}
              </dd>
            </div>
          </dl>

          <p className="mt-8 flex items-start gap-2 text-xs leading-relaxed text-fg-subtle">
            <Info className="mt-0.5 h-3.5 w-3.5 shrink-0" />
            Illustration only. The propensity track uses classical hydropathy and β-propensity scales, not PathFold
            predictions. PathFold-P and PathFold-M will replace this schematic once released.
          </p>
        </aside>
      </div>
    </div>
  );
}
