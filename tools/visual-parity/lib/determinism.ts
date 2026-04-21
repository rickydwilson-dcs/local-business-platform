/**
 * Capture determinism kit. Applied to every Playwright page before screenshot
 * to suppress sources of false-positive pixel diff noise.
 */

import type { Page, BrowserContext } from "@playwright/test";

const ANIMATION_FREEZE_CSS = `
  *, *::before, *::after {
    animation-duration: 0s !important;
    animation-delay: 0s !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0s !important;
    transition-delay: 0s !important;
    caret-color: transparent !important;
    scroll-behavior: auto !important;
  }
  html { scroll-behavior: auto !important; }
`;

const MASK_CSS = `
  .leaflet-tile-pane,
  [data-consent-banner],
  [data-cookie-banner],
  [data-newrelic-browser-agent],
  [data-vercel-toolbar] {
    visibility: hidden !important;
  }
  /* Keep the map container shape so layout doesn't shift — only hide tiles. */
  .leaflet-container {
    background: #e5e7eb !important;
  }
`;

export const CAPTURE_LOCALE = "en-GB";
export const CAPTURE_TIMEZONE = "Europe/London";

// Scripts are authored as strings to sidestep a tsx/esbuild quirk where inner
// arrow functions get wrapped with `__name()` helpers that don't exist in the
// browser page context.
const LOCALE_INIT_SCRIPT = `
  try {
    Object.defineProperty(Intl.DateTimeFormat.prototype, "resolvedOptions", {
      value: function () {
        return { locale: "en-GB", timeZone: "Europe/London" };
      }
    });
  } catch (e) { /* non-fatal */ }
`;

const FONTS_READY_SCRIPT = `
  (function () {
    if (document.fonts && document.fonts.ready) {
      return document.fonts.ready.then(function () { return true; });
    }
    return true;
  })();
`;

export async function prepareContext(context: BrowserContext): Promise<void> {
  await context.addInitScript({ content: LOCALE_INIT_SCRIPT });
}

export async function stabilisePage(page: Page): Promise<void> {
  await page.addStyleTag({ content: ANIMATION_FREEZE_CSS + MASK_CSS });
  await page.evaluate(FONTS_READY_SCRIPT);
  await page.waitForLoadState("networkidle", { timeout: 30_000 }).catch(() => {});
  await page.waitForTimeout(1_000);
}

export interface CaptureOptions {
  timeoutMs?: number;
  retry?: boolean;
}
