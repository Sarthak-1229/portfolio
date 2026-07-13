"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useScene } from "@/lib/store";
import { waypoints } from "@/lib/waypoints";

gsap.registerPlugin(ScrollTrigger);

/**
 * The ONE place scroll is read. Lenis provides inertial smooth-scroll; a single
 * ScrollTrigger with `scrub` maps scroll 0..1 into the store. Camera rig + DOM
 * overlays both subscribe to the store — nothing else touches scroll directly.
 *
 * `scrub` (a lag value, not `true`) plus Lenis inertia is what gives the camera its
 * weighty accelerate/decelerate feel instead of linear 1:1 mapping (DESIGN.md).
 */
export default function ScrollController() {
  const setProgress = useScene((s) => s.setProgress);
  const setActive = useScene((s) => s.setActive);
  const reduced = useScene((s) => s.reduced);
  const isMobile = useScene((s) => s.isMobile);

  useEffect(() => {
    // Reduced-motion / mobile: no camera flight. Progress is driven directly by
    // native scroll position so DOM sections still reveal, but we skip Lenis inertia.
    if (reduced || isMobile) {
      const onScroll = () => {
        const max = document.documentElement.scrollHeight - window.innerHeight;
        setProgress(max > 0 ? window.scrollY / max : 0);
      };
      onScroll();
      window.addEventListener("scroll", onScroll, { passive: true });
      return () => window.removeEventListener("scroll", onScroll);
    }

    const lenis = new Lenis({
      duration: 1.1,
      easing: (t) => 1 - Math.pow(1 - t, 3), // expo-ish ease, weighty stop
      smoothWheel: true,
    });

    lenis.on("scroll", ScrollTrigger.update);
    const raf = (time: number) => lenis.raf(time);
    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);

    const st = ScrollTrigger.create({
      trigger: document.documentElement,
      start: "top top",
      end: "bottom bottom",
      scrub: 1, // 1s catch-up lag → smooth accel/decel, not stepped
      onUpdate: (self) => {
        setProgress(self.progress);
        // active waypoint = nearest dock, drives which DOM panel shows
        const last = waypoints.length - 1;
        setActive(Math.round(self.progress * last));
      },
    });

    ScrollTrigger.refresh();
    const t = setTimeout(() => ScrollTrigger.refresh(), 400);

    return () => {
      clearTimeout(t);
      st.kill();
      gsap.ticker.remove(raf);
      lenis.destroy();
    };
  }, [reduced, isMobile, setProgress, setActive]);

  return null;
}
