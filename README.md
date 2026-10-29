# Saltline Kitchen (portfolio concept)

Five-page front end for a fictional Brooklyn restaurant group. No backend: the reservation form and the
Order at Table flow run entirely in the browser and send nothing.

Next.js 16 (App Router), TypeScript, Tailwind CSS 4, Motion, GSAP ScrollTrigger (home plate sequence only), Lenis.

## Run

```bash
npm install
npm run dev        # http://localhost:3000
npm run build && npm start
```

## Routes

| Route        | What it is                                                              |
| ------------ | ----------------------------------------------------------------------- |
| `/`          | Home, with the pinned "build a plate" scroll sequence                   |
| `/menu`      | Full menu with sticky section tabs                                      |
| `/locations` | Three rooms, hours, notes, illustrated map                              |
| `/reserve`   | Booking form: validation, loading and success states (`?location=` presets the room) |
| `/order`     | QR table-ordering demo (`?location=red-hook&table=7` simulates a scan)  |

## Art

All food art is hand-coded cut-paper SVG in four palette colors. Source lives in `scripts/art/`; regenerate
`public/art/` and `lib/art/dishes.ts` with:

```bash
node scripts/art/build.mjs
```

## Environment

| Variable               | Required | Purpose                                                                 |
| ---------------------- | -------- | ----------------------------------------------------------------------- |
| `NEXT_PUBLIC_SITE_URL` | No       | Canonical origin for metadata, sitemap and robots. On Vercel it falls back to `VERCEL_PROJECT_PRODUCTION_URL`. |

No secrets are used.

## Deploy

```bash
vercel deploy --prod
```
