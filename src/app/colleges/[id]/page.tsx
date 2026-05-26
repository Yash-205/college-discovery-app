import prisma from '@/lib/prisma';
import { Header } from '@/components/layout/Header';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
  Star,
  MapPin,
  IndianRupee,
  Building2
} from 'lucide-react';

export default async function CollegeDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params;

  const college = await prisma.college.findUnique({
    where: { id },
    include: {
      discussions: {
        include: {
          author: {
            select: {
              name: true,
              email: true
            }
          },
          answers: true
        }
      }
    }
  });

  if (!college) {
    return (
      <div className="p-10 text-center">
        College not found
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Header />

      <main className="container mx-auto px-4 py-10">

        {/* Hero */}

        <div className="bg-white rounded-3xl p-8 shadow">

          <div className="flex gap-8">

            <div className="w-64 h-64 rounded-xl bg-slate-100 flex items-center justify-center">
              {college.imageUrl ? (
                <img
                  src={college.imageUrl}
                  alt={college.name}
                  className="w-full h-full object-cover rounded-xl"
                />
              ) : (
                <Building2 size={60}/>
              )}
            </div>

            <div>

              <h1 className="text-4xl font-bold">
                {college.name}
              </h1>

              <div className="flex gap-2 mt-4">
                <MapPin />
                {college.location}
              </div>

              <div className="flex gap-2 mt-4">
                <Star />
                {college.rating}/5
              </div>

              <div className="flex gap-2 mt-4">
                <IndianRupee />
                {college.fees.toLocaleString()}
              </div>

              <Link href="/colleges">
                <Button className="mt-6">
                  Back
                </Button>
              </Link>

            </div>
          </div>

        </div>

        {/* Overview */}

        <div className="bg-white rounded-3xl mt-8 p-8 shadow">
          <h2 className="text-2xl font-bold">
            Overview
          </h2>

          <p className="mt-4">
            {college.overview}
          </p>
        </div>

        {/* Discussions */}

        <div className="bg-white rounded-3xl mt-8 p-8 shadow">

          <h2 className="text-2xl font-bold mb-6">
            Discussions
          </h2>

          {college.discussions.map((d) => (
            <div
              key={d.id}
              className="border-b py-4"
            >
              <h3 className="font-semibold">
                {d.title}
              </h3>

              <p>{d.body}</p>

              <div className="text-sm text-gray-500 mt-2">
                {d.author?.name}
              </div>
            </div>
          ))}

        </div>

      </main>
    </div>
  );
}