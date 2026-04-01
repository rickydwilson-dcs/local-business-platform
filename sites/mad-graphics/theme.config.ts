import type { DeepPartialThemeConfig } from '@platform/theme-system';
import { cygnusRegistry, cygnusDefaultConfig } from '@platform/themes/cygnus';

export const themeConfig: DeepPartialThemeConfig = {
  componentRegistry: cygnusRegistry,
  ...cygnusDefaultConfig,
  colors: {
    ...cygnusDefaultConfig.colors,
    brand: {
      primary: '#F47B20',
      primaryHover: '#C96210',
      secondary: '#7AC143',
      accent: '#dec498',
      onPrimary: '#2d1600',
    },
  },
};
