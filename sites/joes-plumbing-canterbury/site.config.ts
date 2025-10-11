export const siteConfig = {
  name: "Joe's Plumbing Canterbury",
  title: "Joe's Plumbing Canterbury | Emergency Plumber & Heating Services",
  description:
    "Professional plumbing and heating services in Canterbury and surrounding areas. 24/7 emergency callouts, boiler repairs, installations, and maintenance.",
  url: "https://joes-plumbing-canterbury.vercel.app",
  business: {
    name: "Joe's Plumbing Canterbury",
    legalName: "Joe's Plumbing Services Ltd",
    phone: "01227 123456",
    email: "info@joesplumbingcanterbury.co.uk",
    address: {
      street: "123 High Street",
      city: "Canterbury",
      county: "Kent",
      postcode: "CT1 1AA",
      country: "United Kingdom",
    },
    hours: {
      weekday: "Mon-Fri: 8:00 AM - 6:00 PM",
      weekend: "Sat: 9:00 AM - 4:00 PM",
      emergency: "24/7 Emergency Service Available",
    },
    social: {
      facebook: "https://facebook.com/joesplumbingcanterbury",
      twitter: "https://twitter.com/joesplumbing",
      instagram: "https://instagram.com/joesplumbingcanterbury",
    },
    certifications: [
      "Gas Safe Registered",
      "Chartered Institute of Plumbing and Heating Engineering (CIPHE)",
      "Water Industry Approved Plumber Scheme (WIAPS)",
    ],
  },
  services: {
    primary: [
      "Emergency Plumbing",
      "Boiler Installation & Repair",
      "Central Heating",
      "Bathroom Installation",
      "Drainage Services",
    ],
    serviceArea: [
      "Canterbury",
      "Whitstable",
      "Herne Bay",
      "Faversham",
      "Ashford",
    ],
  },
  theme: {
    primary: "#059669", // Emerald green
    secondary: "#047857", // Darker green
    accent: "#10b981", // Lighter emerald
    background: "#f0fdf4", // Light green tint
  },
  analytics: {
    googleAnalyticsId: process.env.NEXT_PUBLIC_GA_ID,
    facebookPixelId: process.env.NEXT_PUBLIC_FB_PIXEL_ID,
  },
};

export default siteConfig;
