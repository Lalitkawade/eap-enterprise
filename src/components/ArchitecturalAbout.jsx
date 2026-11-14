import React from "react";
import { ArrowUpRight } from "lucide-react";

const PILLARS = [
  {
    num: "01",
    href: "#elec",
    title: "Electrical & Certified Workforce",
    summary: "Panel wiring, high-bay LEDs, 33kV substations & 150+ wiremen."
  },
  {
    num: "02",
    href: "#fab",
    title: "Cable Tray & Steel Fabrication",
    summary: "Galvanized trays & bends, PEB factory sheds & crane girders."
  },
  {
    num: "03",
    href: "#brick",
    title: "Kiln Red Bricks (9\"×4\"×3\")",
    summary: "4.2M annual output · 2M yard stock · IS 1077 grade dispatch."
  },
  {
    num: "04",
    href: "#fish",
    title: "Commercial Agro & Aquaculture",
    summary: "6,000 duck eggs/day & 4 freshwater fish species harvested."
  }
];

export const ArchitecturalAbout = () => {
  return (
    <section className="arch-section about-arch-section" id="about">
      <div className="container">
        {/* Section Header */}
        <div className="arch-section-header">
          <div className="arch-eyebrow">
            <span className="eyebrow-line"></span>
            <span className="eyebrow-text">ERPHAN ALAM ENTERPRISES • OPERATIONAL SCOPE</span>
          </div>
          <h2 className="arch-headline">
            Direct Industrial Contracting & Primary Supply
          </h2>
        </div>

        {/* Minimal Split Overview */}
        <div className="arch-manifesto-grid">
          <div className="manifesto-left-col">
            <p className="manifesto-lead">
              One integrated group delivering electrical contracting, heavy fabrication,
              kiln bricks, and commercial agro-aquaculture nationwide—direct from our own
              teams and facilities.
            </p>

            <div className="manifesto-quote-card">
              <p>
                Zero third-party brokerage. Direct contractor accountability, primary
                manufacturer pricing, and rapid all-India dispatch.
              </p>
              <div className="quote-author">
                <strong>OPERATIONAL DIRECTIVE</strong>
                <span>In-House Execution • Ready Stock • All-India Dispatch</span>
              </div>
            </div>
          </div>

          <div className="manifesto-right-col">
            <div className="arch-strengths-stack">
              {PILLARS.map((item) => (
                <a key={item.num} href={item.href} className="arch-strength-card">
                  <span className="card-num">{item.num}</span>
                  <div className="strength-card-body">
                    <h4>{item.title}</h4>
                    <p>{item.summary}</p>
                  </div>
                  <ArrowUpRight size={16} className="strength-card-arrow" aria-hidden="true" />
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Key Metrics Strip */}
        <div className="arch-metrics-strip">
          <div className="arch-metric-item">
            <span className="arch-metric-val">05</span>
            <span className="arch-metric-lbl">CORE VERTICALS</span>
          </div>
          <div className="metric-sep"></div>
          <div className="arch-metric-item">
            <span className="arch-metric-val">2,000,000</span>
            <span className="arch-metric-lbl">BRICKS IN STOCK</span>
          </div>
          <div className="metric-sep"></div>
          <div className="arch-metric-item">
            <span className="arch-metric-val">6,000</span>
            <span className="arch-metric-lbl">DUCK EGGS / DAY</span>
          </div>
          <div className="metric-sep"></div>
          <div className="arch-metric-item">
            <span className="arch-metric-val">150+</span>
            <span className="arch-metric-lbl">CERTIFIED WIREMEN</span>
          </div>
          <div className="metric-sep"></div>
          <div className="arch-metric-item">
            <span className="arch-metric-val">28+</span>
            <span className="arch-metric-lbl">STATES SUPPLIED</span>
          </div>
        </div>
      </div>
    </section>
  );
};
