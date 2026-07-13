"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import FallbackSite from "@/components/FallbackSite";

// Cinematic build (three.js) is code-split so the fallback/SSR path never loads it.
const CinematicExperience = dynamic(
  () => import("@/components/CinematicExperience"),
  { ssr: false }
);

type Mode = "ssr" | "full" | "fallback";

/**
 * Decides between the camera-flight build and the flowing fallback. SSR + first paint
 * render FallbackSite (full semantic content, no 3D flash, SEO/no-JS baseline); after
 * mount, capable desktops upgrade to the cinematic build. Touch / narrow / reduced-
 * motion stay on the fallback. Re-evaluates on resize + reduced-motion change.
 */
export default function ExperienceRouter() {
  const [mode, setMode] = useState<Mode>("ssr");

  useEffect(() => {
    const mqReduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    const decide = () => {
      const touch =
        window.matchMedia("(pointer: coarse)").matches ||
        window.innerWidth < 768;
      setMode(mqReduce.matches || touch ? "fallback" : "full");
    };
    decide();
    mqReduce.addEventListener("change", decide);
    window.addEventListener("resize", decide);
    return () => {
      mqReduce.removeEventListener("change", decide);
      window.removeEventListener("resize", decide);
    };
  }, []);

  if (mode === "full") return <CinematicExperience />;
  return <FallbackSite />;
}
