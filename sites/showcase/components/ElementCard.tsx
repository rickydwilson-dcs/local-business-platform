import type { ElementDefinition } from '@/registry';
import '@/lib/register-all-themes';
import { getRegisteredThemes } from '@platform/theme-system';
import { ThemeFrame } from './ThemeFrame';

interface ElementCardProps {
  element: ElementDefinition;
}

export function ElementCard({ element }: ElementCardProps) {
  const themes = getRegisteredThemes();

  return (
    <a
      href={`/elements/${element.slug}`}
      className="block bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200"
    >
      <div className="flex border-b border-gray-100">
        {themes.map(t => (
          <div key={t.name} className="flex-1 min-w-0 border-r border-gray-100 last:border-r-0">
            <ThemeFrame theme={t.name} className="p-2 overflow-hidden max-h-32">
              <div className="transform scale-[0.4] origin-top-left w-[250%]">
                {element.renders[t.name]?.()}
              </div>
            </ThemeFrame>
          </div>
        ))}
      </div>
      <div className="p-4">
        <div className="flex items-center gap-2 mb-1">
          <h3 className="text-sm font-semibold text-gray-900">{element.name}</h3>
          <span className="text-xs px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full">{element.category}</span>
        </div>
        <p className="text-xs text-gray-500 line-clamp-2">{element.description}</p>
      </div>
    </a>
  );
}
