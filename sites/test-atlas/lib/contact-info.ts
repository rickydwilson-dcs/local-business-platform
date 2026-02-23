/**
 * Contact Information - Single Source of Truth
 *
 * This file provides consistent NAP (Name, Address, Phone) data across the site.
 * All components should import from here rather than hardcoding contact details.
 */

import { siteConfig } from '@/site.config';

// ============================================================================
// Core Contact Data (from site.config.ts)
// ============================================================================

export const BUSINESS_NAME = siteConfig.business.name;
export const BUSINESS_LEGAL_NAME = siteConfig.business.legalName;
export const BUSINESS_EMAIL = siteConfig.business.email;

// Phone number (raw from config)
const PHONE_RAW = siteConfig.business.phone;

// Address components
export const ADDRESS = {
  street: siteConfig.business.address.street,
  locality: siteConfig.business.address.city,
  region: siteConfig.business.address.region,
  postalCode: siteConfig.business.address.postalCode,
  country: siteConfig.business.address.country,
} as const;

// ============================================================================
// Phone Number Formatters
// ============================================================================

/**
 * Format phone for display to users (UK format with spaces)
 * @example "01234 567 890"
 */
export function formatPhoneDisplay(): string {
  // Remove non-digit characters and +44 prefix
  const digits = PHONE_RAW.replace(/\D/g, '').replace(/^44/, '0');

  // Format as UK number with spaces
  if (digits.length === 11) {
    return `${digits.slice(0, 5)} ${digits.slice(5, 8)} ${digits.slice(8)}`;
  }

  // Return cleaned number if format doesn't match expected UK pattern
  return digits;
}

/**
 * Format phone for tel: links (digits only, no spaces)
 * @example "01234567890"
 */
export function formatPhoneTel(): string {
  // Remove non-digit characters and +44 prefix
  return PHONE_RAW.replace(/\D/g, '').replace(/^44/, '0');
}

/**
 * Format phone for Schema.org markup (international E.164 format)
 * @example "+441234567890"
 */
export function formatPhoneSchema(): string {
  const digits = PHONE_RAW.replace(/\D/g, '');

  // If already starts with 44, add +
  if (digits.startsWith('44')) {
    return `+${digits}`;
  }

  // If starts with 0, convert to international format
  if (digits.startsWith('0')) {
    return `+44${digits.slice(1)}`;
  }

  // Return as-is if format is unclear
  return PHONE_RAW;
}

// ============================================================================
// Pre-formatted Constants (for convenience)
// ============================================================================

/** Phone for display: "01234 567 890" */
export const PHONE_DISPLAY = formatPhoneDisplay();

/** Phone for tel: links: "01234567890" */
export const PHONE_TEL = formatPhoneTel();

/** Phone for schema: "+441234567890" */
export const PHONE_SCHEMA = formatPhoneSchema();

// ============================================================================
// Address Formatters
// ============================================================================

/**
 * Format full address as single line
 * @example "123 Main Street, City Name, County/Region, AB12 3CD"
 */
export function formatAddressSingleLine(): string {
  return `${ADDRESS.street}, ${ADDRESS.locality}, ${ADDRESS.region}, ${ADDRESS.postalCode}`;
}

/**
 * Format address as multi-line array
 * @example ["123 Main Street", "City Name, County/Region", "AB12 3CD"]
 */
export function formatAddressLines(): string[] {
  return [ADDRESS.street, `${ADDRESS.locality}, ${ADDRESS.region}`, ADDRESS.postalCode];
}

// ============================================================================
// Business Hours Helper
// ============================================================================

/**
 * Get business hours as formatted object
 */
export function getBusinessHours() {
  return siteConfig.business.hours;
}

/**
 * Check if business is currently open (basic implementation)
 */
export function isBusinessOpen(): boolean {
  const now = new Date();
  const day = now
    .toLocaleDateString('en-US', { weekday: 'long' })
    .toLowerCase() as keyof typeof siteConfig.business.hours;
  const hours = siteConfig.business.hours[day];

  return hours !== 'Closed' && hours.toLowerCase() !== 'closed';
}
