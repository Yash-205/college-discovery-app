"use client";

import Link from "next/link";
import { Menu, LogOut, GraduationCap, ChevronDown, Building, Map, GraduationCap as Cap, BookOpen, Users, Trophy } from "lucide-react";
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
          <nav className="hidden md:flex items-center gap-1">
            {/* Dropdown: College Search */}
            <div className="relative group px-3 py-2">
              <button className="flex items-center gap-1 text-sm font-bold text-slate-700 hover:text-blue-600 transition-colors">
                College Search <ChevronDown className="w-4 h-4 text-slate-400 group-hover:text-blue-600 transition-colors group-hover:rotate-180 duration-300" />
              </button>
              
              {/* Dropdown Menu */}
              <div className="absolute top-full left-0 mt-2 w-64 bg-white rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible translate-y-2 group-hover:translate-y-0 transition-all duration-300 z-50">
                <div className="p-3 flex flex-col gap-1">
                  <Link href="/colleges" className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 transition-colors group/item">
                    <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center group-hover/item:bg-blue-600 group-hover/item:text-white transition-colors">
                      <Building className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-sm font-bold text-slate-900">All Colleges</div>
                      <div className="text-xs text-slate-500 font-medium">Search by cost & major</div>
                    </div>
                  </Link>
                  <Link href="/colleges?location=Mumbai" className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 transition-colors group/item">
                    <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover/item:bg-emerald-600 group-hover/item:text-white transition-colors">
                      <Map className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-sm font-bold text-slate-900">By Location</div>
                      <div className="text-xs text-slate-500 font-medium">Find colleges near you</div>
                    </div>
                  </Link>
                  <Link href="/colleges" className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 transition-colors group/item">
                    <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center group-hover/item:bg-amber-600 group-hover/item:text-white transition-colors">
                      <Trophy className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-sm font-bold text-slate-900">Top Rated</div>
                      <div className="text-xs text-slate-500 font-medium">Colleges by ranking</div>
                    </div>
                  </Link>
                </div>
              </div>
            </div>

            {/* Dropdown: Guidance */}
            <div className="relative group px-3 py-2">
              <button className="flex items-center gap-1 text-sm font-bold text-slate-700 hover:text-blue-600 transition-colors">
                Guidance <ChevronDown className="w-4 h-4 text-slate-400 group-hover:text-blue-600 transition-colors group-hover:rotate-180 duration-300" />
              </button>
              
              <div className="absolute top-full left-0 mt-2 w-64 bg-white rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible translate-y-2 group-hover:translate-y-0 transition-all duration-300 z-50">
                <div className="p-3 flex flex-col gap-1">
                  <Link href="/discussions" className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 transition-colors group/item">
                    <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center group-hover/item:bg-purple-600 group-hover/item:text-white transition-colors">
                      <Users className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-sm font-bold text-slate-900">Discussions</div>
                      <div className="text-xs text-slate-500 font-medium">Real student voices</div>
                    </div>
                  </Link>
                  <Link href="/compare" className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 transition-colors group/item">
                    <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center group-hover/item:bg-indigo-600 group-hover/item:text-white transition-colors">
                      <BookOpen className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-sm font-bold text-slate-900">Compare</div>
                      <div className="text-xs text-slate-500 font-medium">Evaluate side-by-side</div>
                    </div>
                  </Link>
                </div>
              </div>
            </div>
          </nav>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-6">
          {isLoggedIn ? (
            <div className="flex items-center gap-4">
              <Link href="/profile" className="hidden sm:flex items-center gap-3 bg-slate-50 border border-slate-200/60 rounded-full pl-2 pr-4 py-1.5 hover:bg-slate-100 transition-colors cursor-pointer group">
                <div className="w-8 h-8 rounded-full overflow-hidden bg-blue-600 text-white flex items-center justify-center text-sm font-bold shadow-inner border border-white group-hover:scale-105 transition-transform">
                  {avatar ? (
                    <img src={avatar} alt={displayName} className="w-full h-full object-cover" />
                  ) : (
                    initial
                  )}
                </div>
                <span className="text-xs font-bold text-slate-700">{displayName}</span>
              </Link>
              <button
                onClick={handleLogout}
                className="text-sm font-semibold text-slate-500 hover:text-red-600 transition-colors px-3 py-2"
              >
                Log Out
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Link href="/login" className="hidden sm:block text-sm font-bold text-slate-700 hover:text-blue-600 transition-colors px-3 py-2">
                Log In
              </Link>
              <Link href="/register">
                <Button className="bg-blue-600 hover:bg-blue-700 text-white rounded-full px-6 py-5 text-sm font-bold transition-all shadow-[0_4px_14px_0_rgb(37,99,235,0.39)] hover:shadow-[0_6px_20px_rgba(37,99,235,0.23)] hover:-translate-y-0.5">
                  Sign Up Free
                </Button>
              </Link>
            </div>
          )}


          <Button variant="ghost" size="icon" className="md:hidden text-slate-600">
            <Menu className="w-6 h-6" />
          </Button>
        </div>
      </div>
    </header>
  );
}
