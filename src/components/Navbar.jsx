import React, { useState } from "react";
import { useApp } from "../context/AppContext";
import {
  Menu,
  X,
  ChevronDown,
  ArrowRight,
  MessageCircle,
  Bolt,
  Flame,
  Sprout,
  Boxes,
  Lock,
  LayoutDashboard
} from "lucide-react";

export const Navbar = () => {
  const { settings, setCurrentView, isAdminLoggedIn, openInquiryModal } = useApp();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [divisionsDropdownOpen, setDivisionsDropdownOpen] = useState(false);

  const toggleMobileMenu = () => setMobileMenuOpen(!mobileMenuOpen);
  const closeMobileMenu = () => setMobileMenuOpen(false);

  return (
    <>
      <header className="header" id="header">
        <div className="container header-inner">
          <a href="#home" className="brand-logo" onClick={closeMobileMenu}>
            <div className="nav-brand-logo-wrap">
              <img 
                src="/Client logos/User Logo/Modern EAP Golden Orbit Logo.png" 
                alt="Erphan Alam Enterprises Logo" 
                className="nav-brand-logo-img"
              />
            </div>
          </a>

          {/* Desktop Navigation */}
          <nav className="nav-menu">
            <ul className="nav-list">
              <li className="nav-item">
                <a href="#home" className="nav-link active">Home</a>
              </li>
              <li className="nav-item">
                <a href="#about" className="nav-link">About EAP</a>
              </li>
              <li 
                className="nav-item dropdown"
                onMouseEnter={() => setDivisionsDropdownOpen(true)}
                onMouseLeave={() => setDivisionsDropdownOpen(false)}
              >
                <a href="#divisions" className="nav-link dropdown-toggle">
                  Our Businesses <ChevronDown size={14} className="dropdown-caret" />
                </a>
                {divisionsDropdownOpen && (
                  <ul className="dropdown-menu">
                    <li>
                      <a href="#elec" className="dropdown-item">
                        <Bolt size={16} className="text-cyan" /> Electrical & Manpower
                      </a>
                    </li>
                    <li>
                      <a href="#fab" className="dropdown-item">
                        <Flame size={16} className="text-amber" /> Metal Fabrication
                      </a>
                    </li>
                    <li>
                      <a href="#farm" className="dropdown-item">
                        <Sprout size={16} className="text-emerald" /> Integrated Farming
                      </a>
                    </li>
                    <li>
                      <a href="#brick" className="dropdown-item">
                        <Boxes size={16} className="text-terracotta" /> Bricks Manufacturing
                      </a>
                    </li>
                  </ul>
                )}
              </li>
              <li className="nav-item">
                <a href="#pan-india" className="nav-link">All India Supply</a>
              </li>
              <li className="nav-item">
                <a href="#estimator" className="nav-link">Cost Estimator</a>
              </li>
              <li className="nav-item">
                <a href="#contact" className="nav-link">Contact</a>
              </li>
            </ul>
          </nav>

          {/* Action CTAs */}
          <div className="header-actions">
            <button
              className="btn btn-admin-header"
              onClick={() => setCurrentView("admin")}
              title="Access Management & Inquiries Dashboard"
            >
              {isAdminLoggedIn ? (
                <>
                  <LayoutDashboard size={15} /> <span>Admin Panel</span>
                </>
              ) : (
                <>
                  <Lock size={15} /> <span>Admin</span>
                </>
              )}
            </button>

            <a
              href={`https://wa.me/${settings.whatsappNumber}?text=Hello%20Earphan%20Alam%20Enterprises,%20I%20have%20an%20inquiry%20regarding%20your%20services.`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-whatsapp-header"
            >
              <MessageCircle size={16} /> <span>WhatsApp</span>
            </a>

            <button 
              className="btn btn-primary"
              onClick={() => openInquiryModal("General Inquiry")}
            >
              <span>Get Quote</span> <ArrowRight size={15} />
            </button>

            <button
              className="mobile-toggle"
              onClick={toggleMobileMenu}
              aria-label="Toggle navigation"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer Menu */}
      <div className={`mobile-drawer ${mobileMenuOpen ? "open" : ""}`}>
        <div className="drawer-header">
          <div className="logo-symbol small">
            <span>EAP</span>
          </div>
          <button className="drawer-close" onClick={closeMobileMenu}>
            <X size={22} />
          </button>
        </div>
        <ul className="drawer-nav">
          <li>
            <a href="#home" className="drawer-link" onClick={closeMobileMenu}>Home</a>
          </li>
          <li>
            <a href="#about" className="drawer-link" onClick={closeMobileMenu}>About EAP</a>
          </li>
          <li className="drawer-section-title">OUR 4 BUSINESSES</li>
          <li>
            <a href="#elec" className="drawer-link" onClick={closeMobileMenu}>
              <Bolt size={18} className="text-cyan" /> Electrical & Manpower
            </a>
          </li>
          <li>
            <a href="#fab" className="drawer-link" onClick={closeMobileMenu}>
              <Flame size={18} className="text-amber" /> Metal Fabrication
            </a>
          </li>
          <li>
            <a href="#farm" className="drawer-link" onClick={closeMobileMenu}>
              <Sprout size={18} className="text-emerald" /> Integrated Farming
            </a>
          </li>
          <li>
            <a href="#brick" className="drawer-link" onClick={closeMobileMenu}>
              <Boxes size={18} className="text-terracotta" /> Bricks Manufacturing
            </a>
          </li>
          <li className="drawer-section-title">EXPLORE</li>
          <li>
            <a href="#pan-india" className="drawer-link" onClick={closeMobileMenu}>All India Supply</a>
          </li>
          <li>
            <a href="#estimator" className="drawer-link" onClick={closeMobileMenu}>Cost Estimator & RFP</a>
          </li>
          <li>
            <a href="#contact" className="drawer-link" onClick={closeMobileMenu}>Contact & Site Desk</a>
          </li>
          <li>
            <button
              className="drawer-link drawer-admin-btn"
              onClick={() => {
                closeMobileMenu();
                setCurrentView("admin");
              }}
            >
              <Lock size={18} /> {isAdminLoggedIn ? "Admin Dashboard" : "Admin Login Portal"}
            </button>
          </li>
        </ul>
        <div className="drawer-footer">
          <p>
            <strong>Call Desk:</strong><br />
            <a href={`tel:${settings.primaryPhone}`}>+91 {settings.primaryPhone}</a> | <a href={`tel:${settings.secondaryPhone}`}>+91 {settings.secondaryPhone}</a>
          </p>
          <p>
            <strong>Email:</strong><br />
            <a href={`mailto:${settings.email}`}>{settings.email}</a>
          </p>
        </div>
      </div>
      {mobileMenuOpen && <div className="drawer-backdrop" onClick={closeMobileMenu}></div>}
    </>
  );
};
