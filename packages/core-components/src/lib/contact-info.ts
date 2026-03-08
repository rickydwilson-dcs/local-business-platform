/**
 * Contact information factory.
 * Each site creates a configured instance via createContactInfo(siteConfig.business).
 *
 * The stub exports below (BUSINESS_NAME, PHONE_DISPLAY, etc.) satisfy the
 * core-components standalone type-check where @/lib/contact-info resolves to
 * this file. At runtime each site's shim provides the real values.
 */

// Stub exports for core-components standalone type-check
export const BUSINESS_NAME = '';
export const BUSINESS_LEGAL_NAME = '';
export const BUSINESS_EMAIL = '';
export const ADDRESS = { street: '', locality: '', region: '', postalCode: '', country: '' } as const;
export function formatPhoneDisplay(): string { return ''; }
export function formatPhoneTel(): string { return ''; }
export function formatPhoneSchema(): string { return ''; }
export const PHONE_DISPLAY = '';
export const PHONE_TEL = '';
export const PHONE_SCHEMA = '';
export function formatAddressSingleLine(): string { return ''; }
export function formatAddressLines(): string[] { return []; }
export function getBusinessHours(): Record<string, string> { return {}; }
export function isBusinessOpen(): boolean { return false; }

export interface ContactInfoConfig {
  name: string;
  legalName: string;
  email: string;
  phone: string;
  address: {
    street: string;
    city: string;
    region: string;
    postalCode: string;
    country: string;
  };
  hours: Record<string, string>;
}

export function createContactInfo(config: ContactInfoConfig) {
  const BUSINESS_NAME = config.name;
  const BUSINESS_LEGAL_NAME = config.legalName;
  const BUSINESS_EMAIL = config.email;

  const ADDRESS = {
    street: config.address.street,
    locality: config.address.city,
    region: config.address.region,
    postalCode: config.address.postalCode,
    country: config.address.country,
  } as const;

  function formatPhoneDisplay(): string {
    const digits = config.phone.replace(/\D/g, '').replace(/^44/, '0');
    if (digits.length === 11) {
      return `${digits.slice(0, 5)} ${digits.slice(5, 8)} ${digits.slice(8)}`;
    }
    return digits;
  }

  function formatPhoneTel(): string {
    return config.phone.replace(/\D/g, '').replace(/^44/, '0');
  }

  function formatPhoneSchema(): string {
    const digits = config.phone.replace(/\D/g, '');
    if (digits.startsWith('44')) {
      return `+${digits}`;
    }
    if (digits.startsWith('0')) {
      return `+44${digits.slice(1)}`;
    }
    return config.phone;
  }

  const PHONE_DISPLAY = formatPhoneDisplay();
  const PHONE_TEL = formatPhoneTel();
  const PHONE_SCHEMA = formatPhoneSchema();

  function formatAddressSingleLine(): string {
    return `${ADDRESS.street}, ${ADDRESS.locality}, ${ADDRESS.region}, ${ADDRESS.postalCode}`;
  }

  function formatAddressLines(): string[] {
    return [ADDRESS.street, `${ADDRESS.locality}, ${ADDRESS.region}`, ADDRESS.postalCode];
  }

  function getBusinessHours() {
    return config.hours;
  }

  function isBusinessOpen(): boolean {
    const now = new Date();
    const day = now.toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase();
    const hours = config.hours[day];
    return Boolean(hours) && hours !== 'Closed' && hours.toLowerCase() !== 'closed';
  }

  return {
    BUSINESS_NAME,
    BUSINESS_LEGAL_NAME,
    BUSINESS_EMAIL,
    ADDRESS,
    formatPhoneDisplay,
    formatPhoneTel,
    formatPhoneSchema,
    PHONE_DISPLAY,
    PHONE_TEL,
    PHONE_SCHEMA,
    formatAddressSingleLine,
    formatAddressLines,
    getBusinessHours,
    isBusinessOpen,
  };
}
