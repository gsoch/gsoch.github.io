import { Reveal } from '@/components/utils/utils';
import { projects } from '@/data/cv';

export default function Projects() {
  return (
    <section className="py-16 md:py-32 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto">

        <Reveal>
          <div className="mb-10 md:mb-16">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-3 md:mb-4">Selected Work</h2>
            <p className="text-base sm:text-xl text-zinc-600">
              More systems work spanning simulation, silicon, and distributed data
            </p>
          </div>
        </Reveal>

        <div className="grid md:grid-cols-2 gap-6 sm:gap-8">
          {projects.map((project, i) => (
            <Reveal key={project.title} delay={i * 0.08}>
              <div className="h-full flex flex-col p-6 sm:p-8 bg-white border-2 border-zinc-100 rounded-3xl hover:border-black transition">
                <div className="flex items-start justify-between gap-4 mb-4">
                  <h3 className="text-lg sm:text-xl font-semibold leading-snug">{project.title}</h3>
                  <span className="text-sm text-zinc-500 whitespace-nowrap shrink-0">{project.date}</span>
                </div>

                <ul className="space-y-2">
                  {project.bullets.map((b) => (
                    <li key={b} className="text-zinc-600 leading-relaxed text-sm flex gap-2">
                      <span className="text-zinc-400 mt-1.5">&bull;</span>
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>

                <div className="flex flex-wrap gap-2 mt-6 pt-6 border-t border-zinc-100">
                  {project.tags.map((tag) => (
                    <span key={tag} className="text-xs px-3 py-1 rounded-full bg-zinc-100 text-zinc-600">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </Reveal>
          ))}
        </div>

      </div>
    </section>
  );
}
