import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'

// Animated datacenter trace: a spine/leaf topology lit by Ethernet, NVLink and
// SM activity, plus one replayable card per implementation. With `reorder`,
// the cards auto-play as a carousel once, then the clicked card moves to top.

type Pt = [number, number]

const PLAY_MS = 8000, HOLD_MS = 2000, SLOT_MS = PLAY_MS + HOLD_MS, FRAME_MS = 80
const sample = (pts: Pt[], t: number) => {
  for (let i = 1; i < pts.length; i++) {
    if (t <= pts[i][0]) {
      const [x0, y0] = pts[i - 1], [x1, y1] = pts[i]
      return y0 + ((y1 - y0) * (t - x0)) / (x1 - x0 || 1)
    }
  }
  return pts[pts.length - 1][1]
}
const jag = (t: number, a: number) => 1 + a * (Math.sin(t * 210) * 0.6 + Math.sin(t * 337 + 1.3) * 0.4)
const norm = (raw: Pt[], xm: number, ym: number): Pt[] => raw.map(([x, y]) => [x / xm, y / ym])

const RUN_US = 8700
const REAL_NV: Pt[] = [[0,2500],[100,2722],[250,2650],[400,1900],[550,1100],[650,770],[700,620],[800,800],[900,1050],[1000,820],[1100,800],[1200,540],[1300,570],[1450,400],[1550,290],[1650,300],[1750,370],[1850,360],[2000,310],[2100,300],[2200,500],[2350,540],[2450,600],[2550,920],[2650,830],[2750,1400],[2850,2050],[2950,2300],[3050,2050],[3150,1900],[3250,980],[3350,950],[3450,850],[3550,810],[3650,640],[3750,470],[3850,760],[3950,880],[4050,210],[4150,880],[4250,830],[4350,1240],[4450,1050],[4550,1550],[4650,1050],[4800,700],[4900,100],[5000,40],[5100,130],[5200,40],[5300,290],[5400,80],[5500,100],[5600,180],[5700,50],[5900,160],[6050,380],[6150,120],[6250,130],[6350,450],[6500,450],[6600,200],[6700,190],[7000,0],[RUN_US,0]]
const REAL_ETH: Pt[] = [[0,0],[850,0],[900,180],[1000,760],[1200,820],[1400,905],[1550,870],[1650,930],[1800,440],[1900,385],[2000,515],[2100,455],[2200,320],[2300,310],[2400,200],[2500,145],[2600,205],[2700,400],[2800,330],[2900,310],[3000,240],[3100,280],[3200,220],[3300,180],[3500,150],[3700,215],[3900,85],[4100,30],[4200,105],[4300,150],[4400,135],[4500,115],[4600,215],[4700,150],[4800,210],[4900,150],[5000,160],[5100,130],[5300,215],[5400,160],[5500,150],[5700,220],[5800,150],[5900,160],[6000,205],[6200,330],[6300,380],[6500,480],[6700,575],[6900,550],[7100,520],[7300,440],[7400,500],[7600,290],[7900,170],[8100,195],[8250,150],[8500,150],[RUN_US,0]]
const COMET_US = 14800
const COMET_NV: Pt[] = [[0,3400],[120,1500],[300,100],[500,0],[3000,0],[3100,30],[3400,40],[3500,320],[3700,260],[3800,300],[3900,2400],[4000,1000],[4300,0],[5100,0],[5200,100],[5500,300],[5700,420],[6000,3671],[6100,100],[6200,0],[8000,0],[8100,20],[8200,130],[8400,170],[8600,880],[8800,400],[9000,1200],[9150,0],[COMET_US,0]]
const COMET_ETH: Pt[] = [[0,560],[150,545],[250,490],[400,560],[650,560],[780,478],[900,558],[1050,560],[1250,478],[1400,560],[1600,560],[1700,490],[1850,545],[2000,560],[2200,500],[2400,555],[2500,545],[2650,555],[2800,500],[3000,550],[3200,555],[3400,500],[3550,560],[3700,545],[3800,478],[3950,548],[4100,555],[4250,520],[4400,555],[4600,560],[4700,450],[4800,430],[4900,70],[5000,60],[5100,15],[5300,0],[5800,30],[5900,78],[6000,40],[6200,0],[8000,0],[8300,50],[8500,130],[8700,195],[8800,325],[8900,580],[9000,740],[9100,705],[9300,695],[9400,575],[9800,100],[10000,0],[10900,0],[11000,30],[11200,200],[11300,235],[11450,450],[11550,495],[11650,700],[11750,750],[12600,750],[13000,730],[13400,700],[13450,630],[13500,700],[13700,760],[13900,700],[14000,640],[14150,620],[14400,520],[14600,300],[COMET_US,40]]
const NAIVE_US = 24000
const NAIVE_NV: Pt[] = [[0,2800],[100,2000],[250,300],[600,0],[17200,0],[17500,400],[17800,2500],[17950,3903],[18100,3000],[18300,500],[18500,50],[18700,0],[NAIVE_US,0]]
const NAIVE_ETH: Pt[] = [[0,400],[120,560],[300,505],[500,560],[750,510],[1000,560],[1200,505],[1500,555],[1800,530],[2000,550],[2200,515],[2500,555],[2800,520],[3000,560],[3200,510],[3500,555],[3700,505],[3900,560],[4100,510],[4300,555],[4500,505],[4800,550],[5000,545],[5300,470],[5500,470],[5600,40],[5800,0],[17800,0],[17900,500],[18000,540],[18300,560],[18600,510],[19000,555],[19300,505],[19600,550],[20000,560],[20200,520],[20600,560],[21000,505],[21400,555],[21700,520],[22000,560],[22300,505],[22600,555],[22900,470],[23000,555],[23300,420],[23500,30],[23800,0],[NAIVE_US,0]]
const NAIVE_SM: Pt[] = [[0,0],[6000,0],[6050,132],[9150,132],[9190,80],[9230,132],[9640,132],[9660,80],[9700,132],[10720,132],[10750,80],[10790,132],[11915,132],[11935,80],[11975,132],[13110,132],[13130,80],[13170,132],[14250,132],[14270,80],[14310,132],[15420,132],[15440,80],[15480,132],[15660,132],[15680,80],[15720,132],[16600,132],[16650,100],[16900,132],[17750,132],[17800,0],[NAIVE_US,0]]
const COMET_SM: Pt[] = [[0,0],[120,0],[130,110],[5400,110],[5420,80],[5580,80],[5600,110],[8060,110],[8080,80],[8160,80],[8175,110],[13650,110],[13680,90],[13900,110],[14200,110],[14210,0],[COMET_US,0]]
const REAL_SM: Pt[] = [[0,0],[130,0],[150,60],[270,110],[4880,110],[5000,100],[5500,95],[6000,90],[6500,85],[7000,75],[7500,60],[7900,40],[8200,20],[8400,0],[RUN_US,0]]
const REAL_ACC: Pt[] = [[0,0],[70,0],[85,0.24],[120,0.45],[200,0.5],[300,0.7],[400,0.65],[500,0.72],[700,0.6],[900,0.58],[1100,0.62],[1400,0.85],[1500,0.65],[1800,0.9],[2000,0.8],[2200,0.62],[2600,0.58],[3000,0.58],[3150,0.5],[3300,0.45],[3600,0.3],[3800,0.2],[4200,0.1],[4400,0],[RUN_US,0]]

type Phase = { us: number; workload: string; fix: string; jitter: number; pcPts: Pt[]; eth: Pt[]; nv: Pt[]; accPts?: Pt[] }

const PHASES: Phase[] = [
  { us: NAIVE_US, workload: 'Implementation 1', fix: 'NCCL all-to-all dispatch, expert GEMMs, then NCCL all-to-all combine. Each stage waits on a barrier, so nothing overlaps.', jitter: 0, pcPts: norm(NAIVE_SM, NAIVE_US, 132), eth: norm(NAIVE_ETH, NAIVE_US, 560), nv: norm(NAIVE_NV, NAIVE_US, 3903) },
  { us: COMET_US, workload: 'Implementation 2', fix: 'Wave-based dispatch and gather overlap communication with expert compute, hiding network latency behind the GEMMs.', jitter: 0, pcPts: norm(COMET_SM, COMET_US, 110), eth: norm(COMET_ETH, COMET_US, 752.7), nv: norm(COMET_NV, COMET_US, 3671) },
  { us: RUN_US, workload: 'Implementation 3', fix: 'In-network acceleration achieves ~3× by coordinating Ethernet and NVLink traffic while parallelizing GPU compute.', jitter: 0, eth: norm(REAL_ETH, RUN_US, 930), pcPts: norm(REAL_SM, RUN_US, 110), accPts: norm(REAL_ACC, RUN_US, 1), nv: norm(REAL_NV, RUN_US, 2722) },
]

const ms = (us: number) => `${+(us / 1000).toFixed(1)} ms`
const clamp = (v: number) => Math.max(0, Math.min(1, v))
const trace = (p: Phase, t: number) => ({
  eth: clamp(sample(p.eth, t) * jag(t, p.jitter)),
  nv: clamp(sample(p.nv, t)),
  acc: p.accPts ? clamp(sample(p.accPts, t) * jag(t * 3, 0.15)) : 0,
  pc: clamp(sample(p.pcPts, t)),
})

const TRACE_US = PHASES[0].us, PLOT_N = 160, MINI_H = 22, TOPO_H = 296, LABEL_EVERY = 6000, TOPO_FILL = 0.88
const SPINE_X = [30, 70], LEAF_X = [12.5, 37.5, 62.5, 87.5]
const nicX = (i: number, r: number) => 7.55 + 25 * i + r * 9.9
const rnd = (i: number, tick: number) => { const x = Math.sin((i + 1) * 12.9898 + tick * 78.233) * 43758.5453; return x - Math.floor(x) }

// Navy/gold palette
const GOLD = '#e9b949', INK = '#eef1f6', MUTED = '#9aa6b8', DIM = '#5d6a80'
const LINE = 'rgba(148,163,184,.2)', SURF = '#0f1829', SURF2 = '#0b1322'
const IDLE = 'rgba(148,163,184,.28)', IDLE_FILL = '#16213a'
const heat = (l: number) => l < 0.08 ? IDLE_FILL : `oklch(${(0.34 + 0.41 * l).toFixed(3)} ${(0.03 + 0.1 * l).toFixed(3)} 300)`
const ibColor = (e: number) => `oklch(${(0.6 + 0.24 * e).toFixed(3)} ${(0.06 + 0.1 * e).toFixed(3)} 82)`
const pcColor = (e: number) => `oklch(${(0.6 + 0.2 * e).toFixed(3)} ${(0.05 + 0.1 * e).toFixed(3)} 300)`
const nvColor = (e: number) => `oklch(${(0.6 + 0.2 * e).toFixed(3)} ${(0.05 + 0.1 * e).toFixed(3)} 235)`
const spin = (r: boolean) => (r ? 'running' : 'paused')
const MONO = 'Inter,system-ui,sans-serif'

export default function HeroTrace({ reorder = false }: { reorder?: boolean }) {
  const LENS = PHASES.map((q) => reorder ? Math.round((q.us / TRACE_US) * PLAY_MS + 900) : SLOT_MS)
  const STARTS = LENS.map((_, i) => LENS.slice(0, i).reduce((a, b) => a + b, 0))
  const TOTAL = STARTS[STARTS.length - 1] + LENS[LENS.length - 1]
  const cardRefs = useRef<Record<string, HTMLButtonElement | null>>({})
  const prevTops = useRef<Record<string, number>>({})
  const lastKey = useRef('')
  const [clicked, setClicked] = useState(false)
  const [userOrder, setUserOrder] = useState(PHASES.map((_, i) => i))
  const rootRef = useRef<HTMLDivElement>(null), topoRef = useRef<HTMLDivElement>(null)
  const [elapsed, setElapsed] = useState(0)
  const [endAt, setEndAt] = useState(TOTAL)
  const [visible, setVisible] = useState(true)
  const [topoW, setTopoW] = useState(400)
  const [hover, setHover] = useState(-1)
  const [narrow, setNarrow] = useState(false)

  useEffect(() => {
    const el = topoRef.current; if (!el) return
    const ro = new ResizeObserver(() => { const w = el.clientWidth; setNarrow(w < 460); setTopoW(w * (w < 460 ? 0.98 : TOPO_FILL)) })
    ro.observe(el); return () => ro.disconnect()
  }, [])
  useEffect(() => {
    const el = rootRef.current; if (!el) return
    const io = new IntersectionObserver(([e]) => setVisible(e.isIntersecting))
    io.observe(el); return () => io.disconnect()
  }, [])
  const stopped = elapsed >= endAt
  useEffect(() => {
    if (!visible || stopped) return
    const id = setInterval(() => setElapsed((t) => Math.min(t + FRAME_MS, endAt)), FRAME_MS)
    return () => clearInterval(id)
  }, [visible, stopped, endAt])

  const now = Math.min(elapsed, endAt - 1)
  let phase = 0; for (let i = 0; i < STARTS.length; i++) if (now >= STARTS[i]) phase = i
  const slot = (now - STARTS[phase]) / PLAY_MS
  // The carousel runs once; cards become clickable after it ends.
  const autoDone = !reorder || clicked || stopped
  const carousel = reorder && !autoDone
  const N = PHASES.length
  const order = carousel && !stopped ? PHASES.map((_, j) => (j + phase) % N) : reorder ? userOrder : PHASES.map((_, j) => j)
  const orderKey = order.join(',')
  const rank: Record<number, number> = {}; order.forEach((idx, r) => { rank[idx] = r })

  // FLIP: card offsets are recorded after every commit; when the order
  // changes, each card animates from its previous offset to its new one.
  useLayoutEffect(() => {
    const els = cardRefs.current, prev = prevTops.current, next: Record<string, number> = {}
    Object.keys(els).forEach((k) => { const el = els[k]; if (el) next[k] = el.offsetTop })
    prevTops.current = next
    if (lastKey.current === orderKey) return
    const first = !lastKey.current
    lastKey.current = orderKey
    if (first) return
    Object.keys(next).forEach((k) => {
      const el = els[k]; if (!el || prev[k] == null || !el.animate) return
      const dy = prev[k] - next[k]; if (Math.abs(dy) < 1) return
      const up = dy > 0, r = rank[PHASES.findIndex((q) => q.workload === k)] || 0
      el.style.zIndex = up ? '1' : '2'
      const a = up
        ? el.animate([{ transform: `translateY(${dy}px)` }, { transform: 'none' }], { duration: 720, delay: 60 + r * 70, easing: 'cubic-bezier(.22,1,.36,1)', fill: 'backwards' })
        : el.animate([
            { opacity: 1, transform: `translateY(${dy}px)` },
            { opacity: 0, transform: `translateY(${dy - 18}px) scale(.97)`, offset: 0.28, easing: 'step-end' },
            { opacity: 0, transform: 'translateY(28px) scale(.97)', offset: 0.5 },
            { opacity: 1, transform: 'none' },
          ], { duration: 1000, easing: 'cubic-bezier(.33,0,.2,1)' })
      a.onfinish = () => { el.style.zIndex = '' }
    })
  })

  const tick = Math.floor(elapsed / 180)
  const p = PHASES[phase]
  const r = (i: number) => rnd(i, tick)
  const span = p.us / TRACE_US
  const finished = slot >= span
  const t = finished ? 1 : slot / span
  const live = trace(p, t)
  const { eth, nv, pc } = finished ? { eth: 0, nv: 0, pc: 0 } : live
  const speedup = TRACE_US / p.us
  // Completion badge: shown for 1.8s when a run finishes; the last text is
  // kept so it doesn't change while fading out.
  const badgeKey = finished ? phase + ':' + STARTS[phase] + ':' + endAt : ''
  const [expiredKey, setExpiredKey] = useState('')
  const [badgeText, setBadgeText] = useState('')
  const text = finished ? `✓ ${ms(p.us)} · ${speedup.toFixed(1)}×` : ''
  if (text && text !== badgeText) setBadgeText(text)
  const badge = !!badgeKey && expiredKey !== badgeKey
  useEffect(() => {
    if (!badgeKey) return
    const id = setTimeout(() => setExpiredKey(badgeKey), 1800)
    return () => clearTimeout(id)
  }, [badgeKey])

  const miniPlots = useMemo(() => PHASES.map((q) => {
    const w = (q.us / TRACE_US) * 100
    const samples = Array.from({ length: PLOT_N + 1 }, (_, i) => trace(q, i / PLOT_N))
    const path = (key: 'eth' | 'nv' | 'pc' | 'acc') => `M${samples.map((v, i) => `${((i / PLOT_N) * w).toFixed(2)},${(MINI_H - 3 - v[key] * (MINI_H - 7)).toFixed(2)}`).join(' L')}`
    const rows = [
      { key: 'eth', label: 'Ethernet', d: path('eth'), color: 'oklch(0.82 0.15 82)' },
      { key: 'nv', label: 'NVLink', d: path('nv'), color: 'oklch(0.75 0.13 235)' },
      { key: 'pc', label: 'SM', d: path('pc'), color: 'oklch(0.75 0.13 300)' },
      ...(q.accPts ? [{ key: 'acc', label: 'Accelerator', d: path('acc'), color: 'oklch(0.78 0.14 155)' }] : []),
    ]
    const ticks = Array.from({ length: Math.floor(q.us / 2000) + 1 }, (_, k) => k * 2000)
    return { w, rows, ticks }
  }), [])

  const ethOn = eth > 0.05, pcOn = pc > 0.05, nvOn = nv > 0.05
  const links: { x1: number; y1: number; x2: number; y2: number; stroke: string; w: number; dash: string; play: boolean; op: number }[] = []
  let k = 0
  const link = (x1: number, y1: number, x2: number, y2: number, seed: number) => {
    const v = r(seed)
    links.push({ x1, y1, x2, y2, stroke: ethOn ? ibColor(eth) : IDLE, w: 1 + 0.9 * eth, dash: ethOn ? '5 5' : '0', play: ethOn, op: ethOn ? 0.3 + 0.7 * clamp(eth * (0.6 + 0.8 * v)) : 0.9 })
  }
  LEAF_X.forEach((lx) => SPINE_X.forEach((sx) => link(lx, 92, sx, 44, 300 + k++)))
  for (let i = 0; i < 4; i++) for (let n = 0; n < 2; n++) link(LEAF_X[Math.floor(i / 2) * 2 + n], 114, nicX(i, n), 171, 400 + k++)

  const port = (i: number) => (ethOn && r(i) < 0.15 + 0.85 * eth ? ibColor(eth) : IDLE_FILL)
  const level = (i: number) => clamp(pc * (0.8 + 0.4 * r(i)))
  const swBorder = ethOn ? ibColor(eth) : LINE
  const swShadow = eth > 0.2 ? `0 0 0 3px oklch(0.82 0.15 82 / ${(0.18 * eth).toFixed(2)}), 0 8px 22px -8px oklch(0.82 0.15 82 / ${(0.6 * eth).toFixed(2)})` : 'none'
  const doneBadge = { whiteSpace: 'nowrap', border: '1px solid oklch(0.78 0.14 155 / .5)', color: 'oklch(0.85 0.12 155)' } as const

  return (
    <div ref={rootRef} style={{ position: 'relative', width: '100%', maxWidth: 680, minWidth: 0, boxSizing: 'border-box', display: 'flex', flexDirection: 'column', gap: 12, border: reorder ? 'none' : `1.5px solid ${GOLD}`, background: reorder ? 'transparent' : 'rgba(15,24,41,.88)', padding: reorder ? 0 : (narrow ? 12 : 16), fontFamily: MONO, fontFeatureSettings: "'tnum'", boxShadow: reorder ? 'none' : '0 40px 80px -40px rgba(0,0,0,.6)' }}>
      {!reorder && <>
        <span style={{ position: 'absolute', left: -6, top: -6, width: 10, height: 10, background: GOLD }} />
        <span style={{ position: 'absolute', right: -6, bottom: -6, width: 10, height: 10, background: GOLD }} />
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8, padding: '0 4px', minHeight: 22 }}>
          <div style={{ font: `600 12px/1 ${MONO}`, letterSpacing: '.14em', color: GOLD, textTransform: 'uppercase' }}>Datacenter GPU Infrastructure</div>
          <div aria-hidden={!finished} style={{ ...doneBadge, background: 'oklch(0.78 0.14 155 / .1)', padding: '4px 9px', font: `500 11px/1 ${MONO}`, transition: 'opacity .3s', opacity: finished ? 1 : 0 }}>{`✓ ${p.workload} · ${ms(p.us)} · ${speedup.toFixed(1)}×`}</div>
        </div>
      </>}

      <div ref={topoRef} style={{ position: 'relative', width: '100%', overflow: 'hidden', border: `1px solid ${LINE}`, background: SURF2, height: TOPO_H + 16, backgroundImage: 'radial-gradient(rgba(148,163,184,.16) 1px,transparent 1px)', backgroundSize: '14px 14px' }}>
        <div style={{ pointerEvents: 'none', position: 'absolute', top: 10, left: 14, zIndex: 10, font: `500 10px/1 ${MONO}`, textTransform: 'uppercase', letterSpacing: '.14em', color: DIM }}>Datacenter</div>
        {reorder && <div aria-hidden={!badge} style={{ ...doneBadge, pointerEvents: 'none', position: 'absolute', top: 6, right: 8, zIndex: 10, background: 'oklch(0.25 0.04 155 / .9)', padding: '3px 7px', font: `500 10px/1 ${MONO}`, transition: 'opacity .5s', opacity: badge ? 1 : 0 }}>{badgeText}</div>}
        <div style={{ position: 'absolute', top: 8, left: `calc(50% - ${topoW / 2}px)`, width: topoW, height: TOPO_H }}>
          <svg viewBox={`0 0 100 ${TOPO_H}`} preserveAspectRatio="none" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}>
            {links.map((l, i) => (
              <line key={i} x1={l.x1} y1={l.y1} x2={l.x2} y2={l.y2} stroke={l.stroke} strokeWidth={l.w} strokeDasharray={l.dash} vectorEffect="non-scaling-stroke" style={{ animation: 'hero-dash .6s linear infinite', animationPlayState: spin(l.play), opacity: l.op, transition: 'opacity .1s' }} />
            ))}
          </svg>
          {SPINE_X.map((x, i) => (
            <div key={'s' + i} style={{ position: 'absolute', top: 20, left: `${x - 12}%`, width: '24%', height: 24, boxSizing: 'border-box', display: 'flex', alignItems: 'center', justifyContent: narrow ? 'center' : 'space-between', gap: 6, border: `1px solid ${swBorder}`, boxShadow: swShadow, background: SURF, padding: '0 8px' }}>
              <span style={{ whiteSpace: 'nowrap', font: `500 ${narrow ? 9 : 11}px/1 ${MONO}`, letterSpacing: '.06em', color: '#c6cfdb' }}>{`SPINE ${i}`}</span>
              <div style={{ display: narrow ? 'none' : 'flex', gap: 2 }}>
                {[0, 1, 2, 3].map((j) => <div key={j} style={{ height: 8, width: 4, background: port(500 + i * 4 + j) }} />)}
              </div>
            </div>
          ))}
          {LEAF_X.map((x, i) => (
            <div key={'l' + i} style={{ position: 'absolute', top: 92, left: `${x - 9.5}%`, width: '19%', height: 22, boxSizing: 'border-box', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5, border: `1px solid ${swBorder}`, boxShadow: swShadow, background: SURF }}>
              <span style={{ whiteSpace: 'nowrap', font: `500 ${narrow ? 9 : 11}px/1 ${MONO}`, letterSpacing: '.06em', color: '#c6cfdb' }}>{`LEAF ${i}`}</span>
              <div style={{ width: 5, height: 5, background: port(600 + i) }} />
            </div>
          ))}
          {[0, 1, 2, 3].map((i) => (
            <div key={'n' + i} style={{ position: 'absolute', top: 164, left: `${1.5 + 25 * i}%`, width: '22%', boxSizing: 'border-box', display: 'grid', gridTemplateColumns: 'repeat(4,minmax(0,1fr))', columnGap: 3, border: `1px solid ${LINE}`, background: 'rgba(15,24,41,.92)', padding: '7px 5% 6px' }}>
              {[0, 1].map((n) => (
                <div key={'nic' + n} style={{ gridColumn: 'span 2', height: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', font: `500 9.5px/1 ${MONO}`, letterSpacing: '.04em', color: ethOn ? INK : DIM, background: ethOn ? `oklch(0.82 0.15 82 / ${(0.08 + 0.14 * eth).toFixed(2)})` : IDLE_FILL, border: `1px solid ${ethOn ? ibColor(eth) : LINE}` }}>NIC</div>
              ))}
              {[0, 1, 2, 3].map((n) => (
                <div key={'pc' + n} style={{ height: 14, display: 'flex', justifyContent: 'center' }}>
                  <div style={{ height: '100%', width: 2, backgroundImage: `linear-gradient(180deg,${pcOn ? pcColor(pc) : IDLE} 0 5px,transparent 5px 10px)`, backgroundSize: '2px 10px', animation: 'hero-flow-y .45s linear infinite reverse', animationPlayState: spin(pcOn), opacity: 0.35 + 0.65 * pc, transition: 'opacity .1s' }} />
                </div>
              ))}
              {[0, 1, 2, 3].map((g) => <div key={'g' + g} style={{ height: 22, border: '1px solid rgba(255,255,255,.06)', background: heat(level(i * 4 + g)) }} />)}
              {[0, 1, 2, 3].map((n) => (
                <div key={'nv' + n} style={{ height: 10, display: 'flex', justifyContent: 'center', gap: 2 }}>
                  {(['normal', 'reverse'] as const).map((dir) => (
                    <div key={dir} style={{ height: '100%', width: 1.5, backgroundImage: `linear-gradient(180deg,${nvOn ? nvColor(nv) : IDLE} 0 4px,transparent 4px 8px)`, backgroundSize: '2px 8px', animation: `hero-flow-y .35s linear infinite ${dir}`, animationPlayState: spin(nvOn), opacity: 0.35 + 0.65 * nv, transition: 'opacity .1s' }} />
                  ))}
                </div>
              ))}
              <div style={{ gridColumn: '1 / -1', margin: '0 -4px', height: 20, display: 'flex', alignItems: 'center', justifyContent: 'center', font: `600 9.5px/1 ${MONO}`, letterSpacing: '.06em', color: nvOn ? 'oklch(0.85 0.1 235)' : DIM, background: nvOn ? `oklch(0.75 0.13 235 / ${(0.08 + 0.16 * nv).toFixed(2)})` : IDLE_FILL, border: `1px solid ${nvOn ? nvColor(nv) : LINE}`, boxShadow: nv > 0.2 ? `0 0 0 3px oklch(0.75 0.13 235 / ${(0.22 * nv).toFixed(2)})` : 'none' }}>NVSWITCH</div>
              <div style={{ gridColumn: '1 / -1', marginTop: 6, whiteSpace: 'nowrap', textAlign: 'center', font: `500 9.5px/1 ${MONO}`, letterSpacing: '.08em', color: DIM }}>{`NODE ${i}`}</div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', gap: 8, overflow: 'hidden' }}>
        {PHASES.map((q, i) => {
          const active = i === phase && !(reorder && stopped), mp = miniPlots[i]
          return (
            <button key={q.workload} type="button" aria-pressed={active} aria-label={`Play ${q.workload}`}
              ref={(el) => { cardRefs.current[q.workload] = el }}
              disabled={carousel} tabIndex={carousel ? -1 : 0}
              onClick={() => { if (carousel) return; if (reorder) setUserOrder((o) => [i, ...o.filter((x) => x !== i)]); setClicked(true); setEndAt(STARTS[i] + LENS[i]); setElapsed(STARTS[i]) }}
              onMouseEnter={() => { if (!carousel) setHover(i) }} onMouseLeave={() => setHover(-1)}
              style={{ order: rank[i], position: 'relative', width: '100%', cursor: carousel ? 'default' : 'pointer', pointerEvents: carousel ? 'none' : 'auto', font: 'inherit', color: 'inherit', border: `1px solid ${active ? 'rgba(233,185,73,.55)' : LINE}`, background: active ? 'rgba(233,185,73,.05)' : hover === i ? 'rgba(148,163,184,.06)' : 'transparent', padding: '12px 14px', textAlign: 'left', transition: 'background .3s,border-color .3s' }}>
              <div style={{ display: 'grid', gridTemplateColumns: narrow ? 'minmax(0,1fr)' : 'minmax(0,.9fr) minmax(0,1.3fr)', alignItems: 'center', gap: narrow ? 10 : 16 }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, fontWeight: 600, color: active ? INK : MUTED }}>
                    <span style={{ width: 6, height: 6, flex: 'none', background: active ? GOLD : 'transparent', border: `1px solid ${active ? GOLD : DIM}` }} />{q.workload}
                  </div>
                  <div style={{ fontSize: 12, lineHeight: 1.45, color: active ? '#aeb8c8' : DIM }}>{q.fix}</div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  {mp.rows.map((row) => (
                    <div key={row.key} style={{ display: 'flex', alignItems: 'center', gap: 8, height: MINI_H }}>
                      <span style={{ width: 64, flex: 'none', font: `500 9.5px/1 ${MONO}`, color: active ? MUTED : DIM }}>{row.label}</span>
                      <svg viewBox={`0 0 100 ${MINI_H}`} preserveAspectRatio="none" style={{ height: '100%', minWidth: 0, flex: 1, overflow: 'visible' }}>
                        <defs><clipPath id={`hero-mini-${i}-${row.key}`}><rect x={0} y={-2} width={active ? t * mp.w : 0} height={MINI_H + 4} /></clipPath></defs>
                        <line x1={0} x2={100} y1={MINI_H - 3} y2={MINI_H - 3} stroke={LINE} strokeWidth={1} vectorEffect="non-scaling-stroke" />
                        <path d={row.d} fill="none" stroke={active ? row.color : 'rgba(148,163,184,.3)'} strokeOpacity={active ? 0.3 : 1} strokeWidth={1.25} vectorEffect="non-scaling-stroke" />
                        {active && <path d={row.d} fill="none" stroke={row.color} strokeWidth={1.75} vectorEffect="non-scaling-stroke" clipPath={`url(#hero-mini-${i}-${row.key})`} />}
                      </svg>
                    </div>
                  ))}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, height: 18 }}>
                    <span style={{ width: 64, flex: 'none' }} />
                    <div style={{ position: 'relative', height: '100%', minWidth: 0, flex: 1 }}>
                      {mp.ticks.map((tk) => {
                        const labelled = tk % LABEL_EVERY === 0, edge = tk === TRACE_US
                        return (
                          <div key={tk} style={{ position: 'absolute', top: 0, display: 'flex', flexDirection: 'column', left: `${(tk / TRACE_US) * 100}%`, alignItems: tk === 0 ? 'flex-start' : edge ? 'flex-end' : 'center', transform: tk === 0 ? 'none' : edge ? 'translateX(-100%)' : 'translateX(-50%)' }}>
                            <div style={{ width: 1, height: labelled ? 6 : 4, background: 'rgba(148,163,184,.4)' }} />
                            {labelled && <span style={{ whiteSpace: 'nowrap', font: `500 9px/1 ${MONO}`, color: DIM, marginTop: 2 }}>{ms(tk)}</span>}
                          </div>
                        )
                      })}
                    </div>
                  </div>
                </div>
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}
