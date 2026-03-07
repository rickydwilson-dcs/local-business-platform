import type { MDXComponents as MDXMap } from "mdx/types";
import { Schema } from "@platform/core-components";
import {
  // HTML overrides
  MdxLink, MdxH2, MdxH3, MdxP, MdxUl, MdxOl, MdxLi, MdxStrong, MdxHr, MdxImg,
  // Service components
  RelatedServices, ServiceLink,
  Benefits, BenefitItem,
  CoverageSection, RegionCard, LocationTag,
  ServiceIntro, ProcessStep, SidebarItem,
  // Blog components
  InfoBox, FeatureCard, FeatureGrid,
  ComparisonTable, ComparisonRow, CheckList,
  QuoteBlock, ImageWithCaption, StepByStep, Step,
} from "./components/mdx";

// Default components map used by both native MDX pages (app/*.mdx)
// and by next-mdx-remote (imported in [slug] pages via lib/mdx.tsx)
const mdxComponents: MDXMap = {
  // HTML tag overrides
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
};

export default mdxComponents;

// This hook is how Next's native MDX discovers your components map.
// It MUST be exported from a file named exactly "mdx-components.(js|tsx)" at the project root.
export function useMDXComponents(components: MDXMap): MDXMap {
  return { ...mdxComponents, ...components };
}
