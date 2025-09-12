"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"

function MobileNav() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="md:hidden">
      <button 
        className="p-2 text-gray-600 hover:text-gray-900"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Toggle mobile menu"
      >
        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>
      
      {isOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-40"
            onClick={() => setIsOpen(false)}
          />
          
          {/* Mobile menu panel */}
          <div className="fixed top-0 right-0 h-full w-64 bg-white shadow-xl z-50 transform transition-transform duration-300 ease-in-out">
            <div className="flex flex-col h-full">
              {/* Header with close button */}
              <div className="flex items-center justify-between p-4 border-b border-gray-200">
                <span className="text-lg font-semibold text-gray-900">Menu</span>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-2 text-gray-600 hover:text-gray-900"
                  aria-label="Close menu"
                >
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              {/* Navigation links */}
              <nav className="flex-1 px-4 py-6">
                <div className="space-y-4">
                  <Link 
                    href="/services" 
                    className="block py-2 text-gray-900 hover:text-brand-blue transition-colors font-medium"
                    onClick={() => setIsOpen(false)}
                  >
                    Services
                  </Link>
                  <Link 
                    href="/locations" 
                    className="block py-2 text-gray-900 hover:text-brand-blue transition-colors font-medium"
                    onClick={() => setIsOpen(false)}
                  >
                    Locations
                  </Link>
                  <Link 
                    href="/about" 
                    className="block py-2 text-gray-900 hover:text-brand-blue transition-colors font-medium"
                    onClick={() => setIsOpen(false)}
                  >
                    About
                  </Link>
                  <Link 
                    href="/contact" 
                    className="block py-2 text-gray-900 hover:text-brand-blue transition-colors font-medium"
                    onClick={() => setIsOpen(false)}
                  >
                    Contact
                  </Link>
                </div>
                
                {/* Contact info */}
                <div className="mt-8 pt-8 border-t border-gray-200">
                  <div className="flex items-center space-x-2 text-gray-900 mb-4">
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    <span className="font-semibold text-sm">01424 466 661</span>
                  </div>
                  <Link
                    href="/contact"
                    className="block w-full text-center px-4 py-2 bg-brand-blue text-white font-semibold rounded-lg hover:bg-brand-blue-hover transition-colors text-sm"
                    onClick={() => setIsOpen(false)}
                  >
                    Get Free Quote
                  </Link>
                </div>
              </nav>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export function Header() {
  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50 backdrop-blur-sm bg-white/95">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <Image
              src="/Colossus-Scaffolding-Logo.svg"
              alt="Colossus Scaffolding"
              width={180}
              height={47}
              className="h-8 w-auto sm:h-10"
            />
          </Link>

          <nav className="hidden md:flex items-center space-x-8">
            <Link href="/services" className="text-gray-900 hover:text-brand-blue transition-colors font-medium">
              Services
            </Link>
            <Link href="/locations" className="text-gray-900 hover:text-brand-blue transition-colors font-medium">
              Locations
            </Link>
            <Link href="/about" className="text-gray-900 hover:text-brand-blue transition-colors font-medium">
              About
            </Link>
            <Link href="/contact" className="text-gray-900 hover:text-brand-blue transition-colors font-medium">
              Contact
            </Link>
          </nav>

          <div className="flex items-center space-x-4">
            <div className="hidden lg:flex items-center space-x-2 text-gray-900">
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              <span className="font-semibold">01424 466 661</span>
            </div>
            <Link
              href="/contact"
              className="hidden sm:inline-flex items-center justify-center px-4 py-2 bg-brand-blue text-white font-semibold rounded-lg hover:bg-brand-blue-hover transition-colors"
            >
              Get Free Quote
            </Link>
            <MobileNav />
          </div>
        </div>
      </div>
    </header>
  )
}
