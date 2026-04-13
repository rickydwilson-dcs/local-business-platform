/**
 * BlogCardGrid
 *
 * Blog post card grid
 * Category: Blog
 * Note: Placeholder — regenerate with --pass translate when API key is available.
 */

export interface BlogCardGridProps {
  [key: string]: unknown;
}

export function BlogCardGrid(props: BlogCardGridProps) {
  void props;
  return (
    <section className="py-16 px-4">
      <div className="max-w-7xl mx-auto text-center">
        <p className="text-surface-foreground text-sm uppercase tracking-wider">Blog</p>
        <h2 className="text-surface-foreground text-2xl font-bold mt-2">Blog post card grid</h2>
      </div>
    </section>
  );
}
