import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const isPublicRoute = createRouteMatcher([
  "/",
  "/about",
  "/community",
  "/blog",
  "/blog/(.*)",
  "/events",
  "/events/(.*)",
  "/vtuber",
  "/vtuber/(.*)",
  "/gallery",
  "/maintenance",
  "/sign-in(.*)",
  "/sign-up(.*)",
  "/api/discord(.*)",
  "/api/blog(.*)",
  "/api/events(.*)",
  "/api/vtuber(.*)",
  "/api/gallery(.*)",
]);

const isAdminRoute = createRouteMatcher(["/admin(.*)"]);

export default clerkMiddleware(async (auth, req: NextRequest) => {
  const maintenanceMode = process.env.MAINTENANCE_MODE === "true";
  const url = req.nextUrl.clone();

  // Maintenance mode redirect
  if (
    maintenanceMode &&
    url.pathname !== "/maintenance" &&
    !url.pathname.startsWith("/api") &&
    !url.pathname.startsWith("/_next")
  ) {
    url.pathname = "/maintenance";
    return NextResponse.redirect(url);
  }

  // Protect admin routes
  if (isAdminRoute(req)) {
    const { userId } = await auth();
    if (!userId) {
      url.pathname = "/sign-in";
      return NextResponse.redirect(url);
    }
  }

  if (!isPublicRoute(req)) {
    await auth.protect();
  }
});

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
