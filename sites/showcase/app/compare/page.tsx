import '@/lib/register-all-themes';
import { getRegisteredThemes } from '@platform/theme-system';
import { elements } from '@/registry';
import { ThemeFrame } from '@/components/ThemeFrame';
import React from 'react';

export default function ComparePage() {
  const themes = getRegisteredThemes();

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Compare Matrix</h1>
        <p className="mt-1 text-sm text-gray-500">
          {elements.length} elements &times; {themes.length} themes
        </p>
      </div>

      <div
        className="grid gap-px bg-gray-200 border border-gray-200 rounded-xl overflow-hidden"
        style={{ gridTemplateColumns: `240px repeat(${themes.length}, 1fr)` }}
      >
        {/* Sticky header row */}
        <div className="sticky top-0 z-10 bg-gray-50 p-4 font-semibold text-xs uppercase tracking-wider text-gray-500 border-b border-gray-200">
          Element
        </div>
        {themes.map(t => (
          <div
            key={t.name}
            className="sticky top-0 z-10 bg-gray-50 p-4 font-semibold text-xs uppercase tracking-wider text-gray-500 border-b border-gray-200 text-center"
          >
            {t.label}
          </div>
        ))}

        {/* Element rows */}
        {elements.map(element => (
          <React.Fragment key={element.slug}>
            <div className="bg-white p-4 flex flex-col justify-center border-b border-gray-100">
              <a
                href={`/elements/${element.slug}`}
                className="text-sm font-medium text-gray-900 hover:text-brand-primary transition-colors"
              >
                {element.name}
              </a>
              <span className="text-xs text-gray-400 mt-0.5">{element.category}</span>
            </div>
            {themes.map(t => (
              <ThemeFrame
                key={t.name}
                theme={t.name}
                className="bg-white p-2 border-b border-gray-100 overflow-hidden"
              >
                <div className="transform scale-[0.35] origin-top-left w-[286%] max-h-48 overflow-hidden">
                  {element.renders[t.name]?.() ?? (
                    <div className="p-4 text-center text-xs text-gray-400">Not available</div>
                  )}
                </div>
              </ThemeFrame>
            ))}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}
