"use client";

import { useEffect, useState } from "react";
import { Header } from "@/components/layout/Header";
import { apiClient } from "@/lib/apiClient";
import { Button } from "@/components/ui/button";
import { MessageSquare, Calendar, User as UserIcon, Send, Search, Building2, Plus, ArrowRight } from "lucide-react";
import Link from "next/link";

interface Author {
  id: string;
  email: string;
  avatar: string | null;
}

interface Answer {
  id: string;
  body: string;
  author: Author;
  createdAt: string;
}

interface Discussion {
  id: string;
  title: string;
  body: string;
  author: Author;
  collegeId: string | null;
  college: { id: string; name: string } | null;
  answers: Answer[];
  createdAt: string;
}

interface College {
  id: string;
  name: string;
}

export default function DiscussionsPage() {
  const [discussions, setDiscussions] = useState<Discussion[]>([]);
  const [colleges, setColleges] = useState<College[]>([]);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState<string | null>(null);

  // Filter and active discussion states
  const [selectedCollegeId, setSelectedCollegeId] = useState<string>("");
  const [activeDiscussionId, setActiveDiscussionId] = useState<string | null>(null);

  // Form states
  const [isAsking, setIsAsking] = useState(false);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [collegeId, setCollegeId] = useState("");
  const [answerBody, setAnswerBody] = useState("");
  const [formError, setFormError] = useState("");
  const [answerError, setAnswerError] = useState("");

  useEffect(() => {
    // Read token from cookies
    const cookies = document.cookie.split("; ");
    const tokenCookie = cookies.find((row) => row.startsWith("token="));
    if (tokenCookie) {
      setToken(tokenCookie.split("=")[1]);
    }

    // Fetch initial data
    loadDiscussions();
    loadColleges();
  }, []);

  const loadDiscussions = async (cid?: string) => {
    setLoading(true);
    try {
      const data = await apiClient.discussions.browse(cid || undefined);
      setDiscussions(data);
    } catch (err) {
      console.error("Failed to load discussions", err);
    } finally {
      setLoading(false);
    }
  };

  const loadColleges = async () => {
    try {
      const data = await apiClient.colleges.search({});
      setColleges(data);
    } catch (err) {
      console.error("Failed to load colleges", err);
    }
  };

  const handleFilterChange = (cid: string) => {
    setSelectedCollegeId(cid);
    loadDiscussions(cid);
  };

  const handleAskQuestion = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");

    if (!token) {
      setFormError("Please log in to ask a question.");
      return;
    }

    try {
      await apiClient.discussions.ask(token, {
        title,
        body,
        collegeId: collegeId || undefined,
      });
      setTitle("");
      setBody("");
      setCollegeId("");
      setIsAsking(false);
      loadDiscussions(selectedCollegeId);
    } catch (err: any) {
      setFormError(err.message || "Failed to create discussion");
    }
  };

  const handleAnswerSubmit = async (e: React.FormEvent, discussionId: string) => {
    e.preventDefault();
    setAnswerError("");

    if (!token) {
      setAnswerError("Please log in to post an answer.");
      return;
    }

    if (!answerBody.trim()) {
      return;
    }

    try {
      await apiClient.discussions.answer(token, discussionId, answerBody);
      setAnswerBody("");
      loadDiscussions(selectedCollegeId);
    } catch (err: any) {
      setAnswerError(err.message || "Failed to submit answer");
    }
  };

  const activeDiscussion = discussions.find((d) => d.id === activeDiscussionId);

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      <Header />

      <main className="container mx-auto px-4 py-12 max-w-7xl">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-12">
          <div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">Q&A Discussions</h1>
            <p className="text-slate-500 mt-2">Get answers from current students, alumni, and experts.</p>
          </div>

          <div className="flex items-center gap-4 w-full md:w-auto">
            {/* Filter by College */}
            <div className="flex items-center bg-white border border-slate-200 rounded-full px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm shrink-0">
              <Building2 className="w-4 h-4 mr-2 text-slate-400" />
              <select
                value={selectedCollegeId}
                onChange={(e) => handleFilterChange(e.target.value)}
                className="bg-transparent border-none outline-none text-slate-700 pr-4 cursor-pointer"
              >
                <option value="">All Colleges</option>
                {colleges.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Ask Button */}
            <Button
              onClick={() => setIsAsking(!isAsking)}
              className="bg-blue-600 hover:bg-blue-700 text-white rounded-full px-6 py-5 text-sm font-semibold shadow-md shadow-blue-600/20 ml-auto"
            >
              <Plus className="w-4 h-4 mr-2" />
              Ask Question
            </Button>
          </div>
        </div>

        {/* Modal-like Dialog to Ask a Question */}
        {isAsking && (
          <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-xl max-w-2xl mx-auto mb-12 animate-in fade-in slide-in-from-bottom-4 duration-300">
            <h3 className="text-xl font-bold text-slate-950 mb-6">Ask a New Question</h3>
            {formError && (
              <div className="bg-red-50 text-red-600 p-4 rounded-xl text-sm font-medium mb-6">
                {formError}
              </div>
            )}
            <form onSubmit={handleAskQuestion} className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700">Question Title</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. How are the placements at IIT Delhi for Computer Science?"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 text-slate-900 transition-all"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700">Elaborate on your question</label>
                <textarea
                  required
                  rows={4}
                  value={body}
                  onChange={(e) => setBody(e.target.value)}
                  placeholder="Provide more context, specific details, or requirements..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 text-slate-900 transition-all resize-none"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700">Tag a Specific College (Optional)</label>
                <select
                  value={collegeId}
                  onChange={(e) => setCollegeId(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 text-slate-900 transition-all cursor-pointer"
                >
                  <option value="">Select a college...</option>
                  {colleges.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex gap-4 justify-end pt-2">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => setIsAsking(false)}
                  className="rounded-full px-6 text-slate-500 hover:text-slate-700"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 text-white rounded-full px-8 py-5 text-sm font-semibold"
                >
                  Submit Question
                </Button>
              </div>
            </form>
          </div>
        )}

        {/* Discussions Listing Grid/Columns */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          {/* Discussions List */}
          <div className="lg:col-span-2 space-y-6">
            {loading ? (
              <div className="space-y-4">
                {[1, 2, 3].map((n) => (
                  <div key={n} className="bg-white rounded-3xl p-6 border border-slate-100 animate-pulse h-40" />
                ))}
              </div>
            ) : discussions.length === 0 ? (
              <div className="bg-white rounded-3xl p-12 border border-slate-100 text-center">
                <MessageSquare className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                <h3 className="text-lg font-bold text-slate-900 mb-2">No discussions yet</h3>
                <p className="text-slate-500 text-sm">Be the first to ask a question!</p>
              </div>
            ) : (
              discussions.map((d) => (
                <div
                  key={d.id}
                  onClick={() => setActiveDiscussionId(d.id)}
                  className={`bg-white rounded-3xl p-6 border transition-all cursor-pointer flex flex-col justify-between ${
                    activeDiscussionId === d.id
                      ? "border-blue-600 shadow-md ring-1 ring-blue-600"
                      : "border-slate-100 hover:border-slate-200 hover:shadow-md"
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      {d.college && (
                        <span className="bg-blue-50 text-blue-700 text-xs font-semibold px-3 py-1 rounded-full flex items-center">
                          <Building2 className="w-3.5 h-3.5 mr-1" />
                          {d.college.name}
                        </span>
                      )}
                      <span className="text-xs text-slate-400 font-semibold flex items-center">
                        <Calendar className="w-3.5 h-3.5 mr-1" />
                        {new Date(d.createdAt).toLocaleDateString()}
                      </span>
                    </div>

                    <h3 className="text-lg font-bold text-slate-900 mb-2 hover:text-blue-600 transition-colors leading-tight">
                      {d.title}
                    </h3>
                    <p className="text-slate-500 text-sm line-clamp-2 mb-6 leading-relaxed">
                      {d.body}
                    </p>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-slate-50">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 font-bold text-xs border border-slate-200">
                        <UserIcon className="w-4 h-4" />
                      </div>
                      <span className="text-xs font-semibold text-slate-700">{d.author.email}</span>
                    </div>

                    <div className="flex items-center text-xs font-semibold text-blue-600 gap-1">
                      <MessageSquare className="w-4 h-4" />
                      {d.answers.length} {d.answers.length === 1 ? "answer" : "answers"}
                      <ArrowRight className="w-3.5 h-3.5 ml-1 transition-transform group-hover:translate-x-1" />
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Active Thread Detail View */}
          <div className="lg:col-span-1">
            {activeDiscussion ? (
              <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6 sticky top-28 space-y-6">
                <div>
                  <h3 className="text-xl font-extrabold text-slate-900 tracking-tight leading-tight">
                    {activeDiscussion.title}
                  </h3>
                  <p className="text-slate-600 text-sm mt-3 leading-relaxed whitespace-pre-line">
                    {activeDiscussion.body}
                  </p>
                  <div className="flex items-center gap-2 mt-4 text-xs font-semibold text-slate-400">
                    <UserIcon className="w-3.5 h-3.5" />
                    <span>Posted by {activeDiscussion.author.email}</span>
                  </div>
                </div>

                <div className="border-t border-slate-100 pt-6">
                  <h4 className="font-bold text-slate-800 text-sm mb-4">
                    Answers ({activeDiscussion.answers.length})
                  </h4>

                  <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2">
                    {activeDiscussion.answers.length === 0 ? (
                      <p className="text-xs text-slate-400 italic">No answers posted yet. Help this user out!</p>
                    ) : (
                      activeDiscussion.answers.map((ans) => (
                        <div key={ans.id} className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
                          <p className="text-slate-700 text-xs leading-relaxed mb-2 whitespace-pre-line">
                            {ans.body}
                          </p>
                          <div className="flex justify-between items-center text-[10px] text-slate-400 font-semibold">
                            <span>{ans.author.email}</span>
                            <span>{new Date(ans.createdAt).toLocaleDateString()}</span>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                {/* Reply Form */}
                <div className="border-t border-slate-100 pt-6">
                  {answerError && (
                    <div className="bg-red-50 text-red-600 p-2.5 rounded-xl text-xs font-medium mb-3">
                      {answerError}
                    </div>
                  )}
                  <form onSubmit={(e) => handleAnswerSubmit(e, activeDiscussion.id)} className="relative">
                    <textarea
                      required
                      rows={3}
                      value={answerBody}
                      onChange={(e) => setAnswerBody(e.target.value)}
                      placeholder="Write your answer..."
                      className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-xs outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 text-slate-900 transition-all resize-none pr-10"
                    />
                    <button
                      type="submit"
                      className="absolute right-3 bottom-4 text-blue-600 hover:text-blue-700 disabled:opacity-50"
                      disabled={!answerBody.trim()}
                    >
                      <Send className="w-5 h-5" />
                    </button>
                  </form>
                </div>
              </div>
            ) : (
              <div className="bg-slate-100/50 rounded-3xl p-8 border border-slate-200/40 text-center sticky top-28">
                <MessageSquare className="w-10 h-10 text-slate-400 mx-auto mb-3" />
                <p className="text-slate-500 text-sm font-semibold">Select a question to view full details and submit an answer</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
