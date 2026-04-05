import type { DeepPartialThemeConfig } from '@platform/theme-system';
import { cygnusRegistry, cygnusDefaultConfig } from '@platform/themes/cygnus';

export const themeConfig: DeepPartialThemeConfig = {
  componentRegistry: cygnusRegistry,
  ...cygnusDefaultConfig,
};
