"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { apiClient } from "@/lib/apiClient";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const data = await apiClient.auth.login({ email, password });
      
      // Save token directly to cookies so Server Components can read it
      document.cookie = `token=${data.token}; path=/; max-age=86400; SameSite=Lax`;
      
      router.push("/");
      router.refresh(); // Refresh to update server components like the Header
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 font-sans">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-xl shadow-slate-200/50 p-8 border border-slate-100">
        <div className="text-center mb-8">
          <Link href="/" className="text-2xl font-black text-blue-600 tracking-tight block mb-2">
            COLLEGEFIND
          </Link>
          <h1 className="text-2xl font-bold text-slate-900">Welcome back</h1>
          <p className="text-slate-500 text-sm mt-2">Enter your credentials to access your account</p>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded-xl text-sm font-medium mb-6 text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-5">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700">Email Address</label>
            <input 
              type="email" 
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 transition-all text-slate-900"
              placeholder="you@example.com"
            />
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700">Password</label>
            <input 
              type="password" 
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 transition-all text-slate-900"
              placeholder="••••••••"
            />
          </div>

          <Button 
            type="submit" 
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-xl py-6 text-base font-semibold shadow-md shadow-blue-600/20 transition-all mt-4"
          >
            {loading ? "Signing in..." : "Sign in"}
          </Button>
        </form>

        <p className="text-center text-sm text-slate-500 mt-8 font-medium">
          Don't have an account?{" "}
          <Link href="/register" className="text-blue-600 hover:underline font-semibold">
            Create one
          </Link>
        </p>
      </div>
    </div>
  );
}
