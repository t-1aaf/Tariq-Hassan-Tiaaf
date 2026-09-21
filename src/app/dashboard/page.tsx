import type { Metadata } from "next";
import { readProjects } from "@/lib/projects";
import ProjectsDashboard from "@/components/dashboard/ProjectsDashboard";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Works dashboard",
  robots: { index: false, follow: false },
};

export default async function DashboardPage() {
  const projects = await readProjects();
  return <ProjectsDashboard initialProjects={projects} />;
}
