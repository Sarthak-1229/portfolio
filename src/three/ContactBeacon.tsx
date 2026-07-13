"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useScene } from "@/lib/store";

/**
 * Contact: a slow nebula beacon at the far end. The real "finale" is the camera
 * pulling back and up (authored in the last waypoint) to reveal the whole traveled
 * path — this form is just the anchor the pull-back frames.
 */
export default function ContactBeacon({
  position,
  wpIndex,
}: {
  position: [number, number, number];
  wpIndex: number;
}) {
  const mat = useRef<THREE.MeshStandardMaterial>(null);
  const group = useRef<THREE.Group>(null);
  useFrame((state) => {
    const isActive = useScene.getState().active === wpIndex;
    if (mat.current) {
      const pulse = 1.2 + Math.sin(state.clock.elapsedTime * 1.4) * 0.5;
      mat.current.emissiveIntensity = THREE.MathUtils.lerp(
        mat.current.emissiveIntensity,
        isActive ? pulse + 0.8 : pulse,
        0.1
      );
    }
    if (group.current) group.current.rotation.z += 0.003;
  });
  return (
    <group ref={group} position={position}>
      <mesh>
        <torusGeometry args={[1, 0.05, 16, 60]} />
        <meshStandardMaterial ref={mat} color="#ff3ea5" emissive="#ff3ea5" emissiveIntensity={1.2} />
      </mesh>
      <mesh>
        <icosahedronGeometry args={[0.4, 0]} />
        <meshStandardMaterial color="#ffb454" emissive="#ffb454" emissiveIntensity={1.4} wireframe />
      </mesh>
    </group>
  );
}
