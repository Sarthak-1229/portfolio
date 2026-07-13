"use client";

import { Panel } from "@/components/Overlay";
import PanelCard from "@/components/sections/PanelCard";
import { data } from "@/lib/data";

/** Accomplishments + Contact — the final "here's everything" beat as camera pulls back. */
export default function Contact({ at }: { at: number }) {
  const c = data.contact;
  return (
    <Panel at={at} side="center">
      <PanelCard className="text-left">
        <div className="hud-label mb-4">// end of transmission</div>
        <h2 className="font-display text-3xl font-bold">
          <span className="nebula-text">Let&apos;s build something.</span>
        </h2>

        <div className="mt-5 space-y-1.5">
          {data.accomplishments.map((a, i) => (
            <p key={i} className="text-sm text-nebula-end">
              ★ {a}
            </p>
          ))}
        </div>

        <div className="mt-5 flex flex-wrap gap-x-5 gap-y-2 font-mono text-xs text-ice">
          <a href={`mailto:${c.email}`} className="hover:underline">
            {c.email}
          </a>
          <a href={c.github} target="_blank" rel="noreferrer" className="hover:underline">
            GitHub ↗
          </a>
          <a href={c.linkedin} target="_blank" rel="noreferrer" className="hover:underline">
            LinkedIn ↗
          </a>
        </div>

        <a
          href={c.resume}
          download
          className="mt-6 inline-block rounded-lg border border-nebula-start/40 bg-gradient-to-r from-nebula-start/15 to-nebula-end/15 px-5 py-2.5 text-sm font-medium text-text transition hover:border-nebula-start/70"
        >
          Download Résumé ↓
        </a>

        {data.certifications?.length > 0 && (
          <p className="mt-6 font-mono text-[0.65rem] leading-relaxed text-muted">
            {data.certifications.length} certifications · {data.location}
          </p>
        )}
      </PanelCard>
    </Panel>
  );
}
