# Design Spec — Signal

## Concept
Every project here is fundamentally about **reading signals and acting on them**: AQI sensor data, network packet traces, ML model outputs, drone telemetry. The site's visual identity is built around that — an oscilloscope/waveform language, not the generic "hacker green-on-black" or "cream + serif + terracotta" AI-portfolio defaults.

## Color tokens
- `--bg` `#0B0F14` — near-black blue, not pure black (feels like an instrument panel, not a terminal)
- `--surface` `#131A22` — card/section backgrounds, one step up from bg
- `--signal` `#4CC9F0` — primary accent (electric cyan) — used for active states, the 3D trace, key links
- `--alert` `#FFB454` — secondary accent (warm amber) — used sparingly for achievements/highlights only, never decoration
- `--text` `#E8EDF2` — primary text
- `--muted` `#8891A3` — secondary text, captions, dates

Rule: signal-cyan and alert-amber never appear in the same component at equal weight. Amber is reserved for "this mattered" moments (hackathon wins, current job).

## Type
- Display: **IBM Plex Mono**, bold, tight tracking — headlines, section numerals, nav. Monospace at large scale feels like a readout/terminal, not a code snippet — used with restraint (short lines, generous spacing).
- Body: **IBM Plex Sans** — same type family, different register, so the pairing feels designed rather than mismatched.
- Data/caption: **IBM Plex Mono**, small size, `--muted` color — dates, tech-stack tags, stat labels.

## Signature element
A 3D wireframe node graph in the hero (React Three Fiber) that behaves like a **live signal**, not a static logo:
- Idle state: nodes drift and connect/disconnect like a sparse neural net
- On scroll into Projects: the graph **morphs its connection pattern** to loosely echo the section's subject — denser and more clustered near IoT/hardware projects, sharper and more angular near cybersecurity content, smoother sine-like flow near the AI/ML content
- This is the one 3D scene on the page. Keep it that disciplined — no floating 3D icons elsewhere.

## Layout (single scrolling page)

```
┌─────────────────────────────────────┐
│  SARTHAK BHOSALE          [nav•dots]│  <- fixed thin nav, section dots not numbers
│                                       │
│     3D signal graph (signature)      │
│     "Building systems that sense,     │
│      secure, and respond."           │  <- headline = thesis, not name repeated
│     [role tags: AI/ML · Cyber · Full-Stack]
└─────────────────────────────────────┘
        ↓ scroll
┌─ EXPERIENCE ──────────────────────────┐
│ vertical timeline, left-aligned dates │
│ (Bluestock current role visually       │
│  distinct — small live "amber" pulse) │
└───────────────────────────────────────┘
        ↓ scroll
┌─ PROJECTS ────────────────────────────┐
│ full-width cards, one per row,        │
│ alternating text-left/image-right,    │
│ tag chips in Plex Mono                │
└───────────────────────────────────────┘
        ↓ scroll
┌─ SKILLS ──────────────────────────────┐
│ grouped by domain, not a generic      │
│ icon-grid — each group = a short row  │
│ of Plex Mono chips                    │
└───────────────────────────────────────┘
        ↓ scroll
┌─ ACCOMPLISHMENTS + CONTACT ───────────┐
│ 2 hackathon results as amber-accented │
│ callouts, then contact links +        │
│ a "Download Résumé" button (signal-   │
│ cyan outline, downloads /resume.pdf)  │
└───────────────────────────────────────┘
```

## Project visuals
Real screenshots go in `public/images/projects/` — filenames already referenced in
`content/data.json` (`image` field per project). Build the card layout to gracefully
handle these as real photos (subtle border, no heavy filter/overlay that would fight
actual screenshot content) — don't design for placeholder gradients, design for the
real thing arriving.

## Motion rules
- Page load: signature graph resolves in first (0.8s), headline types/fades in after — one orchestrated sequence, not simultaneous
- Scroll: GSAP ScrollTrigger pins each section briefly on entry for a reveal (staggered fade+rise, 60-80ms stagger between elements), then releases — don't pin for the whole section, just the entry beat
- Hover: project cards lift 4px + signal-cyan border glow, nothing more
- Respect `prefers-reduced-motion`: fall back to simple fades, disable the 3D scene's idle animation (keep it static)

## What NOT to do
- No cream background, no terracotta accent, no serif display face (avoid the current AI-portfolio default look)
- No numbered "01 / 02 / 03" section markers — nothing here is a strict sequence
- No matrix-style falling green code, no glitch-text effects — too on-the-nose for "cybersecurity portfolio"
- No 3D elements outside the single hero signature