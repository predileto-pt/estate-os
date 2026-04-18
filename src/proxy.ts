import { NextRequest, NextResponse } from "next/server";
import { createServerClient, type CookieMethodsServer } from "@supabase/ssr";

const publicPaths = ["/login", "/register"];
const protectedSubpaths = ["/register/onboarding"];

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip static assets (files with extensions)
  if (pathname.includes(".")) {
    return NextResponse.next();
  }

  const isApi = pathname.startsWith("/api/");

  // --- Supabase session refresh (runs for both UI and /api/*) ---
  let response = NextResponse.next({ request });

  const cookieMethods: CookieMethodsServer = {
    getAll: () => request.cookies.getAll(),
    setAll: (cookiesToSet) => {
      cookiesToSet.forEach(({ name, value }) =>
        request.cookies.set(name, value),
      );
      response = NextResponse.next({ request });
      cookiesToSet.forEach(({ name, value, options }) =>
        response.cookies.set(name, value, options),
      );
    },
  };

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY!,
    { cookies: cookieMethods },
  );

  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError && process.env.NODE_ENV === "development") {
    console.error("[proxy] getUser error:", authError.message);
  }

  // API requests: session is refreshed, let them pass through
  if (isApi) {
    return response;
  }

  // --- Auth gates (UI only) ---
  const isProtectedSubpath = protectedSubpaths.some(
    (p) => pathname === p || pathname.startsWith(`${p}/`),
  );

  const isPublicPath =
    !isProtectedSubpath &&
    publicPaths.some(
      (p) => pathname === p || pathname.startsWith(`${p}/`),
    );

  // Authenticated users on login/register → redirect to dashboard
  if (user && isPublicPath) {
    const url = request.nextUrl.clone();
    url.pathname = "/dashboard";
    return withRefreshedCookies(NextResponse.redirect(url), response);
  }

  // Unauthenticated users on protected paths → redirect to login
  if (!user && !isPublicPath) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    return withRefreshedCookies(NextResponse.redirect(url), response);
  }

  return response;
}

// Propagate any cookies Supabase wrote during getUser() (token rotation)
// onto a redirect response so the new tokens reach the client.
function withRefreshedCookies(
  target: NextResponse,
  source: NextResponse,
): NextResponse {
  source.cookies.getAll().forEach((cookie) => target.cookies.set(cookie));
  return target;
}

export const config = {
  matcher: ["/((?!_next|auth|favicon.ico).*)"],
};
