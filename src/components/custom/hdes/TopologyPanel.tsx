import { useMemo, useState } from "react";
import type { TopologyData } from "@/data/hdes";
import { LINK_COLORS, LINK_LABELS, NODE_LABELS, type LinkType } from "./colors";

const WIDTH = 640;
const HEIGHT = 400;
const MARGIN_X = 36;

const OVAL_CENTER_Y = 108;
const OVAL_RY = 84;

type Pos = { x: number; y: number };

function layout(data: TopologyData): { pos: Record<string, Pos>; ovals: { cx: number; rx: number; label: string }[] } {
  const pos: Record<string, Pos> = {};
  const ovals: { cx: number; rx: number; label: string }[] = [];

  const rackIds = new Set<number>();
  const spineIds: string[] = [];
  for (const n of data.nodes) {
    const rackMatch = n.id.match(/^rack(\d+)-/);
    if (rackMatch) rackIds.add(Number(rackMatch[1]));
    else if (n.id.startsWith("spine-")) spineIds.push(n.id);
  }
  const racks = Array.from(rackIds).sort((a, b) => a - b);
  const rackWidth = (WIDTH - 2 * MARGIN_X) / Math.max(1, racks.length);

  const row = (ids: string[], centerX: number, y: number, spread: number) => {
    const n = ids.length;
    if (n === 0) return;
    const step = n > 1 ? spread / (n - 1) : 0;
    const start = centerX - spread / 2;
    ids.forEach((id, i) => {
      pos[id] = { x: n > 1 ? start + step * i : centerX, y };
    });
  };

  racks.forEach((r, i) => {
    const centerX = MARGIN_X + rackWidth * (i + 0.5);
    const byType = (t: string) =>
      data.nodes
        .filter((n) => n.id.startsWith(`rack${r}-`) && n.type === t)
        .map((n) => n.id)
        .sort();

    const gpus = byType("gpu");
    const nvswitch = byType("nvswitch");
    const pcieSwitches = byType("pcie_switch");
    const nics = [...byType("nic"), ...byType("fpga")];
    const rackSwitch = byType("rack_switch");

    // GPUs ring the NVSwitch hub inside a "cluster" oval, mirroring the
    // real matplotlib topology figures (output/important/TOPOLOGY/*.png) —
    // a rack's GPUs sit around its shared NVSwitch, not stacked in a row.
    const ovalRx = Math.min(rackWidth / 2 - 14, 118);
    const gpuRx = ovalRx - 20;
    const gpuRy = OVAL_RY - 20;
    const n = gpus.length;
    gpus.forEach((id, gi) => {
      const angle = -Math.PI / 2 + (gi / Math.max(1, n)) * 2 * Math.PI;
      pos[id] = {
        x: centerX + gpuRx * Math.cos(angle),
        y: OVAL_CENTER_Y + gpuRy * Math.sin(angle),
      };
    });
    row(nvswitch, centerX, OVAL_CENTER_Y, 0);
    ovals.push({ cx: centerX, rx: ovalRx, label: `rack ${r}` });

    const belowSpread = Math.min(rackWidth - 30, 30 * Math.max(pcieSwitches.length, nics.length, 1));
    row(pcieSwitches, centerX, OVAL_CENTER_Y + OVAL_RY + 34, belowSpread * 0.7);
    row(nics, centerX, OVAL_CENTER_Y + OVAL_RY + 84, belowSpread);
    row(rackSwitch, centerX, OVAL_CENTER_Y + OVAL_RY + 130, 0);
  });

  row(spineIds, WIDTH / 2, HEIGHT - 18, Math.min(WIDTH - 2 * MARGIN_X, 70 * (spineIds.length - 1)));

  return { pos, ovals };
}

const NODE_STYLE: Record<string, { r: number; fill: string; stroke: string }> = {
  gpu: { r: 7, fill: "#fff", stroke: "#78716c" },
  nic: { r: 5, fill: "#fff", stroke: "#a8a29e" },
  fpga: { r: 5, fill: "#fff", stroke: "#a8a29e" },
  pcie_switch: { r: 7, fill: "#78716c", stroke: "#57534e" },
  // NVSwitch renders as a box (see render loop) in a pastel green — same
  // hue family as the NVLink line color so the hub still reads as "the
  // NVLink switch," without being the same saturated line color itself.
  nvswitch: { r: 15, fill: "#bce7a5", stroke: "#7fae63" },
  rack_switch: { r: 8, fill: "#44403c", stroke: "#292524" },
  spine_switch: { r: 10, fill: "#1c1917", stroke: "#1c1917" },
};

export default function TopologyPanel({
  data,
  onInteract,
}: {
  data: TopologyData;
  onInteract?: () => void;
}) {
  const { pos: positions, ovals } = useMemo(() => layout(data), [data]);
  const [hovered, setHovered] = useState<string | null>(null);
  const [hiddenTypes, setHiddenTypes] = useState<Set<LinkType>>(new Set());

  const connected = useMemo(() => {
    if (!hovered) return null;
    const s = new Set<string>();
    for (const l of data.links) {
      if (l.src === hovered || l.dst === hovered) {
        s.add(`${l.src}|${l.dst}`);
      }
    }
    return s;
  }, [hovered, data.links]);

  const toggleType = (t: LinkType) => {
    setHiddenTypes((prev) => {
      const next = new Set(prev);
      if (next.has(t)) next.delete(t);
      else next.add(t);
      return next;
    });
  };

  // Real leaf-switch oversubscription ratio (downlinks-to-GPUs : uplinks-to-spine)
  // for this CLOS fabric — derived from the actual generated topology, not a
  // label (mirrors SystemConfig.IB_BLOCKING_FACTOR's own "2.0 = 2:1 blocking"
  // convention in hw/network/topology.py).
  const blockingRatio = useMemo(() => {
    const numSpines = data.nodes.filter((n) => n.type === "spine_switch").length;
    if (!numSpines) return null;
    const ratio = data.gpus_per_rack / numSpines;
    return Number.isInteger(ratio) ? `${ratio}:1` : `${ratio.toFixed(1)}:1`;
  }, [data]);

  return (
    <div className="space-y-3">
      <div className="text-xs text-stone-500">
        {data.world_size} GPUs &middot; {data.num_racks} racks &times; {data.gpus_per_rack}/rack &middot; {data.inter_rack}
        {blockingRatio && ` ${blockingRatio}`}
      </div>

      <svg
        viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
        className="w-full h-auto rounded-md border border-stone-200 bg-surface"
      >
        <g>
          {ovals.map((o) => (
            <g key={o.label}>
              <ellipse
                cx={o.cx}
                cy={OVAL_CENTER_Y}
                rx={o.rx}
                ry={OVAL_RY}
                fill="#f7f3ec"
                stroke="#e7e0d3"
                strokeWidth={1}
              />
              <text x={o.cx - o.rx + 6} y={OVAL_CENTER_Y - OVAL_RY + 14} fontSize={8} fill="#a8a29e">
                {o.label}
              </text>
            </g>
          ))}
        </g>
        <g>
          {data.links.map((l) => {
            const a = positions[l.src];
            const b = positions[l.dst];
            if (!a || !b) return null;
            const key = `${l.src}|${l.dst}`;
            const isHiddenType = hiddenTypes.has(l.type);
            const isDimmedByHover = connected ? !connected.has(key) : false;
            const opacity = isHiddenType ? 0.04 : isDimmedByHover ? 0.1 : l.type === "nv" ? 0.7 : 0.85;
            return (
              <line
                key={key}
                x1={a.x}
                y1={a.y}
                x2={b.x}
                y2={b.y}
                stroke={LINK_COLORS[l.type]}
                strokeWidth={l.type === "nv" ? 1 : l.type === "pcie" ? 0.9 : 1.3}
                opacity={opacity}
              />
            );
          })}
        </g>
        <g>
          {data.nodes.map((n) => {
            const p = positions[n.id];
            if (!p) return null;
            const style = NODE_STYLE[n.type] ?? NODE_STYLE.gpu;
            const isHovered = hovered === n.id;
            const size = (isHovered ? style.r + 2 : style.r) * 1.7;
            const commonProps = {
              fill: style.fill,
              stroke: style.stroke,
              strokeWidth: isHovered ? 2 : 1,
              onMouseEnter: () => setHovered(n.id),
              onMouseLeave: () => setHovered((h: string | null) => (h === n.id ? null : h)),
              className: "cursor-pointer transition-[r]",
            };
            if (n.type === "nvswitch") {
              return (
                <rect
                  key={n.id}
                  {...commonProps}
                  x={p.x - size / 2}
                  y={p.y - size / 2}
                  width={size}
                  height={size}
                  rx={2.5}
                >
                  <title>
                    {n.id} &mdash; {NODE_LABELS[n.type] ?? n.type}
                  </title>
                </rect>
              );
            }
            if (n.type === "nic" || n.type === "fpga") {
              // Diamond, distinct from a GPU's circle — same exit-gate role
              // (NIC/FPGA), same visual family, but never confusable with a GPU.
              const s = isHovered ? style.r + 2 : style.r;
              const points = [
                `${p.x},${p.y - s}`,
                `${p.x + s},${p.y}`,
                `${p.x},${p.y + s}`,
                `${p.x - s},${p.y}`,
              ].join(" ");
              return (
                <polygon key={n.id} {...commonProps} points={points}>
                  <title>
                    {n.id} &mdash; {NODE_LABELS[n.type] ?? n.type}
                  </title>
                </polygon>
              );
            }
            return (
              <circle
                key={n.id}
                {...commonProps}
                cx={p.x}
                cy={p.y}
                r={isHovered ? style.r + 2 : style.r}
              >
                <title>
                  {n.id} &mdash; {NODE_LABELS[n.type] ?? n.type}
                </title>
              </circle>
            );
          })}
        </g>
      </svg>

      <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs">
        {(Object.keys(LINK_COLORS) as LinkType[]).map((t) => (
          <button
            key={t}
            onClick={() => {
              toggleType(t);
              onInteract?.();
            }}
            className={`flex items-center gap-1.5 ${hiddenTypes.has(t) ? "opacity-40" : ""}`}
          >
            <span
              className="inline-block w-3.5 h-0.5 rounded-full"
              style={{ backgroundColor: LINK_COLORS[t] }}
            />
            <span className="text-stone-600">{LINK_LABELS[t]}</span>
          </button>
        ))}
        <span className="ml-auto flex items-center gap-1.5 text-stone-600">
          <span className="inline-block w-2.5 h-2.5 rounded-sm" style={{ backgroundColor: "#bce7a5" }} />
          NVSwitch &middot;
          <span className="inline-block w-2.5 h-2.5 rounded-full bg-stone-900" />
          switch/hub &middot;
          <span className="inline-block w-2.5 h-2.5 rounded-full border border-stone-400 bg-white" />
          GPU &middot;
          <span className="inline-block w-2.5 h-2.5 border border-stone-400 bg-white rotate-45" />
          NIC/FPGA
        </span>
      </div>
    </div>
  );
}
