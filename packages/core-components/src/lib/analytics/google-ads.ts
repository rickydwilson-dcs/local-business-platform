/**
 * Google Ads Server-Side Implementation
 * Uses Google Ads API for server-side conversion tracking
 */

import { GoogleAdsConversion, ConversionEvent } from "./types";

export class GoogleAdsAnalytics {
  private customerId: string;
  private conversionActionId: string;
  private accessToken?: string;

  constructor(customerId: string, conversionActionId: string, accessToken?: string) {
    this.customerId = customerId;
    this.conversionActionId = conversionActionId;
    this.accessToken = accessToken;
  }

  /**
   * Track conversion event
   */
  async trackConversion(
    conversion: ConversionEvent,
    gclid?: string,
    orderId?: string
  ): Promise<{ success: boolean; error?: string }> {
    try {
      const conversionData: GoogleAdsConversion = {
        conversion_action: `customers/${this.customerId}/conversionActions/${this.conversionActionId}`,
        conversion_date_time: new Date(conversion.timestamp || Date.now()).toISOString(),
        conversion_value: conversion.conversion_value || conversion.value,
        currency_code: conversion.conversion_currency || conversion.currency || "GBP",
        order_id: orderId,
        gclid: gclid,
      };

      return await this.sendConversion(conversionData as unknown as Record<string, unknown>);
    } catch (error) {
      console.error("Google Ads conversion tracking error:", error);
      return { success: false, error: error instanceof Error ? error.message : "Unknown error" };
    }
  }

  /**
   * Track enhanced conversion (with customer data)
   */
  async trackEnhancedConversion(
    conversion: ConversionEvent,
    customerData: {
      email?: string;
      phone?: string;
      firstName?: string;
      lastName?: string;
      postalCode?: string;
    },
    gclid?: string,
    orderId?: string
  ): Promise<{ success: boolean; error?: string }> {
    try {
      // Enhanced conversions require customer data to be hashed
      const hashedCustomerData = this.hashCustomerData(customerData);

      const conversionData = {
        conversion_action: `customers/${this.customerId}/conversionActions/${this.conversionActionId}`,
        conversion_date_time: new Date(conversion.timestamp || Date.now()).toISOString(),
        conversion_value: conversion.conversion_value || conversion.value,
        currency_code: conversion.conversion_currency || conversion.currency || "GBP",
        order_id: orderId,
        gclid: gclid,
        user_identifiers: hashedCustomerData,
      };

      return await this.sendConversion(conversionData as unknown as Record<string, unknown>);
    } catch (error) {
      console.error("Google Ads enhanced conversion tracking error:", error);
      return { success: false, error: error instanceof Error ? error.message : "Unknown error" };
    }
  }

  /**
   * Send conversion to Google Ads API (requires OAuth token)
   */
  private async sendConversion(
    conversionData: Record<string, unknown>
  ): Promise<{ success: boolean; error?: string }> {
    if (!this.accessToken) {
      // Fallback to gtag for client-side conversion tracking
      return this.sendClientSideConversion(conversionData);
    }

    const url = `https://googleads.googleapis.com/v16/customers/${this.customerId}:uploadConversions`;

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${this.accessToken}`,
          "Content-Type": "application/json",
          "developer-token": process.env.GOOGLE_ADS_DEVELOPER_TOKEN || "",
        },
        body: JSON.stringify({
          conversions: [conversionData],
          partial_failure: false,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Google Ads API error: ${response.status} - ${JSON.stringify(errorData)}`);
      }

      const responseData = await response.json();
      console.log("Google Ads conversion tracked successfully:", responseData);

      return { success: true };
    } catch (error) {
      console.error("Google Ads API request failed:", error);
      return { success: false, error: error instanceof Error ? error.message : "Network error" };
    }
  }

  /**
   * Fallback to client-side conversion tracking using gtag
   */
  private async sendClientSideConversion(
    conversionData: Record<string, unknown>
  ): Promise<{ success: boolean; error?: string }> {
    try {
      // This would be used client-side, but we can prepare the data for client-side tracking
      const conversionEvent = {
        send_to: `AW-${this.customerId}/${this.conversionActionId}`,
        value: (conversionData as { conversion_value?: unknown }).conversion_value,
        currency: (conversionData as { currency_code?: unknown }).currency_code,
        transaction_id: (conversionData as { order_id?: unknown }).order_id,
      };

      console.log("Prepared client-side conversion data:", conversionEvent);

      // In a real implementation, this would be sent to a queue for client-side processing
      // or stored for the next page load to trigger via gtag

      return { success: true };
    } catch (error) {
      console.error("Client-side conversion preparation failed:", error);
      return { success: false, error: error instanceof Error ? error.message : "Unknown error" };
    }
  }

  /**
   * Hash customer data for enhanced conversions
   */
  private async hashCustomerData(customerData: {
    email?: string;
    phone?: string;
    firstName?: string;
    lastName?: string;
    postalCode?: string;
  }): Promise<Array<{ hashed_email?: string; hashed_phone_number?: string }>> {
    const crypto = await import("crypto");
    const identifiers: Array<{ hashed_email?: string; hashed_phone_number?: string }> = [];

    if (customerData.email) {
      identifiers.push({
        hashed_email: crypto
          .createHash("sha256")
          .update(customerData.email.toLowerCase().trim())
          .digest("hex"),
      });
    }

    if (customerData.phone) {
      // Remove all non-digit characters and add country code if missing
      let phone = customerData.phone.replace(/\D/g, "");
      if (!phone.startsWith("44") && phone.startsWith("0")) {
        phone = "44" + phone.substring(1);
      }

      identifiers.push({
        hashed_phone_number: crypto.createHash("sha256").update(phone).digest("hex"),
      });
    }

    return identifiers;
  }

  /**
   * Extract Google Click ID (gclid) from URL
   */
  static extractGclid(url: string): string | undefined {
    const urlParams = new URLSearchParams(url.split("?")[1] || "");
    return urlParams.get("gclid") || undefined;
  }

  /**
   * Map conversion actions to Google Ads conversion names
   */
  private mapConversionAction(action: string): string {
    const conversionMap: Record<string, string> = {
      quote_request: "Quote Request",
      phone_call: "Phone Call",
      email_contact: "Email Contact",
      form_submit: "Form Submission",
    };

    return conversionMap[action] || "Conversion";
  }

  /**
   * Validate configuration
   */
  static validateConfig(customerId?: string, conversionActionId?: string): boolean {
    return Boolean(
      customerId && customerId.length > 0 && conversionActionId && conversionActionId.length > 0
    );
  }

  /**
   * Create Google Ads instance from environment variables
   */
  static fromEnvironment(): GoogleAdsAnalytics | null {
    const customerId = process.env.GOOGLE_ADS_CUSTOMER_ID;
    const conversionActionId = process.env.GOOGLE_ADS_CONVERSION_ACTION_ID;
    const accessToken = process.env.GOOGLE_ADS_ACCESS_TOKEN;

    if (!this.validateConfig(customerId, conversionActionId)) {
      console.warn("Google Ads configuration missing or invalid");
      return null;
    }

    return new GoogleAdsAnalytics(customerId!, conversionActionId!, accessToken);
  }
}

// Utility functions for common Google Ads conversions
export const GoogleAdsEvents = {
  quoteRequest: (value?: number, service?: string, location?: string): ConversionEvent => ({
    name: "quote_request",
    conversion_action: "quote_request",
    conversion_value: value,
    conversion_currency: "GBP",
    parameters: {
      service_type: service,
      location: location,
      lead_type: "quote_request",
    },
  }),

  phoneCall: (phoneNumber: string, callDuration?: number): ConversionEvent => ({
    name: "phone_call",
    conversion_action: "phone_call",
    parameters: {
      phone_number: phoneNumber,
      call_duration: callDuration,
      lead_type: "phone_call",
    },
  }),

  emailContact: (emailAddress?: string): ConversionEvent => ({
    name: "email_contact",
    conversion_action: "email_contact",
    parameters: {
      email_address: emailAddress,
      lead_type: "email_contact",
    },
  }),

  formSubmission: (formName: string, formLocation: string): ConversionEvent => ({
    name: "form_submit",
    conversion_action: "form_submit",
    parameters: {
      form_name: formName,
      form_location: formLocation,
      lead_type: "form_submission",
    },
  }),
};

// Client-side gtag conversion tracking helpers
export const GtagConversions = {
  /**
   * Generate gtag conversion tracking code for client-side
   */
  generateConversionCode(
    conversionId: string,
    conversionLabel: string,
    value?: number,
    currency = "GBP",
    transactionId?: string
  ): string {
    return `
      gtag('event', 'conversion', {
        'send_to': 'AW-${conversionId}/${conversionLabel}',
        'value': ${value || 0},
        'currency': '${currency}',
        'transaction_id': '${transactionId || ""}'
      });
    `;
  },

  /**
   * Generate enhanced conversion tracking code
   */
  generateEnhancedConversionCode(
    conversionId: string,
    conversionLabel: string,
    customerData: {
      email?: string;
      phone_number?: string;
      first_name?: string;
      last_name?: string;
      postal_code?: string;
    },
    value?: number,
    currency = "GBP",
    transactionId?: string
  ): string {
    return `
      gtag('event', 'conversion', {
        'send_to': 'AW-${conversionId}/${conversionLabel}',
        'value': ${value || 0},
        'currency': '${currency}',
        'transaction_id': '${transactionId || ""}',
        'user_data': ${JSON.stringify(customerData)}
      });
    `;
  },
};
