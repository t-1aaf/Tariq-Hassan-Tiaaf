import Hero from "@/components/Hero";
import Manifesto from "@/components/Manifesto";
import Work from "@/components/Work";
import Index from "@/components/Index";
import Marquee from "@/components/Marquee";
import About from "@/components/About";
import Process from "@/components/Process";
import Contact from "@/components/Contact";
import { readProjects } from "@/lib/projects";

export const dynamic = "force-dynamic";

export default async function Page() {
  const projects = await readProjects();
  return (
    <>
      <main id="main">
        <Hero />
        <Manifesto />
        <Work projects={projects} />
        <Index projects={projects} />
        <Marquee />
        <About />
        <Process />
      </main>
      <Contact />
    </>
  );
}
