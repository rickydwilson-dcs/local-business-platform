import Link from "next/link"
import Image from "next/image"
import { MobileMenu } from "@/components/MobileMenu"

export function Header() {
  return (
    <header className="bg-brand-black border-b border-gray-800 sticky top-0 z-50 backdrop-blur-sm bg-brand-black/95">
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

          {/* Desktop Navigation - Hidden on mobile */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link href="/services" className="text-brand-white hover:text-brand-blue transition-colors font-medium">
              Services
            </Link>
            <Link href="/locations" className="text-brand-white hover:text-brand-blue transition-colors font-medium">
              Areas
            </Link>
            <Link href="/about" className="text-brand-white hover:text-brand-blue transition-colors font-medium">
              About
            </Link>
            <Link href="/contact" className="text-brand-white hover:text-brand-blue transition-colors font-medium">
              Contact
            </Link>
          </nav>

          <div className="flex items-center space-x-4">
            {/* Desktop Phone Number */}
            <div className="hidden lg:flex items-center space-x-2 text-brand-white">
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              <span className="font-semibold">01424 466 661</span>
            </div>
            
            {/* Desktop CTA Button */}
            <Link
              href="/contact"
              className="hidden sm:inline-flex items-center justify-center px-4 py-2 bg-brand-blue text-white font-semibold rounded-lg hover:bg-brand-blue-hover transition-colors"
            >
              Get Free Quote
            </Link>
            
            {/* Mobile Menu - Only visible on mobile */}
            <MobileMenu />
          </div>
        </div>
      </div>
    </header>
  )
}
