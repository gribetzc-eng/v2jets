# V2 Jets — Brand Kit

> Pulled from https://www.v2jets.com (Squarespace site) on 2026-06-15.
> Source files saved in this folder: `homepage.html`, `custom.css`. Verified against live CSS, not guessed.

## Company
- **Name:** V2 Jets (legal: V2 Jets, LLC — an Air Charter Broker, *not* a direct air carrier)
- **Category:** Luxury private jet charter / brokerage
- **Phone:** (212) 204-8422
- **Markets served:** Los Angeles, Chicago, New Jersey, New York, Florida
- **Client portal:** https://client.v2jets.com
- **Social:** Facebook / Instagram / LinkedIn — handle `@v2jets`
- **Founders:** Steven Rosenzweig, Guy Endzweig

## Taglines & messaging (verbatim)
- **Primary taglines:** "The Skies Are The Limit" · "The World Awaits"
- **Positioning lines:** "Private Jet Charter Excellence" · "Take To The Skies In Style"
- **Mission:** "From the ground to the skies, a life of effortless luxury is our client's right."
- **Service promise:** "Whether it's your personal charter specialist or the world's finest luxury aircraft, there is only one constant — V2 Jets' world-class service."
- **Section heads:** "We're dedicated to making your journey extraordinary." · "Fly In Absolute Luxury" · "An unforgettable journey" · "Trust is our bond" · "Meet our founding partners"
- **Primary CTA:** "Book Now" / "Book Your Luxury Flight Today"

## Brand voice
Sophisticated, exclusive, relationship-driven. Emphasis on trust, safety, effortless luxury, and bespoke personal service ("no request too large"). Aspirational but warm — "building strong personal relationships into an art form."

## Color palette (from live CSS)
| Role | Hex | Notes |
|------|-----|-------|
| **Primary red (accent / CTA)** | `#C41010` | Main brand red; also appears as `#B00000`/`#BB0000` (`#b00`) on buttons |
| **Red — dark / hover** | `#A20000` | Hover state; also seen as `#A50D0D` |
| **Ink / background** | `#000000` → `#0A0A0A` | Cinematic dark base behind imagery |
| **White** | `#FFFFFF` | Primary text & logo color |
| **Off-white** | `#FAFAFA` | Subtle surfaces / form fields |
| **Muted grey** | `#959595` | Secondary/help text |

Design pattern: **white type + red accents over dark, full-bleed photography.** The logo is white-only and assumes a dark backdrop.

## Typography (from live CSS)
- **Headings / display / brand UI:** `franklin-gothic-urw` (Franklin Gothic URW, served via Adobe Fonts/Typekit). Used UPPERCASE, light weights (300) and bold (700), wide tracking (`letter-spacing` up to `5px` / ~0.05–0.25em).
- **Body:** `Roboto` (Google Fonts; weights 400/500/700, italics available).
- **Free web substitutes** (if Adobe Fonts isn't wired up): headings → **Libre Franklin** (Google Fonts, a Franklin Gothic revival) or **Archivo**; body → **Roboto** (already free).

```css
/* drop-in tokens */
:root{
  --v2-red:#C41010; --v2-red-dark:#A20000;
  --v2-ink:#0A0A0A; --v2-black:#000;
  --v2-white:#FFF; --v2-off:#FAFAFA; --v2-grey:#959595;
  --v2-font-head:"franklin-gothic-urw","Libre Franklin","Archivo",sans-serif;
  --v2-font-body:"Roboto",system-ui,sans-serif;
  --v2-track:0.18em;                 /* heading letter-spacing */
  --v2-ease:cubic-bezier(.645,.045,.355,1); /* brand motion curve, ~0.6s */
}
```

## Motion signature
The live site animates with `transition: all .6s cubic-bezier(.645,.045,.355,1)` (an ease-in-out cubic). Reuse this curve and ~0.6s timing for scroll reveals so the rebuilt site feels native to the brand.

## Aircraft categories (use as a site section / nav)
Turbo Prop · Light Jet · Mid Size · Super Mid · Heavy Jet · Ultra Long Range · **Obsidian** (flagship tier)

## Logo assets (downloaded → `brand/logos/`)
| File | Format | Size | Use |
|------|--------|------|-----|
| `Logo_V2-White-top-original.png` | PNG, transparent | 1296×1405 | **Stacked/badge** white logo — best source of truth |
| `Logo_V2-White-wordmark.png` | PNG, transparent | 1296×1212 | **Wordmark** white logo (converted from WebP) |
| `Logo_V2-White-top.png`, `Logo_V2-White.png` | WebP | small | Web-optimized originals as served by Squarespace |

> Both logos are **white on transparent** — always place on a dark/photographic background. No dark-on-light variant exists; if needed for a light section, generate one or invert.

## Photography (downloaded → `brand/images/`)
All are dark, cinematic aviation/interior shots — ideal Higgsfield start-frames:
- `hero-xl.jpg` — homepage hero
- `hero-aboutus.jpg` — about hero
- `interior-main.jpg`, `interior-bedroom.jpg` — luxury cabin interiors
- `plane-exterior.jpg` — jet exterior
- `V2Jets_909.jpg` — journey/lifestyle

Use these as **start frames** for Higgsfield image-to-video (e.g. Kling 3.0 start→end pans) to create the scroll clips.
