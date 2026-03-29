"use client";

/**
 * ReviewPanel
 *
 * Collapsible navigation panel for test sites.
 * Shows all generated routes with active-page highlighting.
 * Intentionally uses hardcoded colors (not theme tokens) to be
 * visually distinct from the theme under review.
 */

import { useState } from "react";

const ROUTES: Array<{ route: string; label: string }> = [
  { route: '/', label: 'Home' },
  { route: '/about', label: 'About' },
  { route: '/services', label: 'Services' },
  { route: '/contact', label: 'Contact' },
];

export function ReviewPanel() {
  const [open, setOpen] = useState(false);
  const currentPath = typeof window !== "undefined" ? window.location.pathname : "";

  return (
    <div
      style={{
        position: "fixed",
        bottom: "1rem",
        right: "1rem",
        zIndex: 9999,
        fontFamily: "system-ui, sans-serif",
        fontSize: "13px",
      }}
    >
      {open ? (
        <div
          style={{
            background: "#1F2937",
            color: "#F9FAFB",
            borderRadius: "8px",
            padding: "12px",
            minWidth: "200px",
            boxShadow: "0 4px 20px rgba(0,0,0,0.4)",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "8px",
            }}
          >
            <span style={{ fontWeight: 600, color: "#9CA3AF", fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.05em" }}>
              Review Panel
            </span>
            <button
              onClick={() => setOpen(false)}
              style={{ background: "none", border: "none", color: "#9CA3AF", cursor: "pointer", padding: "0 2px", fontSize: "16px", lineHeight: 1 }}
            >
              ×
            </button>
          </div>
          <nav>
            {ROUTES.map((r) => (
              <a
                key={r.route}
                href={r.route}
                style={{
                  display: "block",
                  padding: "4px 8px",
                  borderRadius: "4px",
                  color: currentPath === r.route ? "#FFFFFF" : "#D1D5DB",
                  background: currentPath === r.route ? "#374151" : "transparent",
                  textDecoration: "none",
                  marginBottom: "2px",
                }}
              >
                {r.label}
              </a>
            ))}
          </nav>
        </div>
      ) : (
        <button
          onClick={() => setOpen(true)}
          style={{
            background: "#1F2937",
            color: "#F9FAFB",
            border: "none",
            borderRadius: "8px",
            padding: "8px 12px",
            cursor: "pointer",
            boxShadow: "0 4px 20px rgba(0,0,0,0.4)",
            fontFamily: "system-ui, sans-serif",
            fontSize: "13px",
          }}
        >
          Pages ▲
        </button>
      )}
    </div>
  );
}
