---
name: higgsfield-scroll-site
description: >-
  Build a cinematic, scroll-animated marketing website end-to-end. Generates
  hero imagery and image-to-video camera moves through the Higgsfield MCP,
  extracts video frames, and assembles a complete HTML/CSS/JS scroll-driven
  site with six cinematic effects (film grain, particles, vignette, glass
  cards, color tints, scroll pacing). Use when the user wants an animated /
  scroll-driven / "Higgsfield" website, a cinematic landing page, or to turn a
  brand kit + business details into a deployable motion site.
---

# Higgsfield Scroll-Animated Website Builder

Turn a **brand kit + business details** into a deployable, scroll-driven cinematic website.
The Higgsfield MCP is the **asset factory** (images + image-to-video). This skill is the
**site builder** — it sequences the MCP, extracts frames, writes the code, and verifies it.

## When to trigger
User asks for an animated / scroll-driven / cinematic / "Higgsfield-style" website or landing
page, OR hands over a brand kit and asks to "build the site." If a `brand/BRAND-KIT.md` exists
in the project, load it as the design system automatically.

## Inputs (ask only for what's missing)
1. **Brand kit** — logo files, colors, fonts, voice. (For this project: `brand/BRAND-KIT.md`.)
2. **Business details** — what they sell, key sections, copy, CTAs, contact info.
3. **Reference imagery** — real photos to use as Higgsfield start-frames (optional but better).
4. **Scope** — one-page scroll site (default) vs. multi-page; target deploy (GitHub/Vercel).

---

## Phase 1 — Generate assets (Higgsfield MCP)

Use the connected Higgsfield MCP. Always **state the credit cost and get a go-ahead before a
batch of generations.** Set video `sound: off` (websites are muted) to save credits.

**Model choices (confirmed available on this MCP):**
- **Hero / background images (text→image):** `Recraft 4.1` — pass the brand `colors` palette
  (hex array) and `2k` resolution, aspect `16:9` (desktop) / `9:16` (mobile). For environments
  use `Soul Location` (supports ultra-wide `21:9`). For consistent people use `Soul Cast` / Soul ID.
- **Scroll clips (image→video):** `Kling 3.0` with **`start_image` + `end_image`** roles — this is
  the core move: generate frame A, generate a second angle as frame B, let Kling interpolate a
  cinematic camera pan/push between them. Alternatives: `Seedance 2.0` (start/end, up to 1080p),
  `Grok Imagine 1.5` (single start image → motion), or `Higgsfield Preset` (see `presets_show`).
- **Upscale** every chosen still with `upscale_image` (up to 4×) *before* using it as a video
  source frame, so extracted frames stay crisp.

**Per hero section, do this:**
1. `generate_image` (Recraft 4.1) → 3–4 variations, brand palette, 2k, 16:9. Pick the best.
2. `upscale_image` the winner.
3. `generate_image` a **second angle** of the same scene (or use a provided photo) → end frame.
4. `generate_video` (Kling 3.0, `sound:off`, ~5s) with `start_image`=A, `end_image`=B, prompt the
   camera move ("slow cinematic push-in, parallax, subtle volumetric light").
5. Download the clip + stills into `assets/`.

> If the user provides real photos (e.g. V2 Jets' jet/interior shots), use those as start frames
> directly — skip step 1 and go to the upscale/animate steps.

---

## Phase 2 — Extract frames

For each scroll clip, extract a frame sequence so scroll position can scrub the footage:
```bash
mkdir -p assets/frames/<section>
ffmpeg -i assets/<section>.mp4 -vf "fps=30,scale=1920:-1" assets/frames/<section>/f_%04d.jpg -q:v 3
```
Record the frame count per section — the scroll handler maps scroll progress → frame index.
(If `ffmpeg` is unavailable, fall back to playing the `<video>` muted/looping as a pinned
background and drive only opacity/parallax from scroll.)

---

## Phase 3 — Build the site

Stack: **plain HTML + CSS + vanilla JS** (no framework needed; keep it deployable as static files).
Use `IntersectionObserver` + a single `scroll`/`requestAnimationFrame` loop. No heavy libraries;
optionally GSAP/Lenis only if smooth-scroll inertia is requested.

**File structure:**
```
index.html
css/styles.css
js/scroll.js
assets/  (images, video, frames/, logo)
brand/   (BRAND-KIT.md, logos, images)
```

**Before writing code, output a short technical plan** covering, per section: scroll-position
opacity, easing function, cross-fade between sections, directional parallax, and (if used) the
frame-scrub range. Then build.

### Scroll-animation patterns to implement
1. **Frame-scrub hero** — pin a full-viewport `<canvas>`/`<img>`; map `scrollProgress` over the
   section to a frame index; draw that frame. Creates the "video plays as you scroll" effect.
2. **Scroll-triggered reveals** — `IntersectionObserver` adds `.in-view`; elements fade+translateY
   in with the brand easing curve. Stagger children with `transition-delay`.
3. **Parallax** — translate background layers at a fraction of scroll (`translateY(scroll * -0.2)`);
   foreground content moves normally. Respect direction per section.
4. **Cross-fade / pinning** — `position: sticky` sections that hold while content layers swap
   opacity; sequential sections cross-dissolve rather than hard-cut.
5. **Progress-driven nav** — thin top progress bar; nav background goes solid after hero.
6. **`prefers-reduced-motion`** — disable scrubbing/parallax and just show static + simple fades.

### The six cinematic effects (apply by default)
1. **Film grain** — fixed-position tiling grain PNG/SVG noise overlay at low opacity (`mix-blend: overlay`).
2. **Particles** — sparse floating dust/light motes (CSS-animated divs or a tiny canvas), very subtle.
3. **Vignette** — `radial-gradient` overlay darkening edges to focus the center.
4. **Glass cards** — content cards with `backdrop-filter: blur()` + translucent fill + hairline border.
5. **Color tints** — section-level gradient/overlay in brand hues (here: dark + red wash) for mood.
6. **Scroll pacing** — consistent easing (`cubic-bezier(.645,.045,.355,1)`, ~0.6s) and tuned
   IntersectionObserver thresholds so reveals feel timed, not abrupt.

---

## Phase 4 — Verify & deploy

1. Start the preview server and load the page (use the `preview_*` tools — never ask the user
   to check manually).
2. Check console for errors, snapshot structure, scroll through, screenshot key sections.
   Test `preview_resize` for mobile + reduced-motion.
3. Fix issues at the source, re-verify.
4. Share screenshots as proof. Iterate via follow-up chat **without re-running this skill**.
5. On request, deploy: `git init` → push to GitHub, or ship static on Vercel/Netlify.

---

## Default design system — V2 Jets
When building for this project, use `brand/BRAND-KIT.md` as the source of truth:
- **Palette:** ink `#0A0A0A` base, white `#FFFFFF` text, red accent `#C41010` (hover `#A20000`),
  off-white `#FAFAFA`, grey `#959595`. White logo only — always on dark/photographic backdrops.
- **Type:** headings `franklin-gothic-urw` (fallback **Libre Franklin**), UPPERCASE, wide tracking
  (~0.18em); body `Roboto`.
- **Voice:** sophisticated, exclusive, relationship-driven — "effortless luxury," "trust is our bond."
- **Sections to build:** Hero ("The World Awaits" / "The Skies Are The Limit") → Fly in Absolute
  Luxury → The Fleet (Turbo Prop · Light Jet · Mid Size · Super Mid · Heavy Jet · Ultra Long Range ·
  **Obsidian**) → An Unforgettable Journey → Trust / Safety → Founding Partners → Book Now CTA
  (phone 212-204-8422) → Footer (markets, social, broker disclaimer).
- **Motion:** brand curve `cubic-bezier(.645,.045,.355,1)`, ~0.6s.
- **Start frames:** reuse the real photos in `brand/images/` for the Higgsfield pans.

---

## Guardrails
- **Credits cost money.** Summarize the planned generations + est. cost and get a go-ahead before
  batch-generating. Prefer reusing provided photos over generating from scratch.
- Keep the brand red as an **accent**, not a flood — luxury reads restrained.
- Static, dependency-light output unless the user asks for a framework.
- Always include the legal broker disclaimer for V2 Jets in the footer.
- Honor `prefers-reduced-motion` and keep Largest Contentful Paint fast (lazy-load frame sequences).

## Install location (to use as a real Claude skill)
Copy this file to `~/.claude/skills/higgsfield-scroll-site/SKILL.md` (Claude Code) or load it into
the project's Context panel (Cowork). Requires the Higgsfield MCP connected at
`https://mcp.higgsfield.ai/mcp` and a paid Higgsfield plan for generation credits.
