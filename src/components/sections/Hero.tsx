"use client";

import { motion } from "framer-motion";
import { Panel } from "@/components/Overlay";
import { useScene } from "@/lib/store";
import { data } from "@/lib/data";

/** Hero DOM panel — docks at the signal-core waypoint (at=0). */
export default function Hero({ at }: { at: number }) {
  const setHovered = useScene((s) => s.setHovered);
  const edu = data.education[0];

  return (
    <Panel at={at} side="left">
      <div
        onMouseEnter={() => setHovered("hero")}
        onMouseLeave={() => setHovered(null)}
        className="pointer-events-auto"
      >
        <div className="hud-label mb-5">// signal · online</div>
        <h1 className="font-display text-5xl font-bold leading-[0.95] tracking-tight sm:text-7xl">
          <span className="nebula-text">{data.name}</span>
        </h1>
        <p className="mt-6 max-w-md font-sans text-lg leading-relaxed text-text/80">
          {data.title}
        </p>
        <div className="mt-8 flex flex-wrap gap-2 font-mono text-[0.7rem] uppercase tracking-widest text-ice">
          {["AI / ML", "Cybersecurity", "Full-Stack"].map((t) => (
            <span
              key={t}
              className="rounded border border-ice/25 px-3 py-1.5"
            >
              {t}
            </span>
          ))}
        </div>
        <p className="mt-8 font-mono text-xs text-muted">
          {edu.degree}
          <br />
          {edu.school} · {edu.date}
        </p>
      </div>

      <motion.div
        aria-hidden
        className="mt-14 flex items-center gap-3 font-mono text-[0.7rem] uppercase tracking-[0.3em] text-muted"
        animate={{ opacity: [0.35, 1, 0.35] }}
        transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
      >
        <span className="h-8 w-px bg-gradient-to-b from-ice to-transparent" />
        scroll to travel
      </motion.div>
    </Panel>
  );
}
