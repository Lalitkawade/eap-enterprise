import React from "react";
import { useApp } from "../context/AppContext";
import { Phone, Mail, Truck, ShieldCheck, Lock } from "lucide-react";

export const TopBar = () => {
  const { settings, setCurrentView, isAdminLoggedIn } = useApp();

  return (
    <div className="top-bar">
      <div className="container top-bar-inner">
        <div className="top-bar-left">
          <span className="badge-pill pulse-badge">
            <Truck size={13} className="inline-icon" /> ALL INDIA SUPPLY AVAILABLE
          </span>
          <span className="top-bar-text">{settings.announcementNotice}</span>
        </div>
        <div className="top-bar-right">
          <a href={`tel:${settings.primaryPhone}`} className="top-contact-link">
            <Phone size={13} /> +91 {settings.primaryPhone}
          </a>
          <span className="divider">|</span>
          <a href={`tel:${settings.secondaryPhone}`} className="top-contact-link">
            <Phone size={13} /> +91 {settings.secondaryPhone}
          </a>
          <span className="divider">|</span>
          <a href={`mailto:${settings.email}`} className="top-contact-link">
            <Mail size={13} /> {settings.email}
          </a>
          <span className="divider">|</span>
          <button 
            className="top-admin-link"
            onClick={() => setCurrentView("admin")}
            title="Earphan Alam Enterprises Staff & Admin Portal"
          >
            <Lock size={12} /> {isAdminLoggedIn ? "Admin Dashboard" : "Admin Login"}
          </button>
        </div>
      </div>
    </div>
  );
};
