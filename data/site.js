const site = {
  brand: {
    name: "TR Enterprises",
    shortName: "TR",
    phone: "+91 9310508703",
    whatsapp: "919310508703",
    address: "B-15 Sharda Enclave, Shahbad Daulatpur, Delhi - 110042",
    email: "operations@tr-enterprises.in",
    location: "Delhi NCR"
  },
  hero: {
    eyebrow: "Solar care. Industrial support. Skilled manpower.",
    title: "Premium site operations for solar and industrial teams.",
    text:
      "TR Enterprises delivers disciplined solar panel cleaning, manpower supply, inverter support, plant maintenance, insulation work, dismantling support, and industrial cleaning for commercial sites that need polish and reliability.",
    image: "/assets/images/hero-solar-maintenance.png",
    chips: ["Safety-ready crews", "Delhi NCR support", "Fast WhatsApp quote", "Recurring maintenance"]
  },
  metrics: [
    { value: "120+", label: "site tasks completed" },
    { value: "35+", label: "clients and teams served" },
    { value: "7", label: "specialized service lines" },
    { value: "24h", label: "quote response focus" }
  ],
  services: [
    {
      id: "solar-cleaning",
      title: "Solar Panel Cleaning",
      category: "Solar",
      image: "/assets/images/solar-panel-cleaning.png",
      summary:
        "Dust, residue, and exposure buildup removal for commercial solar panel sites with organized manpower and site-safe workflow.",
      bullets: ["Panel surface care", "Recurring schedules", "Basic visual checks"]
    },
    {
      id: "industrial-cleaning",
      title: "Industrial Cleaning",
      category: "Industrial",
      image: "/assets/images/industrial-maintenance.png",
      summary:
        "Cleaning support for equipment zones, plant floors, commercial work areas, and high-traffic industrial environments.",
      bullets: ["Equipment-zone cleaning", "Work-floor cleanup", "Plant support"]
    },
    {
      id: "manpower",
      title: "Manpower Supply",
      category: "Workforce",
      image: "/assets/images/manpower-team.png",
      summary:
        "Reliable site crews aligned to maintenance, cleaning, solar, dismantling, and industrial support requirements.",
      bullets: ["Task-ready teams", "Supervision support", "Flexible deployment"]
    },
    {
      id: "inverter",
      title: "Inverter Installation",
      category: "Power",
      image: "/assets/images/inverter-installation.png",
      summary:
        "Field assistance for inverter setup, solar equipment rooms, maintenance coordination, and site readiness.",
      bullets: ["Installation support", "Room readiness", "Maintenance help"]
    },
    {
      id: "insulation",
      title: "Insulation Plant Work",
      category: "Plant",
      image: "/assets/images/insulation-plant-work.png",
      summary:
        "Practical manpower and cleaning support around insulation plants, pipes, equipment, and active industrial systems.",
      bullets: ["Plant assistance", "Inspection support", "Work-zone care"]
    },
    {
      id: "dismantling",
      title: "Dismantling Work",
      category: "Site Support",
      image: "/assets/images/dismantling-site-work.png",
      summary:
        "Structured manpower and coordination for dismantling preparation, movement planning, and site-close discipline.",
      bullets: ["Crew planning", "Safe movement", "Close-out support"]
    }
  ],
  projects: [
    {
      title: "Commercial solar cleaning program",
      type: "Solar / Delhi NCR",
      image: "/assets/images/solar-panel-cleaning.png",
      impact: "Reduced dust buildup and improved panel presentation with recurring manpower support."
    },
    {
      title: "Industrial equipment-zone refresh",
      type: "Industrial / Plant Area",
      image: "/assets/images/industrial-maintenance.png",
      impact: "Cleaned high-use maintenance zones while keeping active-site movement organized."
    },
    {
      title: "Inverter room readiness support",
      type: "Power / Solar",
      image: "/assets/images/inverter-installation.png",
      impact: "Prepared equipment areas and supported technical teams through a clean workflow."
    },
    {
      title: "Dismantling site preparation",
      type: "Facility / Support",
      image: "/assets/images/dismantling-site-work.png",
      impact: "Provided crew coordination and work-zone planning for safe dismantling assistance."
    }
  ],
  process: [
    {
      step: "01",
      title: "Scope the site",
      text: "We capture service type, site size, access, timeline, manpower needs, and safety expectations before work starts."
    },
    {
      step: "02",
      title: "Deploy prepared teams",
      text: "Crews arrive with task clarity for cleaning, solar, maintenance, plant work, power support, or dismantling assistance."
    },
    {
      step: "03",
      title: "Close with discipline",
      text: "The work zone is wrapped with completion notes, simple communication, and a path for recurring support."
    }
  ],
  testimonials: [
    {
      quote:
        "TR Enterprises is punctual, disciplined, and understands how to work around active solar sites without disturbing operations.",
      name: "Hero Solar Pvt. Ltd.",
      role: "Solar site team"
    },
    {
      quote:
        "Their manpower support is practical, organized, and easy to coordinate for maintenance requirements.",
      name: "Tata Solar Ltd.",
      role: "Maintenance partner"
    },
    {
      quote:
        "Reliable communication and steady execution make them a good partner for recurring service work.",
      name: "Orina Power Pvt. Ltd.",
      role: "Operations team"
    }
  ],
  gallery: [
    { title: "Solar maintenance", image: "/assets/images/hero-solar-maintenance.png" },
    { title: "Panel cleaning", image: "/assets/images/solar-panel-cleaning.png" },
    { title: "Industrial maintenance", image: "/assets/images/industrial-maintenance.png" },
    { title: "Inverter support", image: "/assets/images/inverter-installation.png" },
    { title: "Plant work", image: "/assets/images/insulation-plant-work.png" },
    { title: "Manpower deployment", image: "/assets/images/manpower-team.png" }
  ]
};

module.exports = site;
