import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import "./globals.css";
import { site } from "@/data/content";

export const metadata: Metadata = {
  title: `${site.name}: ${site.role}`,
  description: site.description,
  openGraph: {
    title: `${site.name}: ${site.role}`,
    description: site.description,
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#15123F",
  width: "device-width",
  initialScale: 1,
};

/**
 * Shared shell only: fonts, grain, base styles. The preloader / cursor / smooth
 * scroll chrome belongs to the portfolio alone and lives in the (site) layout,
 * so the dashboard stays a plain, fast admin page.
 */
export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" data-nav="dark">
      <head>
        {/*
          Fonts: Bricolage Grotesque (variable weight, width and optical size) carries everything
          "design"; JetBrains Mono carries everything "code". Separate requests so one bad URL
          can never take the other down.
        */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wdth,wght@12..96,75..100,200..800&display=swap" />
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400..800&display=swap" />
      </head>
      <body>{children}</body>
    </html>
  );
}
