import { useMemo, useState } from "react";
import type { RooflineData } from "@/data/hdes";
import { LINK_COLORS, LINK_LABELS, MODE_LABELS, MODE_MARKER, MODE_CEILING_DASH, type LinkType } from "./colors";

const WIDTH = 640;
const HEIGHT = 340;
const PAD_L = 46;
const PAD_R = 14;
const PAD_T = 14;
const PAD_B = 32;

const LINK_ORDER: LinkType[] = ["pcie", "eth", "nv"];
const MODE_ORDER = ["naive", "comet", "floreana", "archipelago"];
const MARKER_SIZE = 4.2;

function log10(v: number) {
  return Math.log(v) / Math.LN10;
}

function Marker({
  mode, cx, cy, color, onEnter, onLeave,
}: {
  mode: string; cx: number; cy: number; color: string;
  onEnter: () => void; onLeave: () => void;
}) {
  const s = MARKER_SIZE;
  const common = {
    fill: color, stroke: "#1c1917", strokeWidth: 0.6,
    onMouseEnter: onEnter, onMouseLeave: onLeave,
    className: "cursor-pointer",
  };
  switch (MODE_MARKER[mode]) {
    case "square":
      return <rect x={cx - s} y={cy - s} width={s * 2} height={s * 2} {...common} />;
    case "diamond":
      return (
        <polygon
          points={`${cx},${cy - s * 1.35} ${cx + s * 1.15},${cy} ${cx},${cy + s * 1.35} ${cx - s * 1.15},${cy}`}
          {...common}
        />
      );
    case "triangle":
      return (
        <polygon
          points={`${cx},${cy - s * 1.3} ${cx + s * 1.25},${cy + s * 0.9} ${cx - s * 1.25},${cy + s * 0.9}`}
          {...common}
        />
      );
    default:
      return <circle cx={cx} cy={cy} r={s} {...common} />;
  }
}

export default function RooflinePanel({ data }: { data: RooflineData }) {
  const clusters = useMemo(
    () => Array.from(new Set(data.results.map((r) => r.cluster))).sort((a, b) => a - b),
    [data],
  );
  const modes = useMemo(
    () => MODE_ORDER.filter((m) => data.results.some((r) => r.mode === m)),
    [data],
  );

  const [cluster, setCluster] = useState(clusters[0] ?? 8);
  const [hover, setHover] = useState<{ x: number; y: number; label: string } | null>(null);

  const points = useMemo(() => data.results.filter((r) => r.cluster === cluster), [data, cluster]);

  const plotW = WIDTH - PAD_L - PAD_R;
  const plotH = HEIGHT - PAD_T - PAD_B;

  const { xMin, xMax, yMin, yMax } = useMemo(() => {
    const ais: number[] = [];
    const gs: number[] = [];
    for (const mode of modes) {
      for (const t of LINK_ORDER) {
        const ridge = data.ridges[mode]?.[t];
        if (ridge) ais.push(ridge);
      }
      const peak = (data.peak_flops_per_gpu[mode] ?? 0) * data.ep;
      gs.push(peak / 1e9);
    }
    for (const r of points) {
      for (const t of LINK_ORDER) {
        const p = r.panel[t];
        if (p) {
          ais.push(p.ai);
          gs.push(p.gflops);
        }
      }
    }
    return {
      xMin: Math.min(...ais) / 2,
      xMax: Math.max(...ais) * 2,
      yMin: Math.min(...gs) / 3,
      yMax: Math.max(...gs) * 2,
    };
  }, [data, points, modes]);

  const xAt = (ai: number) => PAD_L + ((log10(ai) - log10(xMin)) / (log10(xMax) - log10(xMin))) * plotW;
  const yAt = (gf: number) => PAD_T + plotH - ((log10(gf) - log10(yMin)) / (log10(yMax) - log10(yMin))) * plotH;

  const ceilingPath = (mode: string, t: LinkType) => {
    const bw = data.bw_by_link[t] * data.ep;
    const peak = (data.peak_flops_per_gpu[mode] ?? 0) * data.ep;
    const n = 40;
    const pts: string[] = [];
    for (let i = 0; i <= n; i++) {
      const lx = log10(xMin) + ((log10(xMax) - log10(xMin)) * i) / n;
      const ai = Math.pow(10, lx);
      const gflops = Math.min(peak, bw * ai) / 1e9;
      pts.push(`${i === 0 ? "M" : "L"} ${xAt(ai).toFixed(1)} ${yAt(gflops).toFixed(1)}`);
    }
    return pts.join(" ");
  };

  // Connect same (mode, link) series across seq_len — "connect the dots,"
  // matching the real chart's own ax.plot() line through each series.
  const seriesPath = (mode: string, t: LinkType) => {
    const series = points
      .filter((r) => r.mode === mode && r.panel[t])
      .sort((a, b) => a.seq_len - b.seq_len);
    if (series.length < 2) return null;
    return series
      .map((r, i) => `${i === 0 ? "M" : "L"} ${xAt(r.panel[t]!.ai).toFixed(1)} ${yAt(r.panel[t]!.gflops).toFixed(1)}`)
      .join(" ");
  };

  const xTicks = useMemo(() => {
    const lo = Math.ceil(log10(xMin));
    const hi = Math.floor(log10(xMax));
    const t: number[] = [];
    for (let e = lo; e <= hi; e++) t.push(Math.pow(10, e));
    return t;
  }, [xMin, xMax]);

  const yTicks = useMemo(() => {
    const lo = Math.ceil(log10(yMin));
    const hi = Math.floor(log10(yMax));
    const t: number[] = [];
    for (let e = lo; e <= hi; e++) t.push(Math.pow(10, e));
    return t;
  }, [yMin, yMax]);

  const fmt = (v: number) => {
    if (v >= 1_000_000) return `${(v / 1_000_000).toFixed(v >= 10_000_000 ? 0 : 1)}M`;
    if (v >= 1000) return `${(v / 1000).toFixed(v >= 10000 ? 0 : 1)}k`;
    return v >= 1 ? v.toFixed(0) : v.toFixed(2);
  };

  // Ceilings only for (mode, link) pairs actually present at this cluster,
  // so the figure doesn't draw hardware ceilings with no data to compare.
  const modeLinkPairsPresent = useMemo(() => {
    const pairs: [string, LinkType][] = [];
    for (const mode of modes) {
      for (const t of LINK_ORDER) {
        if (points.some((r) => r.mode === mode && r.panel[t])) pairs.push([mode, t]);
      }
    }
    return pairs;
  }, [points, modes]);

  return (
    <div className="space-y-3">
      <div className="flex rounded-full bg-stone-100 p-0.5 text-xs w-fit">
        {clusters.map((c) => (
          <button
            key={c}
            onClick={() => setCluster(c)}
            className={`px-2.5 py-1 rounded-full transition-colors ${
              cluster === c ? "bg-stone-900 text-white" : "text-stone-600 hover:text-stone-900"
            }`}
          >
            {c}/rack
          </button>
        ))}
      </div>

      <svg viewBox={`0 0 ${WIDTH} ${HEIGHT}`} className="w-full h-auto rounded-md border border-stone-200 bg-white">
        {yTicks.map((v) => (
          <g key={v}>
            <line x1={PAD_L} x2={WIDTH - PAD_R} y1={yAt(v)} y2={yAt(v)} stroke="#e7e5e4" strokeWidth={1} />
            <text x={PAD_L - 6} y={yAt(v) + 3} textAnchor="end" fontSize={8} fill="#78716c">
              {fmt(v)}
            </text>
          </g>
        ))}
        {xTicks.map((v) => (
          <g key={v}>
            <line x1={xAt(v)} x2={xAt(v)} y1={PAD_T} y2={PAD_T + plotH} stroke="#f5f5f4" strokeWidth={1} />
            <text x={xAt(v)} y={HEIGHT - PAD_B + 12} textAnchor="middle" fontSize={8} fill="#78716c">
              {fmt(v)}
            </text>
          </g>
        ))}

        {modeLinkPairsPresent.map(([mode, t]) => (
          <path
            key={`ceil-${mode}-${t}`}
            d={ceilingPath(mode, t)}
            fill="none"
            stroke={LINK_COLORS[t]}
            strokeWidth={1.4}
            strokeDasharray={MODE_CEILING_DASH[mode]}
            opacity={0.55}
          />
        ))}

        {modeLinkPairsPresent.map(([mode, t]) => {
          const path = seriesPath(mode, t);
          return path ? (
            <path key={`line-${mode}-${t}`} d={path} fill="none" stroke={LINK_COLORS[t]} strokeWidth={1} opacity={0.35} />
          ) : null;
        })}

        {LINK_ORDER.map((t) =>
          points.map((p) => {
            const panel = p.panel[t];
            if (!panel) return null;
            const cx = xAt(panel.ai);
            const cy = yAt(panel.gflops);
            return (
              <Marker
                key={`${p.mode}-${t}-${p.seq_len}`}
                mode={p.mode}
                cx={cx}
                cy={cy}
                color={LINK_COLORS[t]}
                onEnter={() =>
                  setHover({
                    x: cx,
                    y: cy,
                    label: `${MODE_LABELS[p.mode] ?? p.mode} · ${LINK_LABELS[t]} · seq=${p.seq_len.toLocaleString()} · AI=${panel.ai.toFixed(
                      0,
                    )} FLOPs/B · ${panel.gflops.toLocaleString(undefined, {
                      maximumFractionDigits: 0,
                    })} GFLOP/s · eff=${(panel.efficiency * 100).toFixed(0)}%`,
                  })
                }
                onLeave={() => setHover(null)}
              />
            );
          }),
        )}

        <text x={PAD_L + plotW / 2} y={HEIGHT - 4} textAnchor="middle" fontSize={8.5} fill="#78716c">
          Arithmetic intensity (FLOPs/Byte, log scale)
        </text>
        <text
          x={10}
          y={PAD_T + plotH / 2}
          textAnchor="middle"
          fontSize={8.5}
          fill="#78716c"
          transform={`rotate(-90 10 ${PAD_T + plotH / 2})`}
        >
          Attained (GFLOP/s, log scale)
        </text>
      </svg>

      {hover && (
        <div className="text-xs rounded-md border border-stone-200 bg-stone-50 px-3 py-2">{hover.label}</div>
      )}

      <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs">
        {LINK_ORDER.map((t) => (
          <span key={t} className="flex items-center gap-1.5">
            <span className="inline-block w-3.5 h-0.5 rounded-full" style={{ backgroundColor: LINK_COLORS[t] }} />
            <span className="text-stone-600">{LINK_LABELS[t]}</span>
          </span>
        ))}
        <span className="text-stone-300">|</span>
        {modes.map((m) => (
          <span key={m} className="flex items-center gap-1.5 text-stone-600">
            <svg width="10" height="10" viewBox="-5 -5 10 10">
              <Marker mode={m} cx={0} cy={0} color="#78716c" onEnter={() => {}} onLeave={() => {}} />
            </svg>
            {MODE_LABELS[m] ?? m}
          </span>
        ))}
      </div>
      <div className="text-xs text-stone-400">
        {data.model.experts} experts &middot; top-{data.model.topk} &middot; EP={data.ep}
      </div>
    </div>
  );
}
