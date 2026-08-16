import { useEffect, useRef } from "react";

interface Bit {
  x: number;
  y: number;
  vx: number;
  vy: number;
  char: "0" | "1";
  bornAt: number;
  lifeMs: number;
  size: number;
}

const LIFE_MS = 1100;
const MAX_BITS = 160;
const SPAWN_MIN_DIST = 14; // px moved before spawning the next bit — throttles the trail density

// Soft indigo, same hue family as the GPU utilization heatmap
// (see hdes/colors.ts:utilizationColor) for a bit of visual continuity.
const HUE = 243;

export default function BitTrail() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const bitsRef = useRef<Bit[]>([]);
  const lastPosRef = useRef<{ x: number; y: number } | null>(null);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const resize = () => {
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener("resize", resize);

    const spawn = (x: number, y: number) => {
      if (bitsRef.current.length >= MAX_BITS) bitsRef.current.shift();
      const angle = Math.random() * Math.PI * 2;
      const speed = 0.15 + Math.random() * 0.35;
      bitsRef.current.push({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 0.15, // slight upward drift, like a ripple rising
        char: Math.random() < 0.5 ? "0" : "1",
        bornAt: performance.now(),
        lifeMs: LIFE_MS * (0.7 + Math.random() * 0.6),
        size: 9 + Math.random() * 6,
      });
    };

    const handlePointerMove = (e: PointerEvent) => {
      const last = lastPosRef.current;
      if (!last || Math.hypot(e.clientX - last.x, e.clientY - last.y) >= SPAWN_MIN_DIST) {
        spawn(e.clientX, e.clientY);
        lastPosRef.current = { x: e.clientX, y: e.clientY };
      }
    };
    window.addEventListener("pointermove", handlePointerMove, { passive: true });

    const tick = () => {
      const now = performance.now();
      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

      bitsRef.current = bitsRef.current.filter((b) => now - b.bornAt < b.lifeMs);
      for (const b of bitsRef.current) {
        const age = (now - b.bornAt) / b.lifeMs; // 0 -> 1
        b.x += b.vx;
        b.y += b.vy;
        b.vy += 0.0015; // gentle settle, so the "rise" eases off like a ripple losing energy
        const alpha = (1 - age) * 0.55;
        const lightness = 30 + age * 35;
        ctx.font = `${b.size}px "SF Mono", "Fira Code", monospace`;
        ctx.fillStyle = `hsla(${HUE}, 55%, ${lightness}%, ${alpha})`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(b.char, b.x, b.y);
      }
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", handlePointerMove);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-40"
      aria-hidden="true"
    />
  );
}
