import type { DeepPartialThemeConfig } from '@platform/theme-system';
import { designlabRegistry, designlabDefaultConfig } from '@platform/themes/designlab';

export const themeConfig: DeepPartialThemeConfig = {
  ...designlabDefaultConfig,
  componentRegistry: designlabRegistry,
};
