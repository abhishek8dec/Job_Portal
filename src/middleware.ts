import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// In-memory sliding window rate limiter
interface ClientHistory {
  count: number;
  resetAt: number;
}

const clientWindows = new Map<string, ClientHistory>();

// Periodic cleanup every 60 seconds to prevent memory leaks
let lastCleanup = Date.now();
function cleanupExpired() {
  const now = Date.now();
  if (now - lastCleanup < 60_000) return;
  lastCleanup = now;

  for (const [ip, history] of clientWindows.entries()) {
    if (now > history.resetAt) {
      clientWindows.delete(ip);
    }
  }
}

// Generous thresholds calibrated for 1,000+ simultaneous users & legitimate multi-tab usage
const WINDOW_MS = 60_000; // 1-minute window
const MAX_REQUESTS_PER_WINDOW = 300; // 300 requests per minute per IP

export function middleware(request: NextRequest) {
  cleanupExpired();

  // Extract client IP address or forwarded header
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0].trim() ||
    request.headers.get("x-real-ip") ||
    "127.0.0.1";

  const now = Date.now();
  let clientHistory = clientWindows.get(ip);

  if (!clientHistory || now > clientHistory.resetAt) {
    clientHistory = {
      count: 1,
      resetAt: now + WINDOW_MS,
    };
    clientWindows.set(ip, clientHistory);
  } else {
    clientHistory.count++;
  }

  // If client exceeds rate quota, gracefully respond with 429
  if (clientHistory.count > MAX_REQUESTS_PER_WINDOW) {
    const retryAfter = Math.ceil((clientHistory.resetAt - now) / 1000);
    return new NextResponse(
      JSON.stringify({
        error: "Too Many Requests",
        message: "High concurrency protection activated. Please wait a few seconds before retrying.",
        retryAfter,
      }),
      {
        status: 429,
        headers: {
          "Content-Type": "application/json",
          "Retry-After": String(retryAfter),
        },
      }
    );
  }

  // Pass through with high-concurrency security & caching headers
  const response = NextResponse.next();

  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("X-Frame-Options", "SAMEORIGIN");
  response.headers.set("X-RateLimit-Limit", String(MAX_REQUESTS_PER_WINDOW));
  response.headers.set("X-RateLimit-Remaining", String(Math.max(0, MAX_REQUESTS_PER_WINDOW - clientHistory.count)));

  return response;
}

// Only apply rate-limiting & performance headers to API routes and dynamic pages
export const config = {
  matcher: [
    "/api/:path*",
    "/recruiter/:path*",
    "/candidate/:path*",
    "/interview/:path*",
  ],
};
