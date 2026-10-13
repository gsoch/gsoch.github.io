import { useCallback, useEffect, useState, type CSSProperties } from 'react'
import HeroTrace from '@/components/custom/HeroTrace'
import { MOBILE_CHIP_STACK, MOBILE_FLOORPLAN } from './markup'
import { ABOUT_FACTS, EXPERIENCE, LINKS, NAV, PROJECTS, projectMeta } from './data'
import { useEscape, useReveal, useSectionSnap } from './hooks'
import { Avatar, ChipStack, ContactLinks, OfficeAddress, GOLD, GitHubGlyph, LinkedInGlyph, ProjectDetail, ProjectIcon, SectionIcon, SectionLabel, SubLabel, WhoAmI, Workflow } from './shared'

const NAV_H = 56
const RULE = '1px solid rgba(148,163,184,.14)'
const SECTION: CSSProperties = { position: 'relative', scrollSnapAlign: 'start', padding: '28px 20px 64px', borderBottom: RULE, display: 'flex', flexDirection: 'column', gap: 28 }
const H2: CSSProperties = { margin: 0, fontSize: 'clamp(17px,5.6vw,24px)', lineHeight: 1.3, letterSpacing: '-.01em', textWrap: 'balance' }
const BODY: CSSProperties = { margin: 0, fontSize: 16, lineHeight: 1.65, color: '#aeb8c8', textWrap: 'pretty' }
const SNAP_SUB: CSSProperties = { scrollSnapAlign: 'start', scrollMarginTop: 16 }
const ICON: CSSProperties = { marginRight: 14 }
const Gold = ({ children }: { children: string }) => <span style={{ color: GOLD }}>{children}</span>

export default function Mobile() {
  const [menu, setMenu] = useState(false)
  const [card, setCard] = useState(-1)
  const [scrolled, setScrolled] = useState(false)
  const closeMenu = useCallback(() => setMenu(false), [])
  const closeCard = useCallback(() => setCard(-1), [])
  useReveal(14)
  useSectionSnap(NAV_H, 'mandatory')

  useEffect(() => {
    document.body.classList.add('pf-mobile')
    return () => document.body.classList.remove('pf-mobile')
  }, [])
  useEscape(closeMenu, menu)
  useEscape(closeCard, card >= 0)

  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 24)
    window.addEventListener('scroll', on, { passive: true })
    return () => window.removeEventListener('scroll', on)
  }, [])

  const p = PROJECTS[card]

  return (
    <div id="top" style={{ position: 'relative', maxWidth: 480, margin: '0 auto', minHeight: '100vh', backgroundColor: '#0d1526', backgroundImage: 'linear-gradient(rgba(148,163,184,.05) 1px,transparent 1px),linear-gradient(90deg,rgba(148,163,184,.05) 1px,transparent 1px)', backgroundSize: '20px 20px', borderLeft: '1px solid rgba(148,163,184,.1)', borderRight: '1px solid rgba(148,163,184,.1)' }}>

      <nav style={{ position: 'sticky', top: 0, zIndex: 30, height: NAV_H, padding: '0 8px 0 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'rgba(13,21,38,.86)', backdropFilter: 'blur(12px)', borderBottom: RULE }}>
        <a href="#top" style={{ display: 'flex', alignItems: 'center', gap: 10, color: '#eef1f6', fontWeight: 600, fontSize: 18, letterSpacing: '-.01em' }}>Gabriel Ona</a>
        <button onClick={() => setMenu((m) => !m)} aria-label="Menu" aria-expanded={menu} style={{ width: 44, height: 44, border: 0, background: 'transparent', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 5, cursor: 'pointer', padding: 0 }}>
          {[0, 1, 2].map((i) => <span key={i} style={{ width: 20, height: 1.5, background: '#eef1f6' }} />)}
        </button>
      </nav>

      {menu && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 40, display: 'flex', justifyContent: 'center', background: 'rgba(5,9,18,.6)' }}>
          <div role="dialog" aria-modal="true" aria-label="Menu" style={{ width: '100%', maxWidth: 480, height: '100%', boxSizing: 'border-box', background: '#0d1526', display: 'flex', flexDirection: 'column' }}>
            <div style={{ height: NAV_H, padding: '0 8px 0 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: RULE }}>
              <span style={{ fontSize: 18, fontWeight: 600, letterSpacing: '-.01em' }}>Gabriel Ona</span>
              <button onClick={closeMenu} aria-label="Close" className="pf-close" style={{ width: 44, height: 44, border: 0, background: 'transparent', fontSize: 24, lineHeight: 1, cursor: 'pointer' }}>×</button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', padding: '12px 20px' }}>
              {NAV.map((n) => (
                <a key={n.href} href={n.href} onClick={closeMenu} style={{ display: 'flex', alignItems: 'baseline', gap: 16, padding: '18px 0', borderBottom: RULE, color: '#eef1f6', fontSize: 24, fontWeight: 500, letterSpacing: '-.02em' }}>{n.label}</a>
              ))}
            </div>
          </div>
        </div>
      )}

      <header style={{ position: 'relative', scrollSnapAlign: 'start', overflow: 'hidden', minHeight: `calc(100svh - ${NAV_H}px)`, boxSizing: 'border-box', display: 'flex', flexDirection: 'column', borderBottom: RULE, backgroundColor: '#0d1526', backgroundImage: 'linear-gradient(rgba(148,163,184,.055) 1px,transparent 1px),linear-gradient(90deg,rgba(148,163,184,.055) 1px,transparent 1px)', backgroundSize: '24px 24px' }}>
        <svg aria-hidden width="528" height="960" style={{ position: 'absolute', left: 0, top: 0, pointerEvents: 'none' }}>
          <path d={MOBILE_FLOORPLAN} fill="none" stroke="rgba(148,163,184,.2)" strokeWidth="1" />
        </svg>
        <div aria-hidden style={{ position: 'absolute', left: 24, right: 24, top: 52, pointerEvents: 'none', display: 'flex', flexDirection: 'column' }}>
          <ChipStack html={MOBILE_CHIP_STACK} soft="fpga" />
        </div>
        <div style={{ height: 196 }} />

        <div data-reveal style={{ position: 'relative', flex: 1, padding: '20px 20px 130px', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center', gap: 20 }}>
          <h1 className="pf-serif" style={H2}>“I design dataflows, architectures and algorithms that uncover what’s next in <Gold>AI</Gold>.”</h1>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, textAlign: 'left' }}>
            <Avatar size={44} bgSize={95} bgPos="-23px -42px" />
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <span style={{ fontSize: 15, fontWeight: 600, letterSpacing: '-.01em', color: '#eef1f6', lineHeight: 1 }}>Gabriel Ona</span>
              <span style={{ fontSize: 13, fontWeight: 500, color: GOLD, lineHeight: 1.2 }}>MASc Computer Engineering @ UofT</span>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap', paddingTop: 4 }}>
            <a href={LINKS.linkedin} target="_blank" rel="noopener" aria-label="LinkedIn" className="pf-circle" style={{ width: 38, height: 38 }}><LinkedInGlyph size={17} /></a>
            <a href={LINKS.github} target="_blank" rel="noopener" aria-label="GitHub" className="pf-circle" style={{ width: 38, height: 38 }}><GitHubGlyph size={18} /></a>
            <a href={LINKS.cv} target="_blank" rel="noopener" style={{ height: 38, display: 'flex', padding: 1, boxSizing: 'border-box', background: 'rgba(233,185,73,.55)', clipPath: 'polygon(8px 0,100% 0,100% calc(100% - 8px),calc(100% - 8px) 100%,0 100%,0 8px)', color: GOLD, fontSize: 13, fontWeight: 600 }}>
              <span style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 8, padding: '0 13px', background: '#0d1526', clipPath: 'polygon(7.5px 0,100% 0,100% calc(100% - 7.5px),calc(100% - 7.5px) 100%,0 100%,0 7.5px)' }}>View CV<span>↗</span></span>
            </a>
          </div>
        </div>
        <a href="#about" aria-label="Scroll to About" className="pf-cue" style={{ position: 'relative', alignSelf: 'center', marginBottom: 12, opacity: scrolled ? 0 : 1, pointerEvents: scrolled ? 'none' : 'auto', transition: 'opacity .4s ease', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, padding: '4px 12px', fontSize: 10, fontWeight: 600, letterSpacing: '.2em' }}>
          SCROLL
          <span style={{ position: 'relative', width: 2, height: 40, overflow: 'hidden', background: 'rgba(148,163,184,.3)' }}>
            <span style={{ position: 'absolute', left: 0, top: 0, width: 2, height: 14, background: GOLD, animation: 'scrollCue 1.8s cubic-bezier(.6,0,.3,1) infinite' }} />
          </span>
        </a>
      </header>

      <section id="about" style={SECTION}>
        <SectionLabel fontSize={11} gap={12}>01 / ABOUT</SectionLabel>
        <div data-reveal style={{ display: 'flex', alignItems: 'flex-start', gap: 16 }}>
          <h2 className="pf-serif" style={{ ...H2, flex: 1 }}>Hi, I’m <Gold>Gabriel</Gold>.</h2>
          <SectionIcon name="tide" size={52} style={{ ...ICON, marginTop: -9 }} />
        </div>
        <div data-snap-sub style={SNAP_SUB}><SubLabel fontSize={10}>WHO AM I?</SubLabel></div>
        <WhoAmI style={BODY} />
        <div data-reveal style={{ display: 'flex', flexDirection: 'column', borderTop: '1px solid rgba(233,185,73,.3)' }}>
          {ABOUT_FACTS.map((f) => (
            <div key={f.k} style={{ display: 'grid', gridTemplateColumns: '64px minmax(0,1fr)', gap: 12, padding: '16px 0', borderBottom: '1px solid rgba(148,163,184,.16)' }}>
              <span style={{ fontSize: 11, fontWeight: 600, letterSpacing: '.16em', color: GOLD, paddingTop: 3 }}>{f.k}</span>
              <span style={{ fontSize: 15, lineHeight: 1.5, color: '#eef1f6', textWrap: 'pretty' }}>{f.v}</span>
            </div>
          ))}
        </div>
        <div data-snap-sub style={SNAP_SUB}><SubLabel fontSize={10}>PHILOSOPHY</SubLabel></div>
        <div data-reveal style={{ display: 'flex', alignItems: 'flex-start', gap: 16 }}>
          <h2 className="pf-serif" style={{ ...H2, flex: 1 }}>High-performance hides in <Gold>natural patterns</Gold>.</h2>
          <SectionIcon name="shell" size={52} style={{ ...ICON, marginTop: -5 }} />
        </div>
        <p data-reveal style={BODY}>I believe system architectures and dataflows that reflect the patterns found in nature are how we unveil truly high-performance systems.</p>
        <Workflow />
      </section>

      <section id="research" style={SECTION}>
        <SectionLabel fontSize={11} gap={12}>02 / RESEARCH</SectionLabel>
        <div data-reveal style={{ display: 'flex', alignItems: 'flex-start', gap: 16 }}>
          <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: 8 }}>
            <h3 className="pf-serif" style={H2}>Thesis <Gold>Research</Gold></h3>
            <span style={{ fontSize: 15, lineHeight: 1.5, color: '#9aa6b8', textWrap: 'pretty' }}>In-Network Acceleration for Distributed MoE Inference</span>
          </div>
          <SectionIcon name="book" size={52} style={{ ...ICON, marginTop: -8 }} />
        </div>
        <div data-reveal data-snap-sub style={SNAP_SUB}>
          <HeroTrace reorder />
        </div>
      </section>

      <section id="projects" style={SECTION}>
        <SectionLabel fontSize={11} gap={12}>03 / PROJECTS</SectionLabel>
        <div data-reveal style={{ display: 'flex', alignItems: 'flex-start', gap: 16 }}>
          <h3 className="pf-serif" style={{ ...H2, flex: 1 }}>Things I’ve <Gold>built</Gold>.</h3>
          <SectionIcon name="chipIcon" size={52} style={{ ...ICON, marginTop: -8 }} />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', borderTop: '1px solid rgba(233,185,73,.3)' }}>
          {PROJECTS.map((pr, i) => (
            <article key={pr.code} data-reveal role="button" tabIndex={0} className="pf-row"
              onClick={() => setCard(i)} onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setCard(i) } }}
              style={{ cursor: 'pointer', display: 'grid', gridTemplateColumns: '44px minmax(0,1fr) 16px', gap: 12, padding: '22px 0', borderBottom: '1px solid rgba(148,163,184,.16)' }}>
              <ProjectIcon code={pr.code} size={40} />
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                <span style={{ fontSize: 18, fontWeight: 600, lineHeight: 1.3, letterSpacing: '-.02em', color: '#eef1f6', textWrap: 'balance' }}>{pr.title}</span>
                <span style={{ fontSize: 15, lineHeight: 1.55, color: '#aeb8c8', textWrap: 'pretty' }}>{pr.line}</span>
                <span style={{ fontSize: 11, fontWeight: 600, letterSpacing: '.14em', color: '#9aa6b8' }}>{projectMeta(pr)}</span>
              </div>
              <span aria-hidden style={{ color: GOLD, fontSize: 16, lineHeight: 1.3 }}>→</span>
            </article>
          ))}
        </div>
      </section>

      <section id="experience" style={SECTION}>
        <SectionLabel fontSize={11} gap={12}>04 / EXPERIENCE</SectionLabel>
        <h3 data-reveal className="pf-serif" style={{ ...H2, textWrap: 'wrap' }}>Where I’ve <Gold>been</Gold>.</h3>
        <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', gap: 20, paddingLeft: 20 }}>
          <span style={{ position: 'absolute', left: 3, top: 6, bottom: 6, width: 1, background: 'rgba(233,185,73,.35)' }} />
          {EXPERIENCE.map((e) => (
            <div key={e.role + e.date} data-reveal style={{ position: 'relative', display: 'flex', flexDirection: 'column', gap: 4 }}>
              <span style={{ position: 'absolute', left: -20, top: 6, width: 7, height: 7, background: GOLD }} />
              <span style={{ fontSize: 16, fontWeight: 600, lineHeight: 1.3, letterSpacing: '-.015em', color: '#eef1f6' }}>{e.role}</span>
              <span style={{ fontSize: 14, lineHeight: 1.4, color: '#aeb8c8' }}>{e.org}<span style={{ fontSize: 11, fontWeight: 600, letterSpacing: '.12em', color: '#9aa6b8' }}>{e.labTxt}</span></span>
              <span style={{ fontSize: 11, fontWeight: 600, letterSpacing: '.12em', color: GOLD }}>{e.date}</span>
            </div>
          ))}
        </div>
      </section>

      <section id="publications" style={SECTION}>
        <SectionLabel fontSize={11} gap={12}>05 / PUBLICATIONS</SectionLabel>
        <a data-reveal href={LINKS.paper} target="_blank" rel="noopener" className="pf-pub" style={{ padding: 20, display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, fontWeight: 600, letterSpacing: '.16em' }}><span style={{ color: GOLD }}>JOURNAL ARTICLE</span><span style={{ color: '#9aa6b8' }}>2025</span></div>
          <span style={{ fontSize: 18, fontWeight: 600, lineHeight: 1.35, letterSpacing: '-.015em', textWrap: 'balance' }}>An Open-source UAV Digital Twin Framework: A Case Study on Remote Sensing in the Andean Mountains</span>
          <span style={{ fontSize: 14, color: '#aeb8c8' }}>E. Valencia, F. Toapanta, <span style={{ color: '#eef1f6', fontWeight: 600 }}>G. Ona</span>, et al.</span>
          <span style={{ fontSize: 13, color: '#9aa6b8', fontStyle: 'italic' }}>J. Intelligent &amp; Robotic Systems, 111(71)</span>
          <span style={{ fontSize: 13, fontWeight: 600, color: GOLD }}>Read paper ↗</span>
        </a>
      </section>

      <section id="contact" style={{ ...SECTION, padding: '28px 20px 40px', borderBottom: 'none' }}>
        <SectionLabel fontSize={11} gap={12}>06 / CONTACT</SectionLabel>
        <h2 data-reveal className="pf-serif" style={{ ...H2, textWrap: 'wrap' }}>Contact</h2>
        <div style={{ display: 'flex', alignItems: 'flex-start', flexWrap: 'wrap', gap: '24px 24px' }}>
          <OfficeAddress size={15} />
          <div data-reveal style={{ display: 'flex', gap: 16, flexWrap: 'wrap', width: '100%', justifyContent: 'center' }}>
            <ContactLinks size={52} glyph={20} cvFont={13} />
          </div>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: 24, fontSize: 11, fontWeight: 500, letterSpacing: '.1em', color: '#8794a8' }}><span>© 2026 GABRIEL ONA</span></div>
      </section>

      {p && (
        <div onClick={closeCard} style={{ position: 'fixed', inset: 0, zIndex: 60, background: 'rgba(5,9,18,.72)', backdropFilter: 'blur(6px)', display: 'flex', alignItems: 'flex-end', justifyContent: 'center' }}>
          <div role="dialog" aria-modal="true" aria-label={p.title} onClick={(e) => e.stopPropagation()} style={{ width: '100%', maxWidth: 480, maxHeight: '88vh', overflowY: 'auto', boxSizing: 'border-box', background: '#0f1829', borderTop: '1px solid rgba(233,185,73,.4)', padding: '20px 20px 32px', display: 'flex', flexDirection: 'column', gap: 18 }}>
            <ProjectDetail p={p} onClose={closeCard} titleSize={26} lineSize={15} />
          </div>
        </div>
      )}
    </div>
  )
}
