import type { Project } from "@/data/content";
import seed from "@/data/projects.json";

/**
 * The single source of truth for projects: `data/projects.json` in the repo,
 * editable from /dashboard. The compiled seed below is only a last-resort
 * fallback for the case where the JSON file is missing or malformed.
 *
 * Reads happen at request time (dynamic rendering), so a save in the dashboard
 * is live on the next page load without a rebuild. Writes happen through the
 * /api/projects routes, which validate the payload before touching the file.
 */

export const COVER_KINDS = ["contours", "halftone", "grid", "type", "waves"] as const;

export type ProjectInput = {
  slug?: string;
  title?: string;
  year?: string;
  blurb?: string;
  role?: string;
  kind?: string;
  colors?: unknown;
  letter?: string;
  image?: string;
  imagePosition?: string;
  video?: string;
  href?: string;
  featured?: boolean;
};

export function slugify(value: string): string {
  return (
    value
      .toLowerCase()
      .normalize("NFKD")
      .replace(/[\u0300-\u036f]/g, "") // strip accents
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "") || "project"
  );
}

export function uniqueSlug(wanted: string, projects: Project[], ignoreSlug?: string): string {
  const base = slugify(wanted);
  if (base === ignoreSlug) return base;
  const taken = new Set(projects.map((p) => p.slug));
  if (!taken.has(base)) return base;
  let n = 2;
  while (taken.has(`${base}-${n}`)) n++;
  return `${base}-${n}`;
}

const HEX = /^#[0-9a-f]{3,8}$/i;

/**
 * Coerce anything into a valid Project, or return an error message.
 * `ignoreSlug` lets an edited project keep its own slug without colliding with itself.
 */
export function sanitizeProject(
  input: ProjectInput,
  existing: Project[],
  ignoreSlug?: string,
): { ok: true; project: Project } | { ok: false; error: string } {
  const title = String(input.title ?? "").trim();
  if (!title) return { ok: false, error: "Title is required." };

  const year = String(input.year ?? "").trim();
  if (!/^\d{4}$/.test(year)) return { ok: false, error: "Year must be a four-digit number, e.g. 2026." };

  const kind = COVER_KINDS.includes(input.kind as Project["kind"]) ? (input.kind as Project["kind"]) : "contours";

  const raw = Array.isArray(input.colors) ? input.colors : [];
  const colors: [string, string, string] = [
    typeof raw[0] === "string" && HEX.test(raw[0]) ? raw[0] : "#15123f",
    typeof raw[1] === "string" && HEX.test(raw[1]) ? raw[1] : "#9bf0ce",
    typeof raw[2] === "string" && HEX.test(raw[2]) ? raw[2] : "#7c73f4",
  ];

  const slug = uniqueSlug(String(input.slug ?? "").trim() || title, existing, ignoreSlug);

  const clean = (v: unknown) => {
    const s = String(v ?? "").trim();
    return s || undefined;
  };
  const image = clean(input.image);
  const video = clean(input.video);

  return {
    ok: true,
    project: {
      slug,
      title,
      year,
      blurb: String(input.blurb ?? "").trim(),
      role: String(input.role ?? "").trim() || "—",
      kind,
      colors,
      ...(kind === "type" ? { letter: (clean(input.letter) ?? title.charAt(0)).toUpperCase().charAt(0) } : {}),
      ...(image ? { image } : {}),
      ...(image && clean(input.imagePosition) ? { imagePosition: clean(input.imagePosition) } : {}),
      ...(video ? { video } : {}),
      href: clean(input.href) ?? "#",
      featured: input.featured === true,
    },
  };
}

/** Newest first, like the site expects. */
function sortProjects(projects: Project[]): Project[] {
  return [...projects].sort((a, b) => b.year.localeCompare(a.year) || a.title.localeCompare(b.title));
}

export async function readProjects(): Promise<Project[]> {
  try {
    const { readFile } = await import("node:fs/promises");
    const path = await import("node:path");
    const file = path.join(process.cwd(), "src", "data", "projects.json");
    const raw = JSON.parse(await readFile(file, "utf8"));
    if (!Array.isArray(raw)) throw new Error("projects.json is not an array");
    return sortProjects(raw as Project[]);
  } catch {
    // Missing or malformed file: fall back to the compiled seed so the site never breaks.
    return sortProjects(seed as Project[]);
  }
}

export async function writeProjects(projects: Project[]): Promise<void> {
  const { writeFile, mkdir } = await import("node:fs/promises");
  const path = await import("node:path");
  const dir = path.join(process.cwd(), "src", "data");
  await mkdir(dir, { recursive: true });
  await writeFile(path.join(dir, "projects.json"), `${JSON.stringify(projects, null, 2)}\n`, "utf8");
}
