import { describe, it, expect } from "vitest";
import {
  deriveLocationContext,
  isLocationSpecificService,
  getAreaServed,
} from "@platform/core-components/lib/location-utils";

const KNOWN_LOCATIONS = ["brighton", "canterbury", "hastings"];

const AREA_MAP: Record<string, string[]> = {
  brighton: [
    "Brighton",
    "Brighton & Hove",
    "Hove",
    "The Lanes",
    "Kemptown",
    "Churchill Square",
    "Brighton Marina",
    "North Laine",
    "Preston Park",
    "Fiveways",
  ],
  canterbury: [
    "Canterbury",
    "Canterbury City Centre",
    "World Heritage Site Canterbury",
    "University of Kent",
    "Canterbury Cathedral Precinct",
    "Whitstable",
    "Herne Bay",
    "Faversham",
  ],
  hastings: [
    "Hastings",
    "Old Town Hastings",
    "St Leonards",
    "East Hill",
    "West Hill",
    "Ore",
    "Hollington",
    "Silverhill",
  ],
};

const DEFAULT_AREAS = ["East Sussex", "West Sussex", "Kent", "Surrey"];

describe("Location Utils", () => {
  describe("deriveLocationContext", () => {
    it("should detect Brighton location", () => {
      const context = deriveLocationContext("commercial-scaffolding-brighton", KNOWN_LOCATIONS);

      expect(context).toEqual({
        isLocationSpecific: true,
        location: "brighton",
        locationName: "Brighton",
        locationSlug: "brighton",
      });
    });

    it("should detect Canterbury location", () => {
      const context = deriveLocationContext("residential-scaffolding-canterbury", KNOWN_LOCATIONS);

      expect(context).toEqual({
        isLocationSpecific: true,
        location: "canterbury",
        locationName: "Canterbury",
        locationSlug: "canterbury",
      });
    });

    it("should detect Hastings location", () => {
      const context = deriveLocationContext("commercial-scaffolding-hastings", KNOWN_LOCATIONS);

      expect(context).toEqual({
        isLocationSpecific: true,
        location: "hastings",
        locationName: "Hastings",
        locationSlug: "hastings",
      });
    });

    it("should return null for non-location-specific service", () => {
      const context = deriveLocationContext("access-scaffolding", KNOWN_LOCATIONS);

      expect(context).toBeNull();
    });

    it("should return null for general commercial scaffolding", () => {
      const context = deriveLocationContext("commercial-scaffolding", KNOWN_LOCATIONS);

      expect(context).toBeNull();
    });

    it("should handle service with multiple hyphens", () => {
      const context = deriveLocationContext(
        "heavy-duty-industrial-scaffolding-brighton",
        KNOWN_LOCATIONS
      );

      expect(context?.location).toBe("brighton");
    });

    it("should return null when no known locations provided", () => {
      const context = deriveLocationContext("commercial-scaffolding-brighton");

      expect(context).toBeNull();
    });

    it("should return null when known locations is empty", () => {
      const context = deriveLocationContext("commercial-scaffolding-brighton", []);

      expect(context).toBeNull();
    });

    it("should match using endsWith not includes", () => {
      // "brighton-commercial-scaffolding" should NOT match brighton
      // because "brighton" is at the start, not the end
      const context = deriveLocationContext("brighton-commercial-scaffolding", KNOWN_LOCATIONS);

      expect(context).toBeNull();
    });

    it("should work with dynamically discovered locations", () => {
      const dynamicLocations = ["lewes", "eastbourne", "tunbridge-wells"];
      const context = deriveLocationContext("commercial-scaffolding-lewes", dynamicLocations);

      expect(context).toEqual({
        isLocationSpecific: true,
        location: "lewes",
        locationName: "Lewes",
        locationSlug: "lewes",
      });
    });
  });

  describe("isLocationSpecificService", () => {
    it("should return true for Brighton service", () => {
      expect(isLocationSpecificService("commercial-scaffolding-brighton", KNOWN_LOCATIONS)).toBe(
        true
      );
    });

    it("should return true for Canterbury service", () => {
      expect(isLocationSpecificService("residential-scaffolding-canterbury", KNOWN_LOCATIONS)).toBe(
        true
      );
    });

    it("should return true for Hastings service", () => {
      expect(isLocationSpecificService("commercial-scaffolding-hastings", KNOWN_LOCATIONS)).toBe(
        true
      );
    });

    it("should return false for non-location-specific service", () => {
      expect(isLocationSpecificService("access-scaffolding", KNOWN_LOCATIONS)).toBe(false);
    });

    it("should return false for general service", () => {
      expect(isLocationSpecificService("facade-scaffolding", KNOWN_LOCATIONS)).toBe(false);
    });

    it("should return false for empty string", () => {
      expect(isLocationSpecificService("", KNOWN_LOCATIONS)).toBe(false);
    });

    it("should return false when no known locations provided", () => {
      expect(isLocationSpecificService("commercial-scaffolding-brighton")).toBe(false);
    });
  });

  describe("getAreaServed", () => {
    it("should return Brighton areas for brighton", () => {
      const areas = getAreaServed("brighton", AREA_MAP, DEFAULT_AREAS);

      expect(areas).toContain("Brighton");
      expect(areas).toContain("Brighton & Hove");
      expect(areas).toContain("Hove");
      expect(areas).toContain("The Lanes");
      expect(areas).toContain("Kemptown");
      expect(areas).toContain("Brighton Marina");
      expect(areas.length).toBeGreaterThan(5);
    });

    it("should return Canterbury areas for canterbury", () => {
      const areas = getAreaServed("canterbury", AREA_MAP, DEFAULT_AREAS);

      expect(areas).toContain("Canterbury");
      expect(areas).toContain("Canterbury City Centre");
      expect(areas).toContain("World Heritage Site Canterbury");
      expect(areas).toContain("University of Kent");
      expect(areas).toContain("Canterbury Cathedral Precinct");
      expect(areas.length).toBeGreaterThan(5);
    });

    it("should return Hastings areas for hastings", () => {
      const areas = getAreaServed("hastings", AREA_MAP, DEFAULT_AREAS);

      expect(areas).toContain("Hastings");
      expect(areas).toContain("Old Town Hastings");
      expect(areas).toContain("St Leonards");
      expect(areas).toContain("East Hill");
      expect(areas).toContain("West Hill");
      expect(areas.length).toBeGreaterThan(5);
    });

    it("should return default areas for unknown location when defaults provided", () => {
      const areas = getAreaServed("unknown-location", AREA_MAP, DEFAULT_AREAS);

      expect(areas).toEqual(["East Sussex", "West Sussex", "Kent", "Surrey"]);
    });

    it("should return default areas for empty string when defaults provided", () => {
      const areas = getAreaServed("", AREA_MAP, DEFAULT_AREAS);

      expect(areas).toEqual(["East Sussex", "West Sussex", "Kent", "Surrey"]);
    });

    it("should return capitalized location name when no areaMap or defaults", () => {
      const areas = getAreaServed("lewes");

      expect(areas).toEqual(["Lewes"]);
    });

    it("should return empty array for empty string with no areaMap or defaults", () => {
      const areas = getAreaServed("");

      expect(areas).toEqual([]);
    });

    it("should return arrays (not other types)", () => {
      expect(Array.isArray(getAreaServed("brighton", AREA_MAP))).toBe(true);
      expect(Array.isArray(getAreaServed("unknown"))).toBe(true);
    });
  });

  describe("Integration - deriveLocationContext with getAreaServed", () => {
    it("should work together for Brighton", () => {
      const context = deriveLocationContext("commercial-scaffolding-brighton", KNOWN_LOCATIONS);

      if (context) {
        const areas = getAreaServed(context.location, AREA_MAP, DEFAULT_AREAS);
        expect(areas).toContain("Brighton");
      }
    });

    it("should work together for Canterbury", () => {
      const context = deriveLocationContext("residential-scaffolding-canterbury", KNOWN_LOCATIONS);

      if (context) {
        const areas = getAreaServed(context.location, AREA_MAP, DEFAULT_AREAS);
        expect(areas).toContain("Canterbury");
      }
    });

    it("should use default areas when no location context", () => {
      const context = deriveLocationContext("access-scaffolding", KNOWN_LOCATIONS);

      if (context === null) {
        const areas = getAreaServed("", AREA_MAP, DEFAULT_AREAS);
        expect(areas).toEqual(["East Sussex", "West Sussex", "Kent", "Surrey"]);
      }
    });
  });
});
