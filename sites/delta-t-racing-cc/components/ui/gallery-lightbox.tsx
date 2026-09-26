'use client';

import { useEffect, useRef } from 'react';
import Image from 'next/image';
import { useFocusTrap } from '@platform/core-components/hooks/useFocusTrap';
import type { GalleryItem } from './photo-gallery';

interface GalleryLightboxProps {
  items: GalleryItem[];
  selectedIndex: number;
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (index: number) => void;
}

export function GalleryLightbox({
  items,
  selectedIndex,
  isOpen,
  onClose,
  onNavigate,
}: GalleryLightboxProps) {
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const selectedItem = items[selectedIndex];

  const { containerRef: lightboxRef } = useFocusTrap({
    isOpen,
    onEscape: onClose,
    initialFocusRef: closeButtonRef,
  });

  const handlePrevious = () => {
    if (selectedIndex > 0) onNavigate(selectedIndex - 1);
  };

  const handleNext = () => {
    if (selectedIndex < items.length - 1) onNavigate(selectedIndex + 1);
  };

  // Arrow-key navigation — Escape and Tab trapping are handled by useFocusTrap.
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft' && selectedIndex > 0) {
        e.preventDefault();
        onNavigate(selectedIndex - 1);
      } else if (e.key === 'ArrowRight' && selectedIndex < items.length - 1) {
        e.preventDefault();
        onNavigate(selectedIndex + 1);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, selectedIndex, items.length, onNavigate]);

  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) onClose();
  };

  if (!isOpen || !selectedItem) return null;

  return (
    <div
      ref={lightboxRef}
      className="lightbox-overlay"
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-label={selectedItem.type === 'video' ? selectedItem.ariaLabel : selectedItem.alt}
    >
      <div className="lightbox-content">
        <div className="lightbox-header">
          <p className="lightbox-position" aria-live="polite" aria-atomic="true">
            {selectedIndex + 1} of {items.length}
          </p>

          <button
            ref={closeButtonRef}
            onClick={onClose}
            className="lightbox-close-button"
            aria-label="Close gallery"
            type="button"
          >
            <svg
              aria-hidden="true"
              className="h-6 w-6"
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

        <div className="lightbox-image-container">
          <div className="lightbox-image-wrapper">
            {selectedItem.type === 'image' ? (
              <Image
                src={selectedItem.src}
                alt={selectedItem.alt}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1200px"
                className="lightbox-image"
                priority
              />
            ) : (
              <video
                src={selectedItem.src}
                poster={selectedItem.poster}
                aria-label={selectedItem.ariaLabel}
                className="h-full w-full object-contain"
                controls
                playsInline
              />
            )}
          </div>

          {selectedIndex > 0 && (
            <button
              onClick={handlePrevious}
              className="lightbox-nav-button lightbox-nav-button-left"
              aria-label="Previous item"
              type="button"
            >
              <svg
                aria-hidden="true"
                className="h-8 w-8"
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

          {selectedIndex < items.length - 1 && (
            <button
              onClick={handleNext}
              className="lightbox-nav-button lightbox-nav-button-right"
              aria-label="Next item"
              type="button"
            >
              <svg
                aria-hidden="true"
                className="h-8 w-8"
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
      </div>
    </div>
  );
}
