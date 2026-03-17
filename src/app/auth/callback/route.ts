import { NextRequest, NextResponse } from "next/server";
import { createServerClient, type CookieOptions } from "@supabase/ssr";

const CORE_API_URL = process.env.CORE_API_URL || "http://localhost:8000";

export async function GET(request: NextRequest) {
  const { searchParams, origin } = request.nextUrl;
  const code = searchParams.get("code");
  const error = searchParams.get("error_description");
  const next = searchParams.get("next") ?? "/pt/dashboard";

  // Registration params passed from the register page
  const registerName = searchParams.get("name");
  const registerEmail = searchParams.get("email");

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

    const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);
    // Flush the macrotask queue so @supabase/ssr's onAuthStateChange
    // listener can persist session cookies before the response is sent.
    // See: https://github.com/supabase/supabase-js/issues/2037
    await new Promise((resolve) => setTimeout(resolve, 0));

    if (exchangeError) {
      return NextResponse.redirect(`${origin}/pt/login`);
    }

    // Register user in backend if coming from the registration flow
    const isRegistrationFlow = registerName || next.includes("/register/onboarding");
    if (isRegistrationFlow) {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (session) {
        const userName = registerName || session.user.user_metadata?.full_name || session.user.user_metadata?.name || "";
        const email = registerEmail || session.user.email || "";
        try {
          const res = await fetch(`${CORE_API_URL}/api/v1/auth/register`, {
            method: "POST",
            headers: {
              Authorization: `Bearer ${session.access_token}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              name: userName,
              email,
            }),
          });

          // 409 = already registered, that's fine
          if (!res.ok && res.status !== 409) {
            console.error("[auth/callback] Backend register failed:", res.status, await res.text());
          }
        } catch (err) {
          console.error("[auth/callback] Backend register error:", err);
        }
      }
    }

    return response;
  }

  return NextResponse.redirect(`${origin}/pt/login`);
}
