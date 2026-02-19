/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, expect, beforeEach, vi } from "vitest";
import {
  getDataLayer,
  pushToDataLayer,
  trackPageView,
  trackConversion,
  trackFormSubmission,
  trackServiceView,
  trackLocationView,
  trackPhoneClick,
  trackEmailClick,
  updateConsentInDataLayer,
  getDataLayerEvents,
  getDataLayerEventsByType,
  clearDataLayer,
  initializeDataLayer,
} from "@platform/core-components/lib/analytics/dataLayer";

// Mock window.gtag
declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

describe("DataLayer Management", () => {
  beforeEach(() => {
    // Clear dataLayer before each test
    clearDataLayer();
    delete window.gtag;
  });

  describe("getDataLayer", () => {
    it("should initialize empty dataLayer if not exists", () => {
      delete (window as any).dataLayer;

      const dataLayer = getDataLayer();

      expect(dataLayer).toBeDefined();
      expect(Array.isArray(dataLayer)).toBe(true);
      expect(dataLayer.length).toBe(0);
    });

    it("should return existing dataLayer", () => {
      (window as any).dataLayer = [{ event: "existing_event" }];

      const dataLayer = getDataLayer();

      expect(dataLayer.length).toBe(1);
      expect(dataLayer[0].event).toBe("existing_event");
    });
  });

  describe("pushToDataLayer", () => {
    it("should push event to dataLayer", () => {
      pushToDataLayer({ event: "test_event", data: "test" });

      const dataLayer = getDataLayer();
      expect(dataLayer.length).toBe(1);
      expect(dataLayer[0].event).toBe("test_event");
      expect(dataLayer[0].data).toBe("test");
    });

    it("should push multiple events in order", () => {
      pushToDataLayer({ event: "event1" });
      pushToDataLayer({ event: "event2" });
      pushToDataLayer({ event: "event3" });

      const dataLayer = getDataLayer();
      expect(dataLayer.length).toBe(3);
      expect(dataLayer[0].event).toBe("event1");
      expect(dataLayer[1].event).toBe("event2");
      expect(dataLayer[2].event).toBe("event3");
    });
  });

  describe("trackPageView", () => {
    it("should track page view with required data", () => {
      trackPageView({
        page_title: "Test Page",
        page_location: "https://example.com/test",
        page_path: "/test",
      });

      const events = getDataLayerEventsByType("page_view");
      expect(events.length).toBe(1);
      expect(events[0].page).toBeDefined();
      expect((events[0].page as any).title).toBe("Test Page");
      expect((events[0].page as any).location).toBe("https://example.com/test");
      expect((events[0].page as any).path).toBe("/test");
    });

    it("should include user data when provided", () => {
      trackPageView(
        {
          page_title: "Test Page",
          page_location: "https://example.com/test",
          page_path: "/test",
        },
        {
          user_id: "user123",
          user_type: "customer",
          consent_given: true,
          consent_types: ["analytics", "marketing"],
        }
      );

      const events = getDataLayerEventsByType("page_view");
      expect(events[0].user).toBeDefined();
      expect((events[0].user as any).id).toBe("user123");
      expect((events[0].user as any).type).toBe("customer");
      expect((events[0].user as any).consent_given).toBe(true);
    });

    it("should include timestamp", () => {
      trackPageView({
        page_title: "Test Page",
        page_location: "https://example.com/test",
        page_path: "/test",
      });

      const events = getDataLayerEventsByType("page_view");
      expect(events[0].timestamp).toBeDefined();
      expect(typeof events[0].timestamp).toBe("string");
    });
  });

  describe("trackConversion", () => {
    it("should track conversion with required data", () => {
      trackConversion({
        conversion_action: "quote_request",
        conversion_value: 100,
        conversion_currency: "GBP",
      });

      const events = getDataLayerEventsByType("conversion");
      expect(events.length).toBe(1);
      expect(events[0].conversion).toBeDefined();
      expect((events[0].conversion as any).action).toBe("quote_request");
      expect((events[0].conversion as any).value).toBe(100);
      expect((events[0].conversion as any).currency).toBe("GBP");
    });

    it("should include service and location when provided", () => {
      trackConversion({
        conversion_action: "quote_request",
        service_type: "access-scaffolding",
        location: "brighton",
      });

      const events = getDataLayerEventsByType("conversion");
      expect((events[0].conversion as any).service_type).toBe("access-scaffolding");
      expect((events[0].conversion as any).location).toBe("brighton");
    });

    it("should default currency to GBP", () => {
      trackConversion({
        conversion_action: "quote_request",
      });

      const events = getDataLayerEventsByType("conversion");
      expect((events[0].conversion as any).currency).toBe("GBP");
    });
  });

  describe("trackFormSubmission", () => {
    it("should track form submission", () => {
      trackFormSubmission("contact_form", "/contact", {
        name: "Test User",
        email: "test@example.com",
      });

      const events = getDataLayerEventsByType("form_submit");
      expect(events.length).toBe(1);
      expect(events[0].form).toBeDefined();
      expect((events[0].form as any).name).toBe("contact_form");
      expect((events[0].form as any).location).toBe("/contact");
    });

    it("should handle empty form data", () => {
      trackFormSubmission("contact_form", "/contact");

      const events = getDataLayerEventsByType("form_submit");
      expect((events[0].form as any).data).toEqual({});
    });
  });

  describe("trackServiceView", () => {
    it("should track service view", () => {
      trackServiceView("Access Scaffolding", "access-scaffolding");

      const events = getDataLayerEventsByType("service_view");
      expect(events.length).toBe(1);
      expect(events[0].service).toBeDefined();
      expect((events[0].service as any).name).toBe("Access Scaffolding");
      expect((events[0].service as any).slug).toBe("access-scaffolding");
      expect((events[0].service as any).category).toBe("services");
    });
  });

  describe("trackLocationView", () => {
    it("should track location view", () => {
      trackLocationView("Brighton", "brighton");

      const events = getDataLayerEventsByType("location_view");
      expect(events.length).toBe(1);
      expect(events[0].location).toBeDefined();
      expect((events[0].location as any).name).toBe("Brighton");
      expect((events[0].location as any).slug).toBe("brighton");
    });
  });

  describe("trackPhoneClick", () => {
    it("should track phone call click", () => {
      trackPhoneClick("+441424466661");

      const events = getDataLayerEventsByType("phone_call");
      expect(events.length).toBe(1);
      expect(events[0].phone).toBeDefined();
      expect((events[0].phone as any).number).toBe("+441424466661");
    });
  });

  describe("trackEmailClick", () => {
    it("should track email click", () => {
      trackEmailClick("info@colossusscaffolding.com");

      const events = getDataLayerEventsByType("email_contact");
      expect(events.length).toBe(1);
      expect(events[0].email).toBeDefined();
      expect((events[0].email as any).address).toBe("info@colossusscaffolding.com");
    });
  });

  describe("updateConsentInDataLayer", () => {
    it("should push consent update event", () => {
      updateConsentInDataLayer(["analytics", "marketing"]);

      const events = getDataLayerEventsByType("consent_update");
      expect(events.length).toBe(1);
      expect(events[0].consent).toBeDefined();
      expect((events[0].consent as any).types).toEqual(["analytics", "marketing"]);
    });

    it("should call gtag consent update if gtag exists", () => {
      const mockGtag = vi.fn();
      window.gtag = mockGtag;

      updateConsentInDataLayer(["analytics", "marketing"]);

      expect(mockGtag).toHaveBeenCalledWith("consent", "update", {
        analytics_storage: "granted",
        ad_storage: "granted",
        ad_user_data: "granted",
        ad_personalization: "granted",
      });
    });

    it("should deny ad storage when marketing consent not given", () => {
      const mockGtag = vi.fn();
      window.gtag = mockGtag;

      updateConsentInDataLayer(["analytics"]);

      expect(mockGtag).toHaveBeenCalledWith("consent", "update", {
        analytics_storage: "granted",
        ad_storage: "denied",
        ad_user_data: "denied",
        ad_personalization: "denied",
      });
    });

    it("should not throw if gtag does not exist", () => {
      delete window.gtag;

      expect(() => updateConsentInDataLayer(["analytics"])).not.toThrow();
    });
  });

  describe("getDataLayerEvents", () => {
    it("should return all events", () => {
      pushToDataLayer({ event: "event1" });
      pushToDataLayer({ event: "event2" });
      pushToDataLayer({ event: "event3" });

      const events = getDataLayerEvents();
      expect(events.length).toBe(3);
    });

    it("should return empty array when no events", () => {
      const events = getDataLayerEvents();
      expect(events.length).toBe(0);
    });
  });

  describe("getDataLayerEventsByType", () => {
    it("should filter events by type", () => {
      pushToDataLayer({ event: "page_view" });
      pushToDataLayer({ event: "conversion" });
      pushToDataLayer({ event: "page_view" });

      const pageViews = getDataLayerEventsByType("page_view");
      expect(pageViews.length).toBe(2);

      const conversions = getDataLayerEventsByType("conversion");
      expect(conversions.length).toBe(1);
    });

    it("should return empty array when no matching events", () => {
      pushToDataLayer({ event: "page_view" });

      const conversions = getDataLayerEventsByType("conversion");
      expect(conversions.length).toBe(0);
    });
  });

  describe("clearDataLayer", () => {
    it("should clear all events", () => {
      pushToDataLayer({ event: "event1" });
      pushToDataLayer({ event: "event2" });

      clearDataLayer();

      const events = getDataLayerEvents();
      expect(events.length).toBe(0);
    });
  });

  describe("initializeDataLayer", () => {
    it("should initialize dataLayer and track initial page view", () => {
      // Mock document properties
      Object.defineProperty(document, "title", {
        value: "Test Page",
        writable: true,
        configurable: true,
      });

      initializeDataLayer();

      const events = getDataLayerEventsByType("page_view");
      expect(events.length).toBe(1);
      expect((events[0].page as any).title).toBe("Test Page");
    });

    it("should include user data when provided", () => {
      initializeDataLayer({
        user_id: "user123",
        user_type: "customer",
        consent_given: true,
      });

      const events = getDataLayerEventsByType("page_view");
      expect(events[0].user).toBeDefined();
      expect((events[0].user as any).id).toBe("user123");
    });
  });

  describe("Event Structure Validation", () => {
    it("should include timestamp in all tracked events", () => {
      trackPageView({
        page_title: "Test",
        page_location: "https://example.com",
        page_path: "/test",
      });
      trackConversion({ conversion_action: "test" });
      trackFormSubmission("test_form", "/test");
      trackServiceView("Test Service", "test-service");
      trackLocationView("Test Location", "test-location");
      trackPhoneClick("+44123456789");
      trackEmailClick("test@example.com");

      const events = getDataLayerEvents();
      events.forEach((event) => {
        expect(event.timestamp).toBeDefined();
        expect(typeof event.timestamp).toBe("string");
      });
    });

    it("should have valid event names", () => {
      trackPageView({
        page_title: "Test",
        page_location: "https://example.com",
        page_path: "/test",
      });
      trackConversion({ conversion_action: "test" });

      const events = getDataLayerEvents();
      const validEventNames = [
        "page_view",
        "conversion",
        "form_submit",
        "service_view",
        "location_view",
        "phone_call",
        "email_contact",
        "consent_update",
      ];

      events.forEach((event) => {
        expect(validEventNames).toContain(event.event);
      });
    });
  });
});
