"use client";

import { useRef } from "react";
import { gsap, useScope } from "@/lib/gsap";
import { contact, site } from "@/data/content";
import { fitText, prefersReducedMotion, revealHeadings } from "@/lib/anim";
import { scrollTo } from "@/lib/scroll";
import { fontsReady } from "@/lib/fonts";
import RollText from "@/components/ui/RollText";
import Words from "@/components/ui/Words";

/**
 * The finale. The content settles as the footer is revealed, and the name at the bottom
 * swells from a light, narrow cut to a bold, full-width one as you arrive.
 */
export default function Contact() {
  const root = useRef<HTMLElement>(null);

  useScope(root, () => {
    const footer = root.current;
    if (!footer) return;
    revealHeadings(footer);

    const mark = footer.querySelector<HTMLElement>(".contact__mark-in");
    const holder = footer.querySelector<HTMLElement>(".contact__mark");
    if (!mark || !holder) return;

    // Fit the name to the width of the page at the bold, widest cut, then start light and narrow.
    const axis = prefersReducedMotion() ? { s: 100, w: 700 } : { s: 75, w: 300 };
    const apply = () => {
      mark.style.fontStretch = `${axis.s}%`;
      mark.style.fontWeight = String(Math.round(axis.w));
    };
    const fit = () => {
      const W = holder.clientWidth;
      if (!W) return;
      mark.style.fontStretch = "100%";
      mark.style.fontWeight = "700";
      fitText(mark, W);
      apply();
    };
    fit();
    fontsReady().then(fit);
    const ro = new ResizeObserver(fit);
    ro.observe(holder);

    if (prefersReducedMotion()) return () => ro.disconnect();

    gsap.to(axis, {
      s: 100,
      w: 700,
      ease: "none",
      onUpdate: apply,
      scrollTrigger: { trigger: holder, start: "top 105%", end: "bottom 62%", scrub: true },
    });

    const inner = footer.querySelector(".contact__in");
    if (inner) {
      gsap.from(inner, {
        yPercent: -14,
        ease: "none",
        scrollTrigger: { trigger: footer, start: "top bottom", end: "top top", scrub: true },
      });
    }
    return () => ro.disconnect();
  });

  return (
    <footer className="contact" id="contact" ref={root} data-theme="light" data-section="Contact">
      <div className="contact__in">
        <Words as="h2" className="contact__title" text={contact.title} />

        <div className="contact__cols">
          <div>
            <h3>{contact.emailTitle}</h3>
            <a className="contact__mail roll-host" href={`mailto:${site.email}`} aria-label={site.email} data-cursor="link">
              <RollText text={site.email} />
            </a>
          </div>

          <div>
            <h3>{contact.elsewhere}</h3>
            <ul>
              {site.socials.map((s) => (
                <li key={s.label}>
                  <a className="roll-host" href={s.href} aria-label={s.label} target="_blank" rel="noreferrer">
                    <RollText text={s.label} />
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3>{contact.availabilityTitle}</h3>
            <p className="contact__avail">
              <i className="dot" />
              {site.availability}. {site.availabilityNote}.
            </p>
          </div>
        </div>
      </div>

      <div className="contact__mark" aria-hidden="true">
        <span className="contact__mark-in">{site.name}</span>
      </div>

      <div className="contact__base">
        <p suppressHydrationWarning>
          © {new Date().getFullYear()} {site.name}
        </p>
        <button type="button" onClick={() => scrollTo(0, { duration: 2.2 })}>
          {contact.backToTop}
        </button>
      </div>
    </footer>
  );
}
