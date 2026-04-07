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
    return null;
  }
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isLoginPage = pathname === "/buyer-login";
  const isBuyerRoute = pathname.startsWith("/buyer-route");

  const token = request.cookies.get("token")?.value;
  const user = token ? await verifyToken(token) : null;
  const isAuthenticated = !!user;

  const userData = (user as any)?.data;
  const approved = userData?.approved;
  const isSeller = approved === '1' || approved === 1;  // seller
  const isBuyer = approved === '0' || approved === 0;   // buyer

  // 🚨 Not logged in → redirect to login
  if (isBuyerRoute && !isAuthenticated) {
    const response = NextResponse.redirect(new URL("/buyer-login", request.url));
    response.cookies.delete("token");
    return response;
  }

  // ✅ Logged in as buyer or seller → allow access to all buyer-route pages
  if (isBuyerRoute && isAuthenticated) {
    const response = NextResponse.next();
    if (user) {
      response.headers.set("x-user", JSON.stringify(user));
    }
    return response;
  }

  // ✅ On login page:
  if (isLoginPage && isAuthenticated) {
    if (isSeller) {
      // Seller → go to dashboard
      return NextResponse.redirect(new URL("/buyer-route/dashboard", request.url));
    }
    if (isBuyer) {
      // Buyer → go to home
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  const response = NextResponse.next();
  if (user) {
    response.headers.set("x-user", JSON.stringify(user));
  }

  return response;
}

export const config = {
  matcher: ["/buyer-route/:path*", "/admin/:path*", "/buyer-login"],
};