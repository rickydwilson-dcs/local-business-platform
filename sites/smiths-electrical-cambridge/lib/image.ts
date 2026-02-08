/**
 * Image utilities — thin wrapper over core-components with site-specific brand name.
 * Core logic lives in @platform/core-components/lib/image.
 */

import {
  getImageUrl,
  getImageSizes,
  isValidImagePath,
  generateImageAlt as _generateImageAlt,
  generateImageTitle as _generateImageTitle,
} from '@platform/core-components/lib/image';

export { getImageUrl, getImageSizes, isValidImagePath };

const BRAND_NAME = "Smith's Electrical";

export function generateImageAlt(
  serviceName: string,
  locationName?: string,
  customAlt?: string
): string {
  return _generateImageAlt(serviceName, locationName, customAlt, BRAND_NAME);
}

export function generateImageTitle(
  serviceName: string,
  locationName?: string,
  customTitle?: string
): string {
  return _generateImageTitle(serviceName, locationName, customTitle, BRAND_NAME);
}
