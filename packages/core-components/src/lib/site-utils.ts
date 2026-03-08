/**
 * Site utilities for URL generation and common formatters.
 * Use createSiteUtils(siteUrl) for URL-dependent functions.
 * Pure utilities (no config needed) are exported directly.
 */

// Factory for URL-dependent utilities
export function createSiteUtils(siteUrl: string) {
  function absUrl(path: string): string {
    const baseUrl = siteUrl.replace(/\/$/, '');
    const cleanPath = path.startsWith('/') ? path : `/${path}`;
    return `${baseUrl}${cleanPath}`;
  }
  return { absUrl };
}

// Pure utilities (no config needed)

export function formatPhone(phone: string): string {
  return phone.replace(/^\+44/, '0').replace(/(\d{4})(\d{3})(\d{3})/, '$1 $2 $3');
}

export function telLink(phone: string): string {
  return `tel:${phone}`;
}

export function mailtoLink(email: string, subject?: string): string {
  const subjectParam = subject ? `?subject=${encodeURIComponent(subject)}` : '';
  return `mailto:${email}${subjectParam}`;
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/--+/g, '-')
    .trim();
}
