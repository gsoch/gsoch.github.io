import { useState } from "react";
import { topology, network, roofline } from "@/data/hdes";
import TopologyPanel from "@/components/custom/hdes/TopologyPanel";
import NetworkPanel from "@/components/custom/hdes/NetworkPanel";
import RooflinePanel from "@/components/custom/hdes/RooflinePanel";

const TABS = [
  { id: "topology", label: "Topology" },
  { id: "network", label: "Network" },
  { id: "roofline", label: "Roofline" },
] as const;

type TabId = (typeof TABS)[number]["id"];

export default function HDESShowcase() {
  const [tab, setTab] = useState<TabId>("topology");

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
            onClick={() => setTab(t.id)}
            className={`px-4 py-1.5 rounded-full transition-colors ${
              tab === t.id ? "bg-stone-900 text-white" : "text-stone-600 hover:text-stone-900"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === "topology" && <TopologyPanel data={topology} />}
      {tab === "network" && <NetworkPanel data={network} />}
      {tab === "roofline" && <RooflinePanel data={roofline} />}
    </div>
  );
}
