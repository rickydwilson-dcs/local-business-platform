import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Designlab Eastbourne — Signs & Graphics",
  description: "High-quality signs, vehicle wraps, and graphics from Eastbourne.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;700&display=swap"
        />
      </head>
      <body className="min-h-screen bg-surface-background text-surface-foreground">
        <header className="bg-surface-inverse text-surface-inverse-foreground sticky top-0 z-50">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
            <span className="font-heading font-bold text-lg tracking-tight">Designlab</span>
            <nav className="hidden md:flex items-center gap-8 text-sm font-medium">
              <a
                href="#"
                className="opacity-80 hover:opacity-100 hover:text-brand-primary transition-colors"
              >
                Signs
              </a>
              <a
                href="#"
                className="opacity-80 hover:opacity-100 hover:text-brand-primary transition-colors"
              >
                Vehicles
              </a>
              <a
                href="#"
                className="opacity-80 hover:opacity-100 hover:text-brand-primary transition-colors"
              >
                Projects
              </a>
              <a
                href="#"
                className="opacity-80 hover:opacity-100 hover:text-brand-primary transition-colors"
              >
                About
              </a>
              <a
                href="#"
                className="bg-brand-primary text-brand-on-primary hover:bg-brand-primary-hover rounded px-4 py-2 font-semibold transition-colors"
              >
                Get a Quote
              </a>
            </nav>
          </div>
        </header>
        {children}
        <footer className="bg-surface-inverse text-surface-inverse-foreground">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <p className="font-bold text-lg mb-3">Designlab</p>
              <p className="text-sm opacity-60 leading-relaxed">
                Signs, graphics, and vehicle wraps crafted in Eastbourne since 2004.
              </p>
            </div>
            <div>
              <p className="font-semibold mb-3 text-sm uppercase tracking-wide text-brand-primary">
                Services
              </p>
              <ul className="space-y-2 text-sm opacity-80">
                <li>
                  <a href="#" className="hover:text-brand-primary transition-colors">
                    Shop Signs
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-brand-primary transition-colors">
                    Vehicle Wraps
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-brand-primary transition-colors">
                    Exhibition Displays
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-brand-primary transition-colors">
                    Window Graphics
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <p className="font-semibold mb-3 text-sm uppercase tracking-wide text-brand-primary">
                Contact
              </p>
              <ul className="space-y-2 text-sm opacity-80">
                <li>Eastbourne, East Sussex</li>
                <li>hello@designlab-eastbourne.co.uk</li>
                <li>01323 000 000</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-white/10 text-center py-4 text-xs opacity-40">
            © 2026 Designlab Eastbourne Ltd. All rights reserved.
          </div>
        </footer>
      </body>
    </html>
  );
}
