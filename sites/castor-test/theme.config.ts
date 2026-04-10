import type { DeepPartialThemeConfig } from '@platform/theme-system';
import { castorRegistry, castorDefaultConfig } from '@platform/themes/castor';

export const themeConfig: DeepPartialThemeConfig = {
  componentRegistry: castorRegistry,
  ...castorDefaultConfig,
};
