# Design Spec — ORBIT (v2)

## Why v2
v1 shipped as a generic dark-mode-with-cyan-accent scroll page with fade-ins. That's the
default every AI/CS portfolio converges to. This version is a different category of build:
**the 3D scene is the interface, not a hero decoration.** The camera physically travels
through a persistent 3D space for the entire page; sections are places you arrive at, not
divs that fade in.

If DESIGN.md v1's hero graph is still in the codebase, replace it — don't layer this on top.

## Core mechanic: camera-driven scroll
This is the single most important technical decision in this doc. Get this right first,
before touching any visual polish.

- One `<Canvas>` (React Three Fiber) mounted at the app root, `position: fixed`, full
  viewport, present for the ENTIRE page — not just the hero.
- A `THREE.CatmullRomCurve3` defines a flight path through 3D space with ~6-8 waypoints,
  one per section (Hero, Experience, Projects x N, Skills, Accomplishments, Contact).
- GSAP ScrollTrigger reads scroll progress (0 to 1) and maps it to `curve.getPointAt(t)`
  for camera position, plus a separate `getTangentAt(t)` or manually-authored lookAt
  targets so the camera *aims* somewhere deliberate at each waypoint, not just forward.
- Regular DOM/HTML content (text, project details) is overlaid on top of the canvas in
  sync with camera position — when the camera "docks" at a waypoint, the corresponding
  HTML panel fades/slides in; when it moves on, that panel exits. Use Framer Motion for
  these overlay transitions, driven by the same scroll-progress value GSAP is using (don't
  let GSAP and Framer Motion independently read scroll — one source of truth, one hook,
  shared via context or a small store like zustand).
- Use **Lenis** (or `@studio-freight/lenis`) for smooth/inertial scroll so the whole
  experience feels weighty and physical, not stepped.

This is genuinely nontrivial — budget real iteration time on the camera path alone. A
janky camera move undermines everything else. Get 3-4 waypoints working smoothly before
adding the rest.

## Environment concept: "Observatory," not "galaxy cliché"
Avoid the generic "floating in space with random stars" look — it reads as a template.
Ground the environment in Sarthak's actual domains instead:

- Base environment: a dark instrument/observatory void with a **sparse particle field**
  (a few hundred points, not thousands) that behave like signal nodes, not decorative
  stars — they drift slowly and faintly pulse, referencing sensor networks / packet
  traffic rather than "space" for its own sake.
- At each waypoint, one **distinct 3D form** is present, tied to that section's content —
  not random floating shapes:
  - Hero: a slowly rotating wireframe icosahedron core (his "signal" identity)
  - Experience waypoints: a thin orbiting ring of small nodes that fills in as you scroll
    through timeline entries (ring completion = career progress, literal and visual)
  - Each Project waypoint: a distinct simple 3D primitive/abstract form loosely evoking
    that project (e.g. Vayu = a cluster of small pulsing spheres around a core "purifier"
    shape; Vyorius task app = a grid of small cubes; Pluto AI = a small companion orb that
    visibly "follows" the camera with slight delay, like the actual desktop pet does)
  - Skills: the node-ring reappears, now grouped into visible clusters by domain
  - Contact: camera pulls back to reveal the full path just traveled, all forms visible
    at once in the distance — a "here's everything" final beat
- Use `@react-three/postprocessing` — Bloom (subtle, only on emissive materials) and a
  light Vignette. Do NOT add chromatic aberration or heavy film grain — reads as a "vfx
  demo reel" cliché, not a professional portfolio.

## Micro-interactions (physics/responsiveness — this is what "god-level" actually means)
- Mouse position subtly parallaxes the camera's lookAt target (small offset, lerped, never
  more than a few degrees) — the scene should feel alive even when not scrolling.
- Hovering a project's HTML panel triggers its corresponding 3D form to react — scale up
  slightly, brighten emissive intensity, maybe a small rotation kick. The 3D scene and DOM
  content must feel connected, not like two separate layers.
- Cursor: custom cursor that morphs (small ring that scales/changes color) near
  interactive elements — cheap to build, disproportionately raises perceived polish.
- Section-to-section scroll should feel like it has *weight and momentum*, not linear
  1:1 scroll mapping — ease the camera's progress mapping (e.g. a power/expo ease on
  the GSAP ScrollTrigger scrub value), so a burst of scroll input produces a smooth
  accelerate/decelerate camera move, not a snap.

## Color tokens (replacing v1's cyan/amber — that pairing reads as generic "AI product")
- `--void` `#08060F` — background, near-black violet-black, not pure black
- `--nebula-start` `#FF3EA5` / `--nebula-end` `#FFB454` — primary gradient (magenta →
  amber), used for the hero headline, key CTAs, and emissive glow on the "current/active"
  3D form only. Applied as a gradient, never as two flat separate colors side by side.
- `--ice` `#8FD9FF` — cool secondary, used ONLY for the particle field and wireframe
  linework — never for text or UI chrome, keeps it feeling like environment, not UI.
- `--text` `#F2EDE9` warm off-white — primary text
- `--muted` `#9A93A6` — secondary text, dates, captions

Rule: the nebula gradient is the signature — it should appear rarely enough that when it
does (hero name, section titles, achievement callouts) it reads as a deliberate accent,
not wallpaper.

## Type
- Display: a bold geometric/grotesk sans with confident tracking on large sizes — e.g.
  **Cabinet Grotesk** or **General Sans**, weight 700-800. This carries the "cinematic
  game HUD" feeling that a monospace face doesn't.
- Body: **Inter**, weight 400-500.
- HUD/data labels (coordinates-style tags, dates, tech chips): a monospace face used
  sparingly — **JetBrains Mono**, small size, `--muted` or `--ice` color, letter-spaced —
  this is where the "instrument panel" texture lives, not in the whole page.

## Section content (unchanged from v1's data, new presentation)
Hero → Experience → Projects (one waypoint each) → Skills → Accomplishments+Contact.
All copy still sourced from `content/data.json` — this doc only changes HOW it's staged
in 3D space, not what it says.

## Performance budget (non-negotiable, or "god-level" becomes "laggy and embarrassing")
- Target 60fps on a mid-range laptop, degrade gracefully on mobile: on touch devices,
  DROP the full camera-path 3D scene and fall back to a lighter build — a static/subtly
  animated version of the hero form only, with normal scroll-triggered DOM section
  transitions (still use GSAP/Framer for those, just no persistent 3D camera flight).
  Detect via a simple touch/viewport-width check, not full device sniffing.
- Particle count, geometry complexity, and postprocessing passes must be justified —
  if removing an effect isn't visually noticeable, cut it.
- `prefers-reduced-motion`: disable camera flight and particle drift entirely, present
  content as a normal static scroll page — this is a real fallback, not an afterthought.

## What NOT to do (things that read as template/cliché, avoid explicitly)
- No generic "starfield galaxy" with thousands of random points and no relationship to
  content — every 3D element on screen should be explainable as "this represents X"
- No cyan-on-black — already tried, reads generic
- No chromatic aberration / glitch / VHS filter effects
- No text that just fades up on scroll with no camera movement — that's v1, we're past it
- No OrbitControls / free camera rotation — the camera path is authored and intentional,
  letting the user spin it freely breaks the cinematic framing