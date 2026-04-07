import { SiteHeader } from '@platform/core-components';
import type { SiteHeaderProps } from '@platform/core-components';

export interface OrionHeaderProps {
  siteName: string;
  phoneDisplay?: string;
  phoneTel?: string;
  showPhone?: boolean;
  primaryCta: { label: string; href: string };
  navigation: Array<{ label: string; href: string; hasDropdown?: boolean }>;
  locations: Array<{ name: string; slug: string }>;
  counties?: SiteHeaderProps['counties'];
  maxTownsPerCounty?: number;
}

export function OrionHeader(props: OrionHeaderProps) {
  const { counties, maxTownsPerCounty, ...headerProps } = props;
  return (
    <SiteHeader
      appearance="dark"
      counties={counties}
      maxTownsPerCounty={maxTownsPerCounty}
      {...headerProps}
    />
  );
}
