"use client";

import { motion, useTransform } from "framer-motion";
import { ProgressProvider, useProgress } from "@/components/Overlay";
import { waypoints } from "@/lib/waypoints";

const LABELS: Record<string, string> = {
  hero: "Signal",
  experience: "Experience",
  project: "Project",
  skills: "Skills",
  contact: "Contact",
};

function Rail() {
  const p = useProgress();
  const last = waypoints.length - 1;
  const fillHeight = useTransform(p, (v) => `${v * 100}%`);

  return (
    <div className="pointer-events-none fixed right-6 top-1/2 z-40 hidden -translate-y-1/2 flex-col items-center gap-3 sm:flex">
      <div className="relative h-48 w-px bg-white/10">
        <motion.div
          className="absolute left-0 top-0 w-px bg-nebula"
          style={{ height: fillHeight }}
        />
        {waypoints.map((w, i) => {
          const at = last === 0 ? 0 : i / last;
          return <Tick key={w.id} at={at} p={p} />;
        })}
      </div>
    </div>
  );
}

function Tick({
  at,
  p,
}: {
  at: number;
  p: ReturnType<typeof useProgress>;
}) {
  const scale = useTransform(p, [at - 0.04, at, at + 0.04], [1, 1.9, 1]);
  const bg = useTransform(p, [at - 0.04, at, at + 0.04], ["#ffffff30", "#ff3ea5", "#ffffff30"]);
  return (
    <motion.span
      className="absolute -left-[3px] h-1.5 w-1.5 rounded-full"
      style={{ top: `${at * 100}%`, scale, backgroundColor: bg }}
    />
  );
}

/** Thin flight-progress rail with a tick per waypoint. Hidden on small screens. */
export default function ProgressRail() {
  return (
    <ProgressProvider>
      <Rail />
    </ProgressProvider>
  );
}
