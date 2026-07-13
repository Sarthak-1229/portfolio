import SceneHost from "@/components/SceneHost";
import ProgressHUD from "@/components/ProgressHUD";

/**
 * STEP 1: empty 3D scene + camera flight only. The tall spacer gives ScrollTrigger
 * its travel distance; DOM section overlays get layered in later steps.
 */
export default function Home() {
  return (
    <>
      <SceneHost />
      <ProgressHUD />
      {/* scroll runway — ~5 viewport heights to fly the placeholder path */}
      <div style={{ height: "500vh" }} aria-hidden />
    </>
  );
}
