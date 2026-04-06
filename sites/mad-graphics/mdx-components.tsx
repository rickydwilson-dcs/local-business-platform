import { createMdxComponentsMap } from '@platform/core-components/components/mdx/mdx-components';
import { CoverageSection, RegionCard, LocationTag } from './components/mdx/service/coverage-section';
import { ServiceIntro, ProcessStep, SidebarItem } from './components/mdx/service/service-intro';
import { RelatedServices, ServiceLink } from './components/mdx/service/related-services';

const base = createMdxComponentsMap();

const mdxComponents = {
  ...base,
  CoverageSection,
  RegionCard,
  LocationTag,
  ServiceIntro,
  ProcessStep,
  SidebarItem,
  RelatedServices,
  ServiceLink,
};

export default mdxComponents;

export function useMDXComponents(components: Record<string, unknown>): Record<string, unknown> {
  return { ...mdxComponents, ...components };
}
