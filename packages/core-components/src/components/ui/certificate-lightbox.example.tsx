/**
 * Example Usage of CertificateLightbox Component
 *
 * This file demonstrates how to implement the CertificateLightbox component
 * in your application. This is NOT imported anywhere - it's documentation only.
 */

"use client";

import { useState } from "react";
import { CertificateLightbox } from "./certificate-lightbox";
import Image from "next/image";

// Example certificate data structure
const exampleCertificates = [
  {
    id: "cert-1",
    name: "CHAS Accreditation",
    thumbnail: "/certificates/chas-thumb.jpg",
    fullImage: "/certificates/chas-full.jpg",
    description:
      "CHAS (Contractors Health and Safety Assessment Scheme) accreditation demonstrating our commitment to health and safety excellence.",
  },
  {
    id: "cert-2",
    name: "TG20:21 Compliance",
    thumbnail: "/certificates/tg20-thumb.jpg",
    fullImage: "/certificates/tg20-full.jpg",
    description:
      "TG20:21 compliance certificate showing adherence to the latest scaffolding design guidance.",
  },
  {
    id: "cert-3",
    name: "CITB Registration",
    thumbnail: "/certificates/citb-thumb.jpg",
    fullImage: "/certificates/citb-full.jpg",
    description:
      "CITB (Construction Industry Training Board) registration confirming our industry training standards.",
  },
  {
    id: "cert-4",
    name: "Public Liability Insurance",
    thumbnail: "/certificates/insurance-thumb.jpg",
    fullImage: "/certificates/insurance-full.jpg",
    description: "£10 million public liability insurance certificate for your peace of mind.",
  },
  {
    id: "cert-5",
    name: "ISO 9001:2015",
    thumbnail: "/certificates/iso-thumb.jpg",
    fullImage: "/certificates/iso-full.jpg",
    description: "ISO 9001:2015 Quality Management System certification.",
  },
];

export function CertificateGalleryExample() {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  const handleCertificateClick = (index: number) => {
    setSelectedIndex(index);
    setIsLightboxOpen(true);
  };

  const handleCloseLightbox = () => {
    setIsLightboxOpen(false);
  };

  const handleNavigate = (index: number) => {
    setSelectedIndex(index);
  };

  return (
    <section className="section-standard bg-white">
      <div className="container-standard">
        <div className="section-header">
          <h2 className="heading-section">Our Certifications & Accreditations</h2>
          <p className="text-subtitle">Fully accredited and insured for your peace of mind</p>
        </div>

        {/* Certificate Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-6">
          {exampleCertificates.map((cert, index) => (
            <button
              key={cert.id}
              onClick={() => handleCertificateClick(index)}
              className="card-interactive cursor-pointer group"
              aria-label={`View ${cert.name} certificate`}
            >
              <div className="relative h-32 sm:h-40 mb-4">
                <Image
                  src={cert.thumbnail}
                  alt={cert.name}
                  fill
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
                  className="object-contain"
                />
              </div>
              <h3 className="text-sm sm:text-base font-semibold text-gray-900 text-center group-hover:text-brand-primary transition-colors">
                {cert.name}
              </h3>
            </button>
          ))}
        </div>

        {/* Certificate Lightbox */}
        <CertificateLightbox
          certificates={exampleCertificates}
          selectedIndex={selectedIndex}
          isOpen={isLightboxOpen}
          onClose={handleCloseLightbox}
          onNavigate={handleNavigate}
        />
      </div>
    </section>
  );
}

/**
 * Alternative: Simple Inline Example
 *
 * If you want a minimal implementation without the gallery,
 * you can trigger the lightbox from any button:
 */
export function SimpleCertificateExample() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button onClick={() => setIsOpen(true)} className="btn-primary">
        View Our Certificates
      </button>

      <CertificateLightbox
        certificates={exampleCertificates}
        selectedIndex={0}
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        onNavigate={() => {}} // Optional: can be empty function if no navigation needed
      />
    </>
  );
}

/**
 * Key Integration Points:
 *
 * 1. State Management:
 *    - useState for selectedIndex (which certificate is shown)
 *    - useState for isLightboxOpen (whether lightbox is visible)
 *
 * 2. Event Handlers:
 *    - handleCertificateClick: Opens lightbox at specific index
 *    - handleCloseLightbox: Closes the lightbox
 *    - handleNavigate: Changes the displayed certificate
 *
 * 3. Accessibility:
 *    - Focus returns to trigger element on close
 *    - Keyboard navigation (ESC, Left/Right arrows)
 *    - ARIA labels and roles
 *    - Screen reader announcements
 *
 * 4. User Experience:
 *    - Click outside to close
 *    - Smooth animations
 *    - Navigation arrows only show when applicable
 *    - Position indicator (e.g., "2 of 5")
 *    - Responsive design (full-screen on mobile)
 */
