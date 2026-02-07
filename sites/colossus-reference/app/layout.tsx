import Image from "next/image";
import Link from "next/link";
import "./globals.css";
import type { Metadata, Viewport } from "next";
import { MobileMenu, LocationsDropdown } from "@platform/core-components";
import { Footer } from "@platform/core-components/components/ui/footer";
import { ConsentManager } from "@platform/core-components/components/analytics/ConsentManager";
import { Analytics } from "@platform/core-components/components/analytics/Analytics";
import { AnalyticsDebugPanel } from "@platform/core-components/components/analytics/AnalyticsDebugPanel";
import { PHONE_DISPLAY, PHONE_TEL } from "@/lib/contact-info";
import { getContentItems } from "@/lib/content";
import { getAllCounties } from "@/lib/locations-dropdown";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  viewportFit: "cover",
};

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

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  // Fetch locations for navigation
  const allLocations = await getContentItems("locations");
  const locationItems = allLocations.map((loc) => ({
    name: loc.title,
    slug: loc.slug,
  }));
  const counties = getAllCounties();

  const criticalStyles = `
    /* Critical CSS for above-the-fold content */
    body {
      min-height: 100vh;
      background-color: #ffffff;
      color: #0f172a;
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
      font-family: 'GeistSans', Arial, Helvetica, sans-serif;
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

    /* Main content container - full width to allow sections to extend edge-to-edge */
    main {
      width: 100%;
    }
  `;

  return (
    <html lang="en-GB">
      <head>
        {/* Resource hints for faster external resource loading */}
        <link rel="preconnect" href="https://pub-a159d5c51e44442897e06986a53dda1d.r2.dev" />
        <link rel="dns-prefetch" href="https://www.googletagmanager.com" />
        <link rel="dns-prefetch" href="https://www.google-analytics.com" />
        <link rel="dns-prefetch" href="https://connect.facebook.net" />
        {/* Geo meta tags for local SEO targeting */}
        <meta name="geo.region" content="GB-ESX" />
        <meta name="geo.placename" content="East Sussex" />
        <meta name="geo.position" content="50.8570;0.5750" />
        <meta name="ICBM" content="50.8570, 0.5750" />
        <style dangerouslySetInnerHTML={{ __html: criticalStyles }} />
      </head>
      <body className="min-h-screen bg-white text-slate-900 antialiased">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:bg-brand-primary focus:text-white focus:px-4 focus:py-2 focus:rounded"
        >
          Skip to main content
        </a>

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
              <LocationsDropdown locations={locationItems} counties={counties} />
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
              <a href={`tel:${PHONE_TEL}`} className="phone-link">
                <svg
                  aria-hidden="true"
                  className="phone-icon"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                </svg>
                <span className="font-medium">{PHONE_DISPLAY}</span>
              </a>
              <Link href="/contact" className="btn-primary">
                Get Free Quote
              </Link>
            </div>

            {/* Mobile Menu Component */}
            <MobileMenu
              phoneDisplay={PHONE_DISPLAY}
              phoneTel={PHONE_TEL}
              locations={locationItems}
            />
          </div>
        </header>

        <main id="main-content">{children}</main>

        {/* Footer - Global footer for all pages */}
        <Footer />

        {/* Analytics System - ConsentManager will handle page detection internally */}
        <ConsentManager
          enabled={process.env.NEXT_PUBLIC_FEATURE_CONSENT_BANNER === "true"}
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
