import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
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

  return (
    <div className="w-full max-w-2xl rounded-2xl border border-stone-200 bg-white/60 backdrop-blur-xl shadow-sm p-4 md:p-6 space-y-5 md:space-y-6">
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

      {/* Each tab's panel sizes to its own natural content — `layout`
          animates the height change smoothly when that differs between
          tabs, instead of an abrupt snap or forcing every tab into the
          tallest one's height (which left dead space under shorter
          panels like GPU). Within a panel, hover-triggered UI must reserve
          its own space rather than mounting/unmounting — see each panel's
          own fixed-height hover row. */}
      <motion.div layout transition={{ duration: 0.35, ease: "easeInOut" }}>
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={tab}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35, ease: "easeInOut" }}
          >
            {tab === "topology" && <TopologyPanel data={topology} onInteract={onInteract} />}
            {tab === "network" && <NetworkPanel data={network} onInteract={onInteract} />}
            {tab === "roofline" && <RooflinePanel data={roofline} onInteract={onInteract} />}
            {tab === "gpu" && <GpuUtilPanel data={gpuUtil} onInteract={onInteract} />}
          </motion.div>
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
