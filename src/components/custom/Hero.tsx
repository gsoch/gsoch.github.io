import { useLayoutEffect, useRef, useState } from "react";
import { Mail } from "lucide-react";
import HeroTrace from "@/components/custom/HeroTrace";
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
  const [photoFailed, setPhotoFailed] = useState(false);
  const headingRef = useRef<HTMLHeadingElement | null>(null);
  const [lede, setLede] = useState<number | undefined>(undefined);

  // Make the paragraph exactly as wide as the headline's longest rendered
  // line, so both end on the same right edge. Measured from the text itself
  // (a Range over the h1), because the h1 box is wider than its wrapped text.
  useLayoutEffect(() => {
    const measure = () => {
      const el = headingRef.current;
      if (!el) return;
      const range = document.createRange();
      range.selectNodeContents(el);
      setLede(Math.ceil(range.getBoundingClientRect().width));
    };
    measure();
    window.addEventListener("resize", measure);
    document.fonts?.ready.then(measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

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
      <div className="mx-auto grid min-h-dvh max-w-400 grid-cols-1 md:grid-cols-2 items-start md:items-center gap-8 md:gap-16 px-4 md:px-6 pt-32 pb-14 md:pt-24 md:pb-10">

        {/* LEFT */}
        <div
          ref={textRef}
          style={{ marginLeft: textOffset }}
          className="flex flex-col justify-center items-center text-center md:items-start md:text-left space-y-5 md:space-y-8 mb-16 md:mb-15"
        >

          <div className="space-y-3 md:space-y-4">
            <h1 ref={headingRef} className="font-sans font-bold text-4xl sm:text-5xl md:text-6xl tracking-[-0.045em] leading-[1.02] text-balance">
              Accelerating AI, from architecture to algorithm.
            </h1>

            <div className="flex items-center gap-3 md:gap-4">
              <div className="relative flex size-12 md:size-14 shrink-0 items-center justify-center overflow-hidden rounded-full border border-stone-300 bg-white text-sm md:text-base font-semibold text-stone-700 shadow-sm">
                GO
                {/* Drop a photo at public/profile.jpg to replace the initials. */}
                {!photoFailed && (
                  <img
                    src={`${import.meta.env.BASE_URL}profile.jpg`}
                    alt={profile.name}
                    onError={() => setPhotoFailed(true)}
                    className="absolute inset-0 size-full object-cover"
                  />
                )}
              </div>
              <div className="text-left leading-tight">
                <div className="text-base md:text-lg font-semibold text-stone-900">{profile.name}</div>
                <div className="text-sm text-stone-500">MASc &middot; University of Toronto</div>
              </div>
            </div>

            <p className="text-base md:text-lg leading-6 md:leading-7 text-stone-600 text-pretty" style={{ width: lede, maxWidth: "100%" }}>
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

            <a
              href={profile.cv}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="CV"
              title="CV"
              className="flex items-center justify-center w-12 h-12 rounded-full border border-stone-300 bg-white/70 text-sm font-semibold text-stone-900 hover:bg-white hover:-translate-y-0.5 transition"
            >
              CV
            </a>
          </div>

        </div>

        {/* RIGHT */}
        <div ref={cardRef} className="flex items-center justify-center md:pl-10">
          <HeroTrace />
        </div>

      </div>
    </section>
  );
}
