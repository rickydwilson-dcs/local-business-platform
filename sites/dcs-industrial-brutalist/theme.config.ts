import type { DeepPartialThemeConfig } from '@platform/theme-system';
import { polarisRegistry, polarisDefaultConfig } from '@platform/themes/polaris';

export const themeConfig: DeepPartialThemeConfig = {
  componentRegistry: polarisRegistry,
  ...polarisDefaultConfig,
};
