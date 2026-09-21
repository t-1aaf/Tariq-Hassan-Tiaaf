"use client";

import { useRef, type CSSProperties, type ReactNode } from "react";
import { gsap, useScope } from "@/lib/gsap";
import { approach } from "@/data/content";
import { prefersReducedMotion, revealHeadings } from "@/lib/anim";
import Words from "@/components/ui/Words";

/** One line drawing per stage. Every shape carries pathLength=1 so it can be "drawn" by scroll. */
const art: ReactNode[] = [
  // 01 Sketch: a rough wireframe
  <>
    <path data-draw pathLength={1} d="M52 64 L348 58 L354 338 L46 344 Z" />
    <path data-draw pathLength={1} d="M52 108 L350 104" />
    <path data-draw pathLength={1} d="M86 152 C120 138 180 164 214 148" />
    <path data-draw pathLength={1} d="M86 192 L300 188" />
    <path data-draw pathLength={1} d="M86 220 L262 218" />
    <rect data-draw pathLength={1} x="86" y="256" width="110" height="52" rx="10" />
    <circle data-draw pathLength={1} cx="296" cy="282" r="26" />
  </>,
  // 02 Prototype: two shapes, a connector and a cursor
  <>
    <rect data-draw pathLength={1} x="60" y="80" width="170" height="170" rx="30" />
    <circle data-draw pathLength={1} cx="268" cy="262" r="62" />
    <path data-draw pathLength={1} d="M230 165 C262 165 268 190 268 200" />
    <path data-draw pathLength={1} d="M296 96 L296 176 L318 156 L336 198 L354 190 L336 150 L364 146 Z" />
    <path data-draw pathLength={1} d="M90 300 L210 300" />
  </>,
  // 03 Build: angle brackets and a slash
  <>
    <path data-draw pathLength={1} d="M150 110 L64 200 L150 290" />
    <path data-draw pathLength={1} d="M250 110 L336 200 L250 290" />
    <path data-draw pathLength={1} d="M226 92 L174 308" />
    <path data-draw pathLength={1} d="M64 342 L336 342" />
  </>,
  // 04 Ship: a paper plane leaving a trail
  <>
    <path data-draw pathLength={1} d="M52 196 L348 64 L262 330 L200 250 Z" />
    <path data-draw pathLength={1} d="M348 64 L200 250" />
    <path data-draw pathLength={1} d="M200 250 L190 318 L232 282" />
    <path data-draw pathLength={1} d="M40 304 C90 304 120 274 150 284" />
    <path data-draw pathLength={1} d="M64 348 C100 348 120 330 140 336" />
  </>,
];

/**
 * Four stages that stack like sheets of paper. Each has a design half (set in the grotesk)
 * and a code half (set in the monospace). The art draws itself as the card arrives.
 */
export default function Process() {
  const root = useRef<HTMLElement>(null);

  useScope(root, () => {
    const section = root.current;
    if (!section) return;
    revealHeadings(section);
    if (prefersReducedMotion()) return;

    const cards = Array.from(section.querySelectorAll<HTMLElement>(".stage"));
    cards.forEach((card, i) => {
      gsap.fromTo(
        card.querySelectorAll("[data-draw]"),
        { strokeDashoffset: 1.02 },
        {
          strokeDashoffset: 0,
          ease: "none",
          stagger: 0.12,
          scrollTrigger: { trigger: card, start: "top 88%", end: "top 30%", scrub: true },
        },
      );

      if (i === 0) return;
      // As this card covers the previous one, the previous one steps back
      const prev = cards[i - 1];
      const scrollTrigger = {
        trigger: card,
        start: "top bottom",
        end: () => `top ${getComputedStyle(card).top}`,
        scrub: true,
      };
      gsap.to(prev, { scale: 0.94, transformOrigin: "50% 0%", ease: "none", scrollTrigger });
      const shade = prev.querySelector(".stage__shade");
      if (shade) gsap.to(shade, { opacity: 0.38, ease: "none", scrollTrigger });
    });
  });

  return (
    <section className="process" id="process" ref={root} data-theme="dark" data-section="Process">
      <header className="process__head">
        <Words as="h2" className="process__title" text={approach.title} />
        <p className="process__lede">{approach.lede}</p>
      </header>

      <div className="process__stack">
        {approach.stages.map((s, i) => (
          <article className={`stage stage--${s.tone}`} key={s.n} style={{ "--i": i } as CSSProperties}>
            <div className="stage__main">
              <span className="stage__num">{s.n}</span>
              <div>
                <h3 className="stage__title">{s.title}</h3>
                <div className="stage__cols">
                  <div>
                    <h4 className="is-design">{approach.designLabel}</h4>
                    <p>{s.design}</p>
                  </div>
                  <div>
                    <h4 className="is-code">{approach.codeLabel}</h4>
                    <p>{s.code}</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="stage__art" aria-hidden="true">
              <svg className="stage__svg" viewBox="0 0 400 400" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
                {art[i]}
              </svg>
            </div>
            <span className="stage__shade" />
          </article>
        ))}
      </div>
    </section>
  );
}
