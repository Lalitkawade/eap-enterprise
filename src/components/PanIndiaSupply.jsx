import React from "react";
import { useApp } from "../context/AppContext";
import {
  Truck,
  MapPin,
  Clock,
  ShieldCheck,
  Snowflake,
  Users,
  Compass,
  ArrowRight
} from "lucide-react";

export const PanIndiaSupply = () => {
  const { openInquiryModal, settings } = useApp();

  return (
    <section className="pan-india-section" id="pan-india">
      <div className="container">
        <div className="pan-india-banner">
          <div className="banner-glow"></div>
          
          <div className="pan-india-content">
            <div className="supply-badge">
              <Compass size={15} className="inline-icon" /> NATIONWIDE COVERAGE
            </div>

            <h2 className="pan-india-title">
              All India Supply Available: <span className="gradient-text">Delivering to Every Corner</span>
            </h2>

            <p className="pan-india-desc">
              Geography is never a limitation for <strong>{settings.companyName} (EAP)</strong>. 
              Our centralized manufacturing hubs, strategic logistics partnerships, and dedicated carrier fleet enable us 
              to dispatch industrial products, construction materials, livestock, and technical crews seamlessly across all 28 Indian States & Union Territories.
            </p>

            <div className="network-features-grid">
              <div className="network-feat-card">
                <div className="feat-icon text-cyan">
                  <Truck size={24} />
                </div>
                <div className="feat-details">
                  <h4>Heavy Freight & Multi-Axle Trailers</h4>
                  <p>Dedicated flatbed trailers and high-tonnage trucks for oversized steel structures, PEB trusses, and bulk brick consignments.</p>
                </div>
              </div>

              <div className="network-feat-card">
                <div className="feat-icon text-emerald">
                  <Snowflake size={24} />
                </div>
                <div className="feat-details">
                  <h4>Live & Temperature-Controlled Transit</h4>
                  <p>Specialized oxygenated tanks for live freshwater fish distribution and ventilated carriers for poultry with zero stress.</p>
                </div>
              </div>

              <div className="network-feat-card">
                <div className="feat-icon text-amber">
                  <Users size={24} />
                </div>
                <div className="feat-details">
                  <h4>Rapid Workforce Mobilization</h4>
                  <p>Deployment of certified electricians, wiremen, and site supervisors to remote industrial corridors within 48 to 72 hours.</p>
                </div>
              </div>

              <div className="network-feat-card">
                <div className="feat-icon text-terracotta">
                  <ShieldCheck size={24} />
                </div>
                <div className="feat-details">
                  <h4>Safe Transit & On-Site Unloading</h4>
                  <p>Palletized packaging for bricks to minimize handling losses, accompanied by continuous transit tracking updates.</p>
                </div>
              </div>
            </div>

            {/* Regional Corridors Showcase */}
            <div className="zones-showcase">
              <div className="zone-pill">
                <MapPin size={14} className="text-cyan" /> <strong>North:</strong> Delhi NCR, UP, Haryana, Punjab, Rajasthan, Uttarakhand
              </div>
              <div className="zone-pill">
                <MapPin size={14} className="text-amber" /> <strong>West:</strong> Maharashtra, Gujarat, Goa, Madhya Pradesh
              </div>
              <div className="zone-pill">
                <MapPin size={14} className="text-emerald" /> <strong>South:</strong> Karnataka, Tamil Nadu, Telangana, Andhra Pradesh, Kerala
              </div>
              <div className="zone-pill">
                <MapPin size={14} className="text-terracotta" /> <strong>East:</strong> West Bengal, Bihar, Odisha, Jharkhand, Assam & NE
              </div>
            </div>

            <div className="pan-india-cta-row">
              <button
                className="btn btn-primary btn-lg"
                onClick={() => openInquiryModal("All India Supply Inquiry")}
              >
                <span>Request Interstate Logistics Quote</span> <ArrowRight size={16} />
              </button>
              <a
                href={`https://wa.me/${settings.whatsappNumber}?text=Hi%20Earphan%20Alam%20Enterprises,%20I%20need%20to%20check%20delivery%20timelines%20and%20rates%20to%20my%20state.`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-whatsapp-header btn-lg"
              >
                Check Shipping Rates for Your City
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
