"use client";

import { useId, type CSSProperties } from "react";
import type { CoverKind } from "@/data/content";

type CoverProps = {
  kind: CoverKind;
  colors: [string, string, string];
  letter?: string;
  image?: string;
  video?: string;
  /** Focal point when the media is cropped, e.g. "center top" */
  imagePosition?: string;
  className?: string;
};

/**
 * The cover for a project: its demo image (or video) if it has one, otherwise generated artwork.
 * Each kind is built from SVG or CSS only, so there is nothing to download.
 */
export default function Cover({ kind, colors, letter, image, video, imagePosition, className = "" }: CoverProps) {
  const uid = useId().replace(/[^a-zA-Z0-9]/g, "");

  if (video) {
    return (
      <video
        className={`cover cover--media ${className}`}
        style={imagePosition ? { objectPosition: imagePosition } : undefined}
        src={video}
        autoPlay
        muted
        loop
        playsInline
      />
    );
  }
  if (image) {
    return (
      <img
        className={`cover cover--media ${className}`}
        style={imagePosition ? { objectPosition: imagePosition } : undefined}
        src={image}
        alt=""
        decoding="async"
        draggable={false}
      />
    );
  }

  const style = { "--bg": colors[0], "--a": colors[1], "--b": colors[2] } as CSSProperties;

  return (
    <div className={`cover cover--${kind} ${className}`} style={style} aria-hidden="true">
      {kind === "contours" && <Contours uid={uid} />}
      {kind === "halftone" && <Halftone />}
      {kind === "grid" && <Cells />}
      {kind === "type" && <TypeArt letter={letter ?? "A"} />}
      {kind === "waves" && <Waves />}
      <span className="cover__grain" />
    </div>
  );
}

/* Topographic rings, warped by a static noise displacement */
function Contours({ uid }: { uid: string }) {
  const rings = Array.from({ length: 20 }, (_, i) => i);
  return (
    <svg className="cover__svg cover__drift" viewBox="0 0 800 500" preserveAspectRatio="xMidYMid slice">
      <defs>
        <filter id={`warp${uid}`} x="-30%" y="-30%" width="160%" height="160%">
          <feTurbulence type="fractalNoise" baseFrequency="0.005 0.008" numOctaves="2" seed="7" result="n" />
          <feDisplacementMap in="SourceGraphic" in2="n" scale="170" xChannelSelector="R" yChannelSelector="G" />
        </filter>
      </defs>
      <g filter={`url(#warp${uid})`} className="cover__rings">
        {rings.map((i) => (
          <ellipse key={i} cx="400" cy="250" rx={30 + i * 30} ry={20 + i * 20} opacity={1 - i * 0.03} />
        ))}
      </g>
      <circle className="cover__dot" cx="400" cy="250" r="6" />
    </svg>
  );
}

/* A sphere drawn with dots that grow toward the light source */
function Halftone() {
  const gap = 22;
  const cols = 38;
  const rows = 24;
  const cx = 400;
  const cy = 250;
  const R = 190;
  const lx = cx - 70;
  const ly = cy - 80;
  const dots: { x: number; y: number; r: number; lit: boolean }[] = [];
  for (let j = 0; j < rows; j++) {
    for (let i = 0; i < cols; i++) {
      const x = i * gap + gap / 2 - 18;
      const y = j * gap + gap / 2 - 14;
      if (Math.hypot(x - cx, y - cy) > R) {
        dots.push({ x, y, r: 1.1, lit: false });
        continue;
      }
      const light = Math.max(0, 1 - Math.hypot(x - lx, y - ly) / (R * 1.55));
      dots.push({ x, y, r: 1.6 + light * (gap * 0.5 - 1.2), lit: true });
    }
  }
  return (
    <svg className="cover__svg" viewBox="0 0 800 500" preserveAspectRatio="xMidYMid slice">
      <g className="cover__float">
        {dots.map((d, i) => (
          <circle
            key={i}
            cx={d.x.toFixed(1)}
            cy={d.y.toFixed(1)}
            r={d.r.toFixed(2)}
            className={d.lit ? "cover__dot" : "cover__dot cover__dot--dim"}
          />
        ))}
      </g>
    </svg>
  );
}

/* A field of tiles that flip in a diagonal wave */
function Cells() {
  const cols = 9;
  const rows = 6;
  return (
    <div className="cover__cells" style={{ "--cols": cols } as CSSProperties}>
      {Array.from({ length: cols * rows }, (_, n) => {
        const c = n % cols;
        const r = Math.floor(n / cols);
        return <i key={n} style={{ "--d": (c + r) * 0.35 } as CSSProperties} />;
      })}
    </div>
  );
}

/* One oversized serif letter */
function TypeArt({ letter }: { letter: string }) {
  return (
    <>
      <i className="cover__disc" />
      <span className="cover__letter">{letter}</span>
    </>
  );
}

/* Sine waves drifting sideways. Period 400 = the CSS shift, so the loop is seamless. */
function Waves() {
  const paths = Array.from({ length: 10 }, (_, i) => {
    const amp = 14 + i * 4.5;
    const base = 70 + i * 38;
    const phase = i * 0.7;
    let d = "";
    for (let x = -400; x <= 1200; x += 20) {
      const y = base + amp * Math.sin((x / 400) * Math.PI * 2 + phase);
      d += `${d ? "L" : "M"}${x} ${y.toFixed(1)} `;
    }
    return d;
  });
  return (
    <svg className="cover__svg" viewBox="0 0 800 500" preserveAspectRatio="xMidYMid slice">
      <g className="cover__waves">
        {paths.map((d, i) => (
          <path key={i} d={d} style={{ "--i": i } as CSSProperties} />
        ))}
      </g>
    </svg>
  );
}
