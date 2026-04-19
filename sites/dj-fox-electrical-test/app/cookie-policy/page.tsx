import type { Metadata } from "next";
import compositionConfig from "../../composition.json";
import { SiteCompositionConfigSchema, renderComposedPage } from "@platform/component-composition";
import { siteData } from "@/lib/page-data";

const config = SiteCompositionConfigSchema.parse(compositionConfig);

export const metadata: Metadata = {
  title: "Cookie Policy | D J Fox Electrical",
  description:
    "Cookie policy for D J Fox Electrical. Learn about the cookies we use and how to manage your preferences.",
};

export default function CookiePolicyPage() {
  const { elements } = renderComposedPage({
    composition: config,
    pageType: "cookie",
    data: siteData as unknown as Record<string, unknown>,
  });
  return <main className="min-h-screen">{elements}</main>;
}
