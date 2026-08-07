import { NextResponse, type NextRequest } from "next/server";

// Extensions served directly from /public — never require auth.
const PUBLIC_FILE = /\.(?:svg|png|jpg|jpeg|gif|ico|webp|txt|xml|json|woff2?|ttf|otf|eot|mp4|webm)$/i;

// Route prefixes that are always public.
const PUBLIC_PATHS = ["/login", "/access-denied", "/auth-error", "/api/auth", "/api/healthcheck"];

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Pass through static public files (robots.txt, sitemap.xml, images, fonts…)
  if (PUBLIC_FILE.test(pathname)) return NextResponse.next();

  // Pass through explicitly public routes
  if (PUBLIC_PATHS.some((p) => pathname === p || pathname.startsWith(p + "/"))) {
    return NextResponse.next();
  }

  // Use __Secure- prefix only on actual HTTPS, not just NODE_ENV=production.
  const secure = req.nextUrl.protocol === "https:";
  const baseName = `${secure ? "__Secure-" : ""}authjs.session-token`;
  const allCookies = req.cookies.getAll();
  const hasSession = allCookies.some(
    (c) => c.name === baseName || c.name.startsWith(baseName + ".")
  );

  if (!hasSession) {
    const loginUrl = new URL("/login", req.url);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  // Catch everything except Next.js internals and static assets folder.
  matcher: ["/((?!_next/static|_next/image).*)" ],
};
