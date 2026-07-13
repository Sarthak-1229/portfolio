"use client";

import { useEffect } from "react";
import dynamic from "next/dynamic";
import { useScene } from "@/lib/store";
import ScrollController from "@/components/ScrollController";

// Canvas is client-only (no SSR) and code-split so three.js stays out of first paint.
const Scene = dynamic(() => import("@/three/Scene"), { ssr: false });

/**
 * Detects reduced-motion + touch/mobile, feeds the store, and conditionally mounts
 * the 3D flight. On mobile / reduced-motion the persistent camera scene is dropped
 * entirely (DESIGN.md perf budget) — ScrollController still runs to drive DOM reveals.
 */
export default function SceneHost() {
  const setFlags = useScene((s) => s.setFlags);
  const reduced = useScene((s) => s.reduced);
  const isMobile = useScene((s) => s.isMobile);

  useEffect(() => {
    const mqReduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    const evaluate = () => {
      const touch =
        window.matchMedia("(pointer: coarse)").matches ||
        window.innerWidth < 768;
      setFlags({ reduced: mqReduce.matches, isMobile: touch });
    };
    evaluate();
    mqReduce.addEventListener("change", evaluate);
    window.addEventListener("resize", evaluate);
    return () => {
      mqReduce.removeEventListener("change", evaluate);
      window.removeEventListener("resize", evaluate);
    };
  }, [setFlags]);

  const enable3D = !reduced && !isMobile;

  return (
    <>
      {enable3D && <Scene />}
      <ScrollController />
    </>
  );
}
