"use client";

import { useEffect, useCallback, useRef } from "react";
import Image from "next/image";

interface Certificate {
  id: string;
  name: string;
  thumbnail: string;
  fullImage: string;
  description: string;
}

interface CertificateLightboxProps {
  certificates: Certificate[];
  selectedIndex: number;
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (index: number) => void;
}

export function CertificateLightbox({
  certificates,
  selectedIndex,
  isOpen,
  onClose,
  onNavigate,
}: CertificateLightboxProps) {
  const triggerElementRef = useRef<HTMLElement | null>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const selectedCertificate = certificates[selectedIndex];

  // Store the element that triggered the lightbox
  useEffect(() => {
    if (isOpen && !triggerElementRef.current) {
      triggerElementRef.current = document.activeElement as HTMLElement;
    }
  }, [isOpen]);

  // Handle keyboard navigation
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (!isOpen) return;

      switch (e.key) {
        case "Escape":
          e.preventDefault();
          onClose();
          break;
        case "ArrowLeft":
          e.preventDefault();
          if (selectedIndex > 0) {
            onNavigate(selectedIndex - 1);
          }
          break;
        case "ArrowRight":
          e.preventDefault();
          if (selectedIndex < certificates.length - 1) {
            onNavigate(selectedIndex + 1);
          }
          break;
        default:
          break;
      }
    },
    [isOpen, selectedIndex, certificates.length, onClose, onNavigate]
  );

  // Set up keyboard event listeners
  useEffect(() => {
    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown);
      // Focus close button when lightbox opens
      setTimeout(() => {
        closeButtonRef.current?.focus();
      }, 100);
    }

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, handleKeyDown]);

  // Return focus to trigger element when closing
  useEffect(() => {
    if (!isOpen && triggerElementRef.current) {
      triggerElementRef.current.focus();
      triggerElementRef.current = null;
    }
  }, [isOpen]);

  // Prevent body scroll when lightbox is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  // Handle navigation
  const handlePrevious = () => {
    if (selectedIndex > 0) {
      onNavigate(selectedIndex - 1);
    }
  };

  const handleNext = () => {
    if (selectedIndex < certificates.length - 1) {
      onNavigate(selectedIndex + 1);
    }
  };

  // Handle backdrop click
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!isOpen || !selectedCertificate) {
    return null;
  }

  return (
    <div
      className="lightbox-overlay"
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-label={`Certificate: ${selectedCertificate.name}`}
      aria-describedby="certificate-description"
    >
      <div className="lightbox-content">
        {/* Header */}
        <div className="lightbox-header">
          <div className="lightbox-header-title">
            <h2 className="lightbox-title">{selectedCertificate.name}</h2>
            <p className="lightbox-position" aria-live="polite" aria-atomic="true">
              {selectedIndex + 1} of {certificates.length}
            </p>
          </div>
          <button
            ref={closeButtonRef}
            onClick={onClose}
            className="lightbox-close-button"
            aria-label="Close certificate lightbox"
            type="button"
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

        {/* Certificate Image */}
        <div className="lightbox-image-container">
          <div className="lightbox-image-wrapper">
            <Image
              src={selectedCertificate.fullImage}
              alt={selectedCertificate.name}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1200px"
              className="lightbox-image"
              priority
            />
          </div>

          {/* Navigation Arrows */}
          {selectedIndex > 0 && (
            <button
              onClick={handlePrevious}
              className="lightbox-nav-button lightbox-nav-button-left"
              aria-label="Previous certificate"
              type="button"
            >
              <svg
                className="w-8 h-8"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>
          )}

          {selectedIndex < certificates.length - 1 && (
            <button
              onClick={handleNext}
              className="lightbox-nav-button lightbox-nav-button-right"
              aria-label="Next certificate"
              type="button"
            >
              <svg
                className="w-8 h-8"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>
          )}
        </div>

        {/* Description */}
        {selectedCertificate.description && (
          <div className="lightbox-description">
            <p id="certificate-description">{selectedCertificate.description}</p>
          </div>
        )}
      </div>
    </div>
  );
}
