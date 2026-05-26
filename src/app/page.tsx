import { Header } from "@/components/layout/Header";
import { HeroSearch } from "@/components/home/HeroSearch";
import { Button } from "@/components/ui/button";
import { Building2, Scale, MapPin, Star, IndianRupee, MessageSquare } from "lucide-react";
import prisma from "@/lib/prisma";
import Link from "next/link";

export default async function Home() {
  const topColleges = await prisma.college.findMany({
    take: 3,
    orderBy: { rating: "desc" },
  });

  const features = [
    {
      title: "Find Colleges",
      icon: <Building2 className="w-10 h-10 text-blue-600" />,
      desc: "Search through thousands of colleges across the country using smart filters for fees, location, and ratings.",
      href: "/colleges",
      cta: "Browse Colleges",
    },
    {
      title: "Compare Colleges",
      icon: <Scale className="w-10 h-10 text-amber-500" />,
      desc: "Evaluate fees, ratings, courses, and placements side-by-side to make the most informed decision.",
      href: "/compare",
      cta: "Start Comparing",
    },
    {
      title: "Discussions",
      icon: <MessageSquare className="w-10 h-10 text-emerald-500" />,
      desc: "Ask questions, share experiences, and get real answers from students and alumni of top colleges.",
      href: "/discussions",
      cta: "Join Discussion",
    },
  ];

  // Flaticon URLs for Indian monument icons similar to the provided screenshot
  const cities = [
    { name: "New Delhi", icon: "/delhi.png" }, 
    { name: "Mumbai", icon: "/mumbai.png" },    
    { name: "Chennai", icon: "/chennai.png" },    
    { name: "Kolkata", icon: "/kolkata.png" },  
    { name: "Pune", icon: "/pune.png" },       
    { name: "Patiala", icon: "https://cdn-icons-png.flaticon.com/512/1282/1282509.png" },    // Gateway
    { name: "Trichy", icon: "https://cdn-icons-png.flaticon.com/512/5523/5523342.png" },     // Gate
    { name: "Vellore", icon: "https://cdn-icons-png.flaticon.com/512/4323/4323994.png" },    // India Monument
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-blue-100 selection:text-blue-900">
      <Header />

      <main>
        <HeroSearch />

        {/* ── Core Features ─────────────────────────────────────────────── */}
        <section className="py-24 bg-white relative overflow-hidden">
          <div className="absolute top-0 right-0 -mr-32 -mt-32 w-96 h-96 rounded-full bg-blue-50 blur-3xl opacity-50 pointer-events-none" />
          <div className="absolute bottom-0 left-0 -ml-32 -mb-32 w-96 h-96 rounded-full bg-yellow-50 blur-3xl opacity-50 pointer-events-none" />

          <div className="container mx-auto px-6 max-w-6xl text-center relative z-10">
            <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-6 tracking-tight">
              Everything you need to plan, <br className="hidden md:block" />
              decide, and apply with confidence.
            </h2>
            <p className="text-lg text-slate-500 mb-16 max-w-2xl mx-auto">
              See robust school profiles and comprehensive data to make planning, deciding, and applying to college easier.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
              {features.map((feature, i) => (
                <Link key={i} href={feature.href} className="group block text-left">
                  <div className="bg-white rounded-[2rem] p-8 shadow-[0_4px_24px_rgba(0,0,0,0.04)] hover:shadow-[0_8px_32px_rgba(0,0,0,0.08)] transition-all duration-300 border border-slate-100 hover:border-slate-200 h-full flex flex-col hover:-translate-y-1">
                    <div className="mb-8 w-20 h-20 rounded-2xl bg-slate-50 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      {feature.icon}
                    </div>
                    <h3 className="text-2xl font-bold text-slate-900 mb-4">{feature.title}</h3>
                    <p className="text-slate-600 mb-10 leading-relaxed flex-1">
                      {feature.desc}
                    </p>
                    <div className="inline-flex items-center text-blue-600 font-bold group-hover:text-blue-700">
                      {feature.cta}
                      <span className="ml-2 group-hover:translate-x-1 transition-transform">→</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* ── Top Rated Colleges ────────────────────────────────────────── */}
        <section className="py-24 bg-slate-50 relative">
          <div className="container mx-auto px-6 max-w-7xl">
            <div className="flex flex-col md:flex-row justify-between items-end mb-14 gap-6">
              <div className="max-w-2xl">
                <h2 className="text-4xl font-extrabold text-slate-900 mb-4 tracking-tight">Top Rated Colleges</h2>
                <p className="text-lg text-slate-500">Discover the most prestigious institutions trusted by students across the country.</p>
              </div>
              <Link href="/colleges">
                <Button className="bg-blue-600 hover:bg-blue-700 text-white rounded-full px-8 py-6 text-base font-bold shadow-lg shadow-blue-200">
                  View All Colleges
                </Button>
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
              {topColleges.map((college) => (
                <div key={college.id} className="bg-white rounded-[2rem] p-6 shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-slate-100 hover:shadow-[0_8px_30px_rgba(0,0,0,0.08)] transition-all duration-300 flex flex-col h-full group">
                  <Link href={`/colleges/${college.id}`} className="block relative">
                    <div className="w-full h-56 bg-slate-100 rounded-3xl mb-6 overflow-hidden relative flex items-center justify-center">
                      {college.imageUrl ? (
                        <img
                          src={college.imageUrl}
                          alt={college.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      ) : (
                        <Building2 className="w-16 h-16 text-slate-300" />
                      )}
                      <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-sm px-4 py-2 rounded-full flex items-center gap-1.5 text-sm font-bold text-slate-800 shadow-sm">
                        <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                        {college.rating}
                      </div>
                    </div>

                    <h3 className="text-2xl font-bold text-slate-900 mb-3 leading-tight group-hover:text-blue-600 transition-colors">
                      {college.name}
                    </h3>
                  </Link>

                  <Link
                    href={`/colleges?location=${encodeURIComponent(college.location.split(",")[0].trim())}`}
                    className="inline-flex items-center gap-2 text-slate-500 text-sm mb-8 hover:text-blue-600 transition-colors w-fit bg-slate-50 px-3 py-1.5 rounded-full"
                  >
                    <MapPin className="w-4 h-4 shrink-0 text-slate-400" />
                    <span className="font-medium">{college.location}</span>
                  </Link>

                  <div className="mt-auto pt-6 border-t border-slate-100 flex items-center justify-between">
                    <div className="flex flex-col">
                      <span className="text-xs text-slate-400 font-medium mb-1 uppercase tracking-wider">Avg Fees</span>
                      <div className="flex items-center text-slate-900 font-extrabold text-xl">
                        <IndianRupee className="w-5 h-5 mr-0.5 text-slate-400" />
                        {college.fees.toLocaleString()}
                        <span className="text-slate-400 text-sm font-medium ml-1">/ yr</span>
                      </div>
                    </div>
                    <Link
                      href={`/colleges/${college.id}`}
                      className="w-12 h-12 rounded-full bg-slate-50 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-colors text-slate-600 font-bold"
                    >
                      →
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Explore By City ───────────────────────────────────────────── */}
        <section className="py-32 bg-white">
          <div className="container mx-auto px-6 max-w-6xl text-center">
            <h2 className="text-4xl font-extrabold text-slate-900 mb-4 tracking-tight">Explore Colleges By City</h2>
            <p className="text-lg text-slate-500 mb-16 max-w-2xl mx-auto">
              Find the perfect college in your preferred location. Start your journey in these vibrant cities.
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-x-8 gap-y-12 justify-items-center">
              {cities.map((city) => (
                <Link
                  key={city.name}
                  href={`/colleges?location=${encodeURIComponent(city.name)}`}
                  className="flex flex-col items-center gap-5 group w-full max-w-[180px]"
                >
                  <div className="w-32 h-32 rounded-full bg-slate-50 flex items-center justify-center group-hover:shadow-[0_8px_30px_rgba(0,0,0,0.08)] transition-all duration-300 p-6 border-2 border-transparent group-hover:border-blue-100 group-hover:-translate-y-2">
                    {/* Flaticon Icons */}
                    <img
                      src={city.icon}
                      alt={`${city.name} flaticon icon`}
                      className="w-full h-full object-contain drop-shadow-sm group-hover:drop-shadow-md transition-all duration-300 opacity-90 group-hover:opacity-100"
                    />
                  </div>
                  <span className="text-lg font-bold text-slate-700 group-hover:text-blue-600 transition-colors">
                    {city.name}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
