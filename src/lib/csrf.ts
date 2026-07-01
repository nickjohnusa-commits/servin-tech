/**
 * CSRF origin guard for state-changing app API routes.
 * Webhook routes (Twilio, Stripe, Clerk, Inngest) must NOT use this —
 * they come from external origins and use their own signature validation.
 */
export function isSameOrigin(req: Request): boolean {
  const origin = req.headers.get("origin");
  if (!origin) {
    // Direct server-to-server call or curl — only allow if no browser context.
    // Presence of a Cookie header implies a browser session; reject it.
    const hasCookie = !!req.headers.get("cookie");
    return !hasCookie;
  }
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "";
  return origin === appUrl;
}

export function csrfError() {
  return Response.json({ error: "Forbidden" }, { status: 403 });
}
