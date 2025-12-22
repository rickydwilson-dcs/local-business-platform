import type { Metadata } from 'next';
import './globals.css';
import { siteConfig } from '@/site.config';

export const metadata: Metadata = {
  title: {
    default: siteConfig.name,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.tagline,
  metadataBase: new URL(siteConfig.url),
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        {/* Navigation will be added here */}
        <main>{children}</main>
        {/* Footer will be added here */}
      </body>
    </html>
  );
}
