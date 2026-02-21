import { describe, test, expect, vi, beforeEach, afterEach } from "vitest";
import React from "react";
import { render, act } from "@testing-library/react";
import { RevealOnScroll } from "../reveal-on-scroll";

// ---------------------------------------------------------------------------
// IntersectionObserver mock
// ---------------------------------------------------------------------------

type IntersectionCallback = (entries: Partial<IntersectionObserverEntry>[]) => void;

let observerCallback: IntersectionCallback;
let observerInstance: {
  observe: ReturnType<typeof vi.fn>;
  unobserve: ReturnType<typeof vi.fn>;
  disconnect: ReturnType<typeof vi.fn>;
};

beforeEach(() => {
  observerInstance = {
    observe: vi.fn(),
    unobserve: vi.fn(),
    disconnect: vi.fn(),
  };

  vi.stubGlobal(
    "IntersectionObserver",
    vi.fn((cb: IntersectionCallback) => {
      observerCallback = cb;
      return observerInstance;
    })
  );

  // Default: no reduced motion
  vi.stubGlobal("matchMedia", vi.fn(() => ({ matches: false })));
});

afterEach(() => {
  vi.restoreAllMocks();
});

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe("RevealOnScroll", () => {
  test("renders children content", () => {
    const { getByText } = render(
      <RevealOnScroll>
        <p>Hello World</p>
      </RevealOnScroll>
    );
    expect(getByText("Hello World")).toBeDefined();
  });

  test("content is hidden after client hydration, then revealed on intersection", () => {
    const { container } = render(
      <RevealOnScroll>
        <p>Visible</p>
      </RevealOnScroll>
    );
    const wrapper = container.firstElementChild as HTMLElement;
    // After useEffect runs in jsdom, element is hidden waiting for intersection
    expect(wrapper.style.opacity).toBe("0");

    // Trigger intersection to reveal
    act(() => {
      observerCallback([{ isIntersecting: true }]);
    });

    // After intersection, animation class is applied (opacity handled by CSS)
    expect(wrapper.className).toContain("animate-");
  });

  test("applies animation class when observer fires intersection", () => {
    const { container } = render(
      <RevealOnScroll variant="fade-up">
        <p>Animate me</p>
      </RevealOnScroll>
    );

    // Trigger intersection
    act(() => {
      observerCallback([{ isIntersecting: true }]);
    });

    const wrapper = container.firstElementChild as HTMLElement;
    expect(wrapper.className).toContain("animate-fade-in-up");
  });

  test("once: true → calls unobserve after first intersection", () => {
    render(
      <RevealOnScroll once={true}>
        <p>Once</p>
      </RevealOnScroll>
    );

    act(() => {
      observerCallback([{ isIntersecting: true }]);
    });

    expect(observerInstance.unobserve).toHaveBeenCalled();
  });

  test("once: false → does not call unobserve", () => {
    render(
      <RevealOnScroll once={false}>
        <p>Repeat</p>
      </RevealOnScroll>
    );

    act(() => {
      observerCallback([{ isIntersecting: true }]);
    });

    expect(observerInstance.unobserve).not.toHaveBeenCalled();
  });

  test("respects custom delay (check for animation-delay in style)", () => {
    const { container } = render(
      <RevealOnScroll delay={200}>
        <p>Delayed</p>
      </RevealOnScroll>
    );

    const wrapper = container.firstElementChild as HTMLElement;
    expect(wrapper.style.animationDelay).toBe("200ms");
  });

  test("prefers-reduced-motion: reduce → content stays visible, no animation class", () => {
    vi.stubGlobal("matchMedia", vi.fn(() => ({ matches: true })));

    const { container } = render(
      <RevealOnScroll variant="fade-up">
        <p>No motion</p>
      </RevealOnScroll>
    );

    const wrapper = container.firstElementChild as HTMLElement;
    // Should NOT have animation class or hidden styles
    expect(wrapper.className || "").not.toContain("animate-");
    expect(wrapper.style.opacity).not.toBe("0");
  });
});
