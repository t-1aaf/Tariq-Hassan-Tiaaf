/**
 * Edge-safe session token helpers, shared by middleware, the login route and
 * server components. No Node APIs and no next/headers — Web Crypto only — so
 * the file can be imported from middleware (edge) and routes alike.
 *
 * The cookie value is `<expiresAtMs>.<hmac_sha256(expiresAtMs, secret)[0:32hex]>`.
 * The signed expiry *is* the session record: no database, and rotating
 * ADMIN_SECRET invalidates every existing session at once.
 */

export const SESSION_COOKIE = "rv_session";
/** 30 days, in ms */
export const SESSION_TTL_MS = 30 * 24 * 60 * 60 * 1000;
export const SESSION_MAX_AGE_SECONDS = SESSION_TTL_MS / 1000;

/**
 * The secret used to sign session cookies. In production a real ADMIN_SECRET is
 * required; in dev we fall back to a stable string so sessions survive restarts.
 */
export function getAdminSecret(): string {
  const s = process.env.ADMIN_SECRET?.trim();
  if (s) return s;
  if (process.env.NODE_ENV === "production") {
    // Fails closed: nothing verifies without a secret, so every session is invalid.
    return "";
  }
  return "dev-only-insecure-secret";
}

/** The admin password. Falls back to a known default in development only. */
export function getAdminPassword(): string {
  const p = process.env.ADMIN_PASSWORD?.trim();
  if (p) return p;
  if (process.env.NODE_ENV === "production") {
    throw new Error("ADMIN_PASSWORD must be set in production.");
  }
  return "rowanvale";
}

/** Constant-time string comparison that does not leak where strings differ. */
export function safeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) {
    // Consume comparable time anyway so length probing is not observable.
    crypto.subtle.digest("SHA-256", new TextEncoder().encode(a));
    return false;
  }
  const ab = new TextEncoder().encode(a);
  const bb = new TextEncoder().encode(b);
  let diff = 0;
  for (let i = 0; i < ab.length; i++) diff |= (ab[i] ?? 0) ^ (bb[i] ?? 0);
  return diff === 0;
}

/** HMAC-SHA256 over `value`, truncated to 128 bits, as hex. */
export async function hmacHex(value: string, secret: string): Promise<string> {
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const mac = await crypto.subtle.sign("HMAC", key, encoder.encode(value));
  return Array.from(new Uint8Array(mac))
    .slice(0, 16)
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

/** The signed cookie value for a fresh 30-day session. */
export async function createToken(secret: string): Promise<string> {
  const expiresAt = String(Date.now() + SESSION_TTL_MS);
  return `${expiresAt}.${await hmacHex(expiresAt, secret)}`;
}

/** True only if the token's signature is intact and its expiry is in the future. */
export async function verifyToken(token: string, secret: string): Promise<boolean> {
  const dot = token.indexOf(".");
  if (dot <= 0) return false;
  const expiresAt = token.slice(0, dot);
  const tag = token.slice(dot + 1);
  if (!/^\d+$/.test(expiresAt) || !tag) return false;
  if (Number(expiresAt) <= Date.now()) return false;
  if (!secret) return false;
  const expected = await hmacHex(expiresAt, secret);
  return safeEqual(tag, expected);
}
