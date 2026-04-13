import type { DeepPartialThemeConfig } from '@platform/theme-system';
import { corvusRegistry, corvusDefaultConfig } from '@platform/themes/corvus';

export const themeConfig: DeepPartialThemeConfig = {
  ...corvusDefaultConfig,
  componentRegistry: corvusRegistry,
};
