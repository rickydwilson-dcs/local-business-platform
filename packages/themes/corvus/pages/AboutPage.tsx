import type React from "react";

interface AboutPageProps {
  content?: Record<string, string>;
}

export function CorvusAboutPage({ content = {} }: AboutPageProps) {
  void content;
  return (
    <main className="page-about">{/* corvus about layout — extracted from reference clone */}</main>
  );
}
