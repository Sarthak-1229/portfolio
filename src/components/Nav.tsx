"use client";

import { useEffect, useState } from "react";
import { data } from "@/lib/data";

const SECTIONS = [
  { id: "hero", label: "Top" },
  { id: "experience", label: "Experience" },
  { id: "projects", label: "Projects" },
  { id: "skills", label: "Skills" },
  { id: "contact", label: "Contact" },
];

export default function Nav() {
  const [active, setActive] = useState("hero");

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActive(e.target.id);
        });
      },
      { rootMargin: "-45% 0px -45% 0px", threshold: 0 }
    );
    SECTIONS.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-white/5 bg-bg/70 backdrop-blur-md">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-5 py-3.5 sm:px-8">
        <a
          href="#hero"
          className="font-mono text-xs font-bold uppercase tracking-[0.2em] text-text transition-colors hover:text-signal sm:text-sm"
        >
          {data.name}
        </a>
        <ul className="flex items-center gap-3 sm:gap-4">
          {SECTIONS.map(({ id, label }) => (
            <li key={id}>
              <a
                href={`#${id}`}
                aria-label={label}
                title={label}
                className="group flex items-center"
              >
                <span
                  className={`block h-2 w-2 rounded-full border transition-all duration-300 ${
                    active === id
                      ? "border-signal bg-signal shadow-[0_0_8px_var(--signal)]"
                      : "border-muted/60 bg-transparent group-hover:border-signal"
                  }`}
                />
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}
