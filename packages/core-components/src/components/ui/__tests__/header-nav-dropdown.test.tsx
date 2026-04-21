/**
 * Smoke tests for HeaderNavDropdown — verifies that any category (not just
 * locations) can use the generic mega-menu by setting dropdown config on a
 * nav item. No SiteHeader changes are needed per category.
 */
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { HeaderNavDropdown } from "../header-nav-dropdown";
import type { HeaderDropdownConfig } from "../header-nav-dropdown";

// Mock next/link — renders a plain <a> tag in jsdom
vi.mock("next/link", () => ({
  default: ({
    href,
    children,
    ...rest
  }: {
    href: string;
    children: React.ReactNode;
    [key: string]: unknown;
  }) => React.createElement("a", { href, ...rest }, children),
}));

const SERVICES_DROPDOWN: HeaderDropdownConfig = {
  mode: "mega",
  items: [
    { label: "Electrical Testing", href: "/services/electrical-testing" },
    { label: "Fuse Board Upgrades", href: "/services/fuse-board-upgrades" },
    { label: "EV Charger Installation", href: "/services/ev-charger" },
    { label: "Consumer Unit Replacement", href: "/services/consumer-unit" },
    { label: "Emergency Callout", href: "/services/emergency" },
    { label: "EICR Certificates", href: "/services/eicr" },
    { label: "LED Lighting", href: "/services/led-lighting" },
    { label: "Smart Home Wiring", href: "/services/smart-home" },
    { label: "Solar Panel Wiring", href: "/services/solar" },
    { label: "Security Lighting", href: "/services/security-lighting" },
    { label: "Access Control", href: "/services/access-control" },
    { label: "Garden Lighting", href: "/services/garden-lighting" },
  ],
  title: "Our Services",
};

beforeEach(() => {
  vi.useFakeTimers();
});

afterEach(() => {
  vi.useRealTimers();
  vi.restoreAllMocks();
});

describe("HeaderNavDropdown — Services mega-menu", () => {
  it("renders trigger button with aria-expanded=false initially", () => {
    render(<HeaderNavDropdown config={SERVICES_DROPDOWN} label="Services" />);
    const trigger = screen.getByRole("button", { name: /services/i });
    expect(trigger).toBeTruthy();
    expect(trigger.getAttribute("aria-expanded")).toBe("false");
    expect(trigger.getAttribute("aria-haspopup")).toBe("true");
  });

  it("opens the dropdown and shows service labels on click", () => {
    render(<HeaderNavDropdown config={SERVICES_DROPDOWN} label="Services" />);
    const trigger = screen.getByRole("button", { name: /services/i });
    fireEvent.click(trigger);

    expect(trigger.getAttribute("aria-expanded")).toBe("true");

    // All service labels must be visible
    for (const item of SERVICES_DROPDOWN.items!) {
      expect(screen.getByText(item.label)).toBeTruthy();
    }
  });

  it("shows the dropdown title", () => {
    render(<HeaderNavDropdown config={SERVICES_DROPDOWN} label="Services" />);
    fireEvent.click(screen.getByRole("button", { name: /services/i }));
    expect(screen.getByText("Our Services")).toBeTruthy();
  });

  it("works without locations or counties props — no SiteHeader wiring needed", () => {
    // Renders successfully without any location data
    const minimalConfig: HeaderDropdownConfig = {
      mode: "mega",
      items: [{ label: "Some Service", href: "/services/some" }],
    };
    render(<HeaderNavDropdown config={minimalConfig} label="Services" />);
    fireEvent.click(screen.getByRole("button", { name: /services/i }));
    expect(screen.getByText("Some Service")).toBeTruthy();
  });

  it("closes on second click", () => {
    render(<HeaderNavDropdown config={SERVICES_DROPDOWN} label="Services" />);
    const trigger = screen.getByRole("button", { name: /services/i });
    fireEvent.click(trigger);
    expect(trigger.getAttribute("aria-expanded")).toBe("true");
    fireEvent.click(trigger);
    expect(trigger.getAttribute("aria-expanded")).toBe("false");
  });
});
