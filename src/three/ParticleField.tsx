"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

/**
 * "Observatory" field — a few hundred faint signal nodes (NOT a dense starfield).
 * They drift slowly and pulse, reading as a sensor/packet network rather than space.
 * Distributed through the volume the camera flies, loosely clustered so it feels like
 * a network, not uniform noise. Drift + pulse run in the shader (zero per-frame CPU).
 */
const COUNT = 360;

export default function ParticleField() {
  const matRef = useRef<THREE.ShaderMaterial>(null);

  const geometry = useMemo(() => {
    const positions = new Float32Array(COUNT * 3);
    const seeds = new Float32Array(COUNT);
    const scales = new Float32Array(COUNT);

    // deterministic PRNG so the field is stable across reloads
    let s = 1337;
    const rnd = () => {
      s = (s * 1664525 + 1013904223) % 4294967296;
      return s / 4294967296;
    };

    for (let i = 0; i < COUNT; i++) {
      // a few loose cluster centres → "sensor network", not uniform fog
      const cluster = Math.floor(rnd() * 5);
      const cx = [-8, 6, 2, -4, 9][cluster];
      const cy = [3, -4, 1, -2, 2][cluster];
      const cz = [8, 2, -10, -20, -6][cluster];
      const spread = 6 + rnd() * 4;
      positions[i * 3] = cx + (rnd() - 0.5) * spread;
      positions[i * 3 + 1] = cy + (rnd() - 0.5) * spread;
      positions[i * 3 + 2] = cz + (rnd() - 0.5) * spread * 1.6;
      seeds[i] = rnd();
      scales[i] = 0.5 + rnd() * 1.2;
    }

    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    g.setAttribute("aSeed", new THREE.BufferAttribute(seeds, 1));
    g.setAttribute("aScale", new THREE.BufferAttribute(scales, 1));
    return g;
  }, []);

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uColor: { value: new THREE.Color("#8fd9ff") },
      uPixelRatio: {
        value: typeof window !== "undefined" ? Math.min(window.devicePixelRatio, 1.75) : 1,
      },
    }),
    []
  );

  useFrame((_, delta) => {
    if (matRef.current) {
      (matRef.current.uniforms.uTime.value as number) += delta;
    }
  });

  return (
    <points geometry={geometry} frustumCulled={false}>
      <shaderMaterial
        ref={matRef}
        uniforms={uniforms}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        vertexShader={/* glsl */ `
          uniform float uTime;
          uniform float uPixelRatio;
          attribute float aSeed;
          attribute float aScale;
          varying float vPulse;
          void main() {
            vec3 p = position;
            p.x += sin(uTime * 0.10 + aSeed * 6.2831) * 0.3;
            p.y += cos(uTime * 0.08 + aSeed * 6.2831) * 0.3;
            vec4 mv = modelViewMatrix * vec4(p, 1.0);
            float pulse = 0.5 + 0.5 * sin(uTime * 0.8 + aSeed * 20.0);
            vPulse = pulse;
            gl_PointSize = aScale * (26.0 * uPixelRatio) * (0.4 + 0.6 * pulse) / -mv.z;
            gl_Position = projectionMatrix * mv;
          }
        `}
        fragmentShader={/* glsl */ `
          uniform vec3 uColor;
          varying float vPulse;
          void main() {
            float d = distance(gl_PointCoord, vec2(0.5));
            if (d > 0.5) discard;
            float a = smoothstep(0.5, 0.0, d) * (0.12 + 0.5 * vPulse);
            gl_FragColor = vec4(uColor, a);
          }
        `}
      />
    </points>
  );
}
