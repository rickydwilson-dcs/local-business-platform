import React from "react";
import type { Metadata } from "next";
import "./globals.css";
import compositionConfig from "../composition.json";
import {
  SiteCompositionConfigSchema,
  renderComposedLayout,
  registerLayoutComponent,
} from "@platform/component-composition";
import { DesignlabHeader } from "@/components/designlab-header";
import { DesignlabFooter } from "@/components/designlab-footer";
import { siteData } from "@/lib/page-data";

// Register layout components for this site.
// Names must match the "component" values in composition.json headerConfig/footerConfig.
registerLayoutComponent("DesignlabHeader", {
  component: DesignlabHeader as unknown as React.ComponentType<Record<string, unknown>>,
});
registerLayoutComponent("DesignlabFooter", {
  component: DesignlabFooter as unknown as React.ComponentType<Record<string, unknown>>,
});

const config = SiteCompositionConfigSchema.parse(compositionConfig);

export const metadata: Metadata = {
  title: "Designlab — Sign Makers Eastbourne",
  description: "Professional sign making and vehicle graphics in Eastbourne.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const { headerElement, footerElement } = renderComposedLayout({
    composition: config,
    data: siteData as Record<string, unknown>,
  });

  return (
    <html lang="en">
      <head>
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;700&display=swap"
        />
      </head>
      <body className="min-h-screen bg-surface-background text-surface-foreground flex flex-col">
        {headerElement}
        <div className="flex-1">{children}</div>
        {footerElement}
      </body>
    </html>
  );
}
