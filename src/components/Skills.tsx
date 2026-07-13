import Section from "./Section";
import Reveal from "./Reveal";
import { data } from "@/lib/data";

const GROUPS: { key: keyof typeof data.skills; label: string }[] = [
  { key: "languages", label: "Languages" },
  { key: "ai_ml", label: "AI / ML" },
  { key: "web_fullstack", label: "Web · Full-Stack" },
  { key: "cybersecurity", label: "Cybersecurity" },
  { key: "iot", label: "IoT · Hardware" },
  { key: "tools", label: "Tools" },
];

export default function Skills() {
  return (
    <Section id="skills" label="Skills">
      <Reveal className="grid gap-x-10 gap-y-10 sm:grid-cols-2">
        {GROUPS.map(({ key, label }) => (
          <div key={key} data-reveal-item="" className="min-w-0">
            <h3 className="mb-3 font-mono text-xs uppercase tracking-[0.2em] text-muted">
              {label}
            </h3>
            <ul className="flex flex-wrap gap-2">
              {data.skills[key].map((skill) => (
                <li
                  key={skill}
                  className="rounded-full border border-signal/25 bg-signal/[0.04] px-3 py-1.5 font-mono text-xs text-text transition-colors hover:border-signal/60 hover:text-signal"
                >
                  {skill}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </Reveal>

      {/* Spoken languages — compact readout strip */}
      <Reveal
        className="mt-14 flex flex-wrap items-center gap-x-6 gap-y-2 border-t border-white/5 pt-6"
        stagger={false}
      >
        <span
          data-reveal-item=""
          className="font-mono text-xs uppercase tracking-[0.2em] text-muted"
        >
          Languages spoken
        </span>
        {data.languages_spoken.map((l) => (
          <span
            key={l.name}
            data-reveal-item=""
            className="font-mono text-xs text-text"
          >
            {l.name}{" "}
            <span className="text-muted">· {l.level}</span>
          </span>
        ))}
      </Reveal>
    </Section>
  );
}
