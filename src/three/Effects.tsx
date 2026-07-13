"use client";

import { EffectComposer, Bloom, Vignette } from "@react-three/postprocessing";

/**
 * Subtle Bloom (emissive-only via luminance threshold) + light Vignette. No chromatic
 * aberration / grain (DESIGN.md: those read as "vfx demo reel", not portfolio).
 */
export default function Effects() {
  return (
    <EffectComposer multisampling={0}>
      <Bloom
        intensity={0.75}
        luminanceThreshold={0.28}
        luminanceSmoothing={0.9}
        mipmapBlur
        radius={0.7}
      />
      <Vignette eskil={false} offset={0.28} darkness={0.55} />
    </EffectComposer>
  );
}
