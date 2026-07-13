"use client";

import Image from "next/image";
import { motion, type Variants } from "framer-motion";
import { data } from "@/lib/data";

/**
 * Real alternate path for touch / mobile / reduced-motion (DESIGN.md perf budget):
 * NO persistent camera flight or R3F canvas. A normal flowing scroll document with a
 * static hero form + in-view reveals (Framer). This is the full semantic content and
 * also what SSR renders, so it doubles as the no-JS / SEO baseline.
 */
const rise: Variants = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

function Reveal({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <motion.div
      variants={rise}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-80px" }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

const SKILL_LABELS: Record<string, string> = {
  languages: "Languages",
  ai_ml: "AI / ML",
  web_fullstack: "Web · Full-Stack",
  cybersecurity: "Cybersecurity",
  iot: "IoT",
  tools: "Tools",
};

export default function FallbackSite() {
  const edu = data.education[0];
  const c = data.contact;

  return (
    <main className="relative mx-auto max-w-3xl px-6 py-24 sm:px-8">
      {/* Hero */}
      <section className="min-h-[70vh]">
        {/* static signal form — pure CSS, no 3D */}
        <div className="relative mb-10 h-28 w-28">
          <span className="absolute inset-0 rounded-full border border-ice/40 [animation:spin_18s_linear_infinite] motion-reduce:[animation:none]" />
          <span className="absolute inset-3 rotate-45 rounded-full border border-nebula-start/50" />
          <span className="absolute inset-8 rounded-full bg-gradient-to-br from-nebula-start/40 to-nebula-end/30 blur-[2px]" />
        </div>
        <div className="hud-label mb-4">// signal · online</div>
        <h1 className="font-display text-5xl font-bold leading-[0.95] sm:text-6xl">
          <span className="nebula-text">{data.name}</span>
        </h1>
        <p className="mt-5 text-lg text-text/80">{data.title}</p>
        <div className="mt-6 flex flex-wrap gap-2 font-mono text-[0.7rem] uppercase tracking-widest text-ice">
          {["AI / ML", "Cybersecurity", "Full-Stack"].map((t) => (
            <span key={t} className="rounded border border-ice/25 px-3 py-1.5">
              {t}
            </span>
          ))}
        </div>
        <p className="mt-6 font-mono text-xs text-muted">
          {edu.degree}
          <br />
          {edu.school} · {edu.date}
        </p>
      </section>

      {/* Experience */}
      <section className="py-16">
        <div className="hud-label mb-6">// experience</div>
        <ul className="space-y-6">
          {data.experience.map((e, i) => {
            const points = e.points.filter((p) => !p.startsWith("PLACEHOLDER"));
            return (
              <Reveal key={i}>
                <li className="border-l border-white/10 pl-4">
                  <h3 className="font-display text-lg text-text">{e.role}</h3>
                  <p className="font-mono text-xs text-ice">
                    {e.org} · <span className="text-muted">{e.date}</span>
                  </p>
                  {points[0] && (
                    <p className="mt-1.5 text-sm text-text/70">{points[0]}</p>
                  )}
                </li>
              </Reveal>
            );
          })}
        </ul>
      </section>

      {/* Projects */}
      <section className="py-16">
        <div className="hud-label mb-6">// projects</div>
        <div className="space-y-10">
          {data.projects.map((p, i) => {
            const points = p.points.filter((x) => !x.startsWith("PLACEHOLDER"));
            return (
              <Reveal key={i}>
                <article className="rounded-2xl border border-white/5 bg-white/[0.02] p-5">
                  <div className="relative mb-4 aspect-[16/9] w-full overflow-hidden rounded-lg border border-white/10 bg-white/5">
                    <Image
                      src={p.image}
                      alt={`${p.name} screenshot`}
                      fill
                      sizes="(max-width: 768px) 90vw, 42rem"
                      className="object-cover"
                    />
                  </div>
                  <h3 className="font-display text-xl font-bold">{p.name}</h3>
                  <p className="mt-1 text-sm text-ice">{p.tagline}</p>
                  {points[0] && (
                    <p className="mt-2 text-sm text-text/70">{points[0]}</p>
                  )}
                  {p.achievement && (
                    <p className="mt-3 inline-block rounded bg-gradient-to-r from-nebula-start/20 to-nebula-end/20 px-3 py-1 text-xs text-nebula-end">
                      ★ {p.achievement}
                    </p>
                  )}
                  <div className="mt-3 flex flex-wrap gap-2 font-mono text-[0.65rem] uppercase tracking-wider text-muted">
                    {p.tags.map((t) => (
                      <span key={t} className="rounded border border-white/10 px-2 py-1">
                        {t}
                      </span>
                    ))}
                  </div>
                  {p.github && (
                    <a
                      href={p.github}
                      target="_blank"
                      rel="noreferrer"
                      className="mt-3 inline-block text-xs text-ice hover:underline"
                    >
                      GitHub ↗
                    </a>
                  )}
                </article>
              </Reveal>
            );
          })}
        </div>
      </section>

      {/* Skills */}
      <section className="py-16">
        <div className="hud-label mb-6">// skills</div>
        <div className="space-y-4">
          {Object.entries(data.skills as unknown as Record<string, string[]>).map(
            ([key, items]) => (
              <Reveal key={key}>
                <div>
                  <div className="mb-1.5 font-mono text-[0.65rem] uppercase tracking-widest text-ice">
                    {SKILL_LABELS[key] ?? key}
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {items.map((s) => (
                      <span
                        key={s}
                        className="rounded-md border border-white/10 bg-white/[0.03] px-2.5 py-1 text-xs text-text/80"
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              </Reveal>
            )
          )}
        </div>
      </section>

      {/* Contact */}
      <section className="py-16">
        <div className="hud-label mb-4">// contact</div>
        <h2 className="font-display text-3xl font-bold">
          <span className="nebula-text">Let&apos;s build something.</span>
        </h2>
        <div className="mt-5 space-y-1.5">
          {data.accomplishments.map((a, i) => (
            <p key={i} className="text-sm text-nebula-end">
              ★ {a}
            </p>
          ))}
        </div>
        <div className="mt-5 flex flex-wrap gap-x-5 gap-y-2 font-mono text-xs text-ice">
          <a href={`mailto:${c.email}`} className="hover:underline">
            {c.email}
          </a>
          <a href={c.github} target="_blank" rel="noreferrer" className="hover:underline">
            GitHub ↗
          </a>
          <a href={c.linkedin} target="_blank" rel="noreferrer" className="hover:underline">
            LinkedIn ↗
          </a>
        </div>
        <a
          href={c.resume}
          download
          className="mt-6 inline-block rounded-lg border border-nebula-start/40 bg-gradient-to-r from-nebula-start/15 to-nebula-end/15 px-5 py-2.5 text-sm font-medium text-text"
        >
          Download Résumé ↓
        </a>
        <footer className="mt-16 border-t border-white/5 pt-6 font-mono text-[11px] text-muted">
          © {data.name} · {data.location} · Built with Next.js, R3F & GSAP
        </footer>
      </section>
    </main>
  );
}
