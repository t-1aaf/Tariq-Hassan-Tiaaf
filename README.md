# Rowan Vale: portfolio

A scroll-driven portfolio for a designer who is also a full-stack developer.
Next.js (App Router) · TypeScript · GSAP + ScrollTrigger · Lenis · plain CSS (no Tailwind, no UI kit).

```bash
npm install
npm run dev        # http://localhost:3000
npm run build && npm start
```

Node 18.18 or newer.

## The works dashboard

Open **`/dashboard`** while `npm run dev` is running. There you can add, edit and delete
projects without touching any code:

- **Add a work** — title, year, blurb, role, link, cover style and colours, optional image / video.
  The form has a live preview of the card as it appears in the gallery.
- **Featured** puts a work in the big horizontal gallery; everything is always listed in the index.
- **Edit / Delete** any existing work.

Projects live in **`src/data/projects.json`** (newest first), written by the dashboard through
`/api/projects` and read at request time by `src/lib/projects.ts`, so saves are live on the next
page load — no rebuild. The file is plain JSON, so you can still edit it by hand or commit it.
The dashboard is unlisted (`noindex`) and has none of the portfolio chrome; it is a plain admin page.

> Note: writes go to the filesystem, which is exactly what you want for `npm run dev` or a
> self-hosted `npm start`. On read-only hosts (some serverless platforms) commit the JSON instead.

## Make it yours: one file

Every word on the page lives in **`src/data/content.ts`**: your name, the hero words, headlines,
button labels, projects, process, stats, footer. It is all placeholder, so replace it.
The file is split into numbered sections that follow the page from top to bottom, with a recipe list at the top.

| To do this...                | Edit this in `content.ts`                                                                 |
| ---------------------------- | ----------------------------------------------------------------------------------------- |
| Change your name             | `site.name` and `site.initials`                                                           |
| Add / edit projects          | No code: open **`/dashboard`** (manages `src/data/projects.json`)                          |
| Use your own project images  | Overwrite the files in `public/projects/` (same names), or point `image` at any file in `/public` |
| Your photo / showreel        | `site.portrait = "/me.jpg"`, `site.reel = "/reel.mp4"`                                    |
| Change the giant hero words  | `hero.top`, `hero.bottom` (keep them short: they are stretched to fill the screen)        |
| Rewrite the statement        | `manifesto`                                                                               |
| Process, stats, tools        | `approach`, `about.stats`, `about.tools`                                                  |

Colours, radii and fonts are the tokens at the top of `src/app/globals.css` (`:root`).
Fonts are loaded in `src/app/layout.tsx`.

## The idea

The site is one metaphor: **every page has two layers, the design and its source.**

- **Hero.** The hero is drawn twice at identical positions. A small lens follows your pointer and
  shows the source layer: the type swaps typefaces (grotesk for mono, mono for grotesk), snaps to a
  12-column grid, and gets selection boxes and size tags like a design tool. The lens carries a
  "Press" tag; press and hold to open it across the whole screen. On touch screens it drifts on its own.
- **Type.** Bricolage Grotesque (weights 200-800, widths 75-100) is "design". JetBrains Mono is "code".
  The two are never mixed up: the hero words, Designer and Developer in the statement, the Design and Code
  halves of each process stage, the two marquee rows and the toolbox pills all follow that rule.
- **Scroll.** The hero pins while the next sheet slides over it. The statement is three steps
  (Designer and Developer, a rule that draws itself, one closing sentence) that light up as you reach them.
  Work is a pinned horizontal gallery with layered parallax inside every card. The bento tiles fly in and lock
  into place. Process cards stack like paper and draw their line art. The footer name swells from a light,
  narrow cut to the heaviest, widest one as you arrive.

## Files

```
src/data/content.ts     ALL copy and data (edit this)
src/data/projects.json  the projects, managed from /dashboard
src/lib/projects.ts     reads/writes projects.json (validation, slugs, fallback)
src/app/dashboard/      the works dashboard (admin, noindex)
src/app/(site)/         the portfolio itself (layout keeps preloader/nav/cursor)
src/app/api/projects/   GET/POST + PUT/DELETE routes used by the dashboard
src/lib/gsap.ts         registers plugins, exports useScope() (useGSAP + safe callbacks)
src/lib/anim.ts         fitText / fitBox, revealHeadings, reduced-motion helpers
src/components/         one file per section, plus Nav, Cursor, Preloader, SmoothScroll
src/components/ui/      Cover (generative art), Words, RollText, Magnetic, Badge
src/app/globals.css     tokens, then one block per section in page order
```

## Notes

- **Reduced motion** is respected: no preloader, no pinning, no smooth scroll, and the gallery
  becomes a normal horizontally scrollable strip.
- **Fonts** load from Google Fonts with two separate `<link>` tags. To self-host, switch to `next/font`.
- **Pointer effects** (custom cursor, lens, magnetic buttons, index preview) only run on devices
  with a fine pointer and hover.
- **Project images.** Every project ships with a demo image in `public/projects/` (`<slug>.webp`).
  They are placeholder mock-ups for the placeholder projects, so replace them with your real screenshots.
  Any 16:9-ish image works (about 1920 x 1040 is ideal for the big gallery cards). It is cropped to fit, and
  `imagePosition: "center top"` on a project chooses which part stays visible. Use `video: "/projects/loop.mp4"`
  for a short looping clip. If a project has no `image` or `video`, generated artwork (SVG and CSS) is shown
  instead, so nothing is ever blank.
- Cards have a soft shade at the bottom so the big project title stays readable over bright screenshots.
- **Lens size** is `idleR()` inside `Hero.tsx` (currently 64 to 104px radius).
- **Side margins** are the `--pad` token in `globals.css`. On screens 1100px and wider it is a wide gutter
  (88 to 124px) so the vertical section index has room and never touches the content.
