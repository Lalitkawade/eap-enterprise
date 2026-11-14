import React, { useState } from "react";
import { useApp } from "../context/AppContext";
import { Calculator, ArrowRight, MessageCircle, Mail, CheckCircle2, ShieldCheck, Zap, Wrench, Boxes, Fish, Egg } from "lucide-react";

export const ArchitecturalEstimator = () => {
  const { addInquiry, settings, showToast } = useApp();

  const [division, setDivision] = useState("Electrical & Manpower");
  const [scope, setScope] = useState("Industrial Control Panel Wiring to Single-Line Diagram");
  const [volume, setVolume] = useState("Standard Commercial Project");
  const [location, setLocation] = useState("");
  const [timeline, setTimeline] = useState("Within 15 to 30 Days");
  const [clientName, setClientName] = useState("");
  const [clientPhone, setClientPhone] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const getScopeOptions = () => {
    switch (division) {
      case "Electrical & Manpower":
        return [
          "Industrial Control Panel Wiring to Single-Line Diagram",
          "Warehouse & Factory High-Bay LED Lighting Installation",
          "HT/LT Substation & Transformer Setup (up to 33kV)",
          "Certified Electricians & Wiremen Manpower Supply (10-50+ Staff)",
          "Industrial Safety Audit & Single-Line Electrical Verification"
        ];
      case "Cable Tray & Structural":
        return [
          "Galvanized Perforated Cable Tray 90° & 45° Bends",
          "Custom Cable Tray Fittings, Reducers & Straight Sections",
          "Pre-Engineered Building (PEB) Warehouse / Factory Shed",
          "Heavy Overhead Crane Girders & Support Frameworks",
          "Industrial Rolling Shutters & High-Security Sliding Gates"
        ];
      case "Red Kiln Bricks (9\"x4\"x3\")":
        return [
          "Standard 9\" × 4\" × 3\" Red Kiln Bricks (25,000 - 100,000 units)",
          "High Compressive Strength Bricks for Multi-Storey Foundations",
          "Mega Construction Consignment (100,000 to 1,000,000+ units)",
          "Direct Multi-Axle Truckload Site Dispatch",
          "Sample Consignment with Certified Compressive Strength Report"
        ];
      case "Freshwater Aquaculture":
        return [
          "Catla (Catla catla) Live Tank Bulk Dispatch",
          "Rohu (Labeo rohita) Live Freshwater Supply",
          "Big Gated Carp & Ijrayl Catfish Weekly Consignment",
          "Long-Term Live Fish Mandi / Distributor Supply Contract",
          "Multi-Tonne Oxygenated Tanker Truck Delivery"
        ];
      case "Duck Farming & Eggs":
        return [
          "Daily Fresh Duck Eggs in Sanitized Crates (5,000 - 15,000 units)",
          "Long-Term Bulk Supply from 6,000 Eggs/Day Production Output",
          "Wholesale Table Eggs for Commercial Bakeries & Institutions",
          "Live Duck Flock Wholesale Consignment",
          "Sanitized Plastic Crate Freight Dispatch"
        ];
      default:
        return ["Custom Technical Requirement"];
    }
  };

  const handleDivisionChange = (newDiv) => {
    setDivision(newDiv);
    switch (newDiv) {
      case "Electrical & Manpower":
        setScope("Industrial Control Panel Wiring to Single-Line Diagram");
        break;
      case "Cable Tray & Structural":
        setScope("Galvanized Perforated Cable Tray 90° & 45° Bends");
        break;
      case "Red Kiln Bricks (9\"x4\"x3\")":
        setScope("Standard 9\" × 4\" × 3\" Red Kiln Bricks (25,000 - 100,000 units)");
        break;
      case "Freshwater Aquaculture":
        setScope("Catla (Catla catla) Live Tank Bulk Dispatch");
        break;
      case "Duck Farming & Eggs":
        setScope("Daily Fresh Duck Eggs in Sanitized Crates (5,000 - 15,000 units)");
        break;
      default:
        break;
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!clientName || !clientPhone) {
      showToast("Please enter your name and contact phone number", "error");
      return;
    }

    addInquiry({
      name: clientName,
      phone: clientPhone,
      division,
      scope,
      volume,
      location: location || "All-India Dispatch",
      timeline,
      message: `Bespoke RFP generated for ${division} (${scope}). Scale: ${volume}. Target Site: ${location || "India"}. Timeline: ${timeline}.`
    });

    setSubmitted(true);
  };

  const generateWhatsAppUrl = () => {
    const text = `*Bespoke Services RFP Request - Erphan Alam Enterprises*\n\n` +
      `*Client:* ${clientName || "Prospective Client"}\n` +
      `*Contact:* ${clientPhone || "Provided"}\n` +
      `*Selected Service:* ${division}\n` +
      `*Scope:* ${scope}\n` +
      `*Scale:* ${volume}\n` +
      `*Site Destination:* ${location || "All-India Dispatch"}\n` +
      `*Timeline:* ${timeline}\n\n` +
      `Please provide commercial terms, freight schedule, and technical specification sheet.`;
    return `https://wa.me/${settings.whatsappNumber}?text=${encodeURIComponent(text)}`;
  };

  return (
    <section className="arch-section estimator-arch-section" id="estimator">
      <div className="container">
        
        <div className="arch-section-header text-center">
          <div className="arch-eyebrow centered">
            <span className="eyebrow-line"></span>
            <span className="eyebrow-text">ERPHAN ALAM ENTERPRISES • RFP CALCULATOR</span>
            <span className="eyebrow-line"></span>
          </div>
          <h2 className="arch-headline">
            Project Specification & <em>RFP Calculator</em>
          </h2>
          <p className="arch-subheadline max-w-700">
            Specify your technical scope, required quantities, and destination parameters to generate an immediate request for proposal 
            directed straight to Erphan Alam Enterprises' estimating and operations desk.
          </p>
        </div>

        <div className="arch-estimator-card">
          <form onSubmit={handleSubmit} className="arch-consult-form">
            
            {/* Step 1: Service Choice */}
            <div className="consult-step">
              <span className="consult-step-tag">STEP 01 — SELECT SERVICE VERTICAL</span>
              <div className="arch-pill-select-grid" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))" }}>
                {[
                  "Electrical & Manpower",
                  "Cable Tray & Structural",
                  "Red Kiln Bricks (9\"x4\"x3\")",
                  "Freshwater Aquaculture",
                  "Duck Farming & Eggs"
                ].map((dName) => (
                  <button
                    key={dName}
                    type="button"
                    className={`arch-select-pill ${division === dName ? "selected" : ""}`}
                    onClick={() => handleDivisionChange(dName)}
                  >
                    <span className="pill-check-indicator"></span>
                    <span>{dName}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Step 2: Scope & Volume */}
            <div className="consult-step">
              <span className="consult-step-tag">STEP 02 — DEFINE SCOPE & VOLUME</span>
              <div className="input-grid-2">
                <div className="arch-form-field">
                  <label>Specific Service Scope</label>
                  <select
                    className="arch-select-input"
                    value={scope}
                    onChange={(e) => setScope(e.target.value)}
                  >
                    {getScopeOptions().map((opt, idx) => (
                      <option key={idx} value={opt}>{opt}</option>
                    ))}
                  </select>
                </div>

                <div className="arch-form-field">
                  <label>Project Scale / Batch Size</label>
                  <select
                    className="arch-select-input"
                    value={volume}
                    onChange={(e) => setVolume(e.target.value)}
                  >
                    <option value="Standard Commercial Project">Standard Commercial Scale</option>
                    <option value="High Volume Bulk (Fleet / Plant)">Large Industrial Bulk (Direct Fleet)</option>
                    <option value="Multi-Year / Ongoing Supply Contract">Multi-Year / Ongoing Supply Contract</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Step 3: Location & Contact */}
            <div className="consult-step">
              <span className="consult-step-tag">STEP 03 — SITE LOGISTICS & APPLICANT</span>
              <div className="input-grid-2">
                <div className="arch-form-field">
                  <label>Site / Destination State (India)</label>
                  <input
                    type="text"
                    className="arch-text-input"
                    placeholder="e.g. Pune, Maharashtra / Bengaluru, Karnataka"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                  />
                </div>

                <div className="arch-form-field">
                  <label>Mobilization Timeline</label>
                  <select
                    className="arch-select-input"
                    value={timeline}
                    onChange={(e) => setTimeline(e.target.value)}
                  >
                    <option value="Immediate Mobilization (< 7 Days)">Immediate Mobilization (&lt; 7 Days)</option>
                    <option value="Within 15 to 30 Days">Within 15 to 30 Days</option>
                    <option value="Upcoming Quarter / Planned Project">Planned Future Project</option>
                  </select>
                </div>
              </div>

              <div className="input-grid-2">
                <div className="arch-form-field">
                  <label>Your Name / Firm <span className="req">*</span></label>
                  <input
                    type="text"
                    className="arch-text-input"
                    placeholder="Full name or company name"
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                    required
                  />
                </div>

                <div className="arch-form-field">
                  <label>Mobile Number <span className="req">*</span></label>
                  <input
                    type="tel"
                    className="arch-text-input"
                    placeholder="10-digit mobile number"
                    value={clientPhone}
                    onChange={(e) => setClientPhone(e.target.value)}
                    required
                  />
                </div>
              </div>
            </div>

            {/* Generated Specification Dossier Box */}
            <div className="arch-dossier-preview">
              <div className="dossier-header-bar">
                <span className="dossier-tag">PROPOSED SCOPE DOSSIER</span>
                <span className="dossier-badge">ALL INDIA LOGISTICS ASSURED</span>
              </div>
              <div className="dossier-lines">
                <div className="dossier-line">
                  <span className="dossier-k">Vertical:</span>
                  <span className="dossier-v">{division}</span>
                </div>
                <div className="dossier-line">
                  <span className="dossier-k">Requirement:</span>
                  <span className="dossier-v">{scope}</span>
                </div>
                <div className="dossier-line">
                  <span className="dossier-k">Scale & Delivery:</span>
                  <span className="dossier-v">{volume} • Destination: {location || "All India"} ({timeline})</span>
                </div>
              </div>
            </div>

            {/* Submit Action Bar */}
            <div className="arch-form-actions">
              <button type="submit" className="btn-arch-primary">
                <span>Submit Official RFP</span>
                <ArrowRight size={15} />
              </button>

              <a
                href={generateWhatsAppUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-arch-whatsapp"
              >
                <MessageCircle size={15} />
                <span>Send to WhatsApp (+91 {settings.primaryPhone})</span>
              </a>
            </div>

            {submitted && (
              <div className="arch-alert-success mt-4">
                <CheckCircle2 size={20} className="text-bronze" />
                <div>
                  <strong>RFP Transmitted!</strong> Your technical request has been registered. Our operations team will follow up with drawings, availability, and direct quotation within 24 hours.
                </div>
              </div>
            )}
          </form>
        </div>

      </div>
    </section>
  );
};
