import { describe, it, expect } from "vitest";
import {
  getOrganizationSchema,
  getLocalBusinessSchema,
  getWebSiteSchema,
  getBreadcrumbSchema,
  getFAQSchema,
} from "../schema";
import { businessType } from "../business-config";

// Type helper for accessing nested schema properties
type SchemaObject = Record<string, unknown>;

describe("Schema.org Structured Data", () => {
  describe("LocalBusiness Schema", () => {
    it("should generate valid LocalBusiness schema with configured business type", () => {
      const schema = getLocalBusinessSchema();

      expect(schema["@context"]).toBe("https://schema.org");
      expect(schema["@type"]).toBe(businessType);
      expect(schema.name).toBe("Colossus Scaffolding");
      expect(schema.legalName).toBe("Colossus Scaffolding Ltd");
    });

    it("should include required organization fields", () => {
      const schema = getLocalBusinessSchema();

      expect(schema.url).toBeDefined();
      expect(schema.logo).toBeDefined();
      expect(schema.description).toBeDefined();
      expect(schema.email).toBeDefined();
      expect(schema.telephone).toBeDefined();
    });

    it("should include valid postal address", () => {
      const schema = getLocalBusinessSchema();
      const address = schema.address as SchemaObject;

      expect(address).toBeDefined();
      expect(address["@type"]).toBe("PostalAddress");
      expect(address.streetAddress).toBeDefined();
      expect(address.addressLocality).toBeDefined();
      expect(address.addressRegion).toBeDefined();
      expect(address.postalCode).toBeDefined();
      expect(address.addressCountry).toBe("GB");
    });

    it("should include geo coordinates", () => {
      const schema = getLocalBusinessSchema();
      const geo = schema.geo as SchemaObject;

      expect(geo).toBeDefined();
      expect(geo["@type"]).toBe("GeoCoordinates");
      expect(geo.latitude).toBeDefined();
      expect(geo.longitude).toBeDefined();
    });

    it("should include area served with multiple locations", () => {
      const schema = getLocalBusinessSchema();
      const areaServed = schema.areaServed as SchemaObject[];

      expect(areaServed).toBeDefined();
      expect(Array.isArray(areaServed)).toBe(true);
      expect(areaServed.length).toBeGreaterThan(0);
      expect(areaServed[0]["@type"]).toBe("Place");
    });

    it("should include credentials and certifications", () => {
      const schema = getLocalBusinessSchema();
      const hasCredential = schema.hasCredential as SchemaObject[];

      expect(hasCredential).toBeDefined();
      expect(Array.isArray(hasCredential)).toBe(true);
      expect(hasCredential.length).toBeGreaterThanOrEqual(3);

      const chasCredential = hasCredential.find(
        (c: SchemaObject) => c.name === "CHAS Accreditation"
      );
      expect(chasCredential).toBeDefined();
      expect(chasCredential?.credentialCategory).toBe("certification");
    });

    it("should include offer catalog with services", () => {
      const schema = getLocalBusinessSchema();
      const hasOfferCatalog = schema.hasOfferCatalog as SchemaObject;

      expect(hasOfferCatalog).toBeDefined();
      expect(hasOfferCatalog["@type"]).toBe("OfferCatalog");
      expect(hasOfferCatalog.itemListElement).toBeDefined();
      expect(Array.isArray(hasOfferCatalog.itemListElement)).toBe(true);
      expect((hasOfferCatalog.itemListElement as unknown[]).length).toBeGreaterThan(0);
    });

    it("should include social media links", () => {
      const schema = getLocalBusinessSchema();
      const sameAs = schema.sameAs as string[];

      expect(sameAs).toBeDefined();
      expect(Array.isArray(sameAs)).toBe(true);
      expect(sameAs.length).toBeGreaterThan(0);
    });

    it("should be accessible via legacy getOrganizationSchema alias", () => {
      const legacySchema = getOrganizationSchema();
      const newSchema = getLocalBusinessSchema();

      expect(legacySchema).toEqual(newSchema);
    });
  });

  describe("WebSite Schema", () => {
    it("should generate valid WebSite schema", () => {
      const schema = getWebSiteSchema();

      expect(schema["@context"]).toBe("https://schema.org");
      expect(schema["@type"]).toBe("WebSite");
      expect(schema.name).toBe("Colossus Scaffolding");
      expect(schema.url).toBeDefined();
    });

    it("should include search action", () => {
      const schema = getWebSiteSchema();

      expect(schema.potentialAction).toBeDefined();
      expect(schema.potentialAction["@type"]).toBe("SearchAction");
      expect(schema.potentialAction.target).toBeDefined();
      expect(schema.potentialAction["query-input"]).toBeDefined();
    });

    it("should reference organization publisher", () => {
      const schema = getWebSiteSchema();

      expect(schema.publisher).toBeDefined();
      expect(schema.publisher["@id"]).toBeDefined();
    });

    it("should specify language", () => {
      const schema = getWebSiteSchema();

      expect(schema.inLanguage).toBe("en-GB");
    });
  });

  describe("Breadcrumb Schema", () => {
    it("should generate valid BreadcrumbList schema", () => {
      const items = [
        { name: "Home", url: "/" },
        { name: "Services", url: "/services" },
        { name: "Access Scaffolding", url: "/services/access-scaffolding" },
      ];

      const schema = getBreadcrumbSchema(items);

      expect(schema["@context"]).toBe("https://schema.org");
      expect(schema["@type"]).toBe("BreadcrumbList");
      expect(schema.itemListElement).toBeDefined();
      expect(Array.isArray(schema.itemListElement)).toBe(true);
      expect(schema.itemListElement.length).toBe(3);
    });

    it("should correctly order breadcrumb items", () => {
      const items = [
        { name: "Home", url: "/" },
        { name: "Services", url: "/services" },
        { name: "Access Scaffolding", url: "/services/access-scaffolding" },
      ];

      const schema = getBreadcrumbSchema(items);

      expect(schema.itemListElement[0].position).toBe(1);
      expect(schema.itemListElement[0].name).toBe("Home");
      expect(schema.itemListElement[1].position).toBe(2);
      expect(schema.itemListElement[1].name).toBe("Services");
      expect(schema.itemListElement[2].position).toBe(3);
      expect(schema.itemListElement[2].name).toBe("Access Scaffolding");
    });

    it("should handle empty breadcrumb array", () => {
      const schema = getBreadcrumbSchema([]);

      expect(schema.itemListElement).toEqual([]);
    });

    it("should include ListItem type for each breadcrumb", () => {
      const items = [
        { name: "Home", url: "/" },
        { name: "Services", url: "/services" },
      ];

      const schema = getBreadcrumbSchema(items);

      schema.itemListElement.forEach((item) => {
        expect(item["@type"]).toBe("ListItem");
        expect(item.position).toBeDefined();
        expect(item.name).toBeDefined();
        expect(item.item).toBeDefined();
      });
    });
  });

  describe("FAQ Schema", () => {
    it("should generate valid FAQPage schema", () => {
      const faqs = [
        { question: "What is access scaffolding?", answer: "Access scaffolding provides..." },
        {
          question: "How quickly can you install?",
          answer: "Standard projects within 24-48 hours...",
        },
        { question: "Do you provide certificates?", answer: "Yes, full handover certificates..." },
      ];

      const schema = getFAQSchema(faqs, "/services/access-scaffolding");

      expect(schema["@context"]).toBe("https://schema.org");
      expect(schema["@type"]).toBe("FAQPage");
      expect(schema["@id"]).toBeDefined();
      expect(schema.mainEntity).toBeDefined();
      expect(Array.isArray(schema.mainEntity)).toBe(true);
      expect(schema.mainEntity.length).toBe(3);
    });

    it("should include Question type for each FAQ", () => {
      const faqs = [
        { question: "What is access scaffolding?", answer: "Access scaffolding provides..." },
        {
          question: "How quickly can you install?",
          answer: "Standard projects within 24-48 hours...",
        },
      ];

      const schema = getFAQSchema(faqs, "/services/access-scaffolding");

      schema.mainEntity.forEach((entity) => {
        expect(entity["@type"]).toBe("Question");
        expect(entity.name).toBeDefined();
        expect(entity.acceptedAnswer).toBeDefined();
        expect(entity.acceptedAnswer["@type"]).toBe("Answer");
        expect(entity.acceptedAnswer.text).toBeDefined();
      });
    });

    it("should handle empty FAQ array", () => {
      const schema = getFAQSchema([], "/services/access-scaffolding");

      expect(schema.mainEntity).toEqual([]);
    });

    it("should include page URL in @id", () => {
      const faqs = [
        { question: "What is access scaffolding?", answer: "Access scaffolding provides..." },
      ];

      const schema = getFAQSchema(faqs, "/services/access-scaffolding");

      expect(schema["@id"]).toContain("/services/access-scaffolding");
      expect(schema["@id"]).toContain("#faq");
    });
  });

  describe("Schema JSON-LD Validation", () => {
    it("should produce valid JSON when stringified", () => {
      const schema = getLocalBusinessSchema();

      expect(() => JSON.stringify(schema)).not.toThrow();

      const jsonString = JSON.stringify(schema);
      expect(() => JSON.parse(jsonString)).not.toThrow();
    });

    it("should not contain undefined values in LocalBusiness schema", () => {
      const schema = getLocalBusinessSchema();
      const jsonString = JSON.stringify(schema);

      expect(jsonString).not.toContain("undefined");
      expect(jsonString).not.toContain("null");
    });

    it("should not contain undefined values in WebSite schema", () => {
      const schema = getWebSiteSchema();
      const jsonString = JSON.stringify(schema);

      expect(jsonString).not.toContain("undefined");
    });

    it("should produce parseable JSON-LD for all schema types", () => {
      const businessSchema = getLocalBusinessSchema();
      const webSchema = getWebSiteSchema();
      const breadcrumbSchema = getBreadcrumbSchema([
        { name: "Home", url: "/" },
        { name: "Services", url: "/services" },
      ]);
      const faqSchema = getFAQSchema(
        [{ question: "Test question?", answer: "Test answer." }],
        "/test"
      );

      [businessSchema, webSchema, breadcrumbSchema, faqSchema].forEach((schema) => {
        const jsonString = JSON.stringify(schema);
        expect(() => JSON.parse(jsonString)).not.toThrow();
        expect(JSON.parse(jsonString)["@context"]).toBe("https://schema.org");
      });
    });
  });

  describe("Schema Required Fields Validation", () => {
    it("LocalBusiness schema should have all Google required fields", () => {
      const schema = getLocalBusinessSchema();

      // Required by Google for LocalBusiness
      expect(schema["@type"]).toBe(businessType);
      expect(schema.name).toBeDefined();
      expect(schema.url).toBeDefined();

      // Recommended fields
      expect(schema.address).toBeDefined();
      expect(schema.telephone).toBeDefined();
    });

    it("FAQPage schema should have all Google required fields", () => {
      const faqs = [
        { question: "What is access scaffolding?", answer: "Access scaffolding provides..." },
      ];
      const schema = getFAQSchema(faqs, "/test");

      // Required by Google for FAQPage
      expect(schema["@type"]).toBe("FAQPage");
      expect(schema.mainEntity).toBeDefined();
      expect(schema.mainEntity.length).toBeGreaterThan(0);

      schema.mainEntity.forEach((entity) => {
        expect(entity["@type"]).toBe("Question");
        expect(entity.name).toBeDefined();
        expect(entity.acceptedAnswer).toBeDefined();
        expect(entity.acceptedAnswer["@type"]).toBe("Answer");
        expect(entity.acceptedAnswer.text).toBeDefined();
      });
    });

    it("BreadcrumbList schema should have all Google required fields", () => {
      const items = [
        { name: "Home", url: "/" },
        { name: "Services", url: "/services" },
      ];
      const schema = getBreadcrumbSchema(items);

      // Required by Google for BreadcrumbList
      expect(schema["@type"]).toBe("BreadcrumbList");
      expect(schema.itemListElement).toBeDefined();

      schema.itemListElement.forEach((item) => {
        expect(item["@type"]).toBe("ListItem");
        expect(item.position).toBeDefined();
        expect(item.name).toBeDefined();
        expect(item.item).toBeDefined();
      });
    });
  });
});
