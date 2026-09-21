import type { ReactNode } from "react";
import SmoothScroll from "@/components/SmoothScroll";
import Preloader from "@/components/Preloader";
import Cursor from "@/components/Cursor";
import Nav from "@/components/Nav";

/** Chrome for the portfolio itself. The dashboard deliberately lives outside this. */
export default function SiteLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <a className="skip" href="#work">
        Skip to work
      </a>
      <SmoothScroll />
      <Preloader />
      <Cursor />
      <Nav />
      {children}
    </>
  );
}
