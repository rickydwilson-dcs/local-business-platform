import { siteConfig } from '@/site.config';

/**
 * Generate absolute URL from relative path
 */
export function absUrl(path: string): string {
  const baseUrl = siteConfig.url.replace(/\/$/, '');
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  return `${baseUrl}${cleanPath}`;
}

/**
 * Format phone number for display
 */
export function formatPhone(phone: string): string {
  return phone.replace(/^\+44/, '0').replace(/(\d{4})(\d{3})(\d{3})/, '$1 $2 $3');
}

/**
 * Format phone number for tel: link
 */
export function telLink(phone: string): string {
  return `tel:${phone}`;
}

/**
 * Format email for mailto: link
 */
export function mailtoLink(email: string, subject?: string): string {
  const subjectParam = subject ? `?subject=${encodeURIComponent(subject)}` : '';
  return `mailto:${email}${subjectParam}`;
}

/**
 * Slugify string for URLs
 */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/--+/g, '-')
    .trim();
}
