/**
 * Contact Information - Type Stub for core-components type-checking
 *
 * This file provides type-compatible exports so components that import
 * from "@/lib/contact-info" can pass type-checking within core-components.
 *
 * At runtime, each site's own contact-info.ts is used instead (resolved
 * via the site's @/ path alias). This file is never executed in production.
 */

export const BUSINESS_NAME = "";
export const BUSINESS_LEGAL_NAME = "";
export const BUSINESS_EMAIL = "";

export const ADDRESS = {
  street: "",
  locality: "",
  region: "",
  postalCode: "",
  country: "",
} as const;

export function formatPhoneDisplay(): string {
  return "";
}

export function formatPhoneTel(): string {
  return "";
}

export function formatPhoneSchema(): string {
  return "";
}

export const PHONE_DISPLAY = "";
export const PHONE_TEL = "";
export const PHONE_SCHEMA = "";

export function formatAddressSingleLine(): string {
  return "";
}

export function formatAddressLines(): string[] {
  return [];
}
