"use client";

import Link from "next/link";
import { Home, ArrowLeft, Phone, Mail } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        <div className="mb-8">
          <div className="text-6xl font-bold text-colossus-blue mb-4">404</div>
          <h1 className="text-2xl font-semibold text-gray-900 mb-2">Page Not Found</h1>
          <p className="text-gray-600 mb-8">
            Sorry, we couldn&apos;t find the page you&apos;re looking for. It may have been moved or
            no longer exists.
          </p>
        </div>

        <div className="space-y-4">
          <Link
            href="/"
            className="inline-flex items-center gap-2 bg-colossus-blue text-white px-6 py-3 rounded-md hover:bg-colossus-blue/90 transition-colors w-full justify-center"
          >
            <Home className="w-4 h-4" />
            Go to Homepage
          </Link>

          <button
            onClick={() => window.history.back()}
            className="inline-flex items-center gap-2 bg-white text-colossus-blue border border-colossus-blue px-6 py-3 rounded-md hover:bg-colossus-blue hover:text-white transition-colors w-full justify-center"
          >
            <ArrowLeft className="w-4 h-4" />
            Go Back
          </button>
        </div>

        <div className="mt-8 pt-8 border-t border-gray-200">
          <p className="text-gray-600 text-sm mb-4">Need help? Contact us directly:</p>
          <div className="space-y-2">
            <Link
              href="tel:01424466661"
              className="inline-flex items-center gap-2 text-colossus-blue hover:text-colossus-blue/80 transition-colors"
            >
              <Phone className="w-4 h-4" />
              01424 466 661
            </Link>
            <div className="text-gray-400">•</div>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 text-colossus-blue hover:text-colossus-blue/80 transition-colors"
            >
              <Mail className="w-4 h-4" />
              Contact Form
            </Link>
          </div>
        </div>

        <div className="mt-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Popular Pages</h2>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <Link
              href="/services"
              className="text-colossus-blue hover:text-colossus-blue/80 transition-colors py-2"
            >
              Our Services
            </Link>
            <Link
              href="/locations"
              className="text-colossus-blue hover:text-colossus-blue/80 transition-colors py-2"
            >
              Service Areas
            </Link>
            <Link
              href="/about"
              className="text-colossus-blue hover:text-colossus-blue/80 transition-colors py-2"
            >
              About Us
            </Link>
            <Link
              href="/contact"
              className="text-colossus-blue hover:text-colossus-blue/80 transition-colors py-2"
            >
              Get Quote
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
