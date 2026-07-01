/**
 * Simple in-memory sliding-window rate limiter.
 * Per-serverless-instance (not globally shared), but still meaningful
 * protection against bursts from a single IP hitting the same instance.
 */
const WINDOW_MS = 60_000;
const store = new Map<string, number[]>();

// Prune stale entries every 5 minutes to prevent unbounded memory growth.
setInterval(() => {
  const cutoff = Date.now() - WINDOW_MS;
  for (const [key, times] of store) {
    const fresh = times.filter((t) => t > cutoff);
    if (fresh.length === 0) store.delete(key);
    else store.set(key, fresh);
  }
}, 300_000);

export function checkRateLimit(key: string, maxPerMinute: number): boolean {
  const now = Date.now();
  const cutoff = now - WINDOW_MS;
  const times = (store.get(key) ?? []).filter((t) => t > cutoff);
  times.push(now);
  store.set(key, times);
  return times.length <= maxPerMinute;
}

export function getClientIp(req: Request): string {
  return (
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    req.headers.get("x-real-ip") ??
    "unknown"
  );
}
