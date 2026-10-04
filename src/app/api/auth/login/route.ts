import { NextResponse } from "next/server";
import {
  SESSION_COOKIE,
  SESSION_MAX_AGE_SECONDS,
  createToken,
  getAdminPassword,
  getAdminSecret,
  hmacHex,
  safeEqual,
} from "@/lib/session";

/**
 * POST /api/auth/login  { password }
 *
 * Compares the submitted password against ADMIN_PASSWORD (via HMAC digests so
 * the comparison is constant-time and never leaks the stored password), then
 * sets the signed session cookie that middleware checks on every request.
 */
export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  let adminPassword: string;
  let secret: string;
  try {
    adminPassword = getAdminPassword();
    secret = getAdminSecret();
  } catch (err) {
    return NextResponse.json({ error: err instanceof Error ? err.message : "Server not configured." }, { status: 500 });
  }

  const submitted = String((body as { password?: unknown })?.password ?? "");
  const passwordOk = safeEqual(await hmacHex(submitted, secret), await hmacHex(adminPassword, secret));
  if (!passwordOk) {
    return NextResponse.json({ error: "Incorrect password." }, { status: 401 });
  }

  const token = await createToken(secret);
  const res = NextResponse.json({ ok: true });
  res.cookies.set(SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: SESSION_MAX_AGE_SECONDS,
  });
  return res;
}

export const dynamic = "force-dynamic";
