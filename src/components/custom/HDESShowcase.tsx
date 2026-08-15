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

  // Auto-rotate through the tabs. The interval restarts whenever `tab` or
  // `delay` changes — a tab click (delay stays at ROTATE_MS) or a
  // sub-control click (delay bumped to INTERACT_HOLD_MS via onInteract)
  // both buy a fresh wait before it advances again; each auto-advance
  // resets delay back to the normal cadence.
  useEffect(() => {
    const id = setInterval(() => {
      setTab((current) => {
        const idx = TABS.findIndex((t) => t.id === current);
        return TABS[(idx + 1) % TABS.length].id;
      });
      setDelay(ROTATE_MS);
    }, delay);
    return () => clearInterval(id);
  }, [tab, delay]);

  const selectTab = (id: TabId) => {
    setTab(id);
    setDelay(ROTATE_MS);
  };

  const onInteract = () => setDelay(INTERACT_HOLD_MS);

  return (
    <div className="w-full max-w-2xl rounded-2xl border border-stone-200 bg-white/60 backdrop-blur-xl shadow-sm p-4 md:p-6 space-y-5 md:space-y-6">
      <div>
        <div className="text-sm text-stone-500">HDES &middot; Discrete-Event Simulator</div>
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

      <AnimatePresence mode="wait">
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
    </div>
  );
}
