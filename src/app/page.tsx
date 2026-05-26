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
      icon: <Building2 className="w-10 h-10 text-indigo-600" />,
      desc: "Search through thousands of colleges across the country using smart filters for fees, location, and ratings.",
      href: "/colleges",
      cta: "Browse Colleges →",
    },
    {
      title: "Compare Colleges",
      icon: <Scale className="w-10 h-10 text-indigo-600" />,
      desc: "Evaluate fees, ratings, courses, and placements side-by-side to make the most informed decision.",
      href: "/compare",
      cta: "Start Comparing →",
    },
    {
      title: "Discussions",
      icon: <MessageSquare className="w-10 h-10 text-indigo-600" />,
      desc: "Ask questions, share experiences, and get real answers from students and alumni of top colleges.",
      href: "/discussions",
      cta: "Join Discussion →",
    },
  ];

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans">
      <Header />

      <main>
        <HeroSearch />

        {/* ── Core Features ─────────────────────────────────────────────── */}
        <section className="py-24 bg-white">
          <div className="container mx-auto px-4 max-w-5xl text-center">
            <h2 className="text-3xl font-bold text-slate-900 mb-3">Core Features</h2>
            <p className="text-slate-500 mb-12 max-w-xl mx-auto">
              Everything you need to find the right college — all in one place.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {features.map((feature, i) => (
                <Link key={i} href={feature.href} className="group">
                  <div className="flex flex-col items-center p-8 bg-slate-50 rounded-3xl hover:shadow-lg hover:bg-indigo-50 transition-all border border-slate-100 group-hover:border-indigo-200 h-full">
                    <div className="mb-6 p-4 bg-white rounded-2xl shadow-sm group-hover:shadow-indigo-100 transition-shadow">
                      {feature.icon}
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 mb-4">{feature.title}</h3>
                    <p className="text-base text-slate-500 mb-8 leading-relaxed max-w-sm flex-1">
                      {feature.desc}
                    </p>
                    <span className="text-indigo-600 font-semibold text-sm group-hover:underline">
                      {feature.cta}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* ── Top Rated Colleges ────────────────────────────────────────── */}
        <section className="py-24 bg-slate-50">
          <div className="container mx-auto px-4 max-w-7xl">
            <div className="flex justify-between items-end mb-12">
              <div>
                <h2 className="text-3xl font-bold text-slate-900">Top Rated Colleges</h2>
                <p className="text-slate-500 mt-2">Discover the most prestigious institutions.</p>
              </div>
              <Link href="/colleges">
                <Button variant="outline" className="text-blue-600 border-blue-600 hover:bg-blue-50 rounded-full px-6">
                  View All
                </Button>
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {topColleges.map((college) => (
                <div key={college.id} className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 hover:shadow-lg transition-all flex flex-col h-full group">
                  {/* Image → links to detail */}
                  <Link href={`/colleges/${college.id}`} className="block">
                    <div className="w-full h-48 bg-slate-100 rounded-2xl mb-6 overflow-hidden relative flex items-center justify-center">
                      {college.imageUrl ? (
                        <img
                          src={college.imageUrl}
                          alt={college.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      ) : (
                        <Building2 className="w-16 h-16 text-slate-300" />
                      )}
                      <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full flex items-center gap-1 text-sm font-bold text-slate-700 shadow-sm">
                        <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                        {college.rating}
                      </div>
                    </div>

                    {/* Name → links to detail */}
                    <h3 className="text-xl font-bold text-slate-900 mb-2 leading-tight group-hover:text-blue-600 transition-colors">
                      {college.name}
                    </h3>
                  </Link>

                  {/* Location → links to filtered colleges page */}
                  <Link
                    href={`/colleges?location=${encodeURIComponent(college.location.split(",")[0].trim())}`}
                    className="inline-flex items-center gap-2 text-slate-500 text-sm mb-6 hover:text-blue-600 transition-colors w-fit"
                  >
                    <MapPin className="w-4 h-4 shrink-0" />
                    <span className="hover:underline">{college.location}</span>
                  </Link>

                  <div className="mt-auto pt-6 border-t border-slate-100 flex items-center justify-between">
                    <div className="flex items-center text-slate-900 font-bold">
                      <IndianRupee className="w-4 h-4 mr-1 text-slate-500" />
                      {college.fees.toLocaleString()}
                      <span className="text-slate-400 text-xs font-normal ml-1">/ yr</span>
                    </div>
                    <Link
                      href={`/colleges/${college.id}`}
                      className="text-xs text-blue-600 font-semibold hover:underline"
                    >
                      View Details →
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Explore By City ───────────────────────────────────────────── */}
        <section className="py-24 bg-white">
          <div className="container mx-auto px-4 max-w-6xl text-center">
            <h2 className="text-3xl font-bold text-slate-900 mb-3">Explore Colleges By City</h2>
            <p className="text-slate-500 mb-12">Click a city to browse colleges in that area.</p>
            <div className="flex flex-wrap justify-center gap-8">
              {["New Delhi", "Mumbai", "Chennai", "Kolkata", "Pune", "Patiala", "Trichy", "Vellore"].map((city) => (
                <Link
                  key={city}
                  href={`/colleges?location=${encodeURIComponent(city)}`}
                  className="flex flex-col items-center gap-4 group"
                >
                  <div className="w-24 h-24 rounded-2xl border-2 border-slate-200 bg-slate-50 flex items-center justify-center group-hover:border-indigo-500 group-hover:bg-indigo-50 group-hover:shadow-lg transition-all text-amber-500 group-hover:text-indigo-500">
                    <MapPin className="w-10 h-10" />
                  </div>
                  <span className="font-semibold text-slate-700 group-hover:text-indigo-600 transition-colors">
                    {city}
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
