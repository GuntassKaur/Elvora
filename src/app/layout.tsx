import type { Metadata } from "next";
import { Cormorant_Garamond, Plus_Jakarta_Sans, Syne } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import CartDrawer from "@/components/CartDrawer";
import ToastContainer from "@/components/ToastContainer";
import Footer from "@/components/Footer";
import SupabaseProvider from "@/components/SupabaseProvider";
import CustomCursor from "@/components/CustomCursor";
import Preloader from "@/components/Preloader";

const serifFont = Cormorant_Garamond({
  variable: "--font-serif",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  style: ["normal", "italic"],
});

const sansFont = Plus_Jakarta_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
});

const displayFont = Syne({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});

export const metadata: Metadata = {
  title: {
    default: "ELVORA — Wear Confidence.",
    template: "%s — ELVORA",
  },
  description: "ELVORA is a luxury fashion maison. Architecturally tailored outerwear, fine-gauge knitwear and essential leather goods for the modern wardrobe.",
  keywords: ["luxury fashion", "outerwear", "knitwear", "tailoring", "India premium fashion", "ELVORA"],
  openGraph: {
    title: "ELVORA — Wear Confidence.",
    description: "A luxury fashion maison. Tailored coats, fine knitwear, leather accessories.",
    type: "website",
    locale: "en_IN",
    siteName: "ELVORA",
  },
  twitter: {
    card: "summary_large_image",
    title: "ELVORA — Wear Confidence.",
    description: "A luxury fashion maison. Tailored coats, fine knitwear, leather accessories.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${serifFont.variable} ${sansFont.variable} ${displayFont.variable} antialiased`}
    >
      <body className="min-h-screen flex flex-col font-sans bg-[#faf9f6] text-[#0a0a0a] selection:bg-[#0a0a0a] selection:text-[#faf9f6] overflow-x-hidden">
        <CustomCursor />
        <Preloader />
        <SupabaseProvider />
        <Navbar />
        <CartDrawer />
        <ToastContainer />
        <main className="flex-grow">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
