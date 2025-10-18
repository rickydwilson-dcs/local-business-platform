// lib/services-data.ts

export interface ServiceData {
  description?: string;
  badge?: string;
  image?: string;
  features?: string[];
  subtitle?: string[];
}

export function getServiceData(slug: string): ServiceData {
  const serviceMap: Record<string, ServiceData> = {
    "commercial-scaffolding": {
      description:
        "Professional commercial scaffolding for office buildings, retail developments, and business districts across the South East UK.",
      badge: "Business Focus",
      image: "colossus-reference/hero/service/commercial-scaffolding_canterbury.webp",
      subtitle: ["Office Buildings", "Retail Centers"],
      features: [
        "Business Continuity Planning",
        "Pedestrian Protection Systems",
        "Out-of-hours Installation",
        "Minimal Disruption Methods",
      ],
    },
    "residential-scaffolding": {
      description:
        "Safe, reliable scaffolding for homes, extensions, and renovations. Family-friendly approach with minimal garden disruption.",
      badge: "Family Friendly",
      image: "colossus-reference/hero/service/residential-scaffolding_canterbury.webp",
      subtitle: ["Victorian Houses", "Modern Homes"],
      features: [
        "Garden & Property Protection",
        "Family Schedule Coordination",
        "Heritage Property Expertise",
        "TG20:21 Compliant",
      ],
    },
    "industrial-scaffolding": {
      description:
        "Heavy-duty scaffolding systems for industrial facilities, ports, and manufacturing sites. Engineered for complex structural challenges.",
      badge: "Heavy Duty",
      image: "colossus-reference/hero/service/industrial-scaffolding_01.webp",
      subtitle: ["Manufacturing Sites", "Port Operations"],
      features: [
        "Heavy-duty Load Capacity",
        "Specialized Access Solutions",
        "Long-term Project Support",
        "Industrial Safety Compliance",
      ],
    },
    "access-scaffolding": {
      description:
        "Safe, compliant access scaffolding for residential, commercial and industrial projects across the South East UK.",
      badge: "Most Popular",
      image: "colossus-reference/hero/service/access-scaffolding_01.webp",
      features: ["TG20:21 Compliant", "CISRS Qualified Teams", "Full Insurance Coverage"],
    },
    "facade-scaffolding": {
      description:
        "Professional facade scaffolding solutions for building maintenance, renovation and construction projects.",
      image: "colossus-reference/hero/service/facade-scaffolding_01.webp",
      features: ["Weatherproof Systems", "Load Bearing Design", "Planning Compliance"],
    },
    "edge-protection": {
      description:
        "Comprehensive edge protection systems ensuring maximum safety on construction and maintenance sites.",
      image: "colossus-reference/hero/service/edge-protection_01.webp",
      features: ["HSE Compliant", "Rapid Installation", "Adjustable Systems"],
    },
    "temporary-roof-systems": {
      description:
        "Weather protection and temporary roofing solutions for ongoing construction and maintenance work.",
      image: "colossus-reference/hero/service/temporary-roof-systems_01.webp",
      features: ["Weatherproof", "Load Rated", "Quick Assembly"],
    },
    "birdcage-scaffolds": {
      description:
        "Independent scaffold structures providing comprehensive access for complex commercial and industrial projects.",
      image: "colossus-reference/hero/service/birdcage-scaffolds_01.webp",
      features: ["Independent Structure", "Heavy Duty", "Complex Access"],
    },
    "scaffold-towers-mast-systems": {
      description:
        "Mobile and static scaffold towers for flexible access solutions on various project types.",
      image: "colossus-reference/hero/service/scaffold-towers-mast-systems_02.webp",
      features: ["Mobile & Static", "Height Adjustable", "Quick Setup"],
    },
    "crash-decks-crane-decks": {
      description:
        "Protective crash decks and crane decks ensuring safety during construction operations.",
      image: "colossus-reference/hero/service/crash-decks-crane-decks_02.webp",
      features: ["Load Bearing", "Safety Compliance", "Custom Design"],
    },
    "heavy-duty-industrial-scaffolding": {
      description:
        "Heavy-duty scaffolding solutions for complex industrial projects and infrastructure work.",
      image: "colossus-reference/hero/service/industrial-scaffolding_01.webp",
      features: ["Heavy Load Capacity", "Industrial Grade", "Complex Structures"],
    },
    "pavement-gantries-loading-bays": {
      description:
        "Specialized pavement gantries and loading bay solutions for urban construction projects.",
      image: "colossus-reference/hero/service/pavement-gantries-loading-bays_01.webp",
      features: ["Urban Solutions", "Pedestrian Safety", "Loading Access"],
    },
    "public-access-staircases": {
      description: "Safe and compliant public access staircase systems for construction sites.",
      image: "colossus-reference/hero/service/public-access-staircases_01.webp",
      features: ["Public Safety", "Accessible Design", "Code Compliant"],
    },
    "scaffold-alarms": {
      description:
        "Advanced scaffold alarm systems for enhanced site security and safety monitoring.",
      image: "colossus-reference/hero/service/scaffold-alarms_01.webp",
      features: ["24/7 Monitoring", "Instant Alerts", "Security Integration"],
    },
    "scaffolding-design-drawings": {
      description:
        "Professional scaffolding design and technical drawings ensuring structural integrity and compliance with all safety regulations.",
      image: "colossus-reference/hero/service/scaffolding-design-drawings_01.webp",
      features: ["CAD Drawings", "Load Calculations", "Safety Compliance"],
    },
    "scaffolding-inspections-maintenance": {
      description:
        "Comprehensive scaffolding inspections and maintenance services ensuring ongoing safety compliance and structural integrity.",
      image: "colossus-reference/hero/service/scaffolding-inspections-maintenance_02.webp",
      features: ["Weekly Inspections", "Detailed Reports", "Maintenance Scheduling"],
    },
    "sheeting-netting-encapsulation": {
      description:
        "Weather protection and safety encapsulation systems including scaffolding sheeting, debris netting, and full encapsulation solutions.",
      image: "colossus-reference/hero/service/sheeting-netting-encapsulation_01.webp",
      features: ["Weather Protection", "Debris Netting", "Fire-Retardant Materials"],
    },
    "staircase-towers": {
      description:
        "Safe and compliant staircase tower systems providing secure vertical access for construction and maintenance projects.",
      image: "colossus-reference/hero/service/staircase-towers_01.webp",
      features: ["Safe Vertical Access", "Compliant Design", "Handrail Systems"],
    },
    "suspended-scaffolding": {
      description:
        "Specialized suspended scaffolding systems for high-rise building maintenance and construction work requiring overhead access.",
      image: "colossus-reference/hero/service/suspended-scaffolding_01.webp",
      features: ["High-Rise Access", "Suspended Platforms", "Safety Harness Integration"],
    },
  };

  return (
    serviceMap[slug] || {
      description: "Professional scaffolding solution with full compliance and safety standards.",
      features: ["TG20:21 Compliant", "Fully Insured", "Professional Installation"],
    }
  );
}
