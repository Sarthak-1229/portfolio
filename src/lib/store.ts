import { create } from "zustand";

/**
 * Single source of truth for scroll-driven state. GSAP writes `progress`; the
 * camera rig and DOM overlays both read from here — GSAP and Framer Motion never
 * listen to scroll independently (per DESIGN.md "one source of truth").
 */
type SceneState = {
  /** Eased scroll progress 0..1 across the whole flight path. */
  progress: number;
  /** Normalized pointer -1..1 for camera lookAt parallax. */
  mouse: { x: number; y: number };
  /** id of the waypoint whose DOM panel is currently hovered (for 3D reactivity). */
  hovered: string | null;
  /** Index of the nearest/active waypoint (drives DOM panel visibility). */
  active: number;
  reduced: boolean;
  isMobile: boolean;
  setProgress: (p: number) => void;
  setMouse: (x: number, y: number) => void;
  setHovered: (id: string | null) => void;
  setActive: (i: number) => void;
  setFlags: (f: Partial<Pick<SceneState, "reduced" | "isMobile">>) => void;
};

export const useScene = create<SceneState>((set) => ({
  progress: 0,
  mouse: { x: 0, y: 0 },
  hovered: null,
  active: 0,
  reduced: false,
  isMobile: false,
  setProgress: (progress) => set({ progress }),
  setMouse: (x, y) => set({ mouse: { x, y } }),
  setHovered: (hovered) => set({ hovered }),
  setActive: (active) => set((s) => (s.active === active ? s : { active })),
  setFlags: (f) => set(f),
}));
