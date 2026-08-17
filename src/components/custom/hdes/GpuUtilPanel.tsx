import { useLayoutEffect, useMemo, useRef, useState } from "react";
import type { GpuUtilData } from "@/data/hdes";
import { MODE_LABELS, utilizationColor } from "./colors";

const WIDTH = 640;
const PAD_L = 52;
const PAD_R = 12;
const PAD_B = 20;
const ROW_H = 13;

export default function GpuUtilPanel({
  data,
  onInteract,
}: {
  data: Record<string, GpuUtilData>;
  onInteract?: () => void;
}) {
  const modes = useMemo(() => Object.keys(data), [data]);
  const [mode, setMode] = useState(modes[0] ?? "naive");
  const [hover, setHover] = useState<{ row: number; col: number } | null>(null);

  const d = data[mode];
  const plotW = WIDTH - PAD_L - PAD_R;
  const chartH = d.gpu_ids.length * ROW_H;

  // Fixed time axis shared across every implementation (the slowest mode's
  // own end time), so switching modes shows the real speedup directly — a
  // faster implementation's heatmap visibly stops short of the right edge
  // instead of every mode stretching to fill the same width regardless of
  // how long it actually took.
  const sharedMaxUs = useMemo(() => Math.max(...modes.map((m) => data[m].sim_end_us)), [data, modes]);
  const xAtUs = (us: number) => PAD_L + (us / sharedMaxUs) * plotW;
  const cellW = (d.sim_end_us / sharedMaxUs) * (plotW / d.n_bins);

  const shortId = (id: string) => id.replace("rack", "r").replace("-gpu", "/g");

  // The utilization grid used to be one <rect> per cell (~gpu_ids.length x
  // n_bins, ~960 nodes for a full-scale run) each with its own onMouseEnter/
  // onMouseLeave closures — mounting that whole tree on every tab switch to
  // GPU was measured (via CPU-throttled profiling) to block the main thread
  // for 400-500ms, by far the worst offender on the page. A canvas draws
  // the same cells for a fraction of the cost and needs only one pair of
  // pointer handlers total instead of one pair per cell. It sits in a
  // <foreignObject> so it inherits the surrounding SVG's own viewBox
  // scaling exactly like the <rect> grid did — flat-colored cells don't
  // need per-device-pixel sharpness, so no separate DPR handling here
  // (contrast BitTrail.tsx, which draws text and does need it).
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useLayoutEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    canvas.width = plotW;
    canvas.height = chartH;
    ctx.clearRect(0, 0, plotW, chartH);
    d.utilization.forEach((row, ri) => {
      row.forEach((v, ci) => {
        const x = xAtUs((ci / d.n_bins) * d.sim_end_us) - PAD_L;
        ctx.fillStyle = utilizationColor(v);
        ctx.fillRect(x, ri * ROW_H, cellW + 0.5, ROW_H);
      });
    });
    if (hover) {
      const x = xAtUs((hover.col / d.n_bins) * d.sim_end_us) - PAD_L;
      ctx.strokeStyle = "#1c1917";
      ctx.lineWidth = 1;
      ctx.strokeRect(x + 0.5, hover.row * ROW_H + 0.5, cellW - 0.5, ROW_H - 1);
    }
  }, [d, cellW, chartH, plotW, hover]);

  const handleCanvasMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const scaleX = plotW / rect.width;
    const scaleY = chartH / rect.height;
    const x = (e.clientX - rect.left) * scaleX;
    const y = (e.clientY - rect.top) * scaleY;
    const row = Math.min(d.gpu_ids.length - 1, Math.max(0, Math.floor(y / ROW_H)));
    const usAtX = (x / plotW) * sharedMaxUs; // inverse of xAtUs, in canvas-local (PAD_L-relative) coords
    const frac = usAtX / d.sim_end_us;
    const col = Math.min(d.n_bins - 1, Math.max(0, Math.round(frac * d.n_bins)));
    if (frac < 0 || frac > 1.02) {
      setHover((h) => (h ? null : h));
      return;
    }
    setHover((h) => (h?.row === row && h?.col === col ? h : { row, col }));
  };

  return (
    <div className="space-y-3">
      <div className="flex rounded-full bg-stone-100 p-0.5 text-xs w-fit">
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

      <svg
        viewBox={`0 0 ${WIDTH} ${chartH + PAD_B}`}
        className="w-full h-auto rounded-md border border-stone-200 bg-surface"
      >
        {d.gpu_ids.map((gid, row) => (
          <text
            key={gid}
            x={PAD_L - 6}
            y={row * ROW_H + ROW_H / 2 + 3}
            textAnchor="end"
            fontSize={7}
            fill="#78716c"
          >
            {shortId(gid)}
          </text>
        ))}

        <foreignObject x={PAD_L} y={0} width={plotW} height={chartH}>
          <canvas
            ref={canvasRef}
            style={{ width: "100%", height: "100%", cursor: "pointer", display: "block" }}
            onMouseMove={handleCanvasMove}
            onMouseLeave={() => setHover(null)}
          />
        </foreignObject>

        {/* marks where this mode's own run actually ends, when it finishes
            before the slowest mode on the shared axis */}
        {d.sim_end_us < sharedMaxUs * 0.995 && (
          <line
            x1={xAtUs(d.sim_end_us)}
            x2={xAtUs(d.sim_end_us)}
            y1={0}
            y2={chartH}
            stroke="#a8a29e"
            strokeWidth={1}
            strokeDasharray="1 2"
          />
        )}

        <text x={PAD_L} y={chartH + 14} fontSize={8} fill="#78716c">
          0
        </text>
        <text x={WIDTH - PAD_R} y={chartH + 14} fontSize={8} fill="#78716c" textAnchor="end">
          {Math.round(sharedMaxUs).toLocaleString()} &micro;s
        </text>
      </svg>

      <div className="flex items-center justify-between text-xs">
        <div className="flex items-center gap-1.5 text-stone-500">
          <span>SM utilization</span>
          <span className="flex items-center gap-0.5">
            {[0, 0.25, 0.5, 0.75, 1].map((f) => (
              <span
                key={f}
                className="inline-block w-3.5 h-2.5 rounded-[1px]"
                style={{ backgroundColor: utilizationColor(f) }}
              />
            ))}
          </span>
          <span>0% &rarr; 100%</span>
        </div>
        <div className="text-stone-600">
          {hover ? (
            <>
              {shortId(d.gpu_ids[hover.row])} &middot; t=
              {((hover.col / (d.n_bins - 1)) * d.sim_end_us).toFixed(0)}&micro;s &middot;{" "}
              {(d.utilization[hover.row][hover.col] * 100).toFixed(0)}%
            </>
          ) : (
            <span className="text-stone-400">Hover the heatmap to inspect a cell</span>
          )}
        </div>
      </div>
    </div>
  );
}
