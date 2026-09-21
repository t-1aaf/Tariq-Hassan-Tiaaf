"use client";

import { useRef } from "react";
import { gsap, useScope } from "@/lib/gsap";
import { marquee } from "@/data/content";
import { prefersReducedMotion } from "@/lib/anim";
import { scrollVelocity } from "@/lib/scroll";

function Star() {
  return (
    <svg className="mq__star" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M12 0 14.2 9.8 24 12 14.2 14.2 12 24 9.8 14.2 0 12 9.8 9.8Z" />
    </svg>
  );
}

function Row({ items, className }: { items: string[]; className: string }) {
  const set = items.map((text) => (
    <span className="mq__item" key={text}>
      {text}
      <Star />
    </span>
  ));
  return (
    <div className={`mq__row ${className}`}>
      <div className="mq__track">
        <div className="mq__set">{set}</div>
        <div className="mq__set" aria-hidden="true">
          {set}
        </div>
      </div>
    </div>
  );
}

/**
 * Two rows of type in opposite directions. Design words are set in the grotesk,
 * code words in the monospace. Scrolling speeds them up and skews the whole band.
 */
export default function Marquee() {
  const root = useRef<HTMLElement>(null);

  useScope(root, () => {
    const section = root.current;
    if (!section || prefersReducedMotion()) return;
    const tracks = Array.from(section.querySelectorAll<HTMLElement>(".mq__track"));
    const inner = section.querySelector<HTMLElement>(".mq__inner");
    if (!inner) return;

    const tweens = tracks.map((track, i) =>
      gsap.fromTo(
        track,
        { xPercent: i % 2 ? -50 : 0 },
        { xPercent: i % 2 ? 0 : -50, duration: i % 2 ? 46 : 38, ease: "none", repeat: -1 },
      ),
    );
    const setSkew = gsap.quickSetter(inner, "skewX", "deg");
    let boost = 0;
    let skew = 0;

    const tick = () => {
      const v = scrollVelocity();
      boost += (Math.min(Math.abs(v), 40) - boost) * 0.08;
      skew += (gsap.utils.clamp(-7, 7, -v * 0.22) - skew) * 0.1;
      tweens.forEach((tw) => tw.timeScale(1 + boost * 0.3));
      setSkew(skew);
    };
    gsap.ticker.add(tick);
    return () => gsap.ticker.remove(tick);
  });

  return (
    <section className="mq" ref={root} data-theme="light" data-section="About" aria-label="Disciplines">
      <div className="mq__inner">
        <Row items={marquee.design} className="mq__row--design" />
        <Row items={marquee.code} className="mq__row--code" />
      </div>
    </section>
  );
}
