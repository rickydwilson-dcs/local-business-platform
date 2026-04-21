"use client";

import { useState, useRef, useEffect, useId } from "react";
import Link from "next/link";
import { buildAlphaColumns } from "../../lib/nav-grouping";
import type { HeaderDropdownItem, HeaderDropdownGroup } from "../../lib/nav-grouping";
import { useFocusTrap } from "../../hooks/useFocusTrap";

export interface HeaderDropdownConfig {
  mode?: "mega" | "list";
  items?: HeaderDropdownItem[];
  groups?: HeaderDropdownGroup[];
  columns?: number;
  title?: string;
  subtitle?: string;
  footerLink?: HeaderDropdownItem;
  footerCta?: HeaderDropdownItem;
}

export interface HeaderNavDropdownProps {
  config: HeaderDropdownConfig;
  label: string;
  variant?: "dark" | "light";
}

export function HeaderNavDropdown({ config, label, variant = "light" }: HeaderNavDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const id = useId();
  const menuId = `header-nav-dropdown-${id.replace(/:/g, "")}`;

  const isDark = variant === "dark";
  const mode = config.mode ?? "mega";
  const columns = config.columns ?? 4;

  const { containerRef } = useFocusTrap({
    isOpen,
    onEscape: () => {
      setIsOpen(false);
      buttonRef.current?.focus();
    },
  });

  // Click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen, containerRef]);

  // Arrow key navigation within the menu
  useEffect(() => {
    if (!isOpen) return;
    const menu = document.getElementById(menuId);
    if (!menu) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      const items = Array.from(menu.querySelectorAll<HTMLElement>('[role="menuitem"]'));
      const currentIndex = items.indexOf(document.activeElement as HTMLElement);
      switch (e.key) {
        case "ArrowDown":
          e.preventDefault();
          items[(currentIndex + 1) % items.length]?.focus();
          break;
        case "ArrowUp":
          e.preventDefault();
          items[(currentIndex - 1 + items.length) % items.length]?.focus();
          break;
        case "Home":
          e.preventDefault();
          items[0]?.focus();
          break;
        case "End":
          e.preventDefault();
          items[items.length - 1]?.focus();
          break;
      }
    };

    menu.addEventListener("keydown", handleKeyDown);
    return () => menu.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, menuId]);

  // Resolve groups for mega mode
  const resolvedGroups: HeaderDropdownGroup[] = (() => {
    if (config.groups && config.groups.length > 0) return config.groups;
    if (config.items && config.items.length > 0 && mode === "mega") {
      return buildAlphaColumns(config.items, columns);
    }
    return [];
  })();

  // Resolve flat items for list mode
  const flatItems: HeaderDropdownItem[] = config.items ?? [];

  const buttonTextColor = isDark
    ? "text-white"
    : "text-[var(--color-surface-secondary-foreground)]";

  const containerBg = isDark
    ? "bg-surface-inverse border-white/10"
    : "bg-surface-card border-surface-subtle";

  const borderColor = isDark ? "border-white/10" : "border-surface-subtle";

  const titleColor = isDark ? "text-white" : "text-surface-foreground";
  const subtitleColor = isDark ? "text-white/60" : "text-surface-foreground";
  const itemColor = isDark ? "text-white/80" : "text-surface-foreground";

  const listGridCols = (() => {
    const count = flatItems.length;
    if (count > 16) return "grid-cols-4";
    if (count > 8) return "grid-cols-3";
    if (count > 4) return "grid-cols-2";
    return "grid-cols-1";
  })();

  return (
    <div ref={containerRef} className="relative">
      <button
        ref={buttonRef}
        onClick={() => setIsOpen(!isOpen)}
        className={`text-xs flex items-center gap-1 ${buttonTextColor} hover:text-brand-primary transition-colors font-medium`}
        aria-expanded={isOpen}
        aria-haspopup="true"
        aria-controls={menuId}
      >
        {label}
        <svg
          aria-hidden
          className={`w-4 h-4 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div
          id={menuId}
          role="menu"
          className={`absolute top-full left-1/2 -translate-x-1/2 mt-2 rounded-lg shadow-xl z-50 border ${containerBg} ${
            mode === "list" ? "max-w-[min(720px,calc(100vw-2rem))]" : "w-[640px] max-w-[95vw]"
          }`}
        >
          <div className="p-5">
            {/* Header strip */}
            {(config.title || config.subtitle) && (
              <div className={`mb-4 pb-3 border-b ${borderColor}`}>
                {config.title && (
                  <h3 className={`text-lg font-semibold mb-1 ${titleColor}`}>{config.title}</h3>
                )}
                {config.subtitle && <p className={`text-sm ${subtitleColor}`}>{config.subtitle}</p>}
              </div>
            )}

            {/* Content grid */}
            {mode === "mega" && resolvedGroups.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {resolvedGroups.map((group) => (
                  <div key={group.label} className="space-y-3">
                    <span
                      className={`block text-base font-semibold text-brand-primary pb-2 border-b ${borderColor}`}
                    >
                      {group.label}
                    </span>
                    <ul className="space-y-2">
                      {group.items.map((item) => (
                        <li key={item.href}>
                          <Link
                            href={item.href}
                            role="menuitem"
                            onClick={() => setIsOpen(false)}
                            className={`flex items-center gap-2 text-sm transition-colors hover:text-brand-primary ${itemColor}`}
                          >
                            {item.label}
                            <span className="inline-block w-2 h-2 bg-brand-primary rounded-full flex-shrink-0" />
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            ) : (
              <div className={`grid ${listGridCols} gap-1`}>
                {flatItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    role="menuitem"
                    onClick={() => setIsOpen(false)}
                    className={`px-3 py-2 rounded-md text-sm whitespace-nowrap hover:bg-brand-primary/10 hover:text-brand-primary transition-colors ${itemColor}`}
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            )}

            {/* Footer strip */}
            {(config.footerLink || config.footerCta) && (
              <div className={`mt-4 pt-4 border-t ${borderColor}`}>
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 md:gap-0">
                  {config.footerLink && (
                    <Link
                      href={config.footerLink.href}
                      role="menuitem"
                      onClick={() => setIsOpen(false)}
                      className="text-sm text-brand-primary hover:text-brand-primary-hover font-medium"
                    >
                      {config.footerLink.label}
                    </Link>
                  )}
                  {config.footerCta && (
                    <Link
                      href={config.footerCta.href}
                      role="menuitem"
                      onClick={() => setIsOpen(false)}
                      className="inline-flex items-center gap-2 text-sm font-medium text-brand-primary hover:text-brand-primary-hover"
                    >
                      {config.footerCta.label}
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M17 8l4 4m0 0l-4 4m4-4H3"
                        />
                      </svg>
                    </Link>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
