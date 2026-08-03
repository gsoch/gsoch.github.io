import { profile } from '@/data/cv';

export default function Footer() {
  return (
    <footer className="px-6 py-8 bg-white border-t border-zinc-100">
      <div className="max-w-6xl mx-auto flex flex-wrap items-center justify-between gap-4 text-sm text-zinc-500">
        <div>&copy; {new Date().getFullYear()} {profile.name}</div>
        <div>Built with React, Vite & Tailwind CSS</div>
      </div>
    </footer>
  );
}
