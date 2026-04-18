import { NextRequest, NextResponse } from "next/server";
import { createServerClient, type CookieMethodsServer } from "@supabase/ssr";

const API_URL = process.env.API_URL || "http://localhost";

export async function GET(request: NextRequest) {
  const { searchParams, origin } = request.nextUrl;
  const code = searchParams.get("code");
  const error = searchParams.get("error_description");
  const next = searchParams.get("next") ?? "/dashboard";

  // Registration params passed from the register page
  const registerName = searchParams.get("name");
  const registerEmail = searchParams.get("email");

  if (error) {
    console.error("[auth/callback] OAuth error:", error);
    const url = new URL(`${origin}/login`);
    url.searchParams.set("error", error);
    return NextResponse.redirect(url);
  }

  if (code) {
    const response = NextResponse.redirect(`${origin}${next}`);

    const cookieMethods: CookieMethodsServer = {
      getAll: () => request.cookies.getAll(),
      setAll: (cookiesToSet) => {
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

    const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);
    // Flush the macrotask queue so @supabase/ssr's onAuthStateChange
    // listener can persist session cookies before the response is sent.
    // See: https://github.com/supabase/supabase-js/issues/2037
    await new Promise((resolve) => setTimeout(resolve, 0));

    if (exchangeError) {
      return NextResponse.redirect(`${origin}/login`);
    }

    const {
      data: { session },
    } = await supabase.auth.getSession();

    // Register user in backend if coming from the registration flow
    const isRegistrationFlow = registerName || next.includes("/register/onboarding");
    if (isRegistrationFlow && session) {
      const userName = registerName || session.user.user_metadata?.full_name || session.user.user_metadata?.name || "";
      const email = registerEmail || session.user.email || "";
      try {
        const res = await fetch(`${API_URL}/api/v1/admin/auth/register`, {
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
          console.error(
            "[auth/callback] Backend register failed:",
            res.status,
            await res.text(),
          );
          // Clear the dangling Supabase session so the user can retry cleanly.
          await supabase.auth.signOut();
          const errorUrl = new URL(`${origin}/login`);
          errorUrl.searchParams.set("error", "registration_failed");
          const errorResponse = NextResponse.redirect(errorUrl);
          response.cookies
            .getAll()
            .forEach((cookie) => errorResponse.cookies.set(cookie));
          return errorResponse;
        }
      } catch (err) {
        console.error("[auth/callback] Backend register error:", err);
        await supabase.auth.signOut();
        const errorUrl = new URL(`${origin}/login`);
        errorUrl.searchParams.set("error", "registration_failed");
        const errorResponse = NextResponse.redirect(errorUrl);
        response.cookies
          .getAll()
          .forEach((cookie) => errorResponse.cookies.set(cookie));
        return errorResponse;
      }
    }

    // Fetch and cache organization_id in a cookie to avoid repeated /auth/me calls
    if (session) {
      try {
        const meRes = await fetch(`${API_URL}/api/v1/admin/auth/me`, {
          headers: { Authorization: `Bearer ${session.access_token}` },
        });
        if (meRes.ok) {
          const me = await meRes.json();
          const orgId = me.user?.organization_id;
          if (orgId) {
            response.cookies.set("organization_id", orgId, {
              path: "/",
              httpOnly: true,
              secure: process.env.NODE_ENV === "production",
              sameSite: "lax",
              maxAge: 60 * 60 * 24 * 30, // 30 days
            });
          }
        }
      } catch (err) {
        console.error("[auth/callback] Failed to fetch organization_id:", err);
      }
    }

    return response;
  }

  return NextResponse.redirect(`${origin}/login`);
}
