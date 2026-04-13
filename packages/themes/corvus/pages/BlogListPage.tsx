import type React from "react";

interface BlogListPageProps {
  content?: Record<string, string>;
}

export function CorvusBlogListPage({ content = {} }: BlogListPageProps) {
  void content;
  return (
    <main className="page-blog-list">
      {/* corvus blog-list layout — extracted from reference clone */}
    </main>
  );
}
