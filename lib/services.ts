// /lib/services.ts
export type Service = {
  slug: string;
  name: string;
  intro?: string;
};

export const services: Service[] = [
  { slug: "access-scaffolding", name: "Access Scaffolding", intro: "Safe access for any site." },
  { slug: "facade-scaffolding", name: "Façade Scaffolding" },
  { slug: "temporary-roof-systems", name: "Temporary Roof Systems" },
  { slug: "suspended-scaffolding", name: "Suspended Scaffolding" },
  { slug: "public-access-staircases", name: "Public Access Staircases" },
  { slug: "pavement-gantries-loading-bays", name: "Pavement Gantries & Loading Bays" },
  { slug: "heavy-duty-industrial-scaffolding", name: "Heavy Duty / Industrial Scaffolding" },
  { slug: "scaffold-towers-mast-systems", name: "Scaffold Towers & Mast Systems" },
  { slug: "crash-decks-crane-decks", name: "Crash Decks & Crane Decks" },
  { slug: "sheeting-netting-encapsulation", name: "Sheeting, Netting & Encapsulation" },
  { slug: "scaffolding-design-drawings", name: "Scaffolding Design & Drawings" },
  { slug: "scaffolding-inspections-maintenance", name: "Scaffolding Inspections & Maintenance" },
  { slug: "edge-protection", name: "Edge Protection" },
  { slug: "birdcage-scaffolds", name: "Birdcage Scaffolds" },
  { slug: "scaffold-alarms", name: "Scaffold Alarms" },
  { slug: "staircase-towers", name: "Staircase Towers" },
];

export const serviceBySlug = (slug: string) => services.find(s => s.slug === slug);
