/**
 * ✏️  EDIT ME
 * Everything you read on the site comes from this file: your name, copy,
 * projects, process and stats. All of it is placeholder content, so swap it out.
 *
 * To use real images or video instead of the generated covers, drop files in
 * /public and add `image: "/my-shot.jpg"` or `video: "/my-loop.mp4"` to a project.
 */

export type CoverKind = "contours" | "halftone" | "grid" | "type" | "waves";

export type Project = {
  slug: string;
  title: string;
  year: string;
  blurb: string;
  role: string;
  stack: string;
  kind: CoverKind;
  /** [background, primary, secondary] */
  colors: [string, string, string];
  /** Big letter for the "type" cover */
  letter?: string;
  image?: string;
  video?: string;
  href: string;
  /** Featured projects appear in the horizontal gallery. Everything appears in the index. */
  featured: boolean;
};

export const site = {
  name: "Rowan Vale",
  initials: "RV",
  role: "Designer and full-stack developer",
  description:
    "Rowan Vale is a designer and full-stack developer who takes products from first sketch to production code.",
  email: "hello@rowanvale.com",
  intro:
    "Product designer and full-stack developer. I take an idea from first sketch to production code, so nothing gets lost in a handoff.",
  /** The same intro, rewritten as comments for the "inspect" layer of the hero */
  introComments: [
    "Product designer + full-stack developer.",
    "First sketch to production code.",
    "No handoff in between.",
  ],
  availability: "Open for new projects",
  availabilityNote: "Booking from January",
  heroBadge: "Open for new projects + Say hello + ",
  aboutBadge: "Designer + developer + one person + ",
  aboutText:
    "Nine years of making software that looks like someone cared and runs like someone tested it.",
  /** Path in /public, e.g. "/me.jpg". Leave empty to show your initials. */
  portrait: "",
  /** Path in /public, e.g. "/reel.mp4". Leave empty to show the generated loop. */
  reel: "",
  socials: [
    { label: "GitHub", href: "https://github.com/" },
    { label: "Dribbble", href: "https://dribbble.com/" },
    { label: "LinkedIn", href: "https://www.linkedin.com/" },
    { label: "Instagram", href: "https://www.instagram.com/" },
  ],
};

/** Side index + scroll-spy. `id` must match a section id on the page. */
export const sections = [
  { id: "top", label: "Intro" },
  { id: "work", label: "Work" },
  { id: "about", label: "About" },
  { id: "process", label: "Process" },
  { id: "contact", label: "Contact" },
];

export const navLinks = [
  { id: "work", label: "Work" },
  { id: "about", label: "About" },
  { id: "process", label: "Process" },
];

/**
 * The manifesto. {wave} {grid} {orb} {bars} drop a small animated chip into the sentence.
 */
export const manifesto =
  "I'm a designer {wave} who can't stop opening the inspector, and a developer {grid} who can't stop nudging things two pixels left. I take products from first sketch {orb} to production code, {bars} so nothing gets lost in the handoff. Because there isn't one.";

export const projects: Project[] = [
  {
    slug: "fieldnote",
    title: "Fieldnote",
    year: "2026",
    blurb: "Offline-first notes for researchers who work where the signal doesn't.",
    role: "Product design, front-end, API",
    stack: "Next.js, Postgres, tRPC",
    kind: "contours",
    colors: ["#0f2436", "#9bf0ce", "#7c73f4"],
    href: "#",
    featured: true,
  },
  {
    slug: "halcyon",
    title: "Halcyon",
    year: "2025",
    blurb: "A booking flow that turned a nine-step form into three screens.",
    role: "UX, brand, e-commerce",
    stack: "Next.js, Stripe",
    kind: "halftone",
    colors: ["#2a1247", "#ffc93c", "#ff6f61"],
    href: "#",
    featured: true,
  },
  {
    slug: "kiln",
    title: "Kiln",
    year: "2025",
    blurb: "A design system shipped as tokens and 60 components to 14 product teams.",
    role: "Design system, engineering",
    stack: "React, TypeScript, Storybook",
    kind: "grid",
    colors: ["#1b1660", "#7c73f4", "#9bf0ce"],
    href: "#",
    featured: true,
  },
  {
    slug: "marrow",
    title: "Marrow",
    year: "2025",
    blurb: "An architecture studio's website that reads like a printed monograph.",
    role: "Art direction, front-end",
    stack: "Next.js, GSAP",
    kind: "type",
    colors: ["#221e5c", "#ffc93c", "#f2a7ff"],
    letter: "M",
    href: "#",
    featured: true,
  },
  {
    slug: "tidewater",
    title: "Tidewater",
    year: "2024",
    blurb: "A live port dashboard that tracks 1,200 containers without a loading spinner.",
    role: "Product design, full-stack",
    stack: "Next.js, WebSockets, Postgres",
    kind: "waves",
    colors: ["#08213a", "#9bf0ce", "#7c73f4"],
    href: "#",
    featured: true,
  },
  {
    slug: "pilot",
    title: "Pilot",
    year: "2024",
    blurb: "Onboarding for a flight-training app.",
    role: "Product design",
    stack: "React Native",
    kind: "contours",
    colors: ["#1a1447", "#ffc93c", "#f2a7ff"],
    href: "#",
    featured: false,
  },
  {
    slug: "ledgerline",
    title: "Ledgerline",
    year: "2024",
    blurb: "Reconciliation tools for a small-business ledger.",
    role: "Design, front-end",
    stack: "React, TypeScript",
    kind: "grid",
    colors: ["#2a1247", "#f2a7ff", "#ffc93c"],
    href: "#",
    featured: false,
  },
  {
    slug: "oddjob",
    title: "Oddjob",
    year: "2023",
    blurb: "A job board with a personality.",
    role: "Brand, full-stack",
    stack: "Next.js, Postgres",
    kind: "type",
    colors: ["#0f2436", "#9bf0ce", "#ffc93c"],
    letter: "O",
    href: "#",
    featured: false,
  },
  {
    slug: "sundial",
    title: "Sundial",
    year: "2023",
    blurb: "A weather-based wardrobe planner.",
    role: "App design",
    stack: "Swift",
    kind: "halftone",
    colors: ["#1b1660", "#9bf0ce", "#7c73f4"],
    href: "#",
    featured: false,
  },
  {
    slug: "common-room",
    title: "Common Room",
    year: "2022",
    blurb: "A community platform for a design school.",
    role: "Full-stack",
    stack: "Rails, Hotwire",
    kind: "waves",
    colors: ["#221e5c", "#ffc93c", "#ff6f61"],
    href: "#",
    featured: false,
  },
];

export const stages = [
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
];

export const marquee = {
  design: ["Interface design", "Design systems", "Brand identity", "Motion", "Prototyping"],
  code: ["Next.js", "TypeScript", "Node", "Postgres", "WebGL", "GSAP"],
};

export const tools = {
  design: ["Figma", "Framer", "Blender"],
  code: ["Next.js", "TypeScript", "Node", "Postgres", "GSAP", "WebGL"],
};

export const stats = [
  { value: 9, label: "years shipping product", tone: "mint" },
  { value: 63, label: "products launched", tone: "lilac" },
];

export const contactTitle = "Bring the messy idea. I'll bring back something that works.";
