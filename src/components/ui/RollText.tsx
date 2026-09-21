import type { CSSProperties } from "react";

/**
 * Letters roll upward one by one when the parent link (.roll-host) is hovered or focused.
 * Pure CSS: no JS needed. Put aria-label on the parent link.
 */
export default function RollText({ text }: { text: string }) {
  return (
    <span className="roll" aria-hidden="true">
      {Array.from(text).map((char, i) => {
        const c = char === " " ? "\u00A0" : char;
        return (
          <span className="roll__c" key={i} style={{ "--i": i } as CSSProperties}>
            <span>{c}</span>
            <span>{c}</span>
          </span>
        );
      })}
    </span>
  );
}
