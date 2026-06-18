# V2 Jets site — project handoff (continue here)

> Read this first. It captures everything a fresh session needs to keep working on this project
> without the prior chat history. Last updated mid-build (context handoff).

## What this is
A cinematic, Feadship-style marketing website for **V2 Jets** (a real luxury private-jet charter
broker, v2jets.com), built for **Charles** (gribetzc@gmail.com) on his Mac.
It is a **multi-page static site**: a cinematic single-page **home** plus 6 inner pages that
recreate the real V2 site's pages. Imagery is generated via the connected **Higgsfield MCP**
(G700 exteriors, cabin, scroll-scrub videos) + real Wikimedia aircraft photos for the fleet.

## Where it lives / how to run
- Folder: `/Users/charlesgribetz/Claude/v2jets-site/`
- Serve: preview config is in `../.claude/launch.json` as server name **`v2jets`**
  (`python3 -m http.server 4321 --directory v2jets-site`). Use the `preview_start` tool with
  name `v2jets`; the `serverId` changes every restart. URL: http://localhost:4321
- It is **not** a git repo.

## File map
```
index.html              # cinematic home — 9 scroll sections
aircraft.html charter.html about.html brief.html safety.html contact.html  # inner pages (real V2 content)
css/styles.css          # home + shared (brand tokens, nav, panels, scenes, menu, fx, polish)
css/pages.css           # inner-page layouts (phero, sections, tiers, briefs, contact, cta-band)
js/scroll.js            # HOME ONLY: scene video-scrub, parallax, fleet drag, nav-solid, progress, reveals
js/enhance.js           # ALL pages: Lenis smooth-scroll, line reveals, intro curtain, tilt/magnetic,
                        #            full-screen menu toggle, + nav-solid/reveal fallback for inner pages
assets/ext/             # Higgsfield-generated G700 stills + videos (orbit, landing, cabin fly-through)
assets/fleet/           # 7 real Wikimedia aircraft photos (CC-BY-SA — needs attribution if commercial)
assets/img/             # earlier interior generations (gulfstream-cabin, bombardier-lounge, jet-bedroom)
brand/                  # BRAND-KIT.md + real V2 logos & photos (V2Jets_909 = founders, hero-xl, etc.)
README.md  BRAND-KIT.md  SKILL.md   # docs (SKILL.md = the Higgsfield-scroll-site skill spec)
```

## Home page (index.html) — scroll order
1. **#hero** — "Book Your Luxury Flight" booking CTA over the **landing** video scrub (`g700-landing.mp4`)
2. **#manifesto** — "Our promise" statement over `g700-side-dusk.png`
3. **#luxury** — split: text left + **full cabin photo right** (`g700-cabin-dining.png`, watermark cropped off)
4. **#journey** — in-flight jet left + text panel right (gradient, no glass box) — mirrors #luxury
5. **#trust** — "Trust is our bond" over `g700-nose-detail.png`
6. **#partners** — founders photo background (`brand/images/V2Jets_909.jpg`), names under each founder
7. **#book** — "The World Awaits" over the **orbit** video scrub (`g700-orbit.mp4`)
8. **#fleet** — horizontal carousel, 7 tiers, landscape cards with real aircraft photos (`assets/fleet/`)
9. **footer**

The two **scroll-scrubbed videos** map scroll progress → `video.currentTime` (see `.scene` / `js/scroll.js`).
Hero=landing, finale=orbit (they were swapped from their original order at the user's request).

## Inner pages
Each has shared **nav + full-screen menu + footer**, a cinematic `.phero` (image + title), the real
V2 copy, and a "Take To The Skies In Style → Book Now" `.cta-band`. Content was scraped from
v2jets.com. Aircraft page = 7-tier grid; About = founders bios; Brief = 11 article cards; Contact =
info + a (front-end-only, no backend) inquiry form. They load `lenis` + `enhance.js` only (NOT scroll.js).

## Navigation / menu
- Top nav: logo, inline links, Book Now, and a **hamburger (☰)** → full-screen overlay menu.
- Inline nav + menu + footer links all point to the **internal pages** (aircraft.html, etc.).
- Menu also has **Client Portal** (client.v2jets.com) + **socials** — those stay **external**.
- `scroll-margin-top:88px` on sections handles the fixed-nav offset for anchor landings.

## Brand system (see brand/BRAND-KIT.md)
Ink `#0A0A0A` bg · white text · red accent `#C41010` (hover `#A20000`). Headings **Libre Franklin**
(uppercase, wide tracking) · body **Roboto**. 6 cinematic effects: film grain, particles, vignette,
glass cards, color tints, scroll pacing. Motion curve `cubic-bezier(.645,.045,.355,1)`.

## Higgsfield MCP / credits — IMPORTANT
- Connected MCP = asset generation (`generate_image`, `generate_video`, etc.). **Free plan**, **1 job
  at a time**, ~**6.42 credits** left in workspace `a312436a-3d03-48de-918d-fa6a41e22d9b`
  (now selected; the originally-selected workspace was out of credits — call `select_workspace` if needed).
- **Kling 3.0 video requires a PAID plan; Seedance 2.0 works on free.** 480p Seedance ≈ **1.5 cr/sec**.
  720p ≈ 3.5 cr/sec (pricey). **NSFW false-flags are auto-refunded** (verified in the ledger), so
  rejected retries cost nothing. Always `get_cost:true` to preflight before spending.
- Useful start-frame job ids: cabin `afd0e8d0-8baf-4857-b5ff-b403fc2e58c0`,
  G700 exterior `3dba76a0-f734-4b56-a59a-888ac5e1150b`, in-flight `5409efdb-40ba-4dc7-b2e5-94e2573fc12c`.

## Critical gotchas (will save you time)
1. **preview_screenshot goes BLACK at wide widths (>~1000px)** because of the `.fx-grain`
   (mix-blend-mode) overlay and/or when the page is scrolled. Workarounds:
   - Screenshot at **≤800px** width (works even scrolled), OR
   - `eval` to `display:none` the `.fx-grain`/`.fx-vignette`/`.fx-particles` (works at top only), OR
   - For scrolled wide content, build a **static review copy** (strip lenis + enhance.js, add an
     override `<style>` forcing `.reveal{opacity:1}` and hiding fx), then native-scroll + screenshot.
2. **Lenis hijacks scroll**: `window.scrollTo` snaps back. Use `window.lenis.scrollTo(y,{immediate:true})`.
   `window.lenis` is set in enhance.js and may be **null right after navigation** (init delay) — wait/retry.
3. **`html{scroll-behavior:smooth}`** makes `window.scrollTo` async — set `scrollBehavior='auto'` first
   when you need an instant programmatic scroll for a screenshot.
4. **Wikimedia images**: only whitelisted thumbnail widths work (1024 → HTTP 400); download the
   **original** file URL (drop `/thumb/` and the `…/NNNpx-…` suffix) with a full browser User-Agent.
5. **Fleet card backgrounds use root-absolute paths** (`/assets/fleet/...`), so the site must deploy
   at the **domain root** (Vercel/Netlify root), not a sub-path.

## Production-prep (DONE — site is deploy-ready for Vercel root)
Target URL baked in everywhere: **`https://v2jets-site.vercel.app`** (Vercel project name `v2jets-site`).
- **SEO/social meta** on all 7 pages: canonical, theme-color `#0A0A0A`, author, Open Graph
  (type/site_name/title/description/image/url) + Twitter `summary_large_image`. Share card
  `assets/og/og-home.jpg` (1200×630, cropped from `g700-hero-frontquarter.png`).
- **Favicon set**: `assets/favicon.svg` (ink rounded rect, white "V2", red bar) + `favicon-32.png`,
  `apple-touch-icon.png` (180), `icon-512.png`. Linked via root-absolute paths on every page.
- **`404.html`**: full branded page (`noindex`, hangar bg, "Off the flight plan." → Return home).
  Vercel auto-serves it for not-found. DOM- + screenshot-verified.
- **`sitemap.xml`** (7 URLs, lastmod 2026-06-16), **`robots.txt`**, **`vercel.json`** (cleanUrls off,
  immutable cache on `/assets/` + `/brand/`, must-revalidate on `*.html`).
- **`set-domain.sh`** (chmod +x): re-point canonical/OG/sitemap/robots to a new base in one command —
  `./set-domain.sh https://v2jets.com` when the custom domain is attached.
- **`DEPLOY.md`** (step-by-step: dashboard or CLI) and **`PHOTO-CREDITS.md`** (Wikimedia CC-BY-SA
  attribution TODOs — needed before a *commercial* launch).
- **DONE — "Book Now" consistency**: home top-bar now → `contact.html` (was `#hero`); all 8 pages
  (incl. 404) route the nav CTA to contact.

## Still outstanding (pre-commercial-launch, not blockers for a Vercel preview deploy)
- **Photo licensing**: 7 Wikimedia fleet photos are CC-BY-SA — fill in `PHOTO-CREDITS.md` or replace.
- **Contact form** is front-end only (no mail backend — Formspree/Vercel function to wire up).
- Minor: `g700-rear-engines.png` (safety.html + a brief card) has a *faint* engine-nacelle text smudge.
- Optional polish: 720p re-gen of orbit/landing; stacked mobile layout for #partners (landscape founders
  photo center-crops on phones).

## DONE earlier (kept for reference)
- `assets/ext/g700-cabin-flythrough.mp4` wired into home **#manifesto** as a scroll-scrub `.scene__video`.
- Garbled `g700-side-dusk.png` ("Gulftram G3") removed site-wide (home + brief.html swapped to clean assets;
  file kept on disk but unreferenced).

## Verification status (all confirmed, no console errors)
Home (all 9 sections, both video scrubs, fleet carousel, menu), and inner pages Aircraft (hero+intro+tier grid),
Contact (hero+form), About (founders), Brief (11 cards) all render correctly on desktop + mobile.
