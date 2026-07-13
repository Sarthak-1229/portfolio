"use client";

import { Panel } from "@/components/Overlay";
import PanelCard from "@/components/sections/PanelCard";
import { data } from "@/lib/data";

const LABELS: Record<string, string> = {
  languages: "Languages",
  ai_ml: "AI / ML",
  web_fullstack: "Web · Full-Stack",
  cybersecurity: "Cybersecurity",
  iot: "IoT",
  tools: "Tools",
};

/** Skills — docks at the clustered node-ring. */
export default function Skills({ at }: { at: number }) {
  const groups = Object.entries(data.skills as Record<string, string[]>);
  return (
    <Panel at={at} side="left">
      <PanelCard hoverId="skills">
        <div className="hud-label mb-4">// skills · the network, organized</div>
        <div className="space-y-3">
          {groups.map(([key, items]) => (
            <div key={key}>
              <div className="mb-1.5 font-mono text-[0.65rem] uppercase tracking-widest text-ice">
                {LABELS[key] ?? key}
              </div>
              <div className="flex flex-wrap gap-1.5">
                {items.map((s) => (
                  <span
                    key={s}
                    className="rounded-md border border-white/10 bg-white/[0.03] px-2.5 py-1 text-xs text-text/80"
                  >
                    {s}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </PanelCard>
    </Panel>
  );
}
