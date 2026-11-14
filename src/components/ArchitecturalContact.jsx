import React from "react";
import { useApp } from "../context/AppContext";
import {
  Phone,
  ArrowRight,
  MessageCircle,
  CheckCircle2,
  ShieldCheck,
  Truck,
  Zap,
  FileText
} from "lucide-react";

export const ArchitecturalContact = () => {
  const { settings, openInquiryModal } = useApp();

  return (
    <section className="arch-section contact-arch-section" id="contact">
      {/* Anchor for backward compatibility with #estimator */}
      <div id="estimator" style={{ position: "relative", top: "-100px", visibility: "hidden" }} />

      <div className="container">
        
        {/* Section Header */}
        <div className="arch-section-header text-center">
          <div className="arch-eyebrow centered">
            <span className="eyebrow-line"></span>
            <span className="eyebrow-text">OPERATIONS &amp; DISPATCH RFP</span>
            <span className="eyebrow-line"></span>
          </div>
          <h2 className="arch-headline">
            Request Service <em>Proposal</em>
          </h2>
          <p className="arch-subheadline max-w-700">
            Submit your industrial technical requirements directly to our central estimating and dispatch desk. 
            All submissions are recorded in the central operations pipeline for immediate review.
          </p>
        </div>

        {/* Master Two-Column Grid */}
        <div className="arch-contact-grid">
          
          {/* Left Column: Direct Operations & Dispatch Info */}
          <div className="arch-concierge-card">
            <div className="concierge-crest-block">
              <span className="concierge-brand-title">Erphan Alam Enterprises</span>
              <span className="concierge-brand-sub">CENTRAL OPERATIONS &amp; DISPATCH DESK</span>
            </div>

            <div className="concierge-channels-list">
              <div className="channel-item">
                <span className="channel-label">PRIMARY SALES &amp; TECHNICAL LINE</span>
                <a href={`tel:${settings.primaryPhone}`} className="channel-value">
                  +91 {settings.primaryPhone}
                </a>
              </div>

              <div className="channel-item">
                <span className="channel-label">SECONDARY OPERATIONS &amp; DISPATCH</span>
                <a href={`tel:${settings.secondaryPhone}`} className="channel-value">
                  +91 {settings.secondaryPhone}
                </a>
              </div>

              <div className="channel-item">
                <span className="channel-label">OFFICIAL TRANSMISSION EMAIL</span>
                <a href={`mailto:${settings.email}`} className="channel-value">
                  {settings.email}
                </a>
              </div>

              <div className="channel-item">
                <span className="channel-label">DISPATCH &amp; CONTRACTING COVERAGE</span>
                <span className="channel-value-text">
                  Manufacturing Yards, Substation Crews, Kiln Sites &amp; Fabrication Units • Serving All 28 States &amp; UTs
                </span>
              </div>
            </div>

            {/* Compliance & Speed Assurances */}
            <div className="concierge-assurances mb-4">
              <div className="assurance-tag">
                <Zap size={14} className="text-cyan" />
                <span>48-72h Pan-India Mobilization</span>
              </div>
              <div className="assurance-tag">
                <ShieldCheck size={14} className="text-emerald" />
                <span>100% Single-Line &amp; CEIG Compliance</span>
              </div>
              <div className="assurance-tag">
                <Truck size={14} className="text-amber" />
                <span>Direct Multi-Axle Fleet Freight</span>
              </div>
            </div>

            {/* Fast Action Buttons */}
            <div className="concierge-call-buttons">
              <a href={`tel:${settings.primaryPhone}`} className="btn-arch-primary w-100 mb-2">
                <Phone size={15} />
                <span>Call Primary: +91 {settings.primaryPhone}</span>
              </a>
              <a
                href={`https://wa.me/${settings.whatsappNumber}?text=Hello,%20I%20have%20an%20urgent%20industrial%20contracting%20inquiry.`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-arch-secondary w-100"
              >
                <MessageCircle size={15} />
                <span>Chat on WhatsApp</span>
              </a>
            </div>
          </div>

          {/* Right Column: Direct RFP Submission Action Card */}
          <div className="arch-inquiry-box rfp-cta-card">
            <div className="rfp-form-header mb-4">
              <div className="rfp-badge-tag">OPERATIONS &amp; DISPATCH RFP</div>
              <h3 className="rfp-form-title">Request Service Proposal</h3>
              <p className="rfp-form-subtitle">
                Enter your technical specifications or project volume. Your submission is logged live to our operations pipeline.
              </p>
            </div>

            {/* Value Pillars */}
            <div className="rfp-cta-benefits mb-4">
              <div className="rfp-benefit-item">
                <CheckCircle2 size={18} className="text-emerald" />
                <div>
                  <strong>Direct In-House Contracting &amp; Supply</strong>
                  <p>Zero third-party broker markups, certified single-line engineering &amp; direct manufacturer rates.</p>
                </div>
              </div>

              <div className="rfp-benefit-item">
                <CheckCircle2 size={18} className="text-emerald" />
                <div>
                  <strong>All 5 Industrial &amp; Agro Verticals</strong>
                  <p>Electrical contracting, cable trays &amp; PEB steel, 9"×4"×3" red bricks, or commercial agro-aquaculture.</p>
                </div>
              </div>

              <div className="rfp-benefit-item">
                <CheckCircle2 size={18} className="text-emerald" />
                <div>
                  <strong>Live Pipeline Sync &amp; Dispatch</strong>
                  <p>Official RFPs logged directly to central operations with rapid 24–48h mobilization across 28 states.</p>
                </div>
              </div>
            </div>

            {/* Direct Action Buttons */}
            <div className="rfp-cta-actions mb-4">
              <button
                type="button"
                className="btn-arch-primary rfp-submit-btn w-100"
                onClick={() => openInquiryModal("Operations & Dispatch RFP")}
              >
                <FileText size={16} />
                <span>Submit Enquiry from Website</span>
                <ArrowRight size={16} />
              </button>

              <a
                href={`https://wa.me/${settings.whatsappNumber}?text=${encodeURIComponent(
                  "*OPERATIONS & DISPATCH RFP - Erphan Alam Enterprises*\n\nRequesting immediate technical quotation and mobilization review."
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-arch-whatsapp w-100"
                title="Send RFP via WhatsApp"
              >
                <MessageCircle size={16} />
                <span>Send on WhatsApp</span>
              </a>
            </div>

            {/* Live Admin Sync Notice */}
            <div className="admin-sync-notice">
              <ShieldCheck size={14} className="text-emerald" />
              <span>Submissions are securely processed and dispatched live to Erphan Alam Enterprises directors.</span>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};

