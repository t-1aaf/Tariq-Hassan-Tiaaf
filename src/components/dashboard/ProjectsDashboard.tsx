"use client";

import { useMemo, useRef, useState } from "react";
import Link from "next/link";
import type { CoverKind, Project } from "@/data/content";
import Cover from "@/components/ui/Cover";

const KINDS: CoverKind[] = ["contours", "halftone", "grid", "type", "waves"];

const PALETTES: Array<{ name: string; colors: [string, string, string] }> = [
  { name: "Deep sea", colors: ["#0f2436", "#9bf0ce", "#7c73f4"] },
  { name: "Grape", colors: ["#2a1247", "#ffc93c", "#ff6f61"] },
  { name: "Indigo", colors: ["#1b1660", "#7c73f4", "#9bf0ce"] },
  { name: "Vellum", colors: ["#221e5c", "#ffc93c", "#f2a7ff"] },
  { name: "Harbour", colors: ["#08213a", "#9bf0ce", "#7c73f4"] },
  { name: "Dusk", colors: ["#1a1447", "#ffc93c", "#f2a7ff"] },
  { name: "Orchid", colors: ["#2a1247", "#f2a7ff", "#ffc93c"] },
  { name: "Ember", colors: ["#0f2436", "#ffc93c", "#ff6f61"] },
];

type FormState = {
  title: string;
  year: string;
  blurb: string;
  role: string;
  kind: CoverKind;
  palette: number;
  letter: string;
  image: string;
  imagePosition: string;
  video: string;
  href: string;
  featured: boolean;
};

const EMPTY: FormState = {
  title: "",
  year: String(new Date().getFullYear()),
  blurb: "",
  role: "",
  kind: "contours",
  palette: 0,
  letter: "",
  image: "",
  imagePosition: "",
  video: "",
  href: "",
  featured: true,
};

function fromProject(p: Project): FormState {
  const palette = PALETTES.findIndex((c) => c.colors.every((hex, i) => hex.toLowerCase() === p.colors[i]?.toLowerCase()));
  return {
    title: p.title,
    year: p.year,
    blurb: p.blurb,
    role: p.role === "—" ? "" : p.role,
    kind: p.kind,
    palette: palette === -1 ? 0 : palette,
    letter: p.letter ?? "",
    image: p.image ?? "",
    imagePosition: p.imagePosition ?? "",
    video: p.video ?? "",
    href: p.href === "#" ? "" : p.href,
    featured: p.featured,
  };
}

function toPayload(f: FormState) {
  return {
    title: f.title,
    year: f.year,
    blurb: f.blurb,
    role: f.role,
    kind: f.kind,
    colors: PALETTES[f.palette]?.colors,
    letter: f.kind === "type" ? f.letter : undefined,
    image: f.image,
    imagePosition: f.imagePosition,
    video: f.video,
    href: f.href,
    featured: f.featured,
  };
}

/** The form, previewed as it will look in the gallery. */
function Preview({ f }: { f: FormState }) {
  const colors = (PALETTES[f.palette] ?? PALETTES[0]).colors;
  return (
    <div className="dash__preview">
      <div className="dash__preview-stage">
        <Cover
          kind={f.kind}
          colors={colors}
          letter={(f.letter || f.title.charAt(0) || "A").toUpperCase().charAt(0)}
          image={f.image || undefined}
          video={f.video || undefined}
          imagePosition={f.imagePosition || undefined}
        />
        <h3 className="dash__preview-title">{f.title || "Untitled"}</h3>
      </div>
      <p className="dash__preview-meta">
        <strong>{f.year}</strong>
        <span>{f.role || "Role"}</span>
      </p>
      <p className="dash__preview-blurb">{f.blurb || "One sentence about the work."}</p>
    </div>
  );
}

export default function ProjectsDashboard({ initialProjects }: { initialProjects: Project[] }) {
  const [projects, setProjects] = useState<Project[]>(initialProjects);
  const [form, setForm] = useState<FormState>(EMPTY);
  const [editingSlug, setEditingSlug] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [savedFlash, setSavedFlash] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  const editing = useMemo(() => projects.find((p) => p.slug === editingSlug) ?? null, [projects, editingSlug]);
  const set = <K extends keyof FormState>(key: K, value: FormState[K]) => setForm((f) => ({ ...f, [key]: value }));

  const reset = () => {
    setForm(EMPTY);
    setEditingSlug(null);
    setError(null);
    formRef.current?.reset();
  };

  const flash = () => {
    setSavedFlash(true);
    window.setTimeout(() => setSavedFlash(false), 2200);
  };

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (busy) return;
    setBusy(true);
    setError(null);
    try {
      const res = await fetch(editing ? `/api/projects/${editing.slug}` : "/api/projects", {
        method: editing ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(toPayload(form)),
      });
      const data = (await res.json()) as { projects?: Project[]; error?: string };
      if (!res.ok) throw new Error(data.error ?? "Something went wrong.");
      setProjects(data.projects ?? []);
      reset();
      flash();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setBusy(false);
    }
  }

  async function remove(slug: string) {
    if (busy) return;
    setBusy(true);
    setError(null);
    try {
      const res = await fetch(`/api/projects/${slug}`, { method: "DELETE" });
      const data = (await res.json()) as { projects?: Project[]; error?: string };
      if (!res.ok) throw new Error(data.error ?? "Something went wrong.");
      setProjects(data.projects ?? []);
      if (editingSlug === slug) reset();
      flash();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setBusy(false);
    }
  }

  function startEdit(p: Project) {
    setEditingSlug(p.slug);
    setForm(fromProject(p));
    setError(null);
    formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  return (
    <div className="dash">
      <header className="dash__top">
        <p className="dash__kicker">Portfolio admin</p>
        <h1 className="dash__title">Works</h1>
        <p className="dash__sub">
          {projects.length} {projects.length === 1 ? "work" : "works"}, newest first. Saves are live on the site —
          no rebuild, no deploy.{" "}
          <Link href="/" className="dash__home">
            View site →
          </Link>
        </p>
      </header>

      <div className="dash__grid">
        {/* ------- form ------- */}
        <form className="dash__form" ref={formRef} onSubmit={submit}>
          <h2 className="dash__form-title">{editing ? `Edit “${editing.title}”` : "Add a work"}</h2>

          <label className="dash__field">
            <span>Title *</span>
            <input value={form.title} onChange={(e) => set("title", e.target.value)} required placeholder="Fieldnote" />
          </label>

          <div className="dash__row">
            <label className="dash__field">
              <span>Year *</span>
              <input value={form.year} onChange={(e) => set("year", e.target.value)} required inputMode="numeric" pattern="\d{4}" placeholder="2026" />
            </label>
            <label className="dash__field dash__field--check">
              <span>
                <input type="checkbox" checked={form.featured} onChange={(e) => set("featured", e.target.checked)} />
                Featured (in the big gallery)
              </span>
            </label>
          </div>

          <label className="dash__field">
            <span>One-line blurb</span>
            <input value={form.blurb} onChange={(e) => set("blurb", e.target.value)} placeholder="Offline-first notes for researchers who work where the signal doesn't." />
          </label>

          <label className="dash__field">
            <span>Your role</span>
            <input value={form.role} onChange={(e) => set("role", e.target.value)} placeholder="Product design, front-end" />
          </label>

          <label className="dash__field">
            <span>Link (href)</span>
            <input value={form.href} onChange={(e) => set("href", e.target.value)} placeholder="https://…" />
          </label>

          <fieldset className="dash__field">
            <legend>Cover</legend>
            <div className="dash__kinds" role="group" aria-label="Cover style">
              {KINDS.map((k) => (
                <button
                  key={k}
                  type="button"
                  className={form.kind === k ? "is-on" : undefined}
                  onClick={() => set("kind", k)}
                  aria-pressed={form.kind === k}
                >
                  {k}
                </button>
              ))}
            </div>
            <div className="dash__palettes" role="group" aria-label="Cover colours">
              {PALETTES.map((c, i) => (
                <button
                  key={c.name}
                  type="button"
                  title={c.name}
                  className={form.palette === i ? "is-on" : undefined}
                  aria-pressed={form.palette === i}
                  onClick={() => set("palette", i)}
                >
                  <i style={{ background: c.colors[0] }} />
                  <i style={{ background: c.colors[1] }} />
                  <i style={{ background: c.colors[2] }} />
                </button>
              ))}
            </div>
            {form.kind === "type" && (
              <label className="dash__field dash__field--inline">
                <span>Letter</span>
                <input value={form.letter} onChange={(e) => set("letter", e.target.value)} maxLength={1} placeholder={form.title.charAt(0) || "A"} />
              </label>
            )}
            <p className="dash__hint">
              No image? The cover is generated from the style and colours above.
            </p>
          </fieldset>

          <label className="dash__field">
            <span>Image (path in /public, optional)</span>
            <input value={form.image} onChange={(e) => set("image", e.target.value)} placeholder="/projects/my-shot.webp" />
          </label>

          {form.image && (
            <label className="dash__field">
              <span>Image focus (object-position)</span>
              <input value={form.imagePosition} onChange={(e) => set("imagePosition", e.target.value)} placeholder="center top" />
            </label>
          )}

          <label className="dash__field">
            <span>Video (path in /public, optional)</span>
            <input value={form.video} onChange={(e) => set("video", e.target.value)} placeholder="/projects/loop.mp4" />
          </label>

          {error && (
            <p className="dash__error" role="alert">
              {error}
            </p>
          )}

          <div className="dash__actions">
            <button type="submit" className="dash__save" disabled={busy || !form.title.trim()}>
              {busy ? "Saving…" : editing ? "Save changes" : "Add work"}
            </button>
            {editing && (
              <button type="button" className="dash__ghost" onClick={reset} disabled={busy}>
                Cancel
              </button>
            )}
            {savedFlash && <span className="dash__saved">Saved — live on the site</span>}
          </div>
        </form>

        {/* ------- live preview ------- */}
        <Preview f={form} />

        {/* ------- list ------- */}
        <ul className="dash__list">
          {projects.map((p) => (
            <li key={p.slug} className={editingSlug === p.slug ? "is-editing" : undefined}>
              <div className="dash__thumb">
                <Cover kind={p.kind} colors={p.colors} letter={p.letter} image={p.image} video={p.video} imagePosition={p.imagePosition} />
              </div>
              <div className="dash__item">
                <p className="dash__item-title">
                  {p.title}
                  {p.featured && <em>featured</em>}
                </p>
                <p className="dash__item-sub">
                  {p.year} · {p.role} · <code>/{p.slug}</code>
                </p>
              </div>
              <div className="dash__item-actions">
                <button type="button" onClick={() => startEdit(p)} disabled={busy}>
                  Edit
                </button>
                <button type="button" className="dash__danger" onClick={() => remove(p.slug)} disabled={busy}>
                  Delete
                </button>
              </div>
            </li>
          ))}
          {projects.length === 0 && <li className="dash__empty">Nothing here yet — add your first work.</li>}
        </ul>
      </div>
    </div>
  );
}
