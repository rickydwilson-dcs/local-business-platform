/**
 * Contact info stub for showcase — satisfies @/lib/contact-info imports from core components.
 */

export const BUSINESS_NAME = 'Showcase Business';
export const BUSINESS_LEGAL_NAME = 'Showcase Business Ltd';
export const BUSINESS_EMAIL = 'hello@example.com';

export const ADDRESS = {
  street: '123 Example Street',
  locality: 'London',
  region: 'Greater London',
  postalCode: 'SW1A 1AA',
  country: 'GB',
} as const;

export function formatPhoneDisplay(): string { return '020 1234 5678'; }
export function formatPhoneTel(): string { return 'tel:+442012345678'; }
export function formatPhoneSchema(): string { return '+442012345678'; }

export const PHONE_DISPLAY = '020 1234 5678';
export const PHONE_TEL = 'tel:+442012345678';
export const PHONE_SCHEMA = '+442012345678';

export function formatAddressSingleLine(): string { return '123 Example Street, London SW1A 1AA'; }
export function formatAddressLines(): string[] { return ['123 Example Street', 'London', 'SW1A 1AA']; }
