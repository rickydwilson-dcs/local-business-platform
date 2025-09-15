'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

interface MobileMenuProps {
  phoneNumber: string;
}

export default function MobileMenu({ phoneNumber }: MobileMenuProps) {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const closeMenu = () => {
    setIsOpen(false);
  };

  return (
    <>
      {/* Hamburger Button - Only visible on mobile/tablet */}
      <button
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          toggleMenu();
        }}
        className="lg:hidden p-2 rounded-md hover:bg-gray-200 transition-colors focus:outline-none focus:ring-2 focus:ring-brand-blue"
        aria-label="Toggle mobile menu"
        aria-expanded={isOpen}
        type="button"
      >
        <div className="w-6 h-6 flex flex-col justify-center space-y-1">
          <span
            className={`block h-0.5 w-6 bg-slate-700 transition-transform duration-300 ease-in-out ${
              isOpen ? 'rotate-45 translate-y-1.5' : ''
            }`}
          />
          <span
            className={`block h-0.5 w-6 bg-slate-700 transition-opacity duration-300 ease-in-out ${
              isOpen ? 'opacity-0' : ''
            }`}
          />
          <span
            className={`block h-0.5 w-6 bg-slate-700 transition-transform duration-300 ease-in-out ${
              isOpen ? '-rotate-45 -translate-y-1.5' : ''
            }`}
          />
        </div>
      </button>

      {/* Full Screen Overlay Menu - Matches the prototype exactly */}
      <div
        className={`fixed inset-0 bg-white z-50 transition-transform duration-300 ease-in-out lg:hidden ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Header with Logo and Close Button */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <Link href="/" onClick={closeMenu} className="flex items-center">
            <div style={{ position: "relative", width: 140, height: 36 }}>
              <Image
                src="/Colossus-Scaffolding-Logo.svg"
                alt="Colossus Scaffolding"
                width={140}
                height={36}
                style={{ objectFit: "contain" }}
              />
            </div>
          </Link>
          <button
            onClick={closeMenu}
            className="p-2 rounded-lg border-2 border-brand-blue text-brand-blue hover:bg-brand-blue hover:text-white transition-colors focus:outline-none"
            aria-label="Close mobile menu"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Navigation Links - Large vertical layout */}
        <nav className="flex flex-col px-6 py-12 space-y-8">
          <Link
            href="/services"
            onClick={closeMenu}
            className="text-xl font-medium text-slate-800 hover:text-brand-blue transition-colors py-4"
          >
            Services
          </Link>
          <Link
            href="/locations"
            onClick={closeMenu}
            className="text-xl font-medium text-slate-800 hover:text-brand-blue transition-colors py-4"
          >
            Locations
          </Link>
          <Link
            href="/about"
            onClick={closeMenu}
            className="text-xl font-medium text-slate-800 hover:text-brand-blue transition-colors py-4"
          >
            About
          </Link>
          <Link
            href="/contact"
            onClick={closeMenu}
            className="text-xl font-medium text-slate-800 hover:text-brand-blue transition-colors py-4"
          >
            Contact
          </Link>
        </nav>

        {/* Bottom Section with Phone and CTA */}
        <div className="absolute bottom-0 left-0 right-0 p-6 space-y-6">
          {/* Phone Number Section */}
          <div className="text-center">
            <div className="flex items-center justify-center gap-3 mb-2">
              <svg className="w-6 h-6 text-brand-blue" fill="currentColor" viewBox="0 0 20 20">
                <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z"/>
              </svg>
              <a
                href={`tel:${phoneNumber}`}
                className="text-2xl font-bold text-slate-800 hover:text-brand-blue transition-colors"
                onClick={closeMenu}
              >
                {phoneNumber}
              </a>
            </div>
            <p className="text-lg text-slate-600">24/7 Emergency</p>
          </div>

          {/* Get Free Quote Button */}
          <Link
            href="/contact"
            onClick={closeMenu}
            className="block w-full bg-brand-blue text-white text-center py-4 px-6 rounded-lg hover:bg-brand-blue-hover transition-colors font-bold text-lg"
          >
            Get Free Quote
          </Link>
        </div>
      </div>
    </>
  );
}
