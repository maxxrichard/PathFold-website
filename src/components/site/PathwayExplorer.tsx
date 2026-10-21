"use client";

import { useMemo, useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
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
  if (h >= 2.5) return "text-native";
  if (h >= 1) return "text-native/75";
  if (h <= -3) return "text-misfold";
  if (h <= -1) return "text-misfold/75";
  return "text-ink-soft";
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

const NATIVE = "#1d5fe0";
const MISFOLD = "#d9462b";

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
  const stroke = mode === "native" ? NATIVE : MISFOLD;

  return (
    <div className="panel overflow-hidden text-ink">
      <div className="grid lg:grid-cols-[minmax(0,1fr)_21rem]">
        {/* Left: sequence + trajectory */}
        <div className="p-5 sm:p-8">
          <div className="flex flex-wrap gap-2" role="group" aria-label="Benchmark proteins">
            {SAMPLES.map((s) => {
              const on = sampleId === s.id && !custom;
              return (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => {
                    setSampleId(s.id);
                    setCustom("");
                    setMode(s.kind === "amyloid" ? "misfold" : "native");
                  }}
                  className={cn(
                    "min-h-10 rounded-md px-3 py-2 text-[0.9375rem] font-medium transition-colors",
                    on ? (s.kind === "amyloid" ? "bg-coral text-ink" : "bg-sky text-ink") : "bg-paper-2 text-ink-soft hover:bg-paper-3 hover:text-ink",
                  )}
                  aria-pressed={on}
                >
                  {s.name}
                </button>
              );
            })}
          </div>

          <label className="mt-6 block">
            <span className="t-small font-medium text-ink-soft">Amino acid sequence (one-letter code)</span>
            <input
              value={custom}
              onChange={(e) => setCustom(e.target.value)}
              placeholder={sample.sequence}
              spellCheck={false}
              autoCapitalize="characters"
              autoCorrect="off"
              className="input mt-2 tracking-[0.12em]"
            />
          </label>
          <p className="t-small mt-2 text-ink-soft">
            {custom ? "Custom sequence" : sample.note} · {seq.length} residues
          </p>

          {/* residue strip */}
          <div className="mt-5 overflow-x-auto rounded-md bg-paper-2 p-4 [touch-action:pan-x]">
            <div className="flex gap-[3px] text-[0.9375rem] font-medium" aria-label="Sequence with per-residue hydropathy colouring">
              {seq.split("").map((aa, i) => {
                const hot = prop[i] > 0.72;
                return (
                  <div key={i} className="flex flex-col items-center gap-1.5">
                    <span className={cn("w-4 text-center", residueColor(aa))}>{aa}</span>
                    <span className="relative h-10 w-4 rounded-sm bg-paper-3" title={`Residue ${i + 1} (${aa}): propensity ${(prop[i] * 100).toFixed(0)}%`}>
                      <span className={cn("absolute inset-x-0 bottom-0", hot ? "bg-misfold" : "bg-native")} style={{ height: `${Math.round(prop[i] * 100)}%` }} />
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
          <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-1 t-small text-ink-soft">
            <span>
              <span className="mr-1.5 inline-block h-2.5 w-2.5 bg-native align-[-1px]" /> hydrophobic / β-prone window
            </span>
            <span>
              <span className="mr-1.5 inline-block h-2.5 w-2.5 bg-misfold align-[-1px]" /> aggregation-prone hotspot
            </span>
            <span>
              Hotspots: <span className="font-medium text-ink">{hotspots.length ? hotspots.join(", ") : "none"}</span>
            </span>
          </div>

          {/* trajectory */}
          <div className="mt-10 flex flex-wrap items-center justify-between gap-4">
            <h3 className="text-[1.25rem] font-semibold tracking-[-0.015em]">Kinetically ordered trajectory</h3>
            <div className="inline-flex rounded-md bg-paper-2 p-1" role="tablist" aria-label="Pathway">
              {(["native", "misfold"] as const).map((m) => (
                <button
                  key={m}
                  type="button"
                  role="tab"
                  aria-selected={mode === m}
                  onClick={() => setMode(m)}
                  className={cn(
                    "min-h-9 rounded px-3.5 py-1.5 text-[0.9rem] font-medium transition-colors",
                    mode === m ? (m === "native" ? "bg-sky text-ink" : "bg-coral text-ink") : "text-ink-soft hover:text-ink",
                  )}
                >
                  {m === "native" ? "Productive folding" : "Off-pathway misfolding"}
                </button>
              ))}
            </div>
          </div>

          <div className="relative mt-6">
            <svg viewBox="0 0 700 120" className="h-28 w-full" aria-hidden="true">
              <motion.path
                key={mode}
                d={
                  mode === "native"
                    ? "M10 60 C 80 20, 120 100, 200 60 S 300 20, 380 55 S 500 95, 580 60 S 650 40, 690 48"
                    : "M10 60 C 80 20, 120 100, 200 60 S 300 100, 380 85 S 500 40, 580 90 S 650 110, 690 100"
                }
                fill="none"
                stroke={stroke}
                strokeWidth="3"
                strokeLinecap="round"
                initial={reduce ? false : { pathLength: 0, opacity: 0.4 }}
                animate={{ pathLength: 1, opacity: 1 }}
                transition={{ duration: 1.4, ease: "easeOut" }}
              />
              {states.map((s, i) => {
                const x = 10 + (i * 680) / (states.length - 1);
                const yNative = [60, 50, 68, 55, 50, 62, 48];
                const yMis = [60, 50, 72, 85, 60, 90, 100];
                const y = (mode === "native" ? yNative : yMis)[i];
                return (
                  <g key={i} className="cursor-pointer" onClick={() => setActive(i)}>
                    <title>{s.label}</title>
                    <circle cx={x} cy={y} r={active === i ? 9 : 6} fill="#ffffff" stroke={stroke} strokeWidth="2.5" />
                    {active === i && <circle cx={x} cy={y} r={14} fill="none" stroke={stroke} strokeOpacity="0.35" strokeWidth="2" />}
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
                    "min-h-10 px-0.5 py-1 text-center text-[0.8125rem] leading-tight transition-colors",
                    active === i ? "font-semibold text-ink" : "text-ink-faint hover:text-ink-soft",
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
              className="mt-3 h-11 w-full [touch-action:pan-y]"
              style={{ accentColor: stroke }}
              aria-label="Position along the trajectory"
            />
          </div>
        </div>

        {/* Right: state description */}
        <aside className={cn("border-t border-border p-5 transition-colors duration-500 sm:p-8 lg:border-l lg:border-t-0", mode === "native" ? "field-sky" : "field-coral")}>
          <p className="t-body font-medium">{mode === "native" ? "Productive pathway" : "Off-pathway divergence"}</p>
          <AnimatePresence mode="wait">
            <motion.div
              key={`${mode}-${active}`}
              initial={reduce ? false : { opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reduce ? undefined : { opacity: 0, y: -6 }}
              transition={{ duration: 0.22 }}
            >
              <h4 className="mt-6 text-[1.75rem] font-semibold leading-tight tracking-[-0.02em]">{current.label}</h4>
              <p className="t-body mt-3">{current.desc}</p>
              <p className="t-small mt-3 text-ink-soft">
                State {active + 1} of {states.length}
              </p>
            </motion.div>
          </AnimatePresence>

          <dl className="mt-10 space-y-5 t-body">
            <div>
              <dt className="t-small text-ink-soft">Mean hydrophobic / β-propensity</dt>
              <dd className="mt-2 h-2 w-full overflow-hidden rounded-full bg-ink/10">
                <div className={cn("h-full rounded-full", meanProp > 0.55 ? "bg-misfold" : "bg-native")} style={{ width: `${Math.round(meanProp * 100)}%` }} />
              </dd>
              <dd className="t-small mt-1.5 text-ink-soft">{(meanProp * 100).toFixed(0)}% of scale</dd>
            </div>
            <div>
              <dt className="t-small text-ink-soft">Divergence risk (heuristic)</dt>
              <dd className="mt-1 font-semibold">
                {meanProp > 0.6 || hotspots.length >= 2 ? "Elevated" : meanProp > 0.45 || hotspots.length === 1 ? "Moderate" : "Low"}
              </dd>
            </div>
          </dl>

          <p className="t-small mt-10 text-ink-soft">
            Illustration only. The propensity track uses classical hydropathy and β-propensity scales, not PathFold predictions. PathFold-P and
            PathFold-M will replace this schematic once released.
          </p>
        </aside>
      </div>
    </div>
  );
}
