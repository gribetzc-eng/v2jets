# Deploying V2 Jets to Vercel

This is a **static site** (plain HTML/CSS/JS, no build step). It deploys to the
**domain root** — the fleet cards and favicons use root-absolute paths
(`/assets/...`), so it must NOT live under a sub-path.

Your production URLs are currently baked as **`https://v2jets-site.vercel.app`**.
If your real deployed URL ends up different, fix every tag in one command:

```bash
./set-domain.sh https://your-real-url.vercel.app
# or, once you attach the custom domain:
./set-domain.sh https://v2jets.com
```

---

## Option A — Vercel dashboard (no terminal, easiest)

1. Go to **https://vercel.com** and sign in (GitHub/GitLab/email all work).
2. **Add New… → Project**.
3. Easiest with no Git: choose **deploy from a folder / drag-and-drop**, or
   install the Git option below. For drag-and-drop, zip or drag this
   `v2jets-site` folder when prompted.
4. **Project Name:** type **`v2jets-site`** (this is what makes the URL
   `v2jets-site.vercel.app` — matching the meta tags already in the files).
5. **Framework Preset:** **Other** (it's static — no build command, no output dir).
6. Click **Deploy**. Done in ~20s.

## Option B — Vercel CLI (fastest to re-deploy)

```bash
npm i -g vercel          # one-time install
cd /Users/charlesgribetz/Claude/v2jets-site
vercel login             # opens a browser to authenticate (your account)
vercel --prod            # first run: accept defaults, set project name "v2jets-site"
```

- When asked "In which directory is your code located?" → **`./`**
- When asked about build settings → accept the static defaults (no build command).
- Re-deploy any time with `vercel --prod`.

> I can run the `vercel` commands for you, but **login and the final "deploy"
> confirmation are your call** — publishing is your account and your decision.

---

## After it's live — quick checks

- Open the URL. Hard-refresh (Cmd-Shift-R) so the favicon shows in the tab.
- Visit a bad path (e.g. `/nope`) → you should see the branded **404** page.
- Paste the URL into the Facebook Sharing Debugger
  (https://developers.facebook.com/tools/debug/) or Slack/iMessage to confirm
  the **og-home.jpg** share card renders. (Social previews only resolve once the
  baked domain == the live domain — run `set-domain.sh` if they differ.)

## Custom domain (optional, later)

In Vercel: **Project → Settings → Domains → Add** `v2jets.com` and follow the DNS
steps. Then run `./set-domain.sh https://v2jets.com` and re-deploy so canonical/OG
point at the real domain.

---

## Before a real commercial launch

- **Photo licensing:** the 7 fleet photos are Wikimedia **CC-BY-SA** and need
  attribution (or replacement). See `PHOTO-CREDITS.md`.
- **Contact form** is front-end only — wire it to a mail backend (Formspree,
  Vercel serverless, etc.) if you want submissions delivered.

## Local preview

```bash
python3 -m http.server 4321 --directory /Users/charlesgribetz/Claude/v2jets-site
# → http://localhost:4321
```
