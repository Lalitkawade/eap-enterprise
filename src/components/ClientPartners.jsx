import React from "react";
import { ShieldCheck } from "lucide-react";

// High-resolution official client partner logos directly from public folder
const CLIENT_PARTNERS = [
  {
    id: "lt",
    name: "Larsen & Toubro",
    logoUrl: "/Client logos/Larsen & Toubro Corporate Logo.png"
  },
  {
    id: "tata",
    name: "TATA",
    logoUrl: "/Client logos/TATA Blue Gradient Corporate Logo.png"
  },
  {
    id: "jsw",
    name: "JSW",
    logoUrl: "/Client logos/JSW Motors Blue and Red Logo.png"
  },
  {
    id: "bluestar",
    name: "Blue Star",
    logoUrl: "/Client logos/Blue Star Built on Trust Logo.png"
  },
  {
    id: "vkbs",
    name: "VKBS",
    logoUrl: "/Client logos/VK Building Services Logo.png"
  },
  {
    id: "aquachill",
    name: "Aqua Chill Systems",
    logoUrl: "/Client logos/Aqua Chill Heat Pump Banner.png"
  },
  {
    id: "orbital",
    name: "Orbital Systems",
    logoUrl: "/Client logos/Futuristic Orbital Emblem Logo.png"
  },
  {
    id: "sterling",
    name: "Sterling Electro",
    logoUrl: "/Client logos/Sterling Electro Gold Emblem Logo.png"
  },
  {
    id: "htl",
    name: "HTL Aircon",
    logoUrl: "/Client logos/HTL AIRCON Red Turbine Logo.png"
  },
  {
    id: "micron",
    name: "Micron Electricals",
    logoUrl: "/Client logos/Micron Electricals Logo.png"
  }
];

export const ClientPartners = () => {
  return (
    <section className="client-partners-section" aria-label="Corporate Clients & Partners">
      <div className="container">
        
        {/* Section Header */}
        <div className="client-section-header">
          <div className="client-header-left">
            <span className="client-eyebrow-tag">
              <ShieldCheck size={14} className="text-bronze" />
              <span>KEY CLIENT &amp; CONTRACTING NETWORK</span>
            </span>
            <h3 className="client-grid-title">
              Trusted by India's Premier Engineering, MEP & Industrial Conglomerates
            </h3>
            <p className="client-grid-subtitle">
              Direct contracting, in-house fabrication, and specialized industrial supply executed for leading infrastructure and corporate enterprises nationwide.
            </p>
          </div>
          <div className="client-header-right">
            <span className="client-counter-badge">
              <strong>10+</strong> Major Enterprise Partners
            </span>
          </div>
        </div>

        {/* Architectural 10-Tile Static Grid (2 rows of 5 on desktop) - Pure Logos Only */}
        <div className="client-bento-grid">
          {CLIENT_PARTNERS.map((client) => (
            <div 
              key={client.id} 
              className="client-tile-card"
              title={client.name}
            >
              <div className="client-tile-logo-wrap">
                <img 
                  src={client.logoUrl} 
                  alt={client.name}
                  className="client-tile-logo"
                  loading="lazy" 
                />
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
