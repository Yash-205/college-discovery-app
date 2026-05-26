"use client";

import { useEffect, useState } from "react";
import { Header } from "@/components/layout/Header";
import { useRouter } from 'next/navigation';
import { FilterBar } from "@/components/colleges/FilterBar";
import { apiClient } from "@/lib/apiClient";
import Link from "next/link";
import { MapPin, Star, IndianRupee, Building2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSearchParams } from "next/navigation";

export default function CollegesPage() {
  const searchParams = useSearchParams();
  
  const search = searchParams.get("search") || "";
  const location = searchParams.get("location") || "";
  const maxFee = searchParams.get("maxFee") || "";
  const sortBy = searchParams.get("sortBy") || "rating";

  const [colleges, setColleges] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadColleges() {
      setLoading(true);
      try {
        const data = await apiClient.colleges.search({
          search,
          location,
          maxFee,
          sortBy
        });
        setColleges(data);
      } catch (err) {
        console.error("Failed to load colleges from backend API", err);
      } finally {
        setLoading(false);
      }
    }
    loadColleges();
  }, [search, location, maxFee, sortBy]);

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      <Header />
      <main className="container mx-auto px-4 py-12 max-w-7xl">
        <div className="flex justify-between items-end mb-8">
          <div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">Explore Colleges</h1>
            <p className="text-slate-500 mt-2 font-medium">Find and filter the best institutions for your future.</p>
          </div>
        </div>

        {/* Dynamic Filtering Bar */}
        <FilterBar 
          initialSearch={search}
          initialLocation={location}
          initialMaxFee={maxFee}
          initialSortBy={sortBy}
        />

        {loading ? (
          <div className="flex flex-col items-center justify-center py-24 space-y-4">
            <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
            <p className="text-sm text-slate-500 font-semibold">Fetching matching colleges from backend...</p>
          </div>
        ) : colleges.length === 0 ? (
          <div className="bg-white rounded-3xl p-16 text-center border border-slate-100 shadow-sm max-w-xl mx-auto mt-12">
            <Building2 className="w-16 h-16 text-slate-300 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-slate-900 mb-2">No colleges found</h3>
            <p className="text-slate-500 text-sm">Try adjusting your filters or search terms to find more results.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {colleges.map((college) => (
              <Link href={`/colleges/${college.id}`} key={college.id} className="cursor-pointer">
                <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 hover:shadow-lg transition-all flex flex-col group h-full">
                  
                  {/* College Image */}
                  <div className="w-full h-48 bg-slate-100 rounded-2xl mb-6 overflow-hidden relative flex items-center justify-center">
                    {college.imageUrl ? (
                      <img src={college.imageUrl} alt={college.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    ) : (
                      <Building2 className="w-16 h-16 text-slate-300" />
                    )}
                    <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full flex items-center gap-1 text-sm font-bold text-slate-700 shadow-sm">
                      <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                      {college.rating}
                    </div>
                  </div>
                  
                  {/* College Details */}
                  <h3 className="text-xl font-bold text-slate-900 mb-2 leading-tight group-hover:text-blue-600 transition-colors">{college.name}</h3>
                  
                  <div className="flex items-center gap-2 text-slate-500 text-sm mb-4 font-medium">
                    <MapPin className="w-4 h-4 text-slate-400" />
                    {college.location}
                  </div>

                  {college.overview && (
                    <p className="text-slate-500 text-xs leading-relaxed line-clamp-2 mb-6 font-medium">
                      {college.overview}
                    </p>
                  )}
                  
                  <div className="mt-auto pt-6 border-t border-slate-100 flex items-center justify-between">
                    <div className="flex items-center text-slate-900 font-extrabold text-lg">
                      <IndianRupee className="w-4.5 h-4.5 mr-0.5 text-slate-500" />
                      {college.fees.toLocaleString()} <span className="text-slate-400 text-xs font-normal ml-1">/ yr</span>
                    </div>
                    
                    <div className="flex items-center">
                      <Button
                        variant="outline"
                        className="text-blue-600 border-blue-600 hover:bg-blue-50 rounded-full px-6 font-semibold"
                        onClick={(e) => {
                          e.preventDefault();
                          const url = `/compare?ids=${college.id}`;
                          window.location.href = url;
                        }}
                      >
                        Compare
                      </Button>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
