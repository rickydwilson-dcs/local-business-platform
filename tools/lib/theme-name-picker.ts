/**
 * Theme Name Picker
 *
 * Picks the next available theme name from the constellation namespace.
 * Compares the full pool (CONSTELLATION_NAMES) against already-implemented
 * themes (THEME_NAMES) and returns the first unused name.
 */

import { CONSTELLATION_NAMES } from "../../packages/theme-system/src/theme-names";
import { THEME_NAMES } from "../../packages/theme-system/src/types";

/**
 * Returns the first constellation name that is not yet in THEME_NAMES.
 *
 * With THEME_NAMES = ["orion", "vega"], this returns "lyra".
 *
 * @throws {Error} If all constellation names have been used.
 */
export function pickNextThemeName(): string {
  const usedNames: ReadonlySet<string> = new Set(THEME_NAMES);

  for (const name of CONSTELLATION_NAMES) {
    if (!usedNames.has(name)) {
      return name;
    }
  }

  throw new Error(
    "No available theme names remaining in the constellation namespace."
  );
}
