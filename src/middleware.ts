import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  // Get the pathname of the request
  const path = request.nextUrl.pathname;

  // Define protected routes that require authentication
  const isAdminRoute = path.startsWith("/admin");
  const isLoginPage = path === "/admin/login";

  // Get the token from the cookies
  const token = request.cookies.get("admin_token")?.value;

  // Allow access to login page without token
  if (isLoginPage) {
    return NextResponse.next();
  }

  // Redirect to login if accessing protected route without token
  if (isAdminRoute && !token) {
    const loginUrl = new URL("/admin/login", request.url);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

// Configure the paths that should be matched by this middleware
export const config = {
  matcher: ["/admin/:path*"],
};
