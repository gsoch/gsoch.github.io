import { useLayoutEffect, useRef, useState } from "react";
import { Mail } from "lucide-react";
import HDESShowcase from "@/components/custom/HDESShowcase";
import HeroGuides from "@/components/custom/HeroGuides";
import { GitHubIcon, LinkedInIcon } from "@/components/custom/SocialIcons";
import { profile } from "@/data/cv";

// Major grid pitch from .bg-blueprint's second (bolder) SVG layer in
// index.css — keep these in sync if that tile size ever changes.
const MAJOR_GRID_PX = 192;

export default function Hero() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const textRef = useRef<HTMLDivElement | null>(null);
  const cardRef = useRef<HTMLDivElement | null>(null);
  const [textOffset, setTextOffset] = useState(0);

  // Nudge the whole text column right until its left edge lands on the next
  // major grid line, so the name (and everything under it, kept aligned to
  // it) sits on the background grid rather than at an arbitrary sub-pixel
  // offset. Desktop-only — it's a two-column composition detail keyed to
  // the wide background grid tile (192px), which doesn't mean anything on
  // a single-column mobile layout, so on narrow screens this stays 0 rather
  // than shoving the text sideways. Runs as a layout effect (not a passive
  // one) so the shift is already applied by the time HeroGuides measures
  // textRef on its own effect — ResizeObserver doesn't fire for a
  // margin-only change, so a later shift here wouldn't otherwise be picked
  // up. Subtracts whatever margin is currently applied before recomputing,
  // so repeated resizes measure the true unshifted position instead of
  // compounding.
  useLayoutEffect(() => {
    const update = () => {
      const el = textRef.current;
      if (!el) return;
      if (!window.matchMedia("(min-width: 768px)").matches) {
        setTextOffset(0);
        return;
      }
      const currentMargin = parseFloat(getComputedStyle(el).marginLeft) || 0;
      const naturalLeft = el.getBoundingClientRect().left - currentMargin;
      const remainder = ((naturalLeft % MAJOR_GRID_PX) + MAJOR_GRID_PX) % MAJOR_GRID_PX;
      setTextOffset(remainder === 0 ? 0 : MAJOR_GRID_PX - remainder);
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

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

      {/* Blueprint-style alignment guides are a desktop composition detail
          tied to the two-column layout — hidden on mobile's single stacked
          column where there's nothing meaningful for them to annotate. */}
      <div className="hidden md:block">
        <HeroGuides containerRef={sectionRef} textRef={textRef} cardRef={cardRef} />
      </div>

      {/* Top clearance for the fixed mobile navbar uses padding, not
          margin — a margin-top here would collapse straight through this
          div's non-BFC ancestors (this section, App's root div), pushing
          the entire bg-blueprint root box down and leaving bare white
          <body> showing above it. Padding never collapses. */}
      <div className="mx-auto grid min-h-dvh max-w-400 grid-cols-1 md:grid-cols-2 items-start md:items-center gap-8 md:gap-16 px-4 md:px-12 pt-32 pb-14 md:pt-10 md:pb-10">

        {/* LEFT */}
        <div
          ref={textRef}
          style={{ marginLeft: textOffset }}
          className="flex flex-col justify-center items-center text-center md:items-start md:text-left space-y-5 md:space-y-8 mb-16 md:mb-15"
        >

          <div className="inline-flex w-fit items-center rounded-full border border-stone-300 bg-white/60 px-3 py-1 md:px-4 text-xs md:text-sm tracking-[0.15em] md:tracking-[0.2em] uppercase backdrop-blur-sm">
            MASc &middot; Computer Engineering &middot; UofT
          </div>

          <div className="space-y-3 md:space-y-4">
            <h1 className="font-sans font-bold text-5xl sm:text-6xl md:text-7xl tracking-tight">
              Gabriel Oña
            </h1>

            <p className="text-base md:text-lg leading-6 md:leading-7 text-stone-600 max-w-md md:ml-2">
              Hardware/software co-design engineer specializing in large-scale HPC and AI systems.
            </p>
          </div>

          <div className="flex flex-wrap gap-3 md:gap-4">
            <a
              href={profile.github}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub"
              title="GitHub"
              className="flex items-center justify-center w-12 h-12 rounded-full border border-stone-300 bg-white/70 text-stone-900 hover:bg-white hover:-translate-y-0.5 transition"
            >
              <GitHubIcon className="w-5 h-5" />
            </a>

            <a
              href={profile.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn"
              title="LinkedIn"
              className="flex items-center justify-center w-12 h-12 rounded-full border border-stone-300 bg-white/70 text-stone-900 hover:bg-white hover:-translate-y-0.5 transition"
            >
              <LinkedInIcon className="w-5 h-5" />
            </a>

            <a
              href="#contact"
              aria-label="Contact"
              title="Contact"
              className="flex items-center justify-center w-12 h-12 rounded-full border border-stone-300 bg-white/70 text-stone-900 hover:bg-white hover:-translate-y-0.5 transition"
            >
              <Mail className="w-5 h-5" />
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
