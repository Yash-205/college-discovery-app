"use client";

import { useState, useEffect } from "react";
import { Bookmark, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { apiClient } from "@/lib/apiClient";

interface SaveCollegeButtonProps {
  collegeId: string;
  initialState: boolean;
}

export function SaveCollegeButton({ collegeId, initialState }: SaveCollegeButtonProps) {
  const [isSaved, setIsSaved] = useState(initialState);
  const [loading, setLoading] = useState(false);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    // Read token from cookies
    const cookies = document.cookie.split("; ");
    const tokenCookie = cookies.find((row) => row.startsWith("token="));
    if (tokenCookie) {
      setToken(tokenCookie.split("=")[1]);
    }
  }, []);

  const handleToggle = async () => {
    if (!token) {
      alert("Please login to save colleges.");
      return;
    }
    
    setLoading(true);
    try {
      const action = isSaved ? "remove" : "save";
      await apiClient.users.toggleSaved(token, collegeId, action);
      setIsSaved(!isSaved);
    } catch (err) {
      console.error(err);
      alert("Failed to update saved status.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button 
      onClick={handleToggle}
      disabled={loading}
      variant={isSaved ? "default" : "outline"}
      className={`rounded-full px-8 py-6 text-base font-semibold transition-all duration-300 gap-2.5 shadow-lg active:scale-95 ${
        isSaved 
          ? "bg-emerald-500 hover:bg-emerald-600 text-white border-transparent shadow-emerald-500/25" 
          : "bg-white/20 backdrop-blur-md hover:bg-white/30 text-white border-white/40 shadow-black/10"
      }`}
    >
      {loading ? (
        <Loader2 className="w-5 h-5 animate-spin" />
      ) : (
        <Bookmark className={`w-5 h-5 transition-transform duration-300 ${isSaved ? "fill-white scale-110" : ""}`} />
      )}
      <span>{loading ? "Saving..." : isSaved ? "Saved" : "Save College"}</span>
    </Button>
  );
}
