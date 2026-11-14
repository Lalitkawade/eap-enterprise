import React, { useState } from "react";
import { useApp } from "../context/AppContext";
import {
  Calculator,
  Bolt,
  Flame,
  Sprout,
  Boxes,
  ClipboardCheck,
  Send,
  MessageCircle,
  Mail,
  ShieldCheck,
  CheckCircle2,
  Headphones
} from "lucide-react";

export const Estimator = () => {
  const { addInquiry, settings, showToast } = useApp();

  const [division, setDivision] = useState("Electrical & Manpower");
  const [scope, setScope] = useState("HT/LT Substation & Transformer Setup");
  const [volume, setVolume] = useState("Standard Commercial Project");
  const [location, setLocation] = useState("");
  const [timeline, setTimeline] = useState("Within 15 to 30 Days");
  const [clientName, setClientName] = useState("");
  const [clientPhone, setClientPhone] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Dynamic scope options based on chosen division
  const getScopeOptions = () => {
    switch (division) {
      case "Electrical & Manpower":
        return [
          "HT/LT Substation & Transformer Setup (up to 33kV)",
          "Industrial Power Distribution & Cable Tray Cabling",
          "Certified Electricians & Wiremen Manpower Supply (10-50+ Staff)",
          "Industrial Safety Audit & CEIG Inspectorate Approval",
          "Factory Electrification & Control Panel Commissioning"
        ];
      case "Metal Fabrication":
        return [
          "Pre-Engineered Building (PEB) Warehouse / Factory Shed",
          "Heavy Overhead Crane Girders & Support Frameworks",
          "Industrial Heavy Sliding Gates & Motorized Shutters",
          "Custom Storage Tanks, Silos & High-Temperature Ducting",
          "Architectural Steel Staircases, Mezzanine Floors & Railings"
        ];
      case "Integrated Farming":
        return [
          "Bulk Live Broiler Birds Supply (Weekly Batches)",
          "Wholesale Commercial Graded Table Eggs Supply",
          "Freshwater Fish (Rohu & Katla) Live Tank Dispatch",
          "Pangasius / Tilapia Bulk Fish Supply for Processing",
          "Long-Term Multi-Tonne Institutional Protein Supply Contract"
        ];
      case "Bricks Manufacturing":
        return [
          "First-Class Kiln-Fired Red Clay Bricks (25,000 - 100,000 units)",
          "High-Strength Engineering Bricks for Multi-Storey Foundations",
          "Mega Construction Consignment (100,000 to 1,000,000+ units)",
          "Eco-Friendly Solid Fly Ash & Cement Bricks",
          "Sample Consignment with Certified Compressive Strength Report"
        ];
      default:
        return ["Custom Commercial Requirement"];
    }
  };

  const handleDivisionChange = (newDiv) => {
    setDivision(newDiv);
    // Auto-select first scope option
    switch (newDiv) {
      case "Electrical & Manpower":
        setScope("HT/LT Substation & Transformer Setup (up to 33kV)");
        break;
      case "Metal Fabrication":
        setScope("Pre-Engineered Building (PEB) Warehouse / Factory Shed");
        break;
      case "Integrated Farming":
        setScope("Bulk Live Broiler Birds Supply (Weekly Batches)");
        break;
      case "Bricks Manufacturing":
        setScope("First-Class Kiln-Fired Red Clay Bricks (25,000 - 100,000 units)");
        break;
      default:
        break;
    }
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (!clientName || !clientPhone) {
      showToast("Please enter your name and phone number to generate quote", "error");
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
      message: `RFP generated via online estimator for ${division} (${scope}). Volume: ${volume}. Target Destination: ${location || "India"}.`
    });

    setIsSubmitted(true);
  };

  const generateWhatsAppUrl = () => {
    const text = `*New RFP / Estimate Request - Earphan Alam Enterprises (EAP)*\n\n` +
      `*Client:* ${clientName || "Prospective Client"}\n` +
      `*Phone:* ${clientPhone || "Provided on Chat"}\n` +
      `*Division:* ${division}\n` +
      `*Scope:* ${scope}\n` +
      `*Scale/Volume:* ${volume}\n` +
      `*Delivery Location:* ${location || "All-India Dispatch"}\n` +
      `*Required Timeline:* ${timeline}\n\n` +
      `Please provide best commercial terms, delivery schedule, and test compliance.`;
    return `https://wa.me/${settings.whatsappNumber}?text=${encodeURIComponent(text)}`;
  };

  const generateMailtoUrl = () => {
    const subject = `RFP: ${division} Inquiry - ${clientName || "Commercial Lead"}`;
    const body = `Dear Earphan Alam Enterprises Management,\n\n` +
      `We would like to request an official quotation for the following:\n\n` +
      `Division: ${division}\n` +
      `Specific Requirement: ${scope}\n` +
      `Volume / Scale: ${volume}\n` +
      `Site Destination: ${location || "Pan-India"}\n` +
      `Required Timeline: ${timeline}\n` +
      `Contact Name: ${clientName}\n` +
      `Contact Phone: ${clientPhone}\n\n` +
      `Kindly reply with commercial proposal and supply capabilities.\n\n` +
      `Best regards,\n${clientName}`;
    return `mailto:${settings.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };

  return (
    <section className="estimator-section" id="estimator">
      <div className="container">
        <div className="section-header text-center">
          <span className="section-badge">
            <Calculator size={14} className="inline-icon" /> INSTANT INQUIRY ASSISTANT
          </span>
          <h2 className="section-title">Interactive Project & RFP Cost Guide</h2>
          <p className="section-subtitle">
            Configure your project parameters below to generate an immediate RFP specification 
            directed straight to Earphan Alam Enterprises' sales and estimation desk.
          </p>
        </div>

        <div className="estimator-wrapper">
          {/* Main Estimator Form */}
          <div className="estimator-form-card">
            <form onSubmit={handleFormSubmit}>
              
              {/* Step 1: Division Radio Selection */}
              <div className="form-step">
                <label className="form-step-title">
                  <span className="step-num">1</span> Choose Primary Division
                </label>
                <div className="division-radio-grid">
                  <label className={`radio-card ${division === "Electrical & Manpower" ? "selected" : ""}`}>
                    <input
                      type="radio"
                      name="estDivision"
                      value="Electrical & Manpower"
                      checked={division === "Electrical & Manpower"}
                      onChange={() => handleDivisionChange("Electrical & Manpower")}
                    />
                    <div className="radio-card-content">
                      <Bolt size={20} className="text-cyan" />
                      <span className="card-title">Electrical & Manpower</span>
                      <span className="card-desc">Substations, Wiring, Staff</span>
                    </div>
                  </label>

                  <label className={`radio-card ${division === "Metal Fabrication" ? "selected" : ""}`}>
                    <input
                      type="radio"
                      name="estDivision"
                      value="Metal Fabrication"
                      checked={division === "Metal Fabrication"}
                      onChange={() => handleDivisionChange("Metal Fabrication")}
                    />
                    <div className="radio-card-content">
                      <Flame size={20} className="text-amber" />
                      <span className="card-title">Metal Fabrication</span>
                      <span className="card-desc">PEB Sheds, Steel Trusses</span>
                    </div>
                  </label>

                  <label className={`radio-card ${division === "Integrated Farming" ? "selected" : ""}`}>
                    <input
                      type="radio"
                      name="estDivision"
                      value="Integrated Farming"
                      checked={division === "Integrated Farming"}
                      onChange={() => handleDivisionChange("Integrated Farming")}
                    />
                    <div className="radio-card-content">
                      <Sprout size={20} className="text-emerald" />
                      <span className="card-title">Integrated Farming</span>
                      <span className="card-desc">Poultry & Freshwater Fish</span>
                    </div>
                  </label>

                  <label className={`radio-card ${division === "Bricks Manufacturing" ? "selected" : ""}`}>
                    <input
                      type="radio"
                      name="estDivision"
                      value="Bricks Manufacturing"
                      checked={division === "Bricks Manufacturing"}
                      onChange={() => handleDivisionChange("Bricks Manufacturing")}
                    />
                    <div className="radio-card-content">
                      <Boxes size={20} className="text-terracotta" />
                      <span className="card-title">Bricks Manufacturing</span>
                      <span className="card-desc">High Strength Red Bricks</span>
                    </div>
                  </label>
                </div>
              </div>

              {/* Step 2: Scope & Volume */}
              <div className="form-step">
                <label className="form-step-title">
                  <span className="step-num">2</span> Project Scope & Scale
                </label>
                <div className="input-grid-2">
                  <div className="form-group">
                    <label>Specific Scope / Item</label>
                    <select
                      className="form-select"
                      value={scope}
                      onChange={(e) => setScope(e.target.value)}
                    >
                      {getScopeOptions().map((opt, idx) => (
                        <option key={idx} value={opt}>{opt}</option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group">
                    <label>Volume / Project Scale</label>
                    <select
                      className="form-select"
                      value={volume}
                      onChange={(e) => setVolume(e.target.value)}
                    >
                      <option value="Standard Commercial Project">Standard Commercial Scale</option>
                      <option value="High Volume Bulk (Fleet / Plant)">Large Industrial Bulk (Direct Fleet)</option>
                      <option value="Multi-Year / Ongoing Supply Contract">Multi-Year / Ongoing Turnkey Contract</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Step 3: Logistics & Client Info */}
              <div className="form-step">
                <label className="form-step-title">
                  <span className="step-num">3</span> Destination & Your Contact
                </label>
                <div className="input-grid-2">
                  <div className="form-group">
                    <label>Site / Delivery State & City</label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="e.g. Pune, Maharashtra / Bengaluru, Karnataka"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                    />
                  </div>

                  <div className="form-group">
                    <label>Required Timeline</label>
                    <select
                      className="form-select"
                      value={timeline}
                      onChange={(e) => setTimeline(e.target.value)}
                    >
                      <option value="Immediate Mobilization (< 7 Days)">Immediate Mobilization (&lt; 7 Days)</option>
                      <option value="Within 15 to 30 Days">Within 15 to 30 Days</option>
                      <option value="Upcoming Quarter / Planned Project">Planned Future Project</option>
                    </select>
                  </div>
                </div>

                <div className="input-grid-2 mt-3">
                  <div className="form-group">
                    <label>Your Name / Organization <span className="text-cyan">*</span></label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="e.g. Anand Builders / Tech Infra"
                      value={clientName}
                      onChange={(e) => setClientName(e.target.value)}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>Mobile Number <span className="text-cyan">*</span></label>
                    <input
                      type="tel"
                      className="form-input"
                      placeholder="e.g. 9876543210"
                      value={clientPhone}
                      onChange={(e) => setClientPhone(e.target.value)}
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Generated Preview Box */}
              <div className="estimator-summary-box">
                <div className="summary-header">
                  <ClipboardCheck size={18} className="text-cyan" />
                  <span>Generated Inquiry Specification</span>
                </div>
                <div className="summary-body">
                  <div className="summary-row">
                    <strong>Division:</strong> <span>{division}</span>
                  </div>
                  <div className="summary-row">
                    <strong>Scope:</strong> <span>{scope}</span>
                  </div>
                  <div className="summary-row">
                    <strong>Scale:</strong> <span>{volume}</span>
                  </div>
                  <div className="summary-row">
                    <strong>Delivery:</strong> <span>{location || "All-India Coverage"} ({timeline})</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="estimator-submit-row">
                <button type="submit" className="btn btn-primary btn-lg">
                  <Send size={18} /> <span>Submit Official RFP Online</span>
                </button>

                <a
                  href={generateWhatsAppUrl()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-whatsapp-header btn-lg"
                >
                  <MessageCircle size={18} /> <span>Send via WhatsApp (+91 {settings.primaryPhone})</span>
                </a>

                <a
                  href={generateMailtoUrl()}
                  className="btn btn-outline-light btn-lg"
                >
                  <Mail size={18} /> <span>Draft Email</span>
                </a>
              </div>

              {isSubmitted && (
                <div className="alert-success-banner mt-3">
                  <CheckCircle2 size={20} className="text-emerald" />
                  <div>
                    <strong>RFP Successfully Registered!</strong> Our project desk has received your request and will review technical specifications within 24 hours.
                  </div>
                </div>
              )}
            </form>
          </div>

          {/* Sidebar Trust Column */}
          <div className="estimator-sidebar">
            <div className="trust-box">
              <h3>
                <ShieldCheck size={20} className="text-cyan inline-icon" /> The EAP Guarantee
              </h3>
              <ul className="trust-list">
                <li>
                  <CheckCircle2 size={18} className="text-cyan" />
                  <div>
                    <strong>Direct Factory Rates</strong>
                    <p>Direct manufacturer and contractor pricing without intermediary brokerage.</p>
                  </div>
                </li>
                <li>
                  <CheckCircle2 size={18} className="text-cyan" />
                  <div>
                    <strong>All-India Transit Assurance</strong>
                    <p>Secured freight arrangements ensuring minimum transit damage and prompt arrival.</p>
                  </div>
                </li>
                <li>
                  <CheckCircle2 size={18} className="text-cyan" />
                  <div>
                    <strong>Statutory Compliance</strong>
                    <p>ESIC, PF, safety gears, and IS standards strictly observed across all works.</p>
                  </div>
                </li>
                <li>
                  <CheckCircle2 size={18} className="text-cyan" />
                  <div>
                    <strong>Proprietor Accountability</strong>
                    <p>Direct oversight by {settings.proprietor} for large contracts and infrastructure supplies.</p>
                  </div>
                </li>
              </ul>

              <div className="helpline-card">
                <div className="helpline-icon">
                  <Headphones size={24} />
                </div>
                <div className="helpline-text">
                  <span>Direct Sales Helpline</span>
                  <strong>+91 {settings.primaryPhone}</strong>
                  <span>+91 {settings.secondaryPhone}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
