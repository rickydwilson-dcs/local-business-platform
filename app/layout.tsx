import Image from "next/image";
import Link from "next/link";
import "./globals.css";
import type { Metadata } from "next";

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

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-white text-slate-900 antialiased">
        <header className="border-b bg-brand-black text-brand-white">
          <div className="mx-auto max-w-6xl px-6 py-4 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-3">
              <div style={{ position: "relative", width: 180, height: 48 }}>
                <Image
                  src="/logo-white.svg"
                  alt="Colossus Scaffolding"
                  fill
                  priority
                  style={{ objectFit: "contain" }}
                />
              </div>
            </Link>
            <nav className="flex gap-6 text-sm">
              <Link href="/services" className="hover:text-brand-blue">
                Services
              </Link>
              <Link href="/locations" className="hover:text-brand-blue">
                Areas
              </Link>
              <Link href="/contact" className="hover:text-brand-blue">
                Contact
              </Link>
            </nav>
          </div>
        </header>

        <main className="mx-auto max-w-6xl px-6 py-10">{children}</main>
      </body>
    </html>
  );
}
