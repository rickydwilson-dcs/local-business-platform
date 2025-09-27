/**
 * Analytics Debug API Route
 * Provides debug information and testing capabilities for analytics system
 */

import { NextRequest, NextResponse } from 'next/server';
import { DebugPanelData, FeatureFlags } from '@/lib/analytics/types';

// Get feature flags from environment
function getFeatureFlags(): FeatureFlags {
  return {
    FEATURE_ANALYTICS_ENABLED: process.env.FEATURE_ANALYTICS_ENABLED === 'true',
    FEATURE_CONSENT_BANNER: process.env.FEATURE_CONSENT_BANNER === 'true',
    FEATURE_GA4_ENABLED: process.env.FEATURE_GA4_ENABLED === 'true',
    FEATURE_SERVER_TRACKING: process.env.FEATURE_SERVER_TRACKING === 'true',
    FEATURE_FACEBOOK_PIXEL: process.env.FEATURE_FACEBOOK_PIXEL === 'true',
    FEATURE_GOOGLE_ADS: process.env.FEATURE_GOOGLE_ADS === 'true',
  };
}

// Check platform configurations
function checkPlatformConfigurations() {
  return {
    ga4: {
      configured: Boolean(
        process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID &&
        process.env.GA4_API_SECRET &&
        process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID.startsWith('G-')
      ),
      enabled: process.env.FEATURE_GA4_ENABLED === 'true',
      config: {
        measurement_id: process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID ? '***configured***' : 'missing',
        api_secret: process.env.GA4_API_SECRET ? '***configured***' : 'missing',
      },
    },
    facebook: {
      configured: Boolean(
        process.env.FACEBOOK_PIXEL_ID &&
        process.env.FACEBOOK_ACCESS_TOKEN
      ),
      enabled: process.env.FEATURE_FACEBOOK_PIXEL === 'true',
      config: {
        pixel_id: process.env.FACEBOOK_PIXEL_ID ? '***configured***' : 'missing',
        access_token: process.env.FACEBOOK_ACCESS_TOKEN ? '***configured***' : 'missing',
        test_event_code: process.env.FACEBOOK_TEST_EVENT_CODE ? '***configured***' : 'not set',
      },
    },
    google_ads: {
      configured: Boolean(
        process.env.GOOGLE_ADS_CUSTOMER_ID &&
        process.env.GOOGLE_ADS_CONVERSION_ACTION_ID
      ),
      enabled: process.env.FEATURE_GOOGLE_ADS === 'true',
      config: {
        customer_id: process.env.GOOGLE_ADS_CUSTOMER_ID ? '***configured***' : 'missing',
        conversion_action_id: process.env.GOOGLE_ADS_CONVERSION_ACTION_ID ? '***configured***' : 'missing',
        access_token: process.env.GOOGLE_ADS_ACCESS_TOKEN ? '***configured***' : 'not set',
        developer_token: process.env.GOOGLE_ADS_DEVELOPER_TOKEN ? '***configured***' : 'not set',
      },
    },
  };
}

// Parse consent from cookie
function parseConsent(cookieValue?: string) {
  if (!cookieValue) return null;

  try {
    return JSON.parse(decodeURIComponent(cookieValue));
  } catch {
    return null;
  }
}

export async function GET(request: NextRequest) {
  // Only allow debug endpoint in development
  if (process.env.NODE_ENV !== 'development') {
    return NextResponse.json(
      { error: 'Debug endpoint only available in development' },
      { status: 404 }
    );
  }

  try {
    const flags = getFeatureFlags();
    const platformStatus = checkPlatformConfigurations();

    // Parse consent from cookies if available
    const consentCookie = request.cookies.get('analytics_consent')?.value;
    const consentState = parseConsent(consentCookie);

    const debugData: DebugPanelData = {
      featureFlags: flags,
      consentState,
      recentEvents: [], // Would be populated from a logging system in production
      platformStatus,
    };

    return NextResponse.json({
      status: 'Analytics Debug Information',
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV,
      data: debugData,
      recommendations: generateRecommendations(flags, platformStatus, consentState),
    });
  } catch (error) {
    console.error('Debug API error:', error);

    return NextResponse.json(
      {
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  // Only allow debug endpoint in development
  if (process.env.NODE_ENV !== 'development') {
    return NextResponse.json(
      { error: 'Debug endpoint only available in development' },
      { status: 404 }
    );
  }

  try {
    const { action, ...testData } = await request.json();

    switch (action) {
      case 'test_page_view':
        return await testPageViewTracking(testData);

      case 'test_conversion':
        return await testConversionTracking(testData);

      case 'validate_config':
        return await validateAllConfigurations();

      default:
        return NextResponse.json(
          { error: 'Invalid action. Available actions: test_page_view, test_conversion, validate_config' },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error('Debug API POST error:', error);

    return NextResponse.json(
      {
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

// Test page view tracking
async function testPageViewTracking(testData: any) {
  const testPayload = {
    event: 'page_view',
    page_location: testData.page_location || 'https://example.com/test',
    page_title: testData.page_title || 'Test Page View',
    client_id: testData.client_id || `test.${Date.now()}`,
    user_agent: 'Analytics Debug Tool',
    consent_state: {
      analytics: true,
      marketing: true,
      functional: true,
      timestamp: Date.now(),
      version: '1.0',
    },
    timestamp: Date.now(),
  };

  try {
    const response = await fetch(new URL('/api/analytics/track', testData.base_url || 'http://localhost:3001'), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testPayload),
    });

    const result = await response.json();

    return NextResponse.json({
      test: 'page_view_tracking',
      payload: testPayload,
      result,
      success: result.success,
    });
  } catch (error) {
    return NextResponse.json({
      test: 'page_view_tracking',
      payload: testPayload,
      error: error instanceof Error ? error.message : 'Test failed',
      success: false,
    });
  }
}

// Test conversion tracking
async function testConversionTracking(testData: any) {
  const testPayload = {
    event: 'quote_request',
    conversion_action: 'quote_request',
    value: 100,
    currency: 'GBP',
    parameters: {
      service_type: 'residential_scaffolding',
      location: 'brighton',
    },
    page_location: testData.page_location || 'https://example.com/test-conversion',
    client_id: testData.client_id || `test.${Date.now()}`,
    user_agent: 'Analytics Debug Tool',
    consent_state: {
      analytics: true,
      marketing: true,
      functional: true,
      timestamp: Date.now(),
      version: '1.0',
    },
    timestamp: Date.now(),
  };

  try {
    const response = await fetch(new URL('/api/analytics/track', testData.base_url || 'http://localhost:3001'), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testPayload),
    });

    const result = await response.json();

    return NextResponse.json({
      test: 'conversion_tracking',
      payload: testPayload,
      result,
      success: result.success,
    });
  } catch (error) {
    return NextResponse.json({
      test: 'conversion_tracking',
      payload: testPayload,
      error: error instanceof Error ? error.message : 'Test failed',
      success: false,
    });
  }
}

// Validate all configurations
async function validateAllConfigurations() {
  const flags = getFeatureFlags();
  const platforms = checkPlatformConfigurations();

  const validationResults = {
    overall_status: 'unknown',
    feature_flags: flags,
    platform_validation: platforms,
    issues: [] as string[],
    recommendations: [] as string[],
  };

  // Check for common configuration issues
  if (!flags.FEATURE_ANALYTICS_ENABLED) {
    validationResults.issues.push('Analytics is completely disabled');
  }

  if (flags.FEATURE_GA4_ENABLED && !platforms.ga4.configured) {
    validationResults.issues.push('GA4 is enabled but not properly configured');
    validationResults.recommendations.push('Set NEXT_PUBLIC_GA_MEASUREMENT_ID and GA4_API_SECRET');
  }

  if (flags.FEATURE_FACEBOOK_PIXEL && !platforms.facebook.configured) {
    validationResults.issues.push('Facebook Pixel is enabled but not properly configured');
    validationResults.recommendations.push('Set FACEBOOK_PIXEL_ID and FACEBOOK_ACCESS_TOKEN');
  }

  if (flags.FEATURE_GOOGLE_ADS && !platforms.google_ads.configured) {
    validationResults.issues.push('Google Ads is enabled but not properly configured');
    validationResults.recommendations.push('Set GOOGLE_ADS_CUSTOMER_ID and GOOGLE_ADS_CONVERSION_ACTION_ID');
  }

  // Determine overall status
  if (validationResults.issues.length === 0) {
    validationResults.overall_status = 'healthy';
  } else if (validationResults.issues.length <= 2) {
    validationResults.overall_status = 'warning';
  } else {
    validationResults.overall_status = 'error';
  }

  return NextResponse.json(validationResults);
}

// Generate recommendations based on current state
function generateRecommendations(
  flags: FeatureFlags,
  platformStatus: any,
  consentState: any
): string[] {
  const recommendations: string[] = [];

  if (!flags.FEATURE_ANALYTICS_ENABLED) {
    recommendations.push('Set FEATURE_ANALYTICS_ENABLED=true to enable analytics system');
  }

  if (!flags.FEATURE_CONSENT_BANNER) {
    recommendations.push('Set FEATURE_CONSENT_BANNER=true to show consent banner');
  }

  if (flags.FEATURE_GA4_ENABLED && !platformStatus.ga4.configured) {
    recommendations.push('Configure GA4_API_SECRET for server-side tracking');
  }

  if (flags.FEATURE_FACEBOOK_PIXEL && !platformStatus.facebook.configured) {
    recommendations.push('Configure FACEBOOK_ACCESS_TOKEN for Conversions API');
  }

  if (!consentState) {
    recommendations.push('No consent state found - users may not have seen consent banner');
  }

  if (Object.values(flags).every(flag => !flag)) {
    recommendations.push('All analytics features are disabled - consider enabling at least FEATURE_ANALYTICS_ENABLED');
  }

  return recommendations;
}