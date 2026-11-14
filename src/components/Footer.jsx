import React from "react";
import { useApp } from "../context/AppContext";
import {
  Phone,
  Mail,
  MapPin,
  ShieldCheck,
  Truck,
  ArrowUp,
  Lock,
  ChevronRight,
  Boxes
} from "lucide-react";

export const Footer = () => {
  const { settings, setCurrentView, isAdminLoggedIn } = useApp();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          {/* Brand Info */}
          <div className="footer-brand-col">
            <div className="brand-logo footer-logo">
              <img
                src="/Client logos/User Logo/eap-logo.png"
                alt="Erphan Alam Enterprises Logo"
                className="footer-brand-logo-img"
              />
              <div className="logo-text">
                <span className="logo-title">ERPHAN ALAM</span>
                <span className="logo-subtitle">ENTERPRISES</span>
              </div>
            </div>

            <p className="footer-desc">
              A premier diversified Indian enterprise driving excellence across industrial electrical contracting, certified manpower deployment, structural steel fabrication, integrated poultry and aquaculture, and high-strength machine brick manufacturing.
            </p>

            <div className="footer-badges">
              <span className="f-badge">
                <ShieldCheck size={14} className="inline-icon text-cyan" /> Quality Assured
              </span>
              <span className="f-badge">
                <Truck size={14} className="inline-icon text-emerald" /> All India Supply Available
              </span>
            </div>
          </div>

          {/* Child Businesses */}
          <div className="footer-links-col">
            <h4 className="footer-heading">Child Businesses</h4>
            <ul className="footer-links">
              <li>
                <a href="#elec"><ChevronRight size={14} /> Electrical Contractor & Manpower</a>
              </li>
              <li>
                <a href="#fab"><ChevronRight size={14} /> Heavy Metal Fabrication & PEB</a>
              </li>
              <li>
                <a href="#farm"><ChevronRight size={14} /> Integrated Farming (Poultry & Fish)</a>
              </li>
              <li>
                <a href="#brick"><ChevronRight size={14} /> High-Strength Bricks Manufacturing</a>
              </li>
              <li>
                <a href="#pan-india"><ChevronRight size={14} /> All India Logistics Network</a>
              </li>
            </ul>
          </div>

          {/* Navigation Links */}
          <div className="footer-links-col">
            <h4 className="footer-heading">Quick Links</h4>
            <ul className="footer-links">
              <li>
                <a href="#home"><ChevronRight size={14} /> Home Overview</a>
              </li>
              <li>
                <a href="#about"><ChevronRight size={14} /> About Earphan Alam</a>
              </li>
              <li>
                <a href="#estimator"><ChevronRight size={14} /> Interactive Cost Guide / RFP</a>
              </li>
              <li>
                <a href="#contact"><ChevronRight size={14} /> Contact & Head Office</a>
              </li>
              <li>
                <button
                  className="footer-admin-link-btn"
                  onClick={() => setCurrentView("admin")}
                >
                  <Lock size={12} /> {isAdminLoggedIn ? "Open Admin Dashboard" : "Staff & Admin Login"}
                </button>
              </li>
            </ul>
          </div>

          {/* Direct Contact */}
          <div className="footer-contact-col">
            <h4 className="footer-heading">Direct Contact</h4>
            <div className="footer-contact-item">
              <Phone size={16} className="text-cyan" />
              <div>
                <a href={`tel:${settings.primaryPhone}`}>+91 {settings.primaryPhone}</a><br />
                <a href={`tel:${settings.secondaryPhone}`}>+91 {settings.secondaryPhone}</a>
              </div>
            </div>

            <div className="footer-contact-item">
              <Mail size={16} className="text-cyan" />
              <div>
                <a href={`mailto:${settings.email}`}>{settings.email}</a>
              </div>
            </div>

            <div className="footer-contact-item">
              <MapPin size={16} className="text-cyan" />
              <div>
                <span>All India Supply & Site Execution Available</span>
              </div>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <p>
            &copy; {new Date().getFullYear()} {settings.companyName} (EAP). All Rights Reserved. Engineered for Corporate Excellence.
          </p>
          <div className="footer-bottom-links">
            <button className="back-to-top-btn" onClick={scrollToTop}>
              Back to Top <ArrowUp size={14} />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
