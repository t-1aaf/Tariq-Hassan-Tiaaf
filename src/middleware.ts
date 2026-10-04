import { NextResponse, type NextRequest } from "next/server";
import { SESSION_COOKIE, getAdminSecret, verifyToken } from "@/lib/session";

/**
 * The gate: /dashboard requires a valid session cookie; /login bounces back to
 * the dashboard when the cookie is already valid. Everything else passes
 * untouched, so the public site keeps its static behaviour.
 */
export async function middleware(request: NextRequest) {
  const token = request.cookies.get(SESSION_COOKIE)?.value;
  const valid = token ? await verifyToken(token, getAdminSecret()) : false;

  if (request.nextUrl.pathname.startsWith("/dashboard")) {
    if (!valid) {
      const url = request.nextUrl.clone();
      url.pathname = "/login";
      url.search = "";
      return NextResponse.redirect(url);
    }
  } else if (request.nextUrl.pathname === "/login") {
    if (valid) {
      const url = request.nextUrl.clone();
      url.pathname = "/dashboard";
      url.search = "";
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

/**
 * Only the admin areas. The portfolio, images and API reads never hit this file.
 */
export const config = {
  matcher: ["/login", "/dashboard", "/dashboard/:path*"],
};
