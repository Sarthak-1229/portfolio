"use client";

import { Panel } from "@/components/Overlay";
import PanelCard from "@/components/sections/PanelCard";
import { data } from "@/lib/data";

/** Experience timeline — docks at the orbiting-ring waypoint. */
export default function Experience({ at }: { at: number }) {
  return (
    <Panel at={at} side="left">
      <PanelCard hoverId="experience">
        <div className="hud-label mb-4">// experience · trajectory</div>
        <ul className="space-y-5">
          {data.experience.map((e, i) => {
            const points = e.points.filter((p) => !p.startsWith("PLACEHOLDER"));
            return (
              <li key={i} className="border-l border-white/10 pl-4">
                <div className="flex items-center gap-2">
                  {e.current && (
                    <span className="h-1.5 w-1.5 rounded-full bg-nebula-start shadow-[0_0_8px_var(--nebula-start)]" />
                  )}
                  <h3 className="font-display text-lg font-medium text-text">
                    {e.role}
                  </h3>
                </div>
                <p className="font-mono text-xs text-ice">
                  {e.org} · <span className="text-muted">{e.date}</span>
                </p>
                {points.length > 0 && (
                  <p className="mt-1.5 text-sm leading-relaxed text-text/70">
                    {points[0]}
                  </p>
                )}
              </li>
            );
          })}
        </ul>
      </PanelCard>
    </Panel>
  );
}
