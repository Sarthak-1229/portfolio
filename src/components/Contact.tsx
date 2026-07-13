import Section from "./Section";
import Reveal from "./Reveal";
import { data } from "@/lib/data";

export default function Contact() {
  const { contact } = data;
  const links = [
    { label: "Email", value: contact.email, href: `mailto:${contact.email}` },
    { label: "Phone", value: contact.phone, href: `tel:${contact.phone.replace(/\s/g, "")}` },
    { label: "LinkedIn", value: "in/sarthak-bhosale", href: contact.linkedin },
    { label: "GitHub", value: "Sarthak-1229", href: contact.github },
  ];

  return (
    <Section id="contact" label="Accomplishments · Contact">
      {/* Amber-accented hackathon callouts */}
      <Reveal className="grid gap-4 sm:grid-cols-2">
        {data.accomplishments.map((a) => {
          const [head, ...rest] = a.split(":");
          return (
            <div
              key={a}
              data-reveal-item=""
              className="rounded-lg border border-alert/25 bg-alert/[0.04] p-5"
            >
              <p className="flex items-start gap-2.5 font-mono text-sm leading-snug text-alert">
                <span aria-hidden="true" className="mt-0.5">
                  ★
                </span>
                <span>
                  <span className="font-semibold">{head.trim()}</span>
                  {rest.length > 0 && (
                    <span className="mt-1 block text-text/80">
                      {rest.join(":").trim()}
                    </span>
                  )}
                </span>
              </p>
            </div>
          );
        })}
      </Reveal>

      {/* Certifications — compact readout */}
      <Reveal className="mt-8 border-t border-white/5 pt-8">
        <h3
          data-reveal-item=""
          className="mb-4 font-mono text-xs uppercase tracking-[0.2em] text-muted"
        >
          Certifications
        </h3>
        <ul className="grid gap-x-8 gap-y-2 sm:grid-cols-2">
          {data.certifications.map((c) => (
            <li
              key={c.name}
              data-reveal-item=""
              className="flex gap-3 font-mono text-xs leading-relaxed"
            >
              <span className="shrink-0 text-muted">{c.date}</span>
              <span className="text-text/85">{c.name}</span>
            </li>
          ))}
        </ul>
      </Reveal>

      {/* Contact + résumé */}
      <Reveal className="mt-14 border-t border-white/5 pt-10">
        <h3
          data-reveal-item=""
          className="font-mono text-2xl font-bold tracking-tight text-text sm:text-3xl"
        >
          Let&apos;s build something that responds.
        </h3>
        <p data-reveal-item="" className="mt-2 text-sm text-muted">
          Open to internships, collaborations, and interesting problems.
        </p>

        <div
          data-reveal-item=""
          className="mt-8 flex flex-wrap items-center gap-x-8 gap-y-4"
        >
          {links.map((l) => (
            <a
              key={l.label}
              href={l.href}
              target={l.href.startsWith("http") ? "_blank" : undefined}
              rel={l.href.startsWith("http") ? "noopener noreferrer" : undefined}
              className="group flex flex-col"
            >
              <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted">
                {l.label}
              </span>
              <span className="font-mono text-sm text-text transition-colors group-hover:text-signal">
                {l.value}
              </span>
            </a>
          ))}
        </div>

        <a
          data-reveal-item=""
          href={contact.resume}
          download
          className="mt-10 inline-flex items-center gap-2 rounded-md border border-signal px-6 py-3 font-mono text-sm text-signal transition-all hover:bg-signal hover:text-bg hover:shadow-[0_0_24px_-4px_var(--signal)]"
        >
          Download Résumé <span aria-hidden="true">↓</span>
        </a>
      </Reveal>

      <footer className="mt-20 border-t border-white/5 pt-6 font-mono text-[11px] text-muted">
        © {data.name} · {data.location} · Built with Next.js, R3F & GSAP
      </footer>
    </Section>
  );
}
