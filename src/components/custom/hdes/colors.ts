// Same palette the real matplotlib plots use (simulator/metrics/plots/network.py
// _LINK_TYPE_COLOR / roofline.py _LINK_COLORS) so this widget stays visually
// consistent with the reference figures in output/important/*.
export const LINK_COLORS = {
  nv: "#5b8f00",
  pcie: "#9c27b0",
  eth: "#e64a19",
} as const;

export const LINK_LABELS = {
  nv: "NVLink",
  pcie: "PCIe",
  eth: "Ethernet / IB",
} as const;

// Compact abbreviations for tight single-row layouts (e.g. the network
// chart's hover readout), where LINK_LABELS' "Ethernet / IB" would wrap.
export const LINK_SHORT = {
  nv: "NV",
  pcie: "PCIe",
  eth: "Eth",
} as const;

export type LinkType = keyof typeof LINK_COLORS;

// Same palette the real matplotlib pipeline plots use for phase bands
// (simulator/metrics/plots/pipeline.py _PHASE_COLOR).
export const PHASE_COLORS = {
  dispatch: "#1976d2",
  compute: "#f57c00",
  gather: "#388e3c",
} as const;

export const PHASE_LABELS = {
  dispatch: "Dispatch",
  compute: "Compute",
  gather: "Gather",
} as const;

export type PhaseType = keyof typeof PHASE_COLORS;

export const MODE_LABELS: Record<string, string> = {
  naive: "Naive",
  comet: "Imp. 1",
  floreana: "Imp. 2",
  archipelago: "Imp. 3",
};

// Marker shape per implementation, matching the real roofline plot exactly
// (simulator/metrics/plots/roofline.py `_MODE_MARKER`: circle=naive,
// square=comet, diamond=floreana, triangle=archipelago) — shape carries
// "which implementation," color carries "which link," so the two channels
// never collide.
export const MODE_MARKER: Record<string, "circle" | "square" | "diamond" | "triangle"> = {
  naive: "circle",
  comet: "square",
  floreana: "diamond",
  archipelago: "triangle",
};

// Ceiling linestyle keyed by the accelerator tier a mode's peak includes —
// matches `_CEILING_LINESTYLE` in roofline.py: solid = GPU only, dashed =
// GPU+FPGA (floreana), dotted = GPU+FPGA+ASIC (archipelago).
export const MODE_CEILING_DASH: Record<string, string | undefined> = {
  naive: undefined,
  comet: undefined,
  floreana: "6 3",
  archipelago: "1.5 2.5",
};

// Sequential ramp for the GPU utilization heatmap — single hue (indigo,
// distinct from the link/phase/mode hues used elsewhere on this widget),
// light -> dark as SM-weighted busy fraction rises from 0 -> 1.
export function utilizationColor(frac: number): string {
  const t = Math.max(0, Math.min(1, frac));
  const lightness = 94 - t * 62; // 94% (near-white, idle) -> 32% (dark, saturated)
  const saturation = 15 + t * 55;
  return `hsl(243, ${saturation.toFixed(0)}%, ${lightness.toFixed(0)}%)`;
}

export const NODE_LABELS: Record<string, string> = {
  gpu: "GPU",
  nvswitch: "NVSwitch",
  pcie_switch: "PCIe switch",
  nic: "NIC",
  fpga: "FPGA",
  rack_switch: "Rack switch (ToR)",
  spine_switch: "Spine switch",
};
