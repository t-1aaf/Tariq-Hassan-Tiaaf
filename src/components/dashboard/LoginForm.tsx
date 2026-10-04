"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

/**
 * The gate in front of the dashboard. One password, no database: POST /api/auth/login
 * sets a signed session cookie, middleware lets the request through, and this page
 * never renders the dashboard itself.
 */
export default function LoginForm() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (busy) return;
    setBusy(true);
    setError(null);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      const data = (await res.json()) as { error?: string };
      if (!res.ok) throw new Error(data.error ?? "Something went wrong.");
      // Refresh server components so the middleware-protected page renders.
      router.replace("/dashboard");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
      setBusy(false);
    }
  }

  return (
    <main className="login">
      <section className="login__card">
        <p className="login__kicker">Portfolio admin</p>
        <h1 className="login__title">Works</h1>
        <p className="login__sub">Enter the admin password to manage the selected work.</p>

        <form onSubmit={submit} className="login__form">
          <label className="login__field">
            <span>Password</span>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoFocus
              autoComplete="current-password"
              placeholder="••••••••"
            />
          </label>

          {error && (
            <p className="login__error" role="alert">
              {error}
            </p>
          )}

          <button type="submit" className="login__submit" disabled={busy || !password}>
            {busy ? "Checking…" : "Enter"}
          </button>
        </form>

        <a className="login__back" href="/">
          ← Back to the site
        </a>
      </section>
    </main>
  );
}
