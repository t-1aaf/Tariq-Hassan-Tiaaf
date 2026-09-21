"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";
import { isFinePointer } from "@/lib/anim";

type Mode = "default" | "link" | "view" | "none";
const SCALE: Record<Mode, number> = { default: 1, link: 2.6, view: 5.4, none: 0 };

/**
 * A coral dot that follows the pointer. It grows over links, becomes a "View" bubble
 * over anything marked data-cursor="view", and gets out of the way on data-cursor="none".
 */
export default function Cursor() {
  const wrap = useRef<HTMLDivElement>(null);
  const dot = useRef<HTMLDivElement>(null);
  const label = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (!isFinePointer()) return;
    const el = wrap.current;
    const d = dot.current;
    const l = label.current;
    if (!el || !d || !l) return;

    const html = document.documentElement;
    html.classList.add("has-cursor");

    const xTo = gsap.quickTo(el, "x", { duration: 0.35, ease: "power3" });
    const yTo = gsap.quickTo(el, "y", { duration: 0.35, ease: "power3" });
    let shown = false;
    let mode: Mode = "default";
    let text = "";

    const setMode = (next: Mode, nextText = "") => {
      if (next === mode && nextText === text) return;
      mode = next;
      text = nextText;
      l.textContent = nextText;
      gsap.to(d, { scale: SCALE[next], duration: 0.5, ease: "expo.out", overwrite: "auto" });
      gsap.to(l, { opacity: next === "view" ? 1 : 0, duration: 0.25, overwrite: "auto" });
    };

    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      if (!shown) {
        shown = true;
        gsap.set(el, { x: e.clientX, y: e.clientY });
        gsap.to(el, { autoAlpha: 1, duration: 0.3 });
      }
      xTo(e.clientX);
      yTo(e.clientY);
    };

    const onOver = (e: PointerEvent) => {
      const target = e.target as Element | null;
      const host = target?.closest?.("[data-cursor]") as HTMLElement | null;
      if (host) {
        const kind = host.dataset.cursor as Mode;
        setMode(kind in SCALE ? kind : "default", kind === "view" ? host.dataset.cursorLabel ?? "View" : "");
      } else if (target?.closest?.("a, button, [role='button'], input, textarea")) {
        setMode("link");
      } else {
        setMode("default");
      }
    };

    const onLeave = () => {
      shown = false;
      gsap.to(el, { autoAlpha: 0, duration: 0.25 });
    };

    window.addEventListener("pointermove", onMove);
    document.addEventListener("pointerover", onOver);
    document.documentElement.addEventListener("mouseleave", onLeave);

    return () => {
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerover", onOver);
      document.documentElement.removeEventListener("mouseleave", onLeave);
      gsap.killTweensOf([el, d, l]);
      html.classList.remove("has-cursor");
    };
  }, []);

  return (
    <div className="cursor" ref={wrap} aria-hidden="true">
      <div className="cursor__dot" ref={dot} />
      <span className="cursor__label" ref={label} />
    </div>
  );
}
