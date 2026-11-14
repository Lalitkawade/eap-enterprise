import React, { useState, useEffect, useRef } from "react";
import { useApp } from "../context/AppContext";
import {
  ArrowRight,
  Phone,
  Mail,
  MessageCircle,
  ChevronDown,
  ChevronRight,
  Zap,
  Wrench,
  Boxes,
  Fish,
  Egg,
  Menu,
  X,
  Home,
  BookOpen,
  MapPin,
  Send,
  Calculator,
  ShieldCheck,
  Layers
} from "lucide-react";

export const FloatingNav = () => {
  const { settings, setCurrentView, isAdminLoggedIn } = useApp();
  const [divisionsDropdown, setDivisionsDropdown] = useState(false);
  const [isPinned, setIsPinned] = useState(false);
  const [phoneDropdown, setPhoneDropdown] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState("home");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileServicesOpen, setMobileServicesOpen] = useState(false);
  const dropdownRef = useRef(null);
  const dropdownTimeoutRef = useRef(null);

  // Mobile menu body scroll lock
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileMenuOpen]);

  const handleDropdownEnter = () => {
    if (dropdownTimeoutRef.current) {
      clearTimeout(dropdownTimeoutRef.current);
      dropdownTimeoutRef.current = null;
    }
    setDivisionsDropdown(true);
  };

  const handleDropdownLeave = () => {
    // If the user clicked/pinned the menu open, DO NOT close on hover leave!
    if (isPinned) return;

    if (dropdownTimeoutRef.current) {
      clearTimeout(dropdownTimeoutRef.current);
    }
    // Generous 450ms debounce gives comfortable buffer when moving cursor across cards
    dropdownTimeoutRef.current = setTimeout(() => {
      setDivisionsDropdown(false);
    }, 450);
  };

  const toggleDropdownPin = (e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    if (dropdownTimeoutRef.current) {
      clearTimeout(dropdownTimeoutRef.current);
      dropdownTimeoutRef.current = null;
    }
    if (divisionsDropdown && isPinned) {
      setDivisionsDropdown(false);
      setIsPinned(false);
    } else {
      setDivisionsDropdown(true);
      setIsPinned(true);
    }
  };

  const handleCardClick = () => {
    if (dropdownTimeoutRef.current) {
      clearTimeout(dropdownTimeoutRef.current);
      dropdownTimeoutRef.current = null;
    }
    setDivisionsDropdown(false);
    setIsPinned(false);
  };

  const handleNavClick = (hash) => {
    setMobileMenuOpen(false);
    closeDropdowns();
    if (hash) {
      const target = document.querySelector(hash);
      if (target) {
        setTimeout(() => {
          target.scrollIntoView({ behavior: "smooth" });
        }, 120);
      }
    }
  };

  // Clean up timeout on unmount
  useEffect(() => {
    return () => {
      if (dropdownTimeoutRef.current) clearTimeout(dropdownTimeoutRef.current);
    };
  }, []);

  const closeDropdowns = () => {
    if (dropdownTimeoutRef.current) clearTimeout(dropdownTimeoutRef.current);
    setDivisionsDropdown(false);
    setIsPinned(false);
    setPhoneDropdown(false);
  };

  // Scroll listener for sticky state & section tracking
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 30);

      const sections = ["home", "about", "services", "pan-india", "estimator", "contact"];
      const scrollPos = window.scrollY + 200;

      for (const sectionId of sections) {
        const el = document.getElementById(sectionId);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPos >= top && scrollPos < top + height) {
            setActiveSection(sectionId);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close dropdown on outside click or Escape key
  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        if (dropdownTimeoutRef.current) clearTimeout(dropdownTimeoutRef.current);
        setDivisionsDropdown(false);
        setIsPinned(false);
      }
    };
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        if (dropdownTimeoutRef.current) clearTimeout(dropdownTimeoutRef.current);
        setDivisionsDropdown(false);
        setIsPinned(false);
        setMobileMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  return (
    <>
      {/* FLOATING ARCHITECTURAL CAPSULE NAVBAR */}
      <div className={`floating-nav-container ${scrolled ? "nav-scrolled" : ""}`}>
        <header className="arch-pill-navbar">
          
          {/* BRAND GROUP ANCHOR */}
          <a href="#home" className="nav-brand-anchor" onClick={closeDropdowns} aria-label="Erphan Alam Enterprises Home">
            <div className="nav-brand-logo-wrap">
              <img 
                src="/Client logos/User Logo/Modern EAP Golden Orbit Logo.png" 
                alt="Erphan Alam Enterprises Logo" 
                className="nav-brand-logo-img"
              />
              <div className="nav-brand-text-block">
                <span className="nav-brand-title">ERPHAN ALAM</span>
                <span className="nav-brand-subtitle">ENTERPRISES</span>
              </div>
            </div>
          </a>

          {/* EDITORIAL NAVIGATION LINKS (CENTER) */}
          <nav className="nav-center-links">
            <a 
              href="#about" 
              className={`nav-editorial-link ${activeSection === "about" ? "active" : ""}`}
            >
              <span>Manifesto</span>
            </a>

            {/* Services Mega Dropdown */}
            <div
              className={`nav-dropdown-scope ${divisionsDropdown ? "dropdown-open" : ""}`}
              ref={dropdownRef}
              onMouseEnter={handleDropdownEnter}
              onMouseLeave={handleDropdownLeave}
            >
              <button
                type="button"
                className={`nav-editorial-link has-badge ${activeSection === "services" || divisionsDropdown ? "active" : ""}`}
                onClick={toggleDropdownPin}
                aria-expanded={divisionsDropdown}
                aria-haspopup="true"
                title={divisionsDropdown ? "Click to close Services menu" : "Click to pin Services menu open"}
              >
                <span>Services</span>
                <span className="nav-count-badge">5</span>
                <span className="chevron-box">
                  <ChevronDown size={12} className={`dropdown-arrow ${divisionsDropdown ? "rotated" : ""}`} />
                </span>
              </button>

              {/* Mega Dropdown with seamless hover bridge wrapper */}
              {divisionsDropdown && (
                <div
                  className="arch-mega-dropdown-wrapper"
                  onMouseEnter={handleDropdownEnter}
                  onMouseLeave={handleDropdownLeave}
                >
                  <div className="arch-mega-panel">
                    <div className="mega-panel-inner">
                      <div className="mega-panel-top">
                        <div className="mega-panel-heading">
                          <span className="mega-kicker">FIVE DIRECT OPERATIONAL VERTICALS</span>
                          <h4 className="mega-title">Erphan Alam Enterprises Scope of Execution</h4>
                        </div>
                        <a
                          href="#services"
                          className="mega-view-all-link"
                          onClick={handleCardClick}
                        >
                          <span>Explore Full Services Grid</span>
                          <ArrowRight size={13} />
                        </a>
                      </div>

                      <div className="mega-divisions-grid">
                        {/* Vertical 1: Electrical & Manpower */}
                        <a 
                          href="#elec" 
                          className="mega-card" 
                          onClick={handleCardClick}
                        >
                          <div className="mega-card-icon-wrap icon-cyan">
                            <Zap size={18} />
                          </div>
                          <div className="mega-card-body">
                            <div className="mega-card-header">
                              <span className="mega-code">SERVICE 01</span>
                              <span className="mega-subtag">Electrical</span>
                            </div>
                            <strong className="mega-name">Electrical & Staffing</strong>
                            <p className="mega-desc">Panel wiring to single-line diagrams, high-bay lighting & 33kV substations.</p>
                          </div>
                        </a>

                        {/* Vertical 2: Cable Tray & Metal Fabrication */}
                        <a 
                          href="#fab" 
                          className="mega-card" 
                          onClick={handleCardClick}
                        >
                          <div className="mega-card-icon-wrap icon-amber">
                            <Wrench size={18} />
                          </div>
                          <div className="mega-card-body">
                            <div className="mega-card-header">
                              <span className="mega-code">SERVICE 02</span>
                              <span className="mega-subtag">Fabrication</span>
                            </div>
                            <strong className="mega-name">Cable Tray & Steel</strong>
                            <p className="mega-desc">Galvanized 90°/45° cable tray bends, PEB factory sheds & crane run-beams.</p>
                          </div>
                        </a>

                        {/* Vertical 3: Red Kiln Bricks */}
                        <a 
                          href="#brick" 
                          className="mega-card" 
                          onClick={handleCardClick}
                        >
                          <div className="mega-card-icon-wrap icon-terracotta">
                            <Boxes size={18} />
                          </div>
                          <div className="mega-card-body">
                            <div className="mega-card-header">
                              <span className="mega-code">SERVICE 03</span>
                              <span className="mega-subtag">9" × 4" × 3"</span>
                            </div>
                            <strong className="mega-name">Red Kiln Bricks</strong>
                            <p className="mega-desc">4.2M annual capacity, 2,000,000 yard stock & 12.5–15.0 N/mm² strength.</p>
                          </div>
                        </a>

                        {/* Vertical 4: Freshwater Aquaculture */}
                        <a 
                          href="#fish" 
                          className="mega-card" 
                          onClick={handleCardClick}
                        >
                          <div className="mega-card-icon-wrap icon-blue">
                            <Fish size={18} />
                          </div>
                          <div className="mega-card-body">
                            <div className="mega-card-header">
                              <span className="mega-code">SERVICE 04</span>
                              <span className="mega-subtag">Aquaculture</span>
                            </div>
                            <strong className="mega-name">Freshwater Aquaculture</strong>
                            <p className="mega-desc">Catla, Rohu, Big Gated Carp & Ijrayl Catfish with paddlewheel aeration.</p>
                          </div>
                        </a>

                        {/* Vertical 5: Duck Farming & Fresh Eggs */}
                        <a 
                          href="#duck" 
                          className="mega-card" 
                          onClick={handleCardClick}
                        >
                          <div className="mega-card-icon-wrap icon-emerald">
                            <Egg size={18} />
                          </div>
                          <div className="mega-card-body">
                            <div className="mega-card-header">
                              <span className="mega-code">SERVICE 05</span>
                              <span className="mega-subtag">Poultry</span>
                            </div>
                            <strong className="mega-name">Duck Farming & Eggs</strong>
                            <p className="mega-desc">6,000 fresh eggs daily harvest with 12,000 stock buffer in sanitized crates.</p>
                          </div>
                        </a>
                      </div>

                      <div className="mega-panel-bottom">
                        <div className="mega-bottom-stats">
                          <span><strong>100%</strong> Direct Contractor</span>
                          <span className="stat-bullet">•</span>
                          <span><strong>24-48h</strong> Mobilization</span>
                          <span className="stat-bullet">•</span>
                          <span><strong>All-India</strong> Supply</span>
                        </div>
                        <div className="mega-bottom-actions">
                          <a
                            href="#services"
                            className="mega-action-jump-link"
                            onClick={handleCardClick}
                          >
                            <span>Explore Services Section</span>
                            <ArrowRight size={13} />
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <a 
              href="#pan-india" 
              className={`nav-editorial-link ${activeSection === "pan-india" ? "active" : ""}`}
            >
              <span className="supply-indicator-dot" title="All India Supply Active"></span>
              <span>Logistics</span>
            </a>

            <a 
              href="#contact" 
              className={`nav-editorial-link ${activeSection === "contact" || activeSection === "estimator" ? "active" : ""}`}
            >
              <span>RFP & Contact Desk</span>
            </a>
          </nav>

          {/* ACTION CLUSTER (RIGHT ANCHOR) */}
          <div className="nav-right-actions">
            
            {/* Quick Phone Connect Icon with Tooltip / Dropdown */}
            <div 
              className="phone-quick-dropdown-wrapper"
              onMouseEnter={() => setPhoneDropdown(true)}
              onMouseLeave={() => setPhoneDropdown(false)}
            >
              <a 
                href={`tel:${settings.primaryPhone}`} 
                className="pill-quick-call-btn" 
                title={`Call Primary Sales Desk: +91 ${settings.primaryPhone}`}
                aria-label="Direct Phone Helplines"
              >
                <Phone size={15} />
              </a>

              {phoneDropdown && (
                <div className="phone-quick-dropdown">
                  <div className="phone-drop-title">DIRECT HELPLINES & CONTACT</div>
                  <a href={`tel:${settings.primaryPhone}`} className="phone-drop-item">
                    <div className="drop-icon"><Phone size={12} /></div>
                    <div>
                      <strong>+91 {settings.primaryPhone}</strong>
                      <span>Primary Sales & Procurement</span>
                    </div>
                  </a>
                  <a href={`tel:${settings.secondaryPhone}`} className="phone-drop-item">
                    <div className="drop-icon"><Phone size={12} /></div>
                    <div>
                      <strong>+91 {settings.secondaryPhone}</strong>
                      <span>Operations & Dispatch Desk</span>
                    </div>
                  </a>
                  <a href={`mailto:${settings.email}`} className="phone-drop-item">
                    <div className="drop-icon"><Mail size={12} /></div>
                    <div>
                      <strong>{settings.email}</strong>
                      <span>Official Transmission Desk</span>
                    </div>
                  </a>
                </div>
              )}
            </div>

            {/* WhatsApp Quick Trigger Icon */}
            <a
              href={`https://wa.me/${settings.whatsappNumber}?text=Hello,%20I%20would%20like%20to%20discuss%20a%20business%20procurement%20requirement.`}
              target="_blank"
              rel="noopener noreferrer"
              className="pill-whatsapp-btn"
              title="Chat directly on WhatsApp"
              aria-label="Chat on WhatsApp"
            >
              <MessageCircle size={16} />
            </a>

            {/* Mobile Hamburger Menu Toggle Button (Three Lines) */}
            <button
              type="button"
              className={`mobile-nav-hamburger-btn ${mobileMenuOpen ? "active" : ""}`}
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label={mobileMenuOpen ? "Close navigation menu" : "Open navigation menu"}
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? <X size={19} /> : <Menu size={19} />}
            </button>
          </div>

        </header>
      </div>

      {/* MOBILE NAVIGATION DRAWER & BACKDROP */}
      {mobileMenuOpen && (
        <>
          <div
            className="mobile-nav-backdrop"
            onClick={() => setMobileMenuOpen(false)}
            aria-hidden="true"
          />

          <aside
            className="mobile-nav-drawer is-open"
            aria-label="Mobile Navigation Menu"
          >
            <div className="mobile-drawer-header">
              <div className="mobile-drawer-brand">
                <img
                  src="/Client logos/User Logo/Modern EAP Golden Orbit Logo.png"
                  alt="Erphan Alam Enterprises"
                  className="mobile-drawer-logo"
                />
                <div className="mobile-drawer-brand-text">
                  <span className="mobile-drawer-title">ERPHAN ALAM</span>
                  <span className="mobile-drawer-sub">ENTERPRISES</span>
                </div>
              </div>
              <button
                type="button"
                className="mobile-drawer-close-btn"
                onClick={() => setMobileMenuOpen(false)}
                aria-label="Close menu"
              >
                <X size={18} />
              </button>
            </div>

            <div className="mobile-drawer-status-badge">
              <span className="mobile-drawer-pulse-dot"></span>
              <span>Operations Active • All-India Grid</span>
            </div>

            <nav className="mobile-drawer-nav">
              <button
                type="button"
                className={`mobile-drawer-link ${activeSection === "home" ? "active" : ""}`}
                onClick={() => handleNavClick("#home")}
              >
                <span className="drawer-link-icon"><Home size={17} /></span>
                <span className="drawer-link-text">Home Overview</span>
                <ChevronRight size={14} className="drawer-link-arrow" />
              </button>

              <button
                type="button"
                className={`mobile-drawer-link ${activeSection === "about" ? "active" : ""}`}
                onClick={() => handleNavClick("#about")}
              >
                <span className="drawer-link-icon"><BookOpen size={17} /></span>
                <span className="drawer-link-text">Corporate Manifesto</span>
                <ChevronRight size={14} className="drawer-link-arrow" />
              </button>

              {/* Collapsible Direct Services Section */}
              <div className="mobile-drawer-accordion">
                <button
                  type="button"
                  className={`mobile-drawer-link has-accordion ${activeSection === "services" ? "active" : ""}`}
                  onClick={() => setMobileServicesOpen(!mobileServicesOpen)}
                >
                  <span className="drawer-link-icon"><Layers size={17} /></span>
                  <span className="drawer-link-text">Direct Services</span>
                  <span className="mobile-services-badge">5 Verticals</span>
                  <ChevronDown
                    size={15}
                    className={`drawer-accordion-arrow ${mobileServicesOpen ? "rotated" : ""}`}
                  />
                </button>

                {mobileServicesOpen && (
                  <div className="mobile-accordion-sublinks">
                    <button
                      type="button"
                      className="mobile-sublink"
                      onClick={() => handleNavClick("#elec")}
                    >
                      <span className="sublink-num">01</span>
                      <div className="sublink-content">
                        <strong>Electrical & Staffing</strong>
                        <span>Substations, panels & technicians</span>
                      </div>
                    </button>

                    <button
                      type="button"
                      className="mobile-sublink"
                      onClick={() => handleNavClick("#fab")}
                    >
                      <span className="sublink-num">02</span>
                      <div className="sublink-content">
                        <strong>Cable Tray & Steel</strong>
                        <span>Galvanized trays & PEB factory sheds</span>
                      </div>
                    </button>

                    <button
                      type="button"
                      className="mobile-sublink"
                      onClick={() => handleNavClick("#brick")}
                    >
                      <span className="sublink-num">03</span>
                      <div className="sublink-content">
                        <strong>Red Kiln Bricks</strong>
                        <span>2,000,000 yard stock & 12.5–15 N/mm²</span>
                      </div>
                    </button>

                    <button
                      type="button"
                      className="mobile-sublink"
                      onClick={() => handleNavClick("#fish")}
                    >
                      <span className="sublink-num">04</span>
                      <div className="sublink-content">
                        <strong>Freshwater Aquaculture</strong>
                        <span>4 species & paddlewheel aerated ponds</span>
                      </div>
                    </button>

                    <button
                      type="button"
                      className="mobile-sublink"
                      onClick={() => handleNavClick("#duck")}
                    >
                      <span className="sublink-num">05</span>
                      <div className="sublink-content">
                        <strong>Duck Farming & Eggs</strong>
                        <span>6,000 daily harvest & buffer stock</span>
                      </div>
                    </button>
                  </div>
                )}
              </div>

              <button
                type="button"
                className={`mobile-drawer-link ${activeSection === "pan-india" ? "active" : ""}`}
                onClick={() => handleNavClick("#pan-india")}
              >
                <span className="drawer-link-icon"><MapPin size={17} /></span>
                <span className="drawer-link-text">Pan-India Logistics Grid</span>
                <ChevronRight size={14} className="drawer-link-arrow" />
              </button>

              <button
                type="button"
                className={`mobile-drawer-link ${activeSection === "estimator" ? "active" : ""}`}
                onClick={() => handleNavClick("#estimator")}
              >
                <span className="drawer-link-icon"><Calculator size={17} /></span>
                <span className="drawer-link-text">Project Cost Estimator</span>
                <ChevronRight size={14} className="drawer-link-arrow" />
              </button>

              <button
                type="button"
                className={`mobile-drawer-link ${activeSection === "contact" ? "active" : ""}`}
                onClick={() => handleNavClick("#contact")}
              >
                <span className="drawer-link-icon"><Send size={17} /></span>
                <span className="drawer-link-text">RFP & Procurement Desk</span>
                <ChevronRight size={14} className="drawer-link-arrow" />
              </button>
            </nav>

            {/* Quick Phone / WhatsApp Direct Action Pills */}
            <div className="mobile-drawer-footer">
              <div className="mobile-quick-helplines">
                <span className="quick-helpline-kicker">DIRECT PROCUREMENT HELPLINES</span>
                <div className="quick-helpline-grid">
                  <a href={`tel:${settings.primaryPhone}`} className="mobile-helpline-btn">
                    <Phone size={14} />
                    <span>+91 {settings.primaryPhone}</span>
                  </a>
                  <a
                    href={`https://wa.me/${settings.whatsappNumber}?text=Hello,%20I%20would%20like%20to%20discuss%20a%20business%20procurement%20requirement.`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mobile-helpline-btn whatsapp"
                  >
                    <MessageCircle size={14} />
                    <span>WhatsApp Desk</span>
                  </a>
                </div>
              </div>

              <button
                type="button"
                className="mobile-drawer-admin-btn"
                onClick={() => {
                  setMobileMenuOpen(false);
                  setCurrentView("admin");
                }}
              >
                <ShieldCheck size={16} />
                <span>{isAdminLoggedIn ? "Open Executive Management Portal" : "Admin Portal Sign-In"}</span>
              </button>
            </div>
          </aside>
        </>
      )}
    </>
  );
};
