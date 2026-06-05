import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const isPublicRoute = createRouteMatcher([
  "/",
  "/pricing",
  "/docs(.*)",
  "/sign-in(.*)",
  "/sign-up(.*)",
  "/api/webhooks(.*)",
]);

const isOwnerOnlyRoute = createRouteMatcher([
  "/reports(.*)",
  "/test(.*)",
  "/settings(.*)",
  "/api/organizations(.*)",
]);

export default clerkMiddleware(async (auth, req) => {
  // Inject current pathname so server layouts can read it without redundant auth calls
  const requestHeaders = new Headers(req.headers);
  requestHeaders.set("x-pathname", req.nextUrl.pathname);

  if (isPublicRoute(req)) {
    return NextResponse.next({ request: { headers: requestHeaders } });
  }

  const { userId, orgRole } = await auth.protect();

  if (!userId) {
    return NextResponse.redirect(new URL("/sign-in", req.url));
  }

  // Dispatchers cannot access owner-only routes (onboarding is owner-only too)
  if (isOwnerOnlyRoute(req) && orgRole !== "org:admin") {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  return NextResponse.next({ request: { headers: requestHeaders } });
});

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.png|.*\\.svg|.*\\.jpg|.*\\.ico).*)",
  ],
};
