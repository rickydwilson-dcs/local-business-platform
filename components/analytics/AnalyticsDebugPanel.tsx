"use client";

/**
 * Analytics Debug Panel Component
 * Development tool for testing and debugging analytics implementation
 */

import { useState, useEffect, useCallback } from "react";
import { useConsent } from "./ConsentManager";
import { DebugPanelData } from "@/lib/analytics/types";

interface AnalyticsDebugPanelProps {
  enabled?: boolean;
  className?: string;
}

export function AnalyticsDebugPanel({
  enabled = process.env.NODE_ENV === "development",
  className = "",
}: AnalyticsDebugPanelProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [debugData, setDebugData] = useState<DebugPanelData | null>(null);
  const [loading, setLoading] = useState(false);
  const [testResults, setTestResults] = useState<unknown[]>([]);
  const { consent } = useConsent();

  // Load debug data from API
  const loadDebugData = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/analytics/debug");
      const data = await response.json();
      setDebugData(data.data);
    } catch (error) {
      console.error("Failed to load debug data:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  // Test page view tracking
  const testPageView = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/analytics/debug", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          action: "test_page_view",
          page_location: window.location.href,
          page_title: document.title,
          client_id: `debug.${Date.now()}`,
          base_url: window.location.origin,
        }),
      });

      const result = await response.json();
      setTestResults((prev) => [result, ...prev.slice(0, 4)]); // Keep last 5 results
    } catch (error) {
      console.error("Page view test failed:", error);
    } finally {
      setLoading(false);
    }
  };

  // Test conversion tracking
  const testConversion = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/analytics/debug", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          action: "test_conversion",
          page_location: window.location.href,
          client_id: `debug.${Date.now()}`,
          base_url: window.location.origin,
        }),
      });

      const result = await response.json();
      setTestResults((prev) => [result, ...prev.slice(0, 4)]); // Keep last 5 results
    } catch (error) {
      console.error("Conversion test failed:", error);
    } finally {
      setLoading(false);
    }
  };

  // Validate configuration
  const validateConfig = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/analytics/debug", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ action: "validate_config" }),
      });

      const result = await response.json();
      setTestResults((prev) => [result, ...prev.slice(0, 4)]); // Keep last 5 results
    } catch (error) {
      console.error("Configuration validation failed:", error);
    } finally {
      setLoading(false);
    }
  };

  // Clear test results
  const clearResults = () => {
    setTestResults([]);
  };

  // Load debug data when panel opens
  useEffect(() => {
    if (isOpen && !debugData) {
      loadDebugData();
    }
  }, [isOpen, debugData, loadDebugData]);

  // Don't render in production unless explicitly enabled
  if (!enabled) {
    return null;
  }

  return (
    <div className={`fixed bottom-4 right-4 z-50 ${className}`}>
      {/* Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="bg-purple-600 text-white px-4 py-2 rounded-lg shadow-lg hover:bg-purple-700 transition-colors"
        title="Analytics Debug Panel"
      >
        {isOpen ? "✕" : "📊"} Debug
      </button>

      {/* Debug Panel */}
      {isOpen && (
        <div className="absolute bottom-12 right-0 w-96 max-h-96 bg-white border border-gray-200 rounded-lg shadow-xl overflow-hidden">
          <div className="p-4 bg-gray-50 border-b border-gray-200">
            <h3 className="font-semibold text-gray-900">Analytics Debug Panel</h3>
            <p className="text-xs text-gray-600 mt-1">Development Mode Only</p>
          </div>

          <div className="max-h-80 overflow-y-auto">
            {/* Status Overview */}
            <div className="p-4 space-y-3">
              <div>
                <h4 className="font-medium text-gray-900 mb-2">System Status</h4>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span>Analytics Enabled:</span>
                    <span
                      className={
                        debugData?.featureFlags.FEATURE_ANALYTICS_ENABLED
                          ? "text-green-600"
                          : "text-red-600"
                      }
                    >
                      {debugData?.featureFlags.FEATURE_ANALYTICS_ENABLED ? "Yes" : "No"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Server Tracking:</span>
                    <span
                      className={
                        debugData?.featureFlags.FEATURE_SERVER_TRACKING
                          ? "text-green-600"
                          : "text-red-600"
                      }
                    >
                      {debugData?.featureFlags.FEATURE_SERVER_TRACKING ? "Yes" : "No"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Consent Banner:</span>
                    <span
                      className={
                        debugData?.featureFlags.FEATURE_CONSENT_BANNER
                          ? "text-green-600"
                          : "text-red-600"
                      }
                    >
                      {debugData?.featureFlags.FEATURE_CONSENT_BANNER ? "Yes" : "No"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Consent Status */}
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Consent Status</h4>
                {consent ? (
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span>Analytics:</span>
                      <span className={consent.analytics ? "text-green-600" : "text-red-600"}>
                        {consent.analytics ? "Granted" : "Denied"}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Marketing:</span>
                      <span className={consent.marketing ? "text-green-600" : "text-red-600"}>
                        {consent.marketing ? "Granted" : "Denied"}
                      </span>
                    </div>
                    <div className="text-xs text-gray-600">
                      Version: {consent.version} | {new Date(consent.timestamp).toLocaleString()}
                    </div>
                  </div>
                ) : (
                  <div className="text-sm text-gray-600">No consent recorded</div>
                )}
              </div>

              {/* Platform Status */}
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Platform Status</h4>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span>GA4:</span>
                    <span
                      className={
                        debugData?.platformStatus.ga4?.configured &&
                        debugData?.platformStatus.ga4?.enabled
                          ? "text-green-600"
                          : "text-yellow-600"
                      }
                    >
                      {debugData?.platformStatus.ga4?.configured &&
                      debugData?.platformStatus.ga4?.enabled
                        ? "Ready"
                        : "Disabled/Misconfigured"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Facebook:</span>
                    <span
                      className={
                        debugData?.platformStatus.facebook?.configured &&
                        debugData?.platformStatus.facebook?.enabled
                          ? "text-green-600"
                          : "text-yellow-600"
                      }
                    >
                      {debugData?.platformStatus.facebook?.configured &&
                      debugData?.platformStatus.facebook?.enabled
                        ? "Ready"
                        : "Disabled/Misconfigured"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Google Ads:</span>
                    <span
                      className={
                        debugData?.platformStatus.google_ads?.configured &&
                        debugData?.platformStatus.google_ads?.enabled
                          ? "text-green-600"
                          : "text-yellow-600"
                      }
                    >
                      {debugData?.platformStatus.google_ads?.configured &&
                      debugData?.platformStatus.google_ads?.enabled
                        ? "Ready"
                        : "Disabled/Misconfigured"}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Test Actions */}
            <div className="border-t border-gray-200 p-4">
              <h4 className="font-medium text-gray-900 mb-3">Test Actions</h4>
              <div className="space-y-2">
                <button
                  onClick={testPageView}
                  disabled={loading}
                  className="w-full px-3 py-2 text-sm bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50 transition-colors"
                >
                  Test Page View
                </button>
                <button
                  onClick={testConversion}
                  disabled={loading}
                  className="w-full px-3 py-2 text-sm bg-green-500 text-white rounded hover:bg-green-600 disabled:opacity-50 transition-colors"
                >
                  Test Conversion
                </button>
                <button
                  onClick={validateConfig}
                  disabled={loading}
                  className="w-full px-3 py-2 text-sm bg-purple-500 text-white rounded hover:bg-purple-600 disabled:opacity-50 transition-colors"
                >
                  Validate Config
                </button>
                <button
                  onClick={loadDebugData}
                  disabled={loading}
                  className="w-full px-3 py-2 text-sm bg-gray-500 text-white rounded hover:bg-gray-600 disabled:opacity-50 transition-colors"
                >
                  Refresh Data
                </button>
              </div>
            </div>

            {/* Test Results */}
            {testResults.length > 0 && (
              <div className="border-t border-gray-200 p-4">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-medium text-gray-900">Recent Tests</h4>
                  <button
                    onClick={clearResults}
                    className="text-xs text-gray-500 hover:text-gray-700"
                  >
                    Clear
                  </button>
                </div>
                <div className="space-y-2 max-h-40 overflow-y-auto">
                  {testResults.map((result, index) => (
                    <div
                      key={index}
                      className={`p-2 rounded text-xs ${
                        result.success ? "bg-green-50 text-green-800" : "bg-red-50 text-red-800"
                      }`}
                    >
                      <div className="font-medium">
                        {result.test || "Test"} - {result.success ? "Success" : "Failed"}
                      </div>
                      {result.error && <div className="mt-1 text-xs">{result.error}</div>}
                      {result.result?.platforms && (
                        <div className="mt-1 space-y-1">
                          {Object.entries(result.result.platforms).map(
                            ([platform, status]: [string, { success: boolean }]) => (
                              <div key={platform} className="flex justify-between">
                                <span>{platform}:</span>
                                <span>{status.success ? "✓" : "✗"}</span>
                              </div>
                            )
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Loading State */}
            {loading && (
              <div className="border-t border-gray-200 p-4 text-center">
                <div className="inline-block animate-spin rounded-full h-4 w-4 border-b-2 border-purple-600"></div>
                <span className="ml-2 text-sm text-gray-600">Loading...</span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// Utility component for displaying current analytics state
export function AnalyticsStatus() {
  const { consent } = useConsent();

  if (process.env.NODE_ENV !== "development") {
    return null;
  }

  return (
    <div className="fixed top-4 right-4 bg-black bg-opacity-75 text-white text-xs p-2 rounded z-40">
      Analytics:{" "}
      {consent
        ? `A:${consent.analytics ? "✓" : "✗"} M:${consent.marketing ? "✓" : "✗"}`
        : "No consent"}
    </div>
  );
}
