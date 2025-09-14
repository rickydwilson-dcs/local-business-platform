// lib/services-data.ts

export interface ServiceData {
  description?: string;
  badge?: string;
  image?: string;
  features?: string[];
}

export function getServiceData(slug: string): ServiceData {
  const serviceMap: Record<string, ServiceData> = {
    "access-scaffolding": {
      description: "Safe, compliant access scaffolding for residential, commercial and industrial projects across the South East UK.",
      badge: "Most Popular",
      image: "/Access Scaffolding new build.png",
      features: ["TG20:21 Compliant", "CISRS Qualified Teams", "Full Insurance Coverage"]
    },
    "facade-scaffolding": {
      description: "Professional facade scaffolding solutions for building maintenance, renovation and construction projects.",
      image: "/Facade Scaffolding.png",
      features: ["Weatherproof Systems", "Load Bearing Design", "Planning Compliance"]
    },
    "edge-protection": {
      description: "Comprehensive edge protection systems ensuring maximum safety on construction and maintenance sites.",
      image: "/Edge Protection.png",
      features: ["HSE Compliant", "Rapid Installation", "Adjustable Systems"]
    },
    "temporary-roof-systems": {
      description: "Weather protection and temporary roofing solutions for ongoing construction and maintenance work.",
      image: "/Temporary Roof Systems.png",
      features: ["Weatherproof", "Load Rated", "Quick Assembly"]
    },
    "birdcage-scaffolds": {
      description: "Independent scaffold structures providing comprehensive access for complex commercial and industrial projects.",
      image: "/Birdcage scaffolding.png",
      features: ["Independent Structure", "Heavy Duty", "Complex Access"]
    },
    "scaffold-towers-mast-systems": {
      description: "Mobile and static scaffold towers for flexible access solutions on various project types.",
      image: "/Scaffold Towers & Mast Systems.png",
      features: ["Mobile & Static", "Height Adjustable", "Quick Setup"]
    },
    "crash-decks-crane-decks": {
      description: "Protective crash decks and crane decks ensuring safety during construction operations.",
      image: "/Crash Decks & Crane Decks.png",
      features: ["Load Bearing", "Safety Compliance", "Custom Design"]
    },
    "heavy-duty-industrial-scaffolding": {
      description: "Heavy-duty scaffolding solutions for complex industrial projects and infrastructure work.",
      image: "/Heavy Industrial Scaffolding.png",
      features: ["Heavy Load Capacity", "Industrial Grade", "Complex Structures"]
    },
    "pavement-gantries-loading-bays": {
      description: "Specialized pavement gantries and loading bay solutions for urban construction projects.",
      image: "/Pavement Gantries Loading Bays.png",
      features: ["Urban Solutions", "Pedestrian Safety", "Loading Access"]
    },
    "public-access-staircases": {
      description: "Safe and compliant public access staircase systems for construction sites.",
      image: "/Public Access Staircases.png",
      features: ["Public Safety", "Accessible Design", "Code Compliant"]
    },
    "scaffold-alarms": {
      description: "Advanced scaffold alarm systems for enhanced site security and safety monitoring.",
      image: "/Scaffold Alarms.png",
      features: ["24/7 Monitoring", "Instant Alerts", "Security Integration"]
    },
    "scaffolding-design-drawings": {
      description: "Professional scaffolding design and technical drawings ensuring structural integrity and compliance with all safety regulations.",
      image: "/Scaffolding Design & Drawings.png",
      features: ["CAD Drawings", "Load Calculations", "Safety Compliance"]
    },
    "scaffolding-inspections-maintenance": {
      description: "Comprehensive scaffolding inspections and maintenance services ensuring ongoing safety compliance and structural integrity.",
      image: "/Scaffolding Inspections & Maintenance.png",
      features: ["Weekly Inspections", "Detailed Reports", "Maintenance Scheduling"]
    },
    "sheeting-netting-encapsulation": {
      description: "Weather protection and safety encapsulation systems including scaffolding sheeting, debris netting, and full encapsulation solutions.",
      image: "/Sheeting Netting Encapsulation.png",
      features: ["Weather Protection", "Debris Netting", "Fire-Retardant Materials"]
    },
    "staircase-towers": {
      description: "Safe and compliant staircase tower systems providing secure vertical access for construction and maintenance projects.",
      image: "/Staircase Towers.png",
      features: ["Safe Vertical Access", "Compliant Design", "Handrail Systems"]
    },
    "suspended-scaffolding": {
      description: "Specialized suspended scaffolding systems for high-rise building maintenance and construction work requiring overhead access.",
      image: "/Suspended Scaffolding.png",
      features: ["High-Rise Access", "Suspended Platforms", "Safety Harness Integration"]
    }
  };

  return serviceMap[slug] || {
    description: "Professional scaffolding solution with full compliance and safety standards.",
    features: ["TG20:21 Compliant", "Fully Insured", "Professional Installation"]
  };
}