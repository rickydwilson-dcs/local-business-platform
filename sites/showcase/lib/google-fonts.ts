export interface GoogleFont {
  family: string;
  category: 'sans-serif' | 'serif' | 'display' | 'monospace';
}

export const GOOGLE_FONTS: GoogleFont[] = [
  // Sans-serif
  { family: 'Inter', category: 'sans-serif' },
  { family: 'Roboto', category: 'sans-serif' },
  { family: 'Open Sans', category: 'sans-serif' },
  { family: 'Lato', category: 'sans-serif' },
  { family: 'Poppins', category: 'sans-serif' },
  { family: 'Montserrat', category: 'sans-serif' },
  { family: 'Nunito', category: 'sans-serif' },
  { family: 'Raleway', category: 'sans-serif' },
  { family: 'Work Sans', category: 'sans-serif' },
  { family: 'DM Sans', category: 'sans-serif' },
  { family: 'Plus Jakarta Sans', category: 'sans-serif' },
  { family: 'Manrope', category: 'sans-serif' },
  { family: 'Outfit', category: 'sans-serif' },
  { family: 'Space Grotesk', category: 'sans-serif' },
  // Serif
  { family: 'Playfair Display', category: 'serif' },
  { family: 'Merriweather', category: 'serif' },
  { family: 'Lora', category: 'serif' },
  { family: 'PT Serif', category: 'serif' },
  { family: 'Libre Baskerville', category: 'serif' },
  { family: 'Source Serif 4', category: 'serif' },
  { family: 'Crimson Text', category: 'serif' },
  // Display
  { family: 'Oswald', category: 'display' },
  { family: 'Bebas Neue', category: 'display' },
  { family: 'Anton', category: 'display' },
  { family: 'Archivo Black', category: 'display' },
  { family: 'Righteous', category: 'display' },
  // Monospace
  { family: 'JetBrains Mono', category: 'monospace' },
  { family: 'Fira Code', category: 'monospace' },
  { family: 'Source Code Pro', category: 'monospace' },
];

const FONT_CATEGORIES = ['sans-serif', 'serif', 'display', 'monospace'] as const;

export function getFontsByCategory(category: GoogleFont['category']): GoogleFont[] {
  return GOOGLE_FONTS.filter(f => f.category === category);
}

export function getCategories(): typeof FONT_CATEGORIES {
  return FONT_CATEGORIES;
}

export function getGoogleFontUrl(family: string): string {
  return `https://fonts.googleapis.com/css2?family=${family.replace(/ /g, '+')}:wght@400;600;700&display=swap`;
}

export function getPreviewUrl(): string {
  const families = GOOGLE_FONTS.map(f => `family=${f.family.replace(/ /g, '+')}`).join('&');
  return `https://fonts.googleapis.com/css2?${families}&display=swap`;
}

export function loadGoogleFont(family: string): void {
  const href = getGoogleFontUrl(family);
  if (document.querySelector(`link[href="${href}"]`)) return;
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = href;
  document.head.appendChild(link);
}

export function preloadAllFonts(): void {
  const href = getPreviewUrl();
  if (document.querySelector(`link[href="${href}"]`)) return;
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = href;
  document.head.appendChild(link);
}
