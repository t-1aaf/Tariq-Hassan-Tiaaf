"use client";

import { useId } from "react";

/** Circular rotating text badge with a centre dot. Colour follows currentColor. */
export default function Badge({ text, className = "" }: { text: string; className?: string }) {
  const id = "badge" + useId().replace(/[^a-zA-Z0-9]/g, "");
  return (
    <svg className={`badge ${className}`} viewBox="0 0 200 200" aria-hidden="true">
      <defs>
        <path id={id} d="M100,100 m-76,0 a76,76 0 1,1 152,0 a76,76 0 1,1 -152,0" />
      </defs>
      <g className="badge__spin">
        <text>
          <textPath href={`#${id}`} textLength="470" lengthAdjust="spacing">
            {text}
          </textPath>
        </text>
      </g>
      <circle cx="100" cy="100" r="7" />
    </svg>
  );
}
