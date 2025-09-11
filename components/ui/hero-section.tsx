"use client"

import { Shield, Award, Phone } from "lucide-react"
import Link from "next/link"

export function HeroSection() {
  return (
    <section className="relative bg-gradient-to-br from-gray-50 to-gray-100 py-16 sm:py-20 lg:py-32 overflow-hidden">
      <div className="mx-auto max-w-7xl px-6 relative">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-heading font-bold text-gray-900 mb-4 sm:mb-6 leading-tight">
            Professional Scaffolding Services Across the South East UK
          </h1>

          <p className="text-lg sm:text-xl text-gray-600 mb-6 sm:mb-8 max-w-2xl mx-auto leading-relaxed">
            TG20:21 compliant scaffolding solutions for residential, commercial, and industrial projects. Fully insured
            with CHAS accreditation and £10M liability coverage.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center mb-8 sm:mb-12">
            <Link
              href="/contact"
              className="inline-flex items-center justify-center bg-brand-blue text-white text-base sm:text-lg px-6 sm:px-8 py-3 sm:py-6 rounded-lg hover:bg-brand-blue-hover hover:scale-105 transition-all duration-200 font-semibold"
            >
              Get Free Quote
            </Link>
            <a
              href="tel:01424466661"
              className="inline-flex items-center justify-center gap-2 text-base sm:text-lg px-6 sm:px-8 py-3 sm:py-6 bg-transparent border border-gray-300 hover:bg-gray-50 hover:scale-105 transition-all duration-200 rounded-lg font-medium text-gray-900"
            >
              <Phone className="h-4 w-4 sm:h-5 sm:w-5" />
              <span className="hidden sm:inline">Call Now: </span>01424 466 661
            </a>
          </div>

          <div className="flex flex-wrap justify-center gap-2 sm:gap-4 mb-6 sm:mb-8">
            <Link href="/about" className="inline-flex items-center gap-2 bg-white px-3 sm:px-4 py-2 rounded-full text-xs sm:text-sm border border-gray-200 hover:bg-gray-50 transition-colors duration-200">
              <Shield className="h-3 w-3 sm:h-4 sm:w-4 text-brand-blue" />
              TG20:21 Compliant
            </Link>
            <Link href="/about" className="inline-flex items-center gap-2 bg-white px-3 sm:px-4 py-2 rounded-full text-xs sm:text-sm border border-gray-200 hover:bg-gray-50 transition-colors duration-200">
              <Award className="h-3 w-3 sm:h-4 sm:w-4 text-brand-blue" />
              CHAS Accredited
            </Link>
            <Link href="/about" className="bg-white px-3 sm:px-4 py-2 rounded-full text-xs sm:text-sm border border-gray-200 hover:bg-gray-50 transition-colors duration-200">
              £10M Insured
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
