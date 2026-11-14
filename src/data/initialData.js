// Initial Seed Data for Multi-Sector Industrial & Agro Services
// Stored in localStorage for client-side persistence

export const initialDivisions = [
  {
    id: "elec",
    number: "01",
    name: "Industrial Electrical Contracting & Certified Manpower Supply",
    shortName: "Electrical & Manpower",
    tagline: "Industrial Control Panel Wiring, Warehouse High-Bay Lighting & 33kV Substations",
    category: "Electrical Engineering & Staffing",
    accentColor: "#00e5ff",
    image: "/assets/images/gen-electrical-panel.jpg",
    gallery: [
      {
        url: "/assets/images/gen-electrical-panel.jpg",
        title: "Industrial MCC/PCC Panel Wiring & Single Line Diagram Execution",
        tag: "Control Panel Wiring",
        desc: "Certified industrial electrician executing control panel wiring conforming to single-line diagrams, color-coded phase cabling, and circuit breaker testing."
      },
      {
        url: "/assets/images/gen-warehouse-lighting.jpg",
        title: "Warehouse & Factory High-Bay LED Lighting Installation",
        tag: "High-Bay Lighting",
        desc: "Aerial installation of high-efficiency LED industrial bay lights using hydraulic scissor lifts, overhead cable trays, and lighting distribution boards."
      }
    ],
    status: "active",
    statusLabel: "Immediate Nationwide Mobilization",
    leadDesc: "Turnkey electrical contracting for manufacturing facilities, industrial warehouses, and substations up to 33kV. Direct execution of control panel wiring adhering to single-line diagrams, high-bay lighting with aerial scissor lifts, and rapid deployment of certified wiremen.",
    keyCapabilities: [
      "Industrial Control Panels & DB: Complete wiring, busbar assembly & circuit breaker integration to single-line schematics",
      "Factory High-Bay Lighting: Aerial scissor lift installation, cable raceways & lighting distribution boards",
      "Turnkey HT / LT Substations: Erection, transformer commissioning up to 33kV & CEIG approvals",
      "Certified Technical Manpower: Immediate deployment of licensed wiremen, electricians & safety officers",
      "Safety Standards: 100% PPE compliance, insurance coverage & single-line diagram execution"
    ],
    specs: [
      { label: "Voltage Scope", value: "LT (415V) to HT (11kV / 33kV / 66kV)" },
      { label: "Technicians Available", value: "150+ Certified Wiremen & Electricians" },
      { label: "Mobilization Time", value: "Within 48-72 Hours Pan-India" },
      { label: "Safety Compliance", value: "100% PPE, ESIC, PF & Single-Line Verification" }
    ],
    highlightStat: "150+ Certified Technicians Deployed"
  },
  {
    id: "fab",
    number: "02",
    name: "Cable Tray Fabrication & Heavy Structural Steel",
    shortName: "Cable Tray & Structural",
    tagline: "Perforated Cable Tray Bends, Pre-Engineered Building Sheds & Gantry Girders",
    category: "Metal Fabrication & Heavy Engineering",
    accentColor: "#f59e0b",
    image: "/assets/images/gen-cable-tray-welding.jpg",
    gallery: [
      {
        url: "/assets/images/gen-cable-tray-welding.jpg",
        title: "Galvanized Cable Tray Fabrication: 90°, 45° & Custom Bends",
        tag: "Tray Fabrication",
        desc: "Precision MIG welding and sheet metal fabrication of galvanized perforated cable tray bends, elbows, reducers, and straight sections."
      },
      {
        url: "/assets/images/metal-fabrication.jpg",
        title: "Pre-Engineered Building Structural Steel & Crane Girders",
        tag: "PEB Steel Sheds",
        desc: "Heavy factory framework fabrication, overhead crane run-beams, and industrial mezzanine steel structures."
      }
    ],
    status: "active",
    statusLabel: "Continuous Workshop Production",
    leadDesc: "Specialized fabrication of heavy-duty galvanized cable trays, elbows, reducers, and custom bends, alongside structural steel fabrication for industrial warehouses, PEB factory sheds, and overhead crane run-beams.",
    keyCapabilities: [
      "Cable Tray Fabrication: 90° bends, 45° bends, reducers, straight sections & custom cable raceways",
      "Pre-Engineered Buildings (PEB): Industrial warehousing frameworks, heavy rafters & columns",
      "Heavy Gantry Crane Girders, conveyor gantries & industrial mezzanine steel platforms",
      "Heavy Commercial Rolling Shutters, motorized high-security sliding gates & barriers",
      "Certified MIG, TIG & ARC Welding conforming to IS 2062 Grade high-tensile steel"
    ],
    specs: [
      { label: "Workshop Capacity", value: "150+ Metric Tons Fabricated / Month" },
      { label: "Steel Grades", value: "IS 2062 Grade E250 / E350 High-Tensile Steel" },
      { label: "Cable Tray Fittings", value: "90° Bends, 45° Bends, Reducers & Custom Sections" },
      { label: "Corrosion Protection", value: "Hot-Dip Galvanized & Red Oxide Epoxy Primed" }
    ],
    highlightStat: "150+ Tons Monthly Output"
  },
  {
    id: "brick",
    number: "03",
    name: "High-Strength Kiln & Machine-Moulded Red Bricks",
    shortName: "Red Kiln Bricks",
    tagline: "Standard 9\" × 4\" × 3\" Bricks, 4.2 Million Annual Output & 2 Million Ready Stock",
    category: "Construction Materials",
    accentColor: "#ea580c",
    image: "/assets/images/gen-brick-kiln-yard.jpg",
    gallery: [
      {
        url: "/assets/images/gen-brick-kiln-yard.jpg",
        title: "Commercial Brick Kiln & Sun-Curing Stacks",
        tag: "Kiln Yard & Stacks",
        desc: "Industrial chimney kiln facility with continuous firing chambers, sun-cured brick stacks, and mechanized tractor-trolley dispatch."
      },
      {
        url: "/assets/images/brick-manufacturing.jpg",
        title: "Standard 9\" × 4\" × 3\" Red Clay Bricks Production",
        tag: "9\"×4\"×3\" Geometry",
        desc: "Certified high compressive strength bricks (12.5–15.0 N/mm²) engineered for load-bearing multi-storey masonry."
      }
    ],
    status: "active",
    statusLabel: "2,000,000 Units Ready Stock",
    leadDesc: "High-output brick kiln facility producing superior red clay bricks with uniform geometry, sharp edges, and high compressive strength. Featuring massive 4.2 million units annual production capacity and 2 million units ready stock for immediate site dispatch.",
    keyCapabilities: [
      "Standard Brick Geometry: Exactly 9 Inch Length × 4 Inch Width × 3 Inch Height",
      "High Compressive Strength: 12.5 – 15.0 N/mm² for multi-storey load-bearing masonry",
      "Massive Yard Stock: 2,000,000 units ready in stock for immediate bulk procurement",
      "High Annual Production: 4,200,000 units manufactured per year",
      "Mechanized loading & direct multi-axle truckloads dispatched nationwide"
    ],
    specs: [
      { label: "Standard Dimensions", value: "Length: 9\" | Width: 4\" | Height: 3\"" },
      { label: "Annual Production", value: "4,200,000 Bricks / Year" },
      { label: "Current Ready Stock", value: "2,000,000 Bricks in Yard" },
      { label: "Compressive Strength", value: "12.5 – 15.0 N/mm² (Exceeds IS 1077)" }
    ],
    highlightStat: "2,000,000 Ready in Yard"
  },
  {
    id: "fish",
    number: "04",
    name: "Commercial Freshwater Aquaculture & Live Fish Supply",
    shortName: "Freshwater Aquaculture",
    tagline: "Catla, Rohu, Big Gated Carp & Ijrayl Catfish with Aerated Ponds & Live Delivery",
    category: "Aquaculture & Live Fish Supply",
    accentColor: "#0284c7",
    image: "/assets/images/gen-aquaculture-pond.jpg",
    gallery: [
      {
        url: "/assets/images/gen-aquaculture-pond.jpg",
        title: "Commercial Aquaculture Ponds with Paddlewheel Aeration",
        tag: "Pond Aeration",
        desc: "Paddlewheel aerators spinning and oxygenating clear water in large green-banked ponds with daily pellet feeding."
      },
      {
        url: "/assets/images/fish-farming-pond.jpg",
        title: "Live Freshwater Fish Harvest & Oxygenated Truck Dispatch",
        tag: "Live Mandi Supply",
        desc: "Continuous weekly harvests of Catla, Rohu, Big Gated Carp & Ijrayl Catfish shipped in oxygenated live tanks."
      }
    ],
    status: "active",
    statusLabel: "Continuous Weekly Harvests",
    leadDesc: "Scientifically managed freshwater aquaculture ponds equipped with electric paddlewheel aerators, balanced pellet feeding, and live oxygenated transport tanks. Supplying wholesale freshwater table fish across Indian markets.",
    keyCapabilities: [
      "Catla (Catla catla): High-growth surface feeder with firm flesh and premium market demand",
      "Rohu (Labeo rohita): Column feeder raised with balanced pellet nutrition",
      "Big Gated Carp (Hypophthalmichthys nobilis): Plankton-nourished large freshwater carp",
      "Ijrayl Catfish (Clarias batrachus): Hardy, high-protein freshwater catfish",
      "Live Fish Oxygenated Transport: Dedicated tank trucks ensuring 100% live arrival at wholesale mandis"
    ],
    specs: [
      { label: "Primary Species", value: "Catla, Rohu, Big Gated Carp, Ijrayl Catfish" },
      { label: "Pond Technology", value: "High-Efficiency Electric Paddlewheel Aerators" },
      { label: "Feed Standards", value: "High-Protein Extruded Floating Pellets" },
      { label: "Dispatch Logistics", value: "Live Oxygenated Transport Tanks & Cold Chain" }
    ],
    highlightStat: "4 Core Freshwater Species"
  },
  {
    id: "duck",
    number: "05",
    name: "Commercial Duck Farming & High-Yield Egg Production",
    shortName: "Duck Farming & Eggs",
    tagline: "6,000 Fresh Eggs Daily Production & 12,000 Units Current Ready Stock",
    category: "Poultry & Commercial Egg Production",
    accentColor: "#10b981",
    image: "/assets/images/gen-duck-egg-farm.jpg",
    gallery: [
      {
        url: "/assets/images/gen-duck-egg-farm.jpg",
        title: "Free-Range Duck Farm & Fresh Harvested Egg Crates",
        tag: "Duck Flock & Pond",
        desc: "Healthy flock of layer ducks with pond access, clean feed nutrition, and fresh white table duck eggs harvested daily into crates."
      },
      {
        url: "/assets/images/duck-egg-production.jpg",
        title: "Graded Fresh White Duck Eggs in Sanitized Crates",
        tag: "6,000 Eggs / Day",
        desc: "Daily morning egg collections washed, candled, graded, and stacked in commercial sanitized plastic crates."
      }
    ],
    status: "active",
    statusLabel: "6,000 Eggs Harvested Daily",
    leadDesc: "Modern commercial duck farming complex providing high-yield, hygienic duck egg production. Producing 6,000 fresh table eggs every day with a constant buffer of 12,000 eggs in stock, sorted in sanitized crates for wholesale supply.",
    keyCapabilities: [
      "Daily Egg Output: 6,000 fresh, hygienic duck eggs collected daily",
      "Buffer Stock: 12,000 graded eggs maintained in ready-to-dispatch crates",
      "Hygienic Handling: Washed, sorted, and packed in heavy-duty plastic crate stacks",
      "Free-Range Farm Environment: Natural water ponds and clean shelter sheds",
      "Wholesale Institutional Contracts: Bulk supply for commercial bakeries, hotels & distributors"
    ],
    specs: [
      { label: "Daily Production", value: "6,000 Fresh Duck Eggs / Day" },
      { label: "Current Stock", value: "12,000 Graded Eggs in Yard" },
      { label: "Packaging", value: "Heavy-Duty Sanitized Plastic Crates" },
      { label: "Quality Assurance", value: "100% Fresh, Hygienic & Tested Supply" }
    ],
    highlightStat: "6,000 Eggs Produced Daily"
  }
];

export const operationalPhotoGrid = [
  {
    id: "grid-elec-1",
    serviceId: "elec",
    category: "Electrical Engineering",
    title: "Industrial Control Panel Wiring",
    subtitle: "MCC & PCC single-line diagram execution, circuit breaker testing & phase wiring",
    image: "/assets/images/gen-electrical-panel.jpg",
    metric: "150+ Deployed Staff",
    highlight: "Single-Line Standard"
  },
  {
    id: "grid-elec-2",
    serviceId: "elec",
    category: "Industrial Lighting",
    title: "High-Bay Warehouse Lighting",
    subtitle: "Aerial hydraulic scissor-lift installation of LED bay luminaires and overhead raceways",
    image: "/assets/images/gen-warehouse-lighting.jpg",
    metric: "Aerial Scissor Lifts",
    highlight: "High-Bay LED"
  },
  {
    id: "grid-fab-1",
    serviceId: "fab",
    category: "Cable Tray & Steel",
    title: "Cable Tray Fabrication & MIG Welding",
    subtitle: "Precision welding of galvanized 90°, 45° bends, reducers, and straight raceways",
    image: "/assets/images/gen-cable-tray-welding.jpg",
    metric: "150+ Tons / Month",
    highlight: "IS 2062 Grade"
  },
  {
    id: "grid-brick-1",
    serviceId: "brick",
    category: "Construction Materials",
    title: "High-Capacity Red Brick Kiln",
    subtitle: "Standard 9\" × 4\" × 3\" kiln-fired red clay bricks with 2M buffer yard stock",
    image: "/assets/images/gen-brick-kiln-yard.jpg",
    metric: "2,000,000 Ready Stock",
    highlight: "9\" × 4\" × 3\" Size"
  },
  {
    id: "grid-fish-1",
    serviceId: "fish",
    category: "Aquaculture Supply",
    title: "Aerated Freshwater Aquaculture",
    subtitle: "Paddlewheel oxygenated ponds raising Catla, Rohu, Big Gated Carp & Ijrayl Catfish",
    image: "/assets/images/gen-aquaculture-pond.jpg",
    metric: "4 Commercial Species",
    highlight: "Live Oxygenated Tank"
  },
  {
    id: "grid-duck-1",
    serviceId: "duck",
    category: "Commercial Egg Supply",
    title: "Duck Farming & Daily Egg Harvest",
    subtitle: "6,000 fresh table eggs harvested daily with 12,000 stock in sanitized crates",
    image: "/assets/images/gen-duck-egg-farm.jpg",
    metric: "6,000 Eggs / Day",
    highlight: "Sanitized Crates"
  }
];

export const initialInquiries = [];

export const initialInventory = {
  bricks: {
    yardStock: 2000000,
    annualProduction: 4200000,
    dailyProduction: 45000,
    kilnStatus: "Fully Operational Chimney Kiln",
    standardSize: "9\" x 4\" x 3\"",
    minOrderPanIndia: "10,000 units"
  },
  manpower: {
    totalDeployed: 154,
    benchAvailable: 42,
    activeSites: 11,
    tradesAvailable: ["Control Panel Wiremen", "High-Bay Lighting Technicians", "HT Cable Jointers", "Certified Welders", "Safety Officers"]
  },
  fabrication: {
    monthlyCapacityTons: 150,
    activeBayCount: 4,
    cableTrayTypes: ["90° Tray Bend", "45° Tray Bend", "Custom Tray Bend", "Reducer", "Straight Section"],
    currentRunningProjects: 5
  },
  farming: {
    duckEggDaily: 6000,
    duckEggStock: 12000,
    activeFishPonds: 6,
    standingFishBiomassTons: 24,
    primaryFishVarieties: ["Catla (Catla catla)", "Rohu (Labeo rohita)", "Big Gated Carp (Hypophthalmichthys nobilis)", "Ijrayl Catfish (Clarias batrachus)"]
  }
};

export const initialSettings = {
  companyName: "Erphan Alam Enterprises",
  shortName: "EAP Enterprises",
  logoUrl: "/Client logos/User Logo/eap-logo.png",
  proprietor: "Erphan Alam",
  primaryPhone: "7411069754",
  secondaryPhone: "7483020148",
  email: "alanerphan765@gmail.com",
  address: "Add.-Bchra Post Behra, PS.-Sikta, Dist.-West Champaran, Bihar-845307",
  announcementNotice: "ERPHAN ALAM ENTERPRISES • ALL INDIA INDUSTRIAL SUPPLY & MANPOWER CONTRACTING",
  whatsappNumber: "917411079754",
  gstin: "10EJDPA3213H1Z5",
  pan: "EJDPA3213H",
  bankDetails: {
    accountName: "Erphan Alam Enterprises",
    accountNumber: "50200039276697",
    bankName: "HDFC Bank",
    branch: "Narkatia Ganj",
    ifsc: "HDFC0006994"
  }
};

export const initialInvoices = [];

export const initialAttendance = [];
