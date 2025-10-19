import Image from "next/image";
import Link from "next/link";
import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import MobileMenu from "@/components/ui/mobile-menu";
import { LocationsDropdown } from "@/components/ui/locations-dropdown";
import { ConsentManager, Analytics, AnalyticsDebugPanel } from "@/components/analytics";
import { Footer } from "@/components/ui/footer";

// Optimize font loading with next/font
const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
  preload: true,
});

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ||
      (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000")
  ),
  title: {
    default: "Colossus Scaffolding",
    template: "%s | Colossus Scaffolding",
  },
  description: "Professional scaffolding services across the South East.",
};

const PHONE_NUMBER = "01424 466 661";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const criticalStyles = `
    /* Critical CSS for above-the-fold content */
    body {
      min-height: 100vh;
      background-color: #ffffff;
      color: #0f172a;
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
      font-family: var(--font-inter), system-ui, -apple-system, sans-serif;
    }

    /* Header styles */
    header {
      border-bottom: 1px solid #e2e8f0;
      background-color: #ffffff;
      box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);
    }

    /* Header container */
    header > div {
      margin-left: auto;
      margin-right: auto;
      width: 100%;
      padding-left: 1.5rem;
      padding-right: 1.5rem;
      padding-top: 1rem;
      padding-bottom: 1rem;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    @media (min-width: 1024px) {
      header > div {
        width: 90%;
      }
    }

    /* Navigation styles */
    nav {
      display: none;
      align-items: center;
      gap: 2rem;
      font-size: 1.125rem;
      font-weight: 500;
    }

    @media (min-width: 1024px) {
      nav {
        display: flex;
      }
    }

    /* Navigation links */
    nav a {
      color: #334155;
      transition: color 0.2s ease-in-out;
      text-decoration: none;
    }

    nav a:hover {
      color: #005A9E;
    }

    /* Desktop phone and CTA container */
    .desktop-actions {
      display: none;
      align-items: center;
      gap: 1rem;
    }

    @media (min-width: 1024px) {
      .desktop-actions {
        display: flex;
      }
    }

    /* Phone link styles */
    .phone-link {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      color: #334155;
      transition: color 0.2s ease-in-out;
      text-decoration: none;
      font-weight: 500;
    }

    .phone-link:hover {
      color: #005A9E;
    }

    /* Primary button styles */
    .btn-primary {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      padding: 0.75rem 1.5rem;
      background-color: #005A9E;
      color: #ffffff;
      font-weight: 600;
      border-radius: 0.5rem;
      transition: all 0.2s ease-in-out;
      text-decoration: none;
      border: none;
      cursor: pointer;
    }

    .btn-primary:hover {
      background-color: #004d87;
    }

    .btn-primary:focus {
      outline: none;
      box-shadow: 0 0 0 2px #005A9E, 0 0 0 4px rgba(0, 90, 158, 0.1);
    }

    /* Logo container */
    .logo-container {
      display: flex;
      align-items: center;
      text-decoration: none;
    }

    /* Icon styles */
    .phone-icon {
      width: 1.25rem;
      height: 1.25rem;
    }

    /* Main content container - matches PageLayout */
    main {
      margin-left: auto;
      margin-right: auto;
      width: 100%;
      padding-left: 1.5rem;
      padding-right: 1.5rem;
      padding-top: 2.5rem;
      padding-bottom: 2.5rem;
    }

    @media (min-width: 1024px) {
      main {
        width: 90%;
      }
    }

    /* Hero Section Critical Styles (for LCP optimization) */
    .hero-section {
      padding: 4rem 0;
      background-color: #ffffff;
    }

    @media (min-width: 1024px) {
      .hero-section {
        padding: 6rem 0;
      }
    }

    .hero-grid {
      display: grid;
      grid-template-columns: 1fr;
      gap: 3rem;
      align-items: center;
    }

    @media (min-width: 1024px) {
      .hero-grid {
        grid-template-columns: 1fr 1fr;
      }
    }

    .hero-title {
      font-size: 2.25rem;
      font-weight: 700;
      color: #111827;
      margin-bottom: 1.5rem;
      line-height: 1.2;
    }

    @media (min-width: 768px) {
      .hero-title {
        font-size: 3rem;
      }
    }

    @media (min-width: 1024px) {
      .hero-title {
        font-size: 3.75rem;
      }
    }

    .hero-description {
      font-size: 1.25rem;
      color: #1f2937;
      margin-bottom: 2rem;
      line-height: 1.75;
    }

    .hero-image-container {
      position: relative;
      height: 400px;
      border-radius: 1rem;
      box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
      overflow: hidden;
      background-color: #e5e7eb;
    }

    .hero-image {
      object-fit: cover;
      width: 100%;
      height: 100%;
    }

    /* CTA Buttons */
    .hero-cta-container {
      display: flex;
      flex-direction: column;
      gap: 1rem;
      margin-bottom: 2rem;
    }

    @media (min-width: 640px) {
      .hero-cta-container {
        flex-direction: row;
      }
    }

    /* Trust Badges */
    .trust-badges {
      display: flex;
      flex-wrap: wrap;
      gap: 0.5rem;
    }

    @media (min-width: 640px) {
      .trust-badges {
        gap: 1rem;
      }
    }

    .trust-badge {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      background-color: #f3f4f6;
      padding: 0.5rem 0.75rem;
      border-radius: 9999px;
      font-size: 0.75rem;
    }

    @media (min-width: 640px) {
      .trust-badge {
        padding: 0.5rem 1rem;
        font-size: 0.875rem;
      }
    }

    .trust-icon {
      width: 0.75rem;
      height: 0.75rem;
      color: #005A9E;
    }

    @media (min-width: 640px) {
      .trust-icon {
        width: 1rem;
        height: 1rem;
      }
    }
  `;

  return (
    <html lang="en" className={inter.variable}>
      <head>
        {/* Inline critical CSS for instant above-the-fold render */}
        <style dangerouslySetInnerHTML={{ __html: criticalStyles }} />
        {/* Preload LCP hero image for parallel download */}
        <link
          rel="preload"
          as="image"
          href="https://pub-b08de0b7d5f742228cc9f399c6f9e0cb.r2.dev/colossus-reference/hero/home/main_01.webp"
          imageSrcSet="https://pub-b08de0b7d5f742228cc9f399c6f9e0cb.r2.dev/colossus-reference/hero/home/main_01.webp 640w, https://pub-b08de0b7d5f742228cc9f399c6f9e0cb.r2.dev/colossus-reference/hero/home/main_01.webp 750w, https://pub-b08de0b7d5f742228cc9f399c6f9e0cb.r2.dev/colossus-reference/hero/home/main_01.webp 828w, https://pub-b08de0b7d5f742228cc9f399c6f9e0cb.r2.dev/colossus-reference/hero/home/main_01.webp 1080w"
          imageSizes="(max-width: 768px) 100vw, 50vw"
          fetchPriority="high"
        />
      </head>
      <body className="min-h-screen bg-white text-slate-900 antialiased">
        <header className="border-b bg-white shadow-sm">
          <div className="mx-auto w-full lg:w-[90%] px-6 py-4 flex items-center justify-between">
            {/* Logo */}
            <Link href="/" className="logo-container">
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
              <Link
                href="/services"
                className="text-slate-700 hover:text-brand-blue transition-colors"
              >
                Services
              </Link>
              <LocationsDropdown />
              <Link
                href="/about"
                className="text-slate-700 hover:text-brand-blue transition-colors"
              >
                About
              </Link>
              <Link
                href="/contact"
                className="text-slate-700 hover:text-brand-blue transition-colors"
              >
                Contact
              </Link>
            </nav>

            {/* Desktop Phone & CTA */}
            <div className="desktop-actions">
              <a href={`tel:${PHONE_NUMBER}`} className="phone-link">
                <svg className="phone-icon" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                </svg>
                <span className="font-medium">{PHONE_NUMBER}</span>
              </a>
              <Link href="/contact" className="btn-primary">
                Get Free Quote
              </Link>
            </div>

            {/* Mobile Menu Component */}
            <MobileMenu phoneNumber={PHONE_NUMBER} />
          </div>
        </header>

        {children}

        {/* Footer - Global footer for all pages */}
        <Footer />

        {/* Analytics System - ConsentManager will handle page detection internally */}
        <ConsentManager
          enabled={process.env.FEATURE_CONSENT_BANNER === "true"}
          config={{
            title: "We value your privacy",
            description:
              "We use cookies to provide better services and improve your experience. Choose which cookies to accept.",
            privacyPolicyUrl: "/privacy-policy",
            cookiePolicyUrl: "/cookie-policy",
          }}
          reloadOnConsent={false}
        />

        <Analytics
          gaId={process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID}
          facebookPixelId={process.env.NEXT_PUBLIC_FACEBOOK_PIXEL_ID}
          googleAdsId={process.env.NEXT_PUBLIC_GOOGLE_ADS_CUSTOMER_ID}
          debugMode={process.env.NODE_ENV === "development"}
        />

        <AnalyticsDebugPanel enabled={process.env.NODE_ENV === "development"} />
      </body>
    </html>
  );
}
