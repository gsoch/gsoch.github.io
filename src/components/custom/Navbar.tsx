import { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import { motion, useScroll, useTransform } from 'motion/react';
import { profile } from '@/data/cv';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const { scrollY } = useScroll();

  // Transform scroll into blur and background opacity — capped well below
  // fully opaque so the floating pill keeps its glassy, see-through quality
  // the whole way down the page instead of settling into a near-solid white
  // bar once scrolled past the hero.
  const navBackground = useTransform(
    scrollY,
    [0, 100],
    ['rgba(255, 255, 255, 0)', 'rgba(255, 255, 255, 0.45)']
  );

  const backdropBlur = useTransform(
    scrollY,
    [0, 100],
    ['blur(0px)', 'blur(8px)']
  );

  const navItems = [
    { id: 'home', label: 'Home' },
    { id: 'work', label: 'Work' },
    { id: 'publications', label: 'Publications' },
    { id: 'contact', label: 'Contact' },
  ];

  useEffect(() => {
    const handleScroll = () => {
      const sections = document.querySelectorAll('section[id]');
      const scrollPosition = window.scrollY + 200;

      sections.forEach((section) => {
        const sectionTop = (section as HTMLElement).offsetTop;
        const sectionHeight = (section as HTMLElement).offsetHeight;
        const sectionId = section.getAttribute('id') || '';

        if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
          setActiveSection(sectionId);
        }
      });
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (sectionId: string) => {
    const section = document.getElementById(sectionId);
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
      setIsOpen(false);
    }
  };

  return (
    <>
      {/* Desktop Navbar */}
      <motion.nav
        className="fixed top-6 left-1/2 -translate-x-1/2 z-50 hidden lg:block"
      >
        {/* Background/blur live on this rounded element, not the outer nav
            (which has no border-radius) — otherwise the blur paints as a
            plain rectangle that pokes out past the pill's rounded corners. */}
        <motion.div
          style={{
            backgroundColor: navBackground,
            backdropFilter: backdropBlur,
            WebkitBackdropFilter: backdropBlur,
          }}
          className="px-6 py-1 rounded-full border border-black/10 shadow-2xl shadow-black/5"
        >
          <div className="flex items-center gap-2">
            {navItems.map((item, index) => (
              <motion.button
                key={item.id}
                onClick={() => scrollToSection(item.id)}
                className="relative px-6 py-2 rounded-full transition-colors overflow-hidden group"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                {/* Active indicator */}
                {activeSection === item.id && (
                  <motion.div
                    layoutId="activeSection"
                    className="absolute inset-0 bg-black rounded-full"
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  />
                )}

                {/* Hover effect */}
                <motion.div
                  className="absolute inset-0 bg-black/5 rounded-full opacity-0 group-hover:opacity-100"
                  transition={{ duration: 0.2 }}
                />

                <span
                  className={`relative z-10 font-medium transition-colors ${
                    activeSection === item.id ? 'text-white' : 'text-black'
                  }`}
                >
                  {item.label}
                </span>
              </motion.button>
            ))}

            {/* Separator */}
            <div className="w-px h-7 bg-black/10 mx-2" />

            {/* CTA Button */}
            <motion.a
              href={profile.cv}
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-2 bg-black text-white rounded-full font-medium hover:bg-zinc-800 transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              CV
            </motion.a>
          </div>
        </motion.div>
      </motion.nav>

      {/* Mobile Navbar — floating rounded pill/card, same language as the
          desktop nav, instead of a full-bleed hard-cornered bar (which read
          as a flat white rectangle once scrolled). */}
      <motion.nav
        style={{
          backgroundColor: navBackground,
          backdropFilter: backdropBlur,
          WebkitBackdropFilter: backdropBlur,
        }}
        className="fixed top-4 left-4 right-4 z-50 lg:hidden rounded-2xl border border-black/10 shadow-lg shadow-black/5 overflow-hidden"
      >
        <div className="px-5 py-3 flex items-center justify-between">
          <motion.div
            className="text-xl font-bold tracking-wide"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            GO
          </motion.div>

          <motion.button
            onClick={() => setIsOpen(!isOpen)}
            className="p-2 hover:bg-black/5 rounded-full transition-colors"
            whileTap={{ scale: 0.9 }}
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </motion.button>
        </div>

        {/* Mobile Menu */}
        <motion.div
          initial={false}
          animate={{
            height: isOpen ? 'auto' : 0,
            opacity: isOpen ? 1 : 0,
          }}
          transition={{ duration: 0.3, ease: 'easeInOut' }}
          className="overflow-hidden bg-white/95 backdrop-blur-xl border-t border-black/5"
        >
          <div className="px-6 py-6 space-y-2">
            {navItems.map((item, index) => (
              <motion.button
                key={item.id}
                onClick={() => scrollToSection(item.id)}
                className={`block w-full text-left px-6 py-3 rounded-xl transition-colors ${
                  activeSection === item.id
                    ? 'bg-black text-white'
                    : 'hover:bg-black/5'
                }`}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: isOpen ? 1 : 0, x: isOpen ? 0 : -20 }}
                transition={{ delay: index * 0.05 }}
                whileTap={{ scale: 0.98 }}
              >
                {item.label}
              </motion.button>
            ))}

            <motion.a
              href={profile.cv}
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full text-center px-6 py-3 bg-black text-white rounded-xl font-medium mt-4"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: isOpen ? 1 : 0, x: isOpen ? 0 : -20 }}
              transition={{ delay: 0.2 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setIsOpen(false)}
            >
              CV
            </motion.a>
          </div>
        </motion.div>
      </motion.nav>
    </>
  );
}
