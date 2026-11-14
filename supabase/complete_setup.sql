-- ==============================================================================
-- ERPHAN ALAM ENTERPRISES (EAP)
-- COMPLETE SUPABASE MASTER SETUP SCRIPT (1-CLICK RUNNER)
-- ==============================================================================
-- Description:
-- Complete production database schema, security policies, stored procedures,
-- views, and core industrial master seeds tailored for the Erphan Alam Enterprises Admin Portal.
--
-- Note:
-- Dummy transactional records (leads, dummy invoices, dummy attendance) have been removed.
-- Only core industrial specifications, capacity metrics, and company profiles are seeded.
--
-- How to run:
-- 1. Log in to your Supabase project (https://supabase.com/dashboard)
-- 2. Open the "SQL Editor" from the left sidebar
-- 3. Click "+ New query"
-- 4. Copy and paste this ENTIRE script into the editor
-- 5. Click the "Run" button (or press Ctrl + Enter / Cmd + Enter)
-- ==============================================================================

BEGIN;

-- ==============================================================================
-- 1. EXTENSIONS
-- ==============================================================================
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ==============================================================================
-- 2. AUTOMATED TIMESTAMP TRIGGER FUNCTION
-- ==============================================================================
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ==============================================================================
-- 3. TABLE: APP_SETTINGS (Corporate Profile, Tax & Bank Account)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.app_settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_name TEXT NOT NULL DEFAULT 'Erphan Alam Enterprises',
    short_name TEXT NOT NULL DEFAULT 'EAP Enterprises',
    logo_url TEXT DEFAULT '/Client logos/User Logo/eap-logo.png',
    proprietor TEXT NOT NULL DEFAULT 'Erphan Alam',
    primary_phone TEXT NOT NULL DEFAULT '7411069754',
    secondary_phone TEXT DEFAULT '7483020148',
    email TEXT NOT NULL DEFAULT 'alanerphan765@gmail.com',
    address TEXT NOT NULL DEFAULT 'Add.-Bchra Post Behra, PS.-Sikta, Dist.-West Champaran, Bihar-845307',
    announcement_notice TEXT DEFAULT 'ERPHAN ALAM ENTERPRISES • ALL INDIA INDUSTRIAL SUPPLY & MANPOWER CONTRACTING',
    whatsapp_number TEXT DEFAULT '917411079754',
    gstin TEXT DEFAULT '10EJDPA3213H1Z5',
    pan TEXT DEFAULT 'EJDPA3213H',
    bank_account_name TEXT DEFAULT 'Erphan Alam',
    bank_account_number TEXT DEFAULT '50200039276697',
    bank_name TEXT DEFAULT 'HDFC Bank',
    bank_branch TEXT DEFAULT 'Narkatia Ganj',
    bank_ifsc TEXT DEFAULT 'HDFC0006994',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

DROP TRIGGER IF EXISTS trg_app_settings_updated_at ON public.app_settings;
CREATE TRIGGER trg_app_settings_updated_at
BEFORE UPDATE ON public.app_settings
FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- ==============================================================================
-- 4. TABLE: DIVISIONS (CMS For 5 Core Verticals)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.divisions (
    id TEXT PRIMARY KEY, -- 'elec', 'fab', 'brick', 'fish', 'duck'
    number TEXT NOT NULL,
    name TEXT NOT NULL,
    short_name TEXT NOT NULL,
    tagline TEXT,
    category TEXT NOT NULL,
    accent_color TEXT DEFAULT '#c5a880',
    image_url TEXT,
    status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'standby', 'scaling', 'inactive')),
    status_label TEXT,
    lead_desc TEXT,
    key_capabilities JSONB NOT NULL DEFAULT '[]'::jsonb,
    specs JSONB NOT NULL DEFAULT '[]'::jsonb,
    highlight_stat TEXT,
    gallery JSONB NOT NULL DEFAULT '[]'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

DROP TRIGGER IF EXISTS trg_divisions_updated_at ON public.divisions;
CREATE TRIGGER trg_divisions_updated_at
BEFORE UPDATE ON public.divisions
FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- ==============================================================================
-- 5. TABLE: INQUIRIES (Client RFPs & Online Leads)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.inquiries (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    company TEXT DEFAULT 'Individual',
    phone TEXT NOT NULL,
    email TEXT,
    division TEXT NOT NULL,
    volume TEXT DEFAULT 'Standard Commercial',
    scope TEXT NOT NULL,
    location TEXT DEFAULT 'India',
    timeline TEXT DEFAULT 'Within 15 to 30 Days',
    message TEXT,
    status TEXT NOT NULL DEFAULT 'New' CHECK (status IN ('New', 'Contacted', 'In Progress', 'Negotiation', 'Closed')),
    notes TEXT DEFAULT 'Submitted via Website Online Portal',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_inquiries_status ON public.inquiries(status);
CREATE INDEX IF NOT EXISTS idx_inquiries_created_at ON public.inquiries(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_inquiries_division ON public.inquiries(division);

DROP TRIGGER IF EXISTS trg_inquiries_updated_at ON public.inquiries;
CREATE TRIGGER trg_inquiries_updated_at
BEFORE UPDATE ON public.inquiries
FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- ==============================================================================
-- 6. TABLE: INVENTORY_METRICS (Yard Stock & Daily Production Operations)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.inventory_metrics (
    section TEXT PRIMARY KEY, -- 'bricks', 'manpower', 'fabrication', 'farming'
    metrics JSONB NOT NULL DEFAULT '{}'::jsonb,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

DROP TRIGGER IF EXISTS trg_inventory_metrics_updated_at ON public.inventory_metrics;
CREATE TRIGGER trg_inventory_metrics_updated_at
BEFORE UPDATE ON public.inventory_metrics
FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- ==============================================================================
-- 7. TABLE: INVOICES (Tax Invoices & Official Scope Quotations)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.invoices (
    id TEXT PRIMARY KEY,
    type TEXT NOT NULL DEFAULT 'Tax Invoice' CHECK (type IN ('Tax Invoice', 'Official Quotation')),
    invoice_number TEXT NOT NULL UNIQUE,
    date DATE NOT NULL DEFAULT CURRENT_DATE,
    due_date DATE,
    status TEXT NOT NULL DEFAULT 'Pending' CHECK (status IN ('Draft', 'Sent', 'Pending', 'Paid', 'Approved', 'Cancelled')),
    project_name TEXT NOT NULL,
    client_name TEXT NOT NULL,
    client_address TEXT,
    client_gst TEXT,
    client_phone TEXT,
    client_email TEXT,
    work_order_no TEXT,
    work_order_date DATE,
    srn_doc_no TEXT,
    srn_date TEXT,
    srn_id TEXT,
    items JSONB NOT NULL DEFAULT '[]'::jsonb,
    subtotal NUMERIC(15, 2) NOT NULL DEFAULT 0.00,
    tax_type TEXT NOT NULL DEFAULT 'IGST' CHECK (tax_type IN ('IGST', 'CGST_SGST', 'NONE')),
    tax_rate NUMERIC(5, 2) NOT NULL DEFAULT 18.00,
    tax_amount NUMERIC(15, 2) NOT NULL DEFAULT 0.00,
    grand_total NUMERIC(15, 2) NOT NULL DEFAULT 0.00,
    notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_invoices_type ON public.invoices(type);
CREATE INDEX IF NOT EXISTS idx_invoices_status ON public.invoices(status);
CREATE INDEX IF NOT EXISTS idx_invoices_date ON public.invoices(date DESC);
CREATE INDEX IF NOT EXISTS idx_invoices_client_name ON public.invoices(client_name);

DROP TRIGGER IF EXISTS trg_invoices_updated_at ON public.invoices;
CREATE TRIGGER trg_invoices_updated_at
BEFORE UPDATE ON public.invoices
FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- ==============================================================================
-- 8. TABLE: ATTENDANCE_RECORDS (Site Manpower Rosters & Wage Muster Sheets)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.attendance_records (
    id TEXT PRIMARY KEY,
    site_name TEXT NOT NULL,
    client_name TEXT NOT NULL,
    billing_month TEXT NOT NULL,
    reference_no TEXT,
    linked_invoice_id TEXT REFERENCES public.invoices(id) ON DELETE SET NULL,
    date_created DATE NOT NULL DEFAULT CURRENT_DATE,
    status TEXT NOT NULL DEFAULT 'Pending Billing' CHECK (status IN ('Pending Billing', 'Verified', 'Billed')),
    workers JSONB NOT NULL DEFAULT '[]'::jsonb,
    summary_by_trade JSONB NOT NULL DEFAULT '[]'::jsonb,
    grand_total NUMERIC(15, 2) NOT NULL DEFAULT 0.00,
    notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_attendance_site ON public.attendance_records(site_name);
CREATE INDEX IF NOT EXISTS idx_attendance_status ON public.attendance_records(status);
CREATE INDEX IF NOT EXISTS idx_attendance_month ON public.attendance_records(billing_month);
CREATE INDEX IF NOT EXISTS idx_attendance_linked_inv ON public.attendance_records(linked_invoice_id);

DROP TRIGGER IF EXISTS trg_attendance_updated_at ON public.attendance_records;
CREATE TRIGGER trg_attendance_updated_at
BEFORE UPDATE ON public.attendance_records
FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- ==============================================================================
-- 9. STORED PROCEDURE: ATOMIC 1-CLICK ATTENDANCE TO TAX INVOICE CONVERSION
-- ==============================================================================
CREATE OR REPLACE FUNCTION public.convert_attendance_to_invoice(
    p_attendance_id TEXT,
    p_tax_rate NUMERIC DEFAULT 18.00
)
RETURNS JSONB AS $$
DECLARE
    v_att RECORD;
    v_inv_id TEXT;
    v_items JSONB := '[]'::jsonb;
    v_trade RECORD;
    v_subtotal NUMERIC(15, 2) := 0;
    v_tax_amount NUMERIC(15, 2) := 0;
    v_grand_total NUMERIC(15, 2) := 0;
    v_result JSONB;
BEGIN
    SELECT * INTO v_att FROM public.attendance_records WHERE id = p_attendance_id;
    IF NOT FOUND THEN
        RAISE EXCEPTION 'Attendance record % not found', p_attendance_id;
    END IF;

    -- Generate sequential invoice number: INV-001, INV-002, etc.
    SELECT 'INV-' || lpad((COALESCE(MAX(NULLIF(regexp_replace(invoice_number, '^INV-(\d+)$', '\1', 'i'), '')::INT), 0) + 1)::TEXT, 3, '0')
    INTO v_inv_id
    FROM public.invoices
    WHERE invoice_number ~* '^INV-\d+$';

    IF v_inv_id IS NULL THEN
        v_inv_id := 'INV-001';
    END IF;

    FOR v_trade IN SELECT * FROM jsonb_to_recordset(v_att.summary_by_trade) 
        AS x(trade TEXT, unit TEXT, "billQty" NUMERIC, rate NUMERIC, amount NUMERIC)
    LOOP
        v_items := v_items || jsonb_build_object(
            'id', jsonb_array_length(v_items) + 1,
            'hsnSac', '998517',
            'description', v_trade.trade || ' deployment - ' || v_att.site_name,
            'unit', COALESCE(v_trade.unit, 'Days'),
            'qty', COALESCE(v_trade."billQty", 1),
            'rate', COALESCE(v_trade.rate, 0),
            'amount', COALESCE(v_trade.amount, (COALESCE(v_trade."billQty", 1) * COALESCE(v_trade.rate, 0)))
        );
        v_subtotal := v_subtotal + COALESCE(v_trade.amount, 0);
    END LOOP;

    IF v_subtotal = 0 THEN
        v_subtotal := v_att.grand_total;
        v_items := jsonb_build_array(jsonb_build_object(
            'id', 1,
            'hsnSac', '998517',
            'description', 'Technical Manpower Deployment - ' || v_att.site_name,
            'unit', 'Nos',
            'qty', 1,
            'rate', v_subtotal,
            'amount', v_subtotal
        ));
    END IF;

    v_tax_amount := ROUND((v_subtotal * (p_tax_rate / 100.0)), 2);
    v_grand_total := ROUND((v_subtotal + v_tax_amount), 2);

    INSERT INTO public.invoices (
        id,
        type,
        invoice_number,
        date,
        due_date,
        status,
        project_name,
        client_name,
        client_address,
        client_gst,
        work_order_no,
        work_order_date,
        srn_doc_no,
        srn_date,
        srn_id,
        items,
        subtotal,
        tax_type,
        tax_rate,
        tax_amount,
        grand_total,
        notes
    ) VALUES (
        v_inv_id,
        'Tax Invoice',
        v_inv_id,
        CURRENT_DATE,
        CURRENT_DATE + INTERVAL '30 days',
        'Sent',
        v_att.site_name,
        v_att.client_name,
        'Project Site Client Office',
        '29AABCV7295G1Z5',
        COALESCE(v_att.reference_no, 'WO-ATT-BILL'),
        v_att.date_created,
        COALESCE(v_att.reference_no, '-'),
        v_att.date_created::TEXT,
        COALESCE(v_att.reference_no, '-'),
        v_items,
        v_subtotal,
        'IGST',
        p_tax_rate,
        v_tax_amount,
        v_grand_total,
        'Generated from Manpower Attendance Sheet (' || v_att.id || ' - ' || v_att.billing_month || ') for site: ' || v_att.site_name
    );

    UPDATE public.attendance_records
    SET status = 'Billed',
        linked_invoice_id = v_inv_id,
        updated_at = NOW()
    WHERE id = p_attendance_id;

    SELECT jsonb_build_object(
        'success', true,
        'invoice_id', v_inv_id,
        'grand_total', v_grand_total,
        'subtotal', v_subtotal,
        'tax_amount', v_tax_amount
    ) INTO v_result;

    RETURN v_result;
END;
$$ LANGUAGE plpgsql;

-- ==============================================================================
-- 10. REAL-TIME EXECUTIVE DASHBOARD ANALYTICS VIEW
-- ==============================================================================
CREATE OR REPLACE VIEW public.v_dashboard_kpis AS
SELECT
    (SELECT COUNT(*) FROM public.inquiries) AS total_inquiries,
    (SELECT COUNT(*) FROM public.inquiries WHERE status = 'New') AS new_inquiries_pending,
    (SELECT COALESCE(SUM(grand_total), 0) FROM public.invoices WHERE type = 'Tax Invoice') AS total_invoiced_inr,
    (SELECT COALESCE(SUM(grand_total), 0) FROM public.invoices WHERE type = 'Tax Invoice' AND status = 'Paid') AS paid_revenue_inr,
    (SELECT COALESCE(SUM(grand_total), 0) FROM public.invoices WHERE type = 'Tax Invoice' AND status IN ('Pending', 'Sent')) AS pending_collections_inr,
    (SELECT COUNT(*) FROM public.invoices WHERE type = 'Official Quotation') AS total_quotations,
    (SELECT COUNT(*) FROM public.attendance_records WHERE status = 'Pending Billing') AS pending_attendance_bills,
    (SELECT COUNT(*) FROM public.divisions WHERE status = 'active') AS active_divisions_count,
    (SELECT COALESCE((metrics->>'yardStock')::NUMERIC, 0) FROM public.inventory_metrics WHERE section = 'bricks') AS bricks_yard_stock,
    (SELECT COALESCE((metrics->>'totalDeployed')::NUMERIC, 0) FROM public.inventory_metrics WHERE section = 'manpower') AS active_manpower_deployed;

-- ==============================================================================
-- 11. ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================
ALTER TABLE public.app_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.divisions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inventory_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.attendance_records ENABLE ROW LEVEL SECURITY;

-- 11.1 PUBLIC VISITOR POLICIES
DO $$ 
BEGIN
    -- Secure public view for anonymous visitors (public contact & branding only; zero bank/PAN details)
    CREATE OR REPLACE VIEW public.v_company_profile AS
    SELECT 
        id, company_name, short_name, logo_url, proprietor, primary_phone, secondary_phone,
        email, address, announcement_notice, whatsapp_number
    FROM public.app_settings;

    GRANT SELECT ON public.v_company_profile TO anon, authenticated;

    -- Drop any unrestricted public read on full app_settings
    DROP POLICY IF EXISTS "Public can view app settings" ON public.app_settings;

    DROP POLICY IF EXISTS "Public can view active divisions" ON public.divisions;
    CREATE POLICY "Public can view active divisions" ON public.divisions FOR SELECT USING (status = 'active');

    DROP POLICY IF EXISTS "Public can insert RFQ inquiries" ON public.inquiries;
    CREATE POLICY "Public can insert RFQ inquiries" ON public.inquiries FOR INSERT WITH CHECK (true);

    DROP POLICY IF EXISTS "Public can view inventory metrics" ON public.inventory_metrics;
    CREATE POLICY "Public can view inventory metrics" ON public.inventory_metrics FOR SELECT USING (true);
END $$;

-- 11.2 AUTHENTICATED ADMIN POLICIES
DO $$
BEGIN
    DROP POLICY IF EXISTS "Admins have full access to app_settings" ON public.app_settings;
    CREATE POLICY "Admins have full access to app_settings" ON public.app_settings FOR ALL TO authenticated USING (true) WITH CHECK (true);

    DROP POLICY IF EXISTS "Admins have full access to divisions" ON public.divisions;
    CREATE POLICY "Admins have full access to divisions" ON public.divisions FOR ALL TO authenticated USING (true) WITH CHECK (true);

    DROP POLICY IF EXISTS "Admins have full access to inquiries" ON public.inquiries;
    CREATE POLICY "Admins have full access to inquiries" ON public.inquiries FOR ALL TO authenticated USING (true) WITH CHECK (true);

    DROP POLICY IF EXISTS "Admins have full access to inventory_metrics" ON public.inventory_metrics;
    CREATE POLICY "Admins have full access to inventory_metrics" ON public.inventory_metrics FOR ALL TO authenticated USING (true) WITH CHECK (true);

    DROP POLICY IF EXISTS "Admins have full access to invoices" ON public.invoices;
    CREATE POLICY "Admins have full access to invoices" ON public.invoices FOR ALL TO authenticated USING (true) WITH CHECK (true);

    DROP POLICY IF EXISTS "Admins have full access to attendance_records" ON public.attendance_records;
    CREATE POLICY "Admins have full access to attendance_records" ON public.attendance_records FOR ALL TO authenticated USING (true) WITH CHECK (true);
END $$;

-- 11.3 SERVICE ROLE POLICIES
DO $$
BEGIN
    DROP POLICY IF EXISTS "Service role full access settings" ON public.app_settings;
    CREATE POLICY "Service role full access settings" ON public.app_settings FOR ALL TO service_role USING (true) WITH CHECK (true);

    DROP POLICY IF EXISTS "Service role full access divisions" ON public.divisions;
    CREATE POLICY "Service role full access divisions" ON public.divisions FOR ALL TO service_role USING (true) WITH CHECK (true);

    DROP POLICY IF EXISTS "Service role full access inquiries" ON public.inquiries;
    CREATE POLICY "Service role full access inquiries" ON public.inquiries FOR ALL TO service_role USING (true) WITH CHECK (true);

    DROP POLICY IF EXISTS "Service role full access inventory" ON public.inventory_metrics;
    CREATE POLICY "Service role full access inventory" ON public.inventory_metrics FOR ALL TO service_role USING (true) WITH CHECK (true);

    DROP POLICY IF EXISTS "Service role full access invoices" ON public.invoices;
    CREATE POLICY "Service role full access invoices" ON public.invoices FOR ALL TO service_role USING (true) WITH CHECK (true);

    DROP POLICY IF EXISTS "Service role full access attendance" ON public.attendance_records;
    CREATE POLICY "Service role full access attendance" ON public.attendance_records FOR ALL TO service_role USING (true) WITH CHECK (true);
END $$;

-- ==============================================================================
-- 12. INITIAL CORE SEED DATA (Enterprise Profile & Industrial CMS)
-- ==============================================================================

-- App Master Settings (Proprietor, GSTIN, PAN, Bank Details)
INSERT INTO public.app_settings (
    id, company_name, short_name, logo_url, proprietor, primary_phone, secondary_phone,
    email, address, announcement_notice, whatsapp_number,
    gstin, pan, bank_account_name, bank_account_number, bank_name, bank_branch, bank_ifsc
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

-- 5 Industrial Divisions
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
    '["Industrial Control Panels & DB: Complete wiring, busbar assembly & circuit breaker integration to single-line schematics", "Factory High-Bay Lighting: Aerial scissor lift installation, cable raceways & lighting distribution boards", "Turnkey HT / LT Substations: Erection, transformer commissioning up to 33kV & CEIG approvals", "Certified Technical Manpower: Immediate deployment of licensed wiremen, electricians & safety officers", "Safety Standards: 100% PPE compliance, insurance coverage & single-line diagram execution"]'::jsonb,
    '[{"label": "Voltage Scope", "value": "LT (415V) to HT (11kV / 33kV / 66kV)"}, {"label": "Technicians Available", "value": "150+ Certified Wiremen & Electricians"}, {"label": "Mobilization Time", "value": "Within 48-72 Hours Pan-India"}, {"label": "Safety Compliance", "value": "100% PPE, ESIC, PF & Single-Line Verification"}]'::jsonb,
    '150+ Certified Technicians Deployed',
    '[{"url": "/assets/images/gen-electrical-panel.jpg", "title": "Industrial MCC/PCC Panel Wiring & Single Line Diagram Execution", "tag": "Control Panel Wiring", "desc": "Certified industrial electrician executing control panel wiring conforming to single-line diagrams, color-coded phase cabling, and circuit breaker testing."}, {"url": "/assets/images/gen-warehouse-lighting.jpg", "title": "Warehouse & Factory High-Bay LED Lighting Installation", "tag": "High-Bay Lighting", "desc": "Aerial installation of high-efficiency LED industrial bay lights using hydraulic scissor lifts, overhead cable trays, and lighting distribution boards."}]'::jsonb
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
    '["Cable Tray Fabrication: 90° bends, 45° bends, reducers, straight sections & custom cable raceways", "Pre-Engineered Buildings (PEB): Industrial warehousing frameworks, heavy rafters & columns", "Heavy Gantry Crane Girders, conveyor gantries & industrial mezzanine steel platforms", "Heavy Commercial Rolling Shutters, motorized high-security sliding gates & barriers", "Certified MIG, TIG & ARC Welding conforming to IS 2062 Grade high-tensile steel"]'::jsonb,
    '[{"label": "Workshop Capacity", "value": "150+ Metric Tons Fabricated / Month"}, {"label": "Steel Grades", "value": "IS 2062 Grade E250 / E350 High-Tensile Steel"}, {"label": "Cable Tray Fittings", "value": "90° Bends, 45° Bends, Reducers & Custom Sections"}, {"label": "Corrosion Protection", "value": "Hot-Dip Galvanized & Red Oxide Epoxy Primed"}]'::jsonb,
    '150+ Tons Monthly Output',
    '[{"url": "/assets/images/gen-cable-tray-welding.jpg", "title": "Galvanized Cable Tray Fabrication: 90°, 45° & Custom Bends", "tag": "Tray Fabrication", "desc": "Precision MIG welding and sheet metal fabrication of galvanized perforated cable tray bends, elbows, reducers, and straight sections."}, {"url": "/assets/images/metal-fabrication.jpg", "title": "Pre-Engineered Building Structural Steel & Crane Girders", "tag": "PEB Steel Sheds", "desc": "Heavy factory framework fabrication, overhead crane run-beams, and industrial mezzanine steel structures."}]'::jsonb
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
    '["Standard Brick Geometry: Exactly 9 Inch Length × 4 Inch Width × 3 Inch Height", "High Compressive Strength: 12.5 – 15.0 N/mm² for multi-storey load-bearing masonry", "Massive Yard Stock: 2,000,000 units ready in stock for immediate bulk procurement", "High Annual Production: 4,200,000 units manufactured per year", "Mechanized loading & direct multi-axle truckloads dispatched nationwide"]'::jsonb,
    '[{"label": "Standard Dimensions", "value": "Length: 9\" | Width: 4\" | Height: 3\""}, {"label": "Annual Production", "value": "4,200,000 Bricks / Year"}, {"label": "Current Ready Stock", "value": "2,000,000 Bricks in Yard"}, {"label": "Compressive Strength", "value": "12.5 – 15.0 N/mm² (Exceeds IS 1077)"}]'::jsonb,
    '2,000,000 Ready in Yard',
    '[{"url": "/assets/images/gen-brick-kiln-yard.jpg", "title": "Commercial Brick Kiln & Sun-Curing Stacks", "tag": "Kiln Yard & Stacks", "desc": "Industrial chimney kiln facility with continuous firing chambers, sun-cured brick stacks, and mechanized tractor-trolley dispatch."}, {"url": "/assets/images/brick-manufacturing.jpg", "title": "Standard 9\" × 4\" × 3\" Red Clay Bricks Production", "tag": "9\"×4\"×3\" Geometry", "desc": "Certified high compressive strength bricks (12.5–15.0 N/mm²) engineered for load-bearing multi-storey masonry."}]'::jsonb
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
    '["Catla (Catla catla): High-growth surface feeder with firm flesh and premium market demand", "Rohu (Labeo rohita): Column feeder raised with balanced pellet nutrition", "Big Gated Carp (Hypophthalmichthys nobilis): Plankton-nourished large freshwater carp", "Ijrayl Catfish (Clarias batrachus): Hardy, high-protein freshwater catfish", "Live Fish Oxygenated Transport: Dedicated tank trucks ensuring 100% live arrival at wholesale mandis"]'::jsonb,
    '[{"label": "Primary Species", "value": "Catla, Rohu, Big Gated Carp, Ijrayl Catfish"}, {"label": "Pond Technology", "value": "High-Efficiency Electric Paddlewheel Aerators"}, {"label": "Feed Standards", "value": "High-Protein Extruded Floating Pellets"}, {"label": "Dispatch Logistics", "value": "Live Oxygenated Transport Tanks & Cold Chain"}]'::jsonb,
    '4 Core Freshwater Species',
    '[{"url": "/assets/images/gen-aquaculture-pond.jpg", "title": "Commercial Aquaculture Ponds with Paddlewheel Aeration", "tag": "Pond Aeration", "desc": "Paddlewheel aerators spinning and oxygenating clear water in large green-banked ponds with daily pellet feeding."}, {"url": "/assets/images/fish-farming-pond.jpg", "title": "Live Freshwater Fish Harvest & Oxygenated Truck Dispatch", "tag": "Live Mandi Supply", "desc": "Continuous weekly harvests of Catla, Rohu, Big Gated Carp & Ijrayl Catfish shipped in oxygenated live tanks."}]'::jsonb
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
    '["Daily Egg Output: 6,000 fresh, hygienic duck eggs collected daily", "Buffer Stock: 12,000 graded eggs maintained in ready-to-dispatch crates", "Hygienic Handling: Washed, sorted, and packed in heavy-duty plastic crate stacks", "Free-Range Farm Environment: Natural water ponds and clean shelter sheds", "Wholesale Institutional Contracts: Bulk supply for commercial bakeries, hotels & distributors"]'::jsonb,
    '[{"label": "Daily Production", "value": "6,000 Fresh Duck Eggs / Day"}, {"label": "Current Stock", "value": "12,000 Graded Eggs in Yard"}, {"label": "Packaging", "value": "Heavy-Duty Sanitized Plastic Crates"}, {"label": "Quality Assurance", "value": "100% Fresh, Hygienic & Tested Supply"}]'::jsonb,
    '6,000 Eggs Produced Daily',
    '[{"url": "/assets/images/gen-duck-egg-farm.jpg", "title": "Free-Range Duck Farm & Fresh Harvested Egg Crates", "tag": "Duck Flock & Pond", "desc": "Healthy flock of layer ducks with pond access, clean feed nutrition, and fresh white table duck eggs harvested daily into crates."}, {"url": "/assets/images/duck-egg-production.jpg", "title": "Graded Fresh White Duck Eggs in Sanitized Crates", "tag": "6,000 Eggs / Day", "desc": "Daily morning egg collections washed, candled, graded, and stacked in commercial sanitized plastic crates."}]'::jsonb
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

-- Live Yard Stock & Operational Capacity Metrics
INSERT INTO public.inventory_metrics (section, metrics)
VALUES
('bricks', '{"yardStock": 2000000, "annualProduction": 4200000, "dailyProduction": 45000, "kilnStatus": "Fully Operational Chimney Kiln", "standardSize": "9\" x 4\" x 3\"", "minOrderPanIndia": "10,000 units"}'::jsonb),
('manpower', '{"totalDeployed": 154, "benchAvailable": 42, "activeSites": 11, "tradesAvailable": ["Control Panel Wiremen", "High-Bay Lighting Technicians", "HT Cable Jointers", "Certified Welders", "Safety Officers"]}'::jsonb),
('fabrication', '{"monthlyCapacityTons": 150, "activeBayCount": 4, "cableTrayTypes": ["90° Tray Bend", "45° Tray Bend", "Custom Tray Bend", "Reducer", "Straight Section"], "currentRunningProjects": 5}'::jsonb),
('farming', '{"duckEggDaily": 6000, "duckEggStock": 12000, "activeFishPonds": 6, "standingFishBiomassTons": 24, "primaryFishVarieties": ["Catla (Catla catla)", "Rohu (Labeo rohita)", "Big Gated Carp (Hypophthalmichthys nobilis)", "Ijrayl Catfish (Clarias batrachus)"]}'::jsonb)
ON CONFLICT (section) DO UPDATE SET
    metrics = EXCLUDED.metrics,
    updated_at = NOW();

-- NOTE: Transactional operational tables (inquiries, invoices, attendance_records)
-- are left completely clean and fresh for your real business records!

COMMIT;

-- ==============================================================================
-- 13. VERIFICATION QUERY (Run this to verify setup)
-- ==============================================================================
SELECT 
    'Supabase Master Setup Completed Successfully!' AS status,
    (SELECT COUNT(*) FROM public.app_settings) AS app_settings_records,
    (SELECT COUNT(*) FROM public.divisions) AS divisions_count,
    (SELECT COUNT(*) FROM public.inventory_metrics) AS inventory_sections,
    (SELECT COUNT(*) FROM public.inquiries) AS inquiries_count,
    (SELECT COUNT(*) FROM public.invoices) AS invoices_count,
    (SELECT COUNT(*) FROM public.attendance_records) AS attendance_count;
