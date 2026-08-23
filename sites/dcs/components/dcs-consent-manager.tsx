'use client';

/**
 * DCS-specific consent banner + preferences modal.
 *
 * This is a presentation-only fork of
 * `@platform/core-components/components/analytics/ConsentManager` — same
 * state machine, storage, focus-trap and event-dispatch behaviour, restyled
 * as a floating ink/fuchsia card instead of the shared component's
 * full-width footer bar. Restyle DCS here; restyle every other site by
 * editing the shared component instead.
 *
 * Visual language: ink (--color-ink) background, magenta (--color-magenta)
 * keyline, white text, pill buttons matching the homepage "Hire me" CTA
 * (site-bar.tsx / .hire in styles/home-r9.css — rounded-full, translate-y
 * lift on hover). Magenta is reserved for borders, icons, focus rings and
 * filled-button backgrounds (paired with white text) — never as small body
 * text color, since magenta-on-ink measures ~3.7:1 (fails 4.5:1 AA for text,
 * passes the 3:1 non-text/large-graphic threshold).
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Shield, Settings, Check, X, Info, Cookie } from 'lucide-react';
import type {
  ConsentState,
  ConsentBannerConfig,
  FeatureFlags,
} from '@platform/core-components/lib/analytics/types';
import { useFocusTrap } from '@platform/core-components/hooks/useFocusTrap';

interface DcsConsentManagerProps {
  enabled?: boolean;
  config?: Partial<ConsentBannerConfig>;
  onConsentChange?: (consent: ConsentState) => void;
  reloadOnConsent?: boolean;
}

const defaultConfig: ConsentBannerConfig = {
  title: 'We value your privacy',
  description:
    'We use cookies and similar technologies to provide, protect and improve our services and to personalise content. You can choose which categories of cookies to accept.',
  acceptAllText: 'Accept All',
  rejectAllText: 'Reject All',
  customizeText: 'Customize',
  privacyPolicyUrl: '/privacy-policy',
  cookiePolicyUrl: '/cookie-policy',
};

const CONSENT_COOKIE_NAME = 'analytics_consent';
const CONSENT_VERSION = '1.0';

// `focus-visible:rounded-full` looks redundant (rounded-full is already
// unconditional) but it isn't: styles/home-r9.css's homepage-only, unscoped
// `:focus-visible{border-radius:2px}` rule has the same specificity as a
// bare `.rounded-full` class, and cascade order lets it win, squaring off
// pill corners on focus. Repeating `rounded-full` inside the focus-visible
// variant compiles to a two-selector rule (`.focus-visible\:rounded-full:focus-visible`)
// whose higher specificity wins regardless of stylesheet order.
const PILL_BASE =
  'inline-flex items-center justify-center gap-2 rounded-full px-5 py-3 text-sm font-semibold whitespace-nowrap transition-all duration-300 hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 focus-visible:outline-none focus-visible:rounded-full focus-visible:ring-[3px] focus-visible:ring-[var(--color-magenta)] focus-visible:ring-offset-4 focus-visible:ring-offset-[var(--color-ink)]';

export function DcsConsentManager({
  enabled = false,
  config = {},
  onConsentChange,
  reloadOnConsent = false,
}: DcsConsentManagerProps) {
  const pathname = usePathname();
  const [showBanner, setShowBanner] = useState(false);
  const [showCustomize, setShowCustomize] = useState(false);
  const [loading, setLoading] = useState(false);
  const [featureFlags, setFeatureFlags] = useState<Partial<FeatureFlags>>({});
  const [customConsent, setCustomConsent] = useState({
    analytics: false,
    marketing: false,
    functional: true, // Functional cookies are required
  });

  const closeCustomizeRef = useRef<HTMLButtonElement>(null);
  // Focus lands here (not on Accept or Reject) when the banner opens, so a
  // stray Enter/Space right after page load can't silently fire a consent
  // decision. It's a focus sink, not a real control — tabIndex={-1} keeps it
  // out of the normal tab order; the user still has to Tab to a button to
  // make an actual choice.
  const initialFocusSinkRef = useRef<HTMLHeadingElement>(null);

  const { containerRef: bannerRef } = useFocusTrap({
    isOpen: showBanner && !showCustomize,
    initialFocusRef: initialFocusSinkRef,
    restoreFocus: false, // Banner auto-appears on page load, no trigger element
  });

  const { containerRef: customizeRef } = useFocusTrap({
    isOpen: showCustomize,
    onEscape: () => setShowCustomize(false),
    initialFocusRef: closeCustomizeRef,
  });

  const mergedConfig = { ...defaultConfig, ...config };

  // Don't show banner on privacy/cookie policy pages
  const isOnPolicyPages = pathname === '/privacy-policy' || pathname === '/cookie-policy';

  // Load feature flags from environment
  useEffect(() => {
    setFeatureFlags({
      FEATURE_ANALYTICS_ENABLED: process.env.NEXT_PUBLIC_FEATURE_ANALYTICS_ENABLED === 'true',
      FEATURE_GA4_ENABLED: process.env.NEXT_PUBLIC_FEATURE_GA4_ENABLED === 'true',
      FEATURE_FACEBOOK_PIXEL: process.env.NEXT_PUBLIC_FEATURE_FACEBOOK_PIXEL === 'true',
      FEATURE_GOOGLE_ADS: process.env.NEXT_PUBLIC_FEATURE_GOOGLE_ADS === 'true',
    });
  }, []);

  // Load consent from both cookie and localStorage
  const loadConsentFromStorage = useCallback((): ConsentState | null => {
    try {
      if (typeof document !== 'undefined') {
        const cookieConsent = getCookie(CONSENT_COOKIE_NAME);
        if (cookieConsent) {
          return JSON.parse(decodeURIComponent(cookieConsent));
        }

        const localConsent = localStorage.getItem(CONSENT_COOKIE_NAME);
        if (localConsent) {
          return JSON.parse(localConsent);
        }
      }
    } catch (error) {
      console.error('Error loading consent from storage:', error);
    }

    return null;
  }, []);

  // Load existing consent on mount
  useEffect(() => {
    if (!enabled || isOnPolicyPages) {
      setShowBanner(false);
      return;
    }

    const existingConsent = loadConsentFromStorage();

    if (existingConsent) {
      setShowBanner(false);
    } else {
      setShowBanner(true);
    }
  }, [enabled, isOnPolicyPages, loadConsentFromStorage]);

  // Save consent to both cookie and localStorage
  const saveConsentToStorage = useCallback((consent: ConsentState) => {
    try {
      const consentString = JSON.stringify(consent);

      if (typeof document !== 'undefined') {
        const expiryDate = new Date();
        expiryDate.setFullYear(expiryDate.getFullYear() + 1);

        document.cookie = `${CONSENT_COOKIE_NAME}=${encodeURIComponent(consentString)}; expires=${expiryDate.toUTCString()}; path=/; SameSite=Lax${process.env.NODE_ENV === 'production' ? '; Secure' : ''}`;

        localStorage.setItem(CONSENT_COOKIE_NAME, consentString);
      }
    } catch (error) {
      console.error('Error saving consent to storage:', error);
    }
  }, []);

  // Handle consent acceptance
  const handleConsent = useCallback(
    async (consentChoices: { analytics: boolean; marketing: boolean; functional: boolean }) => {
      setLoading(true);

      try {
        const consent: ConsentState = {
          ...consentChoices,
          functional: true,
          timestamp: Date.now(),
          version: CONSENT_VERSION,
        };

        saveConsentToStorage(consent);
        setShowBanner(false);
        setShowCustomize(false);

        onConsentChange?.(consent);

        if (typeof window !== 'undefined') {
          window.dispatchEvent(new CustomEvent('consent-updated', { detail: consent }));

          if (reloadOnConsent) {
            setTimeout(() => {
              window.location.reload();
            }, 500);
          }
        }
      } catch (error) {
        console.error('Error saving consent:', error);
      } finally {
        setLoading(false);
      }
    },
    [saveConsentToStorage, onConsentChange, reloadOnConsent]
  );

  const handleAcceptAll = useCallback(() => {
    handleConsent({
      analytics: true,
      marketing: true,
      functional: true,
    });
  }, [handleConsent]);

  const handleRejectAll = useCallback(() => {
    handleConsent({
      analytics: false,
      marketing: false,
      functional: true,
    });
  }, [handleConsent]);

  const handleSaveCustom = useCallback(() => {
    handleConsent(customConsent);
  }, [handleConsent, customConsent]);

  const handleCustomize = useCallback(() => {
    setShowCustomize(true);
  }, []);

  const showAnalyticsCookies =
    featureFlags.FEATURE_ANALYTICS_ENABLED && featureFlags.FEATURE_GA4_ENABLED;

  const showMarketingCookies =
    featureFlags.FEATURE_FACEBOOK_PIXEL || featureFlags.FEATURE_GOOGLE_ADS;

  const getCookieCategories = () => {
    const categories = [
      {
        id: 'functional',
        title: 'Essential Cookies',
        description:
          'These cookies are necessary for the website to function and cannot be switched off. They are usually only set in response to actions made by you such as setting your privacy preferences or filling in forms.',
        required: true,
        enabled: true,
        value: customConsent.functional,
      },
    ];

    if (showAnalyticsCookies) {
      categories.push({
        id: 'analytics',
        title: 'Analytics Cookies',
        description:
          'These cookies help us understand how visitors interact with our website by collecting and reporting information anonymously. This helps us improve our services.',
        required: false,
        enabled: true,
        value: customConsent.analytics,
      });
    }

    if (showMarketingCookies) {
      categories.push({
        id: 'marketing',
        title: 'Marketing Cookies',
        description:
          'These cookies are used to track visitors across websites to display relevant advertisements and measure campaign effectiveness. They help us show you ads that might interest you.',
        required: false,
        enabled: true,
        value: customConsent.marketing,
      });
    }

    return categories;
  };

  function getCookie(name: string): string | null {
    if (typeof document === 'undefined') return null;

    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) {
      return parts.pop()?.split(';').shift() || null;
    }
    return null;
  }

  if (!enabled) {
    return null;
  }

  if (!showBanner) {
    return null;
  }

  return (
    <>
      {/* Backdrop — forces a choice before the page can be used */}
      <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40" />

      {/* Floating consent card */}
      <div
        ref={bannerRef}
        role="dialog"
        aria-modal="true"
        aria-label="Cookie consent"
        className="fixed z-50 inset-x-4 bottom-4 sm:inset-x-auto sm:right-6 sm:bottom-6 sm:w-[400px] motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-bottom-4 duration-300"
      >
        <div className="rounded-[24px] border-[1.5px] border-[var(--color-magenta)] bg-[var(--color-ink)] text-white shadow-2xl shadow-black/50 p-6 sm:p-7">
          <div className="flex items-start gap-3 mb-5">
            <div className="flex-shrink-0 w-9 h-9 rounded-full bg-[var(--color-magenta)] flex items-center justify-center">
              <Cookie className="w-4 h-4 text-white" aria-hidden="true" />
            </div>
            <div className="flex-1 min-w-0">
              <h3
                ref={initialFocusSinkRef}
                tabIndex={-1}
                className="text-h4 text-white mb-2 outline-none focus-visible:outline-none"
              >
                {mergedConfig.title}
              </h3>
              <p className="text-sm text-white/70 leading-relaxed">{mergedConfig.description}</p>
            </div>
          </div>

          <div className="flex flex-wrap gap-x-5 gap-y-2 mb-6 pl-12">
            <Link
              href={mergedConfig.privacyPolicyUrl}
              className="inline-flex items-center gap-1.5 text-xs font-medium text-white/85 underline decoration-[var(--color-magenta)] decoration-2 underline-offset-4 hover:text-white transition-colors"
            >
              <Info className="w-3.5 h-3.5 text-[var(--color-magenta)]" aria-hidden="true" />
              Privacy Policy
            </Link>
            <Link
              href={mergedConfig.cookiePolicyUrl}
              className="inline-flex items-center gap-1.5 text-xs font-medium text-white/85 underline decoration-[var(--color-magenta)] decoration-2 underline-offset-4 hover:text-white transition-colors"
            >
              <Shield className="w-3.5 h-3.5 text-[var(--color-magenta)]" aria-hidden="true" />
              Cookie Policy
            </Link>
          </div>

          <div className="flex flex-col gap-3">
            <button
              onClick={handleAcceptAll}
              disabled={loading}
              className={`${PILL_BASE} bg-[var(--color-magenta)] text-white hover:brightness-110`}
              aria-label="Accept all cookies"
            >
              <Check className="w-4 h-4" aria-hidden="true" />
              {loading ? 'Processing...' : mergedConfig.acceptAllText}
            </button>
            <button
              onClick={handleCustomize}
              disabled={loading}
              className={`${PILL_BASE} border border-[var(--color-magenta)] text-white bg-transparent hover:bg-white/5`}
              aria-label="Customize cookie preferences"
            >
              <Settings className="w-4 h-4" aria-hidden="true" />
              {mergedConfig.customizeText}
            </button>
            <button
              onClick={handleRejectAll}
              disabled={loading}
              className={`${PILL_BASE} border border-white/20 text-white/75 bg-transparent hover:bg-white/5 hover:text-white`}
              aria-label="Reject all non-essential cookies"
            >
              <X className="w-4 h-4" aria-hidden="true" />
              {loading ? 'Processing...' : mergedConfig.rejectAllText}
            </button>
          </div>
        </div>
      </div>

      {/* Customize modal */}
      {showCustomize && (
        <div
          ref={customizeRef}
          role="dialog"
          aria-modal="true"
          aria-label="Cookie preferences"
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        >
          <div className="rounded-[28px] border-[1.5px] border-[var(--color-magenta)] bg-[var(--color-ink)] text-white shadow-2xl max-w-lg w-full max-h-[90vh] overflow-hidden motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-bottom-8 duration-300">
            {/* Header */}
            <div className="px-6 py-5 border-b border-white/10">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-[var(--color-magenta)] flex items-center justify-center">
                    <Settings className="w-4 h-4 text-white" aria-hidden="true" />
                  </div>
                  <h2 className="text-h4 text-white">Cookie Preferences</h2>
                </div>
                <button
                  ref={closeCustomizeRef}
                  onClick={() => setShowCustomize(false)}
                  disabled={loading}
                  className="w-9 h-9 rounded-full border border-white/15 flex items-center justify-center text-white/80 hover:text-white hover:border-[var(--color-magenta)] hover:bg-white/5 transition-all duration-200 disabled:opacity-50 focus-visible:outline-none focus-visible:rounded-full focus-visible:ring-[3px] focus-visible:ring-[var(--color-magenta)] focus-visible:ring-offset-4 focus-visible:ring-offset-[var(--color-ink)]"
                  aria-label="Close cookie preferences"
                >
                  <X className="w-4 h-4" aria-hidden="true" />
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-220px)]">
              <p className="text-sm text-white/70 leading-relaxed mb-6">
                Choose which cookies you&apos;d like to accept. You can change these settings at any
                time.
              </p>

              <div className="space-y-4">
                {getCookieCategories().map((category) => (
                  <div
                    key={category.id}
                    className={`relative rounded-2xl border p-5 transition-all duration-200 ${
                      category.required
                        ? 'bg-white/[0.06] border-white/10'
                        : 'bg-white/[0.03] border-white/10 hover:border-[var(--color-magenta)]'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="text-sm font-semibold text-white">{category.title}</h3>
                          {category.required && (
                            <span className="text-[11px] font-semibold uppercase tracking-wide px-2 py-0.5 rounded-full bg-[var(--color-magenta)] text-white">
                              Required
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-white/60 leading-relaxed">
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
                            aria-label={`${category.title} cookies`}
                            onChange={(e) => {
                              if (category.id === 'analytics') {
                                setCustomConsent((prev) => ({
                                  ...prev,
                                  analytics: e.target.checked,
                                }));
                              } else if (category.id === 'marketing') {
                                setCustomConsent((prev) => ({
                                  ...prev,
                                  marketing: e.target.checked,
                                }));
                              }
                            }}
                          />
                          <div
                            className={`w-11 h-6 rounded-full transition-all duration-200 peer-focus-visible:rounded-full peer-focus-visible:ring-[3px] peer-focus-visible:ring-[var(--color-magenta)] peer-focus-visible:ring-offset-4 peer-focus-visible:ring-offset-[var(--color-ink)] ${
                              category.required
                                ? 'bg-[var(--color-magenta)] opacity-60 cursor-not-allowed'
                                : category.value
                                  ? 'bg-[var(--color-magenta)]'
                                  : 'bg-white/15'
                            } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                          >
                            <div
                              className={`w-5 h-5 bg-white rounded-full shadow-md transition-transform duration-200 mt-0.5 ${
                                category.value ? 'translate-x-5' : 'translate-x-0.5'
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
              <div className="mt-6 p-4 rounded-xl bg-white/[0.04] border border-white/10">
                <div className="flex items-start gap-3">
                  <Info
                    className="w-5 h-5 text-[var(--color-magenta)] flex-shrink-0 mt-0.5"
                    aria-hidden="true"
                  />
                  <div>
                    <h4 className="text-sm font-semibold text-white mb-1">About Your Data</h4>
                    <p className="text-sm text-white/70">
                      We are committed to protecting your privacy. Analytics data is collected
                      anonymously, and marketing cookies help us show you relevant content. You can
                      withdraw consent at any time.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="border-t border-white/10 px-6 py-4">
              <div className="flex flex-col-reverse sm:flex-row gap-3 sm:justify-between">
                <button
                  onClick={() => setShowCustomize(false)}
                  disabled={loading}
                  className={`${PILL_BASE} border border-white/20 text-white/75 bg-transparent hover:bg-white/5 hover:text-white`}
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveCustom}
                  disabled={loading}
                  className={`${PILL_BASE} bg-[var(--color-magenta)] text-white hover:brightness-110`}
                >
                  {loading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Check className="w-4 h-4" aria-hidden="true" />
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
