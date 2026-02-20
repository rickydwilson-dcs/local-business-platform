'use client';

import { useState, useCallback } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';

interface ThemeOption {
  name: string;
  label: string;
}

interface BrandInjectorModalProps {
  themes: ThemeOption[];
}

export function BrandInjectorModal({ themes }: BrandInjectorModalProps) {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [isOpen, setIsOpen] = useState(false);
  const [baseTheme, setBaseTheme] = useState(
    searchParams.get('base_theme') ?? themes[0]?.name ?? 'orion'
  );
  const [primary, setPrimary] = useState(
    searchParams.get('brand_primary') ? `#${searchParams.get('brand_primary')}` : '#3b82f6'
  );
  const [secondary, setSecondary] = useState(
    searchParams.get('brand_secondary') ? `#${searchParams.get('brand_secondary')}` : '#1e40af'
  );
  const [accent, setAccent] = useState(
    searchParams.get('brand_accent') ? `#${searchParams.get('brand_accent')}` : '#f59e0b'
  );
  const [fontFamily, setFontFamily] = useState(
    searchParams.get('font_family') ?? ''
  );

  const handleApply = useCallback(() => {
    const params = new URLSearchParams();
    params.set('base_theme', baseTheme);
    params.set('brand_primary', primary.replace('#', ''));
    params.set('brand_secondary', secondary.replace('#', ''));
    params.set('brand_accent', accent.replace('#', ''));
    if (fontFamily) params.set('font_family', fontFamily);
    router.replace(`?${params.toString()}`);
    setIsOpen(false);
  }, [baseTheme, primary, secondary, accent, fontFamily, router]);

  const handleReset = useCallback(() => {
    router.replace(window.location.pathname);
    setPrimary('#3b82f6');
    setSecondary('#1e40af');
    setAccent('#f59e0b');
    setFontFamily('');
    setBaseTheme(themes[0]?.name ?? 'orion');
    setIsOpen(false);
  }, [router, themes]);

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="text-sm px-4 py-2 bg-brand-primary text-white rounded-lg hover:bg-brand-primary-hover transition-colors font-medium"
      >
        Customise
      </button>

      {isOpen && (
        <div
          className="z-50 fixed inset-0 bg-black/50 flex items-center justify-center"
          onClick={(e) => {
            if (e.target === e.currentTarget) setIsOpen(false);
          }}
        >
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full mx-4 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-gray-900">Customise Theme</h2>
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-400 hover:text-gray-600 text-xl leading-none"
              >
                &times;
              </button>
            </div>

            {/* Base Theme */}
            <fieldset className="mb-6">
              <legend className="text-sm font-semibold text-gray-700 mb-2">Base Theme</legend>
              <div className="flex gap-3">
                {themes.map(t => (
                  <label key={t.name} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="base_theme"
                      value={t.name}
                      checked={baseTheme === t.name}
                      onChange={() => setBaseTheme(t.name)}
                      className="text-brand-primary"
                    />
                    <span className="text-sm text-gray-700">{t.label}</span>
                  </label>
                ))}
              </div>
            </fieldset>

            {/* Colours */}
            <div className="grid grid-cols-3 gap-4 mb-6">
              <label className="block">
                <span className="text-xs text-gray-500 mb-1 block">Primary</span>
                <input
                  type="color"
                  value={primary}
                  onChange={e => setPrimary(e.target.value)}
                  className="w-full h-10 rounded cursor-pointer border border-gray-200"
                />
              </label>
              <label className="block">
                <span className="text-xs text-gray-500 mb-1 block">Secondary</span>
                <input
                  type="color"
                  value={secondary}
                  onChange={e => setSecondary(e.target.value)}
                  className="w-full h-10 rounded cursor-pointer border border-gray-200"
                />
              </label>
              <label className="block">
                <span className="text-xs text-gray-500 mb-1 block">Accent</span>
                <input
                  type="color"
                  value={accent}
                  onChange={e => setAccent(e.target.value)}
                  className="w-full h-10 rounded cursor-pointer border border-gray-200"
                />
              </label>
            </div>

            {/* Font */}
            <label className="block mb-6">
              <span className="text-xs text-gray-500 mb-1 block">Font Family</span>
              <input
                type="text"
                value={fontFamily}
                onChange={e => setFontFamily(e.target.value)}
                placeholder="e.g. Inter, Roboto"
                className="w-full h-10 px-3 text-sm border border-gray-200 rounded-lg bg-white"
              />
            </label>

            {/* Actions */}
            <div className="flex gap-3">
              <button
                onClick={handleApply}
                className="flex-1 px-4 py-2 bg-brand-primary text-white rounded-lg font-medium hover:bg-brand-primary-hover transition-colors"
              >
                Apply
              </button>
              <button
                onClick={handleReset}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors"
              >
                Reset
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
