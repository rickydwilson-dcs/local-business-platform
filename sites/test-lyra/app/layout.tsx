import type { Metadata, Viewport } from 'next';
import './globals.css';
import { siteConfig } from '@/site.config';
import { ThemeProvider } from '@platform/core-components';
import { lyraRegistry } from '@platform/themes/lyra';

export const metadata: Metadata = {
  title: {
    default: siteConfig.name,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.tagline,
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-GB">
      <body className="min-h-screen flex flex-col">
        <ThemeProvider theme="lyra" registry={lyraRegistry}>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
