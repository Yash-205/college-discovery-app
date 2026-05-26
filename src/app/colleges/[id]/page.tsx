import prisma from '@/lib/prisma';
import { Header } from '@/components/layout/Header';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
  Star,
  MapPin,
  IndianRupee,
  Building2,
  BookOpen,
  Briefcase,
  MessageSquare,
  ChevronLeft,
  GraduationCap,
  Clock,
  User,
} from 'lucide-react';

export default async function CollegeDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const college = await prisma.college.findUnique({
    where: { id },
    include: {
      discussions: {
        orderBy: { createdAt: 'desc' },
        include: {
          author: { select: { name: true, email: true } },
          answers: {
            orderBy: { createdAt: 'asc' },
            include: { author: { select: { name: true, email: true } } },
          },
        },
      },
    },
  });

  if (!college) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <Building2 size={64} className="mx-auto text-slate-300 mb-4" />
          <h1 className="text-2xl font-bold text-slate-700">College not found</h1>
          <Link href="/colleges">
            <Button className="mt-4">Back to Colleges</Button>
          </Link>
        </div>
      </div>
    );
  }

  const totalAnswers = college.discussions.reduce(
    (sum, d) => sum + d.answers.length,
    0
  );

  return (
    <div className="min-h-screen bg-slate-50">
      <Header />

      <main className="container mx-auto px-4 py-10 max-w-5xl">

        {/* Back */}
        <Link
          href="/colleges"
          className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-800 mb-6 transition-colors"
        >
          <ChevronLeft size={16} />
          Back to Colleges
        </Link>

        {/* ── Hero Card ─────────────────────────────────────── */}
        <div className="bg-white rounded-3xl shadow-sm overflow-hidden">
          {college.imageUrl && (
            <div className="w-full h-64 relative">
              <img
                src={college.imageUrl}
                alt={college.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
                <h1 className="text-3xl font-extrabold leading-tight drop-shadow">
                  {college.name}
                </h1>
                <div className="flex flex-wrap gap-4 mt-3 text-sm text-white/90">
                  <span className="flex items-center gap-1.5">
                    <MapPin size={14} />
                    {college.location}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Star size={14} className="fill-yellow-400 text-yellow-400" />
                    {college.rating} / 5
                  </span>
                  <span className="flex items-center gap-1.5">
                    <IndianRupee size={14} />
                    {college.fees.toLocaleString('en-IN')} / year
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Stats row */}
          <div className="grid grid-cols-3 divide-x border-t text-center">
            <div className="py-5">
              <p className="text-2xl font-bold text-indigo-600">{college.rating}/5</p>
              <p className="text-xs text-slate-500 mt-0.5">Overall Rating</p>
            </div>
            <div className="py-5">
              <p className="text-2xl font-bold text-emerald-600">
                {college.courses.length}
              </p>
              <p className="text-xs text-slate-500 mt-0.5">Programmes</p>
            </div>
            <div className="py-5">
              <p className="text-2xl font-bold text-violet-600">
                {college.discussions.length}
              </p>
              <p className="text-xs text-slate-500 mt-0.5">Discussions</p>
            </div>
          </div>
        </div>

        {/* ── Overview ─────────────────────────────────────── */}
        {college.overview && (
          <section className="bg-white rounded-3xl mt-6 p-8 shadow-sm">
            <h2 className="text-xl font-bold flex items-center gap-2 text-slate-800 mb-4">
              <Building2 size={20} className="text-indigo-500" />
              Overview
            </h2>
            <p className="text-slate-600 leading-relaxed">{college.overview}</p>
          </section>
        )}

        {/* ── Courses ──────────────────────────────────────── */}
        {college.courses.length > 0 && (
          <section className="bg-white rounded-3xl mt-6 p-8 shadow-sm">
            <h2 className="text-xl font-bold flex items-center gap-2 text-slate-800 mb-5">
              <GraduationCap size={20} className="text-indigo-500" />
              Programmes Offered
            </h2>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {college.courses.map((course, i) => (
                <li
                  key={i}
                  className="flex items-center gap-3 bg-indigo-50 text-indigo-800 rounded-xl px-4 py-3 text-sm font-medium"
                >
                  <BookOpen size={15} className="shrink-0 text-indigo-400" />
                  {course}
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* ── Placements ───────────────────────────────────── */}
        {college.placements && (
          <section className="bg-white rounded-3xl mt-6 p-8 shadow-sm">
            <h2 className="text-xl font-bold flex items-center gap-2 text-slate-800 mb-4">
              <Briefcase size={20} className="text-emerald-500" />
              Placements
            </h2>
            <p className="text-slate-600 leading-relaxed">{college.placements}</p>
          </section>
        )}

        {/* ── Reviews (static array from DB) ───────────────── */}
        {college.reviews.length > 0 && (
          <section className="bg-white rounded-3xl mt-6 p-8 shadow-sm">
            <h2 className="text-xl font-bold flex items-center gap-2 text-slate-800 mb-5">
              <Star size={20} className="text-yellow-500" />
              Student Reviews
            </h2>
            <div className="space-y-4">
              {college.reviews.map((review, i) => (
                <blockquote
                  key={i}
                  className="border-l-4 border-yellow-400 pl-4 italic text-slate-600"
                >
                  "{review}"
                </blockquote>
              ))}
            </div>
          </section>
        )}

        {/* ── Discussions ──────────────────────────────────── */}
        <section className="bg-white rounded-3xl mt-6 p-8 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold flex items-center gap-2 text-slate-800">
              <MessageSquare size={20} className="text-violet-500" />
              Discussions
              <span className="ml-1 text-sm font-normal text-slate-400">
                ({college.discussions.length} threads · {totalAnswers} replies)
              </span>
            </h2>
          </div>

          {college.discussions.length === 0 ? (
            <div className="text-center py-12 text-slate-400">
              <MessageSquare size={40} className="mx-auto mb-3 opacity-40" />
              <p>No discussions yet. Be the first to start one!</p>
            </div>
          ) : (
            <div className="space-y-6">
              {college.discussions.map((d) => (
                <div
                  key={d.id}
                  className="border border-slate-100 rounded-2xl p-6 hover:border-indigo-200 transition-colors"
                >
                  {/* Thread header */}
                  <h3 className="font-semibold text-slate-800 text-base mb-1">
                    {d.title}
                  </h3>
                  <p className="text-slate-500 text-sm leading-relaxed mb-3">
                    {d.body}
                  </p>
                  <div className="flex items-center gap-3 text-xs text-slate-400">
                    <span className="flex items-center gap-1">
                      <User size={12} />
                      {d.author?.name ?? d.author?.email ?? 'Anonymous'}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock size={12} />
                      {new Date(d.createdAt).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </span>
                    <span className="flex items-center gap-1">
                      <MessageSquare size={12} />
                      {d.answers.length} {d.answers.length === 1 ? 'reply' : 'replies'}
                    </span>
                  </div>

                  {/* Answers */}
                  {d.answers.length > 0 && (
                    <div className="mt-4 ml-4 space-y-3 border-l-2 border-slate-100 pl-4">
                      {d.answers.map((a) => (
                        <div key={a.id} className="text-sm">
                          <p className="text-slate-600">{a.body}</p>
                          <div className="flex items-center gap-2 mt-1 text-xs text-slate-400">
                            <User size={11} />
                            {a.author?.name ?? a.author?.email ?? 'Anonymous'}
                            <span>·</span>
                            {new Date(a.createdAt).toLocaleDateString('en-IN', {
                              day: 'numeric',
                              month: 'short',
                            })}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </section>

      </main>
    </div>
  );
}