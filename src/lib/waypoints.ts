/**
 * The authored camera flight. Each waypoint is a place the camera docks, carrying its
 * section identity so both the 3D scene and the DOM overlays derive from this one list.
 *
 * `lookAt` doubles as the position of that section's 3D form (camera aims at the form).
 * The path weaves gently left/right and advances down -z; the final Contact waypoint
 * pulls the camera back and up, aiming back up the corridor to reveal the whole path.
 */
export type WaypointKind =
  | "hero"
  | "experience"
  | "project"
  | "skills"
  | "contact";

export type Waypoint = {
  id: string;
  kind: WaypointKind;
  /** index into data.projects, for kind === "project" */
  projectIndex?: number;
  position: [number, number, number]; // camera
  lookAt: [number, number, number]; // aim === form position
};

export const waypoints: Waypoint[] = [
  { id: "hero", kind: "hero", position: [0, 0, 13], lookAt: [0, 0, 0] },
  {
    id: "experience",
    kind: "experience",
    position: [-1.5, 1.5, -5],
    lookAt: [-7, 1.5, -13],
  },
  { id: "p0", kind: "project", projectIndex: 0, position: [1.5, 0, -17], lookAt: [7, -1, -25] },
  { id: "p1", kind: "project", projectIndex: 1, position: [-1.5, 1.5, -29], lookAt: [-7, 2, -37] },
  { id: "p2", kind: "project", projectIndex: 2, position: [1.5, 0, -41], lookAt: [7, -2, -49] },
  { id: "p3", kind: "project", projectIndex: 3, position: [-1.5, 1.5, -53], lookAt: [-6, 2.5, -61] },
  { id: "p4", kind: "project", projectIndex: 4, position: [1.5, 0.5, -65], lookAt: [7, 0, -73] },
  { id: "p5", kind: "project", projectIndex: 5, position: [-1.5, 0, -77], lookAt: [-7, -2, -85] },
  { id: "p6", kind: "project", projectIndex: 6, position: [1.5, 1.5, -89], lookAt: [6, 2, -97] },
  { id: "skills", kind: "skills", position: [0, 0.5, -100], lookAt: [0, -1, -109] },
  { id: "contact", kind: "contact", position: [0, 3.5, -132], lookAt: [0, -1, -55] },
];
