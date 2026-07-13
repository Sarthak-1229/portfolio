/**
 * The authored camera flight. Each waypoint is a place the camera docks at, with
 * an explicit lookAt so it *aims* deliberately (never just forward-along-tangent).
 *
 * STEP 1: these are 3-4 placeholder waypoints to validate the camera mechanic on an
 * empty scene. Real per-section waypoints (Hero, Experience, Projects×N, Skills,
 * Contact) get filled in during step 4 — the rig/curve code is generic over this array.
 */
export type Waypoint = {
  id: string;
  position: [number, number, number];
  lookAt: [number, number, number];
};

export const waypoints: Waypoint[] = [
  { id: "wp0", position: [0, 0, 13], lookAt: [0, 0, 0] },
  { id: "wp1", position: [9, 2.5, 3], lookAt: [2, 0.5, -3] },
  { id: "wp2", position: [3, -3.5, -9], lookAt: [-1, -1.5, -14] },
  { id: "wp3", position: [-7, 1.5, -18], lookAt: [-3, 0, -24] },
];
