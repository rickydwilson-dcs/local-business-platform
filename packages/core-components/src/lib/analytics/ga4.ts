/**
 * Google Analytics 4 (GA4) Server-Side Implementation
 * Uses GA4 Measurement Protocol for server-side event tracking
 */

import { GA4Event, PageViewEvent, AnalyticsEvent } from "./types";

export class GA4Analytics {
  private measurementId: string;
  private apiSecret: string;
  private debugMode: boolean;

  constructor(measurementId: string, apiSecret: string, debugMode = false) {
    this.measurementId = measurementId;
    this.apiSecret = apiSecret;
    this.debugMode = debugMode;
  }

  /**
   * Generate a client ID for GA4 tracking
   */
  generateClientId(): string {
    return `${Date.now()}.${Math.random().toString(36).substring(2, 15)}`;
  }

  /**
   * Send page view event to GA4
   */
  async trackPageView(
    pageView: PageViewEvent,
    clientId: string,
    userId?: string
  ): Promise<{ success: boolean; error?: string }> {
    try {
      const event: GA4Event = {
        client_id: clientId,
        user_id: userId,
        timestamp_micros: Date.now() * 1000,
        events: [
          {
            name: "page_view",
            params: {
              page_location: pageView.page_location,
              page_title: pageView.page_title,
              page_referrer: pageView.page_referrer,
              engagement_time_msec: "1",
            },
          },
        ],
      };

      return await this.sendEvent(event);
    } catch (error) {
      console.error("GA4 page view tracking error:", error);
      return { success: false, error: error instanceof Error ? error.message : "Unknown error" };
    }
  }

  /**
   * Send custom event to GA4
   */
  async trackEvent(
    event: AnalyticsEvent,
    clientId: string,
    userId?: string
  ): Promise<{ success: boolean; error?: string }> {
    try {
      const ga4Event: GA4Event = {
        client_id: clientId,
        user_id: userId,
        timestamp_micros: (event.timestamp || Date.now()) * 1000,
        events: [
          {
            name: event.name,
            params: {
              ...event.parameters,
              value: event.value,
              currency: event.currency,
            },
          },
        ],
      };

      return await this.sendEvent(ga4Event);
    } catch (error) {
      console.error("GA4 event tracking error:", error);
      return { success: false, error: error instanceof Error ? error.message : "Unknown error" };
    }
  }

  /**
   * Track conversion event
   */
  async trackConversion(
    conversionAction: string,
    value?: number,
    currency = "GBP",
    clientId?: string,
    userId?: string
  ): Promise<{ success: boolean; error?: string }> {
    try {
      const event: GA4Event = {
        client_id: clientId || this.generateClientId(),
        user_id: userId,
        timestamp_micros: Date.now() * 1000,
        events: [
          {
            name: "conversion",
            params: {
              conversion_action: conversionAction,
              value: value,
              currency: currency,
              engagement_time_msec: "1",
            },
          },
        ],
      };

      return await this.sendEvent(event);
    } catch (error) {
      console.error("GA4 conversion tracking error:", error);
      return { success: false, error: error instanceof Error ? error.message : "Unknown error" };
    }
  }

  /**
   * Send event to GA4 Measurement Protocol
   */
  private async sendEvent(event: GA4Event): Promise<{ success: boolean; error?: string }> {
    const endpoint = this.debugMode
      ? `https://www.google-analytics.com/debug/mp/collect`
      : `https://www.google-analytics.com/mp/collect`;

    const url = `${endpoint}?measurement_id=${this.measurementId}&api_secret=${this.apiSecret}`;

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(event),
      });

      if (this.debugMode) {
        const responseData = await response.json();
        if (process.env.NODE_ENV === "development") {
          console.log("GA4 Debug Response:", responseData);
        }

        if (responseData.validationMessages?.length > 0) {
          const errors = responseData.validationMessages.map(
            (msg: { description: string }) => msg.description
          );
          return { success: false, error: `Validation errors: ${errors.join(", ")}` };
        }
      }

      if (!response.ok) {
        throw new Error(`GA4 API error: ${response.status} ${response.statusText}`);
      }

      return { success: true };
    } catch (error) {
      console.error("GA4 API request failed:", error);
      return { success: false, error: error instanceof Error ? error.message : "Network error" };
    }
  }

  /**
   * Validate configuration
   */
  static validateConfig(measurementId?: string, apiSecret?: string): boolean {
    return Boolean(
      measurementId && measurementId.startsWith("G-") && apiSecret && apiSecret.length > 10
    );
  }

  /**
   * Create GA4 instance from environment variables
   */
  static fromEnvironment(debugMode = false): GA4Analytics | null {
    const measurementId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;
    const apiSecret = process.env.GA4_API_SECRET;

    if (!this.validateConfig(measurementId, apiSecret)) {
      console.warn("GA4 configuration missing or invalid");
      return null;
    }

    return new GA4Analytics(measurementId!, apiSecret!, debugMode);
  }
}

// Utility functions for common GA4 events
export const GA4Events = {
  pageView: (url: string, title: string, referrer?: string): AnalyticsEvent => ({
    name: "page_view",
    parameters: {
      page_location: url,
      page_title: title,
      page_referrer: referrer,
    },
  }),

  quoteRequest: (service?: string, location?: string, value?: number): AnalyticsEvent => ({
    name: "quote_request",
    parameters: {
      event_category: "engagement",
      event_label: "quote_request",
      service_type: service,
      location: location,
    },
    value,
    currency: "GBP",
  }),

  phoneCall: (phoneNumber: string): AnalyticsEvent => ({
    name: "phone_call",
    parameters: {
      event_category: "engagement",
      event_label: "phone_call",
      phone_number: phoneNumber,
    },
  }),

  formSubmit: (formName: string, formLocation: string): AnalyticsEvent => ({
    name: "form_submit",
    parameters: {
      event_category: "engagement",
      event_label: "form_submit",
      form_name: formName,
      form_location: formLocation,
    },
  }),

  serviceView: (serviceName: string, serviceCategory?: string): AnalyticsEvent => ({
    name: "service_view",
    parameters: {
      event_category: "content",
      event_label: "service_view",
      service_name: serviceName,
      service_category: serviceCategory,
    },
  }),

  locationView: (locationName: string, locationType?: string): AnalyticsEvent => ({
    name: "location_view",
    parameters: {
      event_category: "content",
      event_label: "location_view",
      location_name: locationName,
      location_type: locationType,
    },
  }),
};
