"use client";

import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import { data } from "@/lib/data";
import { useReducedMotion } from "@/lib/useReducedMotion";

// Lazy-load the 3D canvas: keeps three.js out of the initial JS and off SSR.
const SignalGraph = dynamic(() => import("./SignalGraph"), {
  ssr: false,
  loading: () => null,
});

const ROLE_TAGS = ["AI / ML", "Cybersecurity", "Full-Stack"];

export default function Hero() {
  const reduced = useReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);
  const [active, setActive] = useState(true);
  const [mounted, setMounted] = useState(false);

  // Only mount the canvas client-side, and pause its render loop off-screen.
  useEffect(() => {
    setMounted(true);
    const el = sectionRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => setActive(entry.isIntersecting),
      { threshold: 0.05 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const container = {
    hidden: {},
    show: {
      transition: { delayChildren: reduced ? 0 : 0.8, staggerChildren: 0.12 },
    },
  };
  const item = reduced
    ? { hidden: { opacity: 0 }, show: { opacity: 1 } }
    : {
        hidden: { opacity: 0, y: 24 },
        show: {
          opacity: 1,
          y: 0,
          transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as const },
        },
      };

  const education = data.education[0];

  return (
    <section
      id="hero"
      ref={sectionRef}
      className="relative flex min-h-[100svh] items-center overflow-hidden signal-grid"
    >
      {/* 3D signature layer */}
      <div className="pointer-events-none absolute inset-0 z-0" aria-hidden="true">
        {mounted && (
          <SignalGraph active={active} reducedMotion={reduced} mode="idle" />
        )}
      </div>
      {/* Radial vignette to seat the headline over the graph */}
      <div
        className="pointer-events-none absolute inset-0 z-[1]"
        aria-hidden="true"
        style={{
          background:
            "radial-gradient(ellipse 70% 60% at 50% 55%, rgba(11,15,20,0.35) 0%, rgba(11,15,20,0.82) 70%, var(--bg) 100%)",
        }}
      />

      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="relative z-10 mx-auto w-full max-w-6xl px-5 sm:px-8"
      >
        <motion.p
          variants={item}
          className="mb-5 font-mono text-xs uppercase tracking-[0.28em] text-signal sm:text-sm"
        >
          {data.name} — {data.location}
        </motion.p>

        <motion.h1
          variants={item}
          className="max-w-4xl font-mono text-4xl font-bold leading-[1.08] tracking-tight text-text sm:text-6xl lg:text-7xl"
        >
          Building systems that
          <br className="hidden sm:block" /> sense, secure, and{" "}
          <span className="text-signal">respond.</span>
        </motion.h1>

        <motion.p
          variants={item}
          className="mt-6 max-w-xl text-base leading-relaxed text-muted sm:text-lg"
        >
          {data.summary.split(".")[0]}.
        </motion.p>

        <motion.ul
          variants={item}
          className="mt-8 flex flex-wrap gap-2.5"
          aria-label="Focus areas"
        >
          {ROLE_TAGS.map((tag) => (
            <li
              key={tag}
              className="rounded-full border border-signal/40 bg-signal/5 px-4 py-1.5 font-mono text-xs tracking-wide text-signal"
            >
              {tag}
            </li>
          ))}
        </motion.ul>

        {/* Education folded in as a compact strip — not its own section */}
        <motion.p
          variants={item}
          className="mt-10 max-w-2xl border-l-2 border-white/10 pl-4 font-mono text-xs leading-relaxed text-muted"
        >
          <span className="text-text">{education.degree}</span>
          <br />
          {education.school} · {education.date}
        </motion.p>
      </motion.div>

      {/* Scroll cue */}
      <div
        className="absolute bottom-6 left-1/2 z-10 -translate-x-1/2 font-mono text-[10px] uppercase tracking-[0.3em] text-muted/70"
        aria-hidden="true"
      >
        scroll ↓
      </div>
    </section>
  );
}
