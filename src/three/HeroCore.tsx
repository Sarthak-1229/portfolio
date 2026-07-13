"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useScene } from "@/lib/store";

/**
 * Hero "signal core" — slowly rotating wireframe icosahedron, his identity. As the
 * active/current form it carries the nebula-magenta emissive glow (the only emissive
 * this bright, so Bloom picks it out). Reacts when its DOM panel is hovered (step 5).
 */
export default function HeroCore({
  position = [0, 0, 0] as [number, number, number],
}) {
  const group = useRef<THREE.Group>(null);
  const wire = useRef<THREE.Mesh>(null);
  const mat = useRef<THREE.MeshStandardMaterial>(null);

  useFrame((_, delta) => {
    const g = group.current;
    if (!g) return;
    const hovered = useScene.getState().hovered === "hero";
    g.rotation.y += delta * 0.18;
    g.rotation.x += delta * 0.06;

    // gentle breathing + hover kick
    const targetScale = hovered ? 1.15 : 1;
    g.scale.lerp(
      new THREE.Vector3(targetScale, targetScale, targetScale),
      0.08
    );
    if (mat.current) {
      const targetEmissive = hovered ? 2.4 : 1.3;
      mat.current.emissiveIntensity = THREE.MathUtils.lerp(
        mat.current.emissiveIntensity,
        targetEmissive,
        0.08
      );
    }
  });

  return (
    <group ref={group} position={position}>
      {/* emissive wireframe shell */}
      <mesh ref={wire}>
        <icosahedronGeometry args={[1.25, 1]} />
        <meshStandardMaterial
          ref={mat}
          color="#ff3ea5"
          emissive="#ff3ea5"
          emissiveIntensity={1.3}
          wireframe
          roughness={0.4}
        />
      </mesh>
      {/* faint solid inner core for depth */}
      <mesh scale={0.72}>
        <icosahedronGeometry args={[1.25, 0]} />
        <meshBasicMaterial color="#ffb454" transparent opacity={0.06} />
      </mesh>
    </group>
  );
}
