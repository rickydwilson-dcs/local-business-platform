import { buildCustomVarsFromBase, overridesToConfig } from '@/lib/brand-vars';

interface CustomBrandOverrides {
  primary?: string;
  secondary?: string;
  accent?: string;
  fontSans?: string;
  fontHeading?: string;
  fontSize?: string;
}

interface CustomBrandProviderProps {
  baseTheme?: string;
  overrides: CustomBrandOverrides;
  children: React.ReactNode;
}

export function CustomBrandProvider({ baseTheme, overrides, children }: CustomBrandProviderProps) {
  const themeName = baseTheme ?? 'orion';

  const brandOverrides = {
    brand_primary: overrides.primary,
    brand_secondary: overrides.secondary,
    brand_accent: overrides.accent,
    font_sans: overrides.fontSans,
    font_heading: overrides.fontHeading,
    font_size: overrides.fontSize,
  };

  const partialConfig = overridesToConfig(brandOverrides);
  const cssVars = buildCustomVarsFromBase(themeName, partialConfig);

  return (
    <div
      data-theme={themeName}
      style={cssVars as React.CSSProperties}
      className="border border-gray-200 rounded-xl overflow-hidden bg-white"
    >
      {children}
    </div>
  );
}
