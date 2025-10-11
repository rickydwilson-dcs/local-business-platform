/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, waitFor } from "@testing-library/react";
import { Analytics, useAnalytics } from "../Analytics";
import * as ConsentManager from "../ConsentManager";

// Mock the ConsentManager
vi.mock("../ConsentManager", () => ({
  useConsent: vi.fn(),
}));

// Mock Next.js Script component
vi.mock("next/script", () => ({
  default: ({ id, children, dangerouslySetInnerHTML, onLoad }: any) => {
    // Simulate script loading
    if (onLoad && typeof onLoad === "function") {
      setTimeout(() => onLoad(), 0);
    }

    return (
      <script
        id={id}
        data-testid={id || "mock-script"}
        dangerouslySetInnerHTML={dangerouslySetInnerHTML}
      >
        {children}
      </script>
    );
  },
}));

describe("Analytics Component", () => {
  beforeEach(() => {
    // Reset window.gtag and window.dataLayer before each test
    delete (window as any).gtag;
    delete (window as any).dataLayer;
    delete (window as any).fbq;

    // Set default environment variables
    process.env.NEXT_PUBLIC_FEATURE_ANALYTICS_ENABLED = "true";
    process.env.NEXT_PUBLIC_FEATURE_GA4_ENABLED = "true";
    process.env.NEXT_PUBLIC_FEATURE_FACEBOOK_PIXEL = "false";
    process.env.NEXT_PUBLIC_FEATURE_GOOGLE_ADS = "false";
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe("DataLayer Initialization", () => {
    it("should render GA4 init script with dataLayer initialization", async () => {
      vi.mocked(ConsentManager.useConsent).mockReturnValue({
        consent: {
          functional: true,
          analytics: true,
          marketing: false,
          timestamp: Date.now(),
          version: "1.0",
        },
        loading: false,
      });

      const { container } = render(<Analytics gaId="G-TEST123" />);

      await waitFor(() => {
        const ga4InitScript = container.querySelector("#ga4-init");
        expect(ga4InitScript).toBeTruthy();

        const scriptContent = ga4InitScript?.innerHTML || "";
        expect(scriptContent).toContain("window.dataLayer = window.dataLayer || []");
        expect(scriptContent).toContain("function gtag(){dataLayer.push(arguments);}");
      });
    });

    it("should not reinitialize existing dataLayer", async () => {
      // Pre-populate dataLayer
      (window as any).dataLayer = [{ event: "existing_event" }];

      vi.mocked(ConsentManager.useConsent).mockReturnValue({
        consent: {
          functional: true,
          analytics: true,
          marketing: false,
          timestamp: Date.now(),
          version: "1.0",
        },
        loading: false,
      });

      render(<Analytics gaId="G-TEST123" />);

      await waitFor(() => {
        expect(window.dataLayer).toBeDefined();
        expect((window.dataLayer as any)[0].event).toBe("existing_event");
      });
    });
  });

  describe("Consent-based Script Loading", () => {
    it("should not load GA4 scripts without analytics consent", () => {
      vi.mocked(ConsentManager.useConsent).mockReturnValue({
        consent: {
          functional: true,
          analytics: false,
          marketing: false,
          timestamp: Date.now(),
          version: "1.0",
        },
        loading: false,
      });

      const { container } = render(<Analytics gaId="G-TEST123" />);

      const ga4Script = container.querySelector('script[src*="googletagmanager.com/gtag"]');
      expect(ga4Script).toBeNull();
    });

    it("should load GA4 scripts with analytics consent", () => {
      vi.mocked(ConsentManager.useConsent).mockReturnValue({
        consent: {
          functional: true,
          analytics: true,
          marketing: false,
          timestamp: Date.now(),
          version: "1.0",
        },
        loading: false,
      });

      const { container } = render(<Analytics gaId="G-TEST123" />);

      const ga4InitScript = container.querySelector("#ga4-init");
      expect(ga4InitScript).toBeTruthy();
    });

    it("should not load Facebook Pixel without marketing consent", () => {
      process.env.NEXT_PUBLIC_FEATURE_FACEBOOK_PIXEL = "true";

      vi.mocked(ConsentManager.useConsent).mockReturnValue({
        consent: {
          functional: true,
          analytics: true,
          marketing: false,
          timestamp: Date.now(),
          version: "1.0",
        },
        loading: false,
      });

      const { container } = render(<Analytics facebookPixelId="123456789" />);

      const facebookScript = container.querySelector("#facebook-pixel");
      expect(facebookScript).toBeNull();
    });

    it("should not render any scripts without consent", () => {
      vi.mocked(ConsentManager.useConsent).mockReturnValue({
        consent: null,
        loading: false,
      });

      const { container } = render(<Analytics gaId="G-TEST123" facebookPixelId="123456789" />);

      expect(container.innerHTML).toBe("");
    });
  });

  describe("GA4 Configuration", () => {
    it("should set correct consent defaults in GA4 init script", () => {
      vi.mocked(ConsentManager.useConsent).mockReturnValue({
        consent: {
          functional: true,
          analytics: true,
          marketing: false,
          timestamp: Date.now(),
          version: "1.0",
        },
        loading: false,
      });

      const { container } = render(<Analytics gaId="G-TEST123" />);

      const ga4InitScript = container.querySelector("#ga4-init");
      expect(ga4InitScript).toBeTruthy();

      const scriptContent = ga4InitScript?.innerHTML || "";
      expect(scriptContent).toContain("analytics_storage");
      expect(scriptContent).toContain("granted");
      expect(scriptContent).toContain("ad_storage");
      expect(scriptContent).toContain("denied");
    });

    it("should grant ad_storage with marketing consent", () => {
      vi.mocked(ConsentManager.useConsent).mockReturnValue({
        consent: {
          functional: true,
          analytics: true,
          marketing: true,
          timestamp: Date.now(),
          version: "1.0",
        },
        loading: false,
      });

      const { container } = render(<Analytics gaId="G-TEST123" />);

      const ga4InitScript = container.querySelector("#ga4-init");
      const scriptContent = ga4InitScript?.innerHTML || "";

      // Count occurrences of 'granted'
      const grantedCount = (scriptContent.match(/granted/g) || []).length;
      expect(grantedCount).toBeGreaterThanOrEqual(2); // analytics_storage and ad_storage both granted
    });
  });

  describe("Feature Flags", () => {
    it("should not render when analytics feature is disabled", () => {
      process.env.NEXT_PUBLIC_FEATURE_ANALYTICS_ENABLED = "false";

      vi.mocked(ConsentManager.useConsent).mockReturnValue({
        consent: {
          functional: true,
          analytics: true,
          marketing: true,
          timestamp: Date.now(),
          version: "1.0",
        },
        loading: false,
      });

      const { container } = render(<Analytics gaId="G-TEST123" />);

      expect(container.innerHTML).toBe("");
    });

    it("should not load GA4 when GA4 feature flag is disabled", () => {
      process.env.NEXT_PUBLIC_FEATURE_GA4_ENABLED = "false";

      vi.mocked(ConsentManager.useConsent).mockReturnValue({
        consent: {
          functional: true,
          analytics: true,
          marketing: true,
          timestamp: Date.now(),
          version: "1.0",
        },
        loading: false,
      });

      const { container } = render(<Analytics gaId="G-TEST123" />);

      const ga4InitScript = container.querySelector("#ga4-init");
      expect(ga4InitScript).toBeNull();
    });
  });

  describe("Debug Mode", () => {
    it("should accept debugMode prop", () => {
      vi.mocked(ConsentManager.useConsent).mockReturnValue({
        consent: {
          functional: true,
          analytics: true,
          marketing: false,
          timestamp: Date.now(),
          version: "1.0",
        },
        loading: false,
      });

      // Just verify the component accepts the debugMode prop without errors
      expect(() => render(<Analytics gaId="G-TEST123" debugMode={true} />)).not.toThrow();
      expect(() => render(<Analytics gaId="G-TEST123" debugMode={false} />)).not.toThrow();
    });
  });
});

describe("useAnalytics Hook", () => {
  beforeEach(() => {
    delete (window as any).trackAnalyticsEvent;

    vi.mocked(ConsentManager.useConsent).mockReturnValue({
      consent: {
        functional: true,
        analytics: true,
        marketing: false,
        timestamp: Date.now(),
        version: "1.0",
      },
      loading: false,
    });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe("Consent State", () => {
    it("should return consent state", () => {
      const TestComponent = () => {
        const { hasConsent, consentState } = useAnalytics();
        return (
          <div>
            <span data-testid="has-consent">{hasConsent ? "true" : "false"}</span>
            <span data-testid="analytics-consent">
              {consentState?.analytics ? "true" : "false"}
            </span>
          </div>
        );
      };

      const { getByTestId } = render(<TestComponent />);

      expect(getByTestId("has-consent").textContent).toBe("true");
      expect(getByTestId("analytics-consent").textContent).toBe("true");
    });

    it("should return false for hasConsent when consent is null", () => {
      vi.mocked(ConsentManager.useConsent).mockReturnValue({
        consent: null,
        loading: false,
      });

      const TestComponent = () => {
        const { hasConsent } = useAnalytics();
        return <div data-testid="has-consent">{hasConsent ? "true" : "false"}</div>;
      };

      const { getByTestId } = render(<TestComponent />);

      expect(getByTestId("has-consent").textContent).toBe("false");
    });
  });

  describe("Event Tracking", () => {
    it("should provide trackEvent function", () => {
      const TestComponent = () => {
        const { trackEvent } = useAnalytics();
        return <button onClick={() => trackEvent({ name: "test_event" })}>Track Event</button>;
      };

      const { getByText } = render(<TestComponent />);
      const button = getByText("Track Event");

      expect(button).toBeTruthy();
      expect(() => button.click()).not.toThrow();
    });

    it("should provide trackPageView function", () => {
      const TestComponent = () => {
        const { trackPageView } = useAnalytics();
        return <button onClick={() => trackPageView("Test Page", "/test")}>Track Page View</button>;
      };

      const { getByText } = render(<TestComponent />);
      const button = getByText("Track Page View");

      expect(button).toBeTruthy();
      expect(() => button.click()).not.toThrow();
    });

    it("should provide trackConversion function", () => {
      const TestComponent = () => {
        const { trackConversion } = useAnalytics();
        return (
          <button onClick={() => trackConversion("quote_request", 100)}>Track Conversion</button>
        );
      };

      const { getByText } = render(<TestComponent />);
      const button = getByText("Track Conversion");

      expect(button).toBeTruthy();
      expect(() => button.click()).not.toThrow();
    });
  });
});
