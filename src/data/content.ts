/* ==========================================================================
   ✏️  EDIT ME
   This is the only file you need to touch to make the site yours.
   Every word on the page comes from here: your name, the headlines, the
   buttons, the projects, the process. It is all placeholder for now.

   QUICK RECIPES
   • Add / edit works ..... open /dashboard in the browser — no code needed (they are stored
                           in src/data/projects.json, newest first)
   • Use your own images ..... save a screenshot as public/projects/<slug>.webp (or .jpg / .png),
                               overwriting the demo image, or point `image` at any file in /public.
                               Use `video: "/projects/loop.mp4"` for a looping clip instead.
   • Crop is off? ............ add imagePosition: "center top" (or "left center"...) to that project
   • Change hero words ....... hero.top / hero.bottom
   • Change colours or fonts . top of src/app/globals.css (:root)
   ========================================================================== */

/* --------------------------------------------------------------------------
   Types (you don't need to edit these)
   -------------------------------------------------------------------------- */

export type CoverKind = "contours" | "halftone" | "grid" | "type" | "waves";

export type Project = {
  /** Unique id, lowercase, no spaces */
  slug: string;
  title: string;
  year: string;
  /** One sentence, shown under the card */
  blurb: string;
  /** What you did, e.g. "Product design, front-end" */
  role: string;
  /** Generated artwork used when there is no image or video: contours | halftone | grid | type | waves */
  kind: CoverKind;
  /** [background, main colour, second colour] for the generated artwork */
  colors: [string, string, string];
  /** The big letter on a "type" cover */
  letter?: string;
  /**
   * Your demo image or screenshot, from the /public folder, e.g. "/projects/fieldnote.webp".
   * Best at about 1920 x 1040 (16:9-ish); it is cropped to fit the card.
   * Remove this line (or leave it empty) to show generated artwork instead.
   */
  image?: string;
  /** Which part stays visible when the image is cropped, e.g. "center top" or "left center". Default: centre. */
  imagePosition?: string;
  /** A short looping video from /public instead of an image, e.g. "/projects/loop.mp4" */
  video?: string;
  /** Where "View case" goes */
  href: string;
  /** true = shown in the big horizontal gallery. Everything is always listed in the index. */
  featured: boolean;
};

/* --------------------------------------------------------------------------
   1. You
   -------------------------------------------------------------------------- */

export const site = {
  name: "Tariq Hassan",
  initials: "TH",
  role: "Designer and full-stack developer",
  /** Used for the browser tab and link previews */
  description:
    "Tariq Hassan is a designer and full-stack developer who takes products from first sketch to production code.",
  email: "tiaaf2011@gmail.com",
  availability: "Open for new projects",
  availabilityNote: "Booking from January",
  /** A photo in /public, e.g. "/me.jpg". Leave empty to show your initials. */
  portrait: "/me.jpg",
  /** A video in /public, e.g. "/reel.mp4". Leave empty to show the generated loop. */
  reel: "",
  socials: [
    { label: "GitHub", href: "https://github.com/t-1aaf" },,,
    { label: "Instagram", href: "https://www.instagram.com/_t1aaf/?__pwa=1" },
  ],
};

/* --------------------------------------------------------------------------
   2. Navigation
   -------------------------------------------------------------------------- */

export const nav = {
  cta: "Let's talk",
  menu: "Menu",
  close: "Close",
  /** The vertical index on the left. `id` must match a section id on the page. */
  sections: [
    { id: "top", label: "Intro" },
    { id: "work", label: "Work" },
    { id: "about", label: "About" },
    { id: "process", label: "Process" },
    { id: "contact", label: "Contact" },
  ],
  /** Links in the top bar */
  links: [
    { id: "work", label: "Work" },
    { id: "about", label: "About" },
    { id: "process", label: "Process" },
  ],
  /** Links in the full-screen menu on phones */
  menuLinks: [
    { id: "work", label: "Work" },
    { id: "about", label: "About" },
    { id: "process", label: "Process" },
    { id: "contact", label: "Contact" },
  ],
};

/* --------------------------------------------------------------------------
   3. Loading screen and hero
   -------------------------------------------------------------------------- */

export const preloader = {
  /** Shown as "Portfolio 2026" (the year updates by itself) */
  label: "Portfolio",
};

export const hero = {
  /** The two giant words. Keep them short: they are stretched to fill the screen. */
  top: "Design",
  bottom: "Code",
  amp: "&",
  /** Keep this to one short sentence */
  intro: "Designer and full-stack developer, from first sketch to shipped code.",
  /** The same idea written as code comments. Shown inside the inspect lens. */
  introComments: ["Designer + full-stack developer.", "First sketch to shipped code.", "No handoff in between."],
  /** The little label that travels with the cursor over the hero */
  press: "Press",
  release: "Release",
  /** Text that runs around the rotating badge */
  badge: "Open for new projects + Say hello + ",
};

/* --------------------------------------------------------------------------
   4. Manifesto (the statement right under the hero)
   {wave} {grid} {orb} {bars} drop a small animated picture into the sentence.
   -------------------------------------------------------------------------- */

export const manifesto = {
  designer: {
    title: "Designer",
    text: "who can't stop opening the inspector.",
    chip: "wave",
  },
  developer: {
    title: "Developer",
    text: "who can't stop nudging things two pixels left.",
    chip: "grid",
  },
  /** One string per line. Keep it to two or three lines. */
  statement: [
    "I take products from first sketch {orb} to production code, {bars} so nothing gets lost in the handoff.",
    "Because there isn't one.",
  ],
};

/* --------------------------------------------------------------------------
   5. Work
   -------------------------------------------------------------------------- */

export const work = {
  title: "Selected work",
  cta: "View case",
  /** "01 of 05" */
  of: "of",
};

/**
 * Projects no longer live here: add, edit and remove them from the /dashboard page.
 * They are stored in src/data/projects.json, which the dashboard reads and writes;
 * src/lib/projects.ts is the only code that touches it.
 */

/* --------------------------------------------------------------------------
   6. Full project list (title + note; the projects come from /dashboard)
   -------------------------------------------------------------------------- */

export const archive = {
  title: "Everything I've shipped",
  /** {count} becomes the number of projects */
  note: "{count} projects, newest first.",
};

/* --------------------------------------------------------------------------
   7. Marquee band (two rows: design words, then code words)
   -------------------------------------------------------------------------- */

export const marquee = {
  design: ["Interface design", "Design systems", "Brand identity", "Motion", "Prototyping"],
  code: ["Next.js", "TypeScript", "Node", "Postgres", "WebGL", "GSAP"],
};

/* --------------------------------------------------------------------------
   8. About (the grid of tiles)
   -------------------------------------------------------------------------- */

export const about = {
  chip: "About me",
  greeting: "Hi, I'm",
  text: "5 years of making software that looks like someone cared and runs like someone tested it.",
  /** Text that runs around the rotating badge */
  badge: "Designer + developer + one person + ",
  title: "Both halves of the product.",
  reel: {
    title: "Motion studies",
    text: "A loop I use to tune easing before it goes into code.",
  },
  toolboxTitle: "Toolbox",
  tools: {
    design: ["Figma", "Framer", "Blender"],
    code: ["Next.js", "TypeScript", "Node", "Postgres", "GSAP", "WebGL"],
  },
  /** `tone` is mint or lilac */
  stats: [
    { value: 5, label: "years shipping product", tone: "mint" },
    { value: 45, label: "products launched", tone: "lilac" },
  ],
  open: {
    note: "Small teams and solo founders are very welcome.",
    cta: "Start a project",
  },
};

/* --------------------------------------------------------------------------
   9. Process (four stacked cards). `tone` is mint, violet, sun or orchid.
   -------------------------------------------------------------------------- */

export const approach = {
  title: "How the work gets made",
  lede: "Four stages. Each has a design half and a code half, and I do both.",
  designLabel: "Design",
  codeLabel: "Code",
  stages: [
    {
      n: "01",
      title: "Sketch",
      tone: "mint",
      design: "I start on paper and in grayscale, until the idea works without any color or polish.",
      code: "I test the idea against real data and real constraints on day one, so nothing beautiful turns out to be impossible.",
    },
    {
      n: "02",
      title: "Prototype",
      tone: "violet",
      design: "A clickable version in Figma, or in Framer when the motion is the point.",
      code: "Throwaway code that answers one question: does this feel right at 60 frames a second?",
    },
    {
      n: "03",
      title: "Build",
      tone: "sun",
      design: "I stay in the loop for spacing, states and the small motion nobody drew.",
      code: "Next.js, TypeScript and Postgres, typed end to end and tested where it hurts.",
    },
    {
      n: "04",
      title: "Ship",
      tone: "orchid",
      design: "A last pass with real content, on real devices, at real speed.",
      code: "Previews on every branch and monitoring from day one, so launch day is boring.",
    },
  ],
};

/* --------------------------------------------------------------------------
   10. Contact and footer
   -------------------------------------------------------------------------- */

export const contact = {
  title: "Bring the messy idea. I'll bring back something that works.",
  emailTitle: "Email",
  elsewhere: "Elsewhere",
  availabilityTitle: "Availability",
  backToTop: "Back to top",
};
