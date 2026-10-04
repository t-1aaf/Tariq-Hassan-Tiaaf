import { NextResponse } from "next/server";
import { readProjects, sanitizeProject, writeProjects } from "@/lib/projects";
import { isAuthenticated } from "@/lib/auth";

/**
 * GET  /api/projects  -> the full list (newest first)
 * POST /api/projects  -> add a project from the dashboard form
 */

export async function GET() {
  const projects = await readProjects();
  return NextResponse.json({ projects });
}

export async function POST(request: Request) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Sign in at /login to edit works." }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const current = await readProjects();
  const result = sanitizeProject((body ?? {}) as Record<string, never>, current);
  if (!result.ok) return NextResponse.json({ error: result.error }, { status: 400 });

  await writeProjects([result.project, ...current]);

  return NextResponse.json({ project: result.project, projects: [result.project, ...current] }, { status: 201 });
}
