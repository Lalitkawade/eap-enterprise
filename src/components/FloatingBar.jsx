import React from "react";
import { useApp } from "../context/AppContext";
import { Phone, MessageCircle, Calculator, Lock } from "lucide-react";

export const FloatingBar = () => {
  const { settings, setCurrentView, isAdminLoggedIn } = useApp();

  return (
    <div className="floating-quick-bar">
      <a href={`tel:${settings.primaryPhone}`} className="quick-bar-btn quick-call">
        <Phone size={18} />
        <span>Call Desk</span>
      </a>

      <a
        href={`https://wa.me/${settings.whatsappNumber}?text=Hello%20Earphan%20Alam%20Enterprises,%20I%20have%20an%20urgent%20business%20inquiry.`}
        target="_blank"
        rel="noopener noreferrer"
        className="quick-bar-btn quick-whatsapp"
      >
        <MessageCircle size={18} />
        <span>WhatsApp</span>
      </a>

      <a href="#estimator" className="quick-bar-btn quick-rfp">
        <Calculator size={18} />
        <span>Estimator</span>
      </a>

      <button
        className="quick-bar-btn quick-admin"
        onClick={() => setCurrentView("admin")}
      >
        <Lock size={18} />
        <span>{isAdminLoggedIn ? "Admin" : "Login"}</span>
      </button>
    </div>
  );
};
