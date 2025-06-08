import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const publicRoutes = ["/login", "/register", "/terms", "/privacy"];
const protectedRoutes = [
  "/dashboard",
  "/settings",
  "/likedvideos",
  "/history",
  "/playlists",
  "/subscriptions",
  "/tweets",
];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Get authentication tokens
  const accessToken = request.cookies.get("accessToken")?.value;
  const refreshToken = request.cookies.get("refreshToken")?.value;

  const isLoggedIn = !!(accessToken || refreshToken);

  // Create response
  const response = NextResponse.next();

  // Public routes handling
  if (publicRoutes.some((route) => pathname.startsWith(route))) {
    // Redirect logged-in users away from login/register pages
    if ((pathname === "/login" || pathname === "/register") && isLoggedIn) {
      return NextResponse.redirect(new URL("/", request.url));
    }
    return response;
  }

  // Add cache control only for protected routes (not all routes)
  if (
    protectedRoutes.some((route) => pathname.startsWith(route)) ||
    pathname === "/"
  ) {
    response.headers.set("Cache-Control", "no-cache, must-revalidate");
  }

  // Protected routes - require authentication
  if (
    protectedRoutes.some((route) => pathname.startsWith(route)) &&
    !isLoggedIn
  ) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // Home page - redirect to login if not authenticated
  if (pathname === "/" && !isLoggedIn) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return response;
}

export const config = {
  matcher: [
    "/",
    "/dashboard/:path*",
    "/settings/:path*",
    "/likedvideos/:path*",
    "/history/:path*",
    "/playlists/:path*",
    "/subscriptions/:path*",
    "/tweets/:path*",
    "/login",
    "/register",
  ],
};
