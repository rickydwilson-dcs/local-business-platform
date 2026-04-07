import { SiteHeader } from '@platform/core-components';

export interface CygnusHeaderProps {
  siteName: string;
  phoneDisplay?: string;
  phoneTel?: string;
  showPhone?: boolean;
  primaryCta: { label: string; href: string };
  navigation: Array<{ label: string; href: string; hasDropdown?: boolean }>;
  locations: Array<{ name: string; slug: string }>;
}

export function CygnusHeader(props: CygnusHeaderProps) {
  return <SiteHeader appearance="dark" {...props} />;
}
