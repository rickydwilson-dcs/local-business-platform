import type { Metadata } from "next";
import "./globals.css";
import "./composition-overrides.css";

export const metadata: Metadata = {
  title: "PoC Composition Test",
  description: "Component Composition System proof-of-concept",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Work+Sans:wght@300;400;500;600&display=swap"
        />
      </head>
      <body className="min-h-screen bg-surface-background text-surface-foreground">{children}</body>
    </html>
  );
}
