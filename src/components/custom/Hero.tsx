import { useRef, useState } from "react";

export default function Hero() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [prediction, setPrediction] = useState<number | null>(3);
  const [drawing, setDrawing] = useState(false);

  // -----------------------------
  // Fake inference (placeholder)
  // -----------------------------
  const runInference = () => {
    const fake = Math.floor(Math.random() * 10);
    setPrediction(fake);
  };

  // -----------------------------
  // Pointer-based drawing (mobile + desktop)
  // -----------------------------
  const startDraw = () => setDrawing(true);

  const endDraw = () => {
    setDrawing(false);
    runInference();
  };

  const draw = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!drawing) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();

    const cssX = e.clientX - rect.left;
    const cssY = e.clientY - rect.top;

    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    const x = cssX * scaleX;
    const y = cssY * scaleY;

    ctx.fillStyle = "black";
    ctx.beginPath();
    ctx.arc(x, y, 6, 0, Math.PI * 2);
    ctx.fill();
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");

    if (!canvas || !ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setPrediction(null);
  };

  return (
    <section id="home" className="relative min-h-dvh bg-stone-50 text-stone-900">
      <div className="mx-auto grid min-h-dvh max-w-400 grid-cols-1 md:grid-cols-2 items-start md:items-center gap-8 md:gap-16 px-4 md:px-12 py-14 md:py-10 mt-18 md:mt-0">

        {/* LEFT */}
        <div className="flex flex-col justify-center space-y-5 md:space-y-8 mb-10 md:mb-15">

          <div className="inline-flex w-fit items-center rounded-full border border-stone-300 bg-white/60 px-3 py-1 md:px-4 text-xs md:text-sm tracking-[0.15em] md:tracking-[0.2em] uppercase backdrop-blur-sm">
            MASc &middot; Computer Engineering &middot; UofT
          </div>

          <div className="space-y-3 md:space-y-4">
            <h1 className="font-sans font-bold text-5xl sm:text-6xl md:text-7xl tracking-tight">
              Gabriel Oña
            </h1>

            <p className="text-base md:text-lg leading-6 md:leading-7 text-stone-600 max-w-md">
              Hardware/software co-design engineer specializing in large-scale HPC and AI systems &mdash; building
              FPGA/ASIC in-network accelerators and simulation infrastructure for distributed AI workloads.
            </p>
          </div>

          <div className="flex flex-wrap gap-3 md:gap-4">
            <a
              href="#work"
              className="rounded-md bg-stone-900 px-5 py-3 text-sm text-white hover:bg-stone-800 transition"
            >
              View Projects
            </a>

            <a
              href="#contact"
              className="rounded-md border border-stone-300 bg-white/70 px-5 py-3 text-sm hover:bg-white transition"
            >
              Contact Me
            </a>
          </div>

        </div>

        {/* RIGHT */}
        <div className="flex items-center justify-center">
          <div className="w-full max-w-xl rounded-2xl border border-stone-200 bg-white/60 backdrop-blur-xl shadow-sm p-4 md:p-6 space-y-5 md:space-y-6">

            {/* Header */}
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-stone-500">AI Accelerator</div>
                <div className="text-lg font-medium">MNIST Inference Engine</div>
              </div>

              <div className="px-3 py-1 text-xs rounded-full bg-green-100 text-green-700">
                ACTIVE
              </div>
            </div>

            {/* DRAW + PREDICTION */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

              {/* Canvas */}
              <div className="space-y-2">
                <div className="text-xs text-stone-500">Input (draw digit)</div>

                <canvas
                  ref={canvasRef}
                  width={256}
                  height={256}
                  onPointerDown={startDraw}
                  onPointerUp={endDraw}
                  onPointerLeave={endDraw}
                  onPointerMove={draw}
                  className="w-full max-w-[280px] aspect-square rounded-md border border-stone-900 bg-white cursor-crosshair touch-none"
                />

                <button
                  onClick={clearCanvas}
                  className="text-xs text-stone-500 hover:text-black"
                >
                  Clear
                </button>
              </div>

              {/* Prediction */}
              <div className="space-y-2">
                <div className="text-xs text-stone-500">Prediction</div>

                <div className="text-5xl font-light">
                  {prediction ?? "—"}
                </div>

                <div className="text-xs text-green-600">
                  Confidence: {prediction ? "98.7%" : "—"}
                </div>
              </div>

            </div>

            {/* Pipeline */}
            <div className="space-y-2">
              <div className="text-xs text-stone-500">Execution Pipeline</div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                {[
                  ["Load", "✓"],
                  ["Conv", "✓"],
                  ["FC", "✓"],
                  ["Softmax", "✓"],
                ].map(([label, status]) => (
                  <div
                    key={label}
                    className="rounded-md border border-stone-200 bg-white px-2 py-2 flex justify-between"
                  >
                    <span>{label}</span>
                    <span className="text-green-600">{status}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Metrics */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="p-3 rounded-md bg-white border border-stone-200">
                <div className="text-xs text-stone-500">Latency</div>
                <div className="text-xl font-light">1.8 ms</div>
              </div>

              <div className="p-3 rounded-md bg-white border border-stone-200">
                <div className="text-xs text-stone-500">Throughput</div>
                <div className="text-xl font-light">5400/s</div>
              </div>

              <div className="p-3 rounded-md bg-white border border-stone-200">
                <div className="text-xs text-stone-500">Power</div>
                <div className="text-xl font-light">12W</div>
              </div>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
}