interface CustomPageProps {
  content?: Record<string, string>;
  items?: Array<{ slug: string; title: string; description?: string }>;
}

export function CorvusCustomPage({ content = {}, items = [] }: CustomPageProps) {
  return (
    <main className="page-custom">
      {/* corvus custom layout — extracted from reference clone */}
      {items.map((item: { slug: string; title: string; description?: string }) => (
        <div key={item.slug}>{item.title}</div>
      ))}
    </main>
  );
}
