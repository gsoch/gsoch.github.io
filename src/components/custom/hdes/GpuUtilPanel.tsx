import { useMemo, useState } from "react";
import type { GpuUtilData } from "@/data/hdes";
import { MODE_LABELS, utilizationColor } from "./colors";

const WIDTH = 640;
const PAD_L = 52;
const PAD_R = 12;
const PAD_B = 20;
const ROW_H = 13;

export default function GpuUtilPanel({ data }: { data: Record<string, GpuUtilData> }) {
  const modes = useMemo(() => Object.keys(data), [data]);
  const [mode, setMode] = useState(modes[0] ?? "naive");
  const [hover, setHover] = useState<{ row: number; col: number } | null>(null);

  const d = data[mode];
  const plotW = WIDTH - PAD_L - PAD_R;
  const cellW = plotW / d.n_bins;
  const chartH = d.gpu_ids.length * ROW_H;

  const shortId = (id: string) => id.replace("rack", "r").replace("-gpu", "/g");

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex rounded-full bg-stone-100 p-0.5 text-xs">
          {modes.map((m) => (
            <button
              key={m}
              onClick={() => setMode(m)}
              className={`px-2.5 py-1 rounded-full transition-colors ${
                mode === m ? "bg-stone-900 text-white" : "text-stone-600 hover:text-stone-900"
              }`}
            >
              {MODE_LABELS[m] ?? m}
            </button>
          ))}
        </div>
        <div className="text-xs text-stone-500">
          avg {(d.avg_utilization * 100).toFixed(0)}% &middot; peak {d.peak_gpu ? shortId(d.peak_gpu) : "—"}
        </div>
      </div>

      <svg
        viewBox={`0 0 ${WIDTH} ${chartH + PAD_B}`}
        className="w-full h-auto rounded-md border border-stone-200 bg-white"
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

        {d.utilization.map((row, ri) =>
          row.map((v, ci) => (
            <rect
              key={`${ri}-${ci}`}
              x={PAD_L + ci * cellW}
              y={ri * ROW_H}
              width={cellW + 0.5}
              height={ROW_H}
              fill={utilizationColor(v)}
              stroke={hover?.row === ri && hover?.col === ci ? "#1c1917" : "none"}
              strokeWidth={hover?.row === ri && hover?.col === ci ? 1 : 0}
              onMouseEnter={() => setHover({ row: ri, col: ci })}
              onMouseLeave={() => setHover((h) => (h?.row === ri && h?.col === ci ? null : h))}
              className="cursor-pointer"
            />
          )),
        )}

        <text x={PAD_L} y={chartH + 14} fontSize={8} fill="#78716c">
          0
        </text>
        <text x={WIDTH - PAD_R} y={chartH + 14} fontSize={8} fill="#78716c" textAnchor="end">
          {d.sim_end_us.toLocaleString()} &micro;s
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
        {hover && (
          <div className="text-stone-600">
            {shortId(d.gpu_ids[hover.row])} &middot; t=
            {((hover.col / (d.n_bins - 1)) * d.sim_end_us).toFixed(0)}&micro;s &middot;{" "}
            {(d.utilization[hover.row][hover.col] * 100).toFixed(0)}%
          </div>
        )}
      </div>
    </div>
  );
}
