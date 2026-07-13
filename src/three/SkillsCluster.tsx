"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useScene } from "@/lib/store";
import { data } from "@/lib/data";

/**
 * Skills: the node field returns, now grouped into visible clusters by domain — one
 * constellation per skill group, each node a skill. Reads as "the network, organized".
 */
const _v = new THREE.Vector3();

export default function SkillsCluster({
  position,
  wpIndex,
  id = "skills",
}: {
  position: [number, number, number];
  wpIndex: number;
  id?: string;
}) {
  const group = useRef<THREE.Group>(null);
  const mat = useRef<THREE.MeshStandardMaterial>(null);

  const clusters = useMemo(() => {
    const groups = Object.values(data.skills as Record<string, string[]>);
    return groups.map((skills, gi) => {
      const ga = (gi / groups.length) * Math.PI * 2;
      const center = new THREE.Vector3(Math.cos(ga) * 2.4, Math.sin(ga) * 2.4, 0);
      const nodes = skills.map((_, si) => {
        const na = (si / Math.max(skills.length, 1)) * Math.PI * 2;
        const r = 0.55;
        return new THREE.Vector3(
          center.x + Math.cos(na) * r,
          center.y + Math.sin(na) * r,
          Math.sin(si) * 0.3
        );
      });
      return { center, nodes };
    });
  }, []);

  useFrame((_, dt) => {
    const g = group.current;
    if (!g) return;
    const { hovered, active } = useScene.getState();
    g.rotation.z += dt * 0.03;
    const s = hovered === id ? 1.1 : 1;
    g.scale.lerp(_v.set(s, s, s), 0.08);
    if (mat.current) {
      const isActive = active === wpIndex;
      mat.current.emissiveIntensity = THREE.MathUtils.lerp(
        mat.current.emissiveIntensity,
        isActive ? 1.8 : 1,
        0.1
      );
    }
  });

  return (
    <group ref={group} position={position}>
      {clusters.map((c, ci) => (
        <group key={ci}>
          {/* faint hub */}
          <mesh position={c.center}>
            <sphereGeometry args={[0.09, 10, 10]} />
            <meshBasicMaterial color="#8fd9ff" transparent opacity={0.5} />
          </mesh>
          {c.nodes.map((p, ni) => (
            <mesh key={ni} position={p}>
              <sphereGeometry args={[0.05, 10, 10]} />
              {ci === 0 && ni === 0 ? (
                <meshStandardMaterial ref={mat} color="#8fd9ff" emissive="#8fd9ff" emissiveIntensity={1} />
              ) : (
                <meshStandardMaterial color="#8fd9ff" emissive="#8fd9ff" emissiveIntensity={0.7} />
              )}
            </mesh>
          ))}
        </group>
      ))}
    </group>
  );
}
