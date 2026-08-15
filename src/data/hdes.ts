// Real output from the HDES discrete-event simulator
// (~/UofT-HPRC_me/src/HDES), generated against presets/deepseek_v4_pro.json
// (DeepSeek-V4-Pro architecture on H800: 384 experts, top-6, hidden=7168,
// d_ff=3072). Every number here comes from an actual simulator run — see
// the dump script this was generated from for the exact invocation.
// Regenerate with: python3 dump_hdes.py > src/data/hdes.ts (data section)

export interface TopoNode { id: string; type: "gpu" | "nvswitch" | "pcie_switch" | "nic" | "fpga" | "rack_switch" | "spine_switch"; }
export interface TopoLink { src: string; dst: string; type: "nv" | "pcie" | "eth"; }
export interface TopologyData {
  world_size: number;
  gpus_per_rack: number;
  num_racks: number;
  inter_rack: string;
  nodes: TopoNode[];
  links: TopoLink[];
}

export interface NetworkData {
  mode: string;
  seq_len: number;
  ep: number;
  gpus_per_cluster: number;
  n_completed: number;
  sim_end_us: number;
  n_bins: number;
  canon: { dispatch?: [number, number]; compute?: [number, number]; gather?: [number, number] };
  p50_us: number;
  p99_us: number;
  e2e_us: number;
  throughput_gbps: { nv: number[]; pcie: number[]; eth: number[] };
  total_gb: { nv: number; pcie: number; eth: number };
  link_caps_gbps: { nv: number; pcie: number; eth: number };
}

export interface RooflinePoint {
  mode: string;
  seq_len: number;
  cluster: number;
  ep: number;
  n_completed: number;
  panel: Partial<Record<"nv" | "pcie" | "eth", { ai: number; gflops: number; efficiency: number }>>;
}

export interface RooflineData {
  ep: number;
  bw_by_link: { nv: number; pcie: number; eth: number };
  ridges: Record<string, { nv: number; pcie: number; eth: number }>;
  peak_flops_per_gpu: Record<string, number>;
  results: RooflinePoint[];
  model: { experts: number; topk: number; hidden: number; d_ff: number };
}

export const topology: TopologyData = {
  "world_size": 32,
  "gpus_per_rack": 8,
  "num_racks": 4,
  "inter_rack": "CLOS",
  "nodes": [
    {
      "id": "rack0-gpu0",
      "type": "gpu"
    },
    {
      "id": "rack0-gpu1",
      "type": "gpu"
    },
    {
      "id": "rack0-gpu2",
      "type": "gpu"
    },
    {
      "id": "rack0-gpu3",
      "type": "gpu"
    },
    {
      "id": "rack0-gpu4",
      "type": "gpu"
    },
    {
      "id": "rack0-gpu5",
      "type": "gpu"
    },
    {
      "id": "rack0-gpu6",
      "type": "gpu"
    },
    {
      "id": "rack0-gpu7",
      "type": "gpu"
    },
    {
      "id": "rack0-nic-0",
      "type": "nic"
    },
    {
      "id": "rack0-nic-1",
      "type": "nic"
    },
    {
      "id": "rack0-nic-2",
      "type": "nic"
    },
    {
      "id": "rack0-nic-3",
      "type": "nic"
    },
    {
      "id": "rack0-nic-4",
      "type": "nic"
    },
    {
      "id": "rack0-nic-5",
      "type": "nic"
    },
    {
      "id": "rack0-nic-6",
      "type": "nic"
    },
    {
      "id": "rack0-nic-7",
      "type": "nic"
    },
    {
      "id": "rack0-nvswitch",
      "type": "nvswitch"
    },
    {
      "id": "rack0-pcie-sw0",
      "type": "pcie_switch"
    },
    {
      "id": "rack0-pcie-sw1",
      "type": "pcie_switch"
    },
    {
      "id": "rack0-pcie-sw2",
      "type": "pcie_switch"
    },
    {
      "id": "rack0-pcie-sw3",
      "type": "pcie_switch"
    },
    {
      "id": "rack0-sw",
      "type": "rack_switch"
    },
    {
      "id": "rack1-gpu0",
      "type": "gpu"
    },
    {
      "id": "rack1-gpu1",
      "type": "gpu"
    },
    {
      "id": "rack1-gpu2",
      "type": "gpu"
    },
    {
      "id": "rack1-gpu3",
      "type": "gpu"
    },
    {
      "id": "rack1-gpu4",
      "type": "gpu"
    },
    {
      "id": "rack1-gpu5",
      "type": "gpu"
    },
    {
      "id": "rack1-gpu6",
      "type": "gpu"
    },
    {
      "id": "rack1-gpu7",
      "type": "gpu"
    },
    {
      "id": "rack1-nic-0",
      "type": "nic"
    },
    {
      "id": "rack1-nic-1",
      "type": "nic"
    },
    {
      "id": "rack1-nic-2",
      "type": "nic"
    },
    {
      "id": "rack1-nic-3",
      "type": "nic"
    },
    {
      "id": "rack1-nic-4",
      "type": "nic"
    },
    {
      "id": "rack1-nic-5",
      "type": "nic"
    },
    {
      "id": "rack1-nic-6",
      "type": "nic"
    },
    {
      "id": "rack1-nic-7",
      "type": "nic"
    },
    {
      "id": "rack1-nvswitch",
      "type": "nvswitch"
    },
    {
      "id": "rack1-pcie-sw0",
      "type": "pcie_switch"
    },
    {
      "id": "rack1-pcie-sw1",
      "type": "pcie_switch"
    },
    {
      "id": "rack1-pcie-sw2",
      "type": "pcie_switch"
    },
    {
      "id": "rack1-pcie-sw3",
      "type": "pcie_switch"
    },
    {
      "id": "rack1-sw",
      "type": "rack_switch"
    },
    {
      "id": "rack2-gpu0",
      "type": "gpu"
    },
    {
      "id": "rack2-gpu1",
      "type": "gpu"
    },
    {
      "id": "rack2-gpu2",
      "type": "gpu"
    },
    {
      "id": "rack2-gpu3",
      "type": "gpu"
    },
    {
      "id": "rack2-gpu4",
      "type": "gpu"
    },
    {
      "id": "rack2-gpu5",
      "type": "gpu"
    },
    {
      "id": "rack2-gpu6",
      "type": "gpu"
    },
    {
      "id": "rack2-gpu7",
      "type": "gpu"
    },
    {
      "id": "rack2-nic-0",
      "type": "nic"
    },
    {
      "id": "rack2-nic-1",
      "type": "nic"
    },
    {
      "id": "rack2-nic-2",
      "type": "nic"
    },
    {
      "id": "rack2-nic-3",
      "type": "nic"
    },
    {
      "id": "rack2-nic-4",
      "type": "nic"
    },
    {
      "id": "rack2-nic-5",
      "type": "nic"
    },
    {
      "id": "rack2-nic-6",
      "type": "nic"
    },
    {
      "id": "rack2-nic-7",
      "type": "nic"
    },
    {
      "id": "rack2-nvswitch",
      "type": "nvswitch"
    },
    {
      "id": "rack2-pcie-sw0",
      "type": "pcie_switch"
    },
    {
      "id": "rack2-pcie-sw1",
      "type": "pcie_switch"
    },
    {
      "id": "rack2-pcie-sw2",
      "type": "pcie_switch"
    },
    {
      "id": "rack2-pcie-sw3",
      "type": "pcie_switch"
    },
    {
      "id": "rack2-sw",
      "type": "rack_switch"
    },
    {
      "id": "rack3-gpu0",
      "type": "gpu"
    },
    {
      "id": "rack3-gpu1",
      "type": "gpu"
    },
    {
      "id": "rack3-gpu2",
      "type": "gpu"
    },
    {
      "id": "rack3-gpu3",
      "type": "gpu"
    },
    {
      "id": "rack3-gpu4",
      "type": "gpu"
    },
    {
      "id": "rack3-gpu5",
      "type": "gpu"
    },
    {
      "id": "rack3-gpu6",
      "type": "gpu"
    },
    {
      "id": "rack3-gpu7",
      "type": "gpu"
    },
    {
      "id": "rack3-nic-0",
      "type": "nic"
    },
    {
      "id": "rack3-nic-1",
      "type": "nic"
    },
    {
      "id": "rack3-nic-2",
      "type": "nic"
    },
    {
      "id": "rack3-nic-3",
      "type": "nic"
    },
    {
      "id": "rack3-nic-4",
      "type": "nic"
    },
    {
      "id": "rack3-nic-5",
      "type": "nic"
    },
    {
      "id": "rack3-nic-6",
      "type": "nic"
    },
    {
      "id": "rack3-nic-7",
      "type": "nic"
    },
    {
      "id": "rack3-nvswitch",
      "type": "nvswitch"
    },
    {
      "id": "rack3-pcie-sw0",
      "type": "pcie_switch"
    },
    {
      "id": "rack3-pcie-sw1",
      "type": "pcie_switch"
    },
    {
      "id": "rack3-pcie-sw2",
      "type": "pcie_switch"
    },
    {
      "id": "rack3-pcie-sw3",
      "type": "pcie_switch"
    },
    {
      "id": "rack3-sw",
      "type": "rack_switch"
    },
    {
      "id": "spine-0",
      "type": "spine_switch"
    },
    {
      "id": "spine-1",
      "type": "spine_switch"
    },
    {
      "id": "spine-2",
      "type": "spine_switch"
    },
    {
      "id": "spine-3",
      "type": "spine_switch"
    }
  ],
  "links": [
    {
      "src": "rack0-gpu0",
      "dst": "rack0-nvswitch",
      "type": "nv"
    },
    {
      "src": "rack0-gpu1",
      "dst": "rack0-nvswitch",
      "type": "nv"
    },
    {
      "src": "rack0-gpu2",
      "dst": "rack0-nvswitch",
      "type": "nv"
    },
    {
      "src": "rack0-gpu3",
      "dst": "rack0-nvswitch",
      "type": "nv"
    },
    {
      "src": "rack0-gpu4",
      "dst": "rack0-nvswitch",
      "type": "nv"
    },
    {
      "src": "rack0-gpu5",
      "dst": "rack0-nvswitch",
      "type": "nv"
    },
    {
      "src": "rack0-gpu6",
      "dst": "rack0-nvswitch",
      "type": "nv"
    },
    {
      "src": "rack0-gpu7",
      "dst": "rack0-nvswitch",
      "type": "nv"
    },
    {
      "src": "rack0-nic-0",
      "dst": "rack0-sw",
      "type": "eth"
    },
    {
      "src": "rack0-nic-1",
      "dst": "rack0-sw",
      "type": "eth"
    },
    {
      "src": "rack0-nic-2",
      "dst": "rack0-sw",
      "type": "eth"
    },
    {
      "src": "rack0-nic-3",
      "dst": "rack0-sw",
      "type": "eth"
    },
    {
      "src": "rack0-nic-4",
      "dst": "rack0-sw",
      "type": "eth"
    },
    {
      "src": "rack0-nic-5",
      "dst": "rack0-sw",
      "type": "eth"
    },
    {
      "src": "rack0-nic-6",
      "dst": "rack0-sw",
      "type": "eth"
    },
    {
      "src": "rack0-nic-7",
      "dst": "rack0-sw",
      "type": "eth"
    },
    {
      "src": "rack0-gpu0",
      "dst": "rack0-pcie-sw0",
      "type": "pcie"
    },
    {
      "src": "rack0-nic-0",
      "dst": "rack0-pcie-sw0",
      "type": "pcie"
    },
    {
      "src": "rack0-gpu1",
      "dst": "rack0-pcie-sw0",
      "type": "pcie"
    },
    {
      "src": "rack0-nic-1",
      "dst": "rack0-pcie-sw0",
      "type": "pcie"
    },
    {
      "src": "rack0-gpu2",
      "dst": "rack0-pcie-sw1",
      "type": "pcie"
    },
    {
      "src": "rack0-nic-2",
      "dst": "rack0-pcie-sw1",
      "type": "pcie"
    },
    {
      "src": "rack0-gpu3",
      "dst": "rack0-pcie-sw1",
      "type": "pcie"
    },
    {
      "src": "rack0-nic-3",
      "dst": "rack0-pcie-sw1",
      "type": "pcie"
    },
    {
      "src": "rack0-gpu4",
      "dst": "rack0-pcie-sw2",
      "type": "pcie"
    },
    {
      "src": "rack0-nic-4",
      "dst": "rack0-pcie-sw2",
      "type": "pcie"
    },
    {
      "src": "rack0-gpu5",
      "dst": "rack0-pcie-sw2",
      "type": "pcie"
    },
    {
      "src": "rack0-nic-5",
      "dst": "rack0-pcie-sw2",
      "type": "pcie"
    },
    {
      "src": "rack0-gpu6",
      "dst": "rack0-pcie-sw3",
      "type": "pcie"
    },
    {
      "src": "rack0-nic-6",
      "dst": "rack0-pcie-sw3",
      "type": "pcie"
    },
    {
      "src": "rack0-gpu7",
      "dst": "rack0-pcie-sw3",
      "type": "pcie"
    },
    {
      "src": "rack0-nic-7",
      "dst": "rack0-pcie-sw3",
      "type": "pcie"
    },
    {
      "src": "rack1-gpu0",
      "dst": "rack1-nvswitch",
      "type": "nv"
    },
    {
      "src": "rack1-gpu1",
      "dst": "rack1-nvswitch",
      "type": "nv"
    },
    {
      "src": "rack1-gpu2",
      "dst": "rack1-nvswitch",
      "type": "nv"
    },
    {
      "src": "rack1-gpu3",
      "dst": "rack1-nvswitch",
      "type": "nv"
    },
    {
      "src": "rack1-gpu4",
      "dst": "rack1-nvswitch",
      "type": "nv"
    },
    {
      "src": "rack1-gpu5",
      "dst": "rack1-nvswitch",
      "type": "nv"
    },
    {
      "src": "rack1-gpu6",
      "dst": "rack1-nvswitch",
      "type": "nv"
    },
    {
      "src": "rack1-gpu7",
      "dst": "rack1-nvswitch",
      "type": "nv"
    },
    {
      "src": "rack1-nic-0",
      "dst": "rack1-sw",
      "type": "eth"
    },
    {
      "src": "rack1-nic-1",
      "dst": "rack1-sw",
      "type": "eth"
    },
    {
      "src": "rack1-nic-2",
      "dst": "rack1-sw",
      "type": "eth"
    },
    {
      "src": "rack1-nic-3",
      "dst": "rack1-sw",
      "type": "eth"
    },
    {
      "src": "rack1-nic-4",
      "dst": "rack1-sw",
      "type": "eth"
    },
    {
      "src": "rack1-nic-5",
      "dst": "rack1-sw",
      "type": "eth"
    },
    {
      "src": "rack1-nic-6",
      "dst": "rack1-sw",
      "type": "eth"
    },
    {
      "src": "rack1-nic-7",
      "dst": "rack1-sw",
      "type": "eth"
    },
    {
      "src": "rack1-gpu0",
      "dst": "rack1-pcie-sw0",
      "type": "pcie"
    },
    {
      "src": "rack1-nic-0",
      "dst": "rack1-pcie-sw0",
      "type": "pcie"
    },
    {
      "src": "rack1-gpu1",
      "dst": "rack1-pcie-sw0",
      "type": "pcie"
    },
    {
      "src": "rack1-nic-1",
      "dst": "rack1-pcie-sw0",
      "type": "pcie"
    },
    {
      "src": "rack1-gpu2",
      "dst": "rack1-pcie-sw1",
      "type": "pcie"
    },
    {
      "src": "rack1-nic-2",
      "dst": "rack1-pcie-sw1",
      "type": "pcie"
    },
    {
      "src": "rack1-gpu3",
      "dst": "rack1-pcie-sw1",
      "type": "pcie"
    },
    {
      "src": "rack1-nic-3",
      "dst": "rack1-pcie-sw1",
      "type": "pcie"
    },
    {
      "src": "rack1-gpu4",
      "dst": "rack1-pcie-sw2",
      "type": "pcie"
    },
    {
      "src": "rack1-nic-4",
      "dst": "rack1-pcie-sw2",
      "type": "pcie"
    },
    {
      "src": "rack1-gpu5",
      "dst": "rack1-pcie-sw2",
      "type": "pcie"
    },
    {
      "src": "rack1-nic-5",
      "dst": "rack1-pcie-sw2",
      "type": "pcie"
    },
    {
      "src": "rack1-gpu6",
      "dst": "rack1-pcie-sw3",
      "type": "pcie"
    },
    {
      "src": "rack1-nic-6",
      "dst": "rack1-pcie-sw3",
      "type": "pcie"
    },
    {
      "src": "rack1-gpu7",
      "dst": "rack1-pcie-sw3",
      "type": "pcie"
    },
    {
      "src": "rack1-nic-7",
      "dst": "rack1-pcie-sw3",
      "type": "pcie"
    },
    {
      "src": "rack2-gpu0",
      "dst": "rack2-nvswitch",
      "type": "nv"
    },
    {
      "src": "rack2-gpu1",
      "dst": "rack2-nvswitch",
      "type": "nv"
    },
    {
      "src": "rack2-gpu2",
      "dst": "rack2-nvswitch",
      "type": "nv"
    },
    {
      "src": "rack2-gpu3",
      "dst": "rack2-nvswitch",
      "type": "nv"
    },
    {
      "src": "rack2-gpu4",
      "dst": "rack2-nvswitch",
      "type": "nv"
    },
    {
      "src": "rack2-gpu5",
      "dst": "rack2-nvswitch",
      "type": "nv"
    },
    {
      "src": "rack2-gpu6",
      "dst": "rack2-nvswitch",
      "type": "nv"
    },
    {
      "src": "rack2-gpu7",
      "dst": "rack2-nvswitch",
      "type": "nv"
    },
    {
      "src": "rack2-nic-0",
      "dst": "rack2-sw",
      "type": "eth"
    },
    {
      "src": "rack2-nic-1",
      "dst": "rack2-sw",
      "type": "eth"
    },
    {
      "src": "rack2-nic-2",
      "dst": "rack2-sw",
      "type": "eth"
    },
    {
      "src": "rack2-nic-3",
      "dst": "rack2-sw",
      "type": "eth"
    },
    {
      "src": "rack2-nic-4",
      "dst": "rack2-sw",
      "type": "eth"
    },
    {
      "src": "rack2-nic-5",
      "dst": "rack2-sw",
      "type": "eth"
    },
    {
      "src": "rack2-nic-6",
      "dst": "rack2-sw",
      "type": "eth"
    },
    {
      "src": "rack2-nic-7",
      "dst": "rack2-sw",
      "type": "eth"
    },
    {
      "src": "rack2-gpu0",
      "dst": "rack2-pcie-sw0",
      "type": "pcie"
    },
    {
      "src": "rack2-nic-0",
      "dst": "rack2-pcie-sw0",
      "type": "pcie"
    },
    {
      "src": "rack2-gpu1",
      "dst": "rack2-pcie-sw0",
      "type": "pcie"
    },
    {
      "src": "rack2-nic-1",
      "dst": "rack2-pcie-sw0",
      "type": "pcie"
    },
    {
      "src": "rack2-gpu2",
      "dst": "rack2-pcie-sw1",
      "type": "pcie"
    },
    {
      "src": "rack2-nic-2",
      "dst": "rack2-pcie-sw1",
      "type": "pcie"
    },
    {
      "src": "rack2-gpu3",
      "dst": "rack2-pcie-sw1",
      "type": "pcie"
    },
    {
      "src": "rack2-nic-3",
      "dst": "rack2-pcie-sw1",
      "type": "pcie"
    },
    {
      "src": "rack2-gpu4",
      "dst": "rack2-pcie-sw2",
      "type": "pcie"
    },
    {
      "src": "rack2-nic-4",
      "dst": "rack2-pcie-sw2",
      "type": "pcie"
    },
    {
      "src": "rack2-gpu5",
      "dst": "rack2-pcie-sw2",
      "type": "pcie"
    },
    {
      "src": "rack2-nic-5",
      "dst": "rack2-pcie-sw2",
      "type": "pcie"
    },
    {
      "src": "rack2-gpu6",
      "dst": "rack2-pcie-sw3",
      "type": "pcie"
    },
    {
      "src": "rack2-nic-6",
      "dst": "rack2-pcie-sw3",
      "type": "pcie"
    },
    {
      "src": "rack2-gpu7",
      "dst": "rack2-pcie-sw3",
      "type": "pcie"
    },
    {
      "src": "rack2-nic-7",
      "dst": "rack2-pcie-sw3",
      "type": "pcie"
    },
    {
      "src": "rack3-gpu0",
      "dst": "rack3-nvswitch",
      "type": "nv"
    },
    {
      "src": "rack3-gpu1",
      "dst": "rack3-nvswitch",
      "type": "nv"
    },
    {
      "src": "rack3-gpu2",
      "dst": "rack3-nvswitch",
      "type": "nv"
    },
    {
      "src": "rack3-gpu3",
      "dst": "rack3-nvswitch",
      "type": "nv"
    },
    {
      "src": "rack3-gpu4",
      "dst": "rack3-nvswitch",
      "type": "nv"
    },
    {
      "src": "rack3-gpu5",
      "dst": "rack3-nvswitch",
      "type": "nv"
    },
    {
      "src": "rack3-gpu6",
      "dst": "rack3-nvswitch",
      "type": "nv"
    },
    {
      "src": "rack3-gpu7",
      "dst": "rack3-nvswitch",
      "type": "nv"
    },
    {
      "src": "rack3-nic-0",
      "dst": "rack3-sw",
      "type": "eth"
    },
    {
      "src": "rack3-nic-1",
      "dst": "rack3-sw",
      "type": "eth"
    },
    {
      "src": "rack3-nic-2",
      "dst": "rack3-sw",
      "type": "eth"
    },
    {
      "src": "rack3-nic-3",
      "dst": "rack3-sw",
      "type": "eth"
    },
    {
      "src": "rack3-nic-4",
      "dst": "rack3-sw",
      "type": "eth"
    },
    {
      "src": "rack3-nic-5",
      "dst": "rack3-sw",
      "type": "eth"
    },
    {
      "src": "rack3-nic-6",
      "dst": "rack3-sw",
      "type": "eth"
    },
    {
      "src": "rack3-nic-7",
      "dst": "rack3-sw",
      "type": "eth"
    },
    {
      "src": "rack3-gpu0",
      "dst": "rack3-pcie-sw0",
      "type": "pcie"
    },
    {
      "src": "rack3-nic-0",
      "dst": "rack3-pcie-sw0",
      "type": "pcie"
    },
    {
      "src": "rack3-gpu1",
      "dst": "rack3-pcie-sw0",
      "type": "pcie"
    },
    {
      "src": "rack3-nic-1",
      "dst": "rack3-pcie-sw0",
      "type": "pcie"
    },
    {
      "src": "rack3-gpu2",
      "dst": "rack3-pcie-sw1",
      "type": "pcie"
    },
    {
      "src": "rack3-nic-2",
      "dst": "rack3-pcie-sw1",
      "type": "pcie"
    },
    {
      "src": "rack3-gpu3",
      "dst": "rack3-pcie-sw1",
      "type": "pcie"
    },
    {
      "src": "rack3-nic-3",
      "dst": "rack3-pcie-sw1",
      "type": "pcie"
    },
    {
      "src": "rack3-gpu4",
      "dst": "rack3-pcie-sw2",
      "type": "pcie"
    },
    {
      "src": "rack3-nic-4",
      "dst": "rack3-pcie-sw2",
      "type": "pcie"
    },
    {
      "src": "rack3-gpu5",
      "dst": "rack3-pcie-sw2",
      "type": "pcie"
    },
    {
      "src": "rack3-nic-5",
      "dst": "rack3-pcie-sw2",
      "type": "pcie"
    },
    {
      "src": "rack3-gpu6",
      "dst": "rack3-pcie-sw3",
      "type": "pcie"
    },
    {
      "src": "rack3-nic-6",
      "dst": "rack3-pcie-sw3",
      "type": "pcie"
    },
    {
      "src": "rack3-gpu7",
      "dst": "rack3-pcie-sw3",
      "type": "pcie"
    },
    {
      "src": "rack3-nic-7",
      "dst": "rack3-pcie-sw3",
      "type": "pcie"
    },
    {
      "src": "rack0-sw",
      "dst": "spine-0",
      "type": "eth"
    },
    {
      "src": "rack0-sw",
      "dst": "spine-1",
      "type": "eth"
    },
    {
      "src": "rack0-sw",
      "dst": "spine-2",
      "type": "eth"
    },
    {
      "src": "rack0-sw",
      "dst": "spine-3",
      "type": "eth"
    },
    {
      "src": "rack1-sw",
      "dst": "spine-0",
      "type": "eth"
    },
    {
      "src": "rack1-sw",
      "dst": "spine-1",
      "type": "eth"
    },
    {
      "src": "rack1-sw",
      "dst": "spine-2",
      "type": "eth"
    },
    {
      "src": "rack1-sw",
      "dst": "spine-3",
      "type": "eth"
    },
    {
      "src": "rack2-sw",
      "dst": "spine-0",
      "type": "eth"
    },
    {
      "src": "rack2-sw",
      "dst": "spine-1",
      "type": "eth"
    },
    {
      "src": "rack2-sw",
      "dst": "spine-2",
      "type": "eth"
    },
    {
      "src": "rack2-sw",
      "dst": "spine-3",
      "type": "eth"
    },
    {
      "src": "rack3-sw",
      "dst": "spine-0",
      "type": "eth"
    },
    {
      "src": "rack3-sw",
      "dst": "spine-1",
      "type": "eth"
    },
    {
      "src": "rack3-sw",
      "dst": "spine-2",
      "type": "eth"
    },
    {
      "src": "rack3-sw",
      "dst": "spine-3",
      "type": "eth"
    }
  ]
};

export const network: Record<string, NetworkData> = {
  "naive": {
    "mode": "naive",
    "seq_len": 50000,
    "ep": 16,
    "gpus_per_cluster": 8,
    "n_completed": 50000,
    "sim_end_us": 159846.8,
    "n_bins": 60,
    "canon": {
      "dispatch": [
        0.0,
        59620.696
      ],
      "compute": [
        59620.696,
        97988.254
      ],
      "gather": [
        98236.358,
        159846.803
      ]
    },
    "p50_us": 143186.68,
    "p99_us": 159846.8,
    "e2e_us": 159846.8,
    "throughput_gbps": {
      "nv": [
        405.5225,
        303.9717,
        0.0,
        0.0,
        0.0,
        0.0,
        0.0,
        0.0,
        0.0,
        0.0,
        0.0,
        0.0,
        0.0,
        0.0,
        0.0,
        0.0,
        0.0,
        0.0,
        0.0,
        0.0,
        0.0,
        0.0,
        0.0,
        0.0,
        0.0,
        0.0,
        0.0,
        0.0,
        0.0,
        0.0,
        0.0,
        0.0,
        0.0,
        0.0,
        0.0,
        0.0,
        0.0,
        443.6721,
        265.8221,
        0.0,
        0.0,
        0.0,
        0.0,
        0.0,
        0.0,
        0.0,
        0.0,
        0.0,
        0.0,
        0.0,
        0.0,
        0.0,
        0.0,
        0.0,
        0.0,
        0.0,
        0.0,
        0.0,
        0.0,
        0.0
      ],
      "pcie": [
        0.0,
        0.0,
        0.0,
        0.0,
        0.0,
        0.0,
        0.0,
        4.2972,
        24.1081,
        25.7365,
        44.0651,
        41.5553,
        71.5481,
        77.6432,
        91.8011,
        103.492,
        80.2187,
        73.3991,
        52.2042,
        44.812,
        33.5024,
        25.0453,
        10.8548,
        0.0,
        0.0,
        0.0,
        0.0,
        0.0,
        0.0,
        0.0,
        0.0,
        0.0,
        0.0,
        0.0,
        0.0,
        0.0,
        0.0,
        0.0,
        0.0,
        0.0,
        0.0,
        0.0,
        0.0,
        0.0,
        2.4149,
        28.9948,
        31.7219,
        50.3514,
        52.2451,
        62.8589,
        72.3286,
        87.5306,
        102.2497,
        88.4559,
        69.1207,
        47.1622,
        39.703,
        37.1329,
        17.0479,
        14.9646
      ],
      "eth": [
        0.0,
        0.0,
        0.0,
        0.0,
        0.0,
        0.0,
        0.0,
        4.2972,
        24.1081,
        25.7365,
        44.0651,
        41.5553,
        71.5481,
        77.6432,
        91.8011,
        103.492,
        80.2187,
        73.3991,
        52.2042,
        44.812,
        33.5024,
        25.0453,
        10.8548,
        0.0,
        0.0,
        0.0,
        0.0,
        0.0,
        0.0,
        0.0,
        0.0,
        0.0,
        0.0,
        0.0,
        0.0,
        0.0,
        0.0,
        0.0,
        0.0,
        0.0,
        0.0,
        0.0,
        0.0,
        0.0,
        2.4149,
        28.9948,
        31.7219,
        50.3514,
        52.2451,
        62.8589,
        72.3286,
        87.5306,
        102.2497,
        88.4559,
        69.1207,
        47.1622,
        39.703,
        37.1329,
        17.0479,
        14.9646
      ]
    },
    "total_gb": {
      "nv": 3.7803,
      "pcie": 4.2854,
      "eth": 4.2854
    },
    "link_caps_gbps": {
      "nv": 400.0,
      "pcie": 64.0,
      "eth": 35.0
    }
  },
  "comet": {
    "mode": "comet",
    "seq_len": 50000,
    "ep": 16,
    "gpus_per_cluster": 8,
    "n_completed": 50000,
    "sim_end_us": 111016.32,
    "n_bins": 60,
    "canon": {
      "dispatch": [
        0.0,
        57424.29
      ],
      "compute": [
        1589.454,
        63280.908
      ],
      "gather": [
        43620.435,
        111016.318
      ]
    },
    "p50_us": 97191.36,
    "p99_us": 111016.32,
    "e2e_us": 111016.32,
    "throughput_gbps": {
      "nv": [
        318.2399,
        499.6049,
        203.7201,
        0.0,
        0.0,
        0.0,
        0.0,
        0.0,
        0.0,
        0.0,
        0.0,
        0.0,
        0.0,
        0.0,
        0.0,
        0.0,
        0.0,
        0.0,
        0.0,
        0.0,
        0.0,
        0.0,
        0.0,
        0.0,
        27.0639,
        55.3275,
        87.0122,
        114.2226,
        87.8536,
        104.3102,
        76.82,
        91.7283,
        71.1518,
        88.4908,
        115.3084,
        87.5111,
        14.7646,
        0.0,
        0.0,
        0.0,
        0.0,
        0.0,
        0.0,
        0.0,
        0.0,
        0.0,
        0.0,
        0.0,
        0.0,
        0.0,
        0.0,
        0.0,
        0.0,
        0.0,
        0.0,
        0.0,
        0.0,
        0.0,
        0.0,
        0.0
      ],
      "pcie": [
        0.0,
        0.0,
        0.0,
        0.0,
        0.0,
        0.0,
        0.0,
        0.0,
        0.0,
        0.0,
        18.2079,
        26.847,
        25.9082,
        36.146,
        48.2283,
        48.5751,
        65.1782,
        93.9172,
        57.1813,
        86.0529,
        116.2008,
        82.501,
        71.9686,
        96.6299,
        66.5441,
        39.4838,
        66.7214,
        42.5631,
        14.1562,
        36.4328,
        17.3573,
        1.2458,
        0.0,
        8.8715,
        2.5074,
        15.7935,
        27.5443,
        17.8748,
        12.7728,
        17.0904,
        35.3146,
        59.9552,
        51.3675,
        52.5509,
        71.4601,
        77.2076,
        68.3919,
        54.5699,
        89.1656,
        53.5839,
        55.2966,
        62.5416,
        87.4904,
        64.5253,
        58.6091,
        41.2882,
        17.5261,
        42.4927,
        2.6242,
        9.6308
      ],
      "eth": [
        0.0,
        0.0,
        0.0,
        0.0,
        0.0,
        0.0,
        0.0,
        0.0,
        0.0,
        0.0,
        18.2079,
        26.847,
        25.9082,
        36.146,
        48.2283,
        48.5751,
        65.1782,
        93.9172,
        57.1813,
        86.0529,
        116.2008,
        82.501,
        71.9686,
        96.6299,
        66.5441,
        39.4838,
        66.7214,
        42.5631,
        14.1562,
        36.4328,
        17.3573,
        1.2458,
        0.0,
        8.8715,
        2.5074,
        15.7935,
        27.5443,
        17.8748,
        12.7728,
        17.0904,
        35.3146,
        59.9552,
        51.3675,
        52.5509,
        71.4601,
        77.2076,
        68.3919,
        54.5699,
        89.1656,
        53.5839,
        55.2966,
        62.5416,
        87.4904,
        64.5253,
        58.6091,
        41.2882,
        17.5261,
        42.4927,
        2.6242,
        9.6308
      ]
    },
    "total_gb": {
      "nv": 3.7803,
      "pcie": 4.2854,
      "eth": 4.2854
    },
    "link_caps_gbps": {
      "nv": 400.0,
      "pcie": 64.0,
      "eth": 35.0
    }
  },
  "floreana": {
    "mode": "floreana",
    "seq_len": 50000,
    "ep": 16,
    "gpus_per_cluster": 8,
    "n_completed": 50000,
    "sim_end_us": 90143.18,
    "n_bins": 60,
    "canon": {
      "dispatch": [
        0.0,
        53832.671
      ],
      "compute": [
        1139.468,
        56836.747
      ],
      "gather": [
        8591.89,
        90143.184
      ]
    },
    "p50_us": 68989.38,
    "p99_us": 90143.18,
    "e2e_us": 90143.18,
    "throughput_gbps": {
      "nv": [
        271.9636,
        513.9925,
        379.325,
        92.3269,
        0.0,
        0.0,
        0.0,
        0.0,
        0.0,
        0.0,
        0.0,
        0.0,
        0.0,
        0.0,
        0.0,
        0.0,
        0.0,
        0.0,
        0.0,
        10.4582,
        32.7391,
        32.1917,
        1.1581,
        0.0,
        11.0403,
        42.3477,
        56.3833,
        51.1222,
        53.5764,
        99.5222,
        131.5922,
        76.6383,
        67.4416,
        46.9509,
        127.2776,
        60.6499,
        82.8549,
        92.004,
        78.9025,
        22.6599,
        34.3517,
        13.7622,
        31.9829,
        0.0,
        0.0,
        0.0,
        0.0,
        0.0,
        0.0,
        0.0,
        0.0,
        0.0,
        0.0,
        0.0,
        0.0,
        0.0,
        0.0,
        0.0,
        0.0,
        0.0
      ],
      "pcie": [
        0.0,
        0.0,
        0.0,
        0.0,
        0.0,
        4.1508,
        1.8798,
        5.2196,
        15.9511,
        28.9734,
        23.1874,
        33.5339,
        36.5436,
        60.661,
        47.8137,
        43.2184,
        66.4484,
        79.5413,
        55.3292,
        82.616,
        71.3358,
        77.4862,
        78.2348,
        85.4048,
        67.9501,
        92.0933,
        92.6309,
        68.8635,
        56.8905,
        55.3732,
        38.932,
        23.7661,
        49.9375,
        13.4414,
        29.8608,
        28.3405,
        52.5026,
        31.7066,
        34.2651,
        55.4602,
        40.7947,
        57.7562,
        44.1478,
        36.9951,
        52.395,
        36.327,
        50.7687,
        26.2415,
        42.1967,
        21.4299,
        35.077,
        30.0101,
        26.4898,
        11.383,
        9.0665,
        18.7012,
        9.7807,
        9.5994,
        9.399,
        9.6567
      ],
      "eth": [
        0.0,
        0.0,
        0.0,
        0.0,
        0.0,
        2.6527,
        0.4962,
        3.8741,
        11.9529,
        25.2042,
        12.1567,
        25.7285,
        26.6198,
        53.1307,
        38.3595,
        33.2463,
        58.5188,
        69.5698,
        44.1172,
        76.8335,
        61.6982,
        71.1503,
        70.1049,
        81.7788,
        67.3675,
        89.069,
        91.6194,
        64.8271,
        54.0947,
        54.2377,
        38.932,
        21.8767,
        48.9737,
        13.4414,
        29.8608,
        28.3405,
        52.5026,
        31.7066,
        34.2651,
        55.4602,
        40.7947,
        57.7562,
        44.1478,
        36.9951,
        52.395,
        36.327,
        50.7687,
        26.2415,
        42.1967,
        21.4299,
        35.077,
        30.0101,
        26.4898,
        11.383,
        9.0665,
        18.7012,
        9.7807,
        9.5994,
        9.399,
        9.6567
      ]
    },
    "total_gb": {
      "nv": 3.7788,
      "pcie": 3.4071,
      "eth": 3.188
    },
    "link_caps_gbps": {
      "nv": 400.0,
      "pcie": 64.0,
      "eth": 35.0
    }
  },
  "archipelago": {
    "mode": "archipelago",
    "seq_len": 50000,
    "ep": 16,
    "gpus_per_cluster": 8,
    "n_completed": 50000,
    "sim_end_us": 57817.43,
    "n_bins": 60,
    "canon": {
      "dispatch": [
        0.0,
        42013.974
      ],
      "compute": [
        1824.025,
        47804.618
      ],
      "gather": [
        1831.892,
        57817.43
      ]
    },
    "p50_us": 43661.35,
    "p99_us": 57046.89,
    "e2e_us": 57817.43,
    "throughput_gbps": {
      "nv": [
        0.0,
        244.1942,
        68.3753,
        13.6924,
        70.518,
        92.8674,
        216.5161,
        400.6027,
        376.2831,
        278.9238,
        108.94,
        70.81,
        19.0143,
        0.0,
        0.0,
        0.0,
        0.0,
        0.0,
        0.0,
        0.0,
        0.0,
        0.0,
        0.0,
        22.3901,
        27.2699,
        21.8023,
        23.7371,
        12.3721,
        2.0584,
        9.4118,
        12.1303,
        5.9657,
        8.1978,
        14.4155,
        26.5706,
        7.3784,
        22.5843,
        20.0318,
        25.3138,
        25.9356,
        1.2153,
        2.6126,
        21.9794,
        1.6365,
        3.1391,
        17.5997,
        1.2497,
        37.0442,
        3.9425,
        1.6514,
        1.5175,
        22.2822,
        5.6265,
        2.4407,
        0.0,
        0.0,
        0.0,
        0.0,
        0.0,
        0.0
      ],
      "pcie": [
        0.0,
        0.0,
        0.0,
        0.0,
        0.0,
        0.5653,
        3.7342,
        0.6992,
        10.5182,
        11.4852,
        7.0667,
        9.2238,
        12.9283,
        21.7951,
        19.3209,
        35.576,
        34.3066,
        30.3048,
        32.553,
        44.243,
        42.0347,
        41.8131,
        61.2111,
        57.0476,
        40.3243,
        53.1735,
        61.2777,
        66.1851,
        59.9258,
        59.2626,
        50.5769,
        58.715,
        63.3459,
        58.5052,
        68.7662,
        62.8417,
        73.056,
        70.9766,
        67.5819,
        69.9023,
        88.8814,
        84.8237,
        94.7574,
        95.105,
        103.4651,
        97.3691,
        83.2338,
        69.5434,
        55.6733,
        30.6148,
        22.2372,
        10.3694,
        7.492,
        9.3787,
        1.4728,
        0.0,
        0.0,
        0.0,
        4.2995,
        7.632
      ],
      "eth": [
        0.0,
        0.0,
        0.0,
        0.0,
        0.0,
        0.0,
        0.0,
        0.6992,
        7.5725,
        8.0337,
        1.3389,
        9.2238,
        9.3577,
        5.5789,
        15.3339,
        19.9344,
        16.5489,
        10.7711,
        15.4889,
        29.6485,
        26.2731,
        22.0182,
        41.8857,
        28.7958,
        27.149,
        31.6105,
        33.3521,
        45.8741,
        30.1263,
        33.6373,
        33.9563,
        35.0305,
        47.948,
        37.6623,
        44.9479,
        52.0359,
        60.579,
        61.2916,
        62.8063,
        67.8344,
        83.8529,
        75.7424,
        89.6309,
        88.6334,
        98.3002,
        93.8011,
        81.761,
        63.0123,
        52.7573,
        30.6148,
        22.2372,
        10.3694,
        7.492,
        9.3787,
        1.4728,
        0.0,
        0.0,
        0.0,
        4.2995,
        7.632
      ]
    },
    "total_gb": {
      "nv": 2.2859,
      "pcie": 2.2425,
      "eth": 1.73
    },
    "link_caps_gbps": {
      "nv": 400.0,
      "pcie": 64.0,
      "eth": 35.0
    }
  }
};

export const roofline: RooflineData = {
  "ep": 16,
  "bw_by_link": {
    "nv": 400000000000.0,
    "pcie": 64000000000.0,
    "eth": 50000000000.0
  },
  "ridges": {
    "naive": {
      "nv": 1483.5,
      "pcie": 9271.875,
      "eth": 11868.0
    },
    "comet": {
      "nv": 1483.5,
      "pcie": 9271.875,
      "eth": 11868.0
    },
    "floreana": {
      "nv": 1497.5,
      "pcie": 9359.375,
      "eth": 11980.0
    },
    "archipelago": {
      "nv": 3228.25,
      "pcie": 20176.5625,
      "eth": 25826.0
    }
  },
  "peak_flops_per_gpu": {
    "naive": 593400000000000.0,
    "comet": 593400000000000.0,
    "floreana": 599000000000000.0,
    "archipelago": 1291300000000000.0
  },
  "results": [
    {
      "mode": "naive",
      "seq_len": 256,
      "cluster": 4,
      "ep": 16,
      "n_completed": 256,
      "panel": {
        "nv": {
          "ai": 8670.46699041869,
          "gflops": 35650.10062809356,
          "efficiency": 0.0037548555599188536
        },
        "pcie": {
          "ai": 1005.300219138057,
          "gflops": 35650.10062809356,
          "efficiency": 0.0346309995082589
        },
        "eth": {
          "ai": 1005.300219138057,
          "gflops": 35650.10062809356,
          "efficiency": 0.0443276793705714
        }
      }
    },
    {
      "mode": "naive",
      "seq_len": 256,
      "cluster": 8,
      "ep": 16,
      "n_completed": 256,
      "panel": {
        "nv": {
          "ai": 3535.8501311352566,
          "gflops": 35598.647713711,
          "efficiency": 0.003749436269138755
        },
        "pcie": {
          "ai": 1515.7004405286343,
          "gflops": 35598.647713711,
          "efficiency": 0.02293613136102017
        },
        "eth": {
          "ai": 1515.7004405286343,
          "gflops": 35598.647713711,
          "efficiency": 0.029358248142105824
        }
      }
    },
    {
      "mode": "naive",
      "seq_len": 256,
      "cluster": 16,
      "ep": 16,
      "n_completed": 256,
      "panel": {
        "nv": {
          "ai": 1632.125707226683,
          "gflops": 43740.65523892121,
          "efficiency": 0.004606995201268243
        }
      }
    },
    {
      "mode": "naive",
      "seq_len": 1024,
      "cluster": 4,
      "ep": 16,
      "n_completed": 1024,
      "panel": {
        "nv": {
          "ai": 8141.770204899091,
          "gflops": 94800.31234356752,
          "efficiency": 0.009984866062475515
        },
        "pcie": {
          "ai": 1020.8036591773032,
          "gflops": 94800.31234356752,
          "efficiency": 0.09069171058578193
        },
        "eth": {
          "ai": 1020.8036591773032,
          "gflops": 94800.31234356752,
          "efficiency": 0.11608538954980087
        }
      }
    },
    {
      "mode": "naive",
      "seq_len": 1024,
      "cluster": 8,
      "ep": 16,
      "n_completed": 1024,
      "panel": {
        "nv": {
          "ai": 3489.760192289914,
          "gflops": 96238.87778087571,
          "efficiency": 0.010136383318680034
        },
        "pcie": {
          "ai": 1533.3616823731488,
          "gflops": 96238.87778087571,
          "efficiency": 0.06129230967701675
        },
        "eth": {
          "ai": 1533.3616823731488,
          "gflops": 96238.87778087571,
          "efficiency": 0.07845415638658143
        }
      }
    },
    {
      "mode": "naive",
      "seq_len": 1024,
      "cluster": 16,
      "ep": 16,
      "n_completed": 1024,
      "panel": {
        "nv": {
          "ai": 1632.2971034636125,
          "gflops": 162776.85893087453,
          "efficiency": 0.017144512442163227
        }
      }
    },
    {
      "mode": "naive",
      "seq_len": 4096,
      "cluster": 4,
      "ep": 16,
      "n_completed": 4096,
      "panel": {
        "nv": {
          "ai": 8098.663009248263,
          "gflops": 142743.47524223206,
          "efficiency": 0.015034491409908163
        },
        "pcie": {
          "ai": 1023.4764582849175,
          "gflops": 142743.47524223206,
          "efficiency": 0.1362004215268783
        },
        "eth": {
          "ai": 1023.4764582849175,
          "gflops": 142743.47524223206,
          "efficiency": 0.17433653955440423
        }
      }
    },
    {
      "mode": "naive",
      "seq_len": 4096,
      "cluster": 8,
      "ep": 16,
      "n_completed": 4096,
      "panel": {
        "nv": {
          "ai": 3493.231787160208,
          "gflops": 143417.59638539833,
          "efficiency": 0.01510549338403673
        },
        "pcie": {
          "ai": 1534.9649836187466,
          "gflops": 143417.59638539833,
          "efficiency": 0.09124393583228646
        },
        "eth": {
          "ai": 1534.9649836187466,
          "gflops": 143417.59638539833,
          "efficiency": 0.11679223786532666
        }
      }
    },
    {
      "mode": "naive",
      "seq_len": 4096,
      "cluster": 16,
      "ep": 16,
      "n_completed": 4096,
      "panel": {
        "nv": {
          "ai": 1633.9650533104746,
          "gflops": 343792.40151206794,
          "efficiency": 0.03621001869650193
        }
      }
    },
    {
      "mode": "naive",
      "seq_len": 16384,
      "cluster": 4,
      "ep": 16,
      "n_completed": 16384,
      "panel": {
        "nv": {
          "ai": 8160.518275888026,
          "gflops": 162912.09970388294,
          "efficiency": 0.01715875670962704
        },
        "pcie": {
          "ai": 1024.9671824968145,
          "gflops": 162912.09970388294,
          "efficiency": 0.15521847926830343
        },
        "eth": {
          "ai": 1024.9671824968145,
          "gflops": 162912.09970388294,
          "efficiency": 0.1986796534634284
        }
      }
    },
    {
      "mode": "naive",
      "seq_len": 16384,
      "cluster": 8,
      "ep": 16,
      "n_completed": 16384,
      "panel": {
        "nv": {
          "ai": 3515.495916882512,
          "gflops": 158812.75130699272,
          "efficiency": 0.016726991838030073
        },
        "pcie": {
          "ai": 1534.1807287675051,
          "gflops": 158812.75130699272,
          "efficiency": 0.10109016137416103
        },
        "eth": {
          "ai": 1534.1807287675051,
          "gflops": 158812.75130699272,
          "efficiency": 0.12939540655892615
        }
      }
    },
    {
      "mode": "naive",
      "seq_len": 16384,
      "cluster": 16,
      "ep": 16,
      "n_completed": 16384,
      "panel": {
        "nv": {
          "ai": 1638.3726988676326,
          "gflops": 448116.46053022484,
          "efficiency": 0.047197975704649564
        }
      }
    },
    {
      "mode": "naive",
      "seq_len": 65536,
      "cluster": 4,
      "ep": 16,
      "n_completed": 65536,
      "panel": {
        "nv": {
          "ai": 8145.47604513107,
          "gflops": 169692.73716826685,
          "efficiency": 0.017872929007443004
        },
        "pcie": {
          "ai": 1025.1769464222843,
          "gflops": 169692.73716826685,
          "efficiency": 0.16164581560208544
        },
        "eth": {
          "ai": 1025.1769464222843,
          "gflops": 169692.73716826685,
          "efficiency": 0.20690664397066935
        }
      }
    },
    {
      "mode": "naive",
      "seq_len": 65536,
      "cluster": 8,
      "ep": 16,
      "n_completed": 65536,
      "panel": {
        "nv": {
          "ai": 3500.332664442181,
          "gflops": 166658.92138567168,
          "efficiency": 0.017553391618814425
        },
        "pcie": {
          "ai": 1539.4037312492671,
          "gflops": 166658.92138567168,
          "efficiency": 0.10572460597040174
        },
        "eth": {
          "ai": 1539.4037312492671,
          "gflops": 166658.92138567168,
          "efficiency": 0.13532749564211422
        }
      }
    },
    {
      "mode": "naive",
      "seq_len": 65536,
      "cluster": 16,
      "ep": 16,
      "n_completed": 65536,
      "panel": {
        "nv": {
          "ai": 1638.0332567142289,
          "gflops": 489377.9701233512,
          "efficiency": 0.051543854284983905
        }
      }
    },
    {
      "mode": "naive",
      "seq_len": 262144,
      "cluster": 4,
      "ep": 16,
      "n_completed": 262144,
      "panel": {
        "nv": {
          "ai": 8178.713053916049,
          "gflops": 169676.29308028205,
          "efficiency": 0.017871197029857816
        },
        "pcie": {
          "ai": 1024.3365441027627,
          "gflops": 169676.29308028205,
          "efficiency": 0.16176275845586718
        },
        "eth": {
          "ai": 1024.3365441027627,
          "gflops": 169676.29308028205,
          "efficiency": 0.20705633082351002
        }
      }
    },
    {
      "mode": "naive",
      "seq_len": 262144,
      "cluster": 8,
      "ep": 16,
      "n_completed": 262144,
      "panel": {
        "nv": {
          "ai": 3508.260849961282,
          "gflops": 170387.6252144078,
          "efficiency": 0.017946118260701867
        },
        "pcie": {
          "ai": 1536.816281783319,
          "gflops": 170387.6252144078,
          "efficiency": 0.1082719953066619
        },
        "eth": {
          "ai": 1536.816281783319,
          "gflops": 170387.6252144078,
          "efficiency": 0.13858815399252725
        }
      }
    },
    {
      "mode": "naive",
      "seq_len": 262144,
      "cluster": 16,
      "ep": 16,
      "n_completed": 262144,
      "panel": {
        "nv": {
          "ai": 1638.2982999639892,
          "gflops": 500227.93290578004,
          "efficiency": 0.05268662926628118
        }
      }
    },
    {
      "mode": "comet",
      "seq_len": 256,
      "cluster": 4,
      "ep": 16,
      "n_completed": 256,
      "panel": {
        "nv": {
          "ai": 8670.46699041869,
          "gflops": 36135.322456248476,
          "efficiency": 0.0038059616675354393
        },
        "pcie": {
          "ai": 1005.300219138057,
          "gflops": 36135.322456248476,
          "efficiency": 0.035102350685287206
        },
        "eth": {
          "ai": 1005.300219138057,
          "gflops": 36135.322456248476,
          "efficiency": 0.04493100887716763
        }
      }
    },
    {
      "mode": "comet",
      "seq_len": 256,
      "cluster": 8,
      "ep": 16,
      "n_completed": 256,
      "panel": {
        "nv": {
          "ai": 3535.8501311352566,
          "gflops": 36498.231209299294,
          "efficiency": 0.003844185120628928
        },
        "pcie": {
          "ai": 1515.7004405286343,
          "gflops": 36498.231209299294,
          "efficiency": 0.023515731052304846
        },
        "eth": {
          "ai": 1515.7004405286343,
          "gflops": 36498.231209299294,
          "efficiency": 0.03010013574695021
        }
      }
    },
    {
      "mode": "comet",
      "seq_len": 256,
      "cluster": 16,
      "ep": 16,
      "n_completed": 256,
      "panel": {
        "nv": {
          "ai": 1632.125707226683,
          "gflops": 43741.23291404916,
          "efficiency": 0.004607056045042252
        }
      }
    },
    {
      "mode": "comet",
      "seq_len": 1024,
      "cluster": 4,
      "ep": 16,
      "n_completed": 1024,
      "panel": {
        "nv": {
          "ai": 8141.770204899091,
          "gflops": 96049.32118692494,
          "efficiency": 0.01011641822410315
        },
        "pcie": {
          "ai": 1020.8036591773032,
          "gflops": 96049.32118692494,
          "efficiency": 0.0918865879626658
        },
        "eth": {
          "ai": 1020.8036591773032,
          "gflops": 96049.32118692494,
          "efficiency": 0.11761483259221221
        }
      }
    },
    {
      "mode": "comet",
      "seq_len": 1024,
      "cluster": 8,
      "ep": 16,
      "n_completed": 1024,
      "panel": {
        "nv": {
          "ai": 3489.760192289914,
          "gflops": 102036.64377527132,
          "efficiency": 0.01074703443875035
        },
        "pcie": {
          "ai": 1533.3616823731488,
          "gflops": 102036.64377527132,
          "efficiency": 0.06498477240057927
        },
        "eth": {
          "ai": 1533.3616823731488,
          "gflops": 102036.64377527132,
          "efficiency": 0.08318050867274146
        }
      }
    },
    {
      "mode": "comet",
      "seq_len": 1024,
      "cluster": 16,
      "ep": 16,
      "n_completed": 1024,
      "panel": {
        "nv": {
          "ai": 1632.2971034636125,
          "gflops": 162871.25760269936,
          "efficiency": 0.017154455005339922
        }
      }
    },
    {
      "mode": "comet",
      "seq_len": 4096,
      "cluster": 4,
      "ep": 16,
      "n_completed": 4096,
      "panel": {
        "nv": {
          "ai": 8098.663009248263,
          "gflops": 151327.23950542838,
          "efficiency": 0.015938578478411316
        },
        "pcie": {
          "ai": 1023.4764582849175,
          "gflops": 151327.23950542838,
          "efficiency": 0.14439072450885868
        },
        "eth": {
          "ai": 1023.4764582849175,
          "gflops": 151327.23950542838,
          "efficiency": 0.18482012737133907
        }
      }
    },
    {
      "mode": "comet",
      "seq_len": 4096,
      "cluster": 8,
      "ep": 16,
      "n_completed": 4096,
      "panel": {
        "nv": {
          "ai": 3493.231787160208,
          "gflops": 160794.41378535528,
          "efficiency": 0.016935710922791884
        },
        "pcie": {
          "ai": 1534.9649836187466,
          "gflops": 160794.41378535528,
          "efficiency": 0.10229926831429463
        },
        "eth": {
          "ai": 1534.9649836187466,
          "gflops": 160794.41378535528,
          "efficiency": 0.13094306344229711
        }
      }
    },
    {
      "mode": "comet",
      "seq_len": 4096,
      "cluster": 16,
      "ep": 16,
      "n_completed": 4096,
      "panel": {
        "nv": {
          "ai": 1633.9650533104746,
          "gflops": 344105.8193733768,
          "efficiency": 0.03624302950932937
        }
      }
    },
    {
      "mode": "comet",
      "seq_len": 16384,
      "cluster": 4,
      "ep": 16,
      "n_completed": 16384,
      "panel": {
        "nv": {
          "ai": 8160.518275888026,
          "gflops": 197384.28799135052,
          "efficiency": 0.020789548364441197
        },
        "pcie": {
          "ai": 1024.9671824968145,
          "gflops": 197384.28799135052,
          "efficiency": 0.1880626980387758
        },
        "eth": {
          "ai": 1024.9671824968145,
          "gflops": 197384.28799135052,
          "efficiency": 0.24072025348963302
        }
      }
    },
    {
      "mode": "comet",
      "seq_len": 16384,
      "cluster": 8,
      "ep": 16,
      "n_completed": 16384,
      "panel": {
        "nv": {
          "ai": 3515.495916882512,
          "gflops": 213549.26101048052,
          "efficiency": 0.02249212809766605
        },
        "pcie": {
          "ai": 1534.1807287675051,
          "gflops": 213549.26101048052,
          "efficiency": 0.13593196439971114
        },
        "eth": {
          "ai": 1534.1807287675051,
          "gflops": 213549.26101048052,
          "efficiency": 0.17399291443163026
        }
      }
    },
    {
      "mode": "comet",
      "seq_len": 16384,
      "cluster": 16,
      "ep": 16,
      "n_completed": 16384,
      "panel": {
        "nv": {
          "ai": 1638.3726988676326,
          "gflops": 670404.3475636754,
          "efficiency": 0.0706105017235081
        }
      }
    },
    {
      "mode": "comet",
      "seq_len": 65536,
      "cluster": 4,
      "ep": 16,
      "n_completed": 65536,
      "panel": {
        "nv": {
          "ai": 8145.47604513107,
          "gflops": 218181.56556750307,
          "efficiency": 0.02298002670705922
        },
        "pcie": {
          "ai": 1025.1769464222843,
          "gflops": 218181.56556750307,
          "efficiency": 0.2078352774787711
        },
        "eth": {
          "ai": 1025.1769464222843,
          "gflops": 218181.56556750307,
          "efficiency": 0.266029155172827
        }
      }
    },
    {
      "mode": "comet",
      "seq_len": 65536,
      "cluster": 8,
      "ep": 16,
      "n_completed": 65536,
      "panel": {
        "nv": {
          "ai": 3500.332664442181,
          "gflops": 240909.83745654704,
          "efficiency": 0.02537388749752981
        },
        "pcie": {
          "ai": 1539.4037312492671,
          "gflops": 240909.83745654704,
          "efficiency": 0.15282768799724594
        },
        "eth": {
          "ai": 1539.4037312492671,
          "gflops": 240909.83745654704,
          "efficiency": 0.19561944063647477
        }
      }
    },
    {
      "mode": "comet",
      "seq_len": 65536,
      "cluster": 16,
      "ep": 16,
      "n_completed": 65536,
      "panel": {
        "nv": {
          "ai": 1638.0332567142289,
          "gflops": 884288.9350033517,
          "efficiency": 0.09313794815926774
        }
      }
    },
    {
      "mode": "comet",
      "seq_len": 262144,
      "cluster": 4,
      "ep": 16,
      "n_completed": 262144,
      "panel": {
        "nv": {
          "ai": 8178.713053916049,
          "gflops": 222854.13506215636,
          "efficiency": 0.023472166230847274
        },
        "pcie": {
          "ai": 1024.3365441027627,
          "gflops": 222854.13506215636,
          "efficiency": 0.21246043844141527
        },
        "eth": {
          "ai": 1024.3365441027627,
          "gflops": 222854.13506215636,
          "efficiency": 0.27194936120501156
        }
      }
    },
    {
      "mode": "comet",
      "seq_len": 262144,
      "cluster": 8,
      "ep": 16,
      "n_completed": 262144,
      "panel": {
        "nv": {
          "ai": 3508.260849961282,
          "gflops": 242206.3124257306,
          "efficiency": 0.02551043904045865
        },
        "pcie": {
          "ai": 1536.816281783319,
          "gflops": 242206.3124257306,
          "efficiency": 0.15390883398488203
        },
        "eth": {
          "ai": 1536.816281783319,
          "gflops": 242206.3124257306,
          "efficiency": 0.19700330750064904
        }
      }
    },
    {
      "mode": "comet",
      "seq_len": 262144,
      "cluster": 16,
      "ep": 16,
      "n_completed": 262144,
      "panel": {
        "nv": {
          "ai": 1638.2982999639892,
          "gflops": 966549.619972665,
          "efficiency": 0.10180207490443471
        }
      }
    },
    {
      "mode": "floreana",
      "seq_len": 256,
      "cluster": 4,
      "ep": 16,
      "n_completed": 256,
      "panel": {
        "nv": {
          "ai": 8449.768227168073,
          "gflops": 28419.79304763727,
          "efficiency": 0.0029653373380255916
        },
        "pcie": {
          "ai": 1028.976448598131,
          "gflops": 28419.79304763727,
          "efficiency": 0.02697214711366299
        },
        "eth": {
          "ai": 1355.8054381307472,
          "gflops": 28419.79304763727,
          "efficiency": 0.026201946319469448
        }
      }
    },
    {
      "mode": "floreana",
      "seq_len": 256,
      "cluster": 8,
      "ep": 16,
      "n_completed": 256,
      "panel": {
        "nv": {
          "ai": 3467.003673769287,
          "gflops": 30930.097359403888,
          "efficiency": 0.003227263914795898
        },
        "pcie": {
          "ai": 1599.9875993024607,
          "gflops": 30930.097359403888,
          "efficiency": 0.01887837956726119
        },
        "eth": {
          "ai": 2108.1741640539035,
          "gflops": 30930.097359403888,
          "efficiency": 0.018339386924706807
        }
      }
    },
    {
      "mode": "floreana",
      "seq_len": 256,
      "cluster": 16,
      "ep": 16,
      "n_completed": 256,
      "panel": {
        "nv": {
          "ai": 1631.5210669301061,
          "gflops": 43715.92778034632,
          "efficiency": 0.0045613447183166025
        }
      }
    },
    {
      "mode": "floreana",
      "seq_len": 1024,
      "cluster": 4,
      "ep": 16,
      "n_completed": 1024,
      "panel": {
        "nv": {
          "ai": 8141.017684392137,
          "gflops": 73134.63433400133,
          "efficiency": 0.0076309092585560645
        },
        "pcie": {
          "ai": 1025.0168818272095,
          "gflops": 73134.63433400133,
          "efficiency": 0.06967742932631793
        },
        "eth": {
          "ai": 1350.7136158530145,
          "gflops": 73134.63433400133,
          "efficiency": 0.06768147729063083
        }
      }
    },
    {
      "mode": "floreana",
      "seq_len": 1024,
      "cluster": 8,
      "ep": 16,
      "n_completed": 1024,
      "panel": {
        "nv": {
          "ai": 3485.571191135734,
          "gflops": 75945.43152465108,
          "efficiency": 0.00792418943287261
        },
        "pcie": {
          "ai": 1547.9493860717969,
          "gflops": 75945.43152465108,
          "efficiency": 0.04791207073087862
        },
        "eth": {
          "ai": 2039.806381130749,
          "gflops": 75945.43152465108,
          "efficiency": 0.04653960801573198
        }
      }
    },
    {
      "mode": "floreana",
      "seq_len": 1024,
      "cluster": 16,
      "ep": 16,
      "n_completed": 1024,
      "panel": {
        "nv": {
          "ai": 1632.1458696216137,
          "gflops": 162751.20028328782,
          "efficiency": 0.01698155261720449
        }
      }
    },
    {
      "mode": "floreana",
      "seq_len": 4096,
      "cluster": 4,
      "ep": 16,
      "n_completed": 4096,
      "panel": {
        "nv": {
          "ai": 8091.53314041615,
          "gflops": 145234.23503675265,
          "efficiency": 0.015153822520529284
        },
        "pcie": {
          "ai": 1028.3837663651789,
          "gflops": 145234.23503675265,
          "efficiency": 0.13791573952433905
        },
        "eth": {
          "ai": 1354.605760979892,
          "gflops": 145234.23503675265,
          "efficiency": 0.13401891459889906
        }
      }
    },
    {
      "mode": "floreana",
      "seq_len": 4096,
      "cluster": 8,
      "ep": 16,
      "n_completed": 4096,
      "panel": {
        "nv": {
          "ai": 3472.585069684007,
          "gflops": 149571.80325315584,
          "efficiency": 0.015606406850287547
        },
        "pcie": {
          "ai": 1553.5372567464283,
          "gflops": 149571.80325315584,
          "efficiency": 0.09402170014275445
        },
        "eth": {
          "ai": 2046.3649596668254,
          "gflops": 149571.80325315584,
          "efficiency": 0.09136432540209498
        }
      }
    },
    {
      "mode": "floreana",
      "seq_len": 4096,
      "cluster": 16,
      "ep": 16,
      "n_completed": 4096,
      "panel": {
        "nv": {
          "ai": 1633.927164910046,
          "gflops": 344105.8193733768,
          "efficiency": 0.03590419651224716
        }
      }
    },
    {
      "mode": "floreana",
      "seq_len": 16384,
      "cluster": 4,
      "ep": 16,
      "n_completed": 16384,
      "panel": {
        "nv": {
          "ai": 8177.264648199511,
          "gflops": 293921.62331264134,
          "efficiency": 0.03066794901008361
        },
        "pcie": {
          "ai": 1502.6588612037667,
          "gflops": 293921.62331264134,
          "efficiency": 0.1910166323687812
        },
        "eth": {
          "ai": 2341.270611901728,
          "gflops": 293921.62331264134,
          "efficiency": 0.15692420486257866
        }
      }
    },
    {
      "mode": "floreana",
      "seq_len": 16384,
      "cluster": 8,
      "ep": 16,
      "n_completed": 16384,
      "panel": {
        "nv": {
          "ai": 3513.593968516213,
          "gflops": 269436.4458790606,
          "efficiency": 0.028113151698566423
        },
        "pcie": {
          "ai": 2023.5300352071556,
          "gflops": 269436.4458790606,
          "efficiency": 0.13003094819486258
        },
        "eth": {
          "ai": 2605.9705842299522,
          "gflops": 269436.4458790606,
          "efficiency": 0.12923996893401107
        }
      }
    },
    {
      "mode": "floreana",
      "seq_len": 16384,
      "cluster": 16,
      "ep": 16,
      "n_completed": 16384,
      "panel": {
        "nv": {
          "ai": 1638.3631754308597,
          "gflops": 670404.3475636753,
          "efficiency": 0.06995037015480751
        }
      }
    },
    {
      "mode": "floreana",
      "seq_len": 65536,
      "cluster": 4,
      "ep": 16,
      "n_completed": 65536,
      "panel": {
        "nv": {
          "ai": 8200.651985301178,
          "gflops": 328956.3485398983,
          "efficiency": 0.03432349212645015
        },
        "pcie": {
          "ai": 1423.2531198875902,
          "gflops": 328956.3485398983,
          "efficiency": 0.2257127910925407
        },
        "eth": {
          "ai": 2162.8907810786345,
          "gflops": 328956.3485398983,
          "efficiency": 0.1901138232554718
        }
      }
    },
    {
      "mode": "floreana",
      "seq_len": 65536,
      "cluster": 8,
      "ep": 16,
      "n_completed": 65536,
      "panel": {
        "nv": {
          "ai": 3500.449312781994,
          "gflops": 323132.04628418025,
          "efficiency": 0.03371578112314068
        },
        "pcie": {
          "ai": 2084.4673544127304,
          "gflops": 323132.04628418025,
          "efficiency": 0.15138574287640932
        },
        "eth": {
          "ai": 2676.2382245765857,
          "gflops": 323132.04628418025,
          "efficiency": 0.1509264213275071
        }
      }
    },
    {
      "mode": "floreana",
      "seq_len": 65536,
      "cluster": 16,
      "ep": 16,
      "n_completed": 65536,
      "panel": {
        "nv": {
          "ai": 1638.0308768311022,
          "gflops": 884288.9350033517,
          "efficiency": 0.09226720941186892
        }
      }
    },
    {
      "mode": "floreana",
      "seq_len": 262144,
      "cluster": 4,
      "ep": 16,
      "n_completed": 262144,
      "panel": {
        "nv": {
          "ai": 8197.887164268386,
          "gflops": 347410.17080097867,
          "efficiency": 0.036248974415794936
        },
        "pcie": {
          "ai": 1475.7005708343522,
          "gflops": 347410.17080097867,
          "efficiency": 0.22990283505210735
        },
        "eth": {
          "ai": 2294.337283402627,
          "gflops": 347410.17080097867,
          "efficiency": 0.1892758822526687
        }
      }
    },
    {
      "mode": "floreana",
      "seq_len": 262144,
      "cluster": 8,
      "ep": 16,
      "n_completed": 262144,
      "panel": {
        "nv": {
          "ai": 3506.5028560231935,
          "gflops": 425625.2862516563,
          "efficiency": 0.044409983957810546
        },
        "pcie": {
          "ai": 2463.4951786742045,
          "gflops": 425625.2862516563,
          "efficiency": 0.1687235669074157
        },
        "eth": {
          "ai": 3116.9253103890414,
          "gflops": 425625.2862516563,
          "efficiency": 0.17069116351336774
        }
      }
    },
    {
      "mode": "floreana",
      "seq_len": 262144,
      "cluster": 16,
      "ep": 16,
      "n_completed": 262144,
      "panel": {
        "nv": {
          "ai": 1638.2977048000039,
          "gflops": 966549.619972665,
          "efficiency": 0.10085033597377556
        }
      }
    },
    {
      "mode": "archipelago",
      "seq_len": 256,
      "cluster": 4,
      "ep": 16,
      "n_completed": 256,
      "panel": {
        "nv": {
          "ai": 4224.884113584037,
          "gflops": 28419.79304763727,
          "efficiency": 0.0013755417528671335
        },
        "pcie": {
          "ai": 1028.976448598131,
          "gflops": 28419.79304763727,
          "efficiency": 0.02697214711366299
        },
        "eth": {
          "ai": 1355.8054381307472,
          "gflops": 28419.79304763727,
          "efficiency": 0.02620194631946944
        }
      }
    },
    {
      "mode": "archipelago",
      "seq_len": 256,
      "cluster": 8,
      "ep": 16,
      "n_completed": 256,
      "panel": {
        "nv": {
          "ai": 1733.5018368846436,
          "gflops": 30930.097359403888,
          "efficiency": 0.0027878988124363084
        },
        "pcie": {
          "ai": 1599.9875993024607,
          "gflops": 30930.097359403888,
          "efficiency": 0.01887837956726119
        },
        "eth": {
          "ai": 2108.1741640539035,
          "gflops": 30930.097359403888,
          "efficiency": 0.018339386924706803
        }
      }
    },
    {
      "mode": "archipelago",
      "seq_len": 256,
      "cluster": 16,
      "ep": 16,
      "n_completed": 256,
      "panel": {
        "nv": {
          "ai": 815.7605334650531,
          "gflops": 43551.10935178134,
          "efficiency": 0.008341738239420911
        }
      }
    },
    {
      "mode": "archipelago",
      "seq_len": 1024,
      "cluster": 4,
      "ep": 16,
      "n_completed": 1024,
      "panel": {
        "nv": {
          "ai": 4070.5088421960686,
          "gflops": 73134.63433400133,
          "efficiency": 0.0035397774691203307
        },
        "pcie": {
          "ai": 1025.0168818272095,
          "gflops": 73134.63433400133,
          "efficiency": 0.06967742932631793
        },
        "eth": {
          "ai": 1350.7136158530145,
          "gflops": 73134.63433400133,
          "efficiency": 0.06768147729063083
        }
      }
    },
    {
      "mode": "archipelago",
      "seq_len": 1024,
      "cluster": 8,
      "ep": 16,
      "n_completed": 1024,
      "panel": {
        "nv": {
          "ai": 1742.785595567867,
          "gflops": 75945.43152465108,
          "efficiency": 0.00680891195446229
        },
        "pcie": {
          "ai": 1547.9493860717969,
          "gflops": 75945.43152465108,
          "efficiency": 0.04791207073087862
        },
        "eth": {
          "ai": 2039.806381130749,
          "gflops": 75945.43152465108,
          "efficiency": 0.04653960801573198
        }
      }
    },
    {
      "mode": "archipelago",
      "seq_len": 1024,
      "cluster": 16,
      "ep": 16,
      "n_completed": 1024,
      "panel": {
        "nv": {
          "ai": 816.0729348108068,
          "gflops": 161004.58041997132,
          "efficiency": 0.03082685948462774
        }
      }
    },
    {
      "mode": "archipelago",
      "seq_len": 4096,
      "cluster": 4,
      "ep": 16,
      "n_completed": 4096,
      "panel": {
        "nv": {
          "ai": 4045.1249679778125,
          "gflops": 145234.23503675265,
          "efficiency": 0.007029458444820755
        },
        "pcie": {
          "ai": 1028.3837663651789,
          "gflops": 145234.23503675265,
          "efficiency": 0.13791573952433905
        },
        "eth": {
          "ai": 1354.605760979892,
          "gflops": 145234.23503675265,
          "efficiency": 0.13401891459889906
        }
      }
    },
    {
      "mode": "archipelago",
      "seq_len": 4096,
      "cluster": 8,
      "ep": 16,
      "n_completed": 4096,
      "panel": {
        "nv": {
          "ai": 1736.0242879079992,
          "gflops": 149571.80325315584,
          "efficiency": 0.013462135536403352
        },
        "pcie": {
          "ai": 1553.5372567464283,
          "gflops": 149571.80325315584,
          "efficiency": 0.09402170014275443
        },
        "eth": {
          "ai": 2046.3649596668254,
          "gflops": 149571.80325315584,
          "efficiency": 0.09136432540209496
        }
      }
    },
    {
      "mode": "archipelago",
      "seq_len": 4096,
      "cluster": 16,
      "ep": 16,
      "n_completed": 4096,
      "panel": {
        "nv": {
          "ai": 818.577100981246,
          "gflops": 365179.461402801,
          "efficiency": 0.06970545691516346
        }
      }
    },
    {
      "mode": "archipelago",
      "seq_len": 16384,
      "cluster": 4,
      "ep": 16,
      "n_completed": 16384,
      "panel": {
        "nv": {
          "ai": 4097.569301413366,
          "gflops": 292756.24353304727,
          "efficiency": 0.014169647038500313
        },
        "pcie": {
          "ai": 1502.6588612037667,
          "gflops": 292756.24353304727,
          "efficiency": 0.19025926406623903
        },
        "eth": {
          "ai": 2341.2725566993313,
          "gflops": 292756.24353304727,
          "efficiency": 0.15630188094469863
        }
      }
    },
    {
      "mode": "archipelago",
      "seq_len": 16384,
      "cluster": 8,
      "ep": 16,
      "n_completed": 16384,
      "panel": {
        "nv": {
          "ai": 1925.7028365213482,
          "gflops": 391680.50911949336,
          "efficiency": 0.03178064568906937
        },
        "pcie": {
          "ai": 2919.4368861243383,
          "gflops": 391680.50911949336,
          "efficiency": 0.13101858752452394
        },
        "eth": {
          "ai": 3618.5585228332116,
          "gflops": 391680.50911949336,
          "efficiency": 0.13530267185399164
        }
      }
    },
    {
      "mode": "archipelago",
      "seq_len": 16384,
      "cluster": 16,
      "ep": 16,
      "n_completed": 16384,
      "panel": {
        "nv": {
          "ai": 986.239465117463,
          "gflops": 662455.6081630959,
          "efficiency": 0.10495289677254564
        }
      }
    },
    {
      "mode": "archipelago",
      "seq_len": 65536,
      "cluster": 4,
      "ep": 16,
      "n_completed": 65536,
      "panel": {
        "nv": {
          "ai": 5587.723836120519,
          "gflops": 427795.56467130745,
          "efficiency": 0.02070566312395006
        },
        "pcie": {
          "ai": 1716.5603096489408,
          "gflops": 427795.56467130745,
          "efficiency": 0.24337572281964445
        },
        "eth": {
          "ai": 2941.284719148045,
          "gflops": 427795.56467130745,
          "efficiency": 0.18180642368890598
        }
      }
    },
    {
      "mode": "archipelago",
      "seq_len": 65536,
      "cluster": 8,
      "ep": 16,
      "n_completed": 65536,
      "panel": {
        "nv": {
          "ai": 2334.7889003591645,
          "gflops": 469099.74985070626,
          "efficiency": 0.031393346054924914
        },
        "pcie": {
          "ai": 2993.324572066985,
          "gflops": 469099.74985070626,
          "efficiency": 0.15304228239680812
        },
        "eth": {
          "ai": 3697.76407619547,
          "gflops": 469099.74985070626,
          "efficiency": 0.15857547296978663
        }
      }
    },
    {
      "mode": "archipelago",
      "seq_len": 65536,
      "cluster": 16,
      "ep": 16,
      "n_completed": 65536,
      "panel": {
        "nv": {
          "ai": 1077.1445707171108,
          "gflops": 994756.7889922286,
          "efficiency": 0.14429887361968266
        }
      }
    },
    {
      "mode": "archipelago",
      "seq_len": 262144,
      "cluster": 4,
      "ep": 16,
      "n_completed": 262144,
      "panel": {
        "nv": {
          "ai": 5278.310949638886,
          "gflops": 396437.1935611196,
          "efficiency": 0.01918789173512737
        },
        "pcie": {
          "ai": 1647.2287886441045,
          "gflops": 396437.1935611196,
          "efficiency": 0.23502849118834607
        },
        "eth": {
          "ai": 2737.8898180213873,
          "gflops": 396437.1935611196,
          "efficiency": 0.1809957759036191
        }
      }
    },
    {
      "mode": "archipelago",
      "seq_len": 262144,
      "cluster": 8,
      "ep": 16,
      "n_completed": 262144,
      "panel": {
        "nv": {
          "ai": 2275.2230294130136,
          "gflops": 526982.918908755,
          "efficiency": 0.03619033387717432
        },
        "pcie": {
          "ai": 2989.1606999875917,
          "gflops": 526982.918908755,
          "efficiency": 0.17216597178899326
        },
        "eth": {
          "ai": 3698.2266384539244,
          "gflops": 526982.918908755,
          "efficiency": 0.1781201405523732
        }
      }
    },
    {
      "mode": "archipelago",
      "seq_len": 262144,
      "cluster": 16,
      "ep": 16,
      "n_completed": 262144,
      "panel": {
        "nv": {
          "ai": 1053.1710734515789,
          "gflops": 988365.0862084561,
          "efficiency": 0.14663528899815678
        }
      }
    }
  ],
  "model": {
    "experts": 384,
    "topk": 6,
    "hidden": 7168,
    "d_ff": 3072
  }
};
