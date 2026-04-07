import { SiteHeader } from '@platform/core-components';

export interface VegaHeaderProps {
  siteName: string;
  phoneDisplay?: string;
  phoneTel?: string;
  showPhone?: boolean;
  primaryCta: { label: string; href: string };
  navigation: Array<{ label: string; href: string; hasDropdown?: boolean }>;
  locations: Array<{ name: string; slug: string }>;
}

export function VegaHeader(props: VegaHeaderProps) {
  return <SiteHeader appearance="light" sticky={false} {...props} />;
}
