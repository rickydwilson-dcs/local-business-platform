/**
 * Contact Information - Single Source of Truth
 *
 * This file provides consistent NAP (Name, Address, Phone) data across the site.
 * All components should import from here rather than hardcoding contact details.
 */

import { colossusBusinessConfig } from "./business-config";

// ============================================================================
// Core Contact Data (from business-config.ts)
// ============================================================================

export const BUSINESS_NAME = colossusBusinessConfig.name;
export const BUSINESS_LEGAL_NAME = colossusBusinessConfig.legalName;
export const BUSINESS_EMAIL = colossusBusinessConfig.email;

// Phone number in international format (canonical)
const PHONE_INTERNATIONAL = colossusBusinessConfig.telephone; // "+441424466661"

// Address components
export const ADDRESS = {
  street: colossusBusinessConfig.address.streetAddress,
  locality: colossusBusinessConfig.address.addressLocality,
  region: colossusBusinessConfig.address.addressRegion,
  postalCode: colossusBusinessConfig.address.postalCode,
  country: colossusBusinessConfig.address.addressCountry,
} as const;

// ============================================================================
// Phone Number Formatters
// ============================================================================

/**
 * Format phone for display to users (UK format with spaces)
 * @example "01424 466 661"
 */
export function formatPhoneDisplay(): string {
  // Convert +441424466661 to 01424 466 661
  const national = PHONE_INTERNATIONAL.replace("+44", "0");
  return `${national.slice(0, 5)} ${national.slice(5, 8)} ${national.slice(8)}`;
}

/**
 * Format phone for tel: links (digits only, no spaces)
 * @example "01424466661"
 */
export function formatPhoneTel(): string {
  // Convert +441424466661 to 01424466661
  return PHONE_INTERNATIONAL.replace("+44", "0");
}

/**
 * Format phone for Schema.org markup (international E.164 format)
 * @example "+441424466661"
 */
export function formatPhoneSchema(): string {
  return PHONE_INTERNATIONAL;
}

// ============================================================================
// Pre-formatted Constants (for convenience)
// ============================================================================

/** Phone for display: "01424 466 661" */
export const PHONE_DISPLAY = formatPhoneDisplay();

/** Phone for tel: links: "01424466661" */
export const PHONE_TEL = formatPhoneTel();

/** Phone for schema: "+441424466661" */
export const PHONE_SCHEMA = formatPhoneSchema();

// ============================================================================
// Address Formatters
// ============================================================================

/**
 * Format full address as single line
 * @example "Office 7, 15-20 Gresley Road, St Leonards On Sea, East Sussex, TN38 9PL"
 */
export function formatAddressSingleLine(): string {
  return `${ADDRESS.street}, ${ADDRESS.locality}, ${ADDRESS.region}, ${ADDRESS.postalCode}`;
}

/**
 * Format address as multi-line array
 * @example ["Office 7, 15-20 Gresley Road", "St Leonards On Sea, East Sussex", "TN38 9PL"]
 */
export function formatAddressLines(): string[] {
  return [ADDRESS.street, `${ADDRESS.locality}, ${ADDRESS.region}`, ADDRESS.postalCode];
}
