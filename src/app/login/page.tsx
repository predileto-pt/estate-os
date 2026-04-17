"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { useDictionary } from "@/components/dictionary-provider";
import { GoogleIcon } from "@/components/ui/google-icon";

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const dict = useDictionary();
  const d = dict.dashboard;
  const initialError = (() => {
    const err = searchParams.get("error");
    if (err === "registration_failed") return d.loginError;
    return err ?? "";
  })();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(initialError);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const supabase = createClient();
    const { error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (authError) {
      setError(d.loginError);
      setLoading(false);
      return;
    }

    router.push("/dashboard");
    router.refresh();
  }

  async function handleGoogleLogin() {
    const supabase = createClient();
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback?next=/dashboard`,
      },
    });
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-full max-w-sm border border-gray-200 bg-white p-6">
        <h1 className="text-lg font-bold font-heading mb-6">{d.login}</h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs text-gray-400 mb-1">{d.email}</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:border-gray-400"
            />
          </div>
          <div>
            <label className="block text-xs text-gray-400 mb-1">{d.password}</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:border-gray-400"
            />
          </div>
          {error && <p className="text-xs text-red-600">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gray-900 text-white py-2 text-sm font-heading hover:bg-gray-800 disabled:opacity-50"
          >
            {d.login}
          </button>
        </form>

        <div className="my-4 border-t border-gray-200" />

        <button
          onClick={handleGoogleLogin}
          className="w-full flex items-center justify-center gap-2 border border-gray-200 py-2 text-sm font-heading hover:bg-gray-50"
        >
          <GoogleIcon />
          {d.signInWithGoogle}
        </button>

        <p className="mt-4 text-xs text-gray-400 text-center">
          {d.noAccount}{" "}
          <Link href="/register" className="text-blue-600 underline underline-offset-2">
            {d.register}
          </Link>
        </p>
      </div>
    </div>
  );
}
