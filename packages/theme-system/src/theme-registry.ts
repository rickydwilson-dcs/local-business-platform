/**
 * Theme Registry
 * Central registry for theme discovery — themes self-register via registerTheme().
 * Showcase and other tools read getRegisteredThemes() to auto-discover all themes.
 */

import type { DeepPartialThemeConfig } from './types';

export interface ThemeRegistryEntry {
  name: string;
  label: string;
  config: DeepPartialThemeConfig;
}

const registry: ThemeRegistryEntry[] = [];

export function registerTheme(entry: ThemeRegistryEntry): void {
  registry.push(Object.freeze(entry));
}

export function getRegisteredThemes(): readonly ThemeRegistryEntry[] {
  return [...registry];
}
