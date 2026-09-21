"use client";

import { useEffect, useRef, useState } from "react";
import { gsap, ScrollTrigger, useScope } from "@/lib/gsap";
import { nav as navText, site } from "@/data/content";
import { onIntroDone } from "@/lib/intro";
import { scroll } from "@/lib/scroll";
import { prefersReducedMotion } from "@/lib/anim";
import RollText from "@/components/ui/RollText";
import Magnetic from "@/components/ui/Magnetic";

/**
 * Fixed top bar, vertical section index on the left, and a full-screen menu for small screens.
 * Colours follow the section under the bar: every [data-theme] block on the page tells the nav
 * whether it is "dark" (light text) or "light" (dark text).
 */
export default function Nav() {
  const bar = useRef<HTMLElement>(null);
  const side = useRef<HTMLElement>(null);
  const menu = useRef<HTMLDivElement>(null);
  const menuTl = useRef<gsap.core.Timeline | null>(null);
  const prevOpen = useRef(false);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(navText.sections[0].label);

  useScope(bar, (safe) => {
    const nav = bar.current;
    const sideEl = side.current;
    const menuEl = menu.current;
    if (!nav || !sideEl || !menuEl) return;
    const html = document.documentElement;

    // Follow the section under the bar (theme) and under the middle of the screen (scroll-spy)
    document.querySelectorAll<HTMLElement>("[data-theme]").forEach((sec) => {
      ScrollTrigger.create({
        trigger: sec,
        start: "top 40px",
        end: "bottom 40px",
        refreshPriority: -1,
        onToggle: (self) => {
          if (self.isActive) html.dataset.nav = sec.dataset.theme;
        },
      });
    });
    document.querySelectorAll<HTMLElement>("[data-section]").forEach((sec) => {
      ScrollTrigger.create({
        trigger: sec,
        start: "top 55%",
        end: "bottom 55%",
        refreshPriority: -1,
        onToggle: (self) => {
          if (self.isActive && sec.dataset.section) setActive(sec.dataset.section);
        },
      });
    });

    // Full-screen menu timeline (visibility is handled in the callbacks, not by tweens)
    const items = menuEl.querySelectorAll(".menu__text");
    const foot = menuEl.querySelectorAll(".menu__foot > *");
    const tl = gsap.timeline({
      paused: true,
      onStart: () => {
        menuEl.style.visibility = "visible";
      },
      onReverseComplete: () => {
        menuEl.style.visibility = "hidden";
      },
    });
    tl.fromTo(menuEl, { clipPath: "inset(0 0 100% 0)" }, { clipPath: "inset(0 0 0% 0)", duration: 0.9, ease: "expo.inOut" });
    tl.fromTo(items, { yPercent: 110 }, { yPercent: 0, duration: 1, ease: "expo.out", stagger: 0.07 }, "-=0.45");
    tl.fromTo(foot, { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.6, ease: "power3.out", stagger: 0.06 }, "-=0.7");
    menuTl.current = tl;

    // Entrance after the preloader lifts
    if (!prefersReducedMotion()) {
      gsap.set([nav, sideEl], { autoAlpha: 0, y: -18 });
      const off = onIntroDone(
        safe(() => {
          gsap.to([nav, sideEl], { autoAlpha: 1, y: 0, duration: 1, ease: "expo.out", stagger: 0.1, delay: 0.5 });
        }),
      );
      return () => {
        off();
        menuTl.current = null;
      };
    }
    return () => {
      menuTl.current = null;
    };
  });

  // Lenis ignores scrollTo() while stopped, so wake it before the anchor click is handled.
  const closeMenu = () => {
    scroll.lenis?.start();
    setOpen(false);
  };

  // Open / close the menu
  useEffect(() => {
    if (prevOpen.current === open) return; // nothing changed (first render): leave Lenis alone
    prevOpen.current = open;
    const tl = menuTl.current;
    const html = document.documentElement;
    if (open) {
      html.dataset.menu = "open";
      scroll.lenis?.stop();
      tl?.timeScale(1).play();
    } else {
      delete html.dataset.menu;
      scroll.lenis?.start();
      if (tl && tl.progress() > 0) tl.timeScale(1.5).reverse();
    }
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <>
      <header className="nav" ref={bar}>
        <a className="nav__logo roll-host" href="#top" aria-label={`${site.name}, back to top`} onClick={closeMenu}>
          <RollText text={site.name} />
        </a>
        <div className="nav__right">
          <nav className="nav__links" aria-label="Primary">
            {navText.links.map((l) => (
              <a key={l.id} className="roll-host" href={`#${l.id}`} aria-label={l.label}>
                <RollText text={l.label} />
              </a>
            ))}
          </nav>
          <Magnetic>
            <a className="nav__cta" href="#contact">
              {navText.cta}
            </a>
          </Magnetic>
          <button
            type="button"
            className="nav__toggle"
            aria-expanded={open}
            aria-controls="menu"
            onClick={() => setOpen((v) => !v)}
          >
            {open ? navText.close : navText.menu}
          </button>
        </div>
      </header>

      <nav className="side" ref={side} aria-label="Sections">
        <ul>
          {navText.sections.map((s) => (
            <li key={s.id}>
              <a href={`#${s.id}`} className={active === s.label ? "is-active" : undefined}>
                {s.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>

      <div className="menu" id="menu" ref={menu} aria-hidden={!open}>
        <ul className="menu__list">
          {navText.menuLinks.map((l) => (
            <li key={l.id}>
              <a className="menu__link" href={`#${l.id}`} onClick={closeMenu} tabIndex={open ? 0 : -1}>
                <span className="menu__text">{l.label}</span>
              </a>
            </li>
          ))}
        </ul>
        <div className="menu__foot">
          <a href={`mailto:${site.email}`} tabIndex={open ? 0 : -1}>
            {site.email}
          </a>
          <p>{site.socials.map((s) => s.label).join(", ")}</p>
        </div>
      </div>
    </>
  );
}
