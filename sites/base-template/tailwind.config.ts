import type { Config } from 'tailwindcss';
import { createThemePlugin } from '@platform/theme-system/plugin';
import { themeConfig } from './theme.config';
import typography from '@tailwindcss/typography';

/**
 * Tailwind Configuration with Theme System Integration
 *
 * This configuration uses the @platform/theme-system plugin to apply
 * the theme from theme.config.ts as CSS variables and Tailwind utilities.
 */
const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './content/**/*.{md,mdx}',
    '../../packages/core-components/src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      // Additional theme extensions can be added here
      // The theme system plugin will merge these with the theme config
    },
  },
  plugins: [typography, createThemePlugin(themeConfig)],
};

export default config;
