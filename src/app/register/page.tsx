"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { apiClient } from "@/lib/apiClient";
import { Camera, User, CheckCircle2, Loader2 } from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [avatar, setAvatar] = useState("");
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setError("");

    try {
      const res = await apiClient.upload.image(file);
      if (res.url) {
        setAvatar(res.url);
      }
    } catch (err: any) {
      setError(err.message || "Failed to upload profile picture");
    } finally {
      setUploading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      await apiClient.auth.register({ 
        email, 
        password,
        name: name.trim() || undefined,
        avatar: avatar || undefined
      });
      setSuccess("Account created successfully! Redirecting to login...");
      
      setTimeout(() => {
        router.push("/login");
      }, 1500);
      
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 font-sans py-12">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-xl shadow-slate-200/50 p-8 border border-slate-100">
        <div className="text-center mb-8">
          <Link href="/" className="text-2xl font-black text-blue-600 tracking-tight block mb-2">
            COLLEGEFIND
          </Link>
          <h1 className="text-2xl font-bold text-slate-900">Create an account</h1>
          <p className="text-slate-500 text-sm mt-2">Sign up to start saving and comparing colleges</p>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded-xl text-sm font-medium mb-6 text-center animate-in fade-in">
            {error}
          </div>
        )}

        {success && (
          <div className="bg-emerald-50 text-emerald-600 p-3 rounded-xl text-sm font-medium mb-6 text-center animate-in fade-in">
            {success}
          </div>
        )}

        <form onSubmit={handleRegister} className="space-y-5">
          {/* Avatar Upload Dropzone/Circular Button */}
          <div className="flex flex-col items-center justify-center space-y-2 mb-6">
            <div className="relative group w-24 h-24 rounded-full border border-slate-200 bg-slate-50 flex items-center justify-center overflow-hidden cursor-pointer shadow-inner">
              {avatar ? (
                <img src={avatar} alt="Profile preview" className="w-full h-full object-cover" />
              ) : uploading ? (
                <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
              ) : (
                <User className="w-10 h-10 text-slate-400" />
              )}
              
              <label className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all cursor-pointer">
                <Camera className="w-6 h-6 text-white" />
                <input 
                  type="file" 
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                  disabled={uploading}
                />
              </label>
            </div>
            <span className="text-xs text-slate-500 font-semibold">
              {avatar ? "Change Profile Picture" : "Upload Profile Picture"}
            </span>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700">Full Name</label>
            <input 
              type="text" 
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 transition-all text-slate-900"
              placeholder="e.g. John Doe"
            />
          </div>

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
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 transition-all text-slate-900"
              placeholder="••••••••"
            />
            <p className="text-xs text-slate-500 mt-1">Must be at least 6 characters</p>
          </div>

          <Button 
            type="submit" 
            disabled={loading || uploading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-xl py-6 text-base font-semibold shadow-md shadow-blue-600/20 transition-all mt-4"
          >
            {loading ? "Creating account..." : "Create Account"}
          </Button>
        </form>

        <p className="text-center text-sm text-slate-500 mt-8 font-medium">
          Already have an account?{" "}
          <Link href="/login" className="text-blue-600 hover:underline font-semibold">
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
}
