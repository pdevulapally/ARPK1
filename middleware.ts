import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { isBlockedUserAgent } from "@/lib/security"

export function middleware(request: NextRequest) {
  const userAgent = request.headers.get("user-agent") || ""
  const url = request.nextUrl

  // Apply to payment-related and API endpoints
  const path = url.pathname
  const sensitive = path.startsWith("/api/") || path.startsWith("/app/actions/") || path.startsWith("/payment") || path.startsWith("/api/stripe")

  if (sensitive && isBlockedUserAgent(userAgent)) {
    return new NextResponse("Blocked", { status: 403 })
  }

  const response = NextResponse.next()

  // Basic security headers
  response.headers.set("X-Frame-Options", "DENY")
  response.headers.set("X-Content-Type-Options", "nosniff")
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin")
  response.headers.set(
    "Permissions-Policy",
    [
      "accelerometer=()",
      "camera=()",
      "geolocation=()",
      "gyroscope=()",
      "magnetometer=()",
      "microphone=()",
      "payment=(self)",
      "usb=()",
    ].join(", ")
  )

  return response
}

export const config = {
  matcher: [
    "/api/:path*",
    "/payment/:path*",
    "/",
    "/(app|dashboard|admin|nhsf|pricing|contact|portfolio|about)/:path*",
  ],
}