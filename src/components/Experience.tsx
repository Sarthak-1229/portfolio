import Section from "./Section";
import Reveal from "./Reveal";
import { data } from "@/lib/data";

export default function Experience() {
  return (
    <Section id="experience" label="Experience">
      <Reveal
        as="ol"
        className="relative ml-1 border-l border-white/10 sm:ml-2"
      >
        {data.experience.map((exp) => (
          <li
            key={`${exp.role}-${exp.org}`}
            data-reveal-item=""
            className="relative mb-12 pl-8 last:mb-0 sm:pl-10"
          >
            {/* Timeline node — amber live pulse for the current role */}
            <span
              className={`absolute -left-[6px] top-1.5 h-3 w-3 rounded-full border-2 ${
                exp.current
                  ? "border-alert bg-alert"
                  : "border-signal bg-bg"
              }`}
              aria-hidden="true"
            >
              {exp.current && (
                <span className="live-dot absolute inset-0 rounded-full bg-alert" />
              )}
            </span>

            <div className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between sm:gap-4">
              <h3 className="text-lg font-semibold text-text sm:text-xl">
                {exp.role}
                {exp.current && (
                  <span className="ml-3 align-middle font-mono text-[10px] uppercase tracking-widest text-alert">
                    ● Current
                  </span>
                )}
              </h3>
              <span className="shrink-0 font-mono text-xs text-muted">
                {exp.date}
              </span>
            </div>
            <p className="mt-0.5 font-mono text-sm text-signal/90">{exp.org}</p>

            <ul className="mt-3 space-y-1.5">
              {exp.points
                .filter((p) => !p.startsWith("PLACEHOLDER"))
                .map((point) => (
                  <li
                    key={point}
                    className="relative pl-4 text-sm leading-relaxed text-muted before:absolute before:left-0 before:top-2 before:h-1 before:w-1 before:rounded-full before:bg-signal/50"
                  >
                    {point}
                  </li>
                ))}
            </ul>
          </li>
        ))}
      </Reveal>
    </Section>
  );
}
