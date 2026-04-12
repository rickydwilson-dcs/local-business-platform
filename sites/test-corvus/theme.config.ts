import type { DeepPartialThemeConfig } from '@platform/theme-system';
import { corvusRegistry, corvusDefaultConfig } from '@platform/themes/corvus';

export const themeConfig: DeepPartialThemeConfig = {
  componentRegistry: corvusRegistry,
  ...corvusDefaultConfig,
  colors: {
    ...corvusDefaultConfig.colors,
    surface: {
      ...corvusDefaultConfig.colors?.surface,
      inverse: '#2d2a6e',
    },
  },
};
