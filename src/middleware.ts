import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifyToken } from "@/lib/auth";

const PUBLIC_ROUTES = ["/sign-in", "/sign-up", "/"];
const PUBLIC_PREFIXES = ["/api/auth"];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isPublicRoute = PUBLIC_ROUTES.some((route) =>
    pathname === route || pathname.startsWith(route + "/")
  );
  const isPublicApi = PUBLIC_PREFIXES.some((prefix) =>
    pathname.startsWith(prefix)
  );
  // Routes where logged-in users should be redirected to /dashboard
  const shouldRedirectIfAuthenticated =
    pathname === "/" ||
    ["/sign-in", "/sign-up"].some((r) => pathname.startsWith(r));

  if (isPublicApi) {
    return NextResponse.next();
  }

  const token = request.cookies.get("session")?.value;
  const session = token ? await verifyToken(token) : null;

  if (!isPublicRoute && !session) {
    const signInUrl = new URL("/sign-in", request.url);
    return NextResponse.redirect(signInUrl);
  }

  if (shouldRedirectIfAuthenticated && session) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
