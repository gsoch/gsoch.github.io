import { useState, useEffect, useRef } from 'react';
import { Home, Briefcase, BookOpen, Mail, Menu, X, type LucideIcon } from 'lucide-react';
import { AnimatePresence, motion, useScroll, useTransform } from 'motion/react';
import { profile } from '@/data/cv';

const NAV_ICONS = { home: Home, work: Briefcase, publications: BookOpen, contact: Mail };
// Two thresholds (not one) so a scroll position hovering right at the edge
// doesn't flicker the nav between merged/split every frame — collapse a bit
// later than it expands.
const MOBILE_COLLAPSE_AT = 260;
const MOBILE_EXPAND_AT = 100;
// Shared easing so the full header's slide-out and the reduced header's
// slide-in read as one continuous motion rather than two separate timings.
const NAV_EASE: [number, number, number, number] = [0.4, 0, 0.2, 1];

// Icon-on-top, caption-below control used throughout the mobile nav — the
// active indicator is a rounded rect (not a circle) since the button itself
// is taller than it is wide once a caption is stacked under the icon.
function NavIconButton({
  label,
  Icon,
  active,
  onClick,
  layoutId,
}: {
  label: string;
  Icon: LucideIcon;
  active: boolean;
  onClick: () => void;
  layoutId: string;
}) {
  return (
    <button
      onClick={onClick}
      aria-label={label}
      title={label}
      className="relative flex flex-col items-center justify-center w-13 h-12 rounded-xl gap-0.5 transition-colors"
    >
      {active && (
        <motion.div
          layoutId={layoutId}
          className="absolute inset-0 bg-black rounded-xl"
          transition={{ type: 'spring', stiffness: 380, damping: 30 }}
        />
      )}
      <Icon className={`relative z-10 w-4 h-4 ${active ? 'text-white' : 'text-black'}`} />
      <span className={`relative z-10 text-[9px] leading-none font-medium ${active ? 'text-white' : 'text-black/60'}`}>
        {label}
      </span>
    </button>
  );
}

export default function Navbar() {
  const [activeSection, setActiveSection] = useState('home');
  const [isScrolled, setIsScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const { scrollY } = useScroll();

  // Transform scroll into blur and background opacity — capped well below
  // fully opaque so the floating pill keeps its glassy, see-through quality
  // the whole way down the page instead of settling into a near-solid white
  // bar once scrolled past the hero. Desktop only — see mobileNavBg/Blur
  // below for why mobile doesn't use this continuous form.
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

  // The mobile header's position/opacity track scrollY directly (via
  // useTransform, not the isScrolled boolean) so the slide feels glued to
  // the actual scroll gesture instead of lagging a frame or two behind a
  // state update — this is what made it look "not quite right" before.
  // transform/opacity are cheap to animate continuously. backdrop-filter is
  // not — the earlier fix (a constant blur value, not one recalculated per
  // scroll frame) turned out not to be enough, because blur has to keep
  // re-sampling whatever page content sits behind it as that content
  // scrolls past, independent of whether the blur amount itself is
  // changing. That cost is real on iOS Safari even for a single blurred
  // layer, and mobile stacks up to three (full header + hamburger pill +
  // Contact/CV pill) versus desktop's one — matching the report that this
  // is fine on desktop but very slow on iPhone specifically. So mobile
  // drops backdrop-filter entirely and leans on a more opaque solid fill
  // for legibility instead — desktop's navBackground/backdropBlur above are
  // untouched.
  const fullHeaderY = useTransform(scrollY, [MOBILE_EXPAND_AT, MOBILE_COLLAPSE_AT], [0, -72]);
  const fullHeaderOpacity = useTransform(scrollY, [MOBILE_EXPAND_AT, MOBILE_COLLAPSE_AT], [1, 0]);
  const reducedHeaderY = useTransform(scrollY, [MOBILE_EXPAND_AT, MOBILE_COLLAPSE_AT], [-72, 0]);
  const reducedHeaderOpacity = useTransform(scrollY, [MOBILE_EXPAND_AT, MOBILE_COLLAPSE_AT], [0, 1]);
  const mobileNavBg = '#ffffff';

  const navItems = [
    { id: 'home', label: 'Home' },
    { id: 'work', label: 'Work' },
    { id: 'publications', label: 'Publications' },
    { id: 'contact', label: 'Contact' },
  ];
  const collapsibleItems = navItems.filter((item) => item.id !== 'contact');
  const contactItem = navItems.find((item) => item.id === 'contact')!;

  // Sections are static for the life of the page — querying the DOM for
  // them on every scroll event (as this used to) forces a fresh layout
  // read each time and was a real contributor to scroll jank on iOS.
  // Query once and reuse.
  const sectionsRef = useRef<HTMLElement[]>([]);
  useEffect(() => {
    sectionsRef.current = Array.from(document.querySelectorAll('section[id]'));
  }, []);

  useEffect(() => {
    // rAF-throttled and passive: a non-passive listener forces the browser
    // to wait for this handler before it can paint the next scroll frame,
    // which is the single biggest cause of scroll stutter on iOS Safari —
    // doing real work (state updates, a11y reads) on literally every
    // native scroll event compounds that.
    let ticking = false;
    const handleScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const scrollPosition = window.scrollY + 200;

        for (const section of sectionsRef.current) {
          const sectionTop = section.offsetTop;
          const sectionHeight = section.offsetHeight;
          if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
            setActiveSection(section.id);
            break;
          }
        }

        setIsScrolled((prev) => {
          if (!prev && window.scrollY > MOBILE_COLLAPSE_AT) return true;
          if (prev && window.scrollY < MOBILE_EXPAND_AT) return false;
          return prev;
        });

        ticking = false;
      });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Scrolling back up past the threshold restores the full icon row —
  // the hamburger's dropdown shouldn't stay open into that state.
  useEffect(() => {
    if (!isScrolled) setIsOpen(false);
  }, [isScrolled]);

  const scrollToSection = (sectionId: string) => {
    const section = document.getElementById(sectionId);
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
    }
    setIsOpen(false);
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

      {/* Mobile Navbar — two pills that read as a single merged box at the
          top of the page (touching, flat inner edges — no gap, no seam
          radius) and separate to opposite screen edges past
          MOBILE_COLLAPSE_AT scroll — no more resize/width-tween dance
          fighting itself: the full header just translates up and out while
          the reduced one translates down into the same slot, both simple
          transform+opacity, which is also far cheaper to animate than the
          old layout-FLIP/width-tween combination. */}
      <div className="fixed top-4 inset-x-4 z-50 lg:hidden h-12">
        {/* Full header — every item in one box, visible at the top of the
            page */}
        <motion.div
          style={{ y: fullHeaderY, opacity: fullHeaderOpacity, pointerEvents: isScrolled ? 'none' : 'auto' }}
          className="absolute inset-x-0 top-0 flex justify-center"
        >
          <motion.div
            style={{
              backgroundColor: mobileNavBg,
            }}
            className="rounded-2xl border border-black/10 shadow-lg shadow-black/5"
          >
            <div className="px-1.5 py-1 flex items-center gap-1">
              {collapsibleItems.map((item) => (
                <NavIconButton
                  key={item.id}
                  label={item.label}
                  Icon={NAV_ICONS[item.id as keyof typeof NAV_ICONS]}
                  active={activeSection === item.id}
                  onClick={() => scrollToSection(item.id)}
                  layoutId="activeSectionMobile"
                />
              ))}
              <NavIconButton
                label={contactItem.label}
                Icon={Mail}
                active={activeSection === contactItem.id}
                onClick={() => scrollToSection(contactItem.id)}
                layoutId="activeSectionMobile"
              />
              <div className="w-px h-6 bg-black/10 mx-0.5" />
              <a
                href={profile.cv}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 bg-black text-white rounded-full text-sm font-medium"
              >
                CV
              </a>
            </div>
          </motion.div>
        </motion.div>

        {/* Reduced header — hamburger left, Contact + CV right, slides down
            into view once scrolled */}
        <motion.div
          style={{ y: reducedHeaderY, opacity: reducedHeaderOpacity, pointerEvents: isScrolled ? 'auto' : 'none' }}
          className="absolute inset-x-0 top-0 flex items-center justify-between"
        >
          <motion.div
            style={{
              backgroundColor: mobileNavBg,
            }}
            className="relative rounded-2xl border border-black/10 shadow-lg shadow-black/5"
          >
            <div className="px-1.5 py-1 flex items-center">
              <NavIconButton
                label="Menu"
                Icon={isOpen ? X : Menu}
                active={isOpen}
                onClick={() => setIsOpen((o) => !o)}
                layoutId="menuActiveMobile"
              />
            </div>

            {/* Hamburger dropdown — each item keeps its own individual pill
                contour (not one shared panel) and floats below as an
                overlay so it can never affect the hamburger pill's size. */}
            <AnimatePresence>
              {isScrolled && isOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.2, ease: NAV_EASE }}
                  className="absolute top-full left-0 mt-2 flex items-center gap-1.5"
                >
                  {collapsibleItems.map((item) => (
                    <motion.div
                      key={item.id}
                      style={{
                        backgroundColor: mobileNavBg,
                      }}
                      className="rounded-xl border border-black/10 shadow-lg shadow-black/5"
                    >
                      <NavIconButton
                        label={item.label}
                        Icon={NAV_ICONS[item.id as keyof typeof NAV_ICONS]}
                        active={activeSection === item.id}
                        onClick={() => scrollToSection(item.id)}
                        layoutId="activeSectionMobileDropdown"
                      />
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          <motion.div
            style={{
              backgroundColor: mobileNavBg,
            }}
            className="rounded-2xl border border-black/10 shadow-lg shadow-black/5"
          >
            <div className="px-1.5 py-1 flex items-center gap-1">
              <NavIconButton
                label={contactItem.label}
                Icon={Mail}
                active={activeSection === contactItem.id}
                onClick={() => scrollToSection(contactItem.id)}
                layoutId="activeSectionMobileRight"
              />
              <div className="w-px h-6 bg-black/10 mx-0.5" />
              <a
                href={profile.cv}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 bg-black text-white rounded-full text-sm font-medium"
              >
                CV
              </a>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </>
  );
}
