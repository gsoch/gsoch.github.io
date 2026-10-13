export const LINKS = {
  email: 'mailto:gabriel.ona@mail.utoronto.ca',
  linkedin: 'https://www.linkedin.com/in/gabrielona/',
  github: 'https://github.com/Gabeinstein',
  cv: '/cv.pdf',
  paper: 'https://doi.org/10.1007/s10846-025-02276-7',
}

export const OFFICE = {
  dept: 'Edward S. Rogers Sr. Electrical and Computer Engineering',
  school: 'University of Toronto, ON, Canada',
  room: 'PT477 - Desk 11',
}

export const NAV = [
  { label: 'About', href: '#about' },
  { label: 'Research', href: '#research' },
  { label: 'Projects', href: '#projects' },
  { label: 'Experience', href: '#experience' },
  { label: 'Publications', href: '#publications' },
  { label: 'Contact', href: '#contact' },
]

export const ABOUT_FACTS = [
  { k: 'WHERE', v: 'High-Performance Reconfigurable Computing Group (HPRC) @ UofT' },
  { k: 'WHAT', v: 'Leading the search for accelerator architectures that enable efficient resource utilization in distributed AI inference' },
  { k: 'FOCUS', v: 'GPU–FPGA co-design to overlap compute and communication in MoE inference' },
]

export type Project = { code: string; date: string; title: string; line: string; bullets: string[]; tags: string[] }

export const PROJECTS: Project[] = [
  { code: 'P-05', date: '', title: 'Lighting IoT Monitoring PCB', line: 'An ESP32 board that switches, dims and colors lights: AC on/off, AC dimmer, and an RGB driver in one assembly.', bullets: ['ESP32 board designed in Capture and PCB Designer, with a 3-in-1 assembly: AC on/off switch, AC dimmer, and RGB controller and driver.'], tags: ['ESP32', 'OrCAD', 'PCB'] },
  { code: 'P-04', date: "APR '26", title: 'Apache Spark vs. Flink Benchmarking', line: 'Exactly-once Flink trades throughput and recovery time for lower latency than Spark.', bullets: ['Benchmarking framework for latency, throughput, scalability and fault tolerance on an automated multi-node cluster.', 'Streaming testbed with Kafka/SQL ingestion, NFS checkpointing and Nexmark workloads.', "Flink's exactly-once semantics improve latency but cut throughput and slow recovery vs. Spark."], tags: ['Spark', 'Flink', 'Kafka'] },
  { code: 'P-03', date: "APR '26", title: 'CNN-Based Informed Steering for RRT*', line: 'A CNN replaces RRT*’s heuristic steering, improving prediction accuracy by 33%.', bullets: ["Replaced RRT*'s heuristic steering with a ResNet-inspired CNN on map, agent and goal inputs.", 'PyTorch DDP and synthetic data improved prediction accuracy by 33%.'], tags: ['PyTorch DDP', 'CNN', 'Planning'] },
  { code: 'P-02', date: "SEPT '25", title: 'VLSI CAD Flow: Mapping, Partitioning, Placement & Routing', line: 'A C++ flow that takes circuits from graphs to bitstreams: partition, place, route.', bullets: ['C++ framework converting VLSI graph representations into bitstreams across benchmark circuits.', 'Hypergraph partitioning, analytical placement, ABC technology mapping and maze routing.'], tags: ['C++', 'VLSI CAD', 'ABC'] },
  { code: 'P-01', date: "JAN '25", title: 'FPGA AI Accelerator with Reconfigurable Systolic Array', line: 'A parameterized weight-stationary GEMM array that scales to 256×256.', bullets: ['Weight-stationary systolic array for GEMM with NoC weight distribution and AXI-Lite/Stream interfaces.', 'Fully parameterized IP scaling to a 256×256 array.'], tags: ['Systolic Array', 'NoC', 'AXI'] },
]

export const projectMeta = (p: Project) => [p.date, ...p.tags].filter(Boolean).join('  ·  ').toUpperCase()

type Experience = { date: string; org: string; role: string; lab: string }

const EXPERIENCE_RAW: Experience[] = [
  { date: 'JAN 2026 — PRESENT', org: 'University of Toronto', role: 'Teaching Assistant', lab: 'ECE243 · ECE342' },
  { date: 'SEP 2024 — MAY 2025', org: 'Universidad San Francisco de Quito', role: 'Teaching Assistant', lab: 'IEE2003 · IEE3200' },
  { date: 'MAY — SEP 2024', org: 'University of Toronto', role: 'Intern, Reconfigurable Computing', lab: 'HPRC GROUP' },
  { date: 'MAY — SEP 2024', org: 'University of Toronto', role: 'Intern, Autonomous Robotics', lab: 'STARS LAB' },
  { date: 'NOV 2023 — NOV 2024', org: 'Synopsys Inc.', role: 'Co-op, ASIC Design and Layout', lab: 'UNIVERSITY AWARD' },
  { date: '2020 — 2024', org: 'National Polytechnic School of Ecuador', role: 'Research Assistant', lab: 'ATA GROUP' },
]

// Course codes are left off TA rows; every other role shows its lab.
export const EXPERIENCE = EXPERIENCE_RAW.map((x) => ({
  ...x,
  labTxt: x.role === 'Teaching Assistant' ? '' : '  ·  ' + x.lab,
}))

const FP = 'https://commons.wikimedia.org/wiki/Special:FilePath/'

// Logo per organization: [src, width, CSS filter, scale].
export const ORG_LOGOS: Record<string, { src: string; w: string; filter: string; scale: number }> = {
  'University of Toronto': { src: FP + 'U_of_T_lettermark_(white).svg', w: '70%', filter: 'none', scale: 1 },
  'Universidad San Francisco de Quito': { src: '/assets/logo-usfq.svg', w: '100%', filter: 'brightness(0) invert(1)', scale: 1.7 },
  'Synopsys Inc.': { src: FP + 'Synopsys_Logo.svg', w: '80%', filter: 'brightness(0) invert(1)', scale: 1 },
  'National Polytechnic School of Ecuador': { src: '/assets/logo-epn.png', w: '90%', filter: 'none', scale: 1 },
}
