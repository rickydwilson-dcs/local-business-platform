import { SiteHeader as CoreSiteHeader } from "@platform/core-components";
import type { SiteHeaderProps as CoreSiteHeaderProps } from "@platform/core-components";

export interface SiteHeaderProps {
  siteName: string;
  phoneDisplay?: string;
  phoneTel?: string;
  showPhone?: boolean;
  primaryCta: { label: string; href: string };
  navigation: Array<{ label: string; href: string; hasDropdown?: boolean }>;
  locations: Array<{ name: string; slug: string }>;
  counties?: CoreSiteHeaderProps["counties"];
  maxTownsPerCounty?: number;
}

export function SiteHeader(props: SiteHeaderProps) {
  const { counties, maxTownsPerCounty, ...headerProps } = props;
  return (
    <CoreSiteHeader
      appearance="dark"
      counties={counties}
      maxTownsPerCounty={maxTownsPerCounty}
      {...headerProps}
    />
  );
}
