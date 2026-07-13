"use client";

import { useMemo, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { useScene } from "@/lib/store";

/**
 * One distinct abstract form per project, driven by its `form3d` description in
 * content/data.json. Non-hero forms sit in ice/neutral tone and only ramp their
 * nebula emissive when they're the active dock or hovered (DESIGN.md: emissive glow
 * on the active form only).
 */
const _v = new THREE.Vector3();

function useFormState(id: string, wpIndex: number) {
  return () => {
    const { hovered, active } = useScene.getState();
    return { hover: hovered === id, active: active === wpIndex };
  };
}

/** shared emissive ramp for a material given active/hover */
function ramp(m: THREE.MeshStandardMaterial | null, on: boolean, active: boolean) {
  if (!m) return;
  m.emissiveIntensity = THREE.MathUtils.lerp(
    m.emissiveIntensity,
    on ? (active ? 2.2 : 1.5) : 0.3,
    0.1
  );
}

type FormProps = {
  position: [number, number, number];
  projectIndex: number;
  wpIndex: number;
  id: string;
};

/* ---- 0: VAYU — pulsing sensor spheres orbiting a purifier core ---- */
function VayuForm({ id, wpIndex }: { id: string; wpIndex: number }) {
  const group = useRef<THREE.Group>(null);
  const orbs = useRef<THREE.Mesh[]>([]);
  const coreMat = useRef<THREE.MeshStandardMaterial>(null);
  const get = useFormState(id, wpIndex);
  const seeds = useMemo(
    () => Array.from({ length: 8 }, (_, i) => i / 8),
    []
  );
  useFrame((state, dt) => {
    const g = group.current;
    if (!g) return;
    const { hover, active } = get();
    g.rotation.y += dt * 0.25;
    const s = hover ? 1.15 : 1;
    g.scale.lerp(_v.set(s, s, s), 0.08);
    const t = state.clock.elapsedTime;
    orbs.current.forEach((o, i) => {
      if (!o) return;
      const pulse = 0.8 + 0.35 * Math.sin(t * 2 + i);
      o.scale.setScalar(pulse);
    });
    ramp(coreMat.current, hover || active, active);
  });
  return (
    <group ref={group}>
      <mesh>
        <meshStandardMaterial
          ref={coreMat}
          color="#8fd9ff"
          emissive="#ff5ea0"
          emissiveIntensity={0.3}
          wireframe
        />
        <icosahedronGeometry args={[0.9, 1]} />
      </mesh>
      {seeds.map((sd, i) => {
        const a = sd * Math.PI * 2;
        const r = 1.9;
        return (
          <mesh
            key={i}
            position={[Math.cos(a) * r, Math.sin(a * 1.3) * 0.6, Math.sin(a) * r]}
            ref={(el) => {
              if (el) orbs.current[i] = el;
            }}
          >
            <sphereGeometry args={[0.12, 12, 12]} />
            <meshStandardMaterial color="#8fd9ff" emissive="#8fd9ff" emissiveIntensity={1.1} />
          </mesh>
        );
      })}
    </group>
  );
}

/* ---- 1: PLUTO — companion orb that trails the camera with lag ---- */
function PlutoForm({ id, wpIndex, position }: { id: string; wpIndex: number; position: [number, number, number] }) {
  const orb = useRef<THREE.Group>(null);
  const mat = useRef<THREE.MeshStandardMaterial>(null);
  const camera = useThree((s) => s.camera);
  const get = useFormState(id, wpIndex);
  const home = useMemo(() => new THREE.Vector3(...position), [position]);
  useFrame((state, dt) => {
    const g = orb.current;
    if (!g) return;
    const { hover, active } = get();
    // target = home nudged toward camera, so it "looks at"/follows with lag
    _v.copy(camera.position).sub(home).normalize().multiplyScalar(1.6).add(home);
    _v.y += Math.sin(state.clock.elapsedTime * 1.5) * 0.25;
    g.position.lerp(_v, 0.02); // heavy lag = pet-like follow
    ramp(mat.current, hover || active, active);
    const s = hover ? 1.2 : 1;
    g.scale.lerp(_v.set(s, s, s).addScalar(0), 0.08);
  });
  return (
    <group ref={orb} position={position}>
      <mesh>
        <sphereGeometry args={[0.55, 24, 24]} />
        <meshStandardMaterial ref={mat} color="#8fd9ff" emissive="#ffb454" emissiveIntensity={0.3} roughness={0.3} />
      </mesh>
      <mesh scale={1.35}>
        <sphereGeometry args={[0.55, 16, 16]} />
        <meshBasicMaterial color="#8fd9ff" wireframe transparent opacity={0.15} />
      </mesh>
    </group>
  );
}

/* ---- 2: VYORIUS — grid of small cubes (task board) ---- */
function VyoriusForm({ id, wpIndex }: { id: string; wpIndex: number }) {
  const group = useRef<THREE.Group>(null);
  const cubes = useRef<THREE.Mesh[]>([]);
  const mat = useRef<THREE.MeshStandardMaterial>(null);
  const get = useFormState(id, wpIndex);
  const cells = useMemo(() => {
    const arr: [number, number][] = [];
    for (let x = 0; x < 4; x++) for (let y = 0; y < 4; y++) arr.push([x, y]);
    return arr;
  }, []);
  useFrame((state, dt) => {
    const g = group.current;
    if (!g) return;
    const { hover, active } = get();
    g.rotation.y = Math.sin(state.clock.elapsedTime * 0.2) * 0.4;
    const s = hover ? 1.12 : 1;
    g.scale.lerp(_v.set(s, s, s), 0.08);
    cubes.current.forEach((c, i) => {
      if (!c) return;
      c.position.z = Math.sin(state.clock.elapsedTime * 1.5 + i) * 0.12;
    });
    ramp(mat.current, hover || active, active);
  });
  return (
    <group ref={group}>
      {cells.map(([x, y], i) => (
        <mesh
          key={i}
          position={[(x - 1.5) * 0.7, (y - 1.5) * 0.7, 0]}
          ref={(el) => {
            if (el) cubes.current[i] = el;
          }}
        >
          <boxGeometry args={[0.4, 0.4, 0.4]} />
          {i === 0 ? (
            <meshStandardMaterial ref={mat} color="#8fd9ff" emissive="#ff5ea0" emissiveIntensity={0.3} wireframe />
          ) : (
            <meshBasicMaterial color="#8fd9ff" wireframe transparent opacity={0.5} />
          )}
        </mesh>
      ))}
    </group>
  );
}

/* ---- 3: BRIXE — two interlocking counter-rotating rings ---- */
function BrixeForm({ id, wpIndex }: { id: string; wpIndex: number }) {
  const a = useRef<THREE.Mesh>(null);
  const b = useRef<THREE.Mesh>(null);
  const group = useRef<THREE.Group>(null);
  const mA = useRef<THREE.MeshStandardMaterial>(null);
  const mB = useRef<THREE.MeshStandardMaterial>(null);
  const get = useFormState(id, wpIndex);
  useFrame((_, dt) => {
    const { hover, active } = get();
    if (a.current) a.current.rotation.z += dt * 0.5;
    if (b.current) b.current.rotation.z -= dt * 0.5;
    if (group.current) {
      const s = hover ? 1.12 : 1;
      group.current.scale.lerp(_v.set(s, s, s), 0.08);
    }
    ramp(mA.current, hover || active, active);
    ramp(mB.current, hover || active, active);
  });
  return (
    <group ref={group}>
      <mesh ref={a} position={[-0.5, 0, 0]}>
        <torusGeometry args={[1.1, 0.07, 16, 48]} />
        <meshStandardMaterial ref={mA} color="#8fd9ff" emissive="#8fd9ff" emissiveIntensity={0.6} />
      </mesh>
      <mesh ref={b} position={[0.5, 0, 0]} rotation={[Math.PI / 2.4, 0, 0]}>
        <torusGeometry args={[1.1, 0.07, 16, 48]} />
        <meshStandardMaterial ref={mB} color="#ffb454" emissive="#ffb454" emissiveIntensity={0.6} />
      </mesh>
    </group>
  );
}

/* ---- 4: SAFAR — a route line with a single traveling node ---- */
function SafarForm({ id, wpIndex }: { id: string; wpIndex: number }) {
  const node = useRef<THREE.Mesh>(null);
  const group = useRef<THREE.Group>(null);
  const mat = useRef<THREE.MeshStandardMaterial>(null);
  const get = useFormState(id, wpIndex);
  const curve = useMemo(
    () =>
      new THREE.CatmullRomCurve3([
        new THREE.Vector3(-2, -0.8, 0),
        new THREE.Vector3(-0.8, 0.9, 0.4),
        new THREE.Vector3(0.7, -0.6, -0.4),
        new THREE.Vector3(2, 1, 0),
      ]),
    []
  );
  const tube = useMemo(() => new THREE.TubeGeometry(curve, 60, 0.03, 8, false), [curve]);
  useFrame((state) => {
    const { hover, active } = get();
    const t = (state.clock.elapsedTime * 0.18) % 1;
    if (node.current) node.current.position.copy(curve.getPointAt(t));
    if (group.current) {
      const s = hover ? 1.12 : 1;
      group.current.scale.lerp(_v.set(s, s, s), 0.08);
    }
    ramp(mat.current, true, active); // traveling node always lit
  });
  return (
    <group ref={group}>
      <mesh geometry={tube}>
        <meshBasicMaterial color="#8fd9ff" transparent opacity={0.35} />
      </mesh>
      <mesh ref={node}>
        <sphereGeometry args={[0.16, 16, 16]} />
        <meshStandardMaterial ref={mat} color="#ffb454" emissive="#ff5ea0" emissiveIntensity={1.5} />
      </mesh>
    </group>
  );
}

/* ---- 5: RESUME — stack of thin panels that shuffle/reorder ---- */
function ResumeForm({ id, wpIndex }: { id: string; wpIndex: number }) {
  const group = useRef<THREE.Group>(null);
  const panels = useRef<THREE.Mesh[]>([]);
  const mat = useRef<THREE.MeshStandardMaterial>(null);
  const get = useFormState(id, wpIndex);
  const idx = useMemo(() => [0, 1, 2, 3, 4], []);
  useFrame((state, dt) => {
    const g = group.current;
    if (!g) return;
    const { hover, active } = get();
    g.rotation.y += dt * 0.15;
    const s = hover ? 1.12 : 1;
    g.scale.lerp(_v.set(s, s, s), 0.08);
    const t = state.clock.elapsedTime;
    panels.current.forEach((p, i) => {
      if (!p) return;
      p.position.y = (i - 2) * 0.32 + Math.sin(t * 0.8 + i * 1.3) * 0.12;
      p.rotation.z = Math.sin(t * 0.5 + i) * 0.08;
    });
    ramp(mat.current, hover || active, active);
  });
  return (
    <group ref={group}>
      {idx.map((i) => (
        <mesh
          key={i}
          position={[0, (i - 2) * 0.32, 0]}
          ref={(el) => {
            if (el) panels.current[i] = el;
          }}
        >
          <boxGeometry args={[1.5, 0.05, 1]} />
          {i === 2 ? (
            <meshStandardMaterial ref={mat} color="#8fd9ff" emissive="#ff5ea0" emissiveIntensity={0.3} />
          ) : (
            <meshBasicMaterial color="#8fd9ff" wireframe transparent opacity={0.4} />
          )}
        </mesh>
      ))}
    </group>
  );
}

/* ---- 6: DRONE — quadcopter wireframe hovering with a bob ---- */
function DroneForm({ id, wpIndex }: { id: string; wpIndex: number }) {
  const group = useRef<THREE.Group>(null);
  const rotors = useRef<THREE.Mesh[]>([]);
  const mat = useRef<THREE.MeshStandardMaterial>(null);
  const get = useFormState(id, wpIndex);
  const arms = useMemo(
    () =>
      [
        [1, 1],
        [-1, 1],
        [1, -1],
        [-1, -1],
      ] as [number, number][],
    []
  );
  useFrame((state, dt) => {
    const g = group.current;
    if (!g) return;
    const { hover, active } = get();
    g.position.y = Math.sin(state.clock.elapsedTime * 1.6) * 0.15;
    g.rotation.y += dt * 0.2;
    const s = hover ? 1.15 : 1;
    g.scale.lerp(_v.set(s, s, s), 0.08);
    rotors.current.forEach((r) => {
      if (r) r.rotation.y += dt * 20;
    });
    ramp(mat.current, hover || active, active);
  });
  return (
    <group ref={group}>
      <mesh>
        <boxGeometry args={[0.5, 0.18, 0.5]} />
        <meshStandardMaterial ref={mat} color="#8fd9ff" emissive="#ff5ea0" emissiveIntensity={0.3} wireframe />
      </mesh>
      {arms.map(([x, z], i) => (
        <group key={i} position={[x * 0.9, 0, z * 0.9]}>
          <mesh position={[-x * 0.45, 0, -z * 0.45]} rotation={[0, Math.atan2(z, x), 0]}>
            <boxGeometry args={[0.9, 0.04, 0.04]} />
            <meshBasicMaterial color="#8fd9ff" transparent opacity={0.6} />
          </mesh>
          <mesh
            ref={(el) => {
              if (el) rotors.current[i] = el;
            }}
          >
            <torusGeometry args={[0.28, 0.02, 8, 24]} />
            <meshStandardMaterial color="#ffb454" emissive="#ffb454" emissiveIntensity={0.9} />
          </mesh>
        </group>
      ))}
    </group>
  );
}

export default function ProjectForm({ position, projectIndex, wpIndex, id }: FormProps) {
  const inner = (() => {
    switch (projectIndex) {
      case 0:
        return <VayuForm id={id} wpIndex={wpIndex} />;
      case 1:
        return <PlutoForm id={id} wpIndex={wpIndex} position={position} />;
      case 2:
        return <VyoriusForm id={id} wpIndex={wpIndex} />;
      case 3:
        return <BrixeForm id={id} wpIndex={wpIndex} />;
      case 4:
        return <SafarForm id={id} wpIndex={wpIndex} />;
      case 5:
        return <ResumeForm id={id} wpIndex={wpIndex} />;
      default:
        return <DroneForm id={id} wpIndex={wpIndex} />;
    }
  })();

  // Pluto positions itself (camera-follow); others sit at the waypoint.
  if (projectIndex === 1) return inner;
  return <group position={position}>{inner}</group>;
}
