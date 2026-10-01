import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
} from "react";

// Animated 16-GPU CLOS cluster. Each implementation replays a normalized
// traffic trace (inter-node ETH, PCIe/compute, NVLink) captured from a real
// run: the topology lights up in proportion to the curve at the current
// moment, so spikes appear as saturated bursts.

const IDLE = "#d6d3d1";
// Every implementation gets the same slot, and the playhead moves at the same
// µs-per-second in all of them, so faster runs reach their end sooner and the
// playhead stops there until the slot is over.
const PLAY_MS = 8000;
const HOLD_MS = 2000; // pause after a run completes, before the next implementation starts
const SLOT_MS = PLAY_MS + HOLD_MS;
const FRAME_MS = 80;

type Pts = [number, number][];

// Piecewise-linear sample of a curve at t in [0,1].
const sample = (pts: Pts, t: number) => {
  for (let i = 1; i < pts.length; i++) {
    if (t <= pts[i][0]) {
      const [x0, y0] = pts[i - 1];
      const [x1, y1] = pts[i];
      return y0 + ((y1 - y0) * (t - x0)) / (x1 - x0 || 1);
    }
  }
  return pts[pts.length - 1][1];
};

// Small deterministic jitter so the jagged traces look jagged.
const jag = (t: number, amt: number) =>
  1 + amt * (Math.sin(t * 210) * 0.6 + Math.sin(t * 337 + 1.3) * 0.4);

// Real simulated run of Implementation 3 (16 GPUs, 635 experts): aggregate
// injection throughput in GB/s over simulated time in µs, read off the plots.
const RUN_US = 8700;
const norm = (raw: Pts, xmax: number, ymax: number): Pts =>
  raw.map(([x, y]) => [x / xmax, y / ymax]);
const REAL_NV: Pts = [
  [0, 2500],
  [100, 2722],
  [250, 2650],
  [400, 1900],
  [550, 1100],
  [650, 770],
  [700, 620],
  [800, 800],
  [900, 1050],
  [1000, 820],
  [1100, 800],
  [1200, 540],
  [1300, 570],
  [1450, 400],
  [1550, 290],
  [1650, 300],
  [1750, 370],
  [1850, 360],
  [2000, 310],
  [2100, 300],
  [2200, 500],
  [2350, 540],
  [2450, 600],
  [2550, 920],
  [2650, 830],
  [2750, 1400],
  [2850, 2050],
  [2950, 2300],
  [3050, 2050],
  [3150, 1900],
  [3250, 980],
  [3350, 950],
  [3450, 850],
  [3550, 810],
  [3650, 640],
  [3750, 470],
  [3850, 760],
  [3950, 880],
  [4050, 210],
  [4150, 880],
  [4250, 830],
  [4350, 1240],
  [4450, 1050],
  [4550, 1550],
  [4650, 1050],
  [4800, 700],
  [4900, 100],
  [5000, 40],
  [5100, 130],
  [5200, 40],
  [5300, 290],
  [5400, 80],
  [5500, 100],
  [5600, 180],
  [5700, 50],
  [5900, 160],
  [6050, 380],
  [6150, 120],
  [6250, 130],
  [6350, 450],
  [6500, 450],
  [6600, 200],
  [6700, 190],
  [7000, 0],
  [RUN_US, 0],
];
const REAL_ETH: Pts = [
  [0, 0],
  [850, 0],
  [900, 180],
  [1000, 760],
  [1200, 820],
  [1400, 905],
  [1550, 870],
  [1650, 930],
  [1800, 440],
  [1900, 385],
  [2000, 515],
  [2100, 455],
  [2200, 320],
  [2300, 310],
  [2400, 200],
  [2500, 145],
  [2600, 205],
  [2700, 400],
  [2800, 330],
  [2900, 310],
  [3000, 240],
  [3100, 280],
  [3200, 220],
  [3300, 180],
  [3500, 150],
  [3700, 215],
  [3900, 85],
  [4100, 30],
  [4200, 105],
  [4300, 150],
  [4400, 135],
  [4500, 115],
  [4600, 215],
  [4700, 150],
  [4800, 210],
  [4900, 150],
  [5000, 160],
  [5100, 130],
  [5300, 215],
  [5400, 160],
  [5500, 150],
  [5700, 220],
  [5800, 150],
  [5900, 160],
  [6000, 205],
  [6200, 330],
  [6300, 380],
  [6500, 480],
  [6700, 575],
  [6900, 550],
  [7100, 520],
  [7300, 440],
  [7400, 500],
  [7600, 290],
  [7900, 170],
  [8100, 195],
  [8250, 150],
  [8500, 150],
  [RUN_US, 0],
];

// Real simulated run of Implementation 2 (same setup), read off the plots the same way.
const COMET_US = 14800;
const COMET_NV: Pts = [
  [0, 3400],
  [120, 1500],
  [300, 100],
  [500, 0],
  [3000, 0],
  [3100, 30],
  [3400, 40],
  [3500, 320],
  [3700, 260],
  [3800, 300],
  [3900, 2400],
  [4000, 1000],
  [4300, 0],
  [5100, 0],
  [5200, 100],
  [5500, 300],
  [5700, 420],
  [6000, 3671],
  [6100, 100],
  [6200, 0],
  [8000, 0],
  [8100, 20],
  [8200, 130],
  [8400, 170],
  [8600, 880],
  [8800, 400],
  [9000, 1200],
  [9150, 0],
  [COMET_US, 0],
];
const COMET_ETH: Pts = [
  [0, 560],
  [150, 545],
  [250, 490],
  [400, 560],
  [650, 560],
  [780, 478],
  [900, 558],
  [1050, 560],
  [1250, 478],
  [1400, 560],
  [1600, 560],
  [1700, 490],
  [1850, 545],
  [2000, 560],
  [2200, 500],
  [2400, 555],
  [2500, 545],
  [2650, 555],
  [2800, 500],
  [3000, 550],
  [3200, 555],
  [3400, 500],
  [3550, 560],
  [3700, 545],
  [3800, 478],
  [3950, 548],
  [4100, 555],
  [4250, 520],
  [4400, 555],
  [4600, 560],
  [4700, 450],
  [4800, 430],
  [4900, 70],
  [5000, 60],
  [5100, 15],
  [5300, 0],
  [5800, 30],
  [5900, 78],
  [6000, 40],
  [6200, 0],
  [8000, 0],
  [8300, 50],
  [8500, 130],
  [8700, 195],
  [8800, 325],
  [8900, 580],
  [9000, 740],
  [9100, 705],
  [9300, 695],
  [9400, 575],
  [9800, 100],
  [10000, 0],
  [10900, 0],
  [11000, 30],
  [11200, 200],
  [11300, 235],
  [11450, 450],
  [11550, 495],
  [11650, 700],
  [11750, 750],
  [12600, 750],
  [13000, 730],
  [13400, 700],
  [13450, 630],
  [13500, 700],
  [13700, 760],
  [13900, 700],
  [14000, 640],
  [14150, 620],
  [14400, 520],
  [14600, 300],
  [COMET_US, 40],
];

// Real simulated run of Implementation 1 (same setup).
const NAIVE_US = 24000;
const NAIVE_NV: Pts = [
  [0, 2800],
  [100, 2000],
  [250, 300],
  [600, 0],
  [17200, 0],
  [17500, 400],
  [17800, 2500],
  [17950, 3903],
  [18100, 3000],
  [18300, 500],
  [18500, 50],
  [18700, 0],
  [NAIVE_US, 0],
];
const NAIVE_ETH: Pts = [
  [0, 400],
  [120, 560],
  [300, 505],
  [500, 560],
  [750, 510],
  [1000, 560],
  [1200, 505],
  [1500, 555],
  [1800, 530],
  [2000, 550],
  [2200, 515],
  [2500, 555],
  [2800, 520],
  [3000, 560],
  [3200, 510],
  [3500, 555],
  [3700, 505],
  [3900, 560],
  [4100, 510],
  [4300, 555],
  [4500, 505],
  [4800, 550],
  [5000, 545],
  [5300, 470],
  [5500, 470],
  [5600, 40],
  [5800, 0],
  [17800, 0],
  [17900, 500],
  [18000, 540],
  [18300, 560],
  [18600, 510],
  [19000, 555],
  [19300, 505],
  [19600, 550],
  [20000, 560],
  [20200, 520],
  [20600, 560],
  [21000, 505],
  [21400, 555],
  [21700, 520],
  [22000, 560],
  [22300, 505],
  [22600, 555],
  [22900, 470],
  [23000, 555],
  [23300, 420],
  [23500, 30],
  [23800, 0],
  [NAIVE_US, 0],
];

// SM utilization of the naive run (of 132 SMs): idle until the first batches
// land at ~6,050 µs, then saturated with brief dips, ending near 17,800 µs.
const NAIVE_SM: Pts = [
  [0, 0],
  [6000, 0],
  [6050, 132],
  [9150, 132],
  [9190, 80],
  [9230, 132],
  [9640, 132],
  [9660, 80],
  [9700, 132],
  [10720, 132],
  [10750, 80],
  [10790, 132],
  [11915, 132],
  [11935, 80],
  [11975, 132],
  [13110, 132],
  [13130, 80],
  [13170, 132],
  [14250, 132],
  [14270, 80],
  [14310, 132],
  [15420, 132],
  [15440, 80],
  [15480, 132],
  [15660, 132],
  [15680, 80],
  [15720, 132],
  [16600, 132],
  [16650, 100],
  [16900, 132],
  [17750, 132],
  [17800, 0],
  [NAIVE_US, 0],
];

// SM utilization of the Implementation 2 run (of 110 SMs): saturated almost
// from the start to ~14,200 µs, with brief dips.
const COMET_SM: Pts = [
  [0, 0],
  [120, 0],
  [130, 110],
  [5400, 110],
  [5420, 80],
  [5580, 80],
  [5600, 110],
  [8060, 110],
  [8080, 80],
  [8160, 80],
  [8175, 110],
  [13650, 110],
  [13680, 90],
  [13900, 110],
  [14200, 110],
  [14210, 0],
  [COMET_US, 0],
];

// Implementation 3 compute: SM occupancy (of 110) is saturated from ~270 µs to
// ~4,880 µs, then tapers as GPUs finish their queues, ending near 8,400 µs.
const REAL_SM: Pts = [
  [0, 0],
  [130, 0],
  [150, 60],
  [270, 110],
  [4880, 110],
  [5000, 100],
  [5500, 95],
  [6000, 90],
  [6500, 85],
  [7000, 75],
  [7500, 60],
  [7900, 40],
  [8200, 20],
  [8400, 0],
  [RUN_US, 0],
];
// Implementation 3 accelerator: GPU-reported per-expert queue depth (peak ~215
// tokens/tiles, high watermark 64). Above the watermark the FPGA streams and
// reduces the SM compute queue, so this tracks how far the backlog sits above it.
const REAL_ACC: Pts = [
  [0, 0],
  [70, 0],
  [85, 0.24],
  [120, 0.45],
  [200, 0.5],
  [300, 0.7],
  [400, 0.65],
  [500, 0.72],
  [700, 0.6],
  [900, 0.58],
  [1100, 0.62],
  [1400, 0.85],
  [1500, 0.65],
  [1800, 0.9],
  [2000, 0.8],
  [2200, 0.62],
  [2600, 0.58],
  [3000, 0.58],
  [3150, 0.5],
  [3300, 0.45],
  [3600, 0.3],
  [3800, 0.2],
  [4200, 0.1],
  [4400, 0],
  [RUN_US, 0],
];

// eth/pcie/nv are the three recorded traces.
const PHASES = [
  {
    us: NAIVE_US,
    workload: "Implementation 1",
    fix: "NCCL all-to-all dispatch, expert GEMMs, then NCCL all-to-all combine. Each stage waits on a barrier, so nothing overlaps.",
    jitter: 0,
    pcPts: norm(NAIVE_SM, NAIVE_US, 132),
    eth: norm(NAIVE_ETH, NAIVE_US, 560),
    nv: norm(NAIVE_NV, NAIVE_US, 3903),
  },
  {
    us: COMET_US,
    workload: "Implementation 2",
    fix: "Wave-based dispatch and gather overlap communication with expert compute, hiding network latency behind the GEMMs.",
    jitter: 0,
    pcPts: norm(COMET_SM, COMET_US, 110),
    eth: norm(COMET_ETH, COMET_US, 752.7),
    nv: norm(COMET_NV, COMET_US, 3671),
  },
  {
    us: RUN_US,
    workload: "Implementation 3",
    fix: "In-network acceleration achieves ~3× by coordinating Ethernet and NVLink traffic while parallelizing GPU compute.",
    jitter: 0,
    eth: norm(REAL_ETH, RUN_US, 930),
    pcPts: norm(REAL_SM, RUN_US, 110),
    accPts: norm(REAL_ACC, RUN_US, 1),
    nv: norm(REAL_NV, RUN_US, 2722),
  },
];

type Phase = (typeof PHASES)[number] & { pcPts?: Pts; accPts?: Pts };

const ms = (us: number) => `${+(us / 1000).toFixed(1)} ms`;

const clamp = (v: number) => Math.max(0, Math.min(1, v));

// Intensity of each recorded trace at t in [0,1], 0..1.
const trace = (p: Phase, t: number) => ({
  eth: clamp(sample(p.eth, t) * jag(t, p.jitter)),
  nv: clamp(sample(p.nv, t)),
  acc: p.accPts ? clamp(sample(p.accPts, t) * jag(t * 3, 0.15)) : 0,
  // Compute: measured SM occupancy where we have it, else a stand-in that follows the Ethernet burst.
  pc: p.pcPts
    ? clamp(sample(p.pcPts, t))
    : clamp(
        sample(p.eth, Math.max(0, t - 0.01)) * jag(t + 0.3, p.jitter * 0.8),
      ),
});

const TRACE_US = PHASES[0].us; // baseline run length: the timeline axis is fixed to it
const PLOT_N = 160;
const MINI_H = 22;

const SCALE = 1; // fixed zoom: a wider card gives the diagram more room, not more height
const TOPO_H = 296;
const LABEL_EVERY = 6000; // µs between labelled ticks on the implementation timelines
const TOPO_FILL = 0.88; // share of the card width the diagram occupies

const SPINE_X = [30, 70];
const LEAF_X = [12.5, 37.5, 62.5, 87.5];
const nicX = (i: number, r: number) => 7.55 + 25 * i + r * 9.9;

// Deterministic pseudo-random in [0,1) that changes with `tick`.
const rnd = (i: number, tick: number) => {
  const x = Math.sin((i + 1) * 12.9898 + tick * 78.233) * 43758.5453;
  return x - Math.floor(x);
};

// Purple GPU heat: saturation rises with load.
const heat = (l: number) => {
  if (l < 0.08) return "#ebe8e5";
  return `oklch(${(0.92 - 0.38 * l).toFixed(3)} ${(0.03 + 0.2 * l).toFixed(3)} ${(285 + 25 * l).toFixed(1)})`;
};

const ibColor = (e: number) =>
  `oklch(${(0.86 - 0.14 * e).toFixed(3)} ${(0.05 + 0.17 * e).toFixed(3)} 65)`;
const pcColor = (e: number) =>
  `oklch(${(0.85 - 0.25 * e).toFixed(3)} ${(0.05 + 0.2 * e).toFixed(3)} 305)`;
const nvColor = (e: number) =>
  `oklch(${(0.8 - 0.25 * e).toFixed(3)} ${(0.05 + 0.2 * e).toFixed(3)} 275)`;

const spin = (running: boolean): CSSProperties["animationPlayState"] =>
  running ? "running" : "paused";

export default function HeroTrace() {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const [elapsed, setElapsed] = useState(0);
  // The first pass plays all three implementations once; after that (or as soon
  // as the user clicks one) playback stops at the end of the chosen slot.
  const [endAt, setEndAt] = useState(PHASES.length * SLOT_MS);
  const [visible, setVisible] = useState(true);
  const topoRef = useRef<HTMLDivElement | null>(null);
  const [topoW, setTopoW] = useState(400); // design-space width of the diagram

  useEffect(() => {
    const el = topoRef.current;
    if (!el) return;
    const ro = new ResizeObserver(() =>
      setTopoW((el.clientWidth * TOPO_FILL) / SCALE),
    );
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setVisible(e.isIntersecting));
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const stopped = elapsed >= endAt;
  useEffect(() => {
    if (!visible || stopped) return;
    const id = setInterval(
      () => setElapsed((t) => Math.min(t + FRAME_MS, endAt)),
      FRAME_MS,
    );
    return () => clearInterval(id);
  }, [visible, stopped, endAt]);

  const now = Math.min(elapsed, endAt - 1); // stay inside the final slot once stopped
  const phase = Math.min(Math.floor(now / SLOT_MS), PHASES.length - 1);
  const slot = (now % SLOT_MS) / PLAY_MS; // position on the fixed baseline axis
  const tick = Math.floor(elapsed / 180);
  const p = PHASES[phase];
  const r = (i: number) => rnd(i, tick);

  // Current intensity of each recorded trace, 0..1.
  const span = p.us / TRACE_US; // fraction of the fixed axis this run occupies
  const finished = slot >= span;
  const t = finished ? 1 : slot / span; // position within this run
  const live = trace(p, t);
  const { eth, nv, pc } = finished ? { eth: 0, nv: 0, pc: 0 } : live;
  const speedup = TRACE_US / p.us;
  // Static overview of each implementation: all three traces on one small plot,
  // each drawn only as far as its own run length on the shared time axis.
  const miniPlots = useMemo(
    () =>
      PHASES.map((q) => {
        const w = (q.us / TRACE_US) * 100;
        const samples = Array.from({ length: PLOT_N + 1 }, (_, i) =>
          trace(q, i / PLOT_N),
        );
        const path = (key: "eth" | "nv" | "pc" | "acc") =>
          `M${samples.map((v, i) => `${((i / PLOT_N) * w).toFixed(2)},${(MINI_H - 3 - v[key] * (MINI_H - 7)).toFixed(2)}`).join(" L")}`;
        const rows = [
          {
            key: "eth",
            label: "Ethernet",
            d: path("eth"),
            color: "oklch(0.72 0.19 55)",
          },
          {
            key: "nv",
            label: "NVLink",
            d: path("nv"),
            color: "oklch(0.5 0.2 275)",
          },
          {
            key: "pc",
            label: "SM",
            d: path("pc"),
            color: "oklch(0.55 0.22 305)",
          },
          ...(q.accPts
            ? [
                {
                  key: "acc",
                  label: "Accelerator",
                  d: path("acc"),
                  color: "oklch(0.55 0.16 150)",
                },
              ]
            : []),
        ];
        const step = 2000; // minor ticks; labels every LABEL_EVERY
        const ticks = Array.from(
          { length: Math.floor(q.us / step) + 1 },
          (_, k) => k * step,
        );
        return { w, rows, ticks };
      }),
    [],
  );
  // Colour intensity follows each link's own trace: saturation peaks at the
  // spikes in its plot.
  const ethV = eth;
  const nvV = nv;
  const ethOn = eth > 0.05;
  const pcOn = pc > 0.05;
  const nvOn = nv > 0.05;

  const links: {
    x1: number;
    y1: number;
    x2: number;
    y2: number;
    stroke: string;
    w: number;
    dash: string;
    play: boolean;
    op: number;
  }[] = [];
  let k = 0;
  const link = (
    x1: number,
    y1: number,
    x2: number,
    y2: number,
    seed: number,
  ) => {
    const v = r(seed);
    links.push({
      x1,
      y1,
      x2,
      y2,
      stroke: ethOn ? ibColor(ethV) : IDLE,
      w: 1 + 0.9 * ethV,
      dash: ethOn ? "5 5" : "0",
      play: ethOn,
      op: ethOn ? 0.3 + 0.7 * clamp(ethV * (0.6 + 0.8 * v)) : 0.9,
    });
  };
  LEAF_X.forEach((lx) =>
    SPINE_X.forEach((sx) => link(lx, 92, sx, 44, 300 + k++)),
  );
  for (let i = 0; i < 4; i++) {
    for (let n = 0; n < 2; n++)
      link(LEAF_X[Math.floor(i / 2) * 2 + n], 114, nicX(i, n), 171, 400 + k++);
  }

  const port = (i: number) =>
    ethOn && r(i) < 0.15 + 0.85 * ethV ? ibColor(ethV) : "#ebe8e5";
  const level = (i: number) => clamp(pc * (0.8 + 0.4 * r(i)));

  const swBorder = ethOn ? ibColor(ethV) : "#e7e5e4";
  const swShadow =
    ethV > 0.2
      ? `0 0 0 3px oklch(0.75 0.15 70 / ${(0.25 * ethV).toFixed(2)}), 0 8px 18px -10px oklch(0.75 0.15 70 / ${(0.8 * ethV).toFixed(2)})`
      : "none";

  return (
    <div
      ref={rootRef}
      data-no-trail
      className="relative w-full max-w-170 min-w-0 flex flex-col gap-3 rounded-[22px] transition-transform duration-300 ease-out md:hover:scale-[1.025] border border-stone-200 bg-white/85 md:bg-white/60 p-4 font-sans shadow-[0_1px_2px_rgba(28,25,23,0.04),0_30px_60px_-30px_rgba(68,64,60,0.25)]"
    >
      <div className="flex items-center justify-between gap-3 px-1">
        <div className="text-[15px] font-semibold tracking-tight text-stone-900">
          Datacenter GPU Infrastructure
        </div>
        <div
          className="whitespace-nowrap rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-0.5 text-[11px] font-medium text-emerald-800 transition-opacity duration-300"
          style={{ opacity: finished ? 1 : 0 }}
          aria-hidden={!finished}
        >
          ✓ {p.workload} done in {ms(p.us)} · {speedup.toFixed(1)}× speedup
        </div>
      </div>

      <div
        ref={topoRef}
        className="relative w-full overflow-hidden rounded-[14px] border border-stone-200/70 bg-stone-50/75"
        style={{
          height: TOPO_H * SCALE + 16,
          backgroundImage:
            "radial-gradient(rgba(120,113,108,0.18) 1px,transparent 1px)",
          backgroundSize: "14px 14px",
        }}
      >
        <div className="pointer-events-none absolute top-2.5 left-3.5 z-10 text-[10px] font-medium uppercase tracking-[0.12em] text-stone-400">
          Topology
        </div>
        <div
          className="absolute top-2 origin-top-left"
          style={{
            left: `calc(50% - ${(topoW * SCALE) / 2}px)`,
            width: topoW,
            height: TOPO_H,
            transform: `scale(${SCALE})`,
          }}
        >
          <svg
            viewBox={`0 0 100 ${TOPO_H}`}
            preserveAspectRatio="none"
            className="absolute inset-0 size-full"
          >
            {links.map((l, i) => (
              <line
                key={i}
                x1={l.x1}
                y1={l.y1}
                x2={l.x2}
                y2={l.y2}
                stroke={l.stroke}
                strokeWidth={l.w}
                strokeDasharray={l.dash}
                vectorEffect="non-scaling-stroke"
                style={{
                  animation: "hero-dash .6s linear infinite",
                  animationPlayState: spin(l.play),
                  opacity: l.op,
                  transition: "opacity .1s",
                }}
              />
            ))}
          </svg>

          {SPINE_X.map((x, i) => (
            <div
              key={i}
              className="absolute top-5 flex h-6 w-[24%] items-center justify-between gap-1.5 rounded-[7px] border bg-white/95 px-2 "
              style={{
                left: `${x - 12}%`,
                borderColor: swBorder,
                boxShadow: swShadow,
              }}
            >
              <span className="whitespace-nowrap text-[12px] tracking-[0.04em] text-stone-600">
                SPINE {i}
              </span>
              <div className="flex gap-0.5">
                {[0, 1, 2, 3].map((j) => (
                  <div
                    key={j}
                    className="h-2 w-1 rounded-[1px] "
                    style={{ background: port(500 + i * 4 + j) }}
                  />
                ))}
              </div>
            </div>
          ))}

          {LEAF_X.map((x, i) => (
            <div
              key={i}
              className="absolute top-23 flex h-5.5 w-[19%] items-center justify-center gap-1.25 rounded-md border bg-white/95 "
              style={{
                left: `${x - 9.5}%`,
                borderColor: swBorder,
                boxShadow: swShadow,
              }}
            >
              <span className="whitespace-nowrap text-[12px] tracking-[0.04em] text-stone-600">
                LEAF {i}
              </span>
              <div
                className="size-1.25 rounded-full "
                style={{ background: port(600 + i) }}
              />
            </div>
          ))}

          {[0, 1, 2, 3].map((i) => (
            <div
              key={i}
              className="absolute top-41 grid w-[22%] grid-cols-4 gap-x-0.75 rounded-[9px] border border-stone-200 bg-white/85 px-[5%] pt-1.75 pb-1.5"
              style={{ left: `${1.5 + 25 * i}%` }}
            >
              {[0, 1].map((n) => (
                <div
                  key={n}
                  className="col-span-2 flex h-3.5 items-center justify-center rounded-[3px] border text-[10px] tracking-[0.04em] "
                  style={{
                    color: ethOn ? "#44403c" : "#a8a29e",
                    background: ethOn
                      ? `oklch(0.97 ${(0.03 + 0.05 * ethV).toFixed(3)} 70)`
                      : "rgba(255,255,255,0.9)",
                    borderColor: ethOn ? ibColor(ethV) : "#e7e5e4",
                  }}
                >
                  NIC
                </div>
              ))}
              {[0, 1, 2, 3].map((n) => (
                <div key={n} className="flex h-3.5 justify-center">
                  <div
                    className="h-full w-0.5"
                    style={{
                      backgroundImage: `linear-gradient(180deg,${pcOn ? pcColor(pc) : "#c9c5c1"} 0 5px,transparent 5px 10px)`,
                      backgroundSize: "2px 10px",
                      animation: "hero-flow-y .45s linear infinite reverse",
                      animationPlayState: spin(pcOn),
                      opacity: 0.35 + 0.65 * pc,
                      transition: "opacity .1s",
                    }}
                  />
                </div>
              ))}
              {[0, 1, 2, 3].map((g) => (
                <div
                  key={g}
                  className="h-5.5 rounded-[3px] border border-stone-900/6 "
                  style={{ background: heat(level(i * 4 + g)) }}
                />
              ))}
              {[0, 1, 2, 3].map((n) => (
                <div key={n} className="flex h-2.5 justify-center gap-0.5">
                  {(["normal", "reverse"] as const).map((dir) => (
                    <div
                      key={dir}
                      className="h-full w-[1.5px]"
                      style={{
                        backgroundImage: `linear-gradient(180deg,${nvOn ? nvColor(nvV) : "#c9c5c1"} 0 4px,transparent 4px 8px)`,
                        backgroundSize: "2px 8px",
                        animation: `hero-flow-y .35s linear infinite ${dir}`,
                        animationPlayState: spin(nvOn),
                        opacity: 0.35 + 0.65 * nvV,
                        transition: "opacity .1s",
                      }}
                    />
                  ))}
                </div>
              ))}
              <div
                className="col-span-full -mx-1 flex h-5 items-center justify-center rounded-[4px] border text-[10.5px] font-medium tracking-[0.02em] "
                style={{
                  color: nvOn ? "oklch(0.4 0.15 275)" : "#a8a29e",
                  background: nvOn
                    ? `oklch(${(0.95 - 0.07 * nvV).toFixed(3)} ${(0.03 + 0.09 * nvV).toFixed(3)} 275)`
                    : "rgba(255,255,255,0.9)",
                  borderColor: nvOn
                    ? `oklch(${(0.82 - 0.2 * nvV).toFixed(3)} ${(0.05 + 0.15 * nvV).toFixed(3)} 275)`
                    : "#e7e5e4",
                  boxShadow:
                    nvV > 0.2
                      ? `0 0 0 3px oklch(0.6 0.2 275 / ${(0.3 * nvV).toFixed(2)})`
                      : "none",
                }}
              >
                NVSWITCH
              </div>
              <div className="col-span-full mt-1.5 whitespace-nowrap text-center text-[10px] tracking-[0.04em] text-stone-400">
                NODE {i}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-2">
        {PHASES.map((q, i) => {
          const active = i === phase;
          const mp = miniPlots[i];
          return (
            <button
              key={q.workload}
              type="button"
              aria-pressed={active}
              aria-label={`Play ${q.workload}`}
              // Jump to the start of this implementation's slot and replay it.
              onClick={() => {
                setEndAt((i + 1) * SLOT_MS);
                setElapsed(i * SLOT_MS);
              }}
              className={`relative w-full cursor-pointer rounded-[14px] border px-3.5 py-3 text-left transition-colors duration-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-400 ${
                active
                  ? "border-stone-200/70 bg-white/70"
                  : "border-stone-200/50 bg-stone-100/50 hover:bg-white/60"
              }`}
            >
              <div className="grid grid-cols-[minmax(0,0.9fr)_minmax(0,1.3fr)] items-center gap-4">
                <div
                  className={`flex flex-col gap-1 ${active ? "text-stone-600" : "text-stone-400"}`}
                >
                  <div
                    className={`text-[13px] font-semibold ${active ? "text-stone-900" : "text-stone-400"}`}
                  >
                    {q.workload}
                  </div>
                  <div className="text-[12px] leading-snug">{q.fix}</div>
                </div>
                <div className="flex flex-col">
                  {mp.rows.map((row) => (
                    <div
                      key={row.key}
                      className="flex items-center gap-2"
                      style={{ height: MINI_H }}
                    >
                      <span
                        className={`w-16 shrink-0 text-[10px] font-medium ${active ? "text-stone-500" : "text-stone-400"}`}
                      >
                        {row.label}
                      </span>
                      <svg
                        viewBox={`0 0 100 ${MINI_H}`}
                        preserveAspectRatio="none"
                        className="h-full min-w-0 flex-1 overflow-visible"
                      >
                        <defs>
                          <clipPath id={`hero-mini-${i}-${row.key}`}>
                            <rect
                              x="0"
                              y="-2"
                              width={active ? t * mp.w : 0}
                              height={MINI_H + 4}
                            />
                          </clipPath>
                        </defs>
                        <line
                          x1="0"
                          x2="100"
                          y1={MINI_H - 3}
                          y2={MINI_H - 3}
                          stroke="#e7e5e4"
                          strokeWidth="1"
                          vectorEffect="non-scaling-stroke"
                        />
                        <path
                          d={row.d}
                          fill="none"
                          stroke={active ? row.color : "#d6d3d1"}
                          strokeOpacity={active ? 0.28 : 1}
                          strokeWidth="1.25"
                          vectorEffect="non-scaling-stroke"
                        />
                        {active && (
                          <path
                            d={row.d}
                            fill="none"
                            stroke={row.color}
                            strokeWidth="1.75"
                            vectorEffect="non-scaling-stroke"
                            clipPath={`url(#hero-mini-${i}-${row.key})`}
                          />
                        )}
                      </svg>
                    </div>
                  ))}
                  <div
                    className="flex items-center gap-2"
                    style={{ height: 18 }}
                  >
                    <span className="w-16 shrink-0" />
                    <div className="relative h-full min-w-0 flex-1">
                      {mp.ticks.map((tk) => {
                        const labelled = tk % LABEL_EVERY === 0;
                        const edge = tk === TRACE_US;
                        return (
                          <div
                            key={tk}
                            className="absolute top-0 flex flex-col"
                            style={{
                              left: `${(tk / TRACE_US) * 100}%`,
                              alignItems:
                                tk === 0
                                  ? "flex-start"
                                  : edge
                                    ? "flex-end"
                                    : "center",
                              transform:
                                tk === 0
                                  ? "none"
                                  : edge
                                    ? "translateX(-100%)"
                                    : "translateX(-50%)",
                            }}
                          >
                            <div
                              className={`w-px bg-stone-300 ${labelled ? "h-1.5" : "h-1"}`}
                            />
                            {labelled && (
                              <span className="whitespace-nowrap text-[9.5px] leading-none text-stone-400">
                                {ms(tk)}
                              </span>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
