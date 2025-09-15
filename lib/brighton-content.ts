// lib/brighton-content.ts
import fs from "fs/promises";
import path from "path";
import matter from "gray-matter";

export interface BrightonContent {
  metadata: {
    title: string;
    seoTitle: string;
    description: string;
    keywords: string[];
  };
  hero: {
    title: string;
    description: string;
    phone: string;
    trustBadges: string[];
    ctaText: string;
    ctaUrl: string;
  };
  specialists: {
    title: string;
    description: string;
    columns: 2 | 3 | 4;
    backgroundColor: 'white' | 'gray';
    showBottomCTA: boolean;
    cards: Array<{
      title: string;
      description: string;
      details: string[];
    }>;
  };
  services: {
    title: string;
    description: string;
    cards: Array<{
      title: string;
      subtitle: string;
      description: string;
      features: string[];
      href: string;
      ctaText: string;
    }>;
  };
  capabilities: {
    title: string;
    description: string;
    items: Array<{
      title: string;
      subtitle: string;
      description: string;
      features: string[];
    }>;
  };
  pricing: {
    title: string;
    description: string;
    packages: Array<{
      name: string;
      description: string;
      price: string;
      duration: string;
      popular?: boolean;
      features: Array<{
        text: string;
        included: boolean;
      }>;
      ctaText: string;
      ctaUrl: string;
    }>;
  };
  localAuthority: {
    title: string;
    description: string;
    locationName: string;
    authorityName: string;
    expertiseItems: Array<{
      title: string;
      description: string;
    }>;
    supportItems: Array<{
      title: string;
      description: string;
    }>;
  };
  coverage: {
    description: string;
    areas: string[];
  };
  faqs: Array<{
    question: string;
    answer: string;
  }>;
  cta: {
    title: string;
    description: string;
    primaryButtonText: string;
    primaryButtonUrl: string;
    secondaryButtonText: string;
    secondaryButtonUrl: string;
    trustBadges: string[];
  };
  breadcrumbs: Array<{
    name: string;
    href: string;
    current?: boolean;
  }>;
  schema: {
    service: {
      id: string;
      name: string;
      description: string;
      url: string;
      serviceType: string;
      areaServed: string[];
    };
  };
}

export async function getBrightonContent(): Promise<BrightonContent> {
  const filePath = path.join(process.cwd(), "content", "locations", "brighton.mdx");

  try {
    const raw = await fs.readFile(filePath, "utf8");
    const { data } = matter(raw);

    return {
      metadata: {
        title: data.title,
        seoTitle: data.seoTitle,
        description: data.description,
        keywords: data.keywords || []
      },
      hero: data.hero,
      specialists: data.specialists,
      services: data.services,
      capabilities: data.capabilities,
      pricing: data.pricing,
      localAuthority: data.localAuthority,
      coverage: data.coverage,
      faqs: data.faqs || [],
      cta: data.cta,
      breadcrumbs: data.breadcrumbs || [],
      schema: data.schema
    };
  } catch (error) {
    console.error("Error reading Brighton content:", error);
    throw new Error("Failed to load Brighton content");
  }
}