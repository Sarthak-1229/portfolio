"use client";

import { useMemo, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { useScene } from "@/lib/store";
import { waypoints } from "@/lib/waypoints";

/**
 * Camera rig: samples a CatmullRomCurve3 through the waypoint positions for the
 * camera location, and interpolates the authored lookAt targets (their own curve)
 * so the camera aims deliberately at each dock. Mouse parallax nudges the lookAt a
 * few degrees. Nothing here reads scroll — only the eased store `progress`.
 */
export default function CameraRig() {
  const camera = useThree((s) => s.camera);

  const { posCurve, lookCurve } = useMemo(() => {
    const posCurve = new THREE.CatmullRomCurve3(
      waypoints.map((w) => new THREE.Vector3(...w.position)),
      false,
      "catmullrom",
      0.5
    );
    const lookCurve = new THREE.CatmullRomCurve3(
      waypoints.map((w) => new THREE.Vector3(...w.lookAt)),
      false,
      "catmullrom",
      0.5
    );
    return { posCurve, lookCurve };
  }, []);

  const targetLook = useRef(new THREE.Vector3());
  const currentLook = useRef(new THREE.Vector3(...waypoints[0].lookAt));
  const tmpPos = useRef(new THREE.Vector3());

  useFrame(() => {
    const { progress, mouse, reduced } = useScene.getState();
    const t = THREE.MathUtils.clamp(progress, 0, 1);

    posCurve.getPointAt(t, tmpPos.current);
    camera.position.copy(tmpPos.current);

    lookCurve.getPointAt(t, targetLook.current);

    // mouse parallax: small lateral/vertical offset on the aim point (skip if reduced)
    if (!reduced) {
      targetLook.current.x += mouse.x * 1.2;
      targetLook.current.y += mouse.y * 0.8;
    }

    // lerp the actual lookAt toward target for a soft, alive feel
    currentLook.current.lerp(targetLook.current, reduced ? 1 : 0.08);
    camera.lookAt(currentLook.current);
  });

  return null;
}
