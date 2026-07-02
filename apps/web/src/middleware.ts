// ============================================
// MIDDLEWARE
// Protects routes from unauthenticated access
// Runs on every request before the page loads
// ============================================

import { NextRequest, NextResponse } from "next/server"

// Routes that do not need authentication
const publicRoutes = ["/","/login", "/register", "/onboarding"]

// Routes that are only for guests (redirect to dashboard if logged in)
const guestRoutes = ["/login", "/register"]

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Check if user has a session cookie
  const sessionToken =
    request.cookies.get("better-auth.session_token")?.value ??
    request.cookies.get("__Secure-better-auth.session_token")?.value

  const isPublicRoute = publicRoutes.some((route) =>
    pathname.startsWith(route)
  )

  const isGuestRoute = guestRoutes.some((route) =>
    pathname.startsWith(route)
  )

  // If no session and trying to access protected route
  if (!sessionToken && !isPublicRoute) {
    return NextResponse.redirect(new URL("/login", request.url))
  }

  // If has session and trying to access guest route
  if (sessionToken && isGuestRoute) {
    return NextResponse.redirect(new URL("/dashboard", request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
}