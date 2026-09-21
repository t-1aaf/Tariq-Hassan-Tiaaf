"use client";

import { useRef, type CSSProperties } from "react";
import { gsap, useScope } from "@/lib/gsap";
import { about, site } from "@/data/content";
import { prefersReducedMotion, revealHeadings } from "@/lib/anim";
import Badge from "@/components/ui/Badge";
import Magnetic from "@/components/ui/Magnetic";
import Words from "@/components/ui/Words";

/** Where each tile starts, as "x,y,rotation": they fly in and lock into the grid as you scroll. */
const FROM = {
  about: "-140,90,-4",
  reel: "20,160,3",
  stat0: "150,-40,5",
  stat1: "170,120,-4",
  tools: "-90,170,4",
  open: "130,180,-5",
};

const orbits = [
  { s: "36cqmin", t: "16s", c: "var(--sun)" },
  { s: "66cqmin", t: "26s", c: "var(--mint)" },
  { s: "98cqmin", t: "38s", c: "var(--orchid)" },
];

/**
 * The bento: introduction, a looping motion study, numbers, toolbox and availability.
 * Tiles assemble from scattered positions while the section scrolls in.
 */
export default function About() {
  const root = useRef<HTMLElement>(null);

  useScope(root, () => {
    const section = root.current;
    if (!section) return;
    revealHeadings(section);
    if (prefersReducedMotion()) return;

    // Numbers count up once
    section.querySelectorAll<HTMLElement>("[data-count-to]").forEach((el) => {
      const to = Number(el.dataset.countTo);
      const o = { v: 0 };
      el.textContent = "0";
      gsap.to(o, {
        v: to,
        duration: 1.8,
        ease: "power3.out",
        onUpdate: () => {
          el.textContent = String(Math.round(o.v));
        },
        scrollTrigger: { trigger: el, start: "top 92%", once: true },
      });
    });

    // Tiles assemble
    const grid = section.querySelector(".bento");
    if (!grid) return;
    const k = Math.min(1, window.innerWidth / 1440);
    section.querySelectorAll<HTMLElement>(".tile[data-from]").forEach((tile) => {
      const [x, y, r] = (tile.dataset.from ?? "0,0,0").split(",").map(Number);
      gsap.from(tile, {
        x: x * k,
        y: y * k,
        rotate: r,
        scale: 0.94,
        ease: "power2.out",
        scrollTrigger: { trigger: grid, start: "top 92%", end: "top 28%", scrub: 0.6 },
      });
    });
  });

  return (
    <section className="about" id="about" ref={root} data-theme="light" data-section="About">
      <div className="bento">
        {/* Introduction */}
        <div className="tile tile--about" data-from={FROM.about}>
          <p className="about__chip">
            <i className="dot" />
            {about.chip}
          </p>
          <div className="about__portrait">
            {site.portrait ? <img src={site.portrait} alt={site.name} /> : <span>{site.initials}</span>}
          </div>
          <div>
            <h3 className="about__name">
              <small>{about.greeting}</small>
              <strong>{site.name}</strong>
            </h3>
            <p className="about__text">{about.text}</p>
          </div>
          <div className="about__foot">
            <a className="pill pill--ink" href={`mailto:${site.email}`}>
              {site.email}
            </a>
            <Badge className="about__badge" text={about.badge} />
          </div>
        </div>

        {/* Title */}
        <div className="tile tile--title">
          <Words as="h2" className="about__title" text={about.title} />
        </div>

        {/* Motion study */}
        <div className="tile tile--reel" data-from={FROM.reel}>
          {site.reel ? (
            <video className="reel__video" src={site.reel} autoPlay muted loop playsInline />
          ) : (
            <div className="orbit" aria-hidden="true">
              {orbits.map((o) => (
                <i key={o.s} style={{ "--s": o.s, "--t": o.t, "--c": o.c } as CSSProperties} />
              ))}
              <b />
            </div>
          )}
          <div className="tile__cap">
            <h3>{about.reel.title}</h3>
            <p>{about.reel.text}</p>
          </div>
        </div>

        {/* Numbers */}
        <div className="stats">
          {about.stats.map((s, i) => (
            <div className={`tile tile--stat tile--${s.tone}`} key={s.label} data-from={i === 0 ? FROM.stat0 : FROM.stat1}>
              <span className="stat__n">
                <span data-count-to={s.value}>{s.value}</span>
              </span>
              <span className="stat__l">{s.label}</span>
            </div>
          ))}
        </div>

        {/* Toolbox */}
        <div className="tile tile--tools" data-from={FROM.tools}>
          <h3 className="tile__h">{about.toolboxTitle}</h3>
          <ul className="pills">
            {about.tools.design.map((t) => (
              <li className="pill pill--design" key={t}>
                {t}
              </li>
            ))}
            {about.tools.code.map((t) => (
              <li className="pill pill--code" key={t}>
                {t}
              </li>
            ))}
          </ul>
        </div>

        {/* Availability */}
        <div className="tile tile--open" data-from={FROM.open}>
          <p className="open__status">
            <i className="dot" />
            {site.availability}
          </p>
          <p className="open__note">
            {site.availabilityNote}. {about.open.note}
          </p>
          <Magnetic>
            <a className="pill pill--ink" href="#contact">
              {about.open.cta}
            </a>
          </Magnetic>
          <div className="orb" aria-hidden="true">
            <i />
          </div>
        </div>
      </div>
    </section>
  );
}
