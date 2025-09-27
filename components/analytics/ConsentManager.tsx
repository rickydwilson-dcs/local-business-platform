"use client";

/**
 * GDPR-Compliant Consent Manager Component
 * Handles user consent for analytics, marketing, and functional cookies
 */

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { Shield, Settings, Check, X, Info, Cookie } from "lucide-react";
import { ConsentState, ConsentBannerConfig, FeatureFlags } from "@/lib/analytics/types";

interface ConsentManagerProps {
  enabled?: boolean;
  config?: Partial<ConsentBannerConfig>;
  onConsentChange?: (consent: ConsentState) => void;
  className?: string;
  reloadOnConsent?: boolean;
}

const defaultConfig: ConsentBannerConfig = {
  title: "We value your privacy",
  description:
    "We use cookies and similar technologies to provide, protect and improve our services and to personalise content. You can choose which categories of cookies to accept.",
  acceptAllText: "Accept All",
  rejectAllText: "Reject All",
  customizeText: "Customize",
  privacyPolicyUrl: "/privacy-policy",
  cookiePolicyUrl: "/cookie-policy",
};

const CONSENT_COOKIE_NAME = "analytics_consent";
const CONSENT_VERSION = "1.0";

export function ConsentManager({
  enabled = false,
  config = {},
  onConsentChange,
  className = "",
  reloadOnConsent = false,
}: ConsentManagerProps) {
  const [showBanner, setShowBanner] = useState(false);
  const [showCustomize, setShowCustomize] = useState(false);
  const [loading, setLoading] = useState(false);
  const [featureFlags, setFeatureFlags] = useState<Partial<FeatureFlags>>({});
  const [customConsent, setCustomConsent] = useState({
    analytics: false,
    marketing: false,
    functional: true, // Functional cookies are required
  });

  const mergedConfig = { ...defaultConfig, ...config };

  // Load feature flags from environment
  useEffect(() => {
    setFeatureFlags({
      FEATURE_ANALYTICS_ENABLED: process.env.NEXT_PUBLIC_FEATURE_ANALYTICS_ENABLED === "true",
      FEATURE_GA4_ENABLED: process.env.NEXT_PUBLIC_FEATURE_GA4_ENABLED === "true",
      FEATURE_FACEBOOK_PIXEL: process.env.NEXT_PUBLIC_FEATURE_FACEBOOK_PIXEL === "true",
      FEATURE_GOOGLE_ADS: process.env.NEXT_PUBLIC_FEATURE_GOOGLE_ADS === "true",
    });
  }, []);

  // Load consent from both cookie and localStorage
  const loadConsentFromStorage = useCallback((): ConsentState | null => {
    try {
      // Try cookie first (server-side accessible)
      if (typeof document !== "undefined") {
        const cookieConsent = getCookie(CONSENT_COOKIE_NAME);
        if (cookieConsent) {
          return JSON.parse(decodeURIComponent(cookieConsent));
        }

        // Fallback to localStorage
        const localConsent = localStorage.getItem(CONSENT_COOKIE_NAME);
        if (localConsent) {
          return JSON.parse(localConsent);
        }
      }
    } catch (error) {
      console.error("Error loading consent from storage:", error);
    }

    return null;
  }, []);

  // Load existing consent on mount
  useEffect(() => {
    if (!enabled) return;

    const existingConsent = loadConsentFromStorage();

    if (existingConsent) {
      // Don't show banner if user has already consented
      setShowBanner(false);
    } else {
      // Show banner if no consent found
      setShowBanner(true);
    }
  }, [enabled, loadConsentFromStorage]);

  // Save consent to both cookie and localStorage
  const saveConsentToStorage = useCallback((consent: ConsentState) => {
    try {
      const consentString = JSON.stringify(consent);

      // Save to cookie (server-side accessible, 1 year expiry)
      if (typeof document !== "undefined") {
        const expiryDate = new Date();
        expiryDate.setFullYear(expiryDate.getFullYear() + 1);

        document.cookie = `${CONSENT_COOKIE_NAME}=${encodeURIComponent(consentString)}; expires=${expiryDate.toUTCString()}; path=/; SameSite=Lax${process.env.NODE_ENV === "production" ? "; Secure" : ""}`;

        // Also save to localStorage as backup
        localStorage.setItem(CONSENT_COOKIE_NAME, consentString);
      }
    } catch (error) {
      console.error("Error saving consent to storage:", error);
    }
  }, []);

  // Handle consent acceptance
  const handleConsent = useCallback(
    async (consentChoices: { analytics: boolean; marketing: boolean; functional: boolean }) => {
      setLoading(true);

      try {
        const consent: ConsentState = {
          ...consentChoices,
          functional: true, // Always true for functional cookies
          timestamp: Date.now(),
          version: CONSENT_VERSION,
        };

        saveConsentToStorage(consent);
        setShowBanner(false);
        setShowCustomize(false);

        // Notify parent component
        onConsentChange?.(consent);

        // Trigger page reload to apply consent changes
        if (typeof window !== "undefined") {
          window.dispatchEvent(new CustomEvent("consent-updated", { detail: consent }));

          // Optional page reload after consent decision
          if (reloadOnConsent) {
            setTimeout(() => {
              window.location.reload();
            }, 500);
          }
        }
      } catch (error) {
        console.error("Error saving consent:", error);
      } finally {
        setLoading(false);
      }
    },
    [saveConsentToStorage, onConsentChange, reloadOnConsent]
  );

  // Accept all cookies
  const handleAcceptAll = useCallback(() => {
    handleConsent({
      analytics: true,
      marketing: true,
      functional: true,
    });
  }, [handleConsent]);

  // Reject all non-essential cookies
  const handleRejectAll = useCallback(() => {
    handleConsent({
      analytics: false,
      marketing: false,
      functional: true,
    });
  }, [handleConsent]);

  // Save custom preferences
  const handleSaveCustom = useCallback(() => {
    handleConsent(customConsent);
  }, [handleConsent, customConsent]);

  // Show customize panel
  const handleCustomize = useCallback(() => {
    setShowCustomize(true);
  }, []);

  // Determine if analytics cookies should be shown
  const showAnalyticsCookies =
    featureFlags.FEATURE_ANALYTICS_ENABLED && featureFlags.FEATURE_GA4_ENABLED;

  // Determine if marketing cookies should be shown
  const showMarketingCookies =
    featureFlags.FEATURE_FACEBOOK_PIXEL || featureFlags.FEATURE_GOOGLE_ADS;

  // Get cookie categories to display
  const getCookieCategories = () => {
    const categories = [
      {
        id: "functional",
        title: "Essential Cookies",
        description:
          "These cookies are necessary for the website to function and cannot be switched off. They are usually only set in response to actions made by you such as setting your privacy preferences or filling in forms.",
        required: true,
        enabled: true,
        value: customConsent.functional,
      },
    ];

    if (showAnalyticsCookies) {
      categories.push({
        id: "analytics",
        title: "Analytics Cookies",
        description:
          "These cookies help us understand how visitors interact with our website by collecting and reporting information anonymously. This helps us improve our services.",
        required: false,
        enabled: true,
        value: customConsent.analytics,
      });
    }

    if (showMarketingCookies) {
      categories.push({
        id: "marketing",
        title: "Marketing Cookies",
        description:
          "These cookies are used to track visitors across websites to display relevant advertisements and measure campaign effectiveness. They help us show you ads that might interest you.",
        required: false,
        enabled: true,
        value: customConsent.marketing,
      });
    }

    return categories;
  };

  // Get cookie value by name
  function getCookie(name: string): string | null {
    if (typeof document === "undefined") return null;

    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) {
      return parts.pop()?.split(";").shift() || null;
    }
    return null;
  }

  // Don't render if disabled
  if (!enabled) {
    return null;
  }

  // Don't render if banner shouldn't be shown
  if (!showBanner) {
    return null;
  }

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black bg-opacity-25 backdrop-blur-sm z-40" />

      {/* Main consent banner */}
      <div
        className={`fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-2xl z-50 ${className}`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-start gap-3 mb-4">
                <div className="flex-shrink-0 w-8 h-8 bg-brand-blue rounded-full flex items-center justify-center mt-1">
                  <Cookie className="w-4 h-4 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{mergedConfig.title}</h3>
                  <p className="text-sm text-gray-700 leading-relaxed mb-3">
                    {mergedConfig.description}
                  </p>
                  <div className="flex flex-wrap gap-4 text-xs">
                    <Link
                      href={mergedConfig.privacyPolicyUrl}
                      className="text-brand-blue hover:text-blue-800 underline font-medium"
                    >
                      <Info className="w-3 h-3 inline mr-1" />
                      Privacy Policy
                    </Link>
                    <Link
                      href={mergedConfig.cookiePolicyUrl}
                      className="text-brand-blue hover:text-blue-800 underline font-medium"
                    >
                      <Shield className="w-3 h-3 inline mr-1" />
                      Cookie Policy
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-3 lg:ml-8 lg:flex-shrink-0">
              <button
                onClick={handleRejectAll}
                disabled={loading}
                className="px-6 py-3 text-sm font-medium text-gray-700 bg-gray-50 border border-gray-300 rounded-lg hover:bg-gray-100 hover:border-gray-400 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                aria-label="Reject all non-essential cookies"
              >
                <X className="w-4 h-4" />
                {loading ? "Processing..." : mergedConfig.rejectAllText}
              </button>
              <button
                onClick={handleCustomize}
                disabled={loading}
                className="px-6 py-3 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                aria-label="Customize cookie preferences"
              >
                <Settings className="w-4 h-4" />
                {mergedConfig.customizeText}
              </button>
              <button
                onClick={handleAcceptAll}
                disabled={loading}
                className="px-6 py-3 text-sm font-medium text-white bg-brand-blue rounded-lg hover:bg-blue-700 focus:ring-4 focus:ring-blue-200 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                aria-label="Accept all cookies"
              >
                <Check className="w-4 h-4" />
                {loading ? "Processing..." : mergedConfig.acceptAllText}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Customize modal */}
      {showCustomize && (
        <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-hidden animate-in fade-in slide-in-from-bottom-8 duration-300">
            {/* Header */}
            <div className="bg-gradient-to-r from-brand-blue to-blue-700 px-6 py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
                    <Settings className="w-4 h-4 text-white" />
                  </div>
                  <h2 className="text-xl font-semibold text-white">Cookie Preferences</h2>
                </div>
                <button
                  onClick={() => setShowCustomize(false)}
                  disabled={loading}
                  className="w-8 h-8 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-lg flex items-center justify-center text-white transition-all duration-200 disabled:opacity-50"
                  aria-label="Close cookie preferences"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
              <p className="text-gray-600 mb-6">
                Choose which cookies you&apos;d like to accept. You can change these settings at any
                time.
              </p>

              <div className="space-y-4">
                {getCookieCategories().map((category) => (
                  <div
                    key={category.id}
                    className={`relative border rounded-xl p-5 transition-all duration-200 ${
                      category.required
                        ? "bg-gray-50 border-gray-200"
                        : "bg-white border-gray-200 hover:border-brand-blue hover:shadow-sm"
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1 pr-4">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="font-semibold text-gray-900">{category.title}</h3>
                          {category.required && (
                            <span className="text-xs px-2 py-1 bg-green-100 text-green-700 rounded-full font-medium">
                              Required
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-gray-600 leading-relaxed">
                          {category.description}
                        </p>
                      </div>
                      <div className="flex-shrink-0">
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            className="sr-only peer"
                            checked={category.value}
                            disabled={category.required || loading}
                            onChange={(e) => {
                              if (category.id === "analytics") {
                                setCustomConsent((prev) => ({
                                  ...prev,
                                  analytics: e.target.checked,
                                }));
                              } else if (category.id === "marketing") {
                                setCustomConsent((prev) => ({
                                  ...prev,
                                  marketing: e.target.checked,
                                }));
                              }
                            }}
                          />
                          <div
                            className={`w-11 h-6 rounded-full transition-all duration-200 ${
                              category.required
                                ? "bg-green-400 cursor-not-allowed"
                                : category.value
                                  ? "bg-brand-blue peer-focus:ring-4 peer-focus:ring-blue-200"
                                  : "bg-gray-300 peer-focus:ring-4 peer-focus:ring-gray-200"
                            } ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
                          >
                            <div
                              className={`w-5 h-5 bg-white rounded-full shadow-md transition-transform duration-200 ${
                                category.value ? "translate-x-5" : "translate-x-0.5"
                              }`}
                            />
                          </div>
                        </label>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Additional Information */}
              <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-100">
                <div className="flex items-start gap-3">
                  <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-blue-900 mb-1">About Your Data</h4>
                    <p className="text-sm text-blue-800">
                      We are committed to protecting your privacy. Analytics data is collected
                      anonymously, and marketing cookies help us show you relevant content. You can
                      withdraw consent at any time.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="border-t border-gray-200 px-6 py-4 bg-gray-50">
              <div className="flex flex-col-reverse sm:flex-row gap-3 sm:justify-between">
                <button
                  onClick={() => setShowCustomize(false)}
                  disabled={loading}
                  className="px-6 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveCustom}
                  disabled={loading}
                  className="px-6 py-2.5 text-sm font-medium text-white bg-brand-blue rounded-lg hover:bg-blue-700 focus:ring-4 focus:ring-blue-200 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Check className="w-4 h-4" />
                      Save Preferences
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

// Hook to get current consent state
export function useConsent() {
  const [consent, setConsent] = useState<ConsentState | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load consent from storage
    const loadConsent = () => {
      try {
        if (typeof document !== "undefined") {
          const cookieValue = document.cookie
            .split("; ")
            .find((row) => row.startsWith(`${CONSENT_COOKIE_NAME}=`))
            ?.split("=")[1];

          if (cookieValue) {
            const parsedConsent = JSON.parse(decodeURIComponent(cookieValue));
            setConsent(parsedConsent);
          }
        }
      } catch (error) {
        console.error("Error loading consent:", error);
      } finally {
        setLoading(false);
      }
    };

    loadConsent();

    // Listen for consent updates
    const handleConsentUpdate = (event: CustomEvent) => {
      setConsent(event.detail);
    };

    if (typeof window !== "undefined") {
      window.addEventListener("consent-updated", handleConsentUpdate as EventListener);

      return () => {
        window.removeEventListener("consent-updated", handleConsentUpdate as EventListener);
      };
    }
  }, []);

  return { consent, loading };
}
