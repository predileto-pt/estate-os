import { NextRequest, NextResponse } from "next/server";
import { createServerClient, type CookieOptions } from "@supabase/ssr";

export async function GET(request: NextRequest) {
  const { searchParams, origin } = request.nextUrl;
  const code = searchParams.get("code");
  const error = searchParams.get("error_description");
  const next = searchParams.get("next") ?? "/pt/dashboard";

  if (error) {
    console.error("[auth/callback] OAuth error:", error);
    const url = new URL(`${origin}/pt/login`);
    url.searchParams.set("error", error);
    return NextResponse.redirect(url);
  }

  if (code) {
    const response = NextResponse.redirect(`${origin}${next}`);

    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY!,
      {
        cookies: {
          getAll() {
            return request.cookies.getAll();
          },
          setAll(cookiesToSet: { name: string; value: string; options: CookieOptions }[]) {
            cookiesToSet.forEach(({ name, value, options }) =>
              response.cookies.set(name, value, options),
            );
          },
        },
      },
    );

    const { error } = await supabase.auth.exchangeCodeForSession(code);
    // Flush the macrotask queue so @supabase/ssr's onAuthStateChange
    // listener can persist session cookies before the response is sent.
    // See: https://github.com/supabase/supabase-js/issues/2037
    await new Promise((resolve) => setTimeout(resolve, 0));
    if (!error) return response;
  }

  return NextResponse.redirect(`${origin}/pt/login`);
}
