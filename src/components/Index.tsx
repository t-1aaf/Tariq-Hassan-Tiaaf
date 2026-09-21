"use client";

import { useRef } from "react";
import { gsap, useScope } from "@/lib/gsap";
import { archive } from "@/data/content";
import type { Project } from "@/data/content";
import { isFinePointer, revealHeadings } from "@/lib/anim";
import Cover from "@/components/ui/Cover";
import Words from "@/components/ui/Words";

/**
 * Every project in one list. Hover a row and a preview of that project follows the pointer,
 * tilting slightly with the pointer's speed.
 */
export default function Index({ projects }: { projects: Project[] }) {
  const root = useRef<HTMLElement>(null);
  const preview = useRef<HTMLDivElement>(null);

  useScope(root, (safe) => {
    const section = root.current;
    const pv = preview.current;
    if (!section || !pv) return;
    revealHeadings(section);
    if (!isFinePointer()) return;

    const list = section.querySelector<HTMLElement>(".idx__list");
    if (!list) return;
    const rows = Array.from(section.querySelectorAll<HTMLElement>(".idx__row"));
    const items = Array.from(pv.querySelectorAll<HTMLElement>(".idx__pv"));

    gsap.set(pv, { xPercent: -50, yPercent: -50, scale: 0.6, opacity: 0 });
    const xTo = gsap.quickTo(pv, "x", { duration: 0.5, ease: "power3" });
    const yTo = gsap.quickTo(pv, "y", { duration: 0.5, ease: "power3" });
    const rTo = gsap.quickTo(pv, "rotation", { duration: 0.6, ease: "power3" });
    let lastX = 0;
    const settle = gsap.delayedCall(0.08, () => rTo(0)).pause();

    const move = (e: PointerEvent) => {
      xTo(e.clientX);
      yTo(e.clientY);
      rTo(gsap.utils.clamp(-9, 9, (e.clientX - lastX) * 0.35));
      lastX = e.clientX;
      settle.restart(true);
    };
    const enterRow = safe((i: number) => {
      gsap.to(items, { opacity: (k: number) => (k === i ? 1 : 0), duration: 0.25, overwrite: "auto" });
      gsap.to(pv, { scale: 1, opacity: 1, duration: 0.5, ease: "expo.out", overwrite: "auto" });
    });
    const leaveList = safe(() => {
      gsap.to(pv, { scale: 0.6, opacity: 0, duration: 0.35, ease: "power3.in", overwrite: "auto" });
    });

    const handlers = rows.map((row, i) => {
      const fn = () => enterRow(i);
      row.addEventListener("pointerenter", fn);
      return fn;
    });
    list.addEventListener("pointermove", move);
    list.addEventListener("pointerleave", leaveList);

    return () => {
      rows.forEach((row, i) => row.removeEventListener("pointerenter", handlers[i]));
      list.removeEventListener("pointermove", move);
      list.removeEventListener("pointerleave", leaveList);
    };
  });

  return (
    <section className="idx" id="index" ref={root} data-theme="light" data-section="Work">
      <header className="idx__head">
        <Words as="h2" className="idx__title" text={archive.title} />
        <p className="idx__note">{archive.note.replace("{count}", String(projects.length))}</p>
      </header>

      <ul className="idx__list">
        {projects.map((p) => (
          <li key={p.slug}>
            <a className="idx__row" href={p.href}>
              <span className="idx__year">{p.year}</span>
              <span className="idx__name">{p.title}</span>
              <span className="idx__role">{p.role}</span>
            </a>
          </li>
        ))}
      </ul>

      <div className="idx__preview" ref={preview} aria-hidden="true">
        {projects.map((p) => (
          <div className="idx__pv" key={p.slug}>
            <Cover kind={p.kind} colors={p.colors} letter={p.letter} image={p.image} video={p.video} imagePosition={p.imagePosition} />
          </div>
        ))}
      </div>
    </section>
  );
}
