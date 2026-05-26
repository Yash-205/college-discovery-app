import { Header } from "@/components/layout/Header";
import prisma from "@/lib/prisma";
import { Star, IndianRupee, MapPin, Building2, CheckCircle2 } from "lucide-react";

export const dynamic = 'force-dynamic';

export default async function ComparePage({
  searchParams,
}: {
  searchParams: Promise<{ ids?: string }>
}) {
  const resolvedParams = await searchParams;
  const ids = resolvedParams?.ids ? resolvedParams.ids.split(',') : [];

  const colleges = await prisma.college.findMany({
    where: {
      id: { in: ids }
    }
  });

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      <Header />
      <main className="container mx-auto px-4 py-12 max-w-7xl">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Compare Colleges</h1>
        <p className="text-slate-500 mb-12">Analyze fees, ratings, and locations side-by-side.</p>

        {colleges.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center shadow-sm border border-slate-100">
            <Building2 className="w-16 h-16 text-slate-300 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-slate-900 mb-2">No colleges selected</h2>
            <p className="text-slate-500">Go to the Colleges page and click "Compare" to add colleges here.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden text-left">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100">
                  <th className="p-6 text-slate-500 font-semibold w-48">Features</th>
                  {colleges.map(c => (
                    <th key={c.id} className="p-6">
                      <div className="font-bold text-lg text-slate-900">{c.name}</div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                
                {/* Location Row */}
                <tr>
                  <td className="p-6 text-slate-500 font-medium flex items-center gap-2">
                    <MapPin className="w-4 h-4" /> Location
                  </td>
                  {colleges.map(c => (
                    <td key={c.id} className="p-6 text-slate-700 font-medium">{c.location}</td>
                  ))}
                </tr>

                {/* Rating Row */}
                <tr>
                  <td className="p-6 text-slate-500 font-medium flex items-center gap-2">
                    <Star className="w-4 h-4" /> Rating
                  </td>
                  {colleges.map(c => (
                    <td key={c.id} className="p-6">
                      <div className="flex items-center gap-1 font-bold text-slate-900">
                        <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                        {c.rating} / 5.0
                      </div>
                    </td>
                  ))}
                </tr>

                {/* Fees Row */}
                <tr>
                  <td className="p-6 text-slate-500 font-medium flex items-center gap-2">
                    <IndianRupee className="w-4 h-4" /> Annual Fees
                  </td>
                  {colleges.map(c => (
                    <td key={c.id} className="p-6 font-bold text-blue-600">
                      ₹{c.fees.toLocaleString()}
                    </td>
                  ))}
                </tr>

              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  );
}
