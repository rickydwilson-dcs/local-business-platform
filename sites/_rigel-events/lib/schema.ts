import { createSchemaGenerators } from "@platform/core-components/lib/schema-generators";
import { absUrl } from "./site";
import { businessConfig, businessType } from "./business-config";

export const {
  getLocalBusinessSchema,
  getWebSiteSchema,
  getBreadcrumbSchema,
  getFAQSchema,
  getServiceAreaSchema,
  getArticleSchema,
  getAggregateRatingSchema,
} = createSchemaGenerators({ absUrl, businessConfig, businessType });

export const getOrganizationSchema = getLocalBusinessSchema;

export type {
  ArticleSchemaOptions,
  AggregateRatingOptions,
} from "@platform/core-components/lib/schema-generators";
