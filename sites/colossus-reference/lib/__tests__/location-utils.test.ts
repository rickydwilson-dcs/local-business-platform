import { describe, it, expect } from "vitest";
import { deriveLocationContext, isLocationSpecificService, getAreaServed } from "../location-utils";

describe("Location Utils", () => {
  describe("deriveLocationContext", () => {
    it("should detect Brighton location", () => {
      const context = deriveLocationContext("commercial-scaffolding-brighton");

      expect(context).toEqual({
        isLocationSpecific: true,
        location: "brighton",
        locationName: "Brighton",
        locationSlug: "brighton",
      });
    });

    it("should detect Canterbury location", () => {
      const context = deriveLocationContext("residential-scaffolding-canterbury");

      expect(context).toEqual({
        isLocationSpecific: true,
        location: "canterbury",
        locationName: "Canterbury",
        locationSlug: "canterbury",
      });
    });

    it("should detect Hastings location", () => {
      const context = deriveLocationContext("commercial-scaffolding-hastings");

      expect(context).toEqual({
        isLocationSpecific: true,
        location: "hastings",
        locationName: "Hastings",
        locationSlug: "hastings",
      });
    });

    it("should return null for non-location-specific service", () => {
      const context = deriveLocationContext("access-scaffolding");

      expect(context).toBeNull();
    });

    it("should return null for general commercial scaffolding", () => {
      const context = deriveLocationContext("commercial-scaffolding");

      expect(context).toBeNull();
    });

    it("should handle service with multiple hyphens", () => {
      const context = deriveLocationContext("heavy-duty-industrial-scaffolding-brighton");

      expect(context?.location).toBe("brighton");
    });
  });

  describe("isLocationSpecificService", () => {
    it("should return true for Brighton service", () => {
      expect(isLocationSpecificService("commercial-scaffolding-brighton")).toBe(true);
    });

    it("should return true for Canterbury service", () => {
      expect(isLocationSpecificService("residential-scaffolding-canterbury")).toBe(true);
    });

    it("should return true for Hastings service", () => {
      expect(isLocationSpecificService("commercial-scaffolding-hastings")).toBe(true);
    });

    it("should return false for non-location-specific service", () => {
      expect(isLocationSpecificService("access-scaffolding")).toBe(false);
    });

    it("should return false for general service", () => {
      expect(isLocationSpecificService("facade-scaffolding")).toBe(false);
    });

    it("should return false for empty string", () => {
      expect(isLocationSpecificService("")).toBe(false);
    });
  });

  describe("getAreaServed", () => {
    it("should return Brighton areas for brighton", () => {
      const areas = getAreaServed("brighton");

      expect(areas).toContain("Brighton");
      expect(areas).toContain("Brighton & Hove");
      expect(areas).toContain("Hove");
      expect(areas).toContain("The Lanes");
      expect(areas).toContain("Kemptown");
      expect(areas).toContain("Brighton Marina");
      expect(areas.length).toBeGreaterThan(5);
    });

    it("should return Canterbury areas for canterbury", () => {
      const areas = getAreaServed("canterbury");

      expect(areas).toContain("Canterbury");
      expect(areas).toContain("Canterbury City Centre");
      expect(areas).toContain("World Heritage Site Canterbury");
      expect(areas).toContain("University of Kent");
      expect(areas).toContain("Canterbury Cathedral Precinct");
      expect(areas.length).toBeGreaterThan(5);
    });

    it("should return Hastings areas for hastings", () => {
      const areas = getAreaServed("hastings");

      expect(areas).toContain("Hastings");
      expect(areas).toContain("Old Town Hastings");
      expect(areas).toContain("St Leonards");
      expect(areas).toContain("East Hill");
      expect(areas).toContain("West Hill");
      expect(areas.length).toBeGreaterThan(5);
    });

    it("should return default areas for unknown location", () => {
      const areas = getAreaServed("unknown-location");

      expect(areas).toEqual(["East Sussex", "West Sussex", "Kent", "Surrey"]);
    });

    it("should return default areas for empty string", () => {
      const areas = getAreaServed("");

      expect(areas).toEqual(["East Sussex", "West Sussex", "Kent", "Surrey"]);
    });

    it("should return arrays (not other types)", () => {
      expect(Array.isArray(getAreaServed("brighton"))).toBe(true);
      expect(Array.isArray(getAreaServed("unknown"))).toBe(true);
    });
  });

  describe("Integration - deriveLocationContext with getAreaServed", () => {
    it("should work together for Brighton", () => {
      const context = deriveLocationContext("commercial-scaffolding-brighton");

      if (context) {
        const areas = getAreaServed(context.location);
        expect(areas).toContain("Brighton");
      }
    });

    it("should work together for Canterbury", () => {
      const context = deriveLocationContext("residential-scaffolding-canterbury");

      if (context) {
        const areas = getAreaServed(context.location);
        expect(areas).toContain("Canterbury");
      }
    });

    it("should use default areas when no location context", () => {
      const context = deriveLocationContext("access-scaffolding");

      if (context === null) {
        const areas = getAreaServed("");
        expect(areas).toEqual(["East Sussex", "West Sussex", "Kent", "Surrey"]);
      }
    });
  });
});
