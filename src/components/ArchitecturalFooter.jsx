import React from "react";
import { useApp } from "../context/AppContext";
import { Phone, Mail, ArrowUp, Lock, ChevronRight } from "lucide-react";

const CURRENT_YEAR = 2026;

export const ArchitecturalFooter = () => {
  const { settings, setCurrentView, isAdminLoggedIn } = useApp();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="arch-footer">
      <div className="container">
        
        <div className="arch-footer-top">
          <div className="footer-brand-monograph">
            <div className="footer-crest-row">
              <div className="footer-services-icon-box">
                <img 
                  src="/Client logos/User Logo/eap-logo.png" 
                  alt="Erphan Alam Enterprises Logo" 
                  className="footer-brand-logo-img"
                />
              </div>
              <div>
                <span className="footer-monograph-title">Erphan Alam Enterprises</span>
                <span className="footer-monograph-sub">PARENT GROUP • MULTI-SECTOR INDUSTRIAL &amp; AGRO OPERATIONS</span>
              </div>
            </div>

            <p className="footer-monograph-desc">
              Direct technical execution and primary producer supply across industrial control panel wiring, 
              high-bay warehouse lighting, galvanized cable tray fabrication, 9"×4"×3" red kiln bricks, 
              freshwater commercial aquaculture, and daily fresh duck egg supply.
            </p>

            <div className="footer-supply-tag">
              <span className="tag-dot"></span>
              <span>ALL-INDIA FREIGHT & LOGISTICS AVAILABLE ACROSS ALL 28 STATES & UTs</span>
            </div>
          </div>

          <div className="footer-nav-col">
            <span className="footer-col-label">SERVICE VERTICALS</span>
            <ul className="footer-link-list">
              <li><a href="#elec"><ChevronRight size={13} /> 01. Electrical & Panel Wiring</a></li>
              <li><a href="#fab"><ChevronRight size={13} /> 02. Cable Tray & Structural Steel</a></li>
              <li><a href="#brick"><ChevronRight size={13} /> 03. Red Kiln Bricks (9"×4"×3")</a></li>
              <li><a href="#fish"><ChevronRight size={13} /> 04. Freshwater Aquaculture</a></li>
              <li><a href="#duck"><ChevronRight size={13} /> 05. Duck Farming & Fresh Eggs</a></li>
              <li><a href="#pan-india"><ChevronRight size={13} /> All-India Freight Logistics</a></li>
            </ul>
          </div>

          <div className="footer-nav-col">
            <span className="footer-col-label">OPERATIONS & DISPATCH</span>
            <ul className="footer-link-list">
              <li>
                <a href={`tel:${settings.primaryPhone}`} className="footer-contact-link">
                  <Phone size={13} className="text-bronze" /> +91 {settings.primaryPhone} (Primary)
                </a>
              </li>
              <li>
                <a href={`tel:${settings.secondaryPhone}`} className="footer-contact-link">
                  <Phone size={13} className="text-bronze" /> +91 {settings.secondaryPhone} (Dispatch)
                </a>
              </li>
              <li>
                <a href={`mailto:${settings.email}`} className="footer-contact-link">
                  <Mail size={13} className="text-bronze" /> {settings.email}
                </a>
              </li>
              <li>
                <button
                  className="footer-admin-btn"
                  onClick={() => setCurrentView("admin")}
                >
                  <Lock size={12} /> {isAdminLoggedIn ? "Open Management Portal" : "Internal Staff Login"}
                </button>
              </li>
            </ul>
          </div>
        </div>

        <div className="arch-footer-bottom">
          <p>
            &copy; {CURRENT_YEAR} Erphan Alam Enterprises. All Rights Reserved. 
            Direct Manufacturer & Contractor Operations across India.
          </p>
          <button className="arch-back-to-top" onClick={scrollToTop}>
            <span>RETURN TO SUMMIT</span>
            <ArrowUp size={14} />
          </button>
        </div>

      </div>
    </footer>
  );
};
