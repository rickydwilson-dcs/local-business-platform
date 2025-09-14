interface ServiceAboutProps {
  serviceName: string;
  slug: string;
}

interface ServiceContent {
  whatIs: string;
  whenNeeded: string[];
  whatAchieve: string[];
  keyPoints: string[];
}

function getServiceContent(slug: string): ServiceContent {
  const contentMap: Record<string, ServiceContent> = {
    "access-scaffolding": {
      whatIs: "Access scaffolding is a temporary structure system designed to provide safe, stable working platforms at various heights for construction, maintenance, and repair work. Our TG20:21 compliant access scaffolding creates secure walkways, working platforms, and access routes that enable tradespeople to work safely and efficiently on buildings, structures, and other elevated areas.",
      whenNeeded: [
        "Building maintenance and exterior repairs",
        "Window cleaning and replacement projects", 
        "Painting and rendering work on facades",
        "Roof repairs and gutter maintenance",
        "Construction and renovation projects",
        "Industrial facility maintenance",
        "Historic building restoration work",
        "Emergency make-safe operations"
      ],
      whatAchieve: [
        "Safe working at height with full fall protection",
        "Improved productivity through stable working platforms",
        "Compliance with health and safety regulations",
        "Access to difficult or dangerous areas",
        "Protection for workers and the public below",
        "Professional finish on construction projects",
        "Cost-effective solution for height-based work"
      ],
      keyPoints: [
        "TG20:21 compliant design ensuring latest safety standards",
        "CISRS qualified scaffolders with extensive experience",
        "Suitable for residential, commercial, and industrial projects",
        "Free site surveys and detailed quotations provided"
      ]
    },
    "facade-scaffolding": {
      whatIs: "Facade scaffolding provides comprehensive external access for building maintenance, renovation, and construction projects. Our weatherproof facade systems offer complete coverage of building exteriors while maintaining structural integrity and providing safe working platforms for extended periods.",
      whenNeeded: [
        "External building renovations and refurbishments",
        "Facade cleaning and maintenance work",
        "Window replacement on multi-story buildings",
        "External wall insulation installations",
        "Brick pointing and stone restoration work",
        "External painting and rendering projects",
        "Roof work requiring perimeter access",
        "Historic building conservation projects"
      ],
      whatAchieve: [
        "Complete building facade access coverage",
        "Weather protection for ongoing work",
        "Load-bearing capacity for heavy materials",
        "Extended project duration capability",
        "Professional appearance for urban sites",
        "Debris containment and public safety",
        "Flexible working platform configurations"
      ],
      keyPoints: [
        "Weatherproof systems for year-round operation",
        "Load-bearing design for heavy-duty applications",
        "Planning permission assistance and compliance",
        "Professional installation with full certification"
      ]
    },
    "edge-protection": {
      whatIs: "Edge protection systems provide essential fall prevention barriers for workers operating near roof edges, floor openings, and elevated surfaces. Our HSE compliant edge protection solutions offer maximum safety assurance for construction and maintenance projects across all building types.",
      whenNeeded: [
        "Roof maintenance and repair work",
        "New construction and building extensions",
        "Solar panel installations on rooftops",
        "HVAC equipment installation and maintenance",
        "Gutter cleaning and roof inspections",
        "Temporary roof access requirements",
        "Building compliance and safety audits",
        "Emergency roof repairs and make-safe"
      ],
      whatAchieve: [
        "HSE compliant fall protection systems",
        "Immediate safety barrier installation",
        "Reduced insurance liability and risk",
        "Regulatory compliance assurance",
        "Worker confidence and productivity",
        "Temporary and permanent solutions",
        "Cost-effective safety implementation"
      ],
      keyPoints: [
        "HSE compliant design and installation standards",
        "Rapid deployment for emergency situations",
        "Adjustable height options for various applications",
        "Regular inspection and maintenance services"
      ]
    },
    "temporary-roof-systems": {
      whatIs: "Temporary roof systems provide weather protection and structural coverage for ongoing construction and maintenance projects. Our load-rated temporary roofing solutions ensure work can continue regardless of weather conditions while protecting both workers and building interiors.",
      whenNeeded: [
        "Roof replacement projects requiring weather cover",
        "Historic building restoration work",
        "Construction projects needing dry working areas",
        "Emergency weather protection requirements",
        "Industrial maintenance in exposed areas",
        "Winter construction project continuity",
        "Building conservation and heritage work",
        "Multi-phase roofing installations"
      ],
      whatAchieve: [
        "Complete weather protection coverage",
        "Uninterrupted work progress schedules",
        "Protection of building contents and interiors",
        "Extended working season capability",
        "Worker comfort and safety improvement",
        "Reduced weather-related project delays",
        "Cost savings on weather damage prevention"
      ],
      keyPoints: [
        "Load-rated structures for heavy weather conditions",
        "Quick assembly systems for rapid deployment",
        "Custom design solutions for complex projects",
        "Integrated drainage and gutter systems"
      ]
    },
    "birdcage-scaffolds": {
      whatIs: "Birdcage scaffold systems are independent structures providing comprehensive access solutions for complex commercial and industrial projects. These versatile scaffolding systems offer extensive coverage areas with multiple working levels, ideal for large-scale construction and maintenance operations.",
      whenNeeded: [
        "Large commercial building construction",
        "Industrial facility maintenance and upgrades",
        "Multi-story building renovations",
        "Complex structural repair projects",
        "Heritage building restoration work",
        "Shopping center and retail developments",
        "Hospital and educational facility work",
        "Major infrastructure maintenance projects"
      ],
      whatAchieve: [
        "Independent structural support systems",
        "Multiple simultaneous work areas",
        "Heavy equipment and material support",
        "Flexible configuration and layout options",
        "Enhanced worker productivity and efficiency",
        "Professional project management capability",
        "Reduced overall project timelines"
      ],
      keyPoints: [
        "Independent structure design for complex projects",
        "Heavy-duty load capacity for industrial applications",
        "Multi-level platform configurations available",
        "Professional engineering and design services"
      ]
    },
    "scaffold-towers-mast-systems": {
      whatIs: "Scaffold towers and mast systems provide flexible, height-adjustable access solutions for various project types. Our mobile and static tower systems offer quick setup capability with professional-grade equipment, perfect for both indoor and outdoor applications requiring efficient vertical access.",
      whenNeeded: [
        "Interior maintenance and decoration work",
        "Electrical and lighting installations",
        "CCTV and security system installations",
        "Warehouse and industrial facility maintenance",
        "Event setup and temporary installations",
        "Signage installation and maintenance",
        "Building inspection and survey work",
        "Emergency access requirements"
      ],
      whatAchieve: [
        "Quick setup and dismantling capability",
        "Mobile access for multiple work areas",
        "Height adjustability for various applications",
        "Professional equipment quality assurance",
        "Cost-effective solution for short-term projects",
        "Minimal disruption to ongoing operations",
        "Flexible rental and purchase options"
      ],
      keyPoints: [
        "Mobile and static configuration options",
        "Lightweight aluminum construction for easy handling",
        "Professional grade safety features included",
        "Delivery, setup, and collection services available"
      ]
    },
    "crash-decks-crane-decks": {
      whatIs: "Crash decks and crane decks provide essential protective platforms and load-bearing surfaces for construction operations. Our heavy-duty deck systems ensure safety during lifting operations while providing stable platforms for equipment and materials in demanding construction environments.",
      whenNeeded: [
        "Tower crane installation and operations",
        "Heavy lifting and material handling",
        "Construction site safety zones",
        "Equipment platform requirements",
        "Material storage and staging areas",
        "Safety barriers for public areas",
        "Industrial loading and unloading zones",
        "Temporary access bridges and walkways"
      ],
      whatAchieve: [
        "Heavy-duty load bearing capabilities",
        "Enhanced construction site safety",
        "Professional crane operation support",
        "Regulatory compliance for lifting operations",
        "Reduced risk of falling object injuries",
        "Efficient material handling solutions",
        "Professional construction site management"
      ],
      keyPoints: [
        "Load-bearing deck systems for heavy equipment",
        "Custom design solutions for specific applications",
        "Professional safety compliance guaranteed",
        "Expert engineering and installation services"
      ]
    },
    "heavy-duty-industrial-scaffolding": {
      whatIs: "Heavy-duty industrial scaffolding provides robust structural support for complex industrial projects and infrastructure work. Our high-capacity scaffolding systems are engineered for demanding applications requiring exceptional load-bearing capabilities and extended operational periods.",
      whenNeeded: [
        "Oil refinery and petrochemical maintenance",
        "Power plant and energy facility work",
        "Heavy industrial equipment installation",
        "Infrastructure and civil engineering projects",
        "Shipyard and marine construction",
        "Mining and extraction facility maintenance",
        "Large-scale manufacturing facility upgrades",
        "Bridge and structural engineering projects"
      ],
      whatAchieve: [
        "Exceptional heavy load capacity support",
        "Extended operational duration capability",
        "Complex structural configuration options",
        "Industrial-grade safety and compliance",
        "Professional project management support",
        "Reduced downtime for critical operations",
        "Cost-effective solution for major projects"
      ],
      keyPoints: [
        "Heavy load capacity systems for industrial applications",
        "Industrial-grade materials and construction methods",
        "Professional engineering design and certification",
        "Long-term project support and maintenance"
      ]
    },
    "pavement-gantries-loading-bays": {
      whatIs: "Pavement gantries and loading bay solutions provide specialized access for urban construction projects while maintaining pedestrian safety and traffic flow. Our systems offer comprehensive loading access with integrated safety measures for busy urban environments.",
      whenNeeded: [
        "Urban construction and development projects",
        "City center building renovations",
        "Retail and commercial building work",
        "Historic city center conservation projects",
        "High street and shopping area developments",
        "Mixed-use development construction",
        "Transport hub and station improvements",
        "Emergency urban construction access"
      ],
      whatAchieve: [
        "Safe pedestrian access maintenance",
        "Efficient material loading and unloading",
        "Traffic flow management integration",
        "Professional urban construction appearance",
        "Planning authority compliance assurance",
        "Reduced disruption to local businesses",
        "Enhanced public safety measures"
      ],
      keyPoints: [
        "Urban construction access specialization",
        "Pedestrian safety priority in all designs",
        "Traffic management and planning compliance",
        "Professional installation with city approvals"
      ]
    },
    "public-access-staircases": {
      whatIs: "Public access staircase systems provide safe, compliant access routes for construction sites and temporary installations. Our accessible design solutions ensure building code compliance while providing safe passage for workers and authorized personnel.",
      whenNeeded: [
        "Construction site access requirements",
        "Temporary building access solutions",
        "Public building renovation projects",
        "Emergency access route installations",
        "Event and temporary structure access",
        "Disability access compliance requirements",
        "Multi-level construction site access",
        "Heritage building temporary access"
      ],
      whatAchieve: [
        "Building regulation compliance assurance",
        "Safe access for all user types",
        "Professional appearance and durability",
        "Accessibility standard compliance",
        "Enhanced site safety and security",
        "Reduced liability and insurance risk",
        "Professional project management support"
      ],
      keyPoints: [
        "Building code compliant design and installation",
        "Accessible design standards compliance",
        "Professional safety handrail systems",
        "Regular inspection and maintenance services"
      ]
    },
    "scaffold-alarms": {
      whatIs: "Scaffold alarm systems provide advanced security and safety monitoring for scaffolding installations. Our 24/7 monitoring solutions offer instant alerts and theft prevention while ensuring unauthorized access is immediately detected and reported.",
      whenNeeded: [
        "High-value construction site security",
        "Urban scaffolding theft prevention",
        "Heritage building protection requirements",
        "Long-term scaffolding installations",
        "Remote site security monitoring",
        "Insurance requirement compliance",
        "Vandalism and unauthorized access prevention",
        "Emergency response coordination"
      ],
      whatAchieve: [
        "24/7 security monitoring and alerts",
        "Reduced theft and vandalism incidents",
        "Insurance premium reduction benefits",
        "Enhanced site security and safety",
        "Professional monitoring service support",
        "Immediate emergency response capability",
        "Peace of mind for project managers"
      ],
      keyPoints: [
        "24/7 professional monitoring services",
        "Instant alert systems with rapid response",
        "Advanced security technology integration",
        "Professional installation and maintenance"
      ]
    }
  };

  return contentMap[slug] || {
    whatIs: `${slug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')} is a professional scaffolding solution designed to provide safe, compliant access for construction and maintenance work.`,
    whenNeeded: [
      "Construction and building work",
      "Maintenance and repair projects", 
      "Safety and access requirements",
      "Professional installation needs"
    ],
    whatAchieve: [
      "Safe working at height",
      "Regulatory compliance", 
      "Professional results",
      "Improved safety standards"
    ],
    keyPoints: [
      "Professional installation service",
      "Full safety compliance",
      "Expert technical support",
      "Comprehensive service guarantee"
    ]
  };
}

export default function ServiceAbout({ serviceName, slug }: ServiceAboutProps) {
  const content = getServiceContent(slug);
  
  return (
    <section className="py-16 sm:py-20 bg-white">
      <div className="mx-auto w-full lg:w-[90%] px-6">
        <div className="grid lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2">
            <h2 className="text-3xl sm:text-4xl font-serif font-bold text-gray-900 mb-6">
              Professional {serviceName} Services Across the South East
            </h2>
            <p className="text-lg text-gray-600 mb-8 leading-relaxed">
              {content.whatIs}
            </p>
            
            <div className="space-y-6">
              <h3 className="text-xl font-serif font-semibold text-gray-900">
                When You Need {serviceName}
              </h3>
              <div className="grid md:grid-cols-2 gap-4">
                {content.whenNeeded.map((need, index) => (
                  <div key={index} className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
                    <div className="flex-shrink-0 w-6 h-6 bg-brand-blue rounded-full flex items-center justify-center mt-0.5">
                      <svg className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span className="text-gray-900 font-medium text-sm">{need}</span>
                  </div>
                ))}
              </div>
              
              <div className="mt-8 p-6 bg-brand-blue/5 rounded-2xl border border-brand-blue/10">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-brand-blue rounded-lg flex items-center justify-center">
                    <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-serif font-semibold text-gray-900 mb-2">
                      TG20:21 Compliant & Fully Insured
                    </h4>
                    <p className="text-gray-600 text-sm leading-relaxed">
                      All our {serviceName.toLowerCase()} installations across the South East meet the latest TG20:21 standards, with comprehensive £10M public liability insurance and CHAS accreditation for complete peace of mind.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="lg:col-span-1">
            <div className="bg-gray-50 rounded-2xl p-6 border border-gray-200 sticky top-8">
              <h3 className="text-xl font-serif font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <svg className="h-5 w-5 text-brand-blue" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                What You Achieve
              </h3>
              <div className="space-y-3">
                {content.whatAchieve.map((achievement, index) => (
                  <div key={index} className="flex items-center gap-3 p-3 bg-white rounded-lg shadow-sm">
                    <div className="flex-shrink-0 w-2 h-2 bg-brand-blue rounded-full"></div>
                    <span className="text-gray-900 font-medium text-sm">{achievement}</span>
                  </div>
                ))}
              </div>
              
              <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
                  <svg className="h-4 w-4 text-brand-blue" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  Professional Installation
                </div>
                <p className="text-sm text-gray-600 mb-4">
                  Expert CISRS-qualified teams ensuring safe, compliant installation with full certification.
                </p>
                <a
                  href="/contact"
                  className="w-full inline-flex items-center justify-center px-4 py-3 bg-brand-blue text-white font-semibold rounded-lg hover:bg-brand-blue-hover transition-colors text-sm"
                >
                  Get Free Quote
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}