import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const isPrivateRoute = createRouteMatcher(["/pdf", "/shadcn"]);

export default clerkMiddleware(async (auth, req) => {
  const { origin } = req.nextUrl;
  if (isPrivateRoute(req) && process.env.NODE_ENV === "production")
    return NextResponse.redirect(new URL("/", origin));
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};
