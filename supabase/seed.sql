-- ==============================================================================
-- ERPHAN ALAM ENTERPRISES (EAP) - SEED DATA SCRIPT
-- Populates Enterprise Master Profile, 5 Industrial Verticals CMS & Live Stock Metrics
-- (Transactional tables: inquiries, invoices, and attendance are kept clean for real data)
-- ==============================================================================

-- 1. APP SETTINGS (Corporate Master Profile, Tax & Bank Account)
INSERT INTO public.app_settings (
    id,
    company_name,
    short_name,
    logo_url,
    proprietor,
    primary_phone,
    secondary_phone,
    email,
    address,
    announcement_notice,
    whatsapp_number,
    gstin,
    pan,
    bank_account_name,
    bank_account_number,
    bank_name,
    bank_branch,
    bank_ifsc
) VALUES (
    'a0000000-0000-0000-0000-000000000001',
    'Erphan Alam Enterprises',
    'EAP Enterprises',
    '/Client logos/User Logo/eap-logo.png',
    'Erphan Alam',
    '7411069754',
    '7483020148',
    'alanerphan765@gmail.com',
    'Add.-Bchra Post Behra, PS.-Sikta, Dist.-West Champaran, Bihar-845307',
    'ERPHAN ALAM ENTERPRISES • ALL INDIA INDUSTRIAL SUPPLY & MANPOWER CONTRACTING',
    '917411079754',
    '10EJDPA3213H1Z5',
    'EJDPA3213H',
    'Erphan Alam Enterprises',
    '50200039276697',
    'HDFC Bank',
    'Narkatia Ganj',
    'HDFC0006994'
) ON CONFLICT (id) DO UPDATE SET
    company_name = EXCLUDED.company_name,
    short_name = EXCLUDED.short_name,
    logo_url = EXCLUDED.logo_url,
    proprietor = EXCLUDED.proprietor,
    primary_phone = EXCLUDED.primary_phone,
    secondary_phone = EXCLUDED.secondary_phone,
    email = EXCLUDED.email,
    address = EXCLUDED.address,
    announcement_notice = EXCLUDED.announcement_notice,
    whatsapp_number = EXCLUDED.whatsapp_number,
    gstin = EXCLUDED.gstin,
    pan = EXCLUDED.pan,
    bank_account_name = EXCLUDED.bank_account_name,
    bank_account_number = EXCLUDED.bank_account_number,
    bank_name = EXCLUDED.bank_name,
    bank_branch = EXCLUDED.bank_branch,
    bank_ifsc = EXCLUDED.bank_ifsc,
    updated_at = NOW();

-- 2. DIVISIONS (5 Core Industrial Operational Pillars)
INSERT INTO public.divisions (
    id, number, name, short_name, tagline, category, accent_color, image_url,
    status, status_label, lead_desc, key_capabilities, specs, highlight_stat, gallery
) VALUES
(
    'elec',
    '01',
    'Industrial Electrical Contracting & Certified Manpower Supply',
    'Electrical & Manpower',
    'Industrial Control Panel Wiring, Warehouse High-Bay Lighting & 33kV Substations',
    'Electrical Engineering & Staffing',
    '#00e5ff',
    '/assets/images/gen-electrical-panel.jpg',
    'active',
    'Immediate Nationwide Mobilization',
    'Turnkey electrical contracting for manufacturing facilities, industrial warehouses, and substations up to 33kV. Direct execution of control panel wiring adhering to single-line diagrams, high-bay lighting with aerial scissor lifts, and rapid deployment of certified wiremen.',
    '[
        "Industrial Control Panels & DB: Complete wiring, busbar assembly & circuit breaker integration to single-line schematics",
        "Factory High-Bay Lighting: Aerial scissor lift installation, cable raceways & lighting distribution boards",
        "Turnkey HT / LT Substations: Erection, transformer commissioning up to 33kV & CEIG approvals",
        "Certified Technical Manpower: Immediate deployment of licensed wiremen, electricians & safety officers",
        "Safety Standards: 100% PPE compliance, insurance coverage & single-line diagram execution"
    ]'::jsonb,
    '[
        {"label": "Voltage Scope", "value": "LT (415V) to HT (11kV / 33kV / 66kV)"},
        {"label": "Technicians Available", "value": "150+ Certified Wiremen & Electricians"},
        {"label": "Mobilization Time", "value": "Within 48-72 Hours Pan-India"},
        {"label": "Safety Compliance", "value": "100% PPE, ESIC, PF & Single-Line Verification"}
    ]'::jsonb,
    '150+ Certified Technicians Deployed',
    '[
        {
            "url": "/assets/images/gen-electrical-panel.jpg",
            "title": "Industrial MCC/PCC Panel Wiring & Single Line Diagram Execution",
            "tag": "Control Panel Wiring",
            "desc": "Certified industrial electrician executing control panel wiring conforming to single-line diagrams, color-coded phase cabling, and circuit breaker testing."
        },
        {
            "url": "/assets/images/gen-warehouse-lighting.jpg",
            "title": "Warehouse & Factory High-Bay LED Lighting Installation",
            "tag": "High-Bay Lighting",
            "desc": "Aerial installation of high-efficiency LED industrial bay lights using hydraulic scissor lifts, overhead cable trays, and lighting distribution boards."
        }
    ]'::jsonb
),
(
    'fab',
    '02',
    'Cable Tray Fabrication & Heavy Structural Steel',
    'Cable Tray & Structural',
    'Perforated Cable Tray Bends, Pre-Engineered Building Sheds & Gantry Girders',
    'Metal Fabrication & Heavy Engineering',
    '#f59e0b',
    '/assets/images/gen-cable-tray-welding.jpg',
    'active',
    'Continuous Workshop Production',
    'Specialized fabrication of heavy-duty galvanized cable trays, elbows, reducers, and custom bends, alongside structural steel fabrication for industrial warehouses, PEB factory sheds, and overhead crane run-beams.',
    '[
        "Cable Tray Fabrication: 90° bends, 45° bends, reducers, straight sections & custom cable raceways",
        "Pre-Engineered Buildings (PEB): Industrial warehousing frameworks, heavy rafters & columns",
        "Heavy Gantry Crane Girders, conveyor gantries & industrial mezzanine steel platforms",
        "Heavy Commercial Rolling Shutters, motorized high-security sliding gates & barriers",
        "Certified MIG, TIG & ARC Welding conforming to IS 2062 Grade high-tensile steel"
    ]'::jsonb,
    '[
        {"label": "Workshop Capacity", "value": "150+ Metric Tons Fabricated / Month"},
        {"label": "Steel Grades", "value": "IS 2062 Grade E250 / E350 High-Tensile Steel"},
        {"label": "Cable Tray Fittings", "value": "90° Bends, 45° Bends, Reducers & Custom Sections"},
        {"label": "Corrosion Protection", "value": "Hot-Dip Galvanized & Red Oxide Epoxy Primed"}
    ]'::jsonb,
    '150+ Tons Monthly Output',
    '[
        {
            "url": "/assets/images/gen-cable-tray-welding.jpg",
            "title": "Galvanized Cable Tray Fabrication: 90°, 45° & Custom Bends",
            "tag": "Tray Fabrication",
            "desc": "Precision MIG welding and sheet metal fabrication of galvanized perforated cable tray bends, elbows, reducers, and straight sections."
        },
        {
            "url": "/assets/images/metal-fabrication.jpg",
            "title": "Pre-Engineered Building Structural Steel & Crane Girders",
            "tag": "PEB Steel Sheds",
            "desc": "Heavy factory framework fabrication, overhead crane run-beams, and industrial mezzanine steel structures."
        }
    ]'::jsonb
),
(
    'brick',
    '03',
    'High-Strength Kiln & Machine-Moulded Red Bricks',
    'Red Kiln Bricks',
    'Standard 9\" × 4\" × 3\" Bricks, 4.2 Million Annual Output & 2 Million Ready Stock',
    'Construction Materials',
    '#ea580c',
    '/assets/images/gen-brick-kiln-yard.jpg',
    'active',
    '2,000,000 Units Ready Stock',
    'High-output brick kiln facility producing superior red clay bricks with uniform geometry, sharp edges, and high compressive strength. Featuring massive 4.2 million units annual production capacity and 2 million units ready stock for immediate site dispatch.',
    '[
        "Standard Brick Geometry: Exactly 9 Inch Length × 4 Inch Width × 3 Inch Height",
        "High Compressive Strength: 12.5 – 15.0 N/mm² for multi-storey load-bearing masonry",
        "Massive Yard Stock: 2,000,000 units ready in stock for immediate bulk procurement",
        "High Annual Production: 4,200,000 units manufactured per year",
        "Mechanized loading & direct multi-axle truckloads dispatched nationwide"
    ]'::jsonb,
    '[
        {"label": "Standard Dimensions", "value": "Length: 9\" | Width: 4\" | Height: 3\""},
        {"label": "Annual Production", "value": "4,200,000 Bricks / Year"},
        {"label": "Current Ready Stock", "value": "2,000,000 Bricks in Yard"},
        {"label": "Compressive Strength", "value": "12.5 – 15.0 N/mm² (Exceeds IS 1077)"}
    ]'::jsonb,
    '2,000,000 Ready in Yard',
    '[
        {
            "url": "/assets/images/gen-brick-kiln-yard.jpg",
            "title": "Commercial Brick Kiln & Sun-Curing Stacks",
            "tag": "Kiln Yard & Stacks",
            "desc": "Industrial chimney kiln facility with continuous firing chambers, sun-cured brick stacks, and mechanized tractor-trolley dispatch."
        },
        {
            "url": "/assets/images/brick-manufacturing.jpg",
            "title": "Standard 9\" × 4\" × 3\" Red Clay Bricks Production",
            "tag": "9\"×4\"×3\" Geometry",
            "desc": "Certified high compressive strength bricks (12.5–15.0 N/mm²) engineered for load-bearing multi-storey masonry."
        }
    ]'::jsonb
),
(
    'fish',
    '04',
    'Commercial Freshwater Aquaculture & Live Fish Supply',
    'Freshwater Aquaculture',
    'Catla, Rohu, Big Gated Carp & Ijrayl Catfish with Aerated Ponds & Live Delivery',
    'Aquaculture & Live Fish Supply',
    '#0284c7',
    '/assets/images/gen-aquaculture-pond.jpg',
    'active',
    'Continuous Weekly Harvests',
    'Scientifically managed freshwater aquaculture ponds equipped with electric paddlewheel aerators, balanced pellet feeding, and live oxygenated transport tanks. Supplying wholesale freshwater table fish across Indian markets.',
    '[
        "Catla (Catla catla): High-growth surface feeder with firm flesh and premium market demand",
        "Rohu (Labeo rohita): Column feeder raised with balanced pellet nutrition",
        "Big Gated Carp (Hypophthalmichthys nobilis): Plankton-nourished large freshwater carp",
        "Ijrayl Catfish (Clarias batrachus): Hardy, high-protein freshwater catfish",
        "Live Fish Oxygenated Transport: Dedicated tank trucks ensuring 100% live arrival at wholesale mandis"
    ]'::jsonb,
    '[
        {"label": "Primary Species", "value": "Catla, Rohu, Big Gated Carp, Ijrayl Catfish"},
        {"label": "Pond Technology", "value": "High-Efficiency Electric Paddlewheel Aerators"},
        {"label": "Feed Standards", "value": "High-Protein Extruded Floating Pellets"},
        {"label": "Dispatch Logistics", "value": "Live Oxygenated Transport Tanks & Cold Chain"}
    ]'::jsonb,
    '4 Core Freshwater Species',
    '[
        {
            "url": "/assets/images/gen-aquaculture-pond.jpg",
            "title": "Commercial Aquaculture Ponds with Paddlewheel Aeration",
            "tag": "Pond Aeration",
            "desc": "Paddlewheel aerators spinning and oxygenating clear water in large green-banked ponds with daily pellet feeding."
        },
        {
            "url": "/assets/images/fish-farming-pond.jpg",
            "title": "Live Freshwater Fish Harvest & Oxygenated Truck Dispatch",
            "tag": "Live Mandi Supply",
            "desc": "Continuous weekly harvests of Catla, Rohu, Big Gated Carp & Ijrayl Catfish shipped in oxygenated live tanks."
        }
    ]'::jsonb
),
(
    'duck',
    '05',
    'Commercial Duck Farming & High-Yield Egg Production',
    'Duck Farming & Eggs',
    '6,000 Fresh Eggs Daily Production & 12,000 Units Current Ready Stock',
    'Poultry & Commercial Egg Production',
    '#10b981',
    '/assets/images/gen-duck-egg-farm.jpg',
    'active',
    '6,000 Eggs Harvested Daily',
    'Modern commercial duck farming complex providing high-yield, hygienic duck egg production. Producing 6,000 fresh table eggs every day with a constant buffer of 12,000 eggs in stock, sorted in sanitized crates for wholesale supply.',
    '[
        "Daily Egg Output: 6,000 fresh, hygienic duck eggs collected daily",
        "Buffer Stock: 12,000 graded eggs maintained in ready-to-dispatch crates",
        "Hygienic Handling: Washed, sorted, and packed in heavy-duty plastic crate stacks",
        "Free-Range Farm Environment: Natural water ponds and clean shelter sheds",
        "Wholesale Institutional Contracts: Bulk supply for commercial bakeries, hotels & distributors"
    ]'::jsonb,
    '[
        {"label": "Daily Production", "value": "6,000 Fresh Duck Eggs / Day"},
        {"label": "Current Stock", "value": "12,000 Graded Eggs in Yard"},
        {"label": "Packaging", "value": "Heavy-Duty Sanitized Plastic Crates"},
        {"label": "Quality Assurance", "value": "100% Fresh, Hygienic & Tested Supply"}
    ]'::jsonb,
    '6,000 Eggs Produced Daily',
    '[
        {
            "url": "/assets/images/gen-duck-egg-farm.jpg",
            "title": "Free-Range Duck Farm & Fresh Harvested Egg Crates",
            "tag": "Duck Flock & Pond",
            "desc": "Healthy flock of layer ducks with pond access, clean feed nutrition, and fresh white table duck eggs harvested daily into crates."
        },
        {
            "url": "/assets/images/duck-egg-production.jpg",
            "title": "Graded Fresh White Duck Eggs in Sanitized Crates",
            "tag": "6,000 Eggs / Day",
            "desc": "Daily morning egg collections washed, candled, graded, and stacked in commercial sanitized plastic crates."
        }
    ]'::jsonb
)
ON CONFLICT (id) DO UPDATE SET
    number = EXCLUDED.number,
    name = EXCLUDED.name,
    short_name = EXCLUDED.short_name,
    tagline = EXCLUDED.tagline,
    category = EXCLUDED.category,
    accent_color = EXCLUDED.accent_color,
    image_url = EXCLUDED.image_url,
    status = EXCLUDED.status,
    status_label = EXCLUDED.status_label,
    lead_desc = EXCLUDED.lead_desc,
    key_capabilities = EXCLUDED.key_capabilities,
    specs = EXCLUDED.specs,
    highlight_stat = EXCLUDED.highlight_stat,
    gallery = EXCLUDED.gallery,
    updated_at = NOW();

-- 3. INVENTORY METRICS (Live Yard Stock & Production Capacities)
INSERT INTO public.inventory_metrics (section, metrics)
VALUES
(
    'bricks',
    '{
        "yardStock": 2000000,
        "annualProduction": 4200000,
        "dailyProduction": 45000,
        "kilnStatus": "Fully Operational Chimney Kiln",
        "standardSize": "9\" x 4\" x 3\"",
        "minOrderPanIndia": "10,000 units"
    }'::jsonb
),
(
    'manpower',
    '{
        "totalDeployed": 154,
        "benchAvailable": 42,
        "activeSites": 11,
        "tradesAvailable": [
            "Control Panel Wiremen",
            "High-Bay Lighting Technicians",
            "HT Cable Jointers",
            "Certified Welders",
            "Safety Officers"
        ]
    }'::jsonb
),
(
    'fabrication',
    '{
        "monthlyCapacityTons": 150,
        "activeBayCount": 4,
        "cableTrayTypes": [
            "90° Tray Bend",
            "45° Tray Bend",
            "Custom Tray Bend",
            "Reducer",
            "Straight Section"
        ],
        "currentRunningProjects": 5
    }'::jsonb
),
(
    'farming',
    '{
        "duckEggDaily": 6000,
        "duckEggStock": 12000,
        "activeFishPonds": 6,
        "standingFishBiomassTons": 24,
        "primaryFishVarieties": [
            "Catla (Catla catla)",
            "Rohu (Labeo rohita)",
            "Big Gated Carp (Hypophthalmichthys nobilis)",
            "Ijrayl Catfish (Clarias batrachus)"
        ]
    }'::jsonb
)
ON CONFLICT (section) DO UPDATE SET
    metrics = EXCLUDED.metrics,
    updated_at = NOW();

-- NOTE: Transactional tables (inquiries, invoices, attendance_records) are intentionally
-- initialized clean without dummy records so you can manage authentic records directly!
