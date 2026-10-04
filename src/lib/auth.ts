/**
 * Server-only session helpers (these read cookies, so they can't be imported
 * from middleware — use @/lib/session there).
 */

import { cookies } from "next/headers";
import { SESSION_COOKIE, getAdminSecret, verifyToken } from "@/lib/session";

/** True if this request carries a valid session cookie. */
export async function isAuthenticated(): Promise<boolean> {
  const token = (await cookies()).get(SESSION_COOKIE)?.value;
  if (!token) return false;
  return verifyToken(token, getAdminSecret());
}
