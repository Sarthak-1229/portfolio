import type { ReactNode } from "react";

/** Section shell: consistent id/anchor, padding, and a mono readout-style label. */
export default function Section({
  id,
  label,
  children,
  className = "",
}: {
  id: string;
  label: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section
      id={id}
      className={`relative mx-auto max-w-6xl scroll-mt-20 px-5 py-24 sm:px-8 sm:py-32 ${className}`}
    >
      <div className="mb-12 flex items-center gap-4 sm:mb-16">
        <h2 className="font-mono text-xs uppercase tracking-[0.3em] text-signal">
          {label}
        </h2>
        <span className="h-px flex-1 bg-gradient-to-r from-signal/40 to-transparent" />
      </div>
      {children}
    </section>
  );
}
