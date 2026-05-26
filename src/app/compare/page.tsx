"use client";

import { useEffect, useState, useRef, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Header } from "@/components/layout/Header";
import {
  Star, IndianRupee, MapPin, Building2, Loader2,
  X, Plus, Search, GraduationCap, Briefcase,
  GitCompareArrows, ChevronLeft, Trophy, TrendingDown,
} from "lucide-react";
import Link from "next/link";

interface College {
  id: string;
  name: string;
  location: string;
  fees: number;
  rating: number;
  overview?: string | null;
  imageUrl?: string | null;
  courses: string[];
  placements?: string | null;
}

const MAX = 4;

function ComparePageContent() {
  const router       = useRouter();
  const searchParams = useSearchParams();

  const [allColleges, setAllColleges] = useState<College[]>([]);
  const [loading, setLoading]         = useState(true);
  const [showPicker, setShowPicker]   = useState(false);
  const [pickerQuery, setPickerQuery] = useState("");
  const pickerRef = useRef<HTMLDivElement>(null);

  // IDs from URL
  const rawIds = searchParams.get("ids") ?? "";
  const ids = rawIds.split(",").map((s) => s.trim()).filter(Boolean);

  // Fetch ALL colleges once; filter client-side — no minimum-ID issue
  useEffect(() => {
    setLoading(true);
    fetch("/api/colleges?limit=100")
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data)) setAllColleges(data);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  // Close picker on outside click
  useEffect(() => {
    function onOut(e: MouseEvent) {
      if (pickerRef.current && !pickerRef.current.contains(e.target as Node)) {
        setShowPicker(false);
        setPickerQuery("");
      }
    }
    if (showPicker) document.addEventListener("mousedown", onOut);
    return () => document.removeEventListener("mousedown", onOut);
  }, [showPicker]);

  // Colleges currently in comparison (preserving URL order)
  const colleges = ids
    .map((id) => allColleges.find((c) => c.id === id))
    .filter(Boolean) as College[];

  function updateIds(newIds: string[]) {
    if (newIds.length === 0) router.replace("/compare");
    else router.replace(`/compare?ids=${newIds.join(",")}`);
  }

  function addCollege(id: string) {
    if (ids.includes(id) || ids.length >= MAX) return;
    updateIds([...ids, id]);
    setShowPicker(false);
    setPickerQuery("");
  }

  function removeCollege(id: string) {
    updateIds(ids.filter((i) => i !== id));
  }

  const pickerResults = allColleges.filter(
    (c) =>
      !ids.includes(c.id) &&
      c.name.toLowerCase().includes(pickerQuery.toLowerCase())
  );

  // Highlight helpers
  const bestRating = colleges.length ? Math.max(...colleges.map((c) => c.rating)) : 0;
  const lowestFees = colleges.length ? Math.min(...colleges.map((c) => c.fees))   : Infinity;

  // ─────────────────────────────────────────────────────────────────────────

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50/30 font-sans">
      <Header />

      <main className="container mx-auto px-4 py-10 max-w-7xl">

        {/* ── Page Header ── */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-md shadow-indigo-200">
              <GitCompareArrows className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-extrabold text-slate-900 leading-none">Compare Colleges</h1>
              <p className="text-slate-500 text-sm mt-0.5">Side-by-side analysis · up to {MAX} colleges</p>
            </div>
          </div>
          <Link
            href="/colleges"
            className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-800 transition-colors font-medium"
          >
            <ChevronLeft className="w-4 h-4" />
            Back to Colleges
          </Link>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-32 gap-3">
            <Loader2 className="w-10 h-10 text-indigo-500 animate-spin" />
            <p className="text-slate-400 text-sm">Loading colleges…</p>
          </div>

        ) : colleges.length === 0 ? (
          /* ── Empty State ── */
          <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-16 text-center">
            <div className="w-20 h-20 bg-indigo-50 rounded-3xl flex items-center justify-center mx-auto mb-5">
              <GitCompareArrows className="w-10 h-10 text-indigo-400" />
            </div>
            <h2 className="text-xl font-bold text-slate-900 mb-2">No colleges selected</h2>
            <p className="text-slate-500 text-sm mb-8 max-w-xs mx-auto">
              Pick at least two colleges to compare them side-by-side.
            </p>
            <button
              onClick={() => setShowPicker(true)}
              className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-6 py-3 rounded-full transition-colors shadow-md shadow-indigo-200"
            >
              <Plus className="w-4 h-4" />
              Add College
            </button>
          </div>

        ) : (
          /* ── Comparison Table ── */
          <div className="overflow-x-auto rounded-3xl border border-slate-200/80 shadow-sm bg-white">
            <table className="w-full text-left table-fixed">

              {/* ── Header row: college cards ── */}
              <thead>
                <tr className="border-b border-slate-100">
                  {/* Left label col */}
                  <th className="p-6 w-44 bg-slate-50 rounded-tl-3xl align-bottom">
                    <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Feature</span>
                  </th>

                  {/* College columns — equal width, auto-divided from remaining space */}
                  {colleges.map((c) => (
                    <th key={c.id} className="p-5 align-top border-l border-slate-100">
                      <div className="relative">
                        {/* Remove */}
                        <button
                          onClick={() => removeCollege(c.id)}
                          className="absolute -top-1 -right-1 p-1 hover:bg-red-50 rounded-full text-slate-300 hover:text-red-400 transition-colors z-10"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>

                        {c.imageUrl && (
                          <img
                            src={c.imageUrl}
                            alt={c.name}
                            className="w-full h-32 object-cover rounded-2xl mb-3 shadow-sm"
                          />
                        )}
                        <p className="font-bold text-slate-900 text-sm leading-snug pr-4">{c.name}</p>
                        <p className="text-xs text-slate-500 mt-1 flex items-center gap-1">
                          <MapPin className="w-3 h-3" />
                          {c.location}
                        </p>
                      </div>
                    </th>
                  ))}

                  {/* Add slot */}
                  {colleges.length < MAX && (
                    <th className="p-5 border-l border-slate-100 align-middle min-w-[160px]">
                      <button
                        onClick={() => setShowPicker(true)}
                        className="w-full flex flex-col items-center justify-center gap-2 border-2 border-dashed border-indigo-200 rounded-2xl py-8 text-indigo-400 hover:text-indigo-600 hover:border-indigo-400 hover:bg-indigo-50/50 transition-all text-xs font-semibold"
                      >
                        <Plus className="w-5 h-5" />
                        Add College
                      </button>
                    </th>
                  )}
                </tr>
              </thead>

              <tbody>

                {/* ── Rating ── */}
                <tr className="border-t border-slate-100 hover:bg-slate-50/50 transition-colors">
                  <td className="p-5 bg-slate-50/60">
                    <span className="flex items-center gap-2 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                      <Star className="w-4 h-4 text-amber-400" /> Rating
                    </span>
                  </td>
                  {colleges.map((c) => (
                    <td key={c.id} className="p-5 border-l border-slate-100">
                      <div className={`inline-flex items-center gap-2 rounded-xl px-3 py-2 font-bold text-lg
                        ${c.rating === bestRating
                          ? "bg-amber-50 text-amber-700"
                          : "text-slate-700"}`}
                      >
                        <Star className={`w-4 h-4 ${c.rating === bestRating ? "fill-amber-400 text-amber-400" : "text-slate-300 fill-slate-300"}`} />
                        {c.rating}
                        {c.rating === bestRating && colleges.length > 1 && (
                          <Trophy className="w-4 h-4 text-amber-500 ml-0.5" />
                        )}
                      </div>
                    </td>
                  ))}
                  {colleges.length < MAX && <td className="border-l border-slate-100" />}
                </tr>

                {/* ── Annual Fees ── */}
                <tr className="border-t border-slate-100 hover:bg-slate-50/50 transition-colors">
                  <td className="p-5 bg-slate-50/60">
                    <span className="flex items-center gap-2 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                      <IndianRupee className="w-4 h-4 text-emerald-500" /> Annual Fees
                    </span>
                  </td>
                  {colleges.map((c) => (
                    <td key={c.id} className="p-5 border-l border-slate-100">
                      <div className={`inline-flex items-center gap-2 rounded-xl px-3 py-2 font-bold text-base
                        ${c.fees === lowestFees
                          ? "bg-emerald-50 text-emerald-700"
                          : "text-blue-600"}`}
                      >
                        ₹{c.fees.toLocaleString("en-IN")}
                        {c.fees === lowestFees && colleges.length > 1 && (
                          <span className="text-[10px] bg-emerald-100 text-emerald-700 font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                            <TrendingDown className="w-3 h-3" /> Best
                          </span>
                        )}
                      </div>
                    </td>
                  ))}
                  {colleges.length < MAX && <td className="border-l border-slate-100" />}
                </tr>

                {/* ── Programmes ── */}
                <tr className="border-t border-slate-100 hover:bg-slate-50/50 transition-colors">
                  <td className="p-5 bg-slate-50/60 align-top">
                    <span className="flex items-center gap-2 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                      <GraduationCap className="w-4 h-4 text-indigo-400" /> Programmes
                    </span>
                  </td>
                  {colleges.map((c) => (
                    <td key={c.id} className="p-5 border-l border-slate-100 align-top">
                      <ul className="space-y-2">
                        {c.courses.slice(0, 5).map((course, i) => (
                          <li key={i} className="flex gap-2 items-start text-xs text-slate-600">
                            <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-indigo-400 shrink-0" />
                            {course}
                          </li>
                        ))}
                        {c.courses.length > 5 && (
                          <li className="text-xs text-slate-400 pl-3.5">+{c.courses.length - 5} more programmes</li>
                        )}
                      </ul>
                    </td>
                  ))}
                  {colleges.length < MAX && <td className="border-l border-slate-100" />}
                </tr>

                {/* ── Placements ── */}
                <tr className="border-t border-slate-100 hover:bg-slate-50/50 transition-colors">
                  <td className="p-5 bg-slate-50/60 align-top rounded-bl-3xl">
                    <span className="flex items-center gap-2 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                      <Briefcase className="w-4 h-4 text-violet-400" /> Placements
                    </span>
                  </td>
                  {colleges.map((c, i) => (
                    <td
                      key={c.id}
                      className={`p-5 border-l border-slate-100 align-top text-sm text-slate-600 leading-relaxed
                        ${i === colleges.length - 1 && colleges.length === MAX ? "rounded-br-3xl" : ""}`}
                    >
                      {c.placements ?? <span className="text-slate-400 italic">Not available</span>}
                    </td>
                  ))}
                  {colleges.length < MAX && <td className="border-l border-slate-100 rounded-br-3xl" />}
                </tr>

              </tbody>
            </table>
          </div>
        )}
      </main>

      {/* ── Picker Modal ── */}
      {showPicker && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div
            ref={pickerRef}
            className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden"
          >
            {/* Modal header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100">
              <h2 className="text-base font-bold text-slate-900">Add a College to Compare</h2>
              <button
                onClick={() => { setShowPicker(false); setPickerQuery(""); }}
                className="p-1.5 hover:bg-slate-100 rounded-full text-slate-400 hover:text-slate-700 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Search input */}
            <div className="px-6 py-4 border-b border-slate-100">
              <div className="relative">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  autoFocus
                  type="text"
                  placeholder="Search by college name…"
                  value={pickerQuery}
                  onChange={(e) => setPickerQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent"
                />
              </div>
            </div>

            {/* Results list */}
            <div className="max-h-80 overflow-y-auto px-3 py-3">
              {pickerResults.length === 0 ? (
                <div className="text-center py-10">
                  <Building2 className="w-10 h-10 text-slate-200 mx-auto mb-2" />
                  <p className="text-slate-400 text-sm">No colleges available to add.</p>
                </div>
              ) : (
                pickerResults.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => addCollege(c.id)}
                    className="w-full flex items-center gap-3 p-3 rounded-2xl hover:bg-indigo-50 text-left transition-colors group"
                  >
                    {c.imageUrl ? (
                      <img
                        src={c.imageUrl}
                        alt={c.name}
                        className="w-14 h-11 object-cover rounded-xl shrink-0"
                      />
                    ) : (
                      <div className="w-14 h-11 bg-slate-100 rounded-xl flex items-center justify-center shrink-0">
                        <Building2 className="w-5 h-5 text-slate-400" />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-sm text-slate-900 truncate group-hover:text-indigo-700">{c.name}</p>
                      <p className="text-xs text-slate-500 truncate mt-0.5 flex items-center gap-1">
                        <MapPin className="w-3 h-3 shrink-0" />{c.location}
                      </p>
                    </div>
                    <div className="shrink-0 flex flex-col items-end gap-1">
                      <span className="flex items-center gap-1 text-xs font-bold text-amber-600">
                        <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                        {c.rating}
                      </span>
                      <span className="text-[11px] text-slate-500">₹{(c.fees / 1000).toFixed(0)}k/yr</span>
                    </div>
                  </button>
                ))
              )}
            </div>

            {ids.length >= MAX && (
              <div className="px-6 py-3 bg-amber-50 border-t border-amber-100 text-xs text-amber-700 font-medium text-center">
                Maximum {MAX} colleges reached. Remove one to add another.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default function ComparePage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center gap-3">
        <Loader2 className="w-10 h-10 text-indigo-500 animate-spin" />
        <p className="text-slate-400 text-sm">Preparing comparison...</p>
      </div>
    }>
      <ComparePageContent />
    </Suspense>
  );
}
