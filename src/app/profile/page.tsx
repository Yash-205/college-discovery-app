import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import jwt from "jsonwebtoken";
import prisma from "@/lib/prisma";
import Link from "next/link";
import { MapPin, GraduationCap, IndianRupee, Star, BookOpen, User, Mail } from "lucide-react";
import { Header } from "@/components/layout/Header";

export default async function ProfilePage() {
  const cookieStore = await cookies();
  const tokenCookie = cookieStore.get("token");

  if (!tokenCookie || !tokenCookie.value) {
    redirect("/login");
  }

  const token = tokenCookie.value;
  let decoded: any;
  try {
    const secret = process.env.NEXTAUTH_SECRET || "fallback_secret";
    decoded = jwt.verify(token, secret);
  } catch (error) {
    // Invalid or expired token
    redirect("/login");
  }

  const userId = decoded.userId;

  // Fetch the user and their saved colleges
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      savedColleges: true,
    },
  });

  if (!user) {
    redirect("/login");
  }

  // Get initials for the avatar fallback
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Header />
      <div className="flex-grow py-12">
        <div className="container mx-auto px-6 max-w-6xl">
        {/* Profile Header Section */}
        <div className="bg-white rounded-[2rem] shadow-[0_4px_24px_rgba(0,0,0,0.04)] p-8 md:p-12 mb-12 flex flex-col md:flex-row items-center gap-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 rounded-full bg-blue-50 blur-3xl opacity-50 pointer-events-none" />
          
          {/* Avatar */}
          <div className="relative">
            <div className="w-32 h-32 md:w-40 md:h-40 rounded-full bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center text-white text-5xl font-bold shadow-[0_8px_32px_rgba(37,99,235,0.25)] border-4 border-white z-10 relative">
              {user.avatar ? (
                <img src={user.avatar} alt={user.name || "User"} className="w-full h-full object-cover rounded-full" />
              ) : (
                getInitials(user.name || user.email)
              )}
            </div>
            <div className="absolute -bottom-2 -right-2 bg-emerald-500 w-10 h-10 rounded-full border-4 border-white z-20 flex items-center justify-center">
              <div className="w-3 h-3 bg-white rounded-full"></div>
            </div>
          </div>

          {/* User Details */}
          <div className="text-center md:text-left z-10">
            <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-2">{user.name || "Student"}</h1>
            <div className="flex items-center justify-center md:justify-start gap-2 text-slate-500 mb-6">
              <Mail className="w-4 h-4" />
              <span>{user.email}</span>
            </div>
            <div className="flex gap-4 justify-center md:justify-start">
              <div className="bg-slate-100 px-4 py-2 rounded-xl">
                <span className="block text-2xl font-bold text-blue-600">{user.savedColleges.length}</span>
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Saved Colleges</span>
              </div>
            </div>
          </div>
        </div>

        {/* Saved Colleges Section */}
        <div>
          <h2 className="text-2xl font-bold text-slate-900 mb-8 flex items-center gap-3">
            <Star className="w-6 h-6 text-yellow-500 fill-yellow-500" />
            Your Saved Colleges
          </h2>

          {user.savedColleges.length === 0 ? (
            <div className="bg-white rounded-[2rem] shadow-[0_4px_24px_rgba(0,0,0,0.04)] p-12 text-center flex flex-col items-center">
              <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center mb-6">
                <BookOpen className="w-10 h-10 text-slate-400" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">No colleges saved yet</h3>
              <p className="text-slate-500 max-w-md mb-8">
                Start exploring colleges and hit the save button to keep track of your favorites here.
              </p>
              <Link 
                href="/colleges" 
                className="bg-blue-600 text-white font-semibold py-3 px-8 rounded-full hover:bg-blue-700 hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
              >
                Explore Colleges
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {user.savedColleges.map((college) => (
                <Link
                  key={college.id}
                  href={`/colleges/${college.id}`}
                  className="group bg-white rounded-[2rem] overflow-hidden shadow-[0_4px_24px_rgba(0,0,0,0.04)] hover:shadow-[0_20px_40px_rgba(0,0,0,0.08)] transition-all duration-500 hover:-translate-y-2 border border-slate-100/50 flex flex-col"
                >
                  <div className="relative h-56 overflow-hidden">
                    <img
                      src={college.imageUrl || "https://images.unsplash.com/photo-1562774053-701939374585?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"}
                      alt={college.name}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-slate-900/20 to-transparent"></div>
                    
                    {/* Badge */}
                    <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-sm px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-sm">
                      <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                      <span className="text-sm font-bold text-slate-800">{college.rating.toFixed(1)}</span>
                    </div>

                    <div className="absolute bottom-4 left-4 right-4">
                      <h3 className="text-xl font-bold text-white mb-1 line-clamp-1">{college.name}</h3>
                      <div className="flex items-center gap-1.5 text-slate-200 text-sm">
                        <MapPin className="w-4 h-4" />
                        <span>{college.location}</span>
                      </div>
                    </div>
                  </div>
                  <div className="p-6 flex-grow flex flex-col justify-between">
                    <p className="text-slate-600 text-sm mb-6 line-clamp-2 leading-relaxed">
                      {college.overview || "An excellent institution providing quality education and modern facilities."}
                    </p>
                    <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center">
                          <IndianRupee className="w-4 h-4 text-blue-600" />
                        </div>
                        <div>
                          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Fees</p>
                          <p className="font-bold text-slate-900">₹{(college.fees / 100000).toFixed(2)}L<span className="text-xs text-slate-500 font-normal"> /yr</span></p>
                        </div>
                      </div>
                      <div className="flex items-center justify-center w-10 h-10 rounded-full bg-slate-50 text-slate-400 group-hover:bg-blue-600 group-hover:text-white transition-colors duration-300">
                        <svg className="w-5 h-5 rtl:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
      </div>
    </div>
  );
}
