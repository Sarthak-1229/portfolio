"use client";

import { Canvas } from "@react-three/fiber";
import CameraRig from "@/three/CameraRig";
import { waypoints } from "@/lib/waypoints";

/**
 * STEP 1 scaffold: empty dark scene + the camera rig + placeholder markers at each
 * waypoint so the flight path is visibly verifiable. Environment, forms, and
 * postprocessing come in later steps. `frameloop="always"` because the camera moves
 * continuously; off-screen pause isn't relevant (canvas is the whole page).
 */
export default function Scene() {
  return (
    <Canvas
      className="scene-canvas"
      camera={{ position: waypoints[0].position, fov: 55, near: 0.1, far: 200 }}
      dpr={[1, 1.75]}
      gl={{ antialias: true, powerPreference: "high-performance" }}
    >
      <color attach="background" args={["#08060f"]} />
      <CameraRig />

      {/* placeholder waypoint markers — removed once real forms land */}
      {waypoints.map((w, i) => (
        <mesh key={w.id} position={w.lookAt}>
          <icosahedronGeometry args={[0.8, 0]} />
          <meshBasicMaterial
            color={i === 0 ? "#ff3ea5" : "#8fd9ff"}
            wireframe
          />
        </mesh>
      ))}

      {/* a faint reference grid so motion through space is legible in step 1 */}
      <gridHelper args={[60, 30, "#1a1526", "#120e1c"]} position={[0, -6, -10]} />

      <ambientLight intensity={0.6} />
    </Canvas>
  );
}
