import React, { useState } from "react";
import { useApp } from "../context/AppContext";
import {
  Bolt,
  Flame,
  Sprout,
  Boxes,
  ArrowRight,
  PhoneCall,
  Calculator,
  ShieldCheck,
  Truck,
  CheckCircle2,
  Clock
} from "lucide-react";

export const Hero = () => {
  const { divisions, settings, openInquiryModal } = useApp();
  const [selectedDivId, setSelectedDivId] = useState("elec");

  const activeDiv = divisions.find((d) => d.id === selectedDivId) || divisions[0];

  const getDivisionIcon = (id, size = 18) => {
    switch (id) {
      case "elec":
        return <Bolt size={size} className="text-cyan" />;
      case "fab":
        return <Flame size={size} className="text-amber" />;
      case "farm":
        return <Sprout size={size} className="text-emerald" />;
      case "brick":
        return <Boxes size={size} className="text-terracotta" />;
      default:
        return <Bolt size={size} />;
    }
  };

  return (
    <section className="hero-section" id="home">
      <div 
        className="hero-bg-media"
        style={{ backgroundImage: `url('/assets/images/hero-conglomerate.jpg')` }}
      ></div>
      <div className="hero-bg-overlay"></div>

      <div className="container hero-container">
        <div className="hero-content">
          <div className="hero-eyebrow">
            <span className="glow-dot"></span>
            <span>MULTI-SECTOR INDUSTRIAL & AGRO CONGLOMERATE</span>
          </div>

          <h1 className="hero-title">
            Powering Industry, Infrastructure & Agriculture{" "}
            <span className="gradient-text">Across India</span>
          </h1>

          <p className="hero-desc">
            <strong>{settings.companyName} (EAP)</strong> is an integrated powerhouse delivering
            high-voltage electrical contracting, certified technical manpower supply, heavy metal structural fabrication,
            sustainable modern poultry & fish farming, and high-compression machine bricks nationwide.
          </p>

          <div className="hero-cta-group">
            <a href="#divisions" className="btn btn-primary btn-lg">
              <span>Explore 4 Divisions</span> <ArrowRight size={18} />
            </a>
            <a href="#estimator" className="btn btn-outline-light btn-lg">
              <Calculator size={18} /> <span>Instant Cost Guide & RFP</span>
            </a>
            <a href={`tel:${settings.primaryPhone}`} className="btn btn-glass btn-lg">
              <PhoneCall size={18} /> <span>Call {settings.primaryPhone}</span>
            </a>
          </div>

          {/* Quick Metrics */}
          <div className="hero-stats-row">
            <div className="hero-stat-card">
              <div className="stat-icon text-cyan">
                <Bolt size={20} />
              </div>
              <div className="stat-meta">
                <span className="stat-number">4</span>
                <span className="stat-label">Core Business Verticals</span>
              </div>
            </div>
            <div className="hero-stat-card">
              <div className="stat-icon text-emerald">
                <Truck size={20} />
              </div>
              <div className="stat-meta">
                <span className="stat-number">All India</span>
                <span className="stat-label">Supply & Execution</span>
              </div>
            </div>
            <div className="hero-stat-card">
              <div className="stat-icon text-amber">
                <ShieldCheck size={20} />
              </div>
              <div className="stat-meta">
                <span className="stat-number">100%</span>
                <span className="stat-label">Safety & IS Standards</span>
              </div>
            </div>
            <div className="hero-stat-card">
              <div className="stat-icon text-terracotta">
                <Clock size={20} />
              </div>
              <div className="stat-meta">
                <span className="stat-number">24/7</span>
                <span className="stat-label">Operational Support</span>
              </div>
            </div>
          </div>
        </div>

        {/* Hero Interactive Division Switcher */}
        <div className="hero-feature-panel">
          <div className="panel-header">
            <span className="panel-tag">
              <Boxes size={14} className="inline-icon" /> EAP PORTFOLIO MATRIX
            </span>
            <h3 className="panel-title">Explore Our 4 Core Pillars</h3>
          </div>

          <div className="hero-pills">
            {divisions.map((div) => (
              <button
                key={div.id}
                className={`hero-pill ${selectedDivId === div.id ? "active" : ""}`}
                onClick={() => setSelectedDivId(div.id)}
              >
                {getDivisionIcon(div.id, 16)}
                <span>{div.shortName}</span>
              </button>
            ))}
          </div>

          <div className="hero-division-display">
            <div className="div-preview-image-box">
              <img src={activeDiv.image} alt={activeDiv.name} className="div-preview-img" />
              <div className="div-preview-badge" style={{ borderColor: activeDiv.accentColor }}>
                {activeDiv.statusLabel}
              </div>
            </div>

            <div className="div-preview-info">
              <div className="div-preview-header">
                <span className="div-preview-num" style={{ color: activeDiv.accentColor }}>
                  Division {activeDiv.number}
                </span>
                <span className="div-preview-cat">{activeDiv.category}</span>
              </div>

              <h4 className="div-preview-title">{activeDiv.name}</h4>
              <p className="div-preview-desc">{activeDiv.leadDesc}</p>

              <div className="div-preview-points">
                {activeDiv.keyCapabilities.slice(0, 3).map((point, index) => (
                  <div key={index} className="preview-point-item">
                    <CheckCircle2 size={15} style={{ color: activeDiv.accentColor, flexShrink: 0 }} />
                    <span>{point.split(":")[0]}</span>
                  </div>
                ))}
              </div>

              <div className="div-preview-actions">
                <a
                  href={`#${activeDiv.id}`}
                  className="btn btn-sm btn-outline-light"
                >
                  View Full Details
                </a>
                <button
                  className="btn btn-sm btn-primary"
                  onClick={() => openInquiryModal(activeDiv.name)}
                >
                  Inquire Now <ArrowRight size={14} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
