"use client";

import { useEffect, useMemo, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

/**
 * Signal-graph modes. Each biases how nodes move and connect so the graph can
 * loosely echo whatever section the viewer has scrolled to.
 *   idle  — sparse neural-net drift (hero rest state)
 *   iot   — denser, clustered (hardware/sensor projects)
 *   cyber — sharp, angular, longer taut links (security content)
 *   ai    — smooth sine-like flow (AI/ML content)
 */
export type GraphMode = "idle" | "iot" | "cyber" | "ai";

const NODE_COUNT = 52;
const MAX_SEGMENTS = NODE_COUNT * 6;
const SIGNAL = new THREE.Color("#4cc9f0");

interface ModeParams {
  connectDist: number;
  drift: number;
  jitter: number; // angular sharpness of motion
  flow: number; // coherent sine flow strength
}

const MODE_PARAMS: Record<GraphMode, ModeParams> = {
  idle: { connectDist: 1.7, drift: 0.28, jitter: 0.15, flow: 0.35 },
  iot: { connectDist: 2.15, drift: 0.2, jitter: 0.1, flow: 0.2 },
  cyber: { connectDist: 2.4, drift: 0.34, jitter: 0.6, flow: 0.1 },
  ai: { connectDist: 1.85, drift: 0.24, jitter: 0.05, flow: 0.9 },
};

interface NodeSeed {
  base: THREE.Vector3;
  phase: number;
  speed: number;
  axis: THREE.Vector3;
}

function Graph({
  mode,
  animate,
}: {
  mode: GraphMode;
  animate: boolean;
}) {
  const pointsRef = useRef<THREE.Points>(null);
  const linesRef = useRef<THREE.LineSegments>(null);
  const groupRef = useRef<THREE.Group>(null);
  const { pointer, invalidate } = useThree();

  // Smoothly-interpolated live params so mode changes ease rather than snap.
  const params = useRef<ModeParams>({ ...MODE_PARAMS.idle });

  const seeds = useMemo<NodeSeed[]>(() => {
    const arr: NodeSeed[] = [];
    // Deterministic pseudo-random so SSR/hydration and reduced-motion match.
    let s = 1337;
    const rand = () => {
      s = (s * 1103515245 + 12345) & 0x7fffffff;
      return s / 0x7fffffff;
    };
    for (let i = 0; i < NODE_COUNT; i++) {
      arr.push({
        base: new THREE.Vector3(
          (rand() - 0.5) * 8.4,
          (rand() - 0.5) * 5,
          (rand() - 0.5) * 3.6
        ),
        phase: rand() * Math.PI * 2,
        speed: 0.4 + rand() * 0.9,
        axis: new THREE.Vector3(
          rand() - 0.5,
          rand() - 0.5,
          rand() - 0.5
        ).normalize(),
      });
    }
    return arr;
  }, []);

  const positions = useMemo(
    () => new Float32Array(NODE_COUNT * 3),
    []
  );
  const linePositions = useMemo(
    () => new Float32Array(MAX_SEGMENTS * 2 * 3),
    []
  );
  const live = useMemo(
    () => seeds.map((seed) => seed.base.clone()),
    [seeds]
  );

  // Compute node positions + connections for a given time value.
  const compute = (t: number) => {
    const p = params.current;
    for (let i = 0; i < NODE_COUNT; i++) {
      const seed = seeds[i];
      const ph = seed.phase + t * seed.speed;
      // Base drift + sharp angular component (cyber) + coherent flow (ai).
      const d = p.drift;
      const j = p.jitter;
      const f = p.flow;
      const wobble = Math.sin(ph) * d + Math.sin(ph * 3.3) * j * 0.4;
      live[i].set(
        seed.base.x +
          seed.axis.x * wobble +
          Math.sin(t * 0.5 + seed.base.y) * f * 0.4,
        seed.base.y +
          seed.axis.y * wobble +
          Math.cos(t * 0.4 + seed.base.x) * f * 0.4,
        seed.base.z + seed.axis.z * wobble
      );
      positions[i * 3] = live[i].x;
      positions[i * 3 + 1] = live[i].y;
      positions[i * 3 + 2] = live[i].z;
    }

    // Connections: link nodes within threshold, capped at MAX_SEGMENTS.
    const maxDistSq = p.connectDist * p.connectDist;
    let seg = 0;
    for (let i = 0; i < NODE_COUNT && seg < MAX_SEGMENTS; i++) {
      for (let k = i + 1; k < NODE_COUNT && seg < MAX_SEGMENTS; k++) {
        if (live[i].distanceToSquared(live[k]) < maxDistSq) {
          const o = seg * 6;
          linePositions[o] = live[i].x;
          linePositions[o + 1] = live[i].y;
          linePositions[o + 2] = live[i].z;
          linePositions[o + 3] = live[k].x;
          linePositions[o + 4] = live[k].y;
          linePositions[o + 5] = live[k].z;
          seg++;
        }
      }
    }
    return seg;
  };

  // Render one static frame on mount (and when re-mounted). Essential for the
  // reduced-motion path, where useFrame never runs — without this the canvas
  // would paint empty geometry.
  useEffect(() => {
    const seg = compute(0);
    const pg = pointsRef.current?.geometry;
    const lg = linesRef.current?.geometry;
    if (pg) (pg.attributes.position as THREE.BufferAttribute).needsUpdate = true;
    if (lg) {
      (lg.attributes.position as THREE.BufferAttribute).needsUpdate = true;
      lg.setDrawRange(0, seg * 2);
    }
    invalidate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useFrame((state, delta) => {
    if (!animate) return;
    // Ease live params toward the active mode.
    const target = MODE_PARAMS[mode];
    const lerp = Math.min(1, delta * 2.5);
    const cp = params.current;
    cp.connectDist += (target.connectDist - cp.connectDist) * lerp;
    cp.drift += (target.drift - cp.drift) * lerp;
    cp.jitter += (target.jitter - cp.jitter) * lerp;
    cp.flow += (target.flow - cp.flow) * lerp;

    const seg = compute(state.clock.elapsedTime);

    const pg = pointsRef.current?.geometry;
    const lg = linesRef.current?.geometry;
    if (pg) (pg.attributes.position as THREE.BufferAttribute).needsUpdate = true;
    if (lg) {
      (lg.attributes.position as THREE.BufferAttribute).needsUpdate = true;
      lg.setDrawRange(0, seg * 2);
    }

    // Gentle mouse parallax.
    if (groupRef.current) {
      groupRef.current.rotation.y +=
        (pointer.x * 0.35 - groupRef.current.rotation.y) * 0.04;
      groupRef.current.rotation.x +=
        (-pointer.y * 0.22 - groupRef.current.rotation.x) * 0.04;
    }
  });

  return (
    <group ref={groupRef}>
      <lineSegments ref={linesRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[linePositions, 3]}
            count={MAX_SEGMENTS * 2}
          />
        </bufferGeometry>
        <lineBasicMaterial
          color={SIGNAL}
          transparent
          opacity={0.28}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </lineSegments>
      <points ref={pointsRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[positions, 3]}
            count={NODE_COUNT}
          />
        </bufferGeometry>
        <pointsMaterial
          color={SIGNAL}
          size={0.09}
          sizeAttenuation
          transparent
          opacity={0.95}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </points>
    </group>
  );
}

export default function SignalGraph({
  mode = "idle",
  active,
  reducedMotion,
}: {
  mode?: GraphMode;
  active: boolean;
  reducedMotion: boolean;
}) {
  const animate = active && !reducedMotion;
  return (
    <Canvas
      // frameloop "never" fully idles the render loop when off-screen.
      frameloop={animate ? "always" : "never"}
      camera={{ position: [0, 0, 7.5], fov: 55 }}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      dpr={[1, 1.75]}
      style={{ pointerEvents: "none" }}
    >
      <Graph mode={mode} animate={!reducedMotion} />
    </Canvas>
  );
}
