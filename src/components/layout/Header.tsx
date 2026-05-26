"use client";

import Link from "next/link";
import { Menu, LogOut, User, GraduationCap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";

export function Header() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [avatar, setAvatar] = useState("");

  useEffect(() => {
    const cookies = document.cookie.split("; ");
    const tokenCookie = cookies.find((row) => row.startsWith("token="));
    if (tokenCookie) {
      setIsLoggedIn(true);
      try {
        const token = tokenCookie.split("=")[1];
        const base64Url = token.split(".")[1];
        const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
        const payload = JSON.parse(atob(base64));
        if (payload.email) setEmail(payload.email);
        if (payload.name) setName(payload.name);
        if (payload.avatar) setAvatar(payload.avatar);
      } catch (err) {
        console.error("Error decoding token in header:", err);
      }
    }
  }, []);

  const handleLogout = () => {
    document.cookie = "token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;";
    setIsLoggedIn(false);
    setEmail("");
    setName("");
    setAvatar("");
    window.location.href = "/";
  };

  const displayName = name || email.split("@")[0];
  const initial = displayName.charAt(0).toUpperCase();

  return (
    <header className="sticky top-0 w-full z-50 bg-white border-b border-slate-100">
      <div className="container mx-auto px-4 h-20 flex items-center justify-between max-w-7xl">
        {/* Logo */}
        <div className="flex items-center gap-12">
          <Link href="/" className="inline-flex items-center gap-2.5 group">
            <div className="w-9 h-9 bg-indigo-600 rounded-xl flex items-center justify-center shadow-md shadow-indigo-200 group-hover:bg-indigo-500 transition-colors">
              <GraduationCap className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-black text-slate-900 tracking-tight">
              College<span className="text-indigo-600">Find</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8">
            <Link href="/colleges" className="text-sm font-semibold text-slate-800 hover:text-blue-600 transition-colors">Colleges</Link>
            <Link href="/compare" className="text-sm font-semibold text-slate-800 hover:text-blue-600 transition-colors">Compare</Link>
            <Link href="/discussions" className="text-sm font-semibold text-slate-800 hover:text-blue-600 transition-colors">Discussions</Link>
          </nav>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-6">
          {isLoggedIn ? (
            <div className="flex items-center gap-4">
              <div className="hidden sm:flex items-center gap-3 bg-slate-50 border border-slate-200/60 rounded-full pl-2 pr-4 py-1.5">
                {/* Circular Profile Avatar or Letter Fallback */}
                <div className="w-8 h-8 rounded-full overflow-hidden bg-blue-600 text-white flex items-center justify-center text-sm font-bold shadow-inner border border-white">
                  {avatar ? (
                    <img src={avatar} alt={displayName} className="w-full h-full object-cover" />
                  ) : (
                    initial
                  )}
                </div>
                <span className="text-xs font-bold text-slate-700">{displayName}</span>
              </div>
              <Button
                onClick={handleLogout}
                variant="outline"
                className="border-red-200 hover:bg-red-50 text-red-600 rounded-full px-6 py-5 text-sm font-semibold"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>
          ) : (
            <Link href="/login">
              <Button className="bg-blue-600 hover:bg-blue-700 text-white rounded-full px-8 py-5 text-sm font-semibold transition-all shadow-md shadow-blue-600/20">
                Login
              </Button>
            </Link>
          )}


          <Button variant="ghost" size="icon" className="md:hidden text-slate-600">
            <Menu className="w-6 h-6" />
          </Button>
        </div>
      </div>
    </header>
  );
}
