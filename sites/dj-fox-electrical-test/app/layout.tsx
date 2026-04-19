import React from "react";
import type { Metadata, Viewport } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";
import compositionConfig from "../composition.json";
import {
  SiteCompositionConfigSchema,
  renderComposedLayout,
  registerLayoutComponent,
} from "@platform/component-composition";
import { OrionHeader } from "@platform/themes/orion/components";
import { OrionFooter } from "@platform/themes/orion/components";
import { siteData } from "@/lib/page-data";
import { siteConfig } from "@/site.config";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  display: "swap",
  weight: ["400", "500", "600", "700", "800"],
});

// Register layout components for this site
registerLayoutComponent("OrionHeader", {
  component: OrionHeader as unknown as React.ComponentType<Record<string, unknown>>,
});
registerLayoutComponent("OrionFooter", {
  component: OrionFooter as unknown as React.ComponentType<Record<string, unknown>>,
});

const config = SiteCompositionConfigSchema.parse(compositionConfig);

export const metadata: Metadata = {
  title: {
    default: siteConfig.name,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.tagline,
  metadataBase: new URL(siteConfig.url),
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const { headerElement, footerElement } = renderComposedLayout({
    composition: config,
    data: siteData as unknown as Record<string, unknown>,
  });
  return (
    <html lang="en-GB" className={outfit.variable}>
      <head>
        {siteConfig.business.geo && (
          <>
            <meta name="geo.region" content="GB" />
            <meta
              name="geo.position"
              content={`${siteConfig.business.geo.latitude};${siteConfig.business.geo.longitude}`}
            />
            <meta
              name="ICBM"
              content={`${siteConfig.business.geo.latitude}, ${siteConfig.business.geo.longitude}`}
            />
          </>
        )}
      </head>
      <body className="min-h-screen flex flex-col">
        {headerElement}
        <div className="flex-1">{children}</div>
        {footerElement}
      </body>
    </html>
  );
}
