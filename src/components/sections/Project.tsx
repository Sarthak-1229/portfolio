"use client";

import Image from "next/image";
import { Panel } from "@/components/Overlay";
import PanelCard from "@/components/sections/PanelCard";
import { data } from "@/lib/data";

/** One project panel, docking beside its bespoke 3D form. */
export default function Project({
  at,
  index,
  side,
  hoverId,
}: {
  at: number;
  index: number;
  side: "left" | "right";
  hoverId: string;
}) {
  const p = data.projects[index];
  const points = p.points.filter((x) => !x.startsWith("PLACEHOLDER"));

  return (
    <Panel at={at} side={side}>
      <PanelCard hoverId={hoverId}>
        <div className="hud-label mb-3">
          // project · {String(index + 1).padStart(2, "0")}
        </div>
        <div className="relative mb-4 aspect-[16/9] w-full overflow-hidden rounded-lg border border-white/10 bg-white/5">
          <Image
            src={p.image}
            alt={`${p.name} screenshot`}
            fill
            sizes="(max-width: 640px) 90vw, 36rem"
            className="object-cover"
          />
        </div>
        <h3 className="font-display text-2xl font-bold text-text">{p.name}</h3>
        <p className="mt-1 text-sm text-ice">{p.tagline}</p>
        {points[0] && (
          <p className="mt-3 text-sm leading-relaxed text-text/70">{points[0]}</p>
        )}
        {p.achievement && (
          <p className="mt-3 inline-block rounded bg-gradient-to-r from-nebula-start/20 to-nebula-end/20 px-3 py-1 text-xs font-medium text-nebula-end">
            ★ {p.achievement}
          </p>
        )}
        <div className="mt-4 flex flex-wrap items-center gap-2 font-mono text-[0.65rem] uppercase tracking-wider text-muted">
          {p.tags.map((t) => (
            <span key={t} className="rounded border border-white/10 px-2 py-1">
              {t}
            </span>
          ))}
        </div>
        <div className="mt-4 flex gap-4 text-xs">
          {p.github && (
            <a
              href={p.github}
              target="_blank"
              rel="noreferrer"
              className="text-ice underline-offset-4 hover:underline"
            >
              GitHub ↗
            </a>
          )}
          {p.hasResearchPaper && (
            <span className="text-muted">Research paper in progress</span>
          )}
        </div>
      </PanelCard>
    </Panel>
  );
}
