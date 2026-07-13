"use client";

import { useRef, type ElementType, type ReactNode } from "react";

/**
 * Scroll-reveal wrapper. Elements marked with `data-reveal` inside are animated
 * on entry by the GSAP ScrollTrigger controller (see useScrollReveal, wired in
 * Phase 4). Children render fully visible if JS/GSAP is unavailable — reveal is
 * a progressive enhancement, never a gate on content.
 */
export default function Reveal({
  children,
  as: Tag = "div",
  className,
  stagger = true,
}: {
  children: ReactNode;
  as?: ElementType;
  className?: string;
  stagger?: boolean;
}) {
  const ref = useRef<HTMLElement>(null);
  return (
    <Tag
      ref={ref}
      className={className}
      data-reveal-root=""
      data-reveal-stagger={stagger ? "" : undefined}
    >
      {children}
    </Tag>
  );
}
