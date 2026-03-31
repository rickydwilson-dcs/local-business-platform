import type { DeepPartialThemeConfig } from '@platform/theme-system';
import { novaRegistry, novaDefaultConfig } from '@platform/themes/nova';

export const themeConfig: DeepPartialThemeConfig = {
  componentRegistry: novaRegistry,
  ...novaDefaultConfig,
};
