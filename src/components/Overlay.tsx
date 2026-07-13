"use client";

import {
  createContext,
  useContext,
  useEffect,
  type ReactNode,
} from "react";
import { motion, useMotionValue, useTransform, type MotionValue } from "framer-motion";
import { useScene } from "@/lib/store";

/**
 * Bridges the zustand scroll `progress` into a Framer MotionValue via a single
 * subscription — so overlay panels animate off the SAME source as the camera without
 * re-rendering React every scroll frame. This is the DOM half of the docking sync.
 */
const ProgressCtx = createContext<MotionValue<number> | null>(null);

export function ProgressProvider({ children }: { children: ReactNode }) {
  const mv = useMotionValue(0);
  useEffect(() => {
    // fire once for initial, then on every progress change
    mv.set(useScene.getState().progress);
    return useScene.subscribe((s) => mv.set(s.progress));
  }, [mv]);
  return <ProgressCtx.Provider value={mv}>{children}</ProgressCtx.Provider>;
}

export function useProgress() {
  const mv = useContext(ProgressCtx);
  if (!mv) throw new Error("useProgress must be used inside ProgressProvider");
  return mv;
}

/**
 * A docking panel. `at` is the section's normalized position on the flight (0..1);
 * the panel fades/slides in only while the camera is docked near it. Because `at`
 * and the camera both read the same progress, arrival and panel entrance are locked.
 */
export function Panel({
  at,
  span = 0.05,
  side = "left",
  children,
  className = "",
}: {
  at: number;
  span?: number;
  side?: "left" | "right" | "center";
  children: ReactNode;
  className?: string;
}) {
  const p = useProgress();
  const opacity = useTransform(
    p,
    [at - span, at - span * 0.35, at + span * 0.35, at + span],
    [0, 1, 1, 0]
  );
  const y = useTransform(p, [at - span, at, at + span], [60, 0, -60]);
  const pointerEvents = useTransform(opacity, (v) =>
    v > 0.2 ? "auto" : "none"
  ) as unknown as MotionValue<"auto" | "none">;

  const justify =
    side === "center"
      ? "items-center text-center"
      : side === "right"
      ? "items-end text-right"
      : "items-start text-left";

  return (
    <motion.div
      style={{ opacity, y, pointerEvents }}
      className={`pointer-events-none fixed inset-0 z-10 flex flex-col justify-center px-6 sm:px-14 lg:px-24 ${justify} ${className}`}
    >
      <div className="max-w-xl">{children}</div>
    </motion.div>
  );
}
