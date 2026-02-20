import Link from 'next/link';
import type { ElementDefinition, ElementCategory } from '@/registry';
import { categories } from '@/registry';
import { ElementCard } from './ElementCard';

interface ElementBrowserProps {
  elements: ElementDefinition[];
  activeCategory?: ElementCategory;
}

export function ElementBrowser({ elements, activeCategory }: ElementBrowserProps) {
  return (
    <div>
      <div className="flex flex-wrap gap-2 mb-8">
        <Link
          href="/"
          className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${
            !activeCategory
              ? 'bg-gray-900 text-white border-gray-900'
              : 'bg-white text-gray-600 border-gray-200 hover:border-gray-400'
          }`}
        >
          All
        </Link>
        {categories.map(cat => (
          <Link
            key={cat}
            href={`/?category=${encodeURIComponent(cat)}`}
            className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${
              activeCategory === cat
                ? 'bg-gray-900 text-white border-gray-900'
                : 'bg-white text-gray-600 border-gray-200 hover:border-gray-400'
            }`}
          >
            {cat}
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {elements.map(el => (
          <ElementCard key={el.slug} element={el} />
        ))}
      </div>

      {elements.length === 0 && (
        <p className="text-center text-gray-500 py-12">No elements in this category yet.</p>
      )}
    </div>
  );
}
