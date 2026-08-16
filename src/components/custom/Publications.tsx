import { BookOpen, ExternalLink } from 'lucide-react';
import { Reveal } from '@/components/utils/utils';
import { publications } from '@/data/cv';

export default function Publications() {
  return (
    <section id="publications" className="py-16 md:py-32 px-4 sm:px-6">
      <div className="max-w-5xl mx-auto">

        <Reveal>
          <div className="text-center mb-10 md:mb-20">
            <h2 className="text-3xl sm:text-5xl md:text-6xl font-bold mb-3 md:mb-6">Publications</h2>
            <p className="text-base sm:text-xl text-zinc-600">
              Peer-reviewed research
            </p>
          </div>
        </Reveal>

        <div className="space-y-6">
          {publications.map((p, i) => (
            <Reveal key={p.title} delay={i * 0.08}>
              <a
                href={p.link}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex flex-col sm:flex-row gap-4 sm:gap-6 p-6 sm:p-8 bg-surface border-2 border-zinc-100 rounded-3xl hover:border-black transition"
              >
                <div className="w-12 h-12 sm:w-14 sm:h-14 bg-black rounded-2xl flex items-center justify-center shrink-0">
                  <BookOpen className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
                </div>

                <div className="min-w-0">
                  <div className="text-xs font-semibold uppercase tracking-wide text-zinc-500 mb-2">
                    {p.type} &middot; {p.year}
                  </div>

                  <h3 className="text-lg sm:text-xl font-semibold leading-snug mb-2 group-hover:underline decoration-2 underline-offset-4">
                    {p.title}
                  </h3>

                  <p className="text-zinc-600 text-sm mb-1">{p.authors}</p>
                  <p className="text-zinc-500 text-sm italic mb-4">{p.venue}</p>

                  <span className="inline-flex items-center gap-1 text-sm font-medium text-black">
                    {p.linkLabel}
                    <ExternalLink className="w-3.5 h-3.5" />
                  </span>
                </div>
              </a>
            </Reveal>
          ))}
        </div>

      </div>
    </section>
  );
}
