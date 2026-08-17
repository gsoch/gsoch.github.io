import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { motion } from "motion/react";
import { topology, network, roofline, gpuUtil } from "@/data/hdes";
import TopologyPanel from "@/components/custom/hdes/TopologyPanel";
import NetworkPanel from "@/components/custom/hdes/NetworkPanel";
import RooflinePanel from "@/components/custom/hdes/RooflinePanel";
import GpuUtilPanel from "@/components/custom/hdes/GpuUtilPanel";

const TABS = [
  { id: "topology", label: "Topology" },
  { id: "network", label: "Network" },
  { id: "roofline", label: "Roofline" },
  { id: "gpu", label: "GPU" },
] as const;

type TabId = (typeof TABS)[number]["id"];

const ROTATE_MS = 10000;
// A click on a panel's own sub-controls (implementation/cluster toggles)
// means someone is actively reading that plot, not just browsing tabs — give
// it a longer hold than a plain tab click before the carousel resumes.
const INTERACT_HOLD_MS = 20000;

export default function HDESShowcase() {
  const [tab, setTab] = useState<TabId>("topology");
  const [delay, setDelay] = useState(ROTATE_MS);
  // Two attempts at a truly fixed (never-reshaping) card size were tried
  // and measured here, both worse than what's below:
  //  1. All four panels permanently mounted, CSS Grid sized to the
  //     tallest one natively — 589-831ms per tab click, because every
  //     click then re-renders all four panels' full trees (Topology's
  //     ~50 nodes each carry inline onMouseEnter/onMouseLeave closures
  //     that get new identities every render, forcing React to
  //     unbind/rebind every one of those DOM listeners on every click,
  //     not just when visiting that tab).
  //  2. Only the active/transitioning panel(s) mounted, height ratcheted
  //     up to the tallest seen so far via a plain CSS min-height
  //     transition (no per-switch JS animation) — still 60-700ms+ and
  //     erratic, confirmed on repeat runs (not measurement noise).
  // What's left is the version that actually measured best (100-266ms):
  // mount only the active tab plus the outgoing one for a short window,
  // and animate height to the freshly measured value on every switch.
  const [mountedTabs, setMountedTabs] = useState<Set<TabId>>(() => new Set(["topology"]));
  const panelRefs = useRef<Partial<Record<TabId, HTMLDivElement | null>>>({});
  const [height, setHeight] = useState<number | "auto">("auto");
  // Bumped on every interaction so the effect below always restarts the
  // interval, even when `delay` is set to the same value it already had
  // (e.g. clicking Imp. 1 then Imp. 2 both set delay=INTERACT_HOLD_MS —
  // React bails out of re-running effects when a state setter receives an
  // unchanged value, so without this second click wouldn't actually reset
  // the countdown, just leave the first click's timer running).
  const [resetTick, setResetTick] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setTab((current) => {
        const idx = TABS.findIndex((t) => t.id === current);
        return TABS[(idx + 1) % TABS.length].id;
      });
      setDelay(ROTATE_MS);
    }, delay);
    return () => clearInterval(id);
  }, [tab, delay, resetTick]);

  const selectTab = (id: TabId) => {
    setTab(id);
    setDelay(ROTATE_MS);
    setResetTick((n) => n + 1);
  };

  const onInteract = () => {
    setDelay(INTERACT_HOLD_MS);
    setResetTick((n) => n + 1);
  };

  // Measure before paint so height is already correct for the very first
  // frame, then re-measure whenever the active tab changes or its own panel
  // resizes (the SVGs are aspect-locked to width via viewBox, so a viewport
  // resize changes their rendered pixel height too, not just tab switches).
  useLayoutEffect(() => {
    const el = panelRefs.current[tab];
    if (el) setHeight(el.scrollHeight);
  }, [tab]);

  useEffect(() => {
    const el = panelRefs.current[tab];
    if (!el) return;
    const ro = new ResizeObserver(() => setHeight(el.scrollHeight));
    ro.observe(el);
    return () => ro.disconnect();
  }, [tab]);

  // Keep the outgoing panel mounted just long enough for its opacity fade
  // (300ms) and the container's height tween (400ms) to finish, then drop
  // it — a manual timer instead of AnimatePresence's automatic exit
  // lifecycle, which is what raced against the height animation before.
  useEffect(() => {
    setMountedTabs((prev) => (prev.has(tab) ? prev : new Set(prev).add(tab)));
    const timeout = setTimeout(() => setMountedTabs(new Set([tab])), 450);
    return () => clearTimeout(timeout);
  }, [tab]);

  return (
    // Solid on mobile, frosted glass on desktop — this card's content
    // changes constantly (10s auto-rotate, tab clicks, hover), so its
    // backdrop-blur can never settle into a cheap cached state; it has to
    // keep re-sampling on every repaint. Confirmed as a major contributor
    // to the reported mobile slowness (right where the header slowness was
    // also reported: scrolling to and interacting with this exact card).
    <div className="w-full max-w-2xl lg:max-w-3xl rounded-2xl border border-stone-200 bg-white/95 md:bg-white/60 backdrop-blur-none md:backdrop-blur-xl shadow-sm p-4 md:p-6 space-y-5 md:space-y-6">
      <div>
        <div className="text-sm text-stone-500">HDES &middot; Heterogeneous Discrete-Event Simulator</div>
        <div className="text-lg font-medium">Distributed MoE Communication</div>
      </div>

      <div className="flex rounded-full bg-stone-100 p-0.5 text-sm w-fit">
        {TABS.map((t) => (
          <button
            key={t.id}
            onClick={() => selectTab(t.id)}
            className={`relative px-4 py-1.5 rounded-full transition-colors ${
              tab === t.id ? "text-white" : "text-stone-600 hover:text-stone-900"
            }`}
          >
            {tab === t.id && (
              <motion.div
                layoutId="hdesActiveTab"
                className="absolute inset-0 bg-stone-900 rounded-full"
                transition={{ type: "spring", stiffness: 420, damping: 34 }}
              />
            )}
            <span className="relative z-10">{t.label}</span>
          </button>
        ))}
      </div>

      {/* Only mountedTabs are in the DOM — normally just the active one, and
          the outgoing one too for ~450ms during a switch (see above). The
          active panel sits in flow (defining the measured height above)
          while any transitional other sits absolutely on top of it.
          Switching tabs crossfades opacity on both the outgoing and
          incoming panel at once, while the container's height tweens
          independently to the newly-measured value — no exit/enter mount
          timing to fight. */}
      <motion.div
        className="relative overflow-hidden"
        animate={{ height }}
        transition={{ duration: 0.4, ease: "easeInOut" }}
      >
        {TABS.filter((t) => mountedTabs.has(t.id)).map((t) => (
          <div
            key={t.id}
            ref={(el) => {
              panelRefs.current[t.id] = el;
            }}
            aria-hidden={t.id !== tab}
            className={`transition-opacity duration-300 ease-in-out ${
              t.id === tab
                ? "relative opacity-100"
                : "absolute inset-x-0 top-0 opacity-0 pointer-events-none"
            }`}
          >
            {t.id === "topology" && <TopologyPanel data={topology} onInteract={onInteract} />}
            {t.id === "network" && <NetworkPanel data={network} onInteract={onInteract} />}
            {t.id === "roofline" && <RooflinePanel data={roofline} onInteract={onInteract} />}
            {t.id === "gpu" && <GpuUtilPanel data={gpuUtil} onInteract={onInteract} />}
          </div>
        ))}
      </motion.div>
    </div>
  );
}
