import { gsap } from "./gsap";

export const prefersReducedMotion = () =>
  typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

export const isFinePointer = () =>
  typeof window !== "undefined" && window.matchMedia("(hover: hover) and (pointer: fine)").matches;

/**
 * Sets the font-size of `el` so its text is `targetWidth` wide (never larger than maxFontSize).
 * Returns the resulting font-size in px. `el` must be display:block/inline-block with white-space:nowrap.
 */
export function fitText(el: HTMLElement, targetWidth: number, maxFontSize = Infinity): number {
  el.style.fontSize = "100px";
  const w = el.offsetWidth || el.getBoundingClientRect().width || 1;
  const size = Math.max(12, Math.min((100 * targetWidth) / w, maxFontSize));
  el.style.fontSize = `${size}px`;
  return size;
}

/**
 * Like fitText, but if the font-size cap leaves the text narrower than the target,
 * the gap is closed with letter-spacing so both edges of the box line up exactly.
 */
export function fitBox(el: HTMLElement, targetWidth: number, maxFontSize: number, chars: number): number {
  el.style.letterSpacing = "";
  const size = fitText(el, targetWidth, maxFontSize);
  const w = el.offsetWidth;
  if (w > 0 && w < targetWidth - 1 && chars > 0) {
    const base = parseFloat(getComputedStyle(el).letterSpacing) || 0;
    el.style.letterSpacing = `${base + (targetWidth - w) / chars}px`;
  }
  return size;
}

/** Masked word-by-word rise for every [data-reveal] heading inside `scope`. */
export function revealHeadings(scope: HTMLElement | null) {
  if (!scope || prefersReducedMotion()) return;
  scope.querySelectorAll<HTMLElement>("[data-reveal]").forEach((el) => {
    const words = el.querySelectorAll(".sw__i");
    if (!words.length) return;
    gsap.from(words, {
      yPercent: 118,
      duration: 1.15,
      ease: "expo.out",
      stagger: 0.055,
      scrollTrigger: { trigger: el, start: "top 88%", once: true },
    });
  });
}
