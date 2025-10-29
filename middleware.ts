import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import * as jose from "jose";

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET);

async function verifyToken(token: string) {
  try {
    const { payload } = await jose.jwtVerify(token, JWT_SECRET);
    return payload;
  } catch (e: any) {
    console.error("verify error:", e);
    return null; // invalid or expired
  }
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isLoginPage = pathname === "/";
  const isBuyerRoute = pathname.startsWith("/buyer3");

  const token = request.cookies.get("token")?.value;
  const user = token ? await verifyToken(token) : null;
  const isAuthenticated = !!user;

  // 🚨 Redirect to home if trying to access buyer routes without valid token
  if (isBuyerRoute && !isLoginPage && !isAuthenticated) {
    const response = NextResponse.redirect(new URL("/", request.url));
    response.cookies.delete("token"); // remove expired token
    return response;
  }

  // 🚨 Already authenticated but on login page
  if (isLoginPage && isAuthenticated) {
    return NextResponse.redirect(new URL("/buyer3/dashboard", request.url));
  }

  // ✅ Continue with request and pass user header
  const response = NextResponse.next();
  if (user) {
    response.headers.set("x-user", JSON.stringify(user));
  }

  return response;
}

export const config = {
  matcher: ["/buyer3/:path*", "/admin/:path*"],
};
