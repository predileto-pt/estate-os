import { NextRequest, NextResponse } from "next/server";
import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { locales, defaultLocale } from "@/lib/i18n";

const publicPaths = ["/login", "/register"];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip static files and auth callback
  if (
    pathname.startsWith("/_next/") ||
    pathname.startsWith("/auth/") ||
    pathname.includes(".")
  ) {
    return NextResponse.next();
  }

  // --- Locale redirect for bare paths ---
  const hasLocale = locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`,
  );

  if (!hasLocale) {
    const url = request.nextUrl.clone();
    url.pathname = `/${defaultLocale}${pathname === "/" ? "" : pathname}`;
    return NextResponse.redirect(url);
  }

  // --- Supabase session refresh ---
  let response = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet: { name: string; value: string; options: CookieOptions }[]) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value),
          );
          response = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options),
          );
        },
      },
    },
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Extract the path after locale (e.g. /pt/login → /login)
  const localeSegment = pathname.split("/")[1];
  const pathAfterLocale =
    pathname.replace(`/${localeSegment}`, "") || "/";

  const isPublicPath = publicPaths.some(
    (p) => pathAfterLocale === p || pathAfterLocale.startsWith(`${p}/`),
  );

  // Authenticated users on login/register → redirect to dashboard
  if (user && isPublicPath) {
    const url = request.nextUrl.clone();
    url.pathname = `/${localeSegment}/dashboard`;
    return NextResponse.redirect(url);
  }

  // Unauthenticated users on protected paths → redirect to login
  if (!user && !isPublicPath) {
    const url = request.nextUrl.clone();
    url.pathname = `/${localeSegment}/login`;
    return NextResponse.redirect(url);
  }

  return response;
}

export const config = {
  matcher: ["/((?!_next|auth|favicon.ico).*)"],
};
