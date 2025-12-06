"use client";

import { useState } from "react";
import { CertificateGallery } from "./certificate-gallery";
import { CertificateLightbox } from "./certificate-lightbox";

const R2_BASE_URL = "https://pub-a159d5c51e44442897e06986a53dda1d.r2.dev";

const certificates = [
  {
    id: "construction-line-gold",
    name: "Construction Line Gold",
    thumbnail: `${R2_BASE_URL}/certificates/thumbs/construction-line-gold-thumb.webp`,
    fullImage: `${R2_BASE_URL}/certificates/full/construction-line-gold-full.webp`,
    description:
      "Government-backed certification demonstrating supply chain excellence and compliance with rigorous standards for construction contractors.",
  },
  {
    id: "chas-premium-plus",
    name: "CHAS Premium Plus",
    thumbnail: `${R2_BASE_URL}/certificates/thumbs/chas-membership-thumb.webp`,
    fullImage: `${R2_BASE_URL}/certificates/full/chas-membership-full.webp`,
    description:
      "Contractors Health and Safety Assessment Scheme accreditation, demonstrating compliance with health and safety legislation.",
  },
  {
    id: "scaffolding-contractor",
    name: "Scaffolding Contractor Certificate",
    thumbnail: `${R2_BASE_URL}/certificates/thumbs/scaffolding-contractor-thumb.webp`,
    fullImage: `${R2_BASE_URL}/certificates/full/scaffolding-contractor-full.webp`,
    description:
      "Professional scaffolding contractor certification validating expertise and compliance with industry standards.",
  },
  {
    id: "iasme-cyber-essentials",
    name: "IASME Cyber Essentials",
    thumbnail: `${R2_BASE_URL}/certificates/thumbs/iasme-cyber-essentials-thumb.webp`,
    fullImage: `${R2_BASE_URL}/certificates/full/iasme-cyber-essentials-full.webp`,
    description:
      "Information security certification demonstrating commitment to protecting client data and business systems.",
  },
  {
    id: "business-registration",
    name: "Business Registration Certificate",
    thumbnail: `${R2_BASE_URL}/certificates/thumbs/business-registration-thumb.webp`,
    fullImage: `${R2_BASE_URL}/certificates/full/business-registration-full.webp`,
    description:
      "Official business registration certificate confirming legal status and company registration details.",
  },
];

export function AccreditationSection() {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  const handleSelectCertificate = (certificate: (typeof certificates)[0]) => {
    const index = certificates.findIndex((c) => c.id === certificate.id);
    setSelectedIndex(index >= 0 ? index : 0);
    setIsLightboxOpen(true);
  };

  return (
    <>
      {/* Featured Accreditations - Construction Line Gold & CHAS */}
      <div className="mb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-3xl mx-auto">
          {/* Construction Line Gold Badge */}
          <div className="text-center p-6 bg-gradient-to-br from-amber-50 to-yellow-100 rounded-2xl border-2 border-amber-300 shadow-md">
            <div className="w-20 h-20 bg-gradient-to-br from-amber-400 to-yellow-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
              <svg
                className="w-10 h-10 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"
                />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-amber-900 mb-2">Construction Line Gold</h3>
            <p className="text-amber-800 text-sm font-medium mb-2">Approved Contractor</p>
            <p className="text-amber-700 text-sm">
              Government-backed certification for supply chain excellence and compliance
            </p>
          </div>

          {/* CHAS Badge */}
          <div className="text-center p-6 bg-gradient-to-br from-green-50 to-emerald-100 rounded-2xl border-2 border-green-300 shadow-md">
            <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
              <svg
                className="w-10 h-10 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-green-900 mb-2">CHAS Premium Plus</h3>
            <p className="text-green-800 text-sm font-medium mb-2">Registered Contractor</p>
            <p className="text-green-700 text-sm">
              Health and safety assessment scheme approved contractor
            </p>
          </div>
        </div>
      </div>

      {/* Certificate Gallery */}
      <div className="mt-12">
        <h3 className="text-xl font-semibold text-gray-900 text-center mb-6">
          View Our Certificates
        </h3>
        <p className="text-gray-600 text-center mb-8 max-w-2xl mx-auto">
          Click on any certificate below to view the full document
        </p>
        <CertificateGallery certificates={certificates} onSelect={handleSelectCertificate} />
      </div>

      {/* Lightbox */}
      <CertificateLightbox
        certificates={certificates}
        selectedIndex={selectedIndex}
        isOpen={isLightboxOpen}
        onClose={() => setIsLightboxOpen(false)}
        onNavigate={setSelectedIndex}
      />
    </>
  );
}
