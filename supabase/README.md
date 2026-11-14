# Erphan Alam Enterprises (EAP) — Supabase SQL Database Guide

This directory contains the production-ready PostgreSQL / Supabase SQL schema, initial seed data, and a 1-click consolidated setup runner designed for the **Erphan Alam Enterprises Operations Console & Admin Portal**.

---

## 📁 File Structure

| File | Purpose |
| :--- | :--- |
| [`complete_setup.sql`](file:///c:/Users/kawad/.gemini/antigravity-ide/scratch/eap-enterprises/supabase/complete_setup.sql) | **Master 1-Click Script**: DDL schema + RLS policies + stored procedure + KPIs view + seed data. |
| [`schema.sql`](file:///c:/Users/kawad/.gemini/antigravity-ide/scratch/eap-enterprises/supabase/schema.sql) | Standalone DDL schema, foreign keys, indexes, triggers, and Row Level Security policies. |
| [`seed.sql`](file:///c:/Users/kawad/.gemini/antigravity-ide/scratch/eap-enterprises/supabase/seed.sql) | Standalone realistic initial seed data matching real operational records. |
| [`../src/services/supabaseClient.js`](file:///c:/Users/kawad/.gemini/antigravity-ide/scratch/eap-enterprises/src/services/supabaseClient.js) | Frontend REST client service with zero extra npm dependencies. |

---

## 🚀 3-Minute Quick Setup in Supabase

### Step 1: Open Supabase Project
1. Go to your [Supabase Dashboard](https://supabase.com/dashboard) and select your project (or create a new free tier project).
2. Click on the **SQL Editor** icon in the left navigation sidebar.

### Step 2: Run Master Setup Script
1. Click **"+ New query"** button at the top.
2. Open [`complete_setup.sql`](file:///c:/Users/kawad/.gemini/antigravity-ide/scratch/eap-enterprises/supabase/complete_setup.sql), copy all lines, and paste into the query window.
3. Click the green **"Run"** button (or press `Ctrl` + `Enter`).
4. You will see a verification table output:
   ```
   status: 'Supabase Setup Completed Successfully!'
   app_settings_records: 1
   divisions_count: 5
   inquiries_count: 4
   inventory_sections: 4
   invoices_count: 3
   attendance_count: 2
   ```

### Step 3: Connect Frontend Application
1. In your Supabase Dashboard, navigate to **Project Settings** (gear icon) → **API**.
2. Copy:
   - **Project URL** (e.g., `https://xyzabcdefg.supabase.co`)
   - **anon public key** (`eyJhbGciOi...`)
3. In your project root, create or edit `.env`:
   ```bash
   VITE_SUPABASE_URL=https://your-project-id.supabase.co
   VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   ```
4. Restart your Vite development server:
   ```bash
   npm run dev
   ```

---

## 🗄️ Database Architecture & Tables

### 1. `app_settings` (Corporate Profile & Tax Master)
Stores primary enterprise details used dynamically across the website and PDF headers:
- Company name, proprietor (`Erphan Alam`), phone numbers, and West Champaran address.
- GSTIN and PAN registration numbers for commercial invoicing.
- Bank details for NEFT/RTGS payment settlements.
- Cloud Auth: Protected via Supabase Authentication (managed in Supabase Dashboard -> Authentication -> Users).

### 2. `divisions` (5 Core Operational CMS)
Powers the dynamic landing page verticals, capabilities, technical specs, and photo gallery:
- `elec`: Industrial Electrical Contracting & Certified Manpower Supply
- `fab`: Cable Tray Fabrication & Heavy Structural Steel
- `brick`: High-Strength Kiln & Machine-Moulded Red Bricks (9"×4"×3", 2M yard stock)
- `fish`: Commercial Freshwater Aquaculture & Live Fish Supply
- `duck`: Commercial Duck Farming & High-Yield Egg Production (6,000/day)

### 3. `inquiries` (Client RFPs & Online Inquiries)
Tracks incoming buyer proposals and site contracting requests:
- Status lifecycle: `New` → `Contacted` → `In Progress` → `Negotiation` → `Closed`
- Captured fields: Name, company, phone, email, division, scope, volume, location, timeline, and remarks.

### 4. `inventory_metrics` (Yard Stock & Daily Production Operations)
Key performance metrics shown on the dashboard and website:
- Bricks: Yard stock (2,000,000 units), annual capacity (4.2M), daily production (45,000).
- Manpower: Active pool (196), deployed (154), bench reserve (42), active sites (11).
- Fabrication: Monthly capacity (150 metric tons), running projects, tray profiles.
- Farming: Daily egg output (6,000), stock buffer (12,000), 6 active fish ponds.

### 5. `invoices` (Tax Invoices & Official Quotations)
Complete billing ledger matching statutory GST format:
- Supports `Tax Invoice` and `Official Quotation`.
- Dynamic JSONB `items` array with SAC/HSN codes (`998517`, `730890`, `690100`), units (`Days`, `Hours`, `Nos`, `Mtr`, `Man-Months`), quantities, and unit rates.
- Automatic tax breakdown: IGST or CGST + SGST @ 18%, subtotal, and rounded grand total.
- Cross-references: Work Order No, Work Order Date, SRN Document No, SRN Date, and SRN ID.

### 6. `attendance_records` (Site Manpower Rosters & Muster Sheets)
Monthly site muster roll and wage verification:
- `workers` (JSONB): Day-by-day attendance tracking, regular days worked, overtime hours, daily rate, and OT rate.
- `summary_by_trade` (JSONB): Auto-computed trade-by-trade billable quantities (Electricians, Fitters, Welders, Riggers, Helpers).
- Foreign Key: `linked_invoice_id` links directly to `invoices.id`.

---

## ⚡ Stored Procedure: `convert_attendance_to_invoice`

Converts a verified attendance muster sheet into an official GST Tax Invoice in a single atomic database transaction:

```sql
SELECT public.convert_attendance_to_invoice(
    'ATT-2026-09-DMIC',  -- Attendance Record ID
    18.00                -- GST Rate percentage (default 18.0%)
);
```

**Actions Performed by the Procedure:**
1. Loads the attendance record by ID.
2. Generates a new invoice number (e.g., `INV-ATT-742`).
3. Extracts all trade line items (`summary_by_trade`) and maps them to invoice line items with SAC `998517`.
4. Calculates subtotal, 18% IGST tax amount, and rounded grand total.
5. Inserts a new record into `public.invoices`.
6. Sets the attendance record status to `Billed` and assigns `linked_invoice_id`.
7. Returns a JSON payload `{ success: true, invoice_id: '...', grand_total: ... }`.

---

## 🔒 Security & Row Level Security (RLS)

All 6 tables enforce PostgreSQL Row Level Security:
- **Public Visitors (Anonymous)**:
  - Can read `app_settings` (company name, phone, address).
  - Can read `divisions` where `status = 'active'`.
  - Can read `inventory_metrics` (to display capacity metrics on public landing page).
  - Can `INSERT` into `inquiries` (to submit RFPs and lead forms from the website).
  - **Cannot** view invoices, attendance sheets, or internal notes.
- **Admins (Authenticated)**:
  - Full `SELECT`, `INSERT`, `UPDATE`, and `DELETE` access across all tables.
- **Service Role**:
  - Full administrative bypass for background automations and cron jobs.

---

## 📊 Analytics View: `v_dashboard_kpis`

Query live executive dashboard metrics with one select:

```sql
SELECT * FROM public.v_dashboard_kpis;
```

**Columns Returned:**
- `total_inquiries`: Total inquiries received.
- `new_inquiries_pending`: Uncontacted leads requiring immediate attention.
- `total_invoiced_inr`: Total gross billing amount across tax invoices.
- `paid_revenue_inr`: Realized cash receipts.
- `pending_collections_inr`: Outstanding invoices awaiting payment.
- `total_quotations`: Number of active scope quotations.
- `pending_attendance_bills`: Muster rolls pending invoice generation.
- `active_divisions_count`: Operating business verticals.
- `bricks_yard_stock`: Red clay bricks in yard stock.
- `active_manpower_deployed`: Certified technicians currently deployed at client sites.
