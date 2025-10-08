import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import * as jose from "jose";

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET);

async function verifyToken(token: string) {
  try {
    const { payload } = await jose.jwtVerify(token, JWT_SECRET);
    return payload; 
  } catch (e) {
    console.error("verify error:", e);
    return null;
  }
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isLoginPage = pathname === "/";
  const isBuyerRoute = pathname.startsWith("/buyer3");

  const token = request.cookies.get("token")?.value;
  const user = token ? await verifyToken(token) : null;
  console.log("user??", user);
  const isAuthenticated = !!user;

  // 🚨 Not authenticated → redirect to login
  if (isBuyerRoute && !isLoginPage && !isAuthenticated) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  // 🚨 Already authenticated but visiting login page → redirect to dashboard
  if (isLoginPage && isAuthenticated) {
    return NextResponse.redirect(new URL("/buyer3/dashboard", request.url));
  }

  // ✅ If authenticated, attach user data in headers for backend
  const response = NextResponse.next();
  if (user) {
    response.headers.set("x-user", JSON.stringify(user));
  }

  return response;
}

export const config = {
  matcher: ["/buyer3/:path*", "/admin/:path*"],
};
