import React, { useState, useEffect } from "react";
import { useApp } from "../context/AppContext";
import {
  X,
  ArrowRight,
  MessageCircle,
  CheckCircle2,
  ShieldCheck,
  RotateCcw
} from "lucide-react";

export const InquiryModal = () => {
  const { inquiryModalData, closeInquiryModal, addInquiry, settings, showToast } = useApp();

  const serviceVerticals = [
    { value: "Industrial Electrical Contracting & Manpower", label: "1. Industrial Electrical Contracting & Manpower" },
    { value: "Metal Fabrication & Cable Tray Manufacturing", label: "2. Metal Fabrication & Cable Tray Manufacturing" },
    { value: "Red Kiln Bricks (9\"×4\"×3\") Direct Bulk Supply", label: "3. Red Kiln Bricks (9\"×4\"×3\") Direct Bulk Supply" },
    { value: "Freshwater Aquaculture & Duck Farming", label: "4. Freshwater Aquaculture & Duck Farming" },
    { value: "Turnkey Industrial Plant Work & Custom Scope", label: "5. Turnkey Industrial Plant Work & Custom Scope" }
  ];

  const mapDivisionToVertical = (name = "") => {
    const lower = name.toLowerCase();
    if (lower.includes("elec") || lower.includes("light") || lower.includes("wire") || lower.includes("substation") || lower.includes("manpower")) {
      return "Industrial Electrical Contracting & Manpower";
    }
    if (lower.includes("fab") || lower.includes("tray") || lower.includes("weld") || lower.includes("steel") || lower.includes("peb") || lower.includes("metal")) {
      return "Metal Fabrication & Cable Tray Manufacturing";
    }
    if (lower.includes("brick") || lower.includes("kiln") || lower.includes("clay")) {
      return "Red Kiln Bricks (9\"×4\"×3\") Direct Bulk Supply";
    }
    if (lower.includes("aqua") || lower.includes("fish") || lower.includes("duck") || lower.includes("egg") || lower.includes("farm")) {
      return "Freshwater Aquaculture & Duck Farming";
    }
    if (lower.includes("plant") || lower.includes("turnkey") || lower.includes("custom")) {
      return "Turnkey Industrial Plant Work & Custom Scope";
    }
    return "Industrial Electrical Contracting & Manpower";
  };

  const [formData, setFormData] = useState({
    vertical: "Industrial Electrical Contracting & Manpower",
    name: "",
    phone: "",
    email: "",
    location: "",
    technicalDetails: ""
  });

  const [submitted, setSubmitted] = useState(false);
  const [submittedLead, setSubmittedLead] = useState(null);

  useEffect(() => {
    if (inquiryModalData.isOpen) {
      const initialVertical = mapDivisionToVertical(inquiryModalData.divisionName || "");
      setFormData((prev) => ({
        ...prev,
        vertical: initialVertical
      }));
      setSubmitted(false);
      setSubmittedLead(null);
    }
  }, [inquiryModalData]);

  if (!inquiryModalData.isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      showToast("Please enter your name or company.", "error");
      return;
    }
    if (!formData.phone.trim()) {
      showToast("Please enter your 10-digit mobile number.", "error");
      return;
    }

    const rawName = formData.name.trim();
    let clientName = rawName;
    let companyName = "";
    if (rawName.includes("/") || rawName.includes("-")) {
      const parts = rawName.split(/[/ -]/);
      clientName = parts[0].trim();
      companyName = parts.slice(1).join(" ").trim();
    }

    const payload = {
      name: clientName,
      company: companyName || rawName,
      phone: formData.phone.trim(),
      email: formData.email.trim() || "Not Provided",
      division: formData.vertical,
      scope: formData.technicalDetails.trim() || `Turnkey execution inquiry for ${formData.vertical}`,
      volume: "Standard / Custom Industrial Volume",
      location: formData.location.trim() || "All-India Dispatch",
      timeline: "Immediate / Per Client Schedule",
      message: `OPERATIONS & DISPATCH RFP (Modal Submission)\nVertical: ${formData.vertical}\nName/Firm: ${formData.name}\nPhone: ${formData.phone}\nEmail: ${formData.email || "N/A"}\nDestination: ${formData.location || "Pan-India"}\nDetails: ${formData.technicalDetails}`
    };

    const newInquiry = addInquiry(payload);
    setSubmittedLead(newInquiry || payload);
    setSubmitted(true);
    showToast("Official RFP successfully transmitted! Logged in Central Operations Admin.", "success");
  };

  const handleReset = () => {
    setSubmitted(false);
    setSubmittedLead(null);
    setFormData({
      vertical: mapDivisionToVertical(inquiryModalData.divisionName || ""),
      name: "",
      phone: "",
      email: "",
      location: "",
      technicalDetails: ""
    });
  };

  const getWhatsAppUrl = (data = formData) => {
    const text = `*OPERATIONS & DISPATCH RFP - Erphan Alam Enterprises*\n\n` +
      `*Operating Service Vertical:* ${data.vertical || data.division}\n` +
      `*Name / Firm:* ${data.name}\n` +
      `*Mobile Number:* ${data.phone}\n` +
      (data.email && data.email !== "Not Provided" ? `*Email:* ${data.email}\n` : "") +
      `*Site Destination / City:* ${data.location || "Pan-India"}\n\n` +
      `*Technical Details & Estimated Volume:*\n${data.technicalDetails || data.scope || "Kindly provide official quotation and mobilization timeline."}\n\n` +
      `Requesting immediate technical quotation and mobilization review.`;
    return `https://wa.me/${settings.whatsappNumber}?text=${encodeURIComponent(text)}`;
  };

  return (
    <div className="modal-backdrop" onClick={closeInquiryModal}>
      <div className="modal-dialog-arch arch-inquiry-box" onClick={(e) => e.stopPropagation()}>
        
        {/* Close Button */}
        <button className="modal-close-btn" onClick={closeInquiryModal} aria-label="Close modal">
          <X size={20} />
        </button>

        {!submitted ? (
          <form onSubmit={handleSubmit} className="rfp-clean-form">
            
            <div className="rfp-form-header mb-4">
              <div className="rfp-badge-tag">OPERATIONS &amp; DISPATCH RFP</div>
              <h3 className="rfp-form-title">Request Service Proposal</h3>
              <p className="rfp-form-subtitle">
                Enter technical details below. Your submission is logged live to our operations pipeline.
              </p>
            </div>

            {/* Operating Service Vertical */}
            <div className="arch-form-field mb-4">
              <label className="rfp-field-label">
                Operating Service Vertical <span className="req">*</span>
              </label>
              <select
                className="arch-select-input rfp-select"
                value={formData.vertical}
                onChange={(e) => setFormData({ ...formData, vertical: e.target.value })}
                required
              >
                {serviceVerticals.map((sv) => (
                  <option key={sv.value} value={sv.value}>
                    {sv.label}
                  </option>
                ))}
              </select>
            </div>

            {/* 2-Column Grid: Your Name / Firm & Mobile Number */}
            <div className="input-grid-2 mb-4">
              <div className="arch-form-field">
                <label className="rfp-field-label">
                  Your Name / Firm <span className="req">*</span>
                </label>
                <input
                  type="text"
                  className="arch-text-input rfp-input"
                  placeholder="Full name or company"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>

              <div className="arch-form-field">
                <label className="rfp-field-label">
                  Mobile Number <span className="req">*</span>
                </label>
                <input
                  type="tel"
                  className="arch-text-input rfp-input"
                  placeholder="10-digit phone number"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  required
                />
              </div>
            </div>

            {/* 2-Column Grid: Email Address & Site Destination / City */}
            <div className="input-grid-2 mb-4">
              <div className="arch-form-field">
                <label className="rfp-field-label">
                  Email Address
                </label>
                <input
                  type="email"
                  className="arch-text-input rfp-input"
                  placeholder="name@email.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>

              <div className="arch-form-field">
                <label className="rfp-field-label">
                  Site Destination / City
                </label>
                <input
                  type="text"
                  className="arch-text-input rfp-input"
                  placeholder="e.g. Pune, MH / Hyderabad, TS"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                />
              </div>
            </div>

            {/* Technical Details & Estimated Volume */}
            <div className="arch-form-field mb-4">
              <label className="rfp-field-label">
                Technical Details &amp; Estimated Volume <span className="req">*</span>
              </label>
              <textarea
                className="arch-textarea-input rfp-textarea"
                rows={4}
                placeholder="Specify required quantities, dimensions, drawings availability, delivery schedules..."
                value={formData.technicalDetails}
                onChange={(e) => setFormData({ ...formData, technicalDetails: e.target.value })}
                required
              ></textarea>
            </div>

            {/* Live Admin Sync Notice */}
            <div className="admin-sync-notice mb-4">
              <ShieldCheck size={14} className="text-emerald" />
              <span>Submissions are securely processed and dispatched live to Erphan Alam Enterprises directors.</span>
            </div>

            {/* Actions */}
            <div className="arch-form-actions">
              <button type="submit" className="btn-arch-primary rfp-submit-btn">
                <span>Transmit Official RFP</span>
                <ArrowRight size={16} />
              </button>

              <a
                href={getWhatsAppUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-arch-whatsapp"
                title="Transmit RFP via WhatsApp"
              >
                <MessageCircle size={16} />
                <span>Send on WhatsApp</span>
              </a>
            </div>

          </form>
        ) : (
          /* Success Confirmation Panel */
          <div className="rfp-success-panel text-center">
            <div className="success-icon-wrap mb-3">
              <CheckCircle2 size={48} className="text-emerald" />
            </div>
            <h3 className="success-headline mb-2">RFP Successfully Transmitted</h3>
            <p className="success-subtext mb-4">
              Thank you, <strong>{submittedLead?.name}</strong>. Your proposal request has been logged into our Central Operations &amp; Dispatch Pipeline under Lead ID: <strong>#{submittedLead?.id || "NEW"}</strong>.
            </p>

            <div className="submitted-dossier-card mb-4 text-left">
              <div className="dossier-row">
                <span className="lbl">Lead ID:</span>
                <span className="val text-cyan font-bold">{submittedLead?.id || "Recorded"}</span>
              </div>
              <div className="dossier-row">
                <span className="lbl">Vertical:</span>
                <span className="val text-amber">{submittedLead?.division}</span>
              </div>
              <div className="dossier-row">
                <span className="lbl">Client / Firm:</span>
                <span className="val">{submittedLead?.name} {submittedLead?.company && submittedLead?.company !== submittedLead?.name ? `(${submittedLead?.company})` : ""}</span>
              </div>
              <div className="dossier-row">
                <span className="lbl">Mobile:</span>
                <span className="val">+91 {submittedLead?.phone}</span>
              </div>
              <div className="dossier-row">
                <span className="lbl">Site / City:</span>
                <span className="val">{submittedLead?.location || "India"}</span>
              </div>
              <div className="dossier-row">
                <span className="lbl">Technical Scope:</span>
                <span className="val">{submittedLead?.scope}</span>
              </div>
            </div>

            <div className="success-action-group">
              <a
                href={getWhatsAppUrl(submittedLead)}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-arch-primary w-100 mb-2"
              >
                <MessageCircle size={15} />
                <span>Send Scope to WhatsApp (+91 {settings.whatsappNumber})</span>
              </a>

              <button
                type="button"
                className="btn-arch-secondary w-100 mb-2"
                onClick={handleReset}
              >
                <RotateCcw size={14} />
                <span>Submit Another Proposal</span>
              </button>

              <button
                type="button"
                className="btn-arch-secondary w-100"
                onClick={closeInquiryModal}
              >
                <X size={14} />
                <span>Close Window</span>
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

