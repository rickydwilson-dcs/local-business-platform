/**
 * Facebook Pixel Server-Side Implementation
 * Uses Facebook Conversions API for server-side event tracking
 */

import { FacebookPixelEvent, AnalyticsEvent, ConversionEvent } from './types';

export class FacebookPixelAnalytics {
  private pixelId: string;
  private accessToken: string;
  private testEventCode?: string;

  constructor(pixelId: string, accessToken: string, testEventCode?: string) {
    this.pixelId = pixelId;
    this.accessToken = accessToken;
    this.testEventCode = testEventCode;
  }

  /**
   * Track page view event
   */
  async trackPageView(
    pageUrl: string,
    userAgent?: string,
    clientIp?: string,
    fbp?: string,
    fbc?: string
  ): Promise<{ success: boolean; error?: string }> {
    try {
      const event: FacebookPixelEvent = {
        data: [
          {
            event_name: 'PageView',
            event_time: Math.floor(Date.now() / 1000),
            event_source_url: pageUrl,
            user_data: {
              client_ip_address: clientIp,
              client_user_agent: userAgent,
              fbp,
              fbc,
            },
          },
        ],
        test_event_code: this.testEventCode,
      };

      return await this.sendEvent(event);
    } catch (error) {
      console.error('Facebook Pixel page view tracking error:', error);
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
  }

  /**
   * Track custom event
   */
  async trackEvent(
    event: AnalyticsEvent,
    pageUrl: string,
    userAgent?: string,
    clientIp?: string,
    fbp?: string,
    fbc?: string
  ): Promise<{ success: boolean; error?: string }> {
    try {
      const fbEvent: FacebookPixelEvent = {
        data: [
          {
            event_name: this.mapEventName(event.name),
            event_time: Math.floor((event.timestamp || Date.now()) / 1000),
            event_source_url: pageUrl,
            user_data: {
              client_ip_address: clientIp,
              client_user_agent: userAgent,
              fbp,
              fbc,
            },
            custom_data: {
              ...event.parameters,
              value: event.value,
              currency: event.currency,
            },
          },
        ],
        test_event_code: this.testEventCode,
      };

      return await this.sendEvent(fbEvent);
    } catch (error) {
      console.error('Facebook Pixel event tracking error:', error);
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
  }

  /**
   * Track conversion event
   */
  async trackConversion(
    conversion: ConversionEvent,
    pageUrl: string,
    userAgent?: string,
    clientIp?: string,
    fbp?: string,
    fbc?: string
  ): Promise<{ success: boolean; error?: string }> {
    try {
      const eventName = this.mapConversionAction(conversion.conversion_action);

      const event: FacebookPixelEvent = {
        data: [
          {
            event_name: eventName,
            event_time: Math.floor((conversion.timestamp || Date.now()) / 1000),
            event_source_url: pageUrl,
            user_data: {
              client_ip_address: clientIp,
              client_user_agent: userAgent,
              fbp,
              fbc,
            },
            custom_data: {
              value: conversion.conversion_value || conversion.value,
              currency: conversion.conversion_currency || conversion.currency || 'GBP',
              content_category: 'Scaffolding Services',
              ...conversion.parameters,
            },
          },
        ],
        test_event_code: this.testEventCode,
      };

      return await this.sendEvent(event);
    } catch (error) {
      console.error('Facebook Pixel conversion tracking error:', error);
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
  }

  /**
   * Send event to Facebook Conversions API
   */
  private async sendEvent(event: FacebookPixelEvent): Promise<{ success: boolean; error?: string }> {
    const url = `https://graph.facebook.com/v18.0/${this.pixelId}/events`;

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.accessToken}`,
        },
        body: JSON.stringify(event),
      });

      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(`Facebook API error: ${response.status} - ${JSON.stringify(responseData)}`);
      }

      // Check for events received
      if (responseData.events_received !== event.data.length) {
        console.warn('Facebook Pixel: Not all events were received', responseData);
      }

      // Log any messages from Facebook
      if (responseData.messages && responseData.messages.length > 0) {
        console.log('Facebook Pixel messages:', responseData.messages);
      }

      return { success: true };
    } catch (error) {
      console.error('Facebook Pixel API request failed:', error);
      return { success: false, error: error instanceof Error ? error.message : 'Network error' };
    }
  }

  /**
   * Map generic event names to Facebook standard events
   */
  private mapEventName(eventName: string): string {
    const eventMap: Record<string, string> = {
      page_view: 'PageView',
      quote_request: 'Lead',
      form_submit: 'Lead',
      contact_form_complete: 'CompleteRegistration',
      phone_call: 'Contact',
      email_contact: 'Contact',
      service_view: 'ViewContent',
      location_view: 'ViewContent',
      search: 'Search',
      download: 'Download',
    };

    return eventMap[eventName] || 'CustomEvent';
  }

  /**
   * Map conversion actions to Facebook events
   */
  private mapConversionAction(action: string): string {
    const conversionMap: Record<string, string> = {
      quote_request: 'Lead',
      phone_call: 'Contact',
      email_contact: 'Contact',
      form_submit: 'CompleteRegistration',
    };

    return conversionMap[action] || 'Lead';
  }

  /**
   * Extract Facebook click ID (fbc) from URL or cookie
   */
  static extractFbc(url: string, cookies?: string): string | undefined {
    // Try to get from URL parameter first
    const urlParams = new URLSearchParams(url.split('?')[1] || '');
    const fbclid = urlParams.get('fbclid');

    if (fbclid) {
      return `fb.1.${Date.now()}.${fbclid}`;
    }

    // Try to get from cookie
    if (cookies) {
      const fbcMatch = cookies.match(/fbc=([^;]+)/);
      if (fbcMatch) {
        return fbcMatch[1];
      }
    }

    return undefined;
  }

  /**
   * Extract Facebook browser ID (fbp) from cookie
   */
  static extractFbp(cookies?: string): string | undefined {
    if (!cookies) return undefined;

    const fbpMatch = cookies.match(/fbp=([^;]+)/);
    return fbpMatch ? fbpMatch[1] : undefined;
  }

  /**
   * Validate configuration
   */
  static validateConfig(pixelId?: string, accessToken?: string): boolean {
    return Boolean(
      pixelId &&
        pixelId.length > 0 &&
        accessToken &&
        accessToken.length > 10
    );
  }

  /**
   * Create Facebook Pixel instance from environment variables
   */
  static fromEnvironment(testMode = false): FacebookPixelAnalytics | null {
    const pixelId = process.env.FACEBOOK_PIXEL_ID;
    const accessToken = process.env.FACEBOOK_ACCESS_TOKEN;
    const testEventCode = testMode ? process.env.FACEBOOK_TEST_EVENT_CODE : undefined;

    if (!this.validateConfig(pixelId, accessToken)) {
      console.warn('Facebook Pixel configuration missing or invalid');
      return null;
    }

    return new FacebookPixelAnalytics(pixelId!, accessToken!, testEventCode);
  }
}

// Utility functions for common Facebook Pixel events
export const FacebookEvents = {
  pageView: (url: string): AnalyticsEvent => ({
    name: 'page_view',
    parameters: {
      source: 'website',
      page_url: url,
    },
  }),

  lead: (service?: string, location?: string, value?: number): AnalyticsEvent => ({
    name: 'quote_request',
    parameters: {
      content_category: 'Scaffolding Services',
      content_name: service,
      content_type: 'service',
      location: location,
    },
    value,
    currency: 'GBP',
  }),

  contact: (method: 'phone' | 'email' | 'form'): AnalyticsEvent => ({
    name: method === 'phone' ? 'phone_call' : method === 'email' ? 'email_contact' : 'form_submit',
    parameters: {
      content_category: 'Contact',
      contact_method: method,
    },
  }),

  viewContent: (contentType: 'service' | 'location', contentName: string): AnalyticsEvent => ({
    name: contentType === 'service' ? 'service_view' : 'location_view',
    parameters: {
      content_type: contentType,
      content_name: contentName,
      content_category: contentType === 'service' ? 'Scaffolding Services' : 'Service Areas',
    },
  }),
};