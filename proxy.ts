import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { SESSION_COOKIES } from "./lib/session-cookies";
import type { UserRole } from "./types/auth";

const HOME_FOR_ROLE: Record<UserRole, string> = {
  CANDIDATE: "/candidate",
  CLIENT: "/dashboard",
  ADMIN: "/admin",
};

// Reachable whether or not someone is signed in: a link from an email can be opened in any browser.
const AUTH_BYPASS_PATHS = ["/auth/email-verified", "/auth/reset-password"];

const CLIENT_ONLY = ["/dashboard", "/company-details"];

export default function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const rawType = request.cookies.get(SESSION_COOKIES.type)?.value;
  const sessionType = rawType && Object.hasOwn(HOME_FOR_ROLE, rawType) ? (rawType as UserRole) : undefined;
  const signedIn = !!sessionType && !!request.cookies.get(SESSION_COOKIES.refresh)?.value;

  const redirectTo = (path: string) => NextResponse.redirect(new URL(path, request.url));

  const redirectToSignin = () => {
    const url = new URL(pathname.startsWith("/admin") ? "/admin/auth/signin" : "/auth/signin", request.url);
    url.searchParams.set("callbackUrl", pathname + request.nextUrl.search);
    return NextResponse.redirect(url);
  };

  const gate = (role: UserRole) => {
    if (!signedIn) return redirectToSignin();
    if (sessionType !== role) return redirectTo(HOME_FOR_ROLE[sessionType]);
    return NextResponse.next();
  };

  if (AUTH_BYPASS_PATHS.some((path) => pathname.startsWith(path))) return NextResponse.next();

  if (pathname.startsWith("/auth") || pathname.startsWith("/admin/auth")) {
    return signedIn ? redirectTo(HOME_FOR_ROLE[sessionType]) : NextResponse.next();
  }

  if (pathname.startsWith("/admin")) return gate("ADMIN");
  if (pathname.startsWith("/candidate")) return gate("CANDIDATE");
  if (CLIENT_ONLY.some((path) => pathname.startsWith(path))) return gate("CLIENT");

  return NextResponse.next();
}

// "/" and the pool are public, so they are not matched.
export const config = {
  matcher: ["/auth/:path*", "/admin/:path*", "/candidate/:path*", "/dashboard/:path*", "/company-details"],
};
