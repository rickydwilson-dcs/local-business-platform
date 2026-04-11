import { SiteHeader } from "@platform/core-components";
import type { SiteHeaderProps } from "@platform/core-components";

export type LyraHeaderProps = Omit<SiteHeaderProps, "appearance" | "sticky">;

export function LyraHeader(props: LyraHeaderProps) {
  return <SiteHeader appearance="light" sticky={true} {...props} />;
}
