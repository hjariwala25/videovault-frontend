import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const publicRoutes = ["/login", "/register"];

export function middleware(request: NextRequest) {
  // Normalize pathname (remove trailing slash except for root)
  let pathname = request.nextUrl.pathname;
  if (pathname !== "/" && pathname.endsWith("/")) {
    pathname = pathname.slice(0, -1);
  }

  // Only allow exact /login and /register as public
  const isPublicRoute = publicRoutes.includes(pathname);

  // Get authentication tokens
  const accessToken = request.cookies.get("accessToken")?.value;
  const refreshToken = request.cookies.get("refreshToken")?.value;
  const isLoggedIn = !!(accessToken || refreshToken);

  // If not logged in and not on a public route (including "/"), redirect to /login
  if (!isLoggedIn && !isPublicRoute) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // If logged in and trying to access /login or /register, redirect to home
  if (isLoggedIn && isPublicRoute) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    // Match all routes except for:
    // - /api routes
    // - _next/static, _next/image
    // - favicon.ico
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
