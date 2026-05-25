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
    eyebrow: "Solar. Industrial. Manpower.",
    title: "Reliable crews for solar, plant, and site work.",
    text:
      "TR Enterprises coordinates cleaning, manpower, inverter, and industrial support with fast handovers and cleaner site control.",
    image: "/assets/images/hero-solar-maintenance.png",
    chips: ["24h quote focus", "Safety-ready crews", "Delhi NCR", "Solar + plant care"]
  },
  sections: {
    marquee: [
      "Solar cleaning",
      "Industrial maintenance",
      "Manpower supply",
      "Inverter support",
      "Insulation plant work",
      "Dismantling support",
      "Delhi NCR",
      "Fast quote response"
    ],
    services: {
      eyebrow: "Services",
      title: "Precision site services.",
      text: "Focused support for solar, plant, power, and crew work.",
      indexLabel: "Capability index"
    },
    projects: {
      eyebrow: "Projects",
      title: "Field proof.",
      text: "Clean snapshots from real site work."
    },
    process: {
      eyebrow: "Execution model",
      title: "Plan. Deploy. Close."
    },
    gallery: {
      eyebrow: "Gallery",
      title: "Work, in frame.",
      text: "Solar, plant, and crew visuals."
    },
    reviews: {
      eyebrow: "Reviews",
      title: "Trusted execution.",
      button: "Start Your Inquiry"
    },
    contact: {
      eyebrow: "Get quote",
      title: "Send the brief. We'll respond fast.",
      formEyebrow: "Inquiry desk",
      formTitle: "Send your requirement",
      button: "Submit Inquiry"
    },
    footer: {
      tagline: "Premium solar, manpower, power, plant, and site services.",
      copyright: "2026 TR Enterprises. All rights reserved."
    }
  },
  metrics: [
    { value: "120+", label: "site tasks" },
    { value: "35+", label: "clients served" },
    { value: "7", label: "service lines" },
    { value: "24h", label: "quote focus" }
  ],
  services: [
    {
      id: "solar-cleaning",
      title: "Solar Panel Cleaning",
      category: "Solar",
      image: "/assets/images/solar-panel-cleaning.png",
      summary:
        "Precision cleaning for commercial solar assets.",
      bullets: ["Panel care", "Scheduled cycles", "Visual checks"]
    },
    {
      id: "industrial-cleaning",
      title: "Industrial Cleaning",
      category: "Industrial",
      image: "/assets/images/industrial-maintenance.png",
      summary:
        "Cleaner zones for active industrial sites.",
      bullets: ["Equipment zones", "Work floors", "Plant support"]
    },
    {
      id: "manpower",
      title: "Manpower Supply",
      category: "Workforce",
      image: "/assets/images/manpower-team.png",
      summary:
        "Disciplined teams for demanding field work.",
      bullets: ["Ready crews", "Supervision", "Flexible deployment"]
    },
    {
      id: "inverter",
      title: "Inverter Installation",
      category: "Power",
      image: "/assets/images/inverter-installation.png",
      summary:
        "Clean support for power-room readiness.",
      bullets: ["Install support", "Room readiness", "Upkeep"]
    },
    {
      id: "insulation",
      title: "Insulation Plant Work",
      category: "Plant",
      image: "/assets/images/insulation-plant-work.png",
      summary:
        "Focused support around plant systems.",
      bullets: ["Plant assist", "Inspection", "Zone care"]
    },
    {
      id: "dismantling",
      title: "Dismantling Work",
      category: "Site Support",
      image: "/assets/images/dismantling-site-work.png",
      summary:
        "Organized crews for controlled site work.",
      bullets: ["Crew planning", "Safe movement", "Close-out"]
    }
  ],
  projects: [
    {
      title: "Solar cleaning program",
      type: "Solar / Delhi NCR",
      image: "/assets/images/solar-panel-cleaning.png",
      impact: "Cleaner panels. Stronger site presentation."
    },
    {
      title: "Plant zone refresh",
      type: "Industrial / Plant Area",
      image: "/assets/images/industrial-maintenance.png",
      impact: "Sharper work zones with steady movement."
    },
    {
      title: "Inverter room readiness",
      type: "Power / Solar",
      image: "/assets/images/inverter-installation.png",
      impact: "Prepared spaces for technical teams."
    },
    {
      title: "Dismantling preparation",
      type: "Facility / Support",
      image: "/assets/images/dismantling-site-work.png",
      impact: "Controlled crew flow and site closure."
    }
  ],
  process: [
    {
      step: "01",
      title: "Scope the site",
      text: "Need, access, timing, and team size."
    },
    {
      step: "02",
      title: "Deploy cleanly",
      text: "Right crew. Right tools. Clear brief."
    },
    {
      step: "03",
      title: "Close sharp",
      text: "Finish, report, and reset for next cycle."
    }
  ],
  testimonials: [
    {
      quote:
        "Punctual, disciplined, and easy on active sites.",
      name: "Hero Solar Pvt. Ltd.",
      role: "Solar site team"
    },
    {
      quote:
        "Organized manpower. Smooth coordination.",
      name: "Tata Solar Ltd.",
      role: "Maintenance partner"
    },
    {
      quote:
        "Reliable communication. Steady execution.",
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
