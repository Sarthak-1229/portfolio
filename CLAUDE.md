# Portfolio Project — Claude Code Instructions

## What this is
Personal portfolio site for Sarthak Bhosale (Computer Engineering student, AI/ML + Cybersecurity + Full-Stack). All bio/project/experience content lives in `content/data.json` — READ FROM THERE, never ask the user to re-paste it, never re-derive it from memory.

## Token-saving rules (follow strictly)
1. **Never re-read files you already have open in context this session.** If you edited `Hero.jsx` two turns ago and it's unchanged, don't `view` it again before the next edit — trust your last known state unless the user says something changed outside your control.
2. **Use targeted diffs (str_replace equivalent), not full-file rewrites**, unless the file is under ~40 lines or the structure is changing wholesale.
3. **No narration between steps.** Don't explain what you're about to do in prose before doing it — just make the edit. Summarize only at the end of a batch of changes, in 2-3 lines max.
4. **Don't dump full file contents into chat/output** after writing them. Say what changed in one line ("added parallax to Hero, wired scroll-trigger") — the user can open the file themselves.
5. **Batch related edits** into one pass over a file instead of multiple separate edit calls.
6. **Reference `content/data.json` and `DESIGN.md` by path**, don't paste their contents into your reasoning or responses.
7. When stuck or ambiguous, pick the sensible default and note the assumption in one line — don't ask multi-part clarifying questions mid-build.

## Stack (decided)
- Framework: Next.js 14 (App Router)
- Styling: Tailwind CSS
- Animation: Framer Motion (element/section transitions) + GSAP ScrollTrigger (scroll-linked pinning/reveal across sections — bold direction, use it generously but never at the cost of scroll performance)
- 3D: React Three Fiber + drei, ONE hero scene (see DESIGN.md for concept), lazy-loaded, pauses render loop when scrolled out of view
- Structure: single scrolling page, full-viewport-ish sections, no routing/pages
- Deployment target: Vercel

## Section order
Hero → Experience → Projects → Skills → Accomplishments → Contact
(Education folded into Hero or a compact strip — don't give it a full section, it's the least differentiating content)

## File map
- `content/data.json` — single source of truth for all text content (bio, experience, projects, skills, accomplishments, contact incl. resume path)
- `DESIGN.md` — visual direction, color system, animation rules
- `public/resume.pdf` — already included, wire the "Download Résumé" button to this
- `public/images/projects/*.png` — real screenshots will be dropped here by the user; filenames already match the `image` field in each project's `data.json` entry — use them directly, don't invent different filenames
- `src/components/` — one component per section (Hero, Experience, Projects, Skills, Contact)
- Do not hardcode bio text inside components — always pull from `content/data.json`

## Definition of done for any section
- Responsive (mobile-first, test at 375px and 1440px)
- No layout shift from animations (use transform/opacity only)
- Lighthouse performance not tanked by 3D scene (lazy-load the Three.js canvas, pause render loop when off-screen)