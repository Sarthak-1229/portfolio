"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Custom cursor: a small ice ring that trails the pointer and swells / shifts to the
 * nebula gradient near interactive elements. Cheap, disproportionately polished.
 * Self-disables on touch / no-hover devices (native cursor restored via CSS there).
 */
export default function CursorRing() {
  const ring = useRef<HTMLDivElement>(null);
  const [enabled, setEnabled] = useState(false);
  const [active, setActive] = useState(false);

  useEffect(() => {
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!fine || reduced) return;
    setEnabled(true);

    const pos = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    const cur = { ...pos };
    let raf = 0;

    const onMove = (e: PointerEvent) => {
      pos.x = e.clientX;
      pos.y = e.clientY;
      const el = e.target as Element | null;
      setActive(!!el?.closest("a, button, [data-cursor]"));
    };

    const loop = () => {
      cur.x += (pos.x - cur.x) * 0.2;
      cur.y += (pos.y - cur.y) * 0.2;
      if (ring.current) {
        ring.current.style.transform = `translate(${cur.x}px, ${cur.y}px) translate(-50%, -50%)`;
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onMove);
    };
  }, []);

  if (!enabled) return null;

  return (
    <div
      ref={ring}
      aria-hidden
      className="pointer-events-none fixed left-0 top-0 z-[90] rounded-full transition-[width,height,background-color,border-color] duration-200 ease-out"
      style={{
        width: active ? 44 : 22,
        height: active ? 44 : 22,
        border: "1.5px solid var(--ice)",
        background: active
          ? "linear-gradient(100deg, rgba(255,62,165,0.18), rgba(255,180,84,0.18))"
          : "transparent",
        mixBlendMode: "screen",
      }}
    />
  );
}
