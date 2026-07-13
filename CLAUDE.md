# Portfolio Project — Claude Code Instructions

## What this is
Personal portfolio site for Sarthak Bhosale (Computer Engineering student, AI/ML +
Cybersecurity + Full-Stack). All bio/project/experience content lives in
`content/data.json` — READ FROM THERE, never ask the user to re-paste it, never re-derive
it from memory.

## Design bar
This is a **camera-driven cinematic 3D portfolio**, not a scroll-and-fade site. Read
`DESIGN.md` in full before writing any code — it specifies the exact mechanic (a scripted
3D camera flying through a scene as the user scrolls), the environment concept, the color
system, and an explicit "what not to do" list of clichés to avoid. A previous attempt at
this project shipped as a generic dark/cyan fade-in site — DESIGN.md v2 exists specifically
to correct that. Don't default back to easier, more generic patterns under time pressure;
the camera-path mechanic is the point of this build, not an optional enhancement.

## Token-saving rules (follow strictly)
1. **Never re-read files you already have open in context this session.** If you edited a
   file two turns ago and it's unchanged, don't `view` it again before the next edit —
   trust your last known state unless the user says something changed outside your control.
2. **Use targeted diffs (str_replace equivalent), not full-file rewrites**, unless the file
   is under ~40 lines or the structure is changing wholesale.
3. **No narration between steps.** Don't explain what you're about to do in prose before
   doing it — just make the edit. Summarize only at the end of a batch of changes, in 2-3
   lines max.
4. **Don't dump full file contents into chat/output** after writing them. Say what changed
   in one line — the user can open the file themselves.
5. **Batch related edits** into one pass over a file instead of multiple separate edit calls.
6. **Reference `content/data.json` and `DESIGN.md` by path**, don't paste their contents
   into your reasoning or responses.
7. When stuck or ambiguous, pick the sensible default and note the assumption in one line —
   don't ask multi-part clarifying questions mid-build.

## Stack (decided)
- Framework: Next.js 14 (App Router)
- Styling: Tailwind CSS
- 3D: React Three Fiber + drei + @react-three/postprocessing (Bloom, Vignette only)
- Camera path: `THREE.CatmullRomCurve3` + GSAP ScrollTrigger (scrub) driving camera
  position/lookAt — see DESIGN.md "Core mechanic" section for the exact approach
- Smooth scroll: Lenis (`@studio-freight/lenis` or `lenis`)
- DOM overlay animation: Framer Motion, driven by the SAME scroll-progress source as GSAP
  (one shared value — e.g. a small zustand store or React context updated by a single
  ScrollTrigger instance — do not let GSAP and Framer Motion independently listen to scroll)
- Mobile/reduced-motion fallback: static hero form + normal scroll-triggered DOM sections,
  no camera flight — see DESIGN.md performance budget
- Deployment target: Vercel

## Section order
Hero → Experience → Projects (one 3D waypoint per project) → Skills → Accomplishments+Contact

## File map
- `content/data.json` — single source of truth for all text content (bio, experience,
  projects, skills, accomplishments, contact incl. resume path)
- `DESIGN.md` — the full visual/technical spec — READ THIS FIRST, it is authoritative over
  any assumption you'd otherwise default to
- `public/resume.pdf` — already included, "Download Résumé" button links here
- `public/images/projects/*.png` — real screenshots, filenames already match the `image`
  field per project in `content/data.json` — use directly, don't invent different filenames
- `src/components/` — one component per section, plus a separate `src/three/` for the R3F
  scene, camera rig, and per-project 3D forms — keep 3D scene code isolated from DOM
  section components, they communicate only via the shared scroll-progress store
- Do not hardcode bio text inside components — always pull from `content/data.json`

## Build order (do the hard part first)
1. Camera path system alone — empty scene, just the curve + ScrollTrigger + camera moving
   correctly through 3-4 placeholder waypoints. Confirm this feels smooth before anything
   else. This is the highest-risk part of the whole build.
2. Environment (particle field, base lighting, postprocessing)
3. Hero 3D form + first DOM overlay panel, confirm docking/panel-sync behavior
4. Remaining waypoints' 3D forms + DOM panels, one at a time
5. Micro-interactions (mouse parallax, hover reactivity, custom cursor)
6. Mobile/reduced-motion fallback path
7. Performance pass (see DESIGN.md budget) — check actual fps, not just visual review

## Definition of done
- Camera moves smoothly through the full path with no stutter on a mid-range laptop
- Every 3D form on screen is explainable as representing specific content, not decoration
- Mobile has a real, intentional fallback experience, not a broken 3D scene
- `prefers-reduced-motion` is honored
- Lighthouse performance isn't tanked — measure it, don't assume