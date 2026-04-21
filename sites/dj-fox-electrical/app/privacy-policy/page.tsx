import type { Metadata } from "next";
import compositionConfig from "../../composition.json";
import { SiteCompositionConfigSchema, renderComposedPage } from "@platform/component-composition";
import { siteData } from "@/lib/page-data";

const config = SiteCompositionConfigSchema.parse(compositionConfig);

export const metadata: Metadata = {
  title: "Privacy Policy | D J Fox Electrical",
  description:
    "Privacy policy for D J Fox Electrical. Learn how we collect, use, and protect your personal information.",
};

export default function PrivacyPolicyPage() {
  const { elements } = renderComposedPage({
    composition: config,
    pageType: "privacy",
    data: siteData as unknown as Record<string, unknown>,
  });
  return <main className="min-h-screen">{elements}</main>;
}
