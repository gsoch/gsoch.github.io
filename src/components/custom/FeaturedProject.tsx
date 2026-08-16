import { Reveal } from '@/components/utils/utils';
import { featuredProject } from '@/data/cv';

export default function FeaturedProject() {
  return (
    <section id="work" className="py-16 md:py-32 px-4 sm:px-6 text-stone-900">
      <div className="max-w-6xl mx-auto">

        <Reveal>
          <div className="inline-flex items-center rounded-full border border-stone-300 bg-white/60 px-3 py-1 md:px-4 text-xs md:text-sm tracking-[0.15em] md:tracking-[0.2em] uppercase backdrop-blur-sm mb-6 md:mb-8">
            Featured Project
          </div>
        </Reveal>

        <div className="grid lg:grid-cols-2 gap-8 sm:gap-12 lg:gap-16 items-center">

          {/* LEFT: narrative */}
          <Reveal>
            <div>
              <div className="text-sm text-stone-500 mb-2">{featuredProject.subtitle} &middot; {featuredProject.date}</div>

              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight mb-5 md:mb-6 leading-tight">
                {featuredProject.title}
              </h2>

              <ul className="space-y-3 mb-6 md:mb-8">
                {featuredProject.bullets.map((b) => (
                  <li key={b} className="text-stone-600 leading-relaxed text-sm sm:text-base flex gap-2">
                    <span className="text-stone-400 mt-1.5">&bull;</span>
                    <span>{b}</span>
                  </li>
                ))}
              </ul>

              <div className="flex flex-wrap gap-2">
                {featuredProject.tags.map((tag) => (
                  <span key={tag} className="text-xs px-3 py-1 rounded-full border border-stone-300 bg-white/60 text-stone-600">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </Reveal>

          {/* RIGHT: metrics panel, echoes Hero's demo card */}
          <Reveal delay={0.1}>
            <div className="w-full rounded-2xl border border-stone-200 bg-white/60 backdrop-blur-xl shadow-sm p-5 sm:p-6 md:p-8 space-y-5 sm:space-y-6">
              <div className="flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <div className="text-sm text-stone-500">Simulator Output</div>
                  <div className="text-base sm:text-lg font-medium truncate">MoE Inference @ Rack Scale</div>
                </div>
                <div className="px-3 py-1 text-xs rounded-full bg-green-100 text-green-700 shrink-0">
                  VALIDATED
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 sm:gap-4">
                {featuredProject.metrics.map((m) => (
                  <div key={m.label} className="p-3 sm:p-4 rounded-md bg-white border border-stone-200">
                    <div className="text-xs text-stone-500 mb-1">{m.label}</div>
                    <div className="text-2xl sm:text-3xl font-light">{m.value}</div>
                  </div>
                ))}
              </div>

              <div className="p-3 sm:p-4 rounded-md bg-white border border-stone-200">
                <div className="text-xs text-stone-500 mb-2">Validated against</div>
                <div className="text-sm font-medium">DeepSeek-V4-Pro, under stress conditions</div>
              </div>
            </div>
          </Reveal>

        </div>
      </div>
    </section>
  );
}
