# V2 Jets — Cinematic Scroll Site (Gulfstream G700)

A scroll-driven, cinematic one-page site for **V2 Jets**, in the style of
[feadship.nl](https://feadship.nl), themed entirely around a **Gulfstream G700**. The whole page
reads as one continuous flight: it opens on the **Book Your Luxury Flight** CTA as the jet **lands**,
moves through the exterior showcase, and closes by **orbiting** the parked jet under "The World Awaits."

## Run it
```bash
python3 -m http.server 4321 --directory .
# open http://localhost:4321
```
(Preview config is in `../.claude/launch.json` as the `v2jets` server.)

## Structure
```
index.html         # 9 sections
css/styles.css      # brand system + 6 cinematic effects + scene/scroll styles
js/scroll.js        # multi-video scrub · parallax · progress · reveals · nav · fleet drag
assets/ext/         # Higgsfield G700 exterior stills + orbit & landing videos
brand/              # BRAND-KIT.md + real V2 logos & photos (from v2jets.com)
```

## Two scroll-scrubbed video scenes
Both use a **pinned `.scene`** whose scroll progress `p` (0→1) drives `video.currentTime`, so the
camera motion is locked to scroll/swipe. A poster still shows until the clip buffers. `js/scroll.js`
scrubs **every** `.scene__video`, so the pattern scales to any number of scenes.

- **Hero (01) — book + landing.** `g700-landing.mp4` (10s). The "Book Your Luxury Flight / Call
  (212) 204-8422" CTA sits over the jet's final approach; scroll brings it down to the runway
  (300vh / 230vh mobile). Nav "Book Now" / "Contact" anchor here (`#hero`).
- **Finale (08) — orbit the G700.** `g700-orbit.mp4` (8s). "The World Awaits" over a slow orbit
  walkaround of the parked jet (front three-quarter → side → engines/tail); 240vh / 190vh mobile.

Honors `prefers-reduced-motion` (posters + simple fades, no scrub).

## Higgsfield assets (this build)
Two **Seedance 2.0** image→video clips (480p, fast) + six **soul_2** exterior stills (~0.12 cr each):

| File | Type | Used in |
|------|------|---------|
| `g700-landing.mp4` | Video — 10s final approach + touchdown | Hero (01) scrub |
| `g700-orbit.mp4` | Video — 8s orbit around the jet | Finale (08) scrub |
| `g700-hero-frontquarter.png` | Front three-quarter, golden hour (both clips' start frame source) | Hero poster · Fleet 06 |
| `g700-side-dusk.png` | Full side profile, blue hour | Manifesto · Fleet 01 |
| `g700-rear-engines.png` | Three-quarter rear, engines + T-tail | Fly In Absolute Luxury · Fleet 03 |
| `g700-inflight.png` | In flight above clouds | Unforgettable Journey · Landing poster · Fleet 04 & 07 |
| `g700-nose-detail.png` | Nose / cockpit close-up | Safety · Fleet 02 |
| `g700-hangar.png` | In a dark hangar | Founding Partners · Fleet 05 |

**Notes:** Kling 3.0 video requires a paid plan; **Seedance 2.0 runs on the free tier** (1 job at a
time). 720p scales cost steeply (a 15s 720p orbit preflighted at ~52 cr), so these were generated at
**480p** per the chosen budget. The content filter occasionally false-flags long clips as "nsfw" —
**those jobs are auto-refunded** (confirmed in the credit ledger), so a rejected retry costs nothing.

## Sections
01 Hero / Book CTA (landing, 212-204-8422) · 02 Manifesto · 03 Fly In Absolute Luxury ·
04 An Unforgettable Journey · 05 Trust / Safety · 06 Founding Partners ·
07 Finale — "The World Awaits" (orbit walkaround) · 08 The Fleet (carousel, 7 tiers → Obsidian) ·
09 Footer (markets, social, broker disclaimer).

## The six cinematic effects
Film grain · floating particles · vignette · glass cards (`backdrop-filter`) ·
brand color tints (dark + red) · scroll pacing (`cubic-bezier(.645,.045,.355,1)`).

## Design system
Ink `#0A0A0A` · white text · red accent `#C41010` (hover `#A20000`).
Headings **Libre Franklin** (Franklin Gothic revival, matching v2jets.com) · body **Roboto**.
See `brand/BRAND-KIT.md`.

## Fleet photos (`assets/fleet/`)
Each fleet tier uses a real representative aircraft photo from **Wikimedia Commons** (downloaded,
resized to ≤1600px): Pilatus PC-12, Embraer Phenom 300, Cessna Citation Latitude, Bombardier
Challenger 350, Gulfstream G550, Gulfstream G650, Boeing Business Jet.
The fleet cards are **landscape (16:10)** so each whole aircraft is visible (`background-size:cover`,
bottom scrim for the label); ~2 cards show per view on desktop, one large card on mobile.
> **License:** Commons photos are typically CC-BY-SA / CC-BY and **require attribution** (and
> sometimes share-alike). Before going live commercially, confirm each image's license on its
> Commons file page and add a photo-credits line (e.g. in the footer), or swap in owned/licensed shots.

## Deploy notes
- Static files — drop on **Vercel / Netlify** (root) or any static host.
- Fleet card backgrounds use **root-absolute paths** (`/assets/ext/...`), so deploy at the domain
  root (not a sub-path). For a sub-path deploy, switch those `--img` URLs back to relative.
- For a crisper hero/landing, regenerate the clips at 720p (more credits); the scrub code is unchanged.
