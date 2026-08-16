import { useEffect, useState, type RefObject } from "react";

interface Rect {
  left: number;
  top: number;
  width: number;
  height: number;
}

/** Position of `target` relative to `container`'s own box — not the
 * viewport — recomputed whenever either one resizes or the layout shifts
 * (font load, responsive breakpoint change, content reflow). */
function useRelativeRect(
  container: RefObject<HTMLElement | null>,
  target: RefObject<HTMLElement | null>,
): Rect | null {
  const [rect, setRect] = useState<Rect | null>(null);

  useEffect(() => {
    const c = container.current;
    const t = target.current;
    if (!c || !t) return;

    const update = () => {
      const cb = c.getBoundingClientRect();
      const tb = t.getBoundingClientRect();
      setRect({ left: tb.left - cb.left, top: tb.top - cb.top, width: tb.width, height: tb.height });
    };
    update();

    const ro = new ResizeObserver(update);
    ro.observe(c);
    ro.observe(t);
    return () => ro.disconnect();
  }, [container, target]);

  return rect;
}

const TICK = 10;

function CornerTicks({ rect, color }: { rect: Rect; color: string }) {
  const corners = [
    { x: rect.left, y: rect.top, dx: 1, dy: 1 },
    { x: rect.left + rect.width, y: rect.top, dx: -1, dy: 1 },
    { x: rect.left, y: rect.top + rect.height, dx: 1, dy: -1 },
    { x: rect.left + rect.width, y: rect.top + rect.height, dx: -1, dy: -1 },
  ];
  return (
    <>
      {corners.map((c, i) => (
        <path
          key={i}
          d={`M${c.x} ${c.y + c.dy * TICK} V${c.y} H${c.x + c.dx * TICK}`}
          fill="none"
          stroke={color}
          strokeWidth={1.25}
        />
      ))}
    </>
  );
}

/** Dashed alignment guides + corner tick marks derived from the *actual*
 * rendered position of the hero's own content blocks, redrawn on resize —
 * an annotated-sketch layer that tracks the real composition instead of a
 * mechanically repeating grid tile. */
export default function HeroGuides({
  containerRef,
  textRef,
  cardRef,
}: {
  containerRef: RefObject<HTMLElement | null>;
  textRef: RefObject<HTMLElement | null>;
  cardRef: RefObject<HTMLElement | null>;
}) {
  const text = useRelativeRect(containerRef, textRef);
  const card = useRelativeRect(containerRef, cardRef);
  const color = "#b3ada1";

  if (!text || !card) return null;

  return (
    <svg className="absolute inset-0 w-full h-full -z-10 pointer-events-none" aria-hidden="true">
      {/* full-height verticals through the text block's left edge and the
          card's right edge — the two outermost bounds of the composition */}
      <line x1={text.left} x2={text.left} y1={0} y2="100%" stroke={color} strokeWidth={1} strokeDasharray="2 6" />
      <line
        x1={card.left + card.width}
        x2={card.left + card.width}
        y1={0}
        y2="100%"
        stroke={color}
        strokeWidth={1}
        strokeDasharray="2 6"
      />
      {/* full-width horizontals through the top/bottom of the content */}
      <line x1={0} x2="100%" y1={text.top} y2={text.top} stroke={color} strokeWidth={1} strokeDasharray="2 6" />
      <line
        x1={0}
        x2="100%"
        y1={text.top + text.height}
        y2={text.top + text.height}
        stroke={color}
        strokeWidth={1}
        strokeDasharray="2 6"
      />
      <CornerTicks rect={text} color={color} />
      <CornerTicks rect={card} color={color} />
    </svg>
  );
}
