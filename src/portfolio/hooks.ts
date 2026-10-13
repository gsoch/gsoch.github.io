import { useEffect, useState, type RefObject } from 'react'

export function useMediaQuery(query: string) {
  const [matches, setMatches] = useState(() => window.matchMedia(query).matches)
  useEffect(() => {
    const mq = window.matchMedia(query)
    const on = () => setMatches(mq.matches)
    mq.addEventListener('change', on)
    return () => mq.removeEventListener('change', on)
  }, [query])
  return matches
}

// Fade-and-rise for every [data-reveal] element that starts below the fold.
export function useReveal(offset: number) {
  useEffect(() => {
    if (!('IntersectionObserver' in window)) return
    const io = new IntersectionObserver((es) => es.forEach((e) => {
      if (!e.isIntersecting) return
      const el = e.target as HTMLElement
      el.style.opacity = '1'; el.style.transform = 'none'
      io.unobserve(el)
    }), { threshold: 0.12 })
    const id = setTimeout(() => document.querySelectorAll<HTMLElement>('[data-reveal]').forEach((el) => {
      if (el.getBoundingClientRect().top < innerHeight) return
      el.style.opacity = '0'; el.style.transform = `translateY(${offset}px)`
      el.style.transition = (el.style.transition ? el.style.transition + ',' : '') + 'opacity .7s ease, transform .7s ease'
      io.observe(el)
    }), 60)
    return () => { clearTimeout(id); io.disconnect() }
  }, [offset])
}

// Each architecture lights its cells in its own dataflow order.
const FLOW: Record<string, { period: number; key: (c: { x: number; y: number }) => number }> = {
  cpu: { period: 1.4, key: (c) => c.y * 1000 + c.x },            // pipelined: one stage after another
  gpu: { period: 1.2, key: (c) => Math.round(c.x / 4) },         // SIMT: rows fire in lockstep
  fpga: { period: 1.0, key: (c) => Math.round(c.x / 3) },        // spatial: stream across the fabric
  npu: { period: 1.1, key: (c) => Math.round((c.x + c.y) / 4) }, // systolic: diagonal wavefront
}

// Animates the [data-cell] elements inside `ref`. `soft` is a comma-separated
// list of kinds that use the dimmer keyframes.
export function useFlowCells(ref: RefObject<HTMLElement | null>, soft: string) {
  useEffect(() => {
    const run = () => {
      const root = ref.current
      if (!root || matchMedia('(prefers-reduced-motion: reduce)').matches) return
      Object.entries(FLOW).forEach(([kind, o]) => {
        const els = [...root.querySelectorAll<HTMLElement>(`[data-cell="${kind}"]`)]
        if (!els.length) return
        const rects = els.map((e) => e.getBoundingClientRect())
        const x0 = Math.min(...rects.map((r) => r.left)), y0 = Math.min(...rects.map((r) => r.top))
        const cells = els.map((el, i) => ({ el, x: rects[i].left - x0, y: rects[i].top - y0 }))
        const keys = [...new Set(cells.map(o.key))].sort((a, b) => a - b)
        const anim = soft.split(',').includes(kind) ? 'cellFlowSoft' : 'cellFlow'
        cells.forEach((c) => {
          const step = keys.indexOf(o.key(c)) / keys.length
          c.el.style.animation = `${anim} ${o.period}s ease-in-out ${(step * o.period - o.period).toFixed(2)}s infinite`
        })
      })
    }
    let id = setTimeout(run, 150)
    const onResize = () => { clearTimeout(id); id = setTimeout(run, 200) }
    window.addEventListener('resize', onResize)
    return () => { clearTimeout(id); window.removeEventListener('resize', onResize) }
  }, [ref, soft])
}

export function useEscape(onClose: () => void, active: boolean) {
  useEffect(() => {
    if (!active) return
    const on = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', on)
    return () => window.removeEventListener('keydown', on)
  }, [active, onClose])
}

// Y-snapping to the hero and each section, with extra snap points inside
// sections taller than the viewport so long sections can still be read a
// screen at a time. Elements marked [data-snap-sub] add stops. Desktop uses
// 'proximity': 'mandatory' can trap mouse-wheel scrolling inside tall sections.
export function useSectionSnap(navH: number, mode: 'mandatory' | 'proximity') {
  useEffect(() => {
    const root = document.documentElement
    root.style.scrollSnapType = 'y ' + mode
    root.style.scrollPaddingTop = navH + 'px'
    const fix = () => {
      const vh = window.innerHeight - navH
      document.querySelectorAll('[data-snap-marker]').forEach((m) => m.remove())
      document.querySelectorAll<HTMLElement>('header, section[id]').forEach((sec) => {
        sec.style.scrollSnapAlign = 'start'
        const H = sec.offsetHeight
        if (H <= vh + 4) return
        if (getComputedStyle(sec).position === 'static') sec.style.position = 'relative'
        const stops = [0]
        sec.querySelectorAll<HTMLElement>('[data-snap-sub]').forEach((el) => stops.push(el.getBoundingClientRect().top - sec.getBoundingClientRect().top))
        stops.push(H - vh)
        stops.sort((a, b) => a - b)
        const add = (css: string) => {
          const m = document.createElement('div')
          m.setAttribute('data-snap-marker', '')
          m.style.cssText = 'position:absolute;left:0;width:1px;height:1px;pointer-events:none;' + css
          sec.appendChild(m)
        }
        const stepPx = Math.round(vh * 0.85)
        for (let k = 0; k < stops.length - 1; k++)
          for (let y = stops[k] + stepPx; y < stops[k + 1] - 40; y += stepPx) add('scroll-snap-align:start;top:' + y + 'px')
        add('bottom:0;scroll-snap-align:end')
      })
    }
    const id = setTimeout(fix, 300)
    window.addEventListener('resize', fix)
    window.addEventListener('load', fix)
    return () => {
      clearTimeout(id)
      window.removeEventListener('resize', fix)
      window.removeEventListener('load', fix)
      document.querySelectorAll('[data-snap-marker]').forEach((m) => m.remove())
      root.style.scrollSnapType = ''
      root.style.scrollPaddingTop = ''
    }
  }, [navH, mode])
}
