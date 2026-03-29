import type { DeepPartialThemeConfig } from '@platform/theme-system';
import { lyraRegistry, lyraDefaultConfig } from '@platform/themes/lyra';

export const themeConfig: DeepPartialThemeConfig = {
  componentRegistry: lyraRegistry,
  ...lyraDefaultConfig,
};
