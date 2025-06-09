import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const publicRoutes = ["/login", "/register"];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Normalize pathname (remove trailing slash except for root)
  const normalizedPathname =
    pathname !== "/" && pathname.endsWith("/")
      ? pathname.slice(0, -1)
      : pathname;

  const isPublicRoute = publicRoutes.includes(normalizedPathname);
  // Get authentication tokens
  const accessToken = request.cookies.get("accessToken")?.value;
  const refreshToken = request.cookies.get("refreshToken")?.value;
  const isLoggedIn = !!(accessToken || refreshToken);

  // Check for auth flags
  const isAuthRedirect = request.nextUrl.searchParams.has("auth");
  
  // Create a response that we can modify
  const response = NextResponse.next();
  // If this is the home route and we have auth param, set an auth cookie and proceed
  if (normalizedPathname === "/" && isAuthRedirect) {
    // Set a special session cookie to maintain authentication
    response.cookies.set("authSession", "true", {
      path: "/",
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
    });
    return response;
  }
  // Check for our auth session cookie
  const hasAuthSession = request.cookies.get("authSession")?.value;
  // If not logged in and trying to access protected route
  if (!isLoggedIn && !isPublicRoute && !hasAuthSession) {
    return NextResponse.redirect(new URL("/login", request.url));
  }
  // If logged in and trying to access auth pages
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
