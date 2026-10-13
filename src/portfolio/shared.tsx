import { memo, useRef, type CSSProperties, type ReactNode } from 'react'
import { useFlowCells } from './hooks'
import { ICONS, PROJECT_ICONS } from './markup'
import { LINKS, OFFICE, projectMeta, type Project } from './data'

export const GOLD = '#e9b949'

// Static CPU/GPU/FPGA/NPU die markup with animated cells. Memoized so page
// re-renders never rewrite its innerHTML (which would drop the animations).
export const ChipStack = memo(function ChipStack({ html, soft }: { html: string; soft: string }) {
  const ref = useRef<HTMLDivElement>(null)
  useFlowCells(ref, soft)
  return <div ref={ref} dangerouslySetInnerHTML={{ __html: html }} />
})

const iconSvg = { fill: 'none', stroke: '#ffffff', strokeWidth: 1.4, strokeLinecap: 'round', strokeLinejoin: 'round' } as const

// Animated section icon (tide, shell, chip, book) at the given pixel size.
export function SectionIcon({ name, size, style }: { name: keyof typeof ICONS; size: number; style?: CSSProperties }) {
  return (
    <svg aria-hidden viewBox="0 0 64 64" width={size} height={size} {...iconSvg}
      style={{ flex: 'none', ...(name === 'shell' && { transformOrigin: '50% 18%', animation: 'shellShake 4s ease-in-out infinite' }), ...style }}
      dangerouslySetInnerHTML={{ __html: ICONS[name] }} />
  )
}

export function ProjectIcon({ code, size }: { code: string; size: number }) {
  return <svg aria-hidden viewBox="0 0 44 44" width={size} height={size} {...iconSvg} style={{ flex: 'none', marginTop: 2 }} dangerouslySetInnerHTML={{ __html: PROJECT_ICONS[code] }} />
}

export const LinkedInGlyph = ({ size }: { size: number }) => (
  <svg viewBox="0 0 24 24" width={size} height={size} fill="currentColor" aria-hidden><path d="M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5ZM3 9.75h4v11H3v-11Zm6.5 0h3.8v1.6h.05c.53-1 1.83-2.05 3.77-2.05 4.03 0 4.78 2.65 4.78 6.1v5.35h-4v-4.74c0-1.13-.02-2.59-1.58-2.59-1.58 0-1.82 1.23-1.82 2.5v4.83h-4v-11Z" /></svg>
)
export const GitHubGlyph = ({ size }: { size: number }) => (
  <svg viewBox="0 0 24 24" width={size} height={size} fill="currentColor" aria-hidden><path d="M12 .5a11.5 11.5 0 0 0-3.64 22.41c.58.1.79-.25.79-.56v-2c-3.2.7-3.88-1.37-3.88-1.37-.52-1.33-1.28-1.69-1.28-1.69-1.05-.71.08-.7.08-.7 1.16.08 1.77 1.19 1.77 1.19 1.03 1.77 2.7 1.26 3.36.96.1-.75.4-1.26.73-1.55-2.55-.29-5.24-1.28-5.24-5.69 0-1.26.45-2.29 1.19-3.1-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.17 1.18a11 11 0 0 1 5.77 0c2.2-1.49 3.17-1.18 3.17-1.18.63 1.59.23 2.76.11 3.05.74.81 1.19 1.84 1.19 3.1 0 4.42-2.69 5.39-5.25 5.68.41.36.78 1.06.78 2.14v3.17c0 .31.21.67.8.56A11.5 11.5 0 0 0 12 .5Z" /></svg>
)
export const MailGlyph = ({ size }: { size: number }) => (
  <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" aria-hidden><path d="M3 6h18v12H3z" /><path d="m3 7 9 6 9-6" /></svg>
)

// Email / LinkedIn / GitHub / CV row at the bottom of the page.
export function ContactLinks({ size, glyph, cvFont }: { size: number; glyph: number; cvFont: number }) {
  const c = { width: size, height: size }
  return (
    <>
      <a href={LINKS.email} aria-label="Email" className="pf-circle" style={c}><MailGlyph size={glyph} /></a>
      <a href={LINKS.linkedin} target="_blank" rel="noopener" aria-label="LinkedIn" className="pf-circle" style={c}><LinkedInGlyph size={glyph} /></a>
      <a href={LINKS.github} target="_blank" rel="noopener" aria-label="GitHub" className="pf-circle" style={c}><GitHubGlyph size={glyph + 1} /></a>
      <a href={LINKS.cv} target="_blank" rel="noopener" aria-label="CV" className="pf-circle" style={c}><span style={{ fontSize: cvFont, fontWeight: 600, letterSpacing: '.08em', lineHeight: 1 }}>CV</span></a>
    </>
  )
}

// Department / university / office desk, above the contact links.
export function OfficeAddress({ size }: { size: number }) {
  return (
    <address data-reveal style={{ fontStyle: 'normal', display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 6, textAlign: 'left' }}>
      <span style={{ fontSize: size, fontWeight: 600, lineHeight: 1.4, color: '#eef1f6', textWrap: 'balance' }}>{OFFICE.dept}</span>
      <span style={{ fontSize: size - 1, lineHeight: 1.4, color: '#aeb8c8' }}>{OFFICE.school}</span>
      <span style={{ display: 'flex', alignItems: 'baseline', gap: 10, paddingTop: 4, fontSize: size - 1, lineHeight: 1.4, color: '#eef1f6' }}>
        <span style={{ fontSize: 11, fontWeight: 600, letterSpacing: '.16em', color: GOLD }}>OFFICE</span>{OFFICE.room}
      </span>
    </address>
  )
}

// Round avatar cropped from the headshot.
export function Avatar({ size, bgSize, bgPos }: { size: number; bgSize: number; bgPos: string }) {
  return <div role="img" aria-label="Gabriel Ona" style={{ width: size, height: size, flex: 'none', borderRadius: '50%', border: `1.5px solid ${GOLD}`, boxSizing: 'border-box', backgroundImage: 'url(/assets/headshot.jpg)', backgroundSize: `${bgSize}px auto`, backgroundPosition: bgPos, backgroundRepeat: 'no-repeat' }} />
}

// "01 / ABOUT ————" section label.
export function SectionLabel({ children, fontSize, gap }: { children: ReactNode; fontSize: number; gap: number }) {
  return (
    <div data-reveal style={{ display: 'flex', alignItems: 'center', gap, fontSize, fontWeight: 600, lineHeight: 1, letterSpacing: '.16em', color: GOLD }}>
      {children}<span style={{ flex: 1, height: 1, background: 'rgba(233,185,73,.3)' }} />
    </div>
  )
}

// "WHO AM I? ————" sub-label inside a section.
export function SubLabel({ children, fontSize, style }: { children: ReactNode; fontSize: number; style?: CSSProperties }) {
  return (
    <div data-reveal style={{ display: 'flex', alignItems: 'center', gap: 10, paddingTop: 12, fontSize, fontWeight: 600, lineHeight: 1, letterSpacing: '.18em', color: '#9aa6b8', ...style }}>
      {children}<span style={{ flex: 1, height: 1, background: 'rgba(148,163,184,.18)' }} />
    </div>
  )
}

export const WhoAmI = ({ style }: { style: CSSProperties }) => (
  <>
    <p data-reveal style={style}>I’m at the University of Toronto, pursuing a master’s degree in Computer Engineering. I’m passionate about <span className="pf-em">software</span> and <span className="pf-em">hardware</span>, and outside the lab you’ll find me traveling <span className="pf-em">outdoors</span>, <span className="pf-em">baking</span> or playing <span className="pf-em">soccer</span>.</p>
    <p data-reveal style={style}>Wherever I am, I love turning ideas into things that work, in the lab and in everyday life.</p>
  </>
)

const stageLabel: CSSProperties = { position: 'absolute', whiteSpace: 'nowrap', fontSize: 10, fontWeight: 600, letterSpacing: '.06em', color: '#eef1f6' }
const stageDot: CSSProperties = { position: 'absolute', top: 50, width: 8, height: 8, margin: '-4px 0 0 -4px', borderRadius: '50%', boxSizing: 'border-box', background: '#0d1526', border: '1px solid rgba(148,163,184,.7)' }

// Algorithm / Architecture / Workload → Design → Simulation → Implementation → Validation.
export function Workflow() {
  return (
    <div data-reveal role="img" aria-label="Workflow: Algorithm, Architecture and Workload feed into Design, then Simulation, Implementation and Validation" style={{ display: 'grid', gridTemplateColumns: '86px 16px minmax(0,1fr)', alignItems: 'start', paddingTop: 20 }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 11 }}>
        {['ALGORITHM', 'ARCHITECTURE', 'WORKLOAD'].map((s) => (
          <div key={s} style={{ height: 26, display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 6, fontSize: 9, fontWeight: 600, letterSpacing: '.06em', color: '#eef1f6' }}>
            {s}<span style={{ width: 6, height: 6, flex: 'none', borderRadius: '50%', background: 'rgba(148,163,184,.8)' }} />
          </div>
        ))}
      </div>
      <svg aria-hidden viewBox="0 0 16 100" style={{ display: 'block', width: 16, height: 100 }}><path d="M0 13Q8 13 16 50M0 50H16M0 87Q8 87 16 50" fill="none" stroke="rgba(148,163,184,.4)" strokeWidth="1" /></svg>
      <div style={{ position: 'relative', height: 92 }}>
        <svg aria-hidden viewBox="0 0 100 92" preserveAspectRatio="none" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', overflow: 'visible' }}>
          {[['M37 46C37 22,12 22,12 46', '1.2s'], ['M63 46C63 8,12 8,12 46', '1.6s'], ['M90 46C90 -8,12 -8,12 46', '2s']].map(([d, dur]) => (
            <path key={d} d={d} fill="none" stroke="rgba(233,185,73,.45)" strokeWidth="1" strokeDasharray="3 3" vectorEffect="non-scaling-stroke">
              <animate attributeName="stroke-dashoffset" from="0" to="-12" dur={dur} repeatCount="indefinite" />
            </path>
          ))}
        </svg>
        <div style={{ position: 'absolute', left: 0, right: '6%', top: 50, height: 1, background: 'rgba(148,163,184,.4)' }} />
        <div style={{ position: 'absolute', left: 0, width: '12%', top: 50, height: 1, background: 'rgba(233,185,73,.6)' }} />
        <div style={{ ...stageDot, left: '12%', background: GOLD, border: `1px solid ${GOLD}` }} />
        <span style={{ ...stageLabel, left: '12%', top: 60, transform: 'translateX(-50%)', color: GOLD }}>DESIGN</span>
        <div style={{ ...stageDot, left: '37%' }} />
        <span style={{ ...stageLabel, left: '37%', top: 76, transform: 'translateX(-50%)' }}>SIMULATION</span>
        <div style={{ ...stageDot, left: '63%' }} />
        <span style={{ ...stageLabel, left: '63%', top: 60, transform: 'translateX(-58%)' }}>IMPLEMENTATION</span>
        <div style={{ ...stageDot, left: '90%' }} />
        <span style={{ ...stageLabel, left: '90%', top: 76, transform: 'translateX(-80%)' }}>VALIDATION</span>
      </div>
    </div>
  )
}

// Body of the project detail card (desktop modal and mobile bottom sheet).
export function ProjectDetail({ p, onClose, titleSize, lineSize }: { p: Project; onClose: () => void; titleSize: number; lineSize: number }) {
  return (
    <>
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 16 }}>
        <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: 10 }}>
          <span style={{ fontSize: 11, fontWeight: 600, lineHeight: 1.4, letterSpacing: '.14em', color: '#9aa6b8' }}>{projectMeta(p)}</span>
          <span className="pf-serif" style={{ fontSize: titleSize, lineHeight: 1.2, color: '#eef1f6', textWrap: 'balance' }}>{p.title}</span>
        </div>
        <button onClick={onClose} aria-label="Close" className="pf-close" style={{ flex: 'none', width: 44, height: 44, margin: '-8px -10px 0 0', border: 0, background: 'transparent', fontSize: 26, cursor: 'pointer' }}>×</button>
      </div>
      <span style={{ fontSize: lineSize, lineHeight: 1.55, color: '#aeb8c8', textWrap: 'pretty' }}>{p.line}</span>
      <ul style={{ margin: 0, paddingLeft: 18, display: 'flex', flexDirection: 'column', gap: 8, fontSize: lineSize - 1, lineHeight: 1.55, color: '#aeb8c8' }}>
        {p.bullets.map((b) => <li key={b}>{b}</li>)}
      </ul>
    </>
  )
}
