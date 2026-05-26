"use client";

import { useEffect, useState, Suspense } from "react";
import { Header } from "@/components/layout/Header";
import { FilterBar } from "@/components/colleges/FilterBar";
import { apiClient } from "@/lib/apiClient";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  MapPin, Star, IndianRupee, Building2, Loader2,
  GitCompareArrows, X, CheckSquare, Square,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSearchParams } from "next/navigation";

const MAX_COMPARE = 4;

function CollegesPageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const search   = searchParams.get("search")   || "";
  const location = searchParams.get("location") || "";
  const maxFee   = searchParams.get("maxFee")   || "";
  const sortBy   = searchParams.get("sortBy")   || "rating";

  const [colleges, setColleges]     = useState<any[]>([]);
  const [loading, setLoading]       = useState(true);
  const [compareIds, setCompareIds] = useState<string[]>([]);

  useEffect(() => {
    async function loadColleges() {
      setLoading(true);
      try {
        const data = await apiClient.colleges.search({ search, location, maxFee, sortBy });
        setColleges(data);
      } catch (err) {
        console.error("Failed to load colleges", err);
      } finally {
        setLoading(false);
      }
    }
    loadColleges();
  }, [search, location, maxFee, sortBy]);

  function toggleCompare(id: string, name: string, e: React.MouseEvent) {
    e.preventDefault();
    setCompareIds((prev) => {
      if (prev.includes(id)) return prev.filter((i) => i !== id);
      if (prev.length >= MAX_COMPARE) return prev; // cap at MAX
      return [...prev, id];
    });
  }

  function goCompare() {
    if (compareIds.length < 2) return;
    router.push(`/compare?ids=${compareIds.join(",")}`);
  }

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      <Header />
      <main className="container mx-auto px-4 py-12 max-w-7xl pb-32">
        <div className="flex justify-between items-end mb-8">
          <div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">Explore Colleges</h1>
            <p className="text-slate-500 mt-2 font-medium">
              Find and filter the best institutions for your future.
            </p>
          </div>
          {compareIds.length > 0 && (
            <p className="text-sm text-indigo-600 font-semibold">
              {compareIds.length} selected — see bar below
            </p>
          )}
        </div>

        <FilterBar
          initialSearch={search}
          initialLocation={location}
          initialMaxFee={maxFee}
          initialSortBy={sortBy}
        />

        {loading ? (
          <div className="flex flex-col items-center justify-center py-24 space-y-4">
            <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
            <p className="text-sm text-slate-500 font-semibold">Fetching colleges…</p>
          </div>
        ) : colleges.length === 0 ? (
          <div className="bg-white rounded-3xl p-16 text-center border border-slate-100 shadow-sm max-w-xl mx-auto mt-12">
            <Building2 className="w-16 h-16 text-slate-300 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-slate-900 mb-2">No colleges found</h3>
            <p className="text-slate-500 text-sm">Try adjusting your filters or search terms.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {colleges.map((college) => {
              const selected = compareIds.includes(college.id);
              return (
                <Link href={`/colleges/${college.id}`} key={college.id}>
                  <div
                    className={`bg-white rounded-3xl p-6 shadow-sm border transition-all flex flex-col group h-full
                      ${selected
                        ? "border-indigo-400 ring-2 ring-indigo-200 shadow-indigo-100"
                        : "border-slate-100 hover:shadow-lg"}`}
                  >
                    {/* Image */}
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

                    {/* Info */}
                    <h3 className="text-xl font-bold text-slate-900 mb-2 leading-tight group-hover:text-blue-600 transition-colors">
                      {college.name}
                    </h3>
                    <div className="flex items-center gap-2 text-slate-500 text-sm mb-4 font-medium">
                      <MapPin className="w-4 h-4 text-slate-400" />
                      {college.location}
                    </div>
                    {college.overview && (
                      <p className="text-slate-500 text-xs leading-relaxed line-clamp-2 mb-6 font-medium">
                        {college.overview}
                      </p>
                    )}

                    {/* Footer */}
                    <div className="mt-auto pt-6 border-t border-slate-100 flex items-center justify-between">
                      <div className="flex items-center text-slate-900 font-extrabold text-lg">
                        <IndianRupee className="w-4 h-4 mr-0.5 text-slate-500" />
                        {college.fees.toLocaleString()}
                        <span className="text-slate-400 text-xs font-normal ml-1">/ yr</span>
                      </div>

                      <button
                        onClick={(e) => toggleCompare(college.id, college.name, e)}
                        className={`flex items-center gap-2 text-sm font-semibold px-4 py-2 rounded-full border transition-all
                          ${selected
                            ? "bg-indigo-600 text-white border-indigo-600 hover:bg-indigo-700"
                            : compareIds.length >= MAX_COMPARE
                              ? "text-slate-400 border-slate-200 cursor-not-allowed opacity-50"
                              : "text-indigo-600 border-indigo-300 hover:bg-indigo-50"}`}
                        disabled={!selected && compareIds.length >= MAX_COMPARE}
                      >
                        {selected
                          ? <><CheckSquare className="w-4 h-4" /> Added</>
                          : <><Square className="w-4 h-4" /> Compare</>
                        }
                      </button>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </main>

      {/* ── Sticky Compare Bar ── */}
      {compareIds.length > 0 && (
        <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-slate-200 shadow-2xl">
          <div className="container mx-auto px-4 py-4 max-w-7xl flex items-center gap-4">
            <GitCompareArrows className="w-5 h-5 text-indigo-600 shrink-0" />
            <div className="flex-1 flex items-center gap-3 overflow-x-auto">
              {colleges
                .filter((c) => compareIds.includes(c.id))
                .map((c) => (
                  <span
                    key={c.id}
                    className="flex items-center gap-1.5 bg-indigo-50 text-indigo-800 text-sm font-semibold px-3 py-1.5 rounded-full whitespace-nowrap shrink-0"
                  >
                    {c.name.split(" ").slice(0, 3).join(" ")}
                    <button
                      onClick={() => setCompareIds((prev) => prev.filter((i) => i !== c.id))}
                      className="hover:text-indigo-600 ml-0.5"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </span>
                ))}
              {compareIds.length < MAX_COMPARE && (
                <span className="text-xs text-slate-400 whitespace-nowrap shrink-0">
                  + add up to {MAX_COMPARE - compareIds.length} more
                </span>
              )}
            </div>
            <div className="flex items-center gap-3 shrink-0">
              <button
                onClick={() => setCompareIds([])}
                className="text-sm text-slate-500 hover:text-slate-700"
              >
                Clear all
              </button>
              <Button
                onClick={goCompare}
                disabled={compareIds.length < 2}
                className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-full px-6 font-semibold disabled:opacity-50"
              >
                Compare {compareIds.length} Colleges
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function CollegesPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center gap-3">
        <Loader2 className="w-10 h-10 text-indigo-500 animate-spin" />
        <p className="text-slate-400 text-sm">Preparing colleges...</p>
      </div>
    }>
      <CollegesPageContent />
    </Suspense>
  );
}
