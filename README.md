# Steve Fernandes Aqua World

A dark, cinematic Next.js website for a bespoke aquarium design studio. Built from the brief in
`aquarium_business_website_build_brief.md`, informed by (but not copying fake data from) the original
`sfaquaworld.html` prototype.

## Before you do anything else

**This code has not been run through a real `npm install` or `next build`.** The sandbox this was built in
has no network access, so there was no way to install `next`, `react`, `gsap`, or `tailwindcss` and actually
compile the project. Everything here was written carefully and checked with:

- A full TypeScript type-check against hand-written type declarations for React, Next.js and GSAP (not the
  real published `@types` packages) — this catches logic errors (wrong prop types, unsafe null access, etc.)
  but **cannot** catch a typo in a real library's API that the shims didn't know about.
- A manual cross-reference confirming every custom CSS class used in a `.tsx` file is defined in
  `globals.css`, and vice versa.
- A read-through for Tailwind v4 syntax (e.g. `bg-linear-to-*` instead of the v3 `bg-gradient-to-*`, spaced
  operators inside arbitrary `clamp()` values).

**Your first step should be:**

```bash
npm install
npm run typecheck   # tsc --noEmit, using the real installed types this time
npm run dev          # then click through every page in a browser
```

Please budget time to fix anything that surfaces. I'm confident in the structure and logic, but "never
compiled" is never the same guarantee as "compiled."

## Getting started

```bash
npm install
cp .env.example .env.local   # then fill in what you have
npm run dev                  # http://localhost:3000
```

## Scripts

| Command                     | What it does                                                              |
| ---------------------------- | --------------------------------------------------------------------------- |
| `npm run dev`                | Local dev server                                                          |
| `npm run build`              | Placeholder check (informational) + production build                     |
| `npm run start`               | Serve a production build                                                   |
| `npm run typecheck`          | `tsc --noEmit`                                                             |
| `npm run check:placeholders` | Lists every item still awaiting client data (always exits 0)              |
| `npm run check:production`   | Same list, but **exits 1** if any *required* item or env var is missing   |

Run `npm run check:production` before every real deploy. It's the same list the in-app `/pending/` page
shows (draft mode only), and it's meant to be the thing that stops an unfinished site from going live by
accident.

## The no-fake-data system

Nothing on this site invents contact details, testimonials, project stories, or FAQ answers. Where the
studio hasn't supplied something yet, the site does one of two things, controlled by
`NEXT_PUBLIC_DRAFT_MODE` in `.env.local`:

- **`NEXT_PUBLIC_DRAFT_MODE=true`** (the default): missing content shows as a visible, dashed, light-blue
  `[LABEL LIKE THIS]` marker so it's obvious in the browser what's still needed. A small pill in the bottom
  corner links to `/pending/`, a full checklist. `robots.txt` blocks all crawlers and every page is `noindex`
  so a draft can never leak into search results.
- **`NEXT_PUBLIC_DRAFT_MODE=false`**: every placeholder marker disappears completely, along with anything
  that depends on missing data (an empty FAQ answer, an unconfirmed project, a social link with no URL). The
  site never falls back to inventing something in its place — a section just doesn't render.

**Only flip `NEXT_PUBLIC_DRAFT_MODE` to `false` once `npm run check:production` passes.** `NEXT_PUBLIC_*`
variables are baked in at build time by Next.js, so this has to be set correctly *before* `npm run build`,
not changed afterwards on a running server.

All editable content lives in `src/content/*.json` — nothing is hardcoded in components. To fill something
in, edit the JSON and rebuild:

- `site.data.json` — brand copy, contact details, socials, Steve's bio, testimonials, FAQ answers
- `services.json` — the 9 services (3 get their own page), plus a `copyConfirmed` flag
- `process.json` — the 5-step process copy, plus a `copyConfirmed` flag
- `projects.json` — 5 draft portfolio entries built around your real uploaded photos. Each needs a `title`
  and `confirmed: true` before it will appear on the live (non-draft) site — see "Projects" below.
- `images.json` — your 8 uploaded photos, each with an `ownershipConfirmed` flag (see "Photos" below)

## Projects: what's real and what isn't

Five portfolio entries were created as **structure only**, built around the 8 photos you uploaded, with
`title`, `summary`, every story field, and every spec left as `null`. **No project names, descriptions, or
specs were invented.** In draft mode you'll see them as placeholder cards; in a production build
(`NEXT_PUBLIC_DRAFT_MODE=false`), a project only appears once it has both a real `title` **and**
`confirmed: true` in `projects.json` — otherwise it's left out of the portfolio grid, the homepage, the
sitemap, and its individual page entirely, rather than showing a blank or placeholder-looking project to a
real visitor.

## Photos

All 8 of your uploaded photos were cropped (a few had black letterbox bars removed) and converted to WebP.
Two things to look at before launch:

1. **The angelfish portrait photo** (`steve-portrait.webp`, used for "Meet Steve") looks like a bright
   daylight/outdoor shot and sits oddly against the site's dark palette. It's usable as-is, but a different
   photo (or a color grade) would fit better.
2. **Every photo has `ownershipConfirmed: false`** in `images.json`. This isn't a copyright-detection
   result — it's simply that I haven't asked you to confirm you own the rights to publish each one. One tank
   photo appears to show a visible "ADA" brand logo in frame; that's worth a specific look before it goes
   live. Set `ownershipConfirmed: true` for each photo once you've confirmed it, or swap in a different image
   in `images.json` if not.

The original files you uploaded were already resized by the upload pipeline to a maximum of 2000×2000 (one,
the long tank shot, was near enough to its original size that this doesn't matter). If you have the original
full-resolution files, especially for the portrait shot, sending those over would let me re-export sharper
versions.

## Stack

Next.js 15 (App Router) · React 19 · TypeScript · Tailwind CSS v4 · GSAP + ScrollTrigger

- Content: typed JSON in `src/content/`, accessed only through `src/lib/content.ts` and `src/lib/site.ts`
- Motion: `src/components/motion/` — scroll reveals, parallax, the underwater atmosphere layer, the custom
  cursor, the page transition. Everything respects `prefers-reduced-motion` and is invisible-by-default with
  JS opting *in* to hiding content (so content never stays hidden if JS fails)
- The process section (`ProcessTimeline.tsx`) is the only pinned/sticky-scroll section on the site
- SEO: per-page metadata via `src/lib/seo.ts`, JSON-LD schema via `src/lib/schema.ts`, `sitemap.ts`, `robots.ts`
- The consultation form (`ConsultationForm.tsx` → `/api/enquiry`) is real: it only reports success once an
  email provider (Resend) has actually accepted the message. It never fakes a success state.

## Environment variables

See `.env.example`. `RESEND_API_KEY`, `ENQUIRY_TO_EMAIL`, and `ENQUIRY_FROM_EMAIL` are required for the
contact form to actually send email — without them the API route honestly returns a 503 rather than
pretending to work, and the form tells the visitor to use WhatsApp or phone instead.

## What's still open

Run `node scripts/check-placeholders.mjs` (or visit `/pending/` with `NEXT_PUBLIC_DRAFT_MODE=true`) for the
full, current list. As of this build: 31 required items and 28 optional ones, spanning business contact
details, Steve's bio, service/process copy confirmation, and the 5 projects' titles and stories — plus the 3
environment variables above and photo ownership confirmation.
