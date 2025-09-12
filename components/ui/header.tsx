"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"

function MobileNav() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="md:hidden">
      <button 
        className="p-2 text-gray-600 hover:text-gray-900 relative z-50"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Toggle mobile menu"
      >
        {isOpen ? (
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        )}
      </button>
      
      {isOpen && (
        <div className="fixed inset-0 z-40">
          {/* Dark backdrop overlay */}
          <div 
            className="absolute inset-0 bg-black bg-opacity-50"
            onClick={() => setIsOpen(false)}
          />
          
          {/* White menu content */}
          <div className="absolute inset-0 flex flex-col" style={{backgroundColor: 'rgba(255, 255, 255, 0.98)'}}>
            {/* Spacer for header */}
            <div className="h-16 sm:h-20"></div>
            
            <div className="flex-1 flex flex-col justify-center items-center px-6 -mt-16" style={{backgroundColor: 'white'}}>
              <nav className="space-y-8 text-center">
                <Link 
                  href="/services" 
                  className="block text-2xl font-medium text-gray-900 hover:text-brand-blue transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  Services
                </Link>
                <Link 
                  href="/locations" 
                  className="block text-2xl font-medium text-gray-900 hover:text-brand-blue transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  Locations
                </Link>
                <Link 
                  href="/about" 
                  className="block text-2xl font-medium text-gray-900 hover:text-brand-blue transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  About
                </Link>
                <Link 
                  href="/contact" 
                  className="block text-2xl font-medium text-gray-900 hover:text-brand-blue transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  Contact
                </Link>
              </nav>
              
              <div className="mt-12 text-center">
                <div className="flex items-center justify-center space-x-2 text-gray-900 mb-6">
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  <span className="font-semibold text-lg">01424 466 661</span>
                </div>
                <Link
                  href="/contact"
                  className="inline-flex items-center justify-center px-8 py-3 bg-brand-blue text-white font-semibold rounded-lg hover:bg-brand-blue-hover transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  Get Free Quote
                </Link>
              </div>
            </div>
          </div>
        </div>
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
