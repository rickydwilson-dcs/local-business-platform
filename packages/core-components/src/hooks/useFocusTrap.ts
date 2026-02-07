"use client";

import { useEffect, useRef, useCallback } from "react";

const FOCUSABLE_SELECTOR = [
  "a[href]",
  "button:not([disabled])",
  "textarea:not([disabled])",
  "input:not([disabled]):not([type='hidden'])",
  "select:not([disabled])",
  "[tabindex]:not([tabindex='-1'])",
].join(", ");

interface UseFocusTrapOptions {
  /** Whether the focus trap is currently active */
  isOpen: boolean;
  /** Called when Escape is pressed. If omitted, Escape is not handled. */
  onEscape?: () => void;
  /** Element to focus when the trap activates. Falls back to first focusable element. */
  initialFocusRef?: React.RefObject<HTMLElement | null>;
  /** Whether to restore focus to the trigger element on close. Default: true */
  restoreFocus?: boolean;
}

interface UseFocusTrapReturn {
  /** Attach this ref to the container element that bounds the focus trap */
  containerRef: React.RefObject<HTMLDivElement | null>;
}

export function useFocusTrap({
  isOpen,
  onEscape,
  initialFocusRef,
  restoreFocus = true,
}: UseFocusTrapOptions): UseFocusTrapReturn {
  const containerRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLElement | null>(null);

  // Store the trigger element when the trap opens
  useEffect(() => {
    if (isOpen) {
      triggerRef.current = document.activeElement as HTMLElement;
    }
  }, [isOpen]);

  // Move focus into the trap when it opens
  useEffect(() => {
    if (!isOpen) return;

    const timer = setTimeout(() => {
      if (initialFocusRef?.current) {
        initialFocusRef.current.focus();
      } else if (containerRef.current) {
        const first = containerRef.current.querySelector<HTMLElement>(FOCUSABLE_SELECTOR);
        first?.focus();
      }
    }, 100);

    return () => clearTimeout(timer);
  }, [isOpen, initialFocusRef]);

  // Restore focus when the trap closes
  useEffect(() => {
    if (!isOpen && restoreFocus && triggerRef.current) {
      triggerRef.current.focus();
      triggerRef.current = null;
    }
  }, [isOpen, restoreFocus]);

  // Handle Tab trapping and Escape
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (!isOpen || !containerRef.current) return;

      if (e.key === "Escape" && onEscape) {
        e.preventDefault();
        onEscape();
        return;
      }

      if (e.key !== "Tab") return;

      const focusableElements = Array.from(
        containerRef.current.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR)
      );

      if (focusableElements.length === 0) return;

      const first = focusableElements[0];
      const last = focusableElements[focusableElements.length - 1];

      if (e.shiftKey) {
        if (document.activeElement === first) {
          e.preventDefault();
          last.focus();
        }
      } else {
        if (document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    },
    [isOpen, onEscape]
  );

  useEffect(() => {
    if (!isOpen) return;

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, handleKeyDown]);

  return { containerRef };
}
