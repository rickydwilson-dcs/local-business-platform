/**
 * Site utility stub for showcase — satisfies @/lib/site imports from core components.
 */

export function absUrl(path: string): string {
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  return `http://localhost:3002${cleanPath}`;
}

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
  return text.toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-').replace(/--+/g, '-').trim();
}
