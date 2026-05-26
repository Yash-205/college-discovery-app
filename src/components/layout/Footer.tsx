import Link from "next/link";
import { GraduationCap, Mail, Globe, MessageCircle } from "lucide-react";

const navLinks = [
  {
    heading: "Explore",
    links: [
      { label: "All Colleges",   href: "/colleges" },
      { label: "Compare",        href: "/compare" },
      { label: "Discussions",    href: "/discussions" },
    ],
  },
  {
    heading: "Cities",
    links: [
      { label: "Mumbai",     href: "/colleges?location=Mumbai" },
      { label: "New Delhi",  href: "/colleges?location=New+Delhi" },
      { label: "Chennai",    href: "/colleges?location=Chennai" },
      { label: "Vellore",   href: "/colleges?location=Vellore" },
      { label: "Trichy",    href: "/colleges?location=Trichy" },
    ],
  },
  {
    heading: "Account",
    links: [
      { label: "Login",    href: "/login" },
      { label: "Register", href: "/register" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-400 mt-auto">
      <div className="container mx-auto px-4 max-w-7xl py-16">

        {/* Top row */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-12 pb-12 border-b border-slate-800">

          {/* Brand */}
          <div className="md:col-span-2">
            <Link href="/" className="inline-flex items-center gap-2.5 group mb-4">
              <div className="w-9 h-9 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-900/40 group-hover:bg-indigo-500 transition-colors">
                <GraduationCap className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-black text-white tracking-tight">
                College<span className="text-indigo-400">Find</span>
              </span>
            </Link>
            <p className="text-sm leading-relaxed text-slate-500 max-w-xs">
              Helping students discover, compare, and choose the best colleges
              across India — with real data and real student voices.
            </p>

            {/* Socials */}
            <div className="flex items-center gap-3 mt-6">
              {[
                { icon: <MessageCircle className="w-4 h-4" />,  href: "#", label: "Twitter"  },
                { icon: <Globe className="w-4 h-4" />,   href: "#", label: "GitHub"   },
                { icon: <Mail className="w-4 h-4" />,     href: "#", label: "Email"    },
              ].map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  aria-label={s.label}
                  className="w-9 h-9 rounded-xl bg-slate-800 hover:bg-indigo-600 flex items-center justify-center transition-colors text-slate-400 hover:text-white"
                >
                  {s.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Nav columns */}
          {navLinks.map((col) => (
            <div key={col.heading}>
              <h3 className="text-xs font-bold text-slate-300 uppercase tracking-widest mb-5">
                {col.heading}
              </h3>
              <ul className="space-y-3">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-slate-500 hover:text-white transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-8 text-xs text-slate-600">
          <p>© {new Date().getFullYear()} CollegeFind. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <a href="#" className="hover:text-slate-400 transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-slate-400 transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-slate-400 transition-colors">Contact</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
