"use client";

import { useEffect, useCallback, useRef, useState } from "react";
import Image from "next/image";
import { generateImageAlt } from "@/lib/image";
import { useFocusTrap } from "../../hooks/useFocusTrap";

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

const ZOOM_LEVELS = [1, 1.5, 2, 2.5, 3];

export function CertificateLightbox({
  certificates,
  selectedIndex,
  isOpen,
  onClose,
  onNavigate,
}: CertificateLightboxProps) {
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const imageContainerRef = useRef<HTMLDivElement>(null);
  const selectedCertificate = certificates[selectedIndex];
  const [zoomLevel, setZoomLevel] = useState(0);
  const [panPosition, setPanPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  const isZoomed = zoomLevel > 0;
  const currentZoom = ZOOM_LEVELS[zoomLevel];

  // Focus trap handles: trigger capture, focus-on-open, Tab trapping, focus-return-on-close.
  // Escape is NOT handled by the hook — the component's handleKeyDown has zoom-aware Escape logic.
  const { containerRef: lightboxRef } = useFocusTrap({
    isOpen,
    initialFocusRef: closeButtonRef,
  });

  // Reset zoom when changing certificates or closing
  useEffect(() => {
    setZoomLevel(0);
    setPanPosition({ x: 0, y: 0 });
  }, [selectedIndex, isOpen]);

  // Zoom handlers
  const handleZoomIn = useCallback(() => {
    setZoomLevel((prev) => Math.min(prev + 1, ZOOM_LEVELS.length - 1));
  }, []);

  const handleZoomOut = useCallback(() => {
    setZoomLevel((prev) => {
      const newLevel = Math.max(prev - 1, 0);
      if (newLevel === 0) {
        setPanPosition({ x: 0, y: 0 });
      }
      return newLevel;
    });
  }, []);

  const handleResetZoom = useCallback(() => {
    setZoomLevel(0);
    setPanPosition({ x: 0, y: 0 });
  }, []);

  // Pan handlers for dragging zoomed image
  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      if (!isZoomed) return;
      e.preventDefault();
      setIsDragging(true);
      setDragStart({ x: e.clientX - panPosition.x, y: e.clientY - panPosition.y });
    },
    [isZoomed, panPosition]
  );

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (!isDragging || !isZoomed) return;
      setPanPosition({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y,
      });
    },
    [isDragging, isZoomed, dragStart]
  );

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  // Handle keyboard navigation
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (!isOpen) return;

      switch (e.key) {
        case "Escape":
          e.preventDefault();
          if (isZoomed) {
            handleResetZoom();
          } else {
            onClose();
          }
          break;
        case "ArrowLeft":
          e.preventDefault();
          if (!isZoomed && selectedIndex > 0) {
            onNavigate(selectedIndex - 1);
          }
          break;
        case "ArrowRight":
          e.preventDefault();
          if (!isZoomed && selectedIndex < certificates.length - 1) {
            onNavigate(selectedIndex + 1);
          }
          break;
        case "+":
        case "=":
          e.preventDefault();
          handleZoomIn();
          break;
        case "-":
          e.preventDefault();
          handleZoomOut();
          break;
        case "0":
          e.preventDefault();
          handleResetZoom();
          break;
        default:
          break;
      }
    },
    [
      isOpen,
      isZoomed,
      selectedIndex,
      certificates.length,
      onClose,
      onNavigate,
      handleZoomIn,
      handleZoomOut,
      handleResetZoom,
    ]
  );

  // Set up keyboard event listeners (arrow keys, zoom keys, Escape)
  useEffect(() => {
    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown);
    }

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, handleKeyDown]);

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
      ref={lightboxRef}
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
              {isZoomed && ` • ${Math.round(currentZoom * 100)}%`}
            </p>
          </div>

          {/* Zoom Controls */}
          <div className="flex items-center gap-2 mr-4">
            <button
              onClick={handleResetZoom}
              className={`lightbox-zoom-button ${!isZoomed ? "invisible" : ""}`}
              aria-label="Reset zoom"
              type="button"
              tabIndex={isZoomed ? 0 : -1}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4"
                />
              </svg>
            </button>
            <button
              onClick={handleZoomOut}
              className="lightbox-zoom-button"
              aria-label="Zoom out"
              type="button"
              disabled={zoomLevel === 0}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
              </svg>
            </button>
            <button
              onClick={handleZoomIn}
              className="lightbox-zoom-button"
              aria-label="Zoom in"
              type="button"
              disabled={zoomLevel === ZOOM_LEVELS.length - 1}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4v16m8-8H4"
                />
              </svg>
            </button>
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
        <div
          ref={imageContainerRef}
          className={`lightbox-image-container ${isZoomed ? "cursor-grab" : ""} ${isDragging ? "cursor-grabbing" : ""}`}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
        >
          <div
            className="lightbox-image-wrapper"
            style={{
              transform: `scale(${currentZoom}) translate(${panPosition.x / currentZoom}px, ${panPosition.y / currentZoom}px)`,
              transition: isDragging ? "none" : "transform 0.2s ease-out",
            }}
          >
            <Image
              src={selectedCertificate.fullImage}
              alt={generateImageAlt(`${selectedCertificate.name} certificate`)}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1200px"
              className="lightbox-image"
              priority
              draggable={false}
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
