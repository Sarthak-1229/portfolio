"use client";

import { useEffect, useLayoutEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// useLayoutEffect on the client (hide-before-paint, no flash); useEffect on the
// server to avoid the SSR warning.
const useIsoLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

/**
 * Single GSAP ScrollTrigger controller for the whole page. Reveals elements on
 * entry with a staggered fade + rise (transform/opacity only — no layout shift).
 *
 * Design note: DESIGN.md calls for a brief pin on each section's entry beat.
 * A literal pin fights the fixed nav and risks scroll jank, so this uses an
 * entry-triggered staggered reveal (no pin) — same "reveal beat", zero scroll
 * cost. Content renders visible if JS/GSAP never runs (progressive enhancement).
 */
export default function ScrollReveals() {
  useIsoLayoutEffect(() => {
    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    const roots = gsap.utils.toArray<HTMLElement>("[data-reveal-root]");

    // Reduced motion: ensure everything is simply visible, no motion.
    if (reduced) {
      roots.forEach((root) => {
        const items = root.querySelectorAll<HTMLElement>("[data-reveal-item]");
        gsap.set(items.length ? items : [root], { opacity: 1, y: 0 });
      });
      return;
    }

    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      const revealGroup = (trigger: HTMLElement, targets: HTMLElement[]) => {
        gsap.set(targets, { opacity: 0, y: 24 });
        ScrollTrigger.create({
          trigger,
          start: "top 85%",
          once: true,
          onEnter: () =>
            gsap.to(targets, {
              opacity: 1,
              y: 0,
              duration: 0.6,
              ease: "power3.out",
              stagger: 0.07, // 70ms, within DESIGN's 60–80ms window
            }),
        });
      };

      roots.forEach((root) => {
        const items = gsap.utils.toArray<HTMLElement>(
          root.querySelectorAll("[data-reveal-item]")
        );
        if (items.length === 0) {
          revealGroup(root, [root]);
        } else if (root.hasAttribute("data-reveal-stagger")) {
          // Group reveals together with a stagger as the root enters.
          revealGroup(root, items);
        } else {
          // Independent items (e.g. tall Projects list): each reveals on entry.
          items.forEach((item) => revealGroup(item, [item]));
        }
      });
    });

    // Recompute trigger positions once fonts/images have settled.
    const refresh = () => ScrollTrigger.refresh();
    window.addEventListener("load", refresh);
    const t = window.setTimeout(refresh, 400);

    return () => {
      window.removeEventListener("load", refresh);
      window.clearTimeout(t);
      ctx.revert();
    };
  }, []);

  return null;
}
