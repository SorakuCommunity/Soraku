import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const isAdminRoute = createRouteMatcher(["/admin(.*)"]);
const isPublicRoute = createRouteMatcher([
  "/",
  "/sign-in(.*)",
  "/sign-up(.*)",
  "/maintenance",
  "/community",
  "/blog(.*)",
  "/events(.*)",
  "/vtuber(.*)",
  "/gallery",
  "/api/discord(.*)",
  "/api/spotify(.*)",
  "/api/maintenance",
  "/api/webhooks(.*)",
]);

export default clerkMiddleware(async (auth, req) => {
  const url = req.nextUrl;

  // Maintenance mode check
  if (
    process.env.MAINTENANCE_MODE === "true" &&
    url.pathname !== "/maintenance" &&
    !url.pathname.startsWith("/api/") &&
    !url.pathname.startsWith("/admin")
  ) {
    return NextResponse.redirect(new URL("/maintenance", req.url));
  }

  // Protect admin routes
  if (isAdminRoute(req)) {
    await auth.protect();
    return NextResponse.next();
  }

  // Allow public routes
  if (isPublicRoute(req)) {
    return NextResponse.next();
  }

  // Protect everything else
  await auth.protect();
  return NextResponse.next();
});

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
