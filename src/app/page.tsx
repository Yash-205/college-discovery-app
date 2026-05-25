import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 flex flex-col items-center justify-center p-8 relative overflow-hidden">
      {/* Background gradients for a premium feel */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/30 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-600/30 blur-[120px] rounded-full pointer-events-none" />

      <main className="z-10 flex flex-col items-center text-center max-w-3xl space-y-8">
        <div className="space-y-4">
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight">
            Discover Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">Dream College</span>
          </h1>
          <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto">
            The ultimate platform to search, compare, and decide on the best college for your future.
          </p>
        </div>

        <div className="flex gap-4">
          <Link href="/colleges" className={buttonVariants({ size: "lg" }) + " bg-blue-600 hover:bg-blue-700 text-white rounded-full px-8"}>
            Explore Colleges
          </Link>
          <Link href="/api/test" target="_blank" className={buttonVariants({ variant: "outline", size: "lg" }) + " rounded-full px-8 border-slate-700 hover:bg-slate-800 text-slate-300"}>
            Test API Connection
          </Link>
        </div>
      </main>
    </div>
  );
}
