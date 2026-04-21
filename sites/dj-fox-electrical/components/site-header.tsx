import { SiteHeader as CoreSiteHeader } from "@platform/core-components";
import type { SiteHeaderProps as CoreSiteHeaderProps } from "@platform/core-components";

export interface SiteHeaderProps {
  siteName: string;
  phoneDisplay?: string;
  phoneTel?: string;
  showPhone?: boolean;
  primaryCta: { label: string; href: string };
  navigation: CoreSiteHeaderProps["navigation"];
}

export function SiteHeader(props: SiteHeaderProps) {
  return <CoreSiteHeader appearance="dark" {...props} />;
}
