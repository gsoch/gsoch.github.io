import { Briefcase, GraduationCap, Cpu, Trophy, Users } from 'lucide-react';
import { Reveal } from '@/components/utils/utils';
import { bio, timeline, skills, awards, volunteering } from '@/data/cv';

export default function Background() {
  return (
    <section id="background" className="py-32 px-6">
      <div className="max-w-6xl mx-auto">

        <Reveal>
          <div className="max-w-2xl mb-20">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">Background</h2>
            <p className="text-lg text-zinc-600 leading-relaxed">{bio}</p>
          </div>
        </Reveal>

        <div className="grid md:grid-cols-2 gap-8 mb-8">

          {/* Timeline */}
          <Reveal>
            <div className="p-8 bg-white border-2 border-zinc-100 rounded-3xl h-full">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-black rounded-xl flex items-center justify-center shrink-0">
                  <Briefcase className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-xl font-semibold">Timeline</h3>
              </div>

              <ul className="space-y-4">
                {timeline.map((t) => (
                  <li key={t.role + t.date} className="flex items-start gap-3">
                    <div className="mt-1.5 shrink-0 text-zinc-400">
                      {t.kind === "education" ? (
                        <GraduationCap className="w-4 h-4" />
                      ) : (
                        <Briefcase className="w-4 h-4" />
                      )}
                    </div>
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-baseline justify-between gap-x-3">
                        <span className="text-zinc-800 font-medium text-sm">{t.role}</span>
                        <span className="text-xs text-zinc-500 whitespace-nowrap">{t.date}</span>
                      </div>
                      <div className="text-zinc-500 text-sm">{t.org}</div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>

          {/* Skills */}
          <Reveal delay={0.06}>
            <div className="p-8 bg-white border-2 border-zinc-100 rounded-3xl h-full">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-black rounded-xl flex items-center justify-center shrink-0">
                  <Cpu className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-xl font-semibold">Skills</h3>
              </div>

              <div className="space-y-5">
                {skills.map((group) => (
                  <div key={group.category}>
                    <div className="text-xs font-semibold uppercase tracking-wide text-zinc-500 mb-2">
                      {group.category}
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {group.items.map((item) => (
                        <span key={item} className="text-xs px-2.5 py-1 rounded-full bg-zinc-100 text-zinc-700">
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>

        </div>

        {/* Recognition */}
        <Reveal delay={0.12}>
          <div className="p-8 bg-white border-2 border-zinc-100 rounded-3xl">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-black rounded-xl flex items-center justify-center shrink-0">
                <Trophy className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-xl font-semibold">Recognition</h3>
            </div>

            <div className="grid sm:grid-cols-2 gap-8">
              <ul className="space-y-2.5">
                {awards.map((a) => (
                  <li key={a.name} className="flex justify-between gap-4 text-sm">
                    <span className="text-zinc-700">{a.name}</span>
                    <span className="text-zinc-400 whitespace-nowrap">{a.date}</span>
                  </li>
                ))}
              </ul>

              <div>
                <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-zinc-500 mb-3">
                  <Users className="w-3.5 h-3.5" />
                  Volunteering
                </div>
                <ul className="space-y-2.5">
                  {volunteering.map((v) => (
                    <li key={v.role} className="text-sm">
                      <div className="text-zinc-700">{v.role}</div>
                      <div className="text-zinc-400 text-xs">{v.org} &middot; {v.date}</div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </Reveal>

      </div>
    </section>
  );
}
