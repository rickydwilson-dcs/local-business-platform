'use client';

import { useState, useCallback, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { getCategories, getFontsByCategory, loadGoogleFont, preloadAllFonts } from '@/lib/google-fonts';
import { FONT_SCALE_FACTORS } from '@/lib/brand-vars';

interface ThemeOption {
  name: string;
  label: string;
}

interface BrandInjectorModalProps {
  themes: ThemeOption[];
}

function FontSelect({ value, onChange, label }: { value: string; onChange: (v: string) => void; label: string }) {
  const categories = getCategories();
  return (
    <label className="block">
      <span className="text-xs text-gray-500 mb-1 block">{label}</span>
      <select
        value={value}
        onChange={e => {
          const family = e.target.value;
          onChange(family);
          if (family) loadGoogleFont(family);
        }}
        className="w-full h-10 px-3 text-sm border border-gray-200 rounded-lg bg-white"
      >
        <option value="">Theme default</option>
        {categories.map(cat => (
          <optgroup key={cat} label={cat.charAt(0).toUpperCase() + cat.slice(1)}>
            {getFontsByCategory(cat).map(f => (
              <option key={f.family} value={f.family}>{f.family}</option>
            ))}
          </optgroup>
        ))}
      </select>
    </label>
  );
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
  const [fontSans, setFontSans] = useState(searchParams.get('font_sans') ?? '');
  const [fontHeading, setFontHeading] = useState(searchParams.get('font_heading') ?? '');
  const [fontSize, setFontSize] = useState(searchParams.get('font_size') ?? '');

  useEffect(() => {
    if (isOpen) preloadAllFonts();
  }, [isOpen]);

  const handleApply = useCallback(() => {
    const params = new URLSearchParams();
    params.set('base_theme', baseTheme);
    params.set('brand_primary', primary.replace('#', ''));
    params.set('brand_secondary', secondary.replace('#', ''));
    params.set('brand_accent', accent.replace('#', ''));
    if (fontSans) params.set('font_sans', fontSans);
    if (fontHeading) params.set('font_heading', fontHeading);
    if (fontSize) params.set('font_size', fontSize);
    router.replace(`?${params.toString()}`);
    setIsOpen(false);
  }, [baseTheme, primary, secondary, accent, fontSans, fontHeading, fontSize, router]);

  const handleReset = useCallback(() => {
    router.replace(window.location.pathname);
    setPrimary('#3b82f6');
    setSecondary('#1e40af');
    setAccent('#f59e0b');
    setFontSans('');
    setFontHeading('');
    setFontSize('');
    setBaseTheme(themes[0]?.name ?? 'orion');
    setIsOpen(false);
  }, [router, themes]);

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="text-sm px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium"
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
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full mx-4 p-6 max-h-[90vh] overflow-y-auto">
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
                      className="text-indigo-600"
                    />
                    <span className="text-sm text-gray-700">{t.label}</span>
                  </label>
                ))}
              </div>
            </fieldset>

            {/* Colours */}
            <div className="mb-6">
              <p className="text-sm font-semibold text-gray-700 mb-2">Colours</p>
              <div className="grid grid-cols-3 gap-4">
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
            </div>

            {/* Typography */}
            <div className="mb-6">
              <p className="text-sm font-semibold text-gray-700 mb-2">Typography</p>
              <div className="space-y-3">
                <FontSelect label="Body Font" value={fontSans} onChange={setFontSans} />
                <FontSelect label="Heading Font" value={fontHeading} onChange={setFontHeading} />
                <label className="block">
                  <span className="text-xs text-gray-500 mb-1 block">Font Scale</span>
                  <select
                    value={fontSize}
                    onChange={e => setFontSize(e.target.value)}
                    className="w-full h-10 px-3 text-sm border border-gray-200 rounded-lg bg-white"
                  >
                    <option value="">Default (100%)</option>
                    {Object.entries(FONT_SCALE_FACTORS).map(([key, factor]) => (
                      <option key={key} value={key}>
                        {key.charAt(0).toUpperCase() + key.slice(1)} ({Math.round(factor * 100)}%)
                      </option>
                    ))}
                  </select>
                </label>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              <button
                onClick={handleApply}
                className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors"
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
