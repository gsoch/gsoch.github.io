import { useRef } from "react";
import HDESShowcase from "@/components/custom/HDESShowcase";
import HeroGuides from "@/components/custom/HeroGuides";

export default function Hero() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const textRef = useRef<HTMLDivElement | null>(null);
  const cardRef = useRef<HTMLDivElement | null>(null);

  return (
    <section ref={sectionRef} id="home" className="relative min-h-dvh text-stone-900">
      {/* Soft gradient "aurora" blobs, tailwindcss.com-style — colored pops
          on top of the grid texture, blurred heavily so they read as glow
          rather than hard shapes. Purely decorative, clipped to the hero. */}
      <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute -top-32 -left-24 w-lg h-128 rounded-full bg-indigo-300/35 blur-3xl" />
        <div className="absolute top-10 -right-20 w-xl h-144 rounded-full bg-violet-300/25 blur-3xl" />
        <div className="absolute -bottom-48 left-1/3 w-md h-112 rounded-full bg-amber-200/25 blur-3xl" />
      </div>

      <HeroGuides containerRef={sectionRef} textRef={textRef} cardRef={cardRef} />

      <div className="mx-auto grid min-h-dvh max-w-400 grid-cols-1 md:grid-cols-2 items-start md:items-center gap-8 md:gap-16 px-4 md:px-12 py-14 md:py-10 mt-18 md:mt-0">

        {/* LEFT */}
        <div ref={textRef} className="flex flex-col justify-center space-y-5 md:space-y-8 mb-10 md:mb-15">

          <div className="inline-flex w-fit items-center rounded-full border border-stone-300 bg-white/60 px-3 py-1 md:px-4 text-xs md:text-sm tracking-[0.15em] md:tracking-[0.2em] uppercase backdrop-blur-sm">
            MASc &middot; Computer Engineering &middot; UofT
          </div>

          <div className="space-y-3 md:space-y-4">
            <h1 className="font-sans font-bold text-5xl sm:text-6xl md:text-7xl tracking-tight">
              Gabriel Oña
            </h1>

            <p className="text-base md:text-lg leading-6 md:leading-7 text-stone-600 max-w-md">
              Hardware/software co-design engineer specializing in large-scale HPC and AI systems.
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
        <div ref={cardRef} className="flex items-center justify-center">
          <HDESShowcase />
        </div>

      </div>
    </section>
  );
}
