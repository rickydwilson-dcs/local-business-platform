import '@/lib/register-all-themes';
import { getRegisteredThemes } from '@platform/theme-system';
import { elements, elementsBySlug } from '@/registry';
import { ThemeFrame } from '@/components/ThemeFrame';
import { BrandInjectorModal } from '@/components/BrandInjectorModal';
import { CustomBrandProvider } from '@/components/CustomBrandProvider';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Suspense } from 'react';

export function generateStaticParams() {
  return elements.map(e => ({ slug: e.slug }));
}

interface ElementDetailPageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<Record<string, string | undefined>>;
}

export default async function ElementDetailPage({ params, searchParams }: ElementDetailPageProps) {
  const { slug } = await params;
  const element = elementsBySlug.get(slug);

  if (!element) {
    notFound();
  }

  const themes = getRegisteredThemes();
  const sp = await searchParams;
  const base_theme = sp.base_theme;
  const brand_primary = sp.brand_primary;
  const brand_secondary = sp.brand_secondary;
  const brand_accent = sp.brand_accent;
  const font_sans = sp.font_sans;
  const font_heading = sp.font_heading;
  const font_size = sp.font_size;

  const hasCustomParams = !!(base_theme || brand_primary || brand_secondary || brand_accent || font_sans || font_heading || font_size);
  const baseThemeLabel = themes.find(t => t.name === base_theme)?.label ?? themes[0]?.label ?? 'Custom';

  return (
    <div className="p-8">
      <div className="mb-8 flex items-start justify-between">
        <div>
          <Link href="/" className="text-sm text-gray-500 hover:text-gray-700 transition-colors">&larr; Back to browse</Link>
          <h1 className="text-2xl font-bold text-gray-900 mt-2">{element.name}</h1>
          <div className="flex items-center gap-3 mt-1">
            <span className="text-xs px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full">{element.category}</span>
            <p className="text-sm text-gray-500">{element.description}</p>
          </div>
        </div>
        <Suspense fallback={null}>
          <BrandInjectorModal themes={themes.map(t => ({ name: t.name, label: t.label }))} />
        </Suspense>
      </div>

      {/* Named theme columns */}
      <div className="space-y-8">
        {themes.map(t => {
          const renderFn = element.renders[t.name];
          if (!renderFn) return null;
          return (
            <div key={t.name}>
              <div className="flex items-center gap-2 mb-3">
                <div className="w-3 h-3 rounded-full bg-gray-400" />
                <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wider">{t.label}</h2>
              </div>
              <ThemeFrame
                theme={t.name}
                className="border border-gray-200 rounded-xl overflow-hidden bg-white"
              >
                {renderFn()}
              </ThemeFrame>
            </div>
          );
        })}

        {/* Custom brand row */}
        {hasCustomParams && (
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-3 h-3 rounded-full bg-purple-500" />
              <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wider">
                {baseThemeLabel} + Custom
              </h2>
            </div>
            <CustomBrandProvider
              baseTheme={base_theme}
              overrides={{
                primary: brand_primary,
                secondary: brand_secondary,
                accent: brand_accent,
                fontSans: font_sans,
                fontHeading: font_heading,
                fontSize: font_size,
              }}
            >
              {element.renders[base_theme ?? themes[0]?.name ?? 'orion']?.()}
            </CustomBrandProvider>
          </div>
        )}
      </div>
    </div>
  );
}
