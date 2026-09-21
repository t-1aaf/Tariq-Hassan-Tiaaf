"use client";

import { useRef, type ReactNode } from "react";
import { gsap, useScope } from "@/lib/gsap";
import { isFinePointer } from "@/lib/anim";

/** Pulls its child toward the pointer while hovered, then springs back. */
export default function Magnetic({ children, strength = 0.3 }: { children: ReactNode; strength?: number }) {
  const ref = useRef<HTMLSpanElement>(null);

  useScope(ref, () => {
    const el = ref.current;
    if (!el || !isFinePointer()) return;

    const xTo = gsap.quickTo(el, "x", { duration: 0.7, ease: "elastic.out(1, 0.45)" });
    const yTo = gsap.quickTo(el, "y", { duration: 0.7, ease: "elastic.out(1, 0.45)" });
    let cx = 0;
    let cy = 0;

    const enter = () => {
      const r = el.getBoundingClientRect();
      cx = r.left + r.width / 2;
      cy = r.top + r.height / 2;
    };
    const move = (e: PointerEvent) => {
      xTo((e.clientX - cx) * strength);
      yTo((e.clientY - cy) * strength);
    };
    const leave = () => {
      xTo(0);
      yTo(0);
    };

    el.addEventListener("pointerenter", enter);
    el.addEventListener("pointermove", move);
    el.addEventListener("pointerleave", leave);
    return () => {
      el.removeEventListener("pointerenter", enter);
      el.removeEventListener("pointermove", move);
      el.removeEventListener("pointerleave", leave);
    };
  });

  return (
    <span ref={ref} className="magnetic">
      {children}
    </span>
  );
}
