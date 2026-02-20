import { describe, it, expect } from 'vitest';
import { generateThemeConfigContent } from '../theme-generator';

const mockSuggestion = {
  colors: {
    brand: { primary: '#005A9E', primaryHover: '#004680', secondary: '#1A365D', accent: '#38A169' },
    surface: { background: '#ffffff', foreground: '#1A1A1A', muted: '#F5F5F5' },
  },
  typography: { fontFamily: { sans: ['Inter', 'system-ui'], heading: ['Inter', 'system-ui'] } },
  style: 'corporate' as const,
  confidence: 0.8,
  source: 'website' as const,
};

describe('generateThemeConfigContent', () => {
  it('emits DeepPartialThemeConfig format with vega registry', () => {
    const output = generateThemeConfigContent(mockSuggestion, 'test-site', 'vega');
    expect(output).toContain("import type { DeepPartialThemeConfig }");
    expect(output).toContain("import { vegaRegistry }");
    expect(output).toContain("export const themeConfig: DeepPartialThemeConfig = {");
    expect(output).toContain("componentRegistry: vegaRegistry");
    expect(output).not.toContain("defineTheme");
    expect(output).not.toContain("export default");
  });

  it('emits orionRegistry when themeVariant is orion', () => {
    const output = generateThemeConfigContent(mockSuggestion, 'test-site', 'orion');
    expect(output).toContain("import { orionRegistry }");
    expect(output).toContain("componentRegistry: orionRegistry");
    expect(output).not.toContain("vegaRegistry");
  });

  it('defaults to vega when themeVariant is omitted', () => {
    const output = generateThemeConfigContent(mockSuggestion, 'test-site');
    expect(output).toContain("vegaRegistry");
    expect(output).not.toContain("orionRegistry");
  });
});
