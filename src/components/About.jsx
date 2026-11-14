import React from "react";
import { useApp } from "../context/AppContext";
import {
  Layers,
  Truck,
  Award,
  CheckCircle,
  BadgeCheck,
  Building2,
  Users2
} from "lucide-react";

export const About = () => {
  const { settings } = useApp();

  return (
    <section className="about-section" id="about">
      <div className="container">
        <div className="section-badge-wrapper">
          <span className="section-badge">
            <Building2 size={14} className="inline-icon" /> ABOUT EARPHAN ALAM ENTERPRISES
          </span>
        </div>

        <div className="about-grid">
          <div className="about-text-col">
            <h2 className="section-title">
              One Unified Conglomerate, <br />
              <span className="gradient-text">Infinite Industrial & Agricultural Solutions</span>
            </h2>

            <p className="lead-text">
              Under the strategic leadership of <strong>{settings.proprietor}</strong>, {settings.companyName} (EAP) 
              has grown into a diversified powerhouse catering to industrial, infrastructure, and agricultural markets across India.
            </p>

            <p className="body-text">
              We operate four specialized business divisions built around engineering precision, rigorous quality control, and dependable pan-India delivery logistics. By unifying electrical engineering, manpower outsourcing, heavy steel fabrication, modern agro-aquaculture, and construction material production under one umbrella, we eliminate supply chain friction and deliver turnkey reliability.
            </p>

            <div className="core-strengths-grid">
              <div className="strength-card">
                <div className="strength-icon text-cyan">
                  <Layers size={22} />
                </div>
                <div className="strength-info">
                  <h4>Single-Window Execution</h4>
                  <p>Coordinate HT/LT electrical works, structural steel, construction bricks, and workforce under one single contract.</p>
                </div>
              </div>

              <div className="strength-card">
                <div className="strength-icon text-amber">
                  <Truck size={22} />
                </div>
                <div className="strength-info">
                  <h4>All-India Logistics Fleet</h4>
                  <p>Established freight network capable of dispatching heavy trailers, oxygenated fish tanks, and brick truckloads anywhere in India.</p>
                </div>
              </div>

              <div className="strength-card">
                <div className="strength-icon text-emerald">
                  <BadgeCheck size={22} />
                </div>
                <div className="strength-info">
                  <h4>Certified Standards & Safety</h4>
                  <p>Full compliance with IS 1077 brick standards, Central Electricity Inspectorate norms, and biosecure agricultural protocols.</p>
                </div>
              </div>

              <div className="strength-card">
                <div className="strength-icon text-terracotta">
                  <Users2 size={22} />
                </div>
                <div className="strength-info">
                  <h4>Direct Producer Advantage</h4>
                  <p>Zero middlemen markups on materials and direct accountability under the leadership of Earphan Alam.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="about-visual-col">
            <div className="about-image-card">
              <img
                src="/assets/images/hero-conglomerate.jpg"
                alt="Earphan Alam Enterprises Operations"
                className="main-about-img"
              />
              <div className="experience-badge">
                <span className="exp-number">
                  <Award size={24} />
                </span>
                <div className="exp-text">
                  <strong>EAP Standard</strong>
                  <span>Integrity & High Output</span>
                </div>
              </div>
              <div className="about-stats-overlay">
                <div className="overlay-stat">
                  <strong>4</strong>
                  <span>Core Divisions</span>
                </div>
                <div className="overlay-divider"></div>
                <div className="overlay-stat">
                  <strong>Pan-India</strong>
                  <span>Logistics Reach</span>
                </div>
                <div className="overlay-divider"></div>
                <div className="overlay-stat">
                  <strong>24/7</strong>
                  <span>Helpline Desk</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
