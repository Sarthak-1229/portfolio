import SceneHost from "@/components/SceneHost";
import Sections from "@/components/Sections";
import CursorRing from "@/components/CursorRing";
import ProgressRail from "@/components/ProgressRail";

/**
 * Persistent fixed 3D scene (SceneHost) + docking DOM overlays (Sections) + custom
 * cursor + a thin flight-progress rail. The tall spacer is the scroll runway.
 */
export default function Home() {
  return (
    <>
      <SceneHost />
      <Sections />
      <ProgressRail />
      <CursorRing />
      {/* scroll runway — ~one viewport of travel per waypoint */}
      <div style={{ height: "1100vh" }} aria-hidden />
    </>
  );
}
