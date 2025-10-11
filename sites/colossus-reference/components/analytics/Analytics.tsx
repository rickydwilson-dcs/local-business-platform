"use client";

/**
 * Analytics Component
 * Handles client-side analytics script loading and tracking
 */

import { useEffect, useState, useCallback } from "react";
import Script from "next/script";
import { useConsent } from "./ConsentManager";
import { AnalyticsEvent, FeatureFlags } from "@/lib/analytics/types";

interface AnalyticsProps {
  gaId?: string;
  facebookPixelId?: string;
  googleAdsId?: string;
  debugMode?: boolean;
}

// Client-side analytics functions
declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    fbq?: (...args: unknown[]) => void;
    dataLayer?: unknown[];
  }
}

export function Analytics({
  gaId,
  facebookPixelId,
  googleAdsId,
  debugMode = false,
}: AnalyticsProps) {
  const { consent, loading } = useConsent();
  const [scriptsLoaded, setScriptsLoaded] = useState({
    ga4: false,
    facebook: false,
    googleAds: false,
  });

  const [featureFlags, setFeatureFlags] = useState<Partial<FeatureFlags>>({});

  // Load feature flags from environment (client-side accessible ones)
  useEffect(() => {
    setFeatureFlags({
      FEATURE_ANALYTICS_ENABLED: process.env.NEXT_PUBLIC_FEATURE_ANALYTICS_ENABLED === "true",
      FEATURE_GA4_ENABLED: process.env.NEXT_PUBLIC_FEATURE_GA4_ENABLED === "true",
      FEATURE_FACEBOOK_PIXEL: process.env.NEXT_PUBLIC_FEATURE_FACEBOOK_PIXEL === "true",
      FEATURE_GOOGLE_ADS: process.env.NEXT_PUBLIC_FEATURE_GOOGLE_ADS === "true",
    });
  }, []);

  // Initialize GA4
  const initializeGA4 = useCallback(() => {
    if (!window.gtag || !gaId) return;

    window.gtag("config", gaId, {
      page_title: document.title,
      page_location: window.location.href,
      anonymize_ip: true,
      allow_google_signals: consent?.marketing || false,
      allow_ad_personalization_signals: consent?.marketing || false,
      send_page_view: false, // We'll manually send it after config
    });

    // Manually fire the initial page view after consent
    window.gtag("event", "page_view", {
      page_title: document.title,
      page_location: window.location.href,
      page_referrer: document.referrer || undefined,
    });

    if (debugMode) {
      console.log("GA4 initialized with ID:", gaId, "and initial page view sent");
    }
  }, [gaId, consent, debugMode]);

  // Initialize Facebook Pixel
  const initializeFacebookPixel = useCallback(() => {
    if (!window.fbq || !facebookPixelId) return;

    window.fbq("init", facebookPixelId, {
      external_id: undefined, // Could be set to user ID if available
    });

    // Track initial page view
    window.fbq("track", "PageView");

    if (debugMode) {
      console.log("Facebook Pixel initialized with ID:", facebookPixelId);
    }
  }, [facebookPixelId, debugMode]);

  // Initialize Google Ads
  const initializeGoogleAds = useCallback(() => {
    if (!window.gtag || !googleAdsId) return;

    window.gtag("config", googleAdsId);

    if (debugMode) {
      console.log("Google Ads initialized with ID:", googleAdsId);
    }
  }, [googleAdsId, debugMode]);

  // Initialize analytics platforms
  const initializeAnalytics = useCallback(() => {
    if (!consent) return;

    // Initialize GA4 if consented and enabled
    if (
      consent.analytics &&
      featureFlags.FEATURE_GA4_ENABLED &&
      gaId &&
      scriptsLoaded.ga4 &&
      window.gtag
    ) {
      initializeGA4();
    }

    // Initialize Facebook Pixel if consented and enabled
    if (
      consent.marketing &&
      featureFlags.FEATURE_FACEBOOK_PIXEL &&
      facebookPixelId &&
      scriptsLoaded.facebook &&
      window.fbq
    ) {
      initializeFacebookPixel();
    }

    // Initialize Google Ads if consented and enabled
    if (
      consent.marketing &&
      featureFlags.FEATURE_GOOGLE_ADS &&
      googleAdsId &&
      scriptsLoaded.googleAds &&
      window.gtag
    ) {
      initializeGoogleAds();
    }
  }, [
    consent,
    featureFlags,
    gaId,
    facebookPixelId,
    googleAdsId,
    scriptsLoaded,
    initializeGA4,
    initializeFacebookPixel,
    initializeGoogleAds,
  ]);

  // Initialize analytics when consent is available
  useEffect(() => {
    if (!loading && consent) {
      initializeAnalytics();
    }
  }, [consent, loading, scriptsLoaded, initializeAnalytics]);

  // Track custom event
  const trackEvent = useCallback(
    (event: AnalyticsEvent) => {
      if (!consent) return;

      // GA4 tracking
      if (consent.analytics && window.gtag && gaId && featureFlags.FEATURE_GA4_ENABLED) {
        window.gtag("event", event.name, {
          event_category: event.parameters?.event_category,
          event_label: event.parameters?.event_label,
          value: event.value,
          currency: event.currency,
          ...event.parameters,
        });
      }

      // Facebook Pixel tracking
      if (
        consent.marketing &&
        window.fbq &&
        facebookPixelId &&
        featureFlags.FEATURE_FACEBOOK_PIXEL
      ) {
        window.fbq("track", mapEventForFacebook(event.name), {
          value: event.value,
          currency: event.currency,
          ...event.parameters,
        });
      }
    },
    [consent, gaId, facebookPixelId, featureFlags]
  );

  // Map event names for Facebook Pixel
  const mapEventForFacebook = (eventName: string): string => {
    const eventMap: Record<string, string> = {
      quote_request: "Lead",
      form_submit: "Lead",
      contact_form_complete: "CompleteRegistration",
      phone_call: "Contact",
      email_contact: "Contact",
      service_view: "ViewContent",
      location_view: "ViewContent",
      search: "Search",
    };

    return eventMap[eventName] || "CustomEvent";
  };

  // Expose tracking function globally for easy access
  useEffect(() => {
    if (typeof window !== "undefined") {
      (window as unknown as { trackAnalyticsEvent: typeof trackEvent }).trackAnalyticsEvent =
        trackEvent;
    }
  }, [consent, trackEvent]);

  // Don't render if analytics is disabled
  if (!featureFlags.FEATURE_ANALYTICS_ENABLED) {
    return null;
  }

  // Don't render scripts if consent is not given
  if (!consent) {
    return null;
  }

  return (
    <>
      {/* Google Analytics 4 */}
      {consent.analytics && featureFlags.FEATURE_GA4_ENABLED && gaId && (
        <>
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
            strategy="afterInteractive"
            onLoad={() => {
              setScriptsLoaded((prev) => ({ ...prev, ga4: true }));
            }}
          />
          <Script
            id="ga4-init"
            strategy="afterInteractive"
            dangerouslySetInnerHTML={{
              __html: `
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());

                // Set consent defaults
                gtag('consent', 'default', {
                  'analytics_storage': '${consent.analytics ? "granted" : "denied"}',
                  'ad_storage': '${consent.marketing ? "granted" : "denied"}',
                  'ad_user_data': '${consent.marketing ? "granted" : "denied"}',
                  'ad_personalization': '${consent.marketing ? "granted" : "denied"}'
                });
              `,
            }}
          />
        </>
      )}

      {/* Facebook Pixel */}
      {consent.marketing && featureFlags.FEATURE_FACEBOOK_PIXEL && facebookPixelId && (
        <Script
          id="facebook-pixel"
          strategy="afterInteractive"
          onLoad={() => {
            setScriptsLoaded((prev) => ({ ...prev, facebook: true }));
          }}
          dangerouslySetInnerHTML={{
            __html: `
              !function(f,b,e,v,n,t,s)
              {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
              n.callMethod.apply(n,arguments):n.queue.push(arguments)};
              if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
              n.queue=[];t=b.createElement(e);t.async=!0;
              t.src=v;s=b.getElementsByTagName(e)[0];
              s.parentNode.insertBefore(t,s)}(window, document,'script',
              'https://connect.facebook.net/en_US/fbevents.js');
            `,
          }}
        />
      )}

      {/* Google Ads */}
      {consent.marketing && featureFlags.FEATURE_GOOGLE_ADS && googleAdsId && (
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=AW-${googleAdsId}`}
          strategy="afterInteractive"
          onLoad={() => {
            setScriptsLoaded((prev) => ({ ...prev, googleAds: true }));
          }}
        />
      )}

      {/* Debug information */}
      {debugMode && process.env.NODE_ENV === "development" && (
        <Script
          id="analytics-debug"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              console.log('Analytics Debug Info:', {
                consent: ${JSON.stringify(consent)},
                featureFlags: ${JSON.stringify(featureFlags)},
                scriptsLoaded: ${JSON.stringify(scriptsLoaded)},
                gaId: '${gaId || "not set"}',
                facebookPixelId: '${facebookPixelId || "not set"}',
                googleAdsId: '${googleAdsId || "not set"}'
              });
            `,
          }}
        />
      )}
    </>
  );
}

// Hook for tracking events from components
export function useAnalytics() {
  const { consent } = useConsent();

  const trackEvent = (event: AnalyticsEvent) => {
    if (
      typeof window !== "undefined" &&
      (window as unknown as { trackAnalyticsEvent?: typeof trackEvent }).trackAnalyticsEvent
    ) {
      (window as unknown as { trackAnalyticsEvent: typeof trackEvent }).trackAnalyticsEvent(event);
    }
  };

  const trackPageView = (title?: string, url?: string) => {
    if (!consent?.analytics) return;

    const pageTitle = title || document.title;
    const pageUrl = url || window.location.href;

    trackEvent({
      name: "page_view",
      parameters: {
        page_title: pageTitle,
        page_location: pageUrl,
      },
    });
  };

  const trackConversion = (
    action: "quote_request" | "phone_call" | "email_contact" | "form_submit",
    value?: number,
    currency = "GBP",
    parameters?: Record<string, unknown>
  ) => {
    trackEvent({
      name: action,
      value,
      currency,
      parameters: {
        conversion_action: action,
        ...parameters,
      },
    });
  };

  return {
    trackEvent,
    trackPageView,
    trackConversion,
    hasConsent: Boolean(consent),
    consentState: consent,
  };
}
