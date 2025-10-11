"use client";

import Link from "next/link";
import { useState } from "react";
import { siteConfig } from "../site.config";

export default function Navigation() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav className="bg-blue-600 text-white sticky top-0 z-50 shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo/Brand */}
          <Link href="/" className="text-xl font-bold hover:text-blue-100">
            {siteConfig.business.name}
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            <Link
              href="/"
              className="hover:text-blue-100 transition font-medium"
            >
              Home
            </Link>
            <Link
              href="/services"
              className="hover:text-blue-100 transition font-medium"
            >
              Services
            </Link>
            <Link
              href="/locations"
              className="hover:text-blue-100 transition font-medium"
            >
              Areas We Serve
            </Link>
            <a
              href={`tel:${siteConfig.business.phone}`}
              className="bg-white text-blue-600 px-4 py-2 rounded-lg font-semibold hover:bg-blue-50 transition"
            >
              {siteConfig.business.phone}
            </a>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {mobileMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-blue-500">
            <div className="flex flex-col gap-4">
              <Link
                href="/"
                className="hover:text-blue-100 transition font-medium"
                onClick={() => setMobileMenuOpen(false)}
              >
                Home
              </Link>
              <Link
                href="/services"
                className="hover:text-blue-100 transition font-medium"
                onClick={() => setMobileMenuOpen(false)}
              >
                Services
              </Link>
              <Link
                href="/locations"
                className="hover:text-blue-100 transition font-medium"
                onClick={() => setMobileMenuOpen(false)}
              >
                Areas We Serve
              </Link>
              <a
                href={`tel:${siteConfig.business.phone}`}
                className="bg-white text-blue-600 px-4 py-2 rounded-lg font-semibold hover:bg-blue-50 transition text-center"
              >
                Call {siteConfig.business.phone}
              </a>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
