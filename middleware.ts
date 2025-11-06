import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Redirect root to mini-app
  if (pathname === "/") {
    return NextResponse.redirect(new URL("/mini-app", request.url))
  }

  // Redirect old routes
  if (pathname === "/user" || pathname.startsWith("/user/")) {
    return NextResponse.redirect(new URL("/mini-app", request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/", "/user/:path*"],
}
