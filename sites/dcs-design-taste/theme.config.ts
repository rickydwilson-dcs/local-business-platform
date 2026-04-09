import type { DeepPartialThemeConfig } from "@platform/theme-system";
import { siriusRegistry, siriusDefaultConfig } from "@platform/themes/sirius";

export const themeConfig: DeepPartialThemeConfig = {
  componentRegistry: siriusRegistry,
  ...siriusDefaultConfig,
};
