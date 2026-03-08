import { createSiteUtils, formatPhone, telLink, mailtoLink, slugify } from '@platform/core-components';
import { siteConfig } from '@/site.config';

const { absUrl } = createSiteUtils(siteConfig.url);
export { absUrl, formatPhone, telLink, mailtoLink, slugify };
