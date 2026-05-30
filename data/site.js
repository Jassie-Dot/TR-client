const serviceSafety = ["Helmets", "Gloves", "PPE kits", "Safety belts", "Safety jackets"];

const site = {
  brand: {
    name: "TR Enterprises",
    shortName: "TR",
    phone: "+91 9310508703",
    whatsapp: "919310508703",
    address: "B-15 Sharda Enclave, Shahbad Daulatpur, Delhi - 110042",
    email: "trenterpriies@gmail.com",
    location: "Delhi NCR",
    workingHours: "All days available",
    mapUrl: "https://www.google.com/maps/search/?api=1&query=B-15%20Sharda%20Enclave%2C%20Shahbad%20Daulatpur%2C%20Delhi%20110042"
  },
  hero: {
    eyebrow: "Solar. Industrial. Manpower.",
    title: "Safe site services for solar, plant, and manpower work.",
    text:
      "TR Enterprises provides trained crews for solar panel cleaning, industrial cleaning, dismantling, manpower supply, inverter maintenance, and insulation plant work.",
    image: "/assets/images/hero-solar-maintenance.png",
    chips: ["Safety training support", "Emergency medical facility", "25+ skilled workers", "All days available"]
  },
  sections: {
    marquee: [
      "Solar panel cleaning",
      "Industrial cleaning",
      "Dismantling work",
      "Manpower supply",
      "Inverter installation and maintenance",
      "Insulation plant work",
      "Safety training support",
      "Emergency medical support"
    ],
    why: {
      eyebrow: "Why choose TR",
      title: "Reliable field teams with safety built into every job.",
      text: "Clients get trained workers, emergency support, all-days availability, and modern execution methods for active sites."
    },
    trusted: {
      eyebrow: "Trusted by",
      title: "Teams engaged with solar and power companies across field work.",
      text: "Hero Solar, Tata Solar, and Orina Power are highlighted as companies TR has worked with."
    },
    services: {
      eyebrow: "Services",
      title: "Six core services for solar, industrial, and plant sites.",
      text: "Each service has a clear scope, process, safety equipment, benefits, and a direct quote action.",
      indexLabel: "Service pages"
    },
    serviceDetails: {
      eyebrow: "Detailed services",
      title: "What each service includes.",
      text: "A simple service-page layout for the work, audience, process, safety equipment, benefits, and quote request."
    },
    about: {
      eyebrow: "About TR",
      title: "A practical site-services team focused on safe execution.",
      text:
        "TR Enterprises supports solar, industrial, and plant teams with dependable workers, clear supervision, and disciplined site handovers.",
      directorNote:
        "Director Tushar keeps the work personal and accountable, with emphasis on communication, safety, and dependable site attendance.",
      teamTitle: "Team structure",
      commitment:
        "Every assignment is planned around safety, quality, proper briefing, and clean completion before the team leaves the site.",
      team: [
        { count: "1", role: "Director" },
        { count: "1", role: "Manager" },
        { count: "1", role: "Online plant monitoring" },
        { count: "2", role: "Supervisors" },
        { count: "4", role: "Engineers" },
        { count: "17", role: "Skilled workers" }
      ],
      highlights: [
        {
          title: "Safety Training Support",
          text: "PPE, electrical safety, working at height, emergency response, and machine-handling awareness are included in site preparation."
        },
        {
          title: "Emergency Medical and Doctor Facility",
          text: "TR can arrange emergency medical support and doctor-facility coordination for site work where the client requires it."
        }
      ]
    },
    projects: {
      eyebrow: "Projects and portfolio",
      title: "Field proof from solar, industrial, and manpower support.",
      text: "Project photos, worked-with companies, and short case-study snapshots for quick client confidence."
    },
    process: {
      eyebrow: "How we work",
      title: "Briefing. Safety training. Execution. Maintenance."
    },
    gallery: {
      eyebrow: "Project photo gallery",
      title: "Solar engineers, industrial maintenance, and manpower support.",
      text: "Visual highlights from the service areas TR supports."
    },
    reviews: {
      eyebrow: "Testimonials and highlights",
      title: "Trusted execution on active sites.",
      button: "Start Your Inquiry"
    },
    safety: {
      eyebrow: "Safety and compliance",
      title: "Safety training, medical readiness, and PPE-led site work.",
      text:
        "TR keeps safety visible through training, emergency response readiness, equipment discipline, and compliance-focused supervision.",
      training: ["PPE awareness", "Electrical safety", "Working at height", "Emergency response", "Machine handling"],
      equipment: ["Helmets", "Gloves", "PPE kits", "Safety belts", "Safety jackets"],
      medical: "Emergency medical and doctor facility support can be coordinated on site as required.",
      commitment: "The overall commitment is simple: trained people, proper equipment, clear supervision, and safer site outcomes."
    },
    cta: {
      eyebrow: "Need a site team?",
      title: "Share the requirement and get a free quote from TR.",
      text: "Tell us the service, location, and timeline. TR will review the requirement and respond quickly.",
      button: "Get a Free Quote",
      whatsappButton: "WhatsApp Us"
    },
    contact: {
      eyebrow: "Contact / Get a quote",
      title: "Send the brief. We will respond fast.",
      formEyebrow: "Enquiry form",
      formTitle: "Tell us what work you want",
      button: "Submit Enquiry"
    },
    footer: {
      tagline: "Solar, industrial, manpower, power, plant, and site support services.",
      copyright: "2026 TR Enterprises. All rights reserved."
    }
  },
  metrics: [
    { value: "25+", label: "skilled workers" },
    { value: "4", label: "engineers" },
    { value: "All days", label: "service available" },
    { value: "2025", label: "established" }
  ],
  whyChoose: [
    {
      title: "Safety training",
      text: "Workers are briefed on PPE, electrical safety, height work, emergency response, and machine handling."
    },
    {
      title: "Emergency medical support",
      text: "Doctor-facility and emergency medical readiness can be arranged for sensitive site work."
    },
    {
      title: "25+ skilled workers",
      text: "A structured team of engineers, supervisors, monitoring support, and trained workers is available."
    },
    {
      title: "All-days availability",
      text: "TR supports urgent schedules and planned site cycles with practical, all-days response."
    },
    {
      title: "Modern methods",
      text: "Work is handled through briefing, controlled deployment, supervision, and clean close-out."
    }
  ],
  trustedBy: ["Hero Solar", "Tata Solar", "Orina Power"],
  services: [
    {
      id: "solar-panel-cleaning-services",
      title: "Solar Panel Cleaning Services",
      category: "Solar",
      image: "/assets/images/solar-panel-cleaning.png",
      summary:
        "Scheduled solar-panel cleaning for better presentation, safer access, and cleaner plant output.",
      bullets: ["Panel cleaning", "Visual checks", "Safe access"],
      detail: {
        what:
          "Cleaning and basic visual support for commercial and plant solar panels using trained field workers.",
        for: "Solar companies, commercial rooftops, solar farms, and plant teams that need reliable panel-care cycles.",
        process: ["Site briefing", "PPE and access check", "Panel cleaning", "Final visual check and handover"],
        safety: serviceSafety,
        benefits: ["Cleaner panels", "Safer working flow", "Better site presentation", "Planned maintenance rhythm"]
      }
    },
    {
      id: "industrial-cleaning-services",
      title: "Industrial Cleaning Services",
      category: "Industrial",
      image: "/assets/images/industrial-maintenance.png",
      summary:
        "Industrial cleaning support for equipment zones, work floors, plant areas, and maintenance spaces.",
      bullets: ["Equipment zones", "Plant floors", "Maintenance support"],
      detail: {
        what:
          "Cleaning crews for industrial zones where safety discipline, timing, and controlled movement matter.",
        for: "Factories, industrial units, maintenance teams, power rooms, and active plant sites.",
        process: ["Requirement review", "Area isolation and briefing", "Cleaning execution", "Supervisor check"],
        safety: serviceSafety,
        benefits: ["Cleaner work zones", "Reduced site clutter", "Better maintenance access", "Professional site readiness"]
      }
    },
    {
      id: "dismantling-work",
      title: "Dismantling Work",
      category: "Site Support",
      image: "/assets/images/dismantling-site-work.png",
      summary:
        "Controlled dismantling support with planned manpower, safe movement, and organized close-out.",
      bullets: ["Crew planning", "Safe movement", "Close-out"],
      detail: {
        what:
          "Support manpower for dismantling tasks where controlled sequencing and safety supervision are required.",
        for: "Industrial sites, facility teams, solar sites, and contractors handling removal or relocation work.",
        process: ["Work briefing", "Safety zoning", "Dismantling support", "Material movement and clean-up"],
        safety: serviceSafety,
        benefits: ["Controlled execution", "Cleaner site handover", "Reduced disruption", "Better manpower coordination"]
      }
    },
    {
      id: "manpower-supply-services",
      title: "Manpower Supply Services",
      category: "Workforce",
      image: "/assets/images/manpower-team.png",
      summary:
        "Disciplined manpower supply for solar, industrial, plant, maintenance, and support work.",
      bullets: ["Ready crews", "Supervision", "Flexible deployment"],
      detail: {
        what:
          "Skilled and semi-skilled manpower deployment with supervision and clear task briefings.",
        for: "Companies that need dependable manpower for site cleaning, maintenance, monitoring, or operational support.",
        process: ["Requirement collection", "Team allocation", "Safety briefing", "Daily execution and supervision"],
        safety: serviceSafety,
        benefits: ["Fast deployment", "Clear accountability", "Flexible team size", "Site-ready workers"]
      }
    },
    {
      id: "inverter-installation-maintenance",
      title: "Inverter Installation and Maintenance",
      category: "Power",
      image: "/assets/images/inverter-installation.png",
      summary:
        "Support for inverter installation, maintenance readiness, room upkeep, and power-room assistance.",
      bullets: ["Install support", "Maintenance readiness", "Room upkeep"],
      detail: {
        what:
          "Site support around inverter installation and maintenance, including area readiness and crew assistance.",
        for: "Solar power sites, commercial facilities, and technical teams needing field support around inverter rooms.",
        process: ["Site access check", "Safety and electrical briefing", "Installation or maintenance support", "Area reset"],
        safety: serviceSafety,
        benefits: ["Prepared work areas", "Better technician support", "Safer movement", "Cleaner inverter-room handover"]
      }
    },
    {
      id: "insulation-plant-work",
      title: "Insulation Plant Work",
      category: "Plant",
      image: "/assets/images/insulation-plant-work.png",
      summary:
        "Focused plant-work support for insulation areas, inspections, zone care, and maintenance teams.",
      bullets: ["Plant assist", "Inspection support", "Zone care"],
      detail: {
        what:
          "Support manpower and supervision for insulation-related plant work and maintenance-area assistance.",
        for: "Plant operators, industrial sites, insulation contractors, and maintenance teams.",
        process: ["Plant briefing", "PPE check", "Insulation-area support", "Inspection and clean handover"],
        safety: serviceSafety,
        benefits: ["Organized plant support", "Safer site movement", "Cleaner working zones", "Reliable maintenance assistance"]
      }
    }
  ],
  projects: [
    {
      title: "Solar cleaning program",
      type: "Solar / Delhi NCR",
      site: "Solar site",
      requirement: "Panel cleaning and safe access support",
      workDone: "Briefed workers, PPE checks, cleaning cycle, and visual handover",
      result: "Cleaner panels with sharper site presentation",
      image: "/assets/images/solar-panel-cleaning.png",
      impact: "Cleaner panels. Stronger site presentation."
    },
    {
      title: "Industrial maintenance support",
      type: "Industrial / Plant Area",
      site: "Industrial work floor",
      requirement: "Cleaning and maintenance-zone readiness",
      workDone: "Area support, equipment-zone cleaning, and supervised close-out",
      result: "Safer movement and cleaner active work zones",
      image: "/assets/images/industrial-maintenance.png",
      impact: "Sharper work zones with steady movement."
    },
    {
      title: "Manpower deployment",
      type: "Workforce / Site Support",
      site: "Active service site",
      requirement: "Reliable manpower with supervision",
      workDone: "Crew briefing, task allocation, attendance, and daily reporting",
      result: "Smooth coordination for site tasks",
      image: "/assets/images/manpower-team.png",
      impact: "Organized manpower. Smooth coordination."
    }
  ],
  process: [
    {
      step: "01",
      title: "Briefing",
      text: "TR reviews the work, location, timing, team size, and safety requirements."
    },
    {
      step: "02",
      title: "Safety training",
      text: "Workers are briefed on PPE, electrical safety, height work, emergency response, and machine handling."
    },
    {
      step: "03",
      title: "Execution",
      text: "The assigned crew works under clear supervision with proper equipment and site discipline."
    },
    {
      step: "04",
      title: "Maintenance",
      text: "The site is checked, reset, and handed over with follow-up support where required."
    }
  ],
  testimonials: [
    {
      quote:
        "Punctual, disciplined, and easy to coordinate on active solar sites.",
      name: "Hero Solar",
      role: "Solar site team"
    },
    {
      quote:
        "Reliable manpower with clear supervision and steady communication.",
      name: "Tata Solar",
      role: "Maintenance partner"
    },
    {
      quote:
        "TR keeps the work organized and safety-focused from briefing to close-out.",
      name: "Orina Power",
      role: "Operations team"
    }
  ],
  gallery: [
    { title: "Solar engineers at work", image: "/assets/images/hero-solar-maintenance.png" },
    { title: "Solar panel cleaning", image: "/assets/images/solar-panel-cleaning.png" },
    { title: "Industrial maintenance", image: "/assets/images/industrial-maintenance.png" },
    { title: "Manpower support", image: "/assets/images/manpower-team.png" },
    { title: "Inverter installation and maintenance", image: "/assets/images/inverter-installation.png" },
    { title: "Insulation plant work", image: "/assets/images/insulation-plant-work.png" }
  ]
};

module.exports = site;
