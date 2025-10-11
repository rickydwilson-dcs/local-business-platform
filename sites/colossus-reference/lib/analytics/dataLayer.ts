/**
 * Enhanced DataLayer Management
 * Provides structured event queuing and consent-aware tracking
 */

export interface DataLayerEvent {
  event: string;
  [key: string]: unknown;
}

export interface PageViewData {
  page_title: string;
  page_location: string;
  page_path: string;
  page_referrer?: string;
}

export interface UserData {
  user_id?: string;
  user_type?: "visitor" | "lead" | "customer";
  consent_given?: boolean;
  consent_types?: string[];
}

export interface ConversionData {
  conversion_id?: string;
  conversion_action: string;
  conversion_value?: number;
  conversion_currency?: string;
  service_type?: string;
  location?: string;
}

/**
 * Initialize or get existing dataLayer
 */
export function getDataLayer(): DataLayerEvent[] {
  if (typeof window === "undefined") {
    return [];
  }

  if (!window.dataLayer) {
    (window as { dataLayer?: unknown[] }).dataLayer = [];
  }

  return (window as { dataLayer?: unknown[] }).dataLayer as DataLayerEvent[];
}

/**
 * Push event to dataLayer
 */
export function pushToDataLayer(event: DataLayerEvent): void {
  if (typeof window === "undefined") {
    return;
  }

  const dataLayer = getDataLayer();
  dataLayer.push(event);

  // Debug logging in development
  if (process.env.NODE_ENV === "development") {
    console.log("[DataLayer] Event pushed:", event);
  }
}

/**
 * Track page view with structured data
 */
export function trackPageView(data: PageViewData, userData?: UserData): void {
  pushToDataLayer({
    event: "page_view",
    page: {
      title: data.page_title,
      location: data.page_location,
      path: data.page_path,
      referrer: data.page_referrer || document.referrer || undefined,
    },
    user: userData
      ? {
          id: userData.user_id,
          type: userData.user_type || "visitor",
          consent_given: userData.consent_given,
          consent_types: userData.consent_types || [],
        }
      : undefined,
    timestamp: new Date().toISOString(),
  });
}

/**
 * Track conversion event
 */
export function trackConversion(data: ConversionData, userData?: UserData): void {
  pushToDataLayer({
    event: "conversion",
    conversion: {
      id: data.conversion_id,
      action: data.conversion_action,
      value: data.conversion_value,
      currency: data.conversion_currency || "GBP",
      service_type: data.service_type,
      location: data.location,
    },
    user: userData
      ? {
          id: userData.user_id,
          type: userData.user_type || "lead",
        }
      : undefined,
    timestamp: new Date().toISOString(),
  });
}

/**
 * Track form submission
 */
export function trackFormSubmission(
  formName: string,
  formLocation: string,
  formData?: Record<string, unknown>
): void {
  pushToDataLayer({
    event: "form_submit",
    form: {
      name: formName,
      location: formLocation,
      data: formData || {},
    },
    timestamp: new Date().toISOString(),
  });
}

/**
 * Track service view
 */
export function trackServiceView(serviceName: string, serviceSlug: string): void {
  pushToDataLayer({
    event: "service_view",
    service: {
      name: serviceName,
      slug: serviceSlug,
      category: "scaffolding",
    },
    timestamp: new Date().toISOString(),
  });
}

/**
 * Track location view
 */
export function trackLocationView(locationName: string, locationSlug: string): void {
  pushToDataLayer({
    event: "location_view",
    location: {
      name: locationName,
      slug: locationSlug,
    },
    timestamp: new Date().toISOString(),
  });
}

/**
 * Track phone call click
 */
export function trackPhoneClick(phoneNumber: string): void {
  pushToDataLayer({
    event: "phone_call",
    phone: {
      number: phoneNumber,
    },
    timestamp: new Date().toISOString(),
  });
}

/**
 * Track email click
 */
export function trackEmailClick(emailAddress: string): void {
  pushToDataLayer({
    event: "email_contact",
    email: {
      address: emailAddress,
    },
    timestamp: new Date().toISOString(),
  });
}

/**
 * Update consent state in dataLayer
 */
export function updateConsentInDataLayer(consentTypes: string[]): void {
  pushToDataLayer({
    event: "consent_update",
    consent: {
      types: consentTypes,
      timestamp: new Date().toISOString(),
    },
  });

  // Also push consent mode update for GA4
  if (typeof window !== "undefined" && window.gtag) {
    window.gtag("consent", "update", {
      analytics_storage: consentTypes.includes("analytics") ? "granted" : "denied",
      ad_storage: consentTypes.includes("marketing") ? "granted" : "denied",
      ad_user_data: consentTypes.includes("marketing") ? "granted" : "denied",
      ad_personalization: consentTypes.includes("marketing") ? "granted" : "denied",
    });
  }
}

/**
 * Get all events from dataLayer
 */
export function getDataLayerEvents(): DataLayerEvent[] {
  return getDataLayer();
}

/**
 * Get events of specific type from dataLayer
 */
export function getDataLayerEventsByType(eventType: string): DataLayerEvent[] {
  return getDataLayer().filter((event) => event.event === eventType);
}

/**
 * Clear dataLayer (use with caution, mainly for testing)
 */
export function clearDataLayer(): void {
  const dataLayer = (window as { dataLayer?: unknown[] }).dataLayer;
  if (typeof window !== "undefined" && dataLayer) {
    dataLayer.length = 0;
  }
}

/**
 * Initialize dataLayer with default page view
 */
export function initializeDataLayer(userData?: UserData): void {
  if (typeof window === "undefined") {
    return;
  }

  // Initialize dataLayer array if not exists
  getDataLayer();

  // Track initial page view
  trackPageView(
    {
      page_title: document.title,
      page_location: window.location.href,
      page_path: window.location.pathname,
      page_referrer: document.referrer || undefined,
    },
    userData
  );
}
