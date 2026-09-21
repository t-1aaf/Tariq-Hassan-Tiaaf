"use client";

import { useRef } from "react";
import { gsap, ScrollTrigger, useScope } from "@/lib/gsap";
import { preloader, site } from "@/data/content";
import { fontsReady } from "@/lib/fonts";
import { markIntroDone } from "@/lib/intro";
import { scroll } from "@/lib/scroll";
import { prefersReducedMotion } from "@/lib/anim";

/**
 * A sun-yellow panel with a counter. It waits for the webfonts, then wipes upward.
 * The hero types itself in as the panel lifts, so the two feel like one move.
 */
export default function Preloader() {
  const root = useRef<HTMLDivElement>(null);

  useScope(root, () => {
    const el = root.current;
    if (!el) return;

    if (prefersReducedMotion()) {
      el.style.display = "none";
      markIntroDone();
      return;
    }

    window.scrollTo(0, 0);
    const num = el.querySelector<HTMLElement>("[data-num]");
    const bar = el.querySelector<HTMLElement>("[data-bar]");
    if (!num || !bar) return;

    const counter = { v: 0 };
    const render = () => {
      num.textContent = String(Math.round(counter.v));
      bar.style.transform = `scaleX(${counter.v / 100})`;
    };

    const tl = gsap.timeline();
    // Lenis is created in a layout effect, but read it lazily to be safe.
    tl.call(() => scroll.lenis?.stop(), [], 0);
    tl.to(counter, { v: 86, duration: 1.3, ease: "power2.inOut", onUpdate: render }, 0);
    // Hold at 86 until the webfonts are in (fontsReady has its own timeout).
    tl.call(() => {
      tl.pause();
      fontsReady().then(() => tl.resume());
    });
    tl.to(counter, { v: 100, duration: 0.5, ease: "power1.out", onUpdate: render });
    tl.to(num, { yPercent: -115, duration: 0.7, ease: "power3.in" }, "+=0.15");
    tl.fromTo(
      el,
      { clipPath: "inset(0 0 0% 0)" },
      { clipPath: "inset(0 0 100% 0)", duration: 1, ease: "expo.inOut" },
      "<+=0.2",
    );
    tl.call(markIntroDone, [], "<+=0.4");
    tl.set(el, { display: "none" });
    tl.call(() => {
      scroll.lenis?.start();
      ScrollTrigger.refresh();
    });
  });

  return (
    <div className="preloader" ref={root} aria-hidden="true">
      <div className="preloader__top">
        <span>{site.name}</span>
        <span suppressHydrationWarning>
          {preloader.label} {new Date().getFullYear()}
        </span>
      </div>
      <div>
        <div className="preloader__count">
          <span className="preloader__num" data-num>
            0
          </span>
        </div>
        <div className="preloader__bar">
          <i data-bar />
        </div>
      </div>
    </div>
  );
}
