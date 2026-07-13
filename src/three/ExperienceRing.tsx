"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useScene } from "@/lib/store";
import { data } from "@/lib/data";

/**
 * Experience: a thin orbiting node ring that fills in as you scroll through it —
 * ring completion literally reads as career progress. Major nodes = the 4 roles.
 */
const _v = new THREE.Vector3();

export default function ExperienceRing({
  position,
  at,
  wpIndex,
  id = "experience",
}: {
  position: [number, number, number];
  at: number;
  wpIndex: number;
  id?: string;
}) {
  const group = useRef<THREE.Group>(null);
  const count = data.experience.length;
  const total = count * 3; // majors + 2 minors between each

  const nodes = useMemo(
    () =>
      Array.from({ length: total }, (_, i) => {
        const a = (i / total) * Math.PI * 2 - Math.PI / 2;
        return new THREE.Vector3(Math.cos(a) * 2.1, Math.sin(a) * 2.1, 0);
      }),
    [total]
  );

  const mats = useRef<THREE.MeshStandardMaterial[]>([]);

  useFrame((_, dt) => {
    const g = group.current;
    if (!g) return;
    const { progress, hovered, active } = useScene.getState();
    g.rotation.z += dt * 0.05;

    const boost = hovered === id;
    const s = boost ? 1.12 : 1;
    g.scale.lerp(_v.set(s, s, s), 0.08);

    const lit = THREE.MathUtils.clamp((progress - (at - 0.05)) / 0.12, 0, 1) * total;
    const isActive = active === wpIndex;
    mats.current.forEach((m, i) => {
      if (!m) return;
      const on = i < lit;
      m.emissiveIntensity = THREE.MathUtils.lerp(
        m.emissiveIntensity,
        on ? (isActive ? 2 : 1.4) : 0.15,
        0.1
      );
    });
  });

  return (
    <group ref={group} position={position}>
      <mesh>
        <torusGeometry args={[2.1, 0.012, 8, 90]} />
        <meshBasicMaterial color="#8fd9ff" transparent opacity={0.22} />
      </mesh>
      {nodes.map((p, i) => (
        <mesh key={i} position={p}>
          <sphereGeometry args={[i % 3 === 0 ? 0.13 : 0.06, 14, 14]} />
          <meshStandardMaterial
            ref={(el) => {
              if (el) mats.current[i] = el;
            }}
            color="#ffb454"
            emissive="#ff5ea0"
            emissiveIntensity={0.15}
          />
        </mesh>
      ))}
    </group>
  );
}
