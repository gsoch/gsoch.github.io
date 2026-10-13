import { useCallback, useLayoutEffect, useRef, useState, type CSSProperties } from 'react'
import HeroTrace from '@/components/custom/HeroTrace'
import { DESKTOP_CHIP_STACK, DESKTOP_FLOORPLAN } from './markup'
import { ABOUT_FACTS, EXPERIENCE, LINKS, NAV, ORG_LOGOS, PROJECTS, projectMeta } from './data'
import { useEscape, useReveal, useSectionSnap } from './hooks'
import { Avatar, ChipStack, ContactLinks, OfficeAddress, GOLD, GitHubGlyph, LinkedInGlyph, ProjectDetail, ProjectIcon, SectionIcon, SectionLabel, SubLabel, WhoAmI, Workflow } from './shared'

const WRAP: CSSProperties = { maxWidth: 1200, margin: '0 auto', boxSizing: 'border-box' }
const SECTION: CSSProperties = { ...WRAP, padding: '104px 32px', display: 'flex', flexDirection: 'column', gap: 48 }
const RULE = '1px solid rgba(148,163,184,.14)'
const H2: CSSProperties = { margin: 0, fontSize: 'clamp(28px,3vw,42px)', lineHeight: 1.25, letterSpacing: '-.01em', textWrap: 'balance' }
const BODY: CSSProperties = { margin: 0, fontSize: 17, lineHeight: 1.7, maxWidth: 640, color: '#aeb8c8', textWrap: 'pretty' }
const Gold = ({ children }: { children: string }) => <span style={{ color: GOLD }}>{children}</span>

// Gold-framed photo with corner ticks. `crop` mirrors the design's image-slot
// framing: cover-fit, then scale `s` about a center offset by (x%, y%).
function FramedPhoto({ src, alt, ticks, crop = { s: 1, x: 0, y: 0 } }: { src: string; alt: string; ticks: 'tl-br' | 'tr-bl'; crop?: { s: number; x: number; y: number } }) {
  const tick: CSSProperties = { position: 'absolute', width: 10, height: 10, background: GOLD }
  const [a, b]: CSSProperties[] = ticks === 'tl-br' ? [{ left: -6, top: -6 }, { right: -6, bottom: -6 }] : [{ right: -6, top: -6 }, { left: -6, bottom: -6 }]
  return (
    <div style={{ position: 'relative', width: '100%', aspectRatio: '4/5', border: `1.5px solid ${GOLD}`, padding: 10, boxSizing: 'border-box' }}>
      <div style={{ position: 'relative', width: '100%', height: '100%', overflow: 'hidden' }}>
        <img src={src} alt={alt} loading="lazy" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', transform: `translate(${crop.x}%, ${crop.y}%) scale(${crop.s})` }} />
      </div>
      <span style={{ ...tick, ...a }} /><span style={{ ...tick, ...b }} />
    </div>
  )
}

export default function Desktop() {
  const [card, setCard] = useState(-1)
  const [exp, setExp] = useState(0)
  const closeCard = useCallback(() => setCard(-1), [])
  const floorRef = useRef<SVGSVGElement>(null)
  useReveal(18)
  useEscape(closeCard, card >= 0)
  useSectionSnap(60, 'proximity')

  // Snap the floorplan to the body's 24px grid.
  useLayoutEffect(() => {
    const fp = floorRef.current; if (!fp?.parentElement) return
    const align = () => { const t = fp.parentElement!.getBoundingClientRect().top + window.scrollY; fp.style.top = -(t % 24) + 'px' }
    align(); window.addEventListener('resize', align)
    return () => window.removeEventListener('resize', align)
  }, [])

  const activeOrg = EXPERIENCE[exp].org
  const orgs = [...new Set(EXPERIENCE.map((x) => x.org))]
  const p = PROJECTS[card]

  return (
    <>
      <nav style={{ position: 'sticky', top: 0, zIndex: 20, background: 'rgba(13,21,38,.82)', backdropFilter: 'blur(10px)', borderBottom: RULE }}>
        <div style={{ ...WRAP, padding: '0 32px', height: 60, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 24 }}>
          <a href="#top" style={{ display: 'flex', alignItems: 'center', gap: 10, color: '#eef1f6', fontWeight: 600, fontSize: 19, letterSpacing: '-.01em' }}>Gabriel Ona</a>
          <div style={{ display: 'flex', gap: 26, flexWrap: 'wrap', fontSize: 12, fontWeight: 500, lineHeight: 1, letterSpacing: '.12em', textTransform: 'uppercase' }}>
            {NAV.map((n) => n.label === 'Contact'
              ? <a key={n.href} href={n.href} style={{ color: GOLD }}>{n.label}</a>
              : <a key={n.href} href={n.href} className="pf-nav">{n.label}</a>)}
          </div>
        </div>
      </nav>

      <header id="top" style={{ position: 'relative', overflow: 'hidden', borderBottom: RULE }}>
        <svg ref={floorRef} aria-hidden width="2568" height="1032" style={{ position: 'absolute', left: 0, top: 0, pointerEvents: 'none' }}>
          <path d={DESKTOP_FLOORPLAN} fill="none" stroke="rgba(148,163,184,.2)" strokeWidth="1" />
        </svg>
        <div style={{ ...WRAP, position: 'relative', minHeight: 'min(calc(100vh - 60px),980px)', padding: 'clamp(24px,5vh,56px) 32px clamp(32px,6vh,72px)', display: 'flex', flexDirection: 'column-reverse', alignItems: 'center', justifyContent: 'center', gap: 'clamp(28px,5vh,64px)' }}>
          <div data-reveal style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: 22, maxWidth: 860 }}>
            <h1 className="pf-serif" style={{ ...H2, maxWidth: 860 }}>“I design dataflows, architectures and algorithms<br />that uncover what’s next in <Gold>AI</Gold>.”</h1>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14, textAlign: 'left' }}>
              <Avatar size={64} bgSize={138} bgPos="-33px -60px" />
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                <span style={{ fontSize: 18, fontWeight: 600, lineHeight: 1, letterSpacing: '-.01em', color: '#eef1f6' }}>Gabriel Ona</span>
                <span style={{ fontSize: 16, fontWeight: 500, lineHeight: 1, color: GOLD, letterSpacing: '-.005em' }}>MASc Computer Engineering @ UofT</span>
              </div>
            </div>
            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', justifyContent: 'center', paddingTop: 4 }}>
              <a href={LINKS.linkedin} target="_blank" rel="noopener" aria-label="LinkedIn" className="pf-circle" style={{ width: 46, height: 46 }}><LinkedInGlyph size={18} /></a>
              <a href={LINKS.github} target="_blank" rel="noopener" aria-label="GitHub" className="pf-circle" style={{ width: 46, height: 46 }}><GitHubGlyph size={19} /></a>
              <a href={LINKS.cv} target="_blank" rel="noopener" className="pf-cv" style={{ display: 'flex', alignItems: 'center', gap: 10, height: 46, padding: '0 22px', boxSizing: 'border-box', fontSize: 14, fontWeight: 600, lineHeight: 1 }}>View CV</a>
            </div>
          </div>

          <div aria-hidden style={{ width: '100%', maxWidth: 'clamp(560px,calc((100vh - 360px) * 2.2),860px)', display: 'flex', flexDirection: 'column' }}>
            <ChipStack html={DESKTOP_CHIP_STACK} soft="fpga,npu" />
          </div>
        </div>
      </header>

      <section id="about" style={{ borderBottom: RULE }}>
        <div style={{ ...WRAP, padding: '104px 32px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(min(100%,300px),1fr))', gap: 64, alignItems: 'start' }}>
          <div data-reveal style={{ alignSelf: 'stretch', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: 48, maxWidth: 340 }}>
            <FramedPhoto src="/assets/headshot.jpg" alt="Gabriel Ona" ticks="tl-br" crop={{ s: 1.3747, x: 3.327, y: -8.794 }} />
            <FramedPhoto src="/assets/philosophy.webp" alt="" ticks="tr-bl" />
          </div>
          <div data-reveal style={{ gridColumn: 'span 2', minWidth: 'min(100%,520px)', display: 'flex', flexDirection: 'column', gap: 32 }}>
            <SectionLabel fontSize={12} gap={14}>01 / ABOUT</SectionLabel>
            <div data-reveal style={{ display: 'flex', alignItems: 'flex-start', gap: 24 }}>
              <h2 className="pf-serif" style={{ ...H2, flex: 1 }}>Hi, I’m <Gold>Gabriel</Gold>.</h2>
              <SectionIcon name="tide" size={64} style={{ marginTop: -9 }} />
            </div>
            <div data-snap-sub><SubLabel fontSize={11}>WHO AM I?</SubLabel></div>
            <WhoAmI style={BODY} />
            <div data-reveal style={{ display: 'flex', flexDirection: 'column', borderTop: '1px solid rgba(233,185,73,.3)' }}>
              {ABOUT_FACTS.map((f) => (
                <div key={f.k} style={{ display: 'grid', gridTemplateColumns: '96px minmax(0,1fr)', gap: 16, padding: '18px 0', borderBottom: '1px solid rgba(148,163,184,.16)' }}>
                  <span style={{ fontSize: 11, fontWeight: 600, letterSpacing: '.16em', color: GOLD, paddingTop: 3 }}>{f.k}</span>
                  <span style={{ fontSize: 16, lineHeight: 1.5, color: '#eef1f6', textWrap: 'pretty' }}>{f.v}</span>
                </div>
              ))}
            </div>
            <div data-snap-sub><SubLabel fontSize={11}>PHILOSOPHY</SubLabel></div>
            <div data-reveal style={{ display: 'flex', alignItems: 'flex-start', gap: 24 }}>
              <h2 className="pf-serif" style={{ ...H2, flex: 1 }}>High-performance hides in <Gold>natural patterns</Gold>.</h2>
              <SectionIcon name="shell" size={64} style={{ marginTop: -5 }} />
            </div>
            <p data-reveal style={BODY}>I believe system architectures and dataflows that reflect the patterns found in nature are how we unveil truly high-performance systems.</p>
            <Workflow />
          </div>
        </div>
      </section>

      <section id="research" style={{ borderBottom: RULE }}>
        <div style={SECTION}>
          <SectionLabel fontSize={12} gap={14}>02 / RESEARCH</SectionLabel>
          <div data-reveal style={{ display: 'flex', alignItems: 'flex-start', gap: 24 }}>
            <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: 10 }}>
              <h3 className="pf-serif" style={H2}>Thesis <Gold>Research</Gold></h3>
              <span style={{ fontSize: 17, lineHeight: 1.5, color: '#9aa6b8', textWrap: 'pretty' }}>In-Network Acceleration for Distributed MoE Inference</span>
            </div>
            <SectionIcon name="book" size={64} style={{ marginTop: -6 }} />
          </div>
          <div data-reveal style={{ width: '100%', maxWidth: 900, margin: '0 auto', display: 'flex', justifyContent: 'center' }}>
            <HeroTrace reorder />
          </div>
        </div>
      </section>

      <section id="projects" style={{ borderBottom: RULE }}>
        <div style={SECTION}>
          <SectionLabel fontSize={12} gap={14}>03 / PROJECTS</SectionLabel>
          <div data-reveal style={{ display: 'flex', alignItems: 'flex-start', gap: 24 }}>
            <h3 className="pf-serif" style={{ ...H2, flex: 1 }}>Things I’ve <Gold>built</Gold>.</h3>
            <SectionIcon name="chipIcon" size={64} style={{ marginTop: -6 }} />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', borderTop: '1px solid rgba(233,185,73,.3)' }}>
            {PROJECTS.map((pr, i) => (
              <article key={pr.code} data-reveal role="button" tabIndex={0} className="pf-row"
                onClick={() => setCard(i)} onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setCard(i) } }}
                style={{ cursor: 'pointer', display: 'grid', gridTemplateColumns: '56px minmax(0,1fr) 24px', alignItems: 'center', gap: 24, padding: '26px 16px', margin: '0 -16px', borderBottom: '1px solid rgba(148,163,184,.16)' }}>
                <ProjectIcon code={pr.code} size={48} />
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  <span style={{ fontSize: 20, fontWeight: 600, lineHeight: 1.3, letterSpacing: '-.015em', color: '#eef1f6', textWrap: 'balance' }}>{pr.title}</span>
                  <span style={{ fontSize: 16, lineHeight: 1.55, color: '#aeb8c8', textWrap: 'pretty' }}>{pr.line}</span>
                  <span style={{ fontSize: 11, fontWeight: 600, lineHeight: 1.4, letterSpacing: '.14em', color: '#9aa6b8' }}>{projectMeta(pr)}</span>
                </div>
                <span aria-hidden style={{ color: GOLD, fontSize: 18 }}>→</span>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="experience" style={{ borderBottom: RULE }}>
        <div style={SECTION}>
          <SectionLabel fontSize={12} gap={14}>04 / EXPERIENCE</SectionLabel>
          <h3 data-reveal className="pf-serif" style={H2}>Where I’ve <Gold>been</Gold>.</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1.15fr) minmax(0,1fr)', gap: '48px clamp(24px,5vw,64px)', alignItems: 'start' }}>
            <div onMouseLeave={() => setExp(0)} style={{ position: 'relative', display: 'flex', flexDirection: 'column', gap: 6, paddingLeft: 28 }}>
              <span style={{ position: 'absolute', left: 3, top: 20, bottom: 20, width: 1, background: 'rgba(233,185,73,.35)' }} />
              {EXPERIENCE.map((e, i) => (
                <div key={e.role + e.date} data-reveal onMouseEnter={() => setExp(i)} style={{ position: 'relative', padding: '11px 0', cursor: 'default' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 6, opacity: exp === i ? 1 : 0.4, transition: 'opacity .25s' }}>
                    <span style={{ position: 'absolute', left: -28, top: 20, width: 7, height: 7, background: GOLD }} />
                    <span style={{ fontSize: 19, fontWeight: 600, lineHeight: 1.3, letterSpacing: '-.015em', color: '#eef1f6' }}>{e.role}</span>
                    <span style={{ fontSize: 15, lineHeight: 1.4, color: '#aeb8c8' }}>{e.org}<span style={{ fontSize: 11, fontWeight: 600, lineHeight: 1, letterSpacing: '.12em', color: '#9aa6b8' }}>{e.labTxt}</span></span>
                    <span style={{ fontSize: 11, fontWeight: 600, lineHeight: 1.4, letterSpacing: '.12em', color: GOLD }}>{e.date}</span>
                  </div>
                </div>
              ))}
            </div>
            <div data-reveal style={{ position: 'sticky', top: 120, width: '100%', aspectRatio: '4/3' }}>
              {orgs.map((o) => {
                const lg = ORG_LOGOS[o], on = o === activeOrg
                return (
                  <div key={o} style={{ position: 'absolute', inset: 0, padding: 48, boxSizing: 'border-box', display: 'flex', flexDirection: 'column', gap: 20, opacity: on ? 1 : 0, pointerEvents: on ? 'auto' : 'none', transition: 'opacity .35s' }}>
                    <div style={{ flex: 1, minHeight: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <div role="img" aria-label={o.toUpperCase()} style={{ width: lg.w, height: '100%', backgroundImage: `url("${lg.src}")`, backgroundSize: 'contain', backgroundPosition: 'center', backgroundRepeat: 'no-repeat', filter: lg.filter, transform: `scale(${lg.scale})` }} />
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </section>

      <section id="publications" style={{ borderBottom: RULE }}>
        <div style={SECTION}>
          <SectionLabel fontSize={12} gap={14}>05 / PUBLICATIONS</SectionLabel>
          <a data-reveal href={LINKS.paper} target="_blank" rel="noopener" className="pf-pub" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(min(100%,220px),1fr))', gap: '16px 40px', padding: 32 }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <span style={{ fontSize: 11, fontWeight: 600, lineHeight: 1, letterSpacing: '.16em', color: GOLD }}>JOURNAL ARTICLE</span>
              <span style={{ fontSize: 44, fontWeight: 600, letterSpacing: '-.04em', lineHeight: 1 }}>2025</span>
            </div>
            <div style={{ gridColumn: 'span 2', minWidth: 'min(100%,400px)', display: 'flex', flexDirection: 'column', gap: 12 }}>
              <span style={{ fontSize: 21, fontWeight: 600, lineHeight: 1.35, letterSpacing: '-.015em', textWrap: 'balance' }}>An Open-source UAV Digital Twin Framework: A Case Study on Remote Sensing in the Andean Mountains</span>
              <span style={{ fontSize: 15, color: '#aeb8c8' }}>E. Valencia, F. Toapanta, <span style={{ color: '#eef1f6', fontWeight: 600 }}>G. Ona</span>, et al.</span>
              <span style={{ fontSize: 14, color: '#9aa6b8', fontStyle: 'italic' }}>Journal of Intelligent &amp; Robotic Systems, vol. 111, no. 71</span>
              <span style={{ fontSize: 13, fontWeight: 500, lineHeight: 1, color: GOLD }}>doi:10.1007/s10846-025-02276-7 ↗</span>
            </div>
          </a>
        </div>
      </section>

      <section id="contact" style={{ position: 'relative', overflow: 'hidden' }}>
        <div style={{ ...WRAP, position: 'relative', padding: '120px 32px 96px', display: 'flex', flexDirection: 'column', gap: 40 }}>
          <SectionLabel fontSize={12} gap={14}>06 / CONTACT</SectionLabel>
          <h2 data-reveal className="pf-serif" style={H2}>Contact</h2>
          <div style={{ display: 'flex', alignItems: 'flex-start', flexWrap: 'wrap', gap: '24px 56px' }}>
            <OfficeAddress size={17} />
            <div data-reveal style={{ display: 'flex', gap: 18, flexWrap: 'wrap', marginLeft: 'auto' }}>
              <ContactLinks size={60} glyph={22} cvFont={14} />
            </div>
          </div>
        </div>
        <footer style={{ position: 'relative', borderTop: RULE }}>
          <div style={{ ...WRAP, padding: '24px 32px', display: 'flex', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap', fontSize: 12, fontWeight: 500, lineHeight: 1, letterSpacing: '.08em', color: '#8794a8' }}>
            <span>© 2026 GABRIEL ONA</span>
          </div>
        </footer>
      </section>

      {p && (
        <div onClick={closeCard} style={{ position: 'fixed', inset: 0, zIndex: 80, background: 'rgba(5,9,18,.75)', backdropFilter: 'blur(6px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 32 }}>
          <div role="dialog" aria-modal="true" aria-label={p.title} onClick={(e) => e.stopPropagation()} style={{ width: '100%', maxWidth: 760, maxHeight: 'calc(100vh - 64px)', overflowY: 'auto', boxSizing: 'border-box', background: '#0f1829', border: '1px solid rgba(233,185,73,.4)', padding: 32, display: 'flex', flexDirection: 'column', gap: 22 }}>
            <ProjectDetail p={p} onClose={closeCard} titleSize={32} lineSize={16} />
          </div>
        </div>
      )}
    </>
  )
}
