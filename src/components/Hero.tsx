"use client";

import { useRef } from "react";
import { gsap, ScrollTrigger, useScope } from "@/lib/gsap";
import { hero } from "@/data/content";
import { onIntroDone } from "@/lib/intro";
import { fontsReady } from "@/lib/fonts";
import { fitBox, fitText, isFinePointer, prefersReducedMotion } from "@/lib/anim";
import Badge from "@/components/ui/Badge";

const LINE = 0.86; // line-height of the giant words

/** The selection box you'd see in a design tool: dashed frame, four handles, a size tag. */
function Selection() {
  return (
    <span className="sel" aria-hidden="true">
      <i />
      <i />
      <i />
      <i />
      <b data-dim>0 × 0</b>
    </span>
  );
}

/**
 * The hero is drawn twice at identical positions.
 *  - the "design" face is what everybody sees
 *  - the "source" face lives under a small lens that follows the pointer:
 *    the type swaps typefaces and everything gets measured and annotated.
 */
function Face({ source = false }: { source?: boolean }) {
  const Rows = source ? "div" : "h1";
  return (
    <div className="hero__face">
      {source ? <div className="hero__grid" /> : null}

      <Rows className="hero__rows">
        <span className="hero__row" data-row="1">
          <span className={`fit ${source ? "fit--mono" : "fit--display"}`} data-fit="1">
            <span className="hero__word">{hero.top}</span>
            {source ? <Selection /> : null}
          </span>
        </span>
        <span className="hero__amp">
          <span>{hero.amp}</span>
        </span>
        <span className="hero__row hero__row--2" data-row="2">
          <span className={`fit ${source ? "fit--display" : "fit--mono"}`} data-fit="2">
            <span className="hero__word">{hero.bottom}</span>
            {source ? <Selection /> : null}
          </span>
        </span>
      </Rows>

      <div className="hero__bottom">
        {source ? (
          <p className="hero__intro hero__intro--code">
            {hero.introComments.map((line) => (
              <span key={line}>{`// ${line}`}</span>
            ))}
          </p>
        ) : (
          <p className="hero__intro">{hero.intro}</p>
        )}
        <Badge className="hero__badge" text={hero.badge} />
      </div>
    </div>
  );
}

export default function Hero() {
  const root = useRef<HTMLElement>(null);

  useScope(root, (safe) => {
    const frame = root.current;
    if (!frame) return;
    const q = <T extends HTMLElement = HTMLElement>(sel: string) => frame.querySelector<T>(sel)!;
    const qa = (sel: string) => Array.from(frame.querySelectorAll<HTMLElement>(sel));
    const reduce = prefersReducedMotion();
    const fine = isFinePointer();

    /* ---------- 1. Fit the giant type to the frame ---------- */
    const layout = () => {
      const W = q(".hero__layer--a .hero__rows").clientWidth;
      if (!W) return;
      const narrow = window.innerWidth < 720;
      const budget = frame.clientHeight * 0.6; // the two rows may use 60% of the frame

      const a1 = q(".hero__layer--a [data-fit='1']");
      const a2 = q(".hero__layer--a [data-fit='2']");
      const fs1 = fitText(a1, W, (budget * 0.62) / LINE);
      const fs2 = fitText(a2, narrow ? W : W * 0.7, Math.max(70, (budget - fs1 * LINE) / LINE));
      const w1 = a1.offsetWidth;
      const w2 = a2.offsetWidth;

      // The source face swaps typefaces but is forced into exactly the same boxes.
      fitBox(q(".hero__layer--b [data-fit='1']"), w1, fs1, hero.top.length);
      fitBox(q(".hero__layer--b [data-fit='2']"), w2, fs2, hero.bottom.length);

      qa("[data-row='1']").forEach((r) => (r.style.height = `${fs1 * LINE}px`));
      qa("[data-row='2']").forEach((r) => (r.style.height = `${fs2 * LINE}px`));
      frame.style.setProperty("--fs2", `${fs2}px`);
      frame.style.setProperty("--code-w", `${w2}px`);

      qa(".hero__layer--b .fit").forEach((fit) => {
        const tag = fit.querySelector<HTMLElement>("[data-dim]");
        if (tag) tag.textContent = `${Math.round(fit.offsetWidth)} × ${Math.round(fit.offsetHeight)}`;
      });
    };
    layout();
    fontsReady().then(layout);
    const ro = new ResizeObserver(layout);
    ro.observe(frame);

    if (reduce) return () => ro.disconnect();

    /* ---------- 2. The lens ---------- */
    const layerB = q(".hero__layer--b");
    const crossX = q(".hero__cross--x");
    const crossY = q(".hero__cross--y");
    const press = q(".hero__press");
    const pressText = q(".hero__press span");
    const state = { x: -9999, y: -9999, r: 0 };
    let visible = true;
    let ambient = false;
    let lastR = 0;
    let inside = false;
    let down = false;
    let sweep: gsap.core.Timeline | null = null;

    // A small loupe, not a spotlight
    const idleR = () => Math.max(64, Math.min(104, window.innerWidth * 0.058));
    const fullR = () => Math.hypot(frame.clientWidth, frame.clientHeight);
    const qx = gsap.quickTo(state, "x", { duration: 0.5, ease: "power3" });
    const qy = gsap.quickTo(state, "y", { duration: 0.5, ease: "power3" });
    const qr = gsap.quickTo(state, "r", { duration: 0.7, ease: "power3" });

    ScrollTrigger.create({
      trigger: frame,
      start: "top bottom",
      end: "bottom top",
      onToggle: (self) => {
        visible = self.isActive;
      },
    });

    const paint = () => {
      if (!visible) return;
      if (state.r < 0.5 && lastR < 0.5) return;
      lastR = state.r;
      const x = state.x.toFixed(1);
      const y = state.y.toFixed(1);
      layerB.style.clipPath = `circle(${Math.max(0, state.r).toFixed(1)}px at ${x}px ${y}px)`;
      crossX.style.transform = `translate3d(${x}px,0,0)`;
      crossY.style.transform = `translate3d(0,${y}px,0)`;
      // The "Press" tag rides at the centre of the lens and fades with it
      press.style.opacity = String(Math.min(1, Math.max(0, (state.r - 16) / 26)));
      press.style.transform = `translate3d(${x}px,${y}px,0) translate(-50%,-50%)`;
    };
    const tick = () => {
      if (ambient) {
        // Touch screens have no hover, so the lens drifts on its own.
        const t = gsap.ticker.time;
        state.x = frame.clientWidth * (0.5 + 0.28 * Math.sin(t * 0.55));
        state.y = frame.clientHeight * (0.48 + 0.2 * Math.sin(t * 0.83 + 1.2));
        state.r = Math.min(frame.clientWidth, frame.clientHeight) * 0.2;
      }
      paint();
    };
    gsap.ticker.add(tick);

    const enter = (e: PointerEvent) => {
      if (inside) return;
      inside = true;
      sweep?.kill();
      sweep = null;
      const rect = frame.getBoundingClientRect();
      state.x = e.clientX - rect.left;
      state.y = e.clientY - rect.top;
    };
    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      enter(e);
      const rect = frame.getBoundingClientRect();
      qx(e.clientX - rect.left);
      qy(e.clientY - rect.top);
      qr(down ? fullR() : idleR());
    };
    const onLeave = () => {
      inside = false;
      qr(0);
    };
    const onDown = (e: PointerEvent) => {
      if (e.pointerType !== "mouse" || e.button !== 0) return;
      enter(e);
      down = true;
      pressText.textContent = hero.release;
      qr(fullR());
    };
    const onUp = () => {
      if (!down) return;
      down = false;
      pressText.textContent = hero.press;
      qr(inside ? idleR() : 0);
    };
    if (fine) {
      frame.addEventListener("pointermove", onMove);
      frame.addEventListener("pointerleave", onLeave);
      frame.addEventListener("pointerdown", onDown);
      window.addEventListener("pointerup", onUp);
    }

    /* ---------- 3. Scroll: the words pull apart, the next section slides over ---------- */
    gsap
      .timeline({
        defaults: { ease: "none" },
        scrollTrigger: { trigger: frame, start: "top top", end: "+=100%", scrub: true, pin: true, pinSpacing: false, anticipatePin: 1 },
      })
      .to(qa("[data-row='1'] .fit"), { xPercent: -14 }, 0)
      .to(qa("[data-row='2'] .fit"), { xPercent: 16 }, 0)
      .to(qa(".hero__amp"), { rotate: 200 }, 0)
      .to(qa(".hero__face"), { scale: 0.92, transformOrigin: "50% 100%" }, 0)
      .to(q(".hero__dim"), { opacity: 0.6 }, 0);

    /* ---------- 4. Entrance, once the preloader lifts ---------- */
    const words1 = qa("[data-row='1'] .hero__word");
    const words2 = qa("[data-row='2'] .hero__word");
    const ampIn = qa(".hero__amp > span");
    const bottoms = qa(".hero__bottom > *");
    gsap.set([...words1, ...words2], { yPercent: 108 });
    gsap.set(ampIn, { scale: 0, opacity: 0 });
    gsap.set(bottoms, { opacity: 0, y: 24 });

    const off = onIntroDone(
      safe(() => {
        const tl = gsap.timeline();
        tl.to(words1, { yPercent: 0, duration: 1.3, ease: "expo.out" }, 0);
        tl.to(words2, { yPercent: 0, duration: 1.3, ease: "expo.out" }, 0.1);
        tl.to(ampIn, { scale: 1, opacity: 1, duration: 1.1, ease: "back.out(1.6)" }, 0.45);
        tl.to(bottoms, { opacity: 1, y: 0, duration: 0.9, ease: "power3.out", stagger: 0.08 }, 0.55);

        if (fine) {
          if (inside) return;
          // A first pass of the lens, with its "Press" tag, so nobody misses that it exists
          const w = frame.clientWidth;
          const h = frame.clientHeight;
          const peak = idleR() * 1.15;
          sweep = gsap.timeline({ delay: 0.8, onComplete: () => (sweep = null) });
          sweep.set(state, { x: w * 0.12, y: h * 0.7, r: 0 });
          sweep.to(state, { x: w * 0.86, y: h * 0.36, duration: 2.6, ease: "power2.inOut" }, 0);
          sweep.to(state, { r: peak, duration: 0.9, ease: "power3.out" }, 0);
          sweep.to(state, { r: 0, duration: 0.9, ease: "power3.in" }, 1.7);
        } else {
          ambient = true;
        }
      }),
    );

    return () => {
      off();
      ro.disconnect();
      gsap.ticker.remove(tick);
      frame.removeEventListener("pointermove", onMove);
      frame.removeEventListener("pointerleave", onLeave);
      frame.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointerup", onUp);
    };
  });

  return (
    <section className="hero" id="top" ref={root} data-theme="dark" data-section="Intro" data-cursor="none">
      <div className="hero__layer hero__layer--a">
        <Face />
      </div>
      <div className="hero__layer hero__layer--b" aria-hidden="true">
        <Face source />
        <div className="hero__cross hero__cross--x" />
        <div className="hero__cross hero__cross--y" />
      </div>
      <div className="hero__dim" />
      <div className="hero__press" aria-hidden="true">
        <span>{hero.press}</span>
      </div>
    </section>
  );
}
