import { useMemo, useState } from "react";
import type { NetworkData } from "@/data/hdes";
import { LINK_COLORS, LINK_LABELS, LINK_SHORT, MODE_LABELS, PHASE_COLORS, PHASE_LABELS, type LinkType, type PhaseType } from "./colors";

const WIDTH = 640;
const PAD_L = 42;
const PAD_R = 12;
const PAD_B = 20;

// Three stacked per-link-type panels, each with its own y-scale — mirrors
// the real plot_network's design (simulator/metrics/plots/network.py:
// _plot_network_throughput draws NVLink/PCIe/Ethernet as three separate
// subplots, never one shared axis) precisely because NVLink's brief,
// order-of-magnitude-larger spikes would otherwise flatten PCIe/Ethernet's
// much smaller curves into an unreadable band near zero on a shared scale.
const PANEL_H = 62;
const PANEL_GAP = 8;
const PANEL_ORDER: LinkType[] = ["eth", "pcie", "nv"];
const CHART_HEIGHT = PANEL_ORDER.length * PANEL_H + (PANEL_ORDER.length - 1) * PANEL_GAP + PAD_B;
const panelTop = (i: number) => i * (PANEL_H + PANEL_GAP);

// Matches plot_pipeline_compare's own row map exactly (simulator/metrics/
// plots/pipeline.py: `_Y = {"dispatch": 0, "compute": 1, "gather": 0}`) —
// dispatch and gather are both communication, so they share the "Comm"
// row; compute gets its own row. Two rows, not three, so the figure reads
// exactly like the real one.
const PHASE_ROW: Record<PhaseType, 0 | 1> = { dispatch: 0, compute: 1, gather: 0 };
const GANTT_HEIGHT = 62;
const GANTT_ROW_H = 20;
const GANTT_ROW_Y = [8, 34];
const GANTT_ROW_LABELS = ["Comm", "Compute"];

export default function NetworkPanel({
  data,
  onInteract,
}: {
  data: Record<string, NetworkData>;
  onInteract?: () => void;
}) {
  const modes = useMemo(() => Object.keys(data), [data]);
  const [mode, setMode] = useState(modes[0] ?? "naive");
  const [hoverIdx, setHoverIdx] = useState<number | null>(null);

  const d = data[mode];

  // Shared x-domain across every mode's own e2e time, so switching modes
  // shows real relative speed instead of each Gantt auto-scaling to fill
  // the same width regardless of how long that mode actually took.
  const sharedMaxUs = useMemo(() => Math.max(...modes.map((m) => data[m].e2e_us)), [data, modes]);

  const plotW = WIDTH - PAD_L - PAD_R;

  // Independent y-scale per link type — each panel auto-scales to its own
  // series + bandwidth cap, so a link type's own dynamic range stays
  // readable regardless of how much bigger another link type's peak is.
  const panelMaxY: Record<LinkType, number> = useMemo(() => {
    const out = {} as Record<LinkType, number>;
    for (const t of PANEL_ORDER) {
      out[t] = Math.max(...d.throughput_gbps[t], d.link_caps_gbps[t]) * 1.1;
    }
    return out;
  }, [d]);

  const yAtIn = (panelIdx: number, v: number, t: LinkType) =>
    panelTop(panelIdx) + PANEL_H - (v / panelMaxY[t]) * PANEL_H;
  const xAtUs = (us: number) => PAD_L + (us / sharedMaxUs) * plotW;
  // Bin i of this mode's own n_bins-wide series maps to real time
  // (i/(n_bins-1))*sim_end_us, then through the SAME shared time scale the
  // Gantt uses — so the throughput chart and the phase Gantt end at the
  // same x position for a given mode, and a faster mode visibly stops
  // short of the right edge instead of stretching to fill it.
  const xAt = (i: number) => xAtUs((i / (d.n_bins - 1)) * d.sim_end_us);

  const hoverUs = hoverIdx !== null ? (hoverIdx / (d.n_bins - 1)) * d.sim_end_us : null;
  const activePhases = useMemo(() => {
    if (hoverUs === null) return [];
    return (Object.keys(PHASE_ROW) as PhaseType[]).filter((p) => {
      const span = d.canon[p];
      return span && hoverUs >= span[0] && hoverUs <= span[1];
    });
  }, [hoverUs, d.canon]);

  const linePath = (panelIdx: number, t: LinkType) =>
    d.throughput_gbps[t]
      .map((v, i) => `${i === 0 ? "M" : "L"} ${xAt(i).toFixed(1)} ${yAtIn(panelIdx, v, t).toFixed(1)}`)
      .join(" ");

  const handleMove = (e: React.MouseEvent<SVGRectElement>) => {
    // currentTarget is the hover-capture <rect>, which spans exactly the
    // plot area (x=PAD_L, width=plotW) — its own bounding box already maps
    // 1:1 to [0, n_bins-1], no need to re-derive via the full-SVG WIDTH.
    const rect = e.currentTarget.getBoundingClientRect();
    const frac = (e.clientX - rect.left) / rect.width;
    const idx = Math.round(frac * (d.n_bins - 1));
    setHoverIdx(Math.max(0, Math.min(d.n_bins - 1, idx)));
  };

  const naiveE2e = data.naive?.e2e_us;
  const speedup = mode !== "naive" && naiveE2e ? naiveE2e / d.e2e_us : null;

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex rounded-full bg-stone-100 p-0.5 text-xs">
          {modes.map((m) => (
            <button
              key={m}
              onClick={() => {
                setMode(m);
                onInteract?.();
              }}
              className={`px-2.5 py-1 rounded-full transition-colors ${
                mode === m ? "bg-stone-900 text-white" : "text-stone-600 hover:text-stone-900"
              }`}
            >
              {MODE_LABELS[m] ?? m}
            </button>
          ))}
        </div>
        {speedup && (
          <div className="text-xs text-green-700">{speedup.toFixed(2)}&times; vs naive</div>
        )}
      </div>

      <div className="text-xs text-stone-500">
        EP={d.ep} &middot; {d.gpus_per_cluster} GPUs/rack &middot; SEQ_LEN={d.seq_len.toLocaleString()}
      </div>

      {/* Dispatch/Compute/Gather pipeline — same phase decomposition and row
          layout as the real plot_pipeline_compare() Gantt (pipeline.py):
          dispatch + gather share the "Comm" row, compute gets its own row,
          so overlap between communication and compute reads directly off
          the figure (BSP: no overlap: Comm ends before Compute starts, before
          Gather starts. Pipelined modes: real overlap). */}
      <svg
        viewBox={`0 0 ${WIDTH} ${GANTT_HEIGHT}`}
        className="w-full h-auto rounded-md border border-stone-200 bg-white"
      >
        {GANTT_ROW_LABELS.map((label, row) => (
          <g key={label}>
            <text x={PAD_L - 6} y={GANTT_ROW_Y[row] + GANTT_ROW_H / 2 + 3} textAnchor="end" fontSize={8} fill="#78716c" fontWeight={600}>
              {label}
            </text>
            <line
              x1={PAD_L}
              x2={WIDTH - PAD_R}
              y1={GANTT_ROW_Y[row] + GANTT_ROW_H / 2}
              y2={GANTT_ROW_Y[row] + GANTT_ROW_H / 2}
              stroke="#f5f5f4"
              strokeWidth={1}
            />
          </g>
        ))}
        {(Object.keys(PHASE_ROW) as PhaseType[]).map((p) => {
          const span = d.canon[p];
          if (!span) return null;
          const row = PHASE_ROW[p];
          const x0 = xAtUs(span[0]);
          const x1 = xAtUs(span[1]);
          const w = Math.max(1.5, x1 - x0);
          const durUs = span[1] - span[0];
          return (
            <g key={p}>
              <rect
                x={x0}
                y={GANTT_ROW_Y[row]}
                width={w}
                height={GANTT_ROW_H}
                rx={3}
                fill={PHASE_COLORS[p]}
                opacity={0.9}
                stroke="white"
                strokeWidth={0.75}
              />
              {w > 40 && (
                <text
                  x={x0 + w / 2}
                  y={GANTT_ROW_Y[row] + GANTT_ROW_H / 2 + 3}
                  textAnchor="middle"
                  fontSize={7.5}
                  fill="white"
                  fontWeight={700}
                >
                  {PHASE_LABELS[p]} &middot; {durUs.toFixed(0)}&micro;s
                </text>
              )}
            </g>
          );
        })}
        {hoverUs !== null && (
          <line
            x1={xAtUs(hoverUs)}
            x2={xAtUs(hoverUs)}
            y1={0}
            y2={GANTT_HEIGHT}
            stroke="#78716c"
            strokeWidth={1}
            strokeDasharray="2 2"
          />
        )}
      </svg>

      <svg viewBox={`0 0 ${WIDTH} ${CHART_HEIGHT}`} className="w-full h-auto rounded-md border border-stone-200 bg-white">
        {PANEL_ORDER.map((t, i) => {
          const top = panelTop(i);
          const cap = d.link_caps_gbps[t];
          const max = panelMaxY[t];
          return (
            <g key={t}>
              {/* panel label + own scale */}
              <text x={PAD_L - 6} y={top + 9} textAnchor="end" fontSize={7.5} fill="#78716c" fontWeight={600}>
                {LINK_SHORT[t]}
              </text>
              <text x={PAD_L - 6} y={top + PANEL_H - 2} textAnchor="end" fontSize={7} fill="#a8a29e">
                0
              </text>
              <text x={PAD_L - 6} y={top + 20} textAnchor="end" fontSize={7} fill="#a8a29e">
                {Math.round(max)}
              </text>
              <line x1={PAD_L} x2={WIDTH - PAD_R} y1={top + PANEL_H} y2={top + PANEL_H} stroke="#e7e5e4" strokeWidth={1} />
              {/* bandwidth cap reference line */}
              {cap <= max && (
                <line
                  x1={PAD_L}
                  x2={WIDTH - PAD_R}
                  y1={yAtIn(i, cap, t)}
                  y2={yAtIn(i, cap, t)}
                  stroke={LINK_COLORS[t]}
                  strokeWidth={1}
                  strokeDasharray="3 3"
                  opacity={0.4}
                />
              )}
              <path d={linePath(i, t)} fill="none" stroke={LINK_COLORS[t]} strokeWidth={1.5} />
            </g>
          );
        })}

        {/* hover crosshair spans all three panels */}
        {hoverIdx !== null && (
          <line
            x1={xAt(hoverIdx)}
            x2={xAt(hoverIdx)}
            y1={0}
            y2={CHART_HEIGHT - PAD_B}
            stroke="#78716c"
            strokeWidth={1}
            strokeDasharray="2 2"
          />
        )}

        {/* x axis labels — right edge is the shared axis max (slowest
            mode's e2e time), not this mode's own sim_end, since the axis
            domain is now fixed across modes (see xAt/xAtUs above). */}
        <text x={PAD_L} y={CHART_HEIGHT - 6} fontSize={8} fill="#78716c">
          0
        </text>
        <text x={WIDTH - PAD_R} y={CHART_HEIGHT - 6} fontSize={8} fill="#78716c" textAnchor="end">
          {Math.round(sharedMaxUs).toLocaleString()} &micro;s
        </text>
        {/* marks where this mode's own network activity actually ends,
            when it finishes before the slowest mode on the shared axis */}
        {d.sim_end_us < sharedMaxUs * 0.995 && (
          <line
            x1={xAtUs(d.sim_end_us)}
            x2={xAtUs(d.sim_end_us)}
            y1={0}
            y2={CHART_HEIGHT - PAD_B}
            stroke="#a8a29e"
            strokeWidth={1}
            strokeDasharray="1 2"
          />
        )}

        {/* hover capture */}
        <rect
          x={PAD_L}
          y={0}
          width={plotW}
          height={CHART_HEIGHT - PAD_B}
          fill="transparent"
          onMouseMove={handleMove}
          onMouseLeave={() => setHoverIdx(null)}
        />
      </svg>

      {hoverIdx !== null && (
        <div className="flex items-center gap-2.5 text-xs rounded-md border border-stone-200 bg-stone-50 px-3 py-2 overflow-x-auto whitespace-nowrap">
          <span className="text-stone-500 shrink-0">
            t={((hoverIdx / (d.n_bins - 1)) * d.sim_end_us).toFixed(0)}&micro;s
          </span>
          {PANEL_ORDER.map((t) => (
            <span key={t} className="flex items-center gap-1 shrink-0">
              <span className="inline-block w-1.5 h-1.5 rounded-full" style={{ backgroundColor: LINK_COLORS[t] }} />
              {LINK_SHORT[t]} {d.throughput_gbps[t][hoverIdx].toFixed(0)}
            </span>
          ))}
          <span className="text-stone-400 shrink-0">GB/s</span>
          {activePhases.length > 0 && (
            <span className="shrink-0">
              {activePhases.map((p, i) => (
                <span key={p} style={{ color: PHASE_COLORS[p] }} className="font-medium">
                  {i > 0 && <span className="text-stone-400">+</span>}
                  {PHASE_LABELS[p]}
                </span>
              ))}
            </span>
          )}
        </div>
      )}

      <div className="grid grid-cols-3 gap-2 text-xs">
        {PANEL_ORDER.map((t) => (
          <div key={t} className="p-2.5 rounded-md bg-white border border-stone-200">
            <div className="flex items-center gap-1.5 text-stone-500 mb-1">
              <span className="inline-block w-2 h-2 rounded-full" style={{ backgroundColor: LINK_COLORS[t] }} />
              {LINK_LABELS[t]}
            </div>
            <div className="text-base font-light">{d.total_gb[t].toFixed(1)} GB</div>
            <div className="text-[10px] text-stone-400">cap {d.link_caps_gbps[t].toFixed(0)} GB/s</div>
          </div>
        ))}
      </div>
    </div>
  );
}
