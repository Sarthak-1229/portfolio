"use client";

import { useScene } from "@/lib/store";

/** STEP 1 debug HUD: confirms eased progress is flowing + camera responding. Temporary. */
export default function ProgressHUD() {
  const progress = useScene((s) => s.progress);
  const active = useScene((s) => s.active);
  return (
    <div className="pointer-events-none fixed bottom-6 left-6 z-50 font-mono text-xs text-ice">
      <div>t = {progress.toFixed(3)}</div>
      <div>waypoint = {active}</div>
      <div className="mt-2 h-1 w-40 bg-white/10">
        <div
          className="h-full bg-nebula"
          style={{ width: `${progress * 100}%` }}
        />
      </div>
    </div>
  );
}
