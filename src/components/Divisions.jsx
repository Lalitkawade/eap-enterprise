import React from "react";
import { useApp } from "../context/AppContext";
import {
  Bolt,
  Flame,
  Sprout,
  Boxes,
  CheckCircle2,
  ArrowRight,
  MessageCircle,
  Truck,
  ShieldCheck,
  Check,
  Layers
} from "lucide-react";

export const Divisions = () => {
  const { divisions, settings, openInquiryModal } = useApp();

  const getDivisionIcon = (id, size = 20) => {
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
        return <Layers size={size} />;
    }
  };

  const getCardThemeClass = (id) => {
    switch (id) {
      case "elec":
        return "card-cyan";
      case "fab":
        return "card-amber";
      case "farm":
        return "card-emerald";
      case "brick":
        return "card-terracotta";
      default:
        return "card-cyan";
    }
  };

  const getButtonClass = (id) => {
    switch (id) {
      case "elec":
        return "btn-cyan";
      case "fab":
        return "btn-amber";
      case "farm":
        return "btn-emerald";
      case "brick":
        return "btn-terracotta";
      default:
        return "btn-primary";
    }
  };

  const getOutlineButtonClass = (id) => {
    switch (id) {
      case "elec":
        return "btn-outline-cyan";
      case "fab":
        return "btn-outline-amber";
      case "farm":
        return "btn-outline-emerald";
      case "brick":
        return "btn-outline-terracotta";
      default:
        return "btn-outline-light";
    }
  };

  return (
    <section className="divisions-section" id="divisions">
      <div className="container">
        <div className="section-header text-center">
          <span className="section-badge">
            <Layers size={14} className="inline-icon" /> OUR 4 CORE DIVISIONS
          </span>
          <h2 className="section-title">Comprehensive Industrial & Agricultural Capabilities</h2>
          <p className="section-subtitle">
            Operating under {settings.companyName} (EAP), every division is equipped with dedicated infrastructure, 
            specialized personnel, and pan-India supply capability.
          </p>
        </div>

        {/* Quick Nav Anchors */}
        <div className="division-tabs-bar">
          {divisions.map((div) => (
            <a key={div.id} href={`#${div.id}`} className="div-tab-btn">
              {getDivisionIcon(div.id, 16)} {div.shortName}
            </a>
          ))}
        </div>

        {/* Divisions Cards */}
        <div className="divisions-stack">
          {divisions.map((div, index) => {
            const isReverse = index % 2 !== 0;
            return (
              <div 
                key={div.id} 
                className={`division-card ${getCardThemeClass(div.id)}`} 
                id={div.id}
              >
                <div className={`division-grid ${isReverse ? "reverse-grid" : ""}`}>
                  
                  {/* Image Column */}
                  <div className="division-image-wrapper">
                    <img src={div.image} alt={div.name} className="division-img" />
                    <div className="division-tag-badge">
                      {getDivisionIcon(div.id, 16)} Division {div.number} • {div.category}
                    </div>
                    <div className="img-floating-stat">
                      <ShieldCheck size={20} style={{ color: div.accentColor }} />
                      <div>
                        <strong>{div.statusLabel}</strong>
                        <span>{div.highlightStat}</span>
                      </div>
                    </div>
                  </div>

                  {/* Content Column */}
                  <div className="division-content">
                    <div className="division-eyebrow">
                      <span className="div-number" style={{ color: div.accentColor }}>{div.number}</span>
                      <span className="div-cat">{div.category}</span>
                    </div>

                    <h3 className="division-heading">{div.name}</h3>
                    <p className="division-lead">{div.leadDesc}</p>

                    <div className="service-capabilities-list">
                      {div.keyCapabilities.map((cap, cIdx) => (
                        <div key={cIdx} className="cap-item">
                          <CheckCircle2 size={18} style={{ color: div.accentColor, flexShrink: 0, marginTop: "2px" }} />
                          <div>
                            <strong>{cap.split(":")[0]}:</strong>{" "}
                            <span>{cap.includes(":") ? cap.split(":")[1] : ""}</span>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Technical Specifications Matrix */}
                    <div className="division-spec-box">
                      {div.specs.map((spec, sIdx) => (
                        <div key={sIdx} className="spec-item">
                          <span className="spec-label">{spec.label}</span>
                          <span className="spec-val">{spec.value}</span>
                        </div>
                      ))}
                    </div>

                    {/* Specific Specs Table for Bricks Division */}
                    {div.id === "brick" && (
                      <div className="brick-specs-table-container">
                        <table className="brick-specs-table">
                          <thead>
                            <tr>
                              <th>Parameter</th>
                              <th>EAP First-Class Kiln Bricks</th>
                              <th>Standard Industry Norms</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr>
                              <td><strong>Compressive Strength</strong></td>
                              <td className="text-terracotta font-bold">12.5 – 15.0 N/mm²</td>
                              <td>7.5 – 10.0 N/mm² (IS 1077)</td>
                            </tr>
                            <tr>
                              <td><strong>Water Absorption</strong></td>
                              <td className="text-emerald font-bold">&lt; 12% by weight</td>
                              <td>Up to 20%</td>
                            </tr>
                            <tr>
                              <td><strong>Efflorescence</strong></td>
                              <td className="font-bold">Nil to Very Slight</td>
                              <td>Moderate</td>
                            </tr>
                            <tr>
                              <td><strong>Bulk Packaging</strong></td>
                              <td className="font-bold">Palletized / Strapped FTL</td>
                              <td>Loose Bulk</td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    )}

                    {/* Action Bar */}
                    <div className="division-action-bar">
                      <button
                        className={`btn ${getButtonClass(div.id)}`}
                        onClick={() => openInquiryModal(div.name)}
                      >
                        {getDivisionIcon(div.id, 16)} Inquire {div.shortName}
                      </button>

                      <a
                        href={`https://wa.me/${settings.whatsappNumber}?text=Hello%20Earphan%20Alam%20Enterprises,%20I%20have%20an%20urgent%20requirement%20for%20Division%20${div.number}:%20${encodeURIComponent(div.name)}.`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`btn ${getOutlineButtonClass(div.id)}`}
                      >
                        <MessageCircle size={16} /> Chat on WhatsApp
                      </a>
                    </div>
                  </div>

                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
