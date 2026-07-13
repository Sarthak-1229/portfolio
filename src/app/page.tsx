import ExperienceRouter from "@/components/ExperienceRouter";
import CursorRing from "@/components/CursorRing";

/**
 * ExperienceRouter picks the cinematic camera-flight build (capable desktops) or the
 * flowing fallback (touch / narrow / reduced-motion, also the SSR baseline). CursorRing
 * self-disables on touch/reduced, so it's safe to mount globally.
 */
export default function Home() {
  return (
    <>
      <ExperienceRouter />
      <CursorRing />
    </>
  );
}
