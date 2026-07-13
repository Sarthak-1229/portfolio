"use client";

import SceneHost from "@/components/SceneHost";
import Sections from "@/components/Sections";
import ProgressRail from "@/components/ProgressRail";

/** The full camera-flight build: persistent 3D scene + docking overlays + rail. */
export default function CinematicExperience() {
  return (
    <>
      <SceneHost />
      <Sections />
      <ProgressRail />
      {/* scroll runway — ~one viewport of travel per waypoint */}
      <div style={{ height: "1100vh" }} aria-hidden />
    </>
  );
}
