import { describe, it, expect } from "vitest";
import { getBreadcrumbSchema, getFAQSchema } from "../schema";

describe("Schema.org Structured Data", () => {
  describe("Breadcrumb Schema", () => {
    it("should generate valid BreadcrumbList schema", () => {
      const items = [
        { name: "Home", url: "/" },
        { name: "Services", url: "/services" },
        { name: "Plumbing", url: "/services/plumbing" },
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
        { name: "Plumbing", url: "/services/plumbing" },
      ];

      const schema = getBreadcrumbSchema(items);

      expect(schema.itemListElement[0].position).toBe(1);
      expect(schema.itemListElement[0].name).toBe("Home");
      expect(schema.itemListElement[1].position).toBe(2);
      expect(schema.itemListElement[1].name).toBe("Services");
      expect(schema.itemListElement[2].position).toBe(3);
      expect(schema.itemListElement[2].name).toBe("Plumbing");
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
        { question: "What services do you offer?", answer: "We offer a range of..." },
        {
          question: "How quickly can you respond?",
          answer: "Standard projects within 24-48 hours...",
        },
        { question: "Do you provide certificates?", answer: "Yes, full handover certificates..." },
      ];

      const schema = getFAQSchema(faqs, "/services/plumbing");

      expect(schema["@context"]).toBe("https://schema.org");
      expect(schema["@type"]).toBe("FAQPage");
      expect(schema["@id"]).toBeDefined();
      expect(schema.mainEntity).toBeDefined();
      expect(Array.isArray(schema.mainEntity)).toBe(true);
      expect(schema.mainEntity.length).toBe(3);
    });

    it("should include Question type for each FAQ", () => {
      const faqs = [
        { question: "What services do you offer?", answer: "We offer a range of..." },
        {
          question: "How quickly can you respond?",
          answer: "Standard projects within 24-48 hours...",
        },
      ];

      const schema = getFAQSchema(faqs, "/services/plumbing");

      schema.mainEntity.forEach((entity) => {
        expect(entity["@type"]).toBe("Question");
        expect(entity.name).toBeDefined();
        expect(entity.acceptedAnswer).toBeDefined();
        expect(entity.acceptedAnswer["@type"]).toBe("Answer");
        expect(entity.acceptedAnswer.text).toBeDefined();
      });
    });

    it("should handle empty FAQ array", () => {
      const schema = getFAQSchema([], "/services/plumbing");

      expect(schema.mainEntity).toEqual([]);
    });

    it("should include page URL in @id", () => {
      const faqs = [{ question: "What services do you offer?", answer: "We offer a range of..." }];

      const schema = getFAQSchema(faqs, "/services/plumbing");

      expect(schema["@id"]).toContain("/services/plumbing");
      expect(schema["@id"]).toContain("#faq");
    });
  });

  describe("Schema JSON-LD Validation", () => {
    it("should produce parseable JSON-LD for all schema types", () => {
      const breadcrumbSchema = getBreadcrumbSchema([
        { name: "Home", url: "/" },
        { name: "Services", url: "/services" },
      ]);
      const faqSchema = getFAQSchema(
        [{ question: "Test question?", answer: "Test answer." }],
        "/test"
      );

      [breadcrumbSchema, faqSchema].forEach((schema) => {
        const jsonString = JSON.stringify(schema);
        expect(() => JSON.parse(jsonString)).not.toThrow();
        expect(JSON.parse(jsonString)["@context"]).toBe("https://schema.org");
      });
    });
  });

  describe("Schema Required Fields Validation", () => {
    it("FAQPage schema should have all Google required fields", () => {
      const faqs = [{ question: "What services do you offer?", answer: "We offer a range of..." }];
      const schema = getFAQSchema(faqs, "/test");

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
