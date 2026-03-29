import { describe, it, expect } from "vitest";
import { ServiceFrontmatterSchema, LocationFrontmatterSchema } from "@platform/core-components";

describe("Content Schemas", () => {
  describe("ServiceFrontmatterSchema", () => {
    const validService = {
      title: "Primary Service Solutions",
      description:
        "Professional primary service for residential and commercial clients across the region.",
      benefits: ["Fully insured", "Qualified team", "24/7 support"],
      faqs: [
        {
          question: "What is your primary service?",
          answer: "Our primary service provides professional solutions for all client needs.",
        },
        {
          question: "How quickly can you start?",
          answer: "Standard projects can begin within 24-48 hours of initial consultation.",
        },
        {
          question: "Do you provide certificates?",
          answer: "Yes, full documentation and certificates are provided on completion.",
        },
      ],
    };

    it("should validate valid service frontmatter", () => {
      expect(() => ServiceFrontmatterSchema.parse(validService)).not.toThrow();
    });

    describe("Title validation", () => {
      it("should reject title under 5 characters", () => {
        const invalid = { ...validService, title: "Svc" };
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
      title: "Main Area",
      seoTitle: "Main Area Services | Your Business Name",
      description:
        "Professional services in Main Area - residential, commercial, and specialist work.",
      hero: {
        title: "Professional Services in Main Area",
        description: "Expert services for all residential and commercial needs.",
        phone: "+44 1234 567890",
        trustBadges: ["Fully Insured", "Qualified Team", "Local Experts"],
        ctaText: "Get Your Free Quote",
        ctaUrl: "/contact",
      },
      faqs: [
        {
          question: "Do you cover the Main Area?",
          answer: "Yes, we provide full coverage across the Main Area and surrounding locations.",
        },
        {
          question: "What is your typical response time?",
          answer: "We can usually start within 24-48 hours of initial consultation.",
        },
        {
          question: "Are you fully insured?",
          answer: "Yes, we carry comprehensive public liability insurance covering all work areas.",
        },
        {
          question: "Do you work on residential properties?",
          answer: "Yes, we have extensive experience with residential and commercial properties.",
        },
        {
          question: "What areas of the region do you cover?",
          answer: "We cover all areas including Main Area, North Region, and South Region.",
        },
      ],
    };

    it("should validate valid location frontmatter", () => {
      expect(() => LocationFrontmatterSchema.parse(validLocation)).not.toThrow();
    });

    describe("Title validation", () => {
      it("should reject title under 2 characters", () => {
        const invalid = { ...validLocation, title: "A" };
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
        const invalid = { ...validLocation, seoTitle: "Main" };
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
      it("should accept location without hero object", () => {
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
