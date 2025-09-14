import Image from "next/image";
import Link from "next/link";
import "./globals.css";
import type { Metadata } from "next";
import MobileMenu from "@/components/ui/mobile-menu";
import { Footer } from "@/components/ui/footer";

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL
      || (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000")
  ),
  title: {
    default: "Colossus Scaffolding",
    template: "%s | Colossus Scaffolding",
  },
  description: "Professional scaffolding services across the South East.",
};

const PHONE_NUMBER = "01424 466 661";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-white text-slate-900 antialiased">
        <header className="border-b bg-white shadow-sm">
          <div className="mx-auto w-full lg:w-[90%] px-6 py-4 flex items-center justify-between">
            {/* Logo */}
            <Link href="/" className="flex items-center">
              <div style={{ position: "relative", width: 180, height: 48 }}>
                <Image
                  src="/Colossus-Scaffolding-Logo.svg"
                  alt="Colossus Scaffolding"
                  fill
                  sizes="180px"
                  priority
                  style={{ objectFit: "contain" }}
                />
              </div>
            </Link>

            {/* Desktop Navigation - Centered */}
            <nav className="hidden lg:flex items-center gap-8 text-lg font-medium">
              <Link href="/services" className="text-slate-700 hover:text-brand-blue transition-colors">
                Services
              </Link>
              <Link href="/locations" className="text-slate-700 hover:text-brand-blue transition-colors">
                Locations
              </Link>
              <Link href="/about" className="text-slate-700 hover:text-brand-blue transition-colors">
                About
              </Link>
              <Link href="/contact" className="text-slate-700 hover:text-brand-blue transition-colors">
                Contact
              </Link>
            </nav>

            {/* Desktop Phone & CTA */}
            <div className="hidden lg:flex items-center gap-4">
              <a
                href={`tel:${PHONE_NUMBER}`}
                className="flex items-center gap-2 text-slate-700 hover:text-brand-blue transition-colors"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z"/>
                </svg>
                <span className="font-medium">{PHONE_NUMBER}</span>
              </a>
              <Link
                href="/contact"
                className="bg-brand-blue text-white px-6 py-2.5 rounded-md hover:bg-brand-blue-hover transition-colors font-semibold"
              >
                Get Free Quote
              </Link>
            </div>

            {/* Mobile Menu Component */}
            <MobileMenu phoneNumber={PHONE_NUMBER} />
          </div>
        </header>

        <main className="mx-auto w-full lg:w-[90%] px-6 py-10">{children}</main>
        
        <Footer />
      </body>
    </html>
  );
}
