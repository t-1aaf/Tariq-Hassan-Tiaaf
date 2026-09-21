let cached: Promise<void> | null = null;

/**
 * Resolves when the webfonts are loaded (or after `timeout` ms, so a blocked
 * font request can never hang the intro). Shared between callers.
 */
export function fontsReady(timeout = 3000): Promise<void> {
  if (typeof document === "undefined" || !("fonts" in document)) return Promise.resolve();
  if (cached) return cached;
  const load = Promise.all([
    document.fonts.load('800 100px "Bricolage Grotesque"'),
    document.fonts.load('300 100px "Bricolage Grotesque"'),
    document.fonts.load('800 100px "JetBrains Mono"'),
  ])
    .then(() => document.fonts.ready)
    .then(() => undefined);
  const timer = new Promise<void>((resolve) => setTimeout(resolve, timeout));
  cached = Promise.race([load, timer]).catch(() => undefined);
  return cached;
}
