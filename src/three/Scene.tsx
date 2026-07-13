"use client";

import { Canvas } from "@react-three/fiber";
import CameraRig from "@/three/CameraRig";
import ParticleField from "@/three/ParticleField";
import HeroCore from "@/three/HeroCore";
import ExperienceRing from "@/three/ExperienceRing";
import ProjectForm from "@/three/ProjectForm";
import SkillsCluster from "@/three/SkillsCluster";
import ContactBeacon from "@/three/ContactBeacon";
import Effects from "@/three/Effects";
import { waypoints } from "@/lib/waypoints";

const last = waypoints.length - 1;
const atOf = (i: number) => (last === 0 ? 0 : i / last);

/** Dispatch: render the right 3D form at each waypoint's aim point. */
function Form({ index }: { index: number }) {
  const w = waypoints[index];
  switch (w.kind) {
    case "hero":
      return <HeroCore position={w.lookAt} />;
    case "experience":
      return (
        <ExperienceRing position={w.lookAt} at={atOf(index)} wpIndex={index} />
      );
    case "project":
      return (
        <ProjectForm
          position={w.lookAt}
          projectIndex={w.projectIndex ?? 0}
          wpIndex={index}
          id={w.id}
        />
      );
    case "skills":
      return <SkillsCluster position={w.lookAt} wpIndex={index} />;
    case "contact":
      return <ContactBeacon position={w.lookAt} wpIndex={index} />;
    default:
      return null;
  }
}

/**
 * STEP 4: persistent Observatory + real per-section forms along the full 11-waypoint
 * flight. Camera rig + postprocessing unchanged from earlier steps.
 */
export default function Scene() {
  return (
    <Canvas
      className="scene-canvas"
      camera={{ position: waypoints[0].position, fov: 55, near: 0.1, far: 220 }}
      dpr={[1, 1.75]}
      gl={{ antialias: true, powerPreference: "high-performance" }}
    >
      <color attach="background" args={["#08060f"]} />
      <fog attach="fog" args={["#08060f", 20, 70]} />

      <CameraRig />
      <ParticleField />

      {waypoints.map((w, i) => (
        <Form key={w.id} index={i} />
      ))}

      <ambientLight intensity={0.35} />
      <directionalLight position={[5, 8, 6]} intensity={0.5} color="#8fd9ff" />
      <pointLight position={[-6, -2, -8]} intensity={12} color="#ff3ea5" distance={40} />
      <pointLight position={[4, 2, -80]} intensity={14} color="#ffb454" distance={50} />

      <Effects />
    </Canvas>
  );
}
