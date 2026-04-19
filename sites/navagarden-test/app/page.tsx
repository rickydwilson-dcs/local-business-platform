import type { Metadata } from 'next';
import { HomePage } from '@platform/themes/navagarden/pages';
import { siteConfig } from '@/site.config';

export const metadata: Metadata = {
  title: siteConfig.name,
  description: siteConfig.tagline,
};

export default function Page() {
  return <HomePage />;
}
