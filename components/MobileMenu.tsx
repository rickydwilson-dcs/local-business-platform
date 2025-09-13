'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

export function MobileMenu() {
  const [isOpen, setIsOpen] = useState(false)

  // Close menu on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsOpen(false)
      }
    }
    
    if (isOpen) {
      document.addEventListener('keydown', handleEscape)
      // Prevent body scroll when menu is open
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }

    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  const closeMenu = () => setIsOpen(false)

  return (
    <div className="md:hidden">
      {/* Hamburger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative z-50 flex flex-col items-center justify-center w-8 h-8 space-y-1 p-1"
        aria-label="Toggle mobile menu"
        aria-expanded={isOpen}
      >
        <span
          className={`block h-0.5 w-6 bg-white transition-transform duration-300 ease-in-out ${
            isOpen ? 'rotate-45 translate-y-2' : 'rotate-0 translate-y-0'
          }`}
        />
        <span
          className={`block h-0.5 w-6 bg-white transition-opacity duration-300 ease-in-out ${
            isOpen ? 'opacity-0' : 'opacity-100'
          }`}
        />
        <span
          className={`block h-0.5 w-6 bg-white transition-transform duration-300 ease-in-out ${
            isOpen ? '-rotate-45 -translate-y-2' : 'rotate-0 translate-y-0'
          }`}
        />
      </button>

      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={closeMenu}
          aria-hidden="true"
        />
      )}

      {/* Off-Canvas Menu Panel */}
      <div
        className={`fixed top-0 right-0 h-full w-80 max-w-[80vw] bg-brand-black text-brand-white z-50 transform transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-800">
            <h2 className="text-lg font-semibold text-brand-white">Menu</h2>
            <button
              onClick={closeMenu}
              className="p-2 text-brand-white hover:text-brand-blue transition-colors rounded-lg"
              aria-label="Close menu"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="flex-1 px-6 py-8">
            <ul className="space-y-6">
              <li>
                <Link
                  href="/services"
                  className="block text-xl font-medium text-brand-white hover:text-brand-blue transition-colors py-2"
                  onClick={closeMenu}
                >
                  Services
                </Link>
              </li>
              <li>
                <Link
                  href="/locations"
                  className="block text-xl font-medium text-brand-white hover:text-brand-blue transition-colors py-2"
                  onClick={closeMenu}
                >
                  Areas
                </Link>
              </li>
              <li>
                <Link
                  href="/about"
                  className="block text-xl font-medium text-brand-white hover:text-brand-blue transition-colors py-2"
                  onClick={closeMenu}
                >
                  About
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="block text-xl font-medium text-brand-white hover:text-brand-blue transition-colors py-2"
                  onClick={closeMenu}
                >
                  Contact
                </Link>
              </li>
            </ul>
          </nav>

          {/* Bottom CTA */}
          <div className="p-6 border-t border-gray-800">
            <div className="space-y-4">
              {/* Phone Number */}
              <div className="flex items-center space-x-3 text-brand-white">
                <svg className="h-5 w-5 text-brand-blue" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                <span className="font-semibold">01424 466 661</span>
              </div>
              
              {/* CTA Button */}
              <Link
                href="/contact"
                className="block w-full text-center px-6 py-3 bg-brand-blue text-white font-semibold rounded-lg hover:bg-brand-blue-hover transition-colors"
                onClick={closeMenu}
              >
                Get A Quote
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}