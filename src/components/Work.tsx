"use client";

import { useRef } from "react";
import { gsap, useScope } from "@/lib/gsap";
import { work } from "@/data/content";
import type { Project } from "@/data/content";
import { prefersReducedMotion } from "@/lib/anim";
import Cover from "@/components/ui/Cover";

const pad2 = (n: number) => String(n).padStart(2, "0");

/**
 * Pinned horizontal gallery. Vertical scroll drives the track sideways; inside every
 * card the artwork and the title drift at different speeds, which is what gives it depth.
 */
export default function Work({ projects }: { projects: Project[] }) {
  const featured = projects.filter((p) => p.featured);
  const root = useRef<HTMLElement>(null);
  const track = useRef<HTMLDivElement>(null);

  useScope(root, (safe) => {
    const section = root.current;
    const tr = track.current;
    if (!section || !tr || prefersReducedMotion()) return;

    const n = featured.length;
    const ghost = section.querySelector<HTMLElement>(".work__ghost-in");
    const counter = section.querySelector<HTMLElement>("[data-current]");
    const segments = Array.from(section.querySelectorAll<HTMLElement>(".work__seg i"));
    const distance = () => Math.max(0, tr.offsetWidth - window.innerWidth);

    let current = -1;
    const update = safe((p: number) => {
      segments.forEach((seg, i) => {
        seg.style.transform = `scaleX(${gsap.utils.clamp(0, 1, p * n - i)})`;
      });
      const idx = Math.min(n - 1, Math.round(p * (n - 1)));
      if (idx === current) return;
      current = idx;
      if (counter) counter.textContent = pad2(idx + 1);
      if (ghost) gsap.to(ghost, { yPercent: -(100 / n) * idx, duration: 0.8, ease: "expo.out", overwrite: true });
    });

    const slide = gsap.to(tr, {
      x: () => -distance(),
      ease: "none",
      scrollTrigger: {
        trigger: section,
        start: "top top",
        end: () => `+=${distance()}`,
        pin: true,
        scrub: true,
        anticipatePin: 1,
        invalidateOnRefresh: true,
        onUpdate: (self) => update(self.progress),
      },
    });

    // Parallax inside each card, measured against the horizontal tween
    const drift = (trigger: Element) => ({
      trigger,
      containerAnimation: slide,
      start: "left right",
      end: "right left",
      scrub: true,
    });
    section.querySelectorAll<HTMLElement>(".card").forEach((card) => {
      const media = card.querySelector<HTMLElement>(".card__media-in");
      const title = card.querySelector<HTMLElement>(".card__title");
      if (media) gsap.fromTo(media, { xPercent: -6 }, { xPercent: 6, ease: "none", scrollTrigger: drift(card) });
      if (title) gsap.fromTo(title, { xPercent: 10 }, { xPercent: -10, ease: "none", scrollTrigger: drift(card) });
    });

    update(0);
  });

  return (
    <section className="work" id="work" ref={root} data-theme="dark" data-section="Work">
      <div className="work__ghost" aria-hidden="true">
        <div className="work__ghost-in">
          {featured.map((p, i) => (
            <span key={p.slug}>{pad2(i + 1)}</span>
          ))}
        </div>
      </div>

      <header className="work__head">
        <h2 className="work__title">{work.title}</h2>
        <p className="work__count">
          <span data-current>01</span> {work.of} {pad2(featured.length)}
        </p>
      </header>

      <div className="work__stage">
        <div className="work__track" ref={track}>
          {featured.map((p) => (
            <article className="card" key={p.slug}>
              <a className="card__link" href={p.href} data-cursor="view">
                <div className="card__stage">
                  <div className="card__media">
                    <div className="card__media-in">
                      <Cover kind={p.kind} colors={p.colors} letter={p.letter} image={p.image} video={p.video} imagePosition={p.imagePosition} />
                    </div>
                  </div>
                  <h3 className="card__title">{p.title}</h3>
                </div>
                <div className="card__meta">
                  <p className="card__facts">
                    <strong>{p.year}</strong>
                    <span>{p.role}</span>
                  </p>
                  <p className="card__blurb">{p.blurb}</p>
                  <span className="card__cta">{work.cta}</span>
                </div>
              </a>
            </article>
          ))}
        </div>
      </div>

      <div className="work__progress" aria-hidden="true">
        {featured.map((p) => (
          <span className="work__seg" key={p.slug}>
            <i />
          </span>
        ))}
      </div>
    </section>
  );
}
