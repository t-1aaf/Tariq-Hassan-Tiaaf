import { NextResponse } from "next/server";
import { readProjects, sanitizeProject, writeProjects } from "@/lib/projects";
import { isAuthenticated } from "@/lib/auth";

/**
 * PUT    /api/projects/[slug]  -> update a project
 * DELETE /api/projects/[slug]  -> remove a project
 */

type Ctx = { params: Promise<{ slug: string }> };

export async function PUT(request: Request, { params }: Ctx) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Sign in at /login to edit works." }, { status: 401 });
  }

  const { slug } = await params;
  let body: Record<string, unknown>;
  try {
    body = (await request.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const current = await readProjects();
  const index = current.findIndex((p) => p.slug === slug);
  if (index === -1) return NextResponse.json({ error: `No project with slug "${slug}".` }, { status: 404 });

  const result = sanitizeProject({ ...body, slug }, current, slug);
  if (!result.ok) return NextResponse.json({ error: result.error }, { status: 400 });

  const next = [...current];
  next[index] = result.project;
  await writeProjects(next);
  return NextResponse.json({ project: result.project, projects: next });
}

export async function DELETE(_request: Request, { params }: Ctx) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Sign in at /login to edit works." }, { status: 401 });
  }

  const { slug } = await params;
  const current = await readProjects();
  const next = current.filter((p) => p.slug !== slug);
  if (next.length === current.length) {
    return NextResponse.json({ error: `No project with slug "${slug}".` }, { status: 404 });
  }
  await writeProjects(next);
  return NextResponse.json({ projects: next });
}
