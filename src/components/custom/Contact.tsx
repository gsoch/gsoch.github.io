import { Mail, Download } from 'lucide-react';
import { Reveal } from '@/components/utils/utils';
import { GithubIcon, LinkedinIcon } from '@/components/custom/BrandIcons';
import { profile } from '@/data/cv';

export default function Contact() {
  return (
    <section id="contact" className="py-16 md:py-32 px-4 sm:px-6">
      <div className="max-w-3xl mx-auto text-center">

        <Reveal>
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-4 md:mb-6">
            Let's talk systems
          </h2>

          <div className="w-20 h-1 bg-black mb-6 md:mb-8 mx-auto"></div>

          <p className="text-base sm:text-lg text-zinc-600 leading-relaxed mb-8 md:mb-10 max-w-xl mx-auto">
            I'm always open to discussing research, hardware/software co-design, or opportunities in
            HPC and AI systems. Reach out by email or find me on GitHub and LinkedIn.
          </p>

          <div className="flex flex-wrap justify-center gap-3 sm:gap-4 mb-8 md:mb-10">
            <a
              href={`mailto:${profile.email}`}
              className="inline-flex items-center gap-2 rounded-md bg-stone-900 px-6 py-3 text-sm text-white hover:bg-zinc-800 transition"
            >
              <Mail className="w-4 h-4" />
              Email Me
            </a>

            <a
              href={profile.cv}
              download
              className="inline-flex items-center gap-2 rounded-md border border-stone-300 bg-white px-6 py-3 text-sm hover:bg-stone-50 transition"
            >
              <Download className="w-4 h-4" />
              Download CV
            </a>
          </div>

          <div className="flex justify-center gap-6">
            <a
              href={profile.github}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub"
              className="text-zinc-500 hover:text-black transition"
            >
              <GithubIcon className="w-6 h-6" />
            </a>
            <a
              href={profile.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn"
              className="text-zinc-500 hover:text-black transition"
            >
              <LinkedinIcon className="w-6 h-6" />
            </a>
          </div>
        </Reveal>

      </div>
    </section>
  );
}
