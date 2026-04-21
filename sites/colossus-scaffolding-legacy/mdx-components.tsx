import type { MDXComponents as MDXMap } from "mdx/types";
import { createMdxComponentsMap } from "@platform/core-components/components/mdx/mdx-components";
import { Schema } from "@platform/core-components";
import {
  // HTML overrides
  MdxLink,
  MdxH2,
  MdxH3,
  MdxP,
  MdxUl,
  MdxOl,
  MdxLi,
  MdxStrong,
  MdxHr,
  MdxImg,
  // Service components
  RelatedServices,
  ServiceLink,
  Benefits,
  BenefitItem,
  CoverageSection,
  RegionCard,
  LocationTag,
  ServiceIntro,
  ProcessStep,
  SidebarItem,
  // Blog components
  InfoBox,
  FeatureCard,
  FeatureGrid,
  ComparisonTable,
  ComparisonRow,
  CheckList,
  QuoteBlock,
  ImageWithCaption,
  StepByStep,
  Step,
} from "./components/mdx";

const base = createMdxComponentsMap();

// Merge: core base first, then colossus-specific overrides on top
const mdxComponents: MDXMap = {
  ...base,

  // HTML tag overrides (colossus versions)
  a: MdxLink,
  h2: MdxH2,
  h3: MdxH3,
  p: MdxP,
  ul: MdxUl,
  ol: MdxOl,
  li: MdxLi,
  strong: MdxStrong,
  hr: MdxHr,
  img: MdxImg,

  // Core
  Schema,

  // Service components
  RelatedServices,
  ServiceLink,
  Benefits,
  BenefitItem,
  CoverageSection,
  RegionCard,
  LocationTag,
  ServiceIntro,
  ProcessStep,
  SidebarItem,

  // Blog components (colossus versions override core InfoBox/QuoteBlock/ImageWithCaption)
  InfoBox,
  FeatureCard,
  FeatureGrid,
  ComparisonTable,
  ComparisonRow,
  CheckList,
  QuoteBlock,
  ImageWithCaption,
  StepByStep,
  Step,
};

export default mdxComponents;

export function useMDXComponents(components: MDXMap): MDXMap {
  return { ...mdxComponents, ...components };
}
