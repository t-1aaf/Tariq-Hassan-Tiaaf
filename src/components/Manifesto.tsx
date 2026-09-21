"use client";

import { Fragment, useRef } from "react";
import { gsap, useScope } from "@/lib/gsap";
import { manifesto } from "@/data/content";
import { prefersReducedMotion, revealHeadings } from "@/lib/anim";
import Words from "@/components/ui/Words";

type Token = { type: "word"; text: string } | { type: "chip"; kind: string };

/** "some words {orb} more words" -> words and chips, in order */
function parse(src: string): Token[] {
  const out: Token[] = [];
  src.split(/(\{[a-z]+\})/).forEach((part) => {
    const chip = part.match(/^\{([a-z]+)\}$/);
    if (chip) out.push({ type: "chip", kind: chip[1] });
    else
      part
        .split(/\s+/)
        .filter(Boolean)
        .forEach((text) => out.push({ type: "word", text }));
  });
  return out;
}

const Bits = () => (
  <>
    <i />
    <i />
    <i />
    <i />
    <i />
  </>
);

/** Words and chips that light up one by one as you scroll. */
function Inline({ text }: { text: string }) {
  return (
    <>
      {parse(text).map((t, i) => (
        <Fragment key={i}>
          {t.type === "word" ? (
            <span className="mf-item">{t.text}</span>
          ) : (
            <span className={`mf-item chip chip--${t.kind}`} aria-hidden="true">
              <Bits />
            </span>
          )}{" "}
        </Fragment>
      ))}
    </>
  );
}

/**
 * Three clear steps instead of one long paragraph:
 *  1. Designer / Developer, side by side (grotesk vs monospace, same rule as the hero)
 *  2. A rule that draws itself across the page
 *  3. The one sentence that ties them together
 */
export default function Manifesto() {
  const root = useRef<HTMLElement>(null);

  useScope(root, () => {
    const section = root.current;
    if (!section) return;
    revealHeadings(section);
    if (prefersReducedMotion()) return;

    // Words (and small chips) light up from faint to full as their block scrolls through
    const lightUp = (selector: string, start: string, end: string) => {
      const block = section.querySelector<HTMLElement>(selector);
      if (!block) return;
      const items = Array.from(block.querySelectorAll<HTMLElement>(".mf-item"));
      const chips = Array.from(block.querySelectorAll<HTMLElement>(".mf-item.chip"));
      const tl = gsap.timeline({ scrollTrigger: { trigger: block, start, end, scrub: true } });
      tl.fromTo(items, { opacity: 0.14 }, { opacity: 1, duration: 0.4, ease: "none", stagger: 0.12 }, 0);
      if (chips.length) {
        tl.fromTo(chips, { scaleX: 0.25, transformOrigin: "left center" }, { scaleX: 1, duration: 0.4, ease: "power2.out", stagger: 0.12 }, 0);
      }
    };
    lightUp(".mf__pair", "top 80%", "bottom 62%");
    lightUp(".mf__statement", "top 80%", "bottom 52%");

    // The rule draws itself
    const rule = section.querySelector<HTMLElement>(".mf__rule");
    if (rule) {
      gsap.fromTo(rule, { scaleX: 0 }, { scaleX: 1, ease: "none", scrollTrigger: { trigger: rule, start: "top 94%", end: "top 60%", scrub: true } });
    }

    // The two large chips unfold when they arrive
    section.querySelectorAll<HTMLElement>(".chip--lg").forEach((chip) => {
      gsap.from(chip, {
        scaleX: 0.2,
        transformOrigin: "left center",
        duration: 1.1,
        ease: "expo.out",
        scrollTrigger: { trigger: chip, start: "top 90%", once: true },
      });
    });
  });

  const { designer, developer, statement } = manifesto;

  return (
    <section className="mf" id="manifesto" ref={root} data-theme="light" data-section="Intro">
      <div className="mf__pair">
        <div className="mf__col">
          <span className={`chip chip--lg chip--${designer.chip}`} aria-hidden="true">
            <Bits />
          </span>
          <Words as="h3" className="mf__title" text={designer.title} />
          <p className="mf__sub">
            <Inline text={designer.text} />
          </p>
        </div>

        <div className="mf__col">
          <span className={`chip chip--lg chip--${developer.chip}`} aria-hidden="true">
            <Bits />
          </span>
          <Words as="h3" className="mf__title mf__title--code" text={developer.title} />
          <p className="mf__sub">
            <Inline text={developer.text} />
          </p>
        </div>
      </div>

      <div className="mf__rule" aria-hidden="true" />

      <p className="mf__statement">
        {statement.map((line, i) => (
          <span className="mf__line" key={i}>
            <Inline text={line} />
          </span>
        ))}
      </p>
    </section>
  );
}
