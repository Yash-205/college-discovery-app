import { Header } from "@/components/layout/Header";
import { HeroSearch } from "@/components/home/HeroSearch";
import { Button } from "@/components/ui/button";
import { Building2, Scale, MapPin, Star, IndianRupee } from "lucide-react";
import prisma from "@/lib/prisma";
import Link from "next/link";

export default async function Home() {
  // Fetch top 3 colleges to display in the new section
  const topColleges = await prisma.college.findMany({
    take: 3,
    orderBy: { rating: 'desc' }
  });

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans">
      <Header />
      
      <main>
        <HeroSearch />

        {/* Features Tailored for Your Success */}
        <section className="py-24 bg-white">
          <div className="container mx-auto px-4 max-w-4xl text-center">
            <h2 className="text-3xl font-bold text-slate-900 mb-12">Core Features</h2>
            
            {/* Feature Grid (Reduced to 2 items) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {[
                { title: "Find Colleges", icon: <Building2 className="w-10 h-10 text-blue-600" />, desc: "Search through thousands of colleges across the country to find your perfect fit." },
                { title: "Compare Colleges", icon: <Scale className="w-10 h-10 text-blue-600" />, desc: "Evaluate fees, ratings, and locations side-by-side to make an informed decision." },
              ].map((feature, i) => (
                <div key={i} className="flex flex-col items-center p-8 bg-slate-50 rounded-3xl hover:shadow-lg transition-shadow border border-slate-100">
                  <div className="mb-6">{feature.icon}</div>
                  <h3 className="text-xl font-bold text-slate-900 mb-4">{feature.title}</h3>
                  <p className="text-base text-slate-500 mb-8 leading-relaxed max-w-sm">
                    {feature.desc}
                  </p>
                  <Button variant="link" className="text-blue-600 font-semibold p-0 text-base">Read More →</Button>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Top Colleges Section */}
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
                <div key={college.id} className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 hover:shadow-lg transition-all flex flex-col">
                  <div className="w-full h-48 bg-slate-100 rounded-2xl mb-6 overflow-hidden relative flex items-center justify-center">
                    {college.imageUrl ? (
                      <img src={college.imageUrl} alt={college.name} className="w-full h-full object-cover" />
                    ) : (
                      <Building2 className="w-16 h-16 text-slate-300" />
                    )}
                    <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full flex items-center gap-1 text-sm font-bold text-slate-700 shadow-sm">
                      <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                      {college.rating}
                    </div>
                  </div>
                  
                  <h3 className="text-xl font-bold text-slate-900 mb-2 leading-tight">{college.name}</h3>
                  
                  <div className="flex items-center gap-2 text-slate-500 text-sm mb-6">
                    <MapPin className="w-4 h-4" />
                    {college.location}
                  </div>
                  
                  <div className="mt-auto pt-6 border-t border-slate-100 flex items-center justify-between">
                    <div className="flex items-center text-slate-900 font-bold">
                      <IndianRupee className="w-4 h-4 mr-1 text-slate-500" />
                      {college.fees.toLocaleString()} <span className="text-slate-400 text-xs font-normal ml-1">/ yr</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
        
        {/* Explore Colleges By Cities */}
        <section className="py-24 bg-white">
          <div className="container mx-auto px-4 max-w-6xl text-center">
            <h2 className="text-3xl font-bold text-slate-900 mb-12">Explore Colleges By Cities</h2>
            <div className="flex flex-wrap justify-center gap-8">
              {["New Delhi", "Mumbai", "Kolkata", "Chennai", "Pune"].map((city) => (
                <div key={city} className="flex flex-col items-center gap-4 cursor-pointer group">
                  <div className="w-24 h-24 rounded-2xl border-2 border-slate-200 bg-slate-50 flex items-center justify-center group-hover:border-blue-600 group-hover:shadow-lg transition-all text-amber-500">
                    <MapPin className="w-10 h-10" />
                  </div>
                  <span className="font-semibold text-slate-700 group-hover:text-blue-600">{city}</span>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
