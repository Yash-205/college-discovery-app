import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Footer } from "@/components/layout/Footer";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "College Planning Made Simple: College Search, Courses & Exams | CollegeFind",
    template: "%s | CollegeFind",
  },
  description:
    "Search colleges by fees, location, and courses. On CollegeFind, you can start your search, build your shortlist, compare options, and read real student discussions in one place.",
  keywords: [
    "college search India",
    "compare colleges",
    "best colleges India",
    "engineering colleges",
    "IIT BITS NIT",
    "college fees ratings",
    "college discovery",
  ],
  authors: [{ name: "CollegeFind" }],
  creator: "CollegeFind",
  metadataBase: new URL("https://collegefind.in"),
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "https://collegefind.in",
    siteName: "CollegeFind",
    title: "CollegeFind — Discover Your Perfect College",
    description:
      "Search, compare, and discover the best colleges across India.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "CollegeFind",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "CollegeFind — Discover Your Perfect College",
    description: "Search, compare, and discover the best colleges across India.",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col font-sans">
        {children}
        <Footer />
      </body>
    </html>
  );
}
