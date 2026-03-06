"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { useDictionary } from "@/components/dictionary-provider";
import { GoogleIcon } from "@/components/ui/google-icon";

export default function RegisterPage() {
  const { locale } = useParams<{ locale: string }>();
  const router = useRouter();
  const dict = useDictionary();
  const d = dict.dashboard;
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError(d.passwordMismatch);
      return;
    }

    setLoading(true);

    const supabase = createClient();
    const { error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback?next=/${locale}/dashboard`,
      },
    });

    if (authError) {
      setError(authError.message);
      setLoading(false);
      return;
    }

    router.push(`/${locale}/dashboard`);
    router.refresh();
  }

  async function handleGoogleSignUp() {
    const supabase = createClient();
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback?next=/${locale}/dashboard`,
      },
    });
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-full max-w-sm border border-gray-200 bg-white p-6">
        <h1 className="text-lg font-bold font-heading mb-6">{d.register}</h1>

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
              minLength={6}
              className="w-full border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:border-gray-400"
            />
          </div>
          <div>
            <label className="block text-xs text-gray-400 mb-1">{d.confirmPassword}</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              minLength={6}
              className="w-full border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:border-gray-400"
            />
          </div>
          {error && <p className="text-xs text-red-600">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gray-900 text-white py-2 text-sm font-heading hover:bg-gray-800 disabled:opacity-50"
          >
            {d.register}
          </button>
        </form>

        <div className="my-4 border-t border-gray-200" />

        <button
          onClick={handleGoogleSignUp}
          className="w-full flex items-center justify-center gap-2 border border-gray-200 py-2 text-sm font-heading hover:bg-gray-50"
        >
          <GoogleIcon />
          {d.signInWithGoogle}
        </button>

        <p className="mt-4 text-xs text-gray-400 text-center">
          {d.hasAccount}{" "}
          <Link href={`/${locale}/login`} className="text-blue-600 underline underline-offset-2">
            {d.login}
          </Link>
        </p>
      </div>
    </div>
  );
}
