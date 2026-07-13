"use client";

import { ProgressProvider } from "@/components/Overlay";
import Hero from "@/components/sections/Hero";
import Experience from "@/components/sections/Experience";
import Project from "@/components/sections/Project";
import Skills from "@/components/sections/Skills";
import Contact from "@/components/sections/Contact";
import { waypoints } from "@/lib/waypoints";

/**
 * Renders each waypoint's docking DOM panel. `at = i/(N-1)` ties every panel to its
 * camera dock; project panels alternate sides so the flight has left/right rhythm.
 */
export default function Sections() {
  const last = waypoints.length - 1;
  const at = (i: number) => (last === 0 ? 0 : i / last);

  return (
    <ProgressProvider>
      {waypoints.map((w, i) => {
        switch (w.kind) {
          case "hero":
            return <Hero key={w.id} at={at(i)} />;
          case "experience":
            return <Experience key={w.id} at={at(i)} />;
          case "project":
            return (
              <Project
                key={w.id}
                at={at(i)}
                index={w.projectIndex ?? 0}
                side={i % 2 === 0 ? "left" : "right"}
                hoverId={w.id}
              />
            );
          case "skills":
            return <Skills key={w.id} at={at(i)} />;
          case "contact":
            return <Contact key={w.id} at={at(i)} />;
          default:
            return null;
        }
      })}
    </ProgressProvider>
  );
}
