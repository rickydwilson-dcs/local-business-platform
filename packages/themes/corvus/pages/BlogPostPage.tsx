interface BlogPostPageProps {
  [key: string]: unknown;
}

export function CorvusBlogPostPage(props: BlogPostPageProps) {
  void props;
  return (
    <main className="section container-standard">
      <p className="text-surface-foreground">
        Corvus blog post page — awaiting generation by extract-theme --pass translate.
      </p>
    </main>
  );
}
