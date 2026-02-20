import { elements } from '@/registry';
import type { ElementCategory } from '@/registry';
import { ElementBrowser } from '@/components/ElementBrowser';

interface HomePageProps {
  searchParams: Promise<{ category?: string }>;
}

export default async function HomePage({ searchParams }: HomePageProps) {
  const params = await searchParams;
  const activeCategory = params.category as ElementCategory | undefined;
  const filtered = activeCategory
    ? elements.filter(e => e.category === activeCategory)
    : elements;

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Element Showcase</h1>
        <p className="mt-1 text-gray-500">
          {filtered.length} element{filtered.length !== 1 ? 's' : ''}
          {activeCategory ? ` in ${activeCategory}` : ''}
        </p>
      </div>
      <ElementBrowser elements={filtered} activeCategory={activeCategory} />
    </div>
  );
}
