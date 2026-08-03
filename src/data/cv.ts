export const profile = {
  name: "Gabriel Oña",
  email: "gabriel.ona@mail.utoronto.ca",
  portfolio: "https://gsoch.github.io",
  linkedin: "https://www.linkedin.com/in/gabrielona/",
  github: "https://github.com/Gabeinstein",
  cv: "/cv.pdf",
};

export const featuredProject = {
  title: "In-Network Acceleration for Distributed MoE Inference",
  subtitle: "Thesis Research",
  date: "July '26",
  bullets: [
    "Built a discrete-event simulator modeling distributed MoE inference across thousands of GPUs.",
    "Modeled NVLink/NVSwitch, PCIe, and Ethernet fabrics with collective scheduling policies over configurable rack-scale topologies.",
    "Benchmarked FPGA SmartNIC- and ASIC-based in-network acceleration at inter- and intra-rack boundaries.",
    "Validated against DeepSeek-V4-Pro under stress conditions.",
  ],
  tags: ["Discrete-Event Simulation", "NVLink/NVSwitch", "FPGA SmartNIC", "MoE Inference"],
  metrics: [
    { label: "Speedup vs. BSP baseline", value: "6.7×" },
    { label: "Speedup, FPGA-only", value: "1.7×" },
    { label: "Network fabrics modeled", value: "3" },
    { label: "GPU scale simulated", value: "1000s" },
  ],
};

export const projects = [
  {
    title: "Apache Spark vs. Flink Benchmarking for Distributed Data Processing",
    date: "April '26",
    bullets: [
      "Built an industry-style benchmarking framework evaluating latency, throughput, scalability, and fault tolerance across an automated, configurable multi-node cluster.",
      "Integrated a streaming testbed with Kafka-/SQL-based ingestion, NFS checkpointing, and Nexmark workloads.",
      "Found Flink's exactly-once semantics improve latency but reduce throughput and slow failure recovery, compared to Spark's cheaper micro-batch-based recovery.",
    ],
    tags: ["Apache Spark", "Apache Flink", "Kafka", "Distributed Systems"],
  },
  {
    title: "CNN-Based Informed Steering for RRT*",
    date: "April '26",
    bullets: [
      "Replaced RRT*'s heuristic-based steering with a ResNet-inspired CNN trained on three-channel (map, agent position, goal position) inputs.",
      "Benchmarked against a pre-trained CNN with position-embedding injection.",
      "Used distributed training with PyTorch DDP, learning rate scheduling, and synthetic dataset generation, improving prediction accuracy by 33%.",
    ],
    tags: ["PyTorch DDP", "CNN", "Motion Planning"],
  },
  {
    title: "VLSI CAD Flow: Technology Mapping, Partitioning, Placement, and Routing",
    date: "September '25",
    bullets: [
      "Built a C++ framework converting intermediate VLSI graph representations into low-level bitstreams across multiple benchmark circuits.",
      "Integrated hypergraph partitioning, flow-based analytical placement, ABC-based technology mapping with custom standard cells, and maze routing.",
    ],
    tags: ["C++", "VLSI CAD", "ABC"],
  },
  {
    title: "FPGA-Based AI Accelerator with Reconfigurable Systolic Array Architecture",
    date: "January '25",
    bullets: [
      "Designed a weight-stationary systolic array for general matrix multiplication (GEMM) from scratch, with a NoC-based topology for weight distribution and AXI-Lite/AXI-Stream control and data interfaces.",
      "Parameterized all modules for reusable, scalable IP, scaling to a 256×256 array comparable to industry-grade accelerators.",
    ],
    tags: ["Systolic Array", "NoC", "AXI", "GEMM"],
  },
];

export const publications = [
  {
    type: "Journal Article",
    title: "An Open-source UAV Digital Twin Framework: A Case Study on Remote Sensing in the Andean Mountains",
    authors: "E. Valencia, F. Toapanta, G. Oña, et al.",
    venue: "Journal of Intelligent & Robotic Systems, vol. 111, no. 71",
    year: "2025",
    link: "https://doi.org/10.1007/s10846-025-02276-7",
    linkLabel: "doi:10.1007/s10846-025-02276-7",
  },
];
