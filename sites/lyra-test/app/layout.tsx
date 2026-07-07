import type { Metadata, Viewport } from 'next';
import './globals.css';
import { siteConfig } from '@/site.config';

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
  userScalable: true,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-GB" className="dark">
      <head>
        {/* Lyra theme fonts — Public Sans (headings) + IBM Plex Sans (body), matching the Stitch source */}
        <link
          href="https://fonts.googleapis.com/css2?family=Public+Sans:wght@400;700;800;900&family=IBM+Plex+Sans:ital,wght@0,300;0,400;0,500;0,600;1,400&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen flex flex-col bg-surface-background text-surface-foreground font-sans">
        {children}
      </body>
    </html>
  );
}
