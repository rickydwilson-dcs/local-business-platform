import { SiteHeader as CoreSiteHeader } from '@platform/core-components';

export interface SiteHeaderProps {
  siteName: string;
  phoneDisplay?: string;
  phoneTel?: string;
  showPhone?: boolean;
  primaryCta: { label: string; href: string };
  navigation: Array<{ label: string; href: string; hasDropdown?: boolean }>;
  locations: Array<{ name: string; slug: string }>;
  logoWidth?: number;
  logoHeight?: number;
}

export function SiteHeader(props: SiteHeaderProps) {
  return <CoreSiteHeader appearance="light" sticky={false} {...props} />;
}
