"use client";

import { type ReactNode } from "react";
import { useScene } from "@/lib/store";

/**
 * Panel content card — a subtle scrim so text stays legible over glowing 3D forms,
 * and the hover bridge: entering the card tells the store which form to make react.
 */
export default function PanelCard({
  hoverId,
  children,
  className = "",
}: {
  hoverId?: string;
  children: ReactNode;
  className?: string;
}) {
  const setHovered = useScene((s) => s.setHovered);
  return (
    <div
      onMouseEnter={() => hoverId && setHovered(hoverId)}
      onMouseLeave={() => hoverId && setHovered(null)}
      className={`pointer-events-auto rounded-2xl border border-white/5 bg-void/50 p-6 backdrop-blur-md sm:p-7 ${className}`}
    >
      {children}
    </div>
  );
}
