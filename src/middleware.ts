import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Define which routes are publicly accessible without login
const publicRoutes = ["/login", "/register"];

// Routes that should redirect to login if user is not authenticated
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

  // Check if user is logged in by examining the access token
  const accessToken = request.cookies.get("accessToken")?.value;
  const isLoggedIn = !!accessToken;

  // Always allow access to public routes
  if (publicRoutes.some((route) => pathname.startsWith(route))) {
    return NextResponse.next();
  }

  // Redirect to login if trying to access protected routes without authentication
  if (
    protectedRoutes.some((route) => pathname.startsWith(route)) &&
    !isLoggedIn
  ) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // For home page, decide based on authentication status
  if (pathname === "/" && !isLoggedIn) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

// Configure middleware to run on specific paths
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
