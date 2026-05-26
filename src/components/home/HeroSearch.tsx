"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";

export function HeroSearch() {
  const router = useRouter();
  const [query, setQuery] = useState("");

  const handleSearch = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (query.trim()) {
      router.push(`/colleges?search=${encodeURIComponent(query.trim())}`);
    } else {
      router.push("/colleges");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <section className="bg-slate-50/50 py-16 md:py-24 overflow-hidden">
      <div className="container mx-auto px-4 max-w-7xl flex flex-col md:flex-row items-center gap-12">
        {/* Left Column: Text & Search */}
        <div className="flex-1 space-y-8 z-10">
          <h1 className="text-5xl md:text-7xl font-black text-slate-900 tracking-tight leading-[1.05]">
            Find colleges,<br />
            courses, & exams
          </h1>
          <p className="text-xl text-slate-500 max-w-lg leading-relaxed font-medium">
            Explore higher education with ease. Discover thousands of colleges, courses, and exams to shape your future.
          </p>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="flex items-center bg-white border-2 border-slate-100 rounded-full p-2.5 shadow-2xl shadow-blue-900/5 max-w-xl hover:border-blue-200 focus-within:border-blue-400 focus-within:shadow-blue-900/10 transition-all duration-300">
            <input 
              type="text" 
              placeholder="Search from 1,000+ colleges and courses..." 
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              className="flex-1 bg-transparent border-none outline-none text-slate-900 placeholder:text-slate-400 px-6 text-base py-3 font-medium"
            />
            <Button type="submit" size="icon" className="bg-blue-600 hover:bg-blue-700 text-white rounded-full w-14 h-14 shadow-lg shadow-blue-600/30 shrink-0 group">
              <Search className="w-6 h-6 group-hover:scale-110 transition-transform duration-300" />
            </Button>
          </form>
        </div>

        {/* Right Column: Image & Blob */}
        <div className="flex-1 relative flex justify-center items-center">
          {/* Decorative Blob SVG */}
          <div className="absolute w-[450px] h-[450px] text-amber-400 opacity-90 z-0">
            <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" className="w-full h-full fill-current">
              <path d="M44.7,-76.4C58.8,-69.2,71.8,-59.1,81.3,-46.3C90.8,-33.5,96.8,-18,97.1,-2.4C97.4,13.2,92,28.9,82.2,41.5C72.4,54.1,58.2,63.6,43.3,71.6C28.4,79.6,12.8,86.1,-2.7,90.6C-18.2,95.1,-33.5,97.6,-46.8,91.8C-60.1,86,-71.4,71.9,-79.8,56.5C-88.2,41.1,-93.7,24.4,-94,-7.8C-94.3,-40,-89.4,-57.7,-77.8,-70.6C-66.2,-83.5,-47.9,-91.6,-32.1,-89.5C-16.3,-87.4,-3,-75,-5.5,-63.9" transform="translate(100 100)" />
            </svg>
          </div>
          
          {/* Portrait Image */}
          <div className="relative z-10 w-[380px] h-[380px] rounded-[3rem] rotate-3 hover:rotate-0 transition-transform duration-700 border-8 border-white shadow-2xl overflow-hidden mt-8">
            <img 
              src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&q=80&w=800" 
              alt="Happy Student" 
              className="w-full h-full object-cover scale-105 hover:scale-100 transition-transform duration-700"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
