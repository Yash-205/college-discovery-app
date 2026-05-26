"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import { Search, MapPin, IndianRupee, SlidersHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";

interface FilterBarProps {
  initialSearch?: string;
  initialLocation?: string;
  initialMaxFee?: string;
  initialSortBy?: string;
}

export function FilterBar({
  initialSearch = "",
  initialLocation = "",
  initialMaxFee = "",
  initialSortBy = "rating",
}: FilterBarProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [search, setSearch] = useState(initialSearch);
  const [location, setLocation] = useState(initialLocation);
  const [maxFee, setMaxFee] = useState(initialMaxFee);
  const [sortBy, setSortBy] = useState(initialSortBy);

  // Apply filters on submit or change
  const applyFilters = () => {
    const params = new URLSearchParams();
    if (search.trim()) params.set("search", search.trim());
    if (location) params.set("location", location);
    if (maxFee) params.set("maxFee", maxFee);
    if (sortBy) params.set("sortBy", sortBy);

    router.push(`/colleges?${params.toString()}`);
  };

  const handleClear = () => {
    setSearch("");
    setLocation("");
    setMaxFee("");
    setSortBy("rating");
    router.push("/colleges");
  };

  return (
    <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 mb-10 space-y-6">
      <div className="flex items-center gap-2 text-slate-800 font-bold text-lg border-b border-slate-50 pb-4">
        <SlidersHorizontal className="w-5 h-5 text-blue-600" />
        Filter & Search Colleges
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-end">
        {/* Search */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Search Name</label>
          <div className="flex items-center bg-slate-50 border border-slate-200/80 rounded-2xl px-3.5 py-2">
            <Search className="w-4 h-4 text-slate-400 mr-2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="e.g. Indian Institute..."
              className="bg-transparent border-none outline-none text-sm text-slate-800 placeholder:text-slate-400 w-full"
            />
          </div>
        </div>

        {/* Location Filter */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Location</label>
          <div className="flex items-center bg-slate-50 border border-slate-200/80 rounded-2xl px-3.5 py-2">
            <MapPin className="w-4 h-4 text-slate-400 mr-2" />
            <select
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="bg-transparent border-none outline-none text-sm text-slate-700 w-full cursor-pointer pr-4"
            >
              <option value="">All Locations</option>
              <option value="Mumbai">Mumbai</option>
              <option value="Pilani">Pilani</option>
              <option value="Trichy">Trichy</option>
              <option value="New Delhi">New Delhi</option>
              <option value="Vellore">Vellore</option>
              <option value="Chennai">Chennai</option>
              <option value="Patiala">Patiala</option>
            </select>
          </div>
        </div>

        {/* Max Fee Filter */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Max Annual Fees (₹)</label>
          <div className="flex items-center bg-slate-50 border border-slate-200/80 rounded-2xl px-3.5 py-2">
            <IndianRupee className="w-4 h-4 text-slate-400 mr-2" />
            <select
              value={maxFee}
              onChange={(e) => setMaxFee(e.target.value)}
              className="bg-transparent border-none outline-none text-sm text-slate-700 w-full cursor-pointer pr-4"
            >
              <option value="">No Limit</option>
              <option value="100000">₹1,00,000</option>
              <option value="200000">₹2,00,000</option>
              <option value="300000">₹3,00,000</option>
              <option value="400000">₹4,00,000</option>
              <option value="600000">₹6,00,000</option>
            </select>
          </div>
        </div>

        {/* Sort By */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Sort Results By</label>
          <div className="flex items-center bg-slate-50 border border-slate-200/80 rounded-2xl px-3.5 py-2">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-transparent border-none outline-none text-sm text-slate-700 w-full cursor-pointer pr-4 font-semibold text-blue-600"
            >
              <option value="rating">Highest Rating</option>
              <option value="fees">Lowest Fees</option>
            </select>
          </div>
        </div>
      </div>

      <div className="flex gap-4 justify-end pt-2 border-t border-slate-50">
        <Button
          onClick={handleClear}
          variant="ghost"
          className="rounded-full px-6 text-slate-500 hover:text-slate-700 hover:bg-slate-50 font-bold"
        >
          Clear Filters
        </Button>
        <Button
          onClick={applyFilters}
          className="bg-blue-600 hover:bg-blue-700 text-white rounded-full px-8 py-5 text-sm font-semibold shadow-md shadow-blue-600/20"
        >
          Apply Filters
        </Button>
      </div>
    </div>
  );
}
