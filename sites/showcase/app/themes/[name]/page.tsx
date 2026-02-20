import '@/lib/register-all-themes';
import { getRegisteredThemes } from '@platform/theme-system';
import { elementsBySlug } from '@/registry';
import { ThemeFrame } from '@/components/ThemeFrame';
import { notFound } from 'next/navigation';

const ORDERED_SLUGS = [
  'site-header',
  'hero-homepage',
  'service-cards',
  'social-proof',
  'cta-section',
  'dark-stat-card',
  'blog-post-card',
  'color-tokens',
];

export function generateStaticParams() {
  return getRegisteredThemes().map(t => ({ name: t.name }));
}

interface ThemePageProps {
  params: Promise<{ name: string }>;
}

export default async function ThemePage({ params }: ThemePageProps) {
  const { name } = await params;
  const themes = getRegisteredThemes();
  const theme = themes.find(t => t.name === name);
  if (!theme) notFound();

  return (
    <ThemeFrame theme={name} className="min-h-screen">
      {ORDERED_SLUGS.map(slug => {
        const element = elementsBySlug.get(slug);
        if (!element) return null;
        const renderFn = element.renders[name];
        if (!renderFn) return null;
        return (
          <section key={slug} className="relative">
            <p className="absolute top-1 left-2 z-10 text-xs text-surface-muted-foreground opacity-60 hover:opacity-100 transition-opacity pointer-events-none">
              {element.name}
            </p>
            {renderFn()}
          </section>
        );
      })}
    </ThemeFrame>
  );
}
