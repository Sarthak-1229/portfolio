import Image from "next/image";
import Section from "./Section";
import Reveal from "./Reveal";
import { data } from "@/lib/data";

export default function Projects() {
  return (
    <Section id="projects" label="Projects">
      <Reveal className="flex flex-col gap-16 sm:gap-20" stagger={false}>
        {data.projects.map((project, i) => {
          const imageRight = i % 2 === 0;
          return (
            <article
              key={project.name}
              data-reveal-item=""
              className="group grid items-center gap-6 lg:grid-cols-2 lg:gap-10"
            >
              {/* Screenshot */}
              <div
                className={`relative aspect-[16/10] overflow-hidden rounded-lg border border-white/10 bg-surface transition-all duration-300 group-hover:-translate-y-1 group-hover:border-signal/50 group-hover:shadow-[0_0_30px_-8px_var(--signal)] ${
                  imageRight ? "lg:order-2" : "lg:order-1"
                }`}
              >
                <Image
                  src={project.image}
                  alt={`${project.name} — ${project.tagline}`}
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover object-top"
                />
              </div>

              {/* Copy */}
              <div className={imageRight ? "lg:order-1" : "lg:order-2"}>
                {project.achievement && (
                  <p className="mb-3 inline-flex items-center gap-2 rounded border border-alert/30 bg-alert/5 px-2.5 py-1 font-mono text-[11px] leading-tight text-alert">
                    <span aria-hidden="true">★</span>
                    {project.achievement}
                  </p>
                )}
                <h3 className="font-mono text-2xl font-bold tracking-tight text-text sm:text-3xl">
                  {project.name}
                </h3>
                <p className="mt-1.5 text-sm text-signal/90">
                  {project.tagline}
                </p>

                <ul className="mt-4 space-y-2">
                  {project.points.map((point) => (
                    <li
                      key={point}
                      className="relative pl-4 text-sm leading-relaxed text-muted before:absolute before:left-0 before:top-2 before:h-1 before:w-1 before:rounded-full before:bg-signal/50"
                    >
                      {point}
                    </li>
                  ))}
                </ul>

                <ul className="mt-5 flex flex-wrap gap-2" aria-label="Tech stack">
                  {project.tags.map((tag) => (
                    <li
                      key={tag}
                      className="rounded border border-white/10 bg-surface px-2.5 py-1 font-mono text-[11px] tracking-wide text-muted"
                    >
                      {tag}
                    </li>
                  ))}
                </ul>

                <div className="mt-5 flex flex-wrap items-center gap-4 font-mono text-xs">
                  {project.github && (
                    <a
                      href={project.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-signal transition-colors hover:text-text"
                    >
                      GitHub <span aria-hidden="true">↗</span>
                    </a>
                  )}
                  {project.hasResearchPaper && (
                    <span className="text-muted">Research paper · in progress</span>
                  )}
                </div>
              </div>
            </article>
          );
        })}
      </Reveal>
    </Section>
  );
}
