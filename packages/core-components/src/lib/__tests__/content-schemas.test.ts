import { describe, it, expect } from "vitest";
import { ServiceFrontmatterSchema, LocationFrontmatterSchema } from "../content-schemas";

describe("Content Schemas", () => {
  describe("ServiceFrontmatterSchema", () => {
    const validService = {
      title: "Access Scaffolding Services",
      description:
        "Professional access scaffolding across the South East UK for safe working at height.",
      benefits: ["TG20:21 compliant", "CISRS qualified", "24/7 support"],
      faqs: [
        {
          question: "What is access scaffolding?",
          answer: "Access scaffolding provides safe working platforms for height access.",
        },
        {
          question: "How quickly can you install?",
          answer: "Standard projects within 24-48 hours of survey.",
        },
        {
          question: "Do you provide certificates?",
          answer: "Yes, full handover certificates and inspection records.",
        },
      ],
    };

    it("should validate valid service frontmatter", () => {
      expect(() => ServiceFrontmatterSchema.parse(validService)).not.toThrow();
    });

    describe("Title validation", () => {
      it("should reject title under 5 characters", () => {
        const invalid = { ...validService, title: "Scaf" };
        expect(() => ServiceFrontmatterSchema.parse(invalid)).toThrow();
      });

      it("should reject title over 100 characters", () => {
        const invalid = {
          ...validService,
          title: "A".repeat(101),
        };
        expect(() => ServiceFrontmatterSchema.parse(invalid)).toThrow();
      });
    });

    describe("Description validation", () => {
      it("should reject description under 50 characters", () => {
        const invalid = { ...validService, description: "Too short" };
        expect(() => ServiceFrontmatterSchema.parse(invalid)).toThrow(/at least 50 characters/);
      });

      it("should reject description over 200 characters", () => {
        const invalid = {
          ...validService,
          description: "A".repeat(201),
        };
        expect(() => ServiceFrontmatterSchema.parse(invalid)).toThrow(/under 200 characters/);
      });

      it("should accept description at minimum length (50 chars)", () => {
        const valid = {
          ...validService,
          description: "A".repeat(50),
        };
        expect(() => ServiceFrontmatterSchema.parse(valid)).not.toThrow();
      });

      it("should accept description at maximum length (200 chars)", () => {
        const valid = {
          ...validService,
          description: "A".repeat(200),
        };
        expect(() => ServiceFrontmatterSchema.parse(valid)).not.toThrow();
      });
    });

    describe("FAQs validation", () => {
      it("should reject less than 3 FAQs", () => {
        const invalid = {
          ...validService,
          faqs: [
            {
              question: "Valid question here?",
              answer: "This is a valid answer with enough characters.",
            },
            {
              question: "Another valid question?",
              answer: "Another valid answer with enough length.",
            },
          ],
        };
        expect(() => ServiceFrontmatterSchema.parse(invalid)).toThrow();
      });

      it("should reject more than 15 FAQs", () => {
        const invalid = {
          ...validService,
          faqs: Array(16).fill({
            question: "What is a question here?",
            answer: "This is a valid answer that is long enough to pass.",
          }),
        };
        expect(() => ServiceFrontmatterSchema.parse(invalid)).toThrow(/Maximum 15 FAQs/);
      });

      it("should reject FAQ with short question", () => {
        const invalid = {
          ...validService,
          faqs: [
            { question: "Q?", answer: "This is a valid answer." },
            { question: "Valid question?", answer: "Valid answer here is good." },
            { question: "Another valid?", answer: "Another answer that works." },
          ],
        };
        expect(() => ServiceFrontmatterSchema.parse(invalid)).toThrow(/at least 10 characters/);
      });

      it("should reject FAQ with short answer", () => {
        const invalid = {
          ...validService,
          faqs: [
            { question: "Valid question here?", answer: "Too short" },
            { question: "Valid question here?", answer: "This is a valid answer." },
            { question: "Another valid question?", answer: "Another valid answer." },
          ],
        };
        expect(() => ServiceFrontmatterSchema.parse(invalid)).toThrow(/at least 20 characters/);
      });
    });

    describe("Optional fields", () => {
      it("should allow service without description", () => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { description, ...withoutDescription } = validService;
        expect(() => ServiceFrontmatterSchema.parse(withoutDescription)).not.toThrow();
      });

      it("should allow service with empty benefits array", () => {
        const valid = { ...validService, benefits: [] };
        expect(() => ServiceFrontmatterSchema.parse(valid)).not.toThrow();
      });
    });
  });

  describe("LocationFrontmatterSchema", () => {
    const validLocation = {
      title: "Brighton",
      seoTitle: "Brighton Scaffolding Services | Colossus Scaffolding",
      description:
        "Professional scaffolding in Brighton - seafront projects, Victorian terraces, commercial developments.",
      hero: {
        title: "Professional Scaffolding in Brighton",
        description: "Expert scaffolding for coastal properties and Victorian buildings.",
        phone: "01424 466 661",
        trustBadges: ["TG20:21 Compliant", "CHAS Accredited", "Heritage Specialists"],
        ctaText: "Get Your Free Quote",
        ctaUrl: "/contact",
      },
      faqs: [
        {
          question: "Do you handle coastal projects?",
          answer: "Yes, we specialize in marine-grade scaffolding for coastal properties.",
        },
        {
          question: "What is your typical response time?",
          answer: "We can usually start within 24-48 hours of survey completion.",
        },
        {
          question: "Are you insured for Brighton work?",
          answer: "Yes, we carry £10M public liability insurance covering all areas.",
        },
        {
          question: "Do you work on heritage buildings?",
          answer: "Yes, we have extensive experience with listed buildings and conservation areas.",
        },
        {
          question: "What areas of Brighton do you cover?",
          answer: "We cover all areas including Brighton, Hove, The Lanes, and surrounding areas.",
        },
      ],
    };

    it("should validate valid location frontmatter", () => {
      expect(() => LocationFrontmatterSchema.parse(validLocation)).not.toThrow();
    });

    describe("Title validation", () => {
      it("should reject title under 2 characters", () => {
        const invalid = { ...validLocation, title: "B" };
        expect(() => LocationFrontmatterSchema.parse(invalid)).toThrow();
      });

      it("should reject title over 50 characters", () => {
        const invalid = {
          ...validLocation,
          title: "A".repeat(51),
        };
        expect(() => LocationFrontmatterSchema.parse(invalid)).toThrow();
      });
    });

    describe("SEO Title validation", () => {
      it("should reject SEO title under 10 characters", () => {
        const invalid = { ...validLocation, seoTitle: "Brighton" };
        expect(() => LocationFrontmatterSchema.parse(invalid)).toThrow();
      });

      it("should reject SEO title over 80 characters", () => {
        const invalid = {
          ...validLocation,
          seoTitle: "A".repeat(81),
        };
        expect(() => LocationFrontmatterSchema.parse(invalid)).toThrow();
      });
    });

    describe("Description validation", () => {
      it("should reject description under 50 characters", () => {
        const invalid = { ...validLocation, description: "Too short description" };
        expect(() => LocationFrontmatterSchema.parse(invalid)).toThrow();
      });

      it("should reject description over 200 characters", () => {
        const invalid = {
          ...validLocation,
          description: "A".repeat(201),
        };
        expect(() => LocationFrontmatterSchema.parse(invalid)).toThrow();
      });
    });

    describe("Hero validation", () => {
      it("should accept location without hero (hero is optional)", () => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { hero, ...withoutHero } = validLocation;
        expect(() => LocationFrontmatterSchema.parse(withoutHero)).not.toThrow();
      });
    });

    describe("FAQs validation", () => {
      it("should reject less than 5 FAQs when provided", () => {
        const invalid = {
          ...validLocation,
          faqs: [
            {
              question: "Valid question here?",
              answer: "This is a valid answer with enough characters.",
            },
            {
              question: "Another question?",
              answer: "Another valid answer with enough length.",
            },
            {
              question: "Third question here?",
              answer: "Third answer that has enough characters too.",
            },
          ],
        };
        expect(() => LocationFrontmatterSchema.parse(invalid)).toThrow();
      });
    });
  });
});
