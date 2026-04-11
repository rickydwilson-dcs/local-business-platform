import { createContactInfo } from "@platform/core-components/lib/contact-info";
import { siteConfig } from "@/site.config";

export const {
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
} = createContactInfo(siteConfig.business);
