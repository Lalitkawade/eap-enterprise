import React, { useState } from "react";
import { useApp } from "../context/AppContext";
import {
  Phone,
  Mail,
  MapPin,
  Send,
  MessageCircle,
  Building,
  CheckCircle2,
  Clock,
  Sparkles
} from "lucide-react";

export const Contact = () => {
  const { settings, addInquiry, showToast } = useApp();

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    division: "Electrical Contractor & Manpower",
    location: "",
    message: ""
  });

  const [isSent, setIsSent] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.phone || !formData.message) {
      showToast("Please fill in your name, phone, and requirements", "error");
      return;
    }

    addInquiry({
      name: formData.name,
      phone: formData.phone,
      email: formData.email,
      division: formData.division,
      location: formData.location || "India",
      message: formData.message,
      scope: formData.message.substring(0, 80)
    });

    setIsSent(true);
    setFormData({
      name: "",
      phone: "",
      email: "",
      division: "Electrical Contractor & Manpower",
      location: "",
      message: ""
    });
  };

  const handleDirectWhatsApp = () => {
    const text = `*Inquiry for Earphan Alam Enterprises (EAP)*\n\n` +
      `*Name:* ${formData.name || "Client"}\n` +
      `*Phone:* ${formData.phone || "Provided"}\n` +
      `*Division:* ${formData.division}\n` +
      `*Location:* ${formData.location || "All India"}\n` +
      `*Message:* ${formData.message || "Hello, I would like to inquire regarding your products/services."}`;
    window.open(`https://wa.me/${settings.whatsappNumber}?text=${encodeURIComponent(text)}`, "_blank");
  };

  return (
    <section className="contact-section" id="contact">
      <div className="container">
        <div className="section-header text-center">
          <span className="section-badge">
            <Mail size={14} className="inline-icon" /> GET IN TOUCH
          </span>
          <h2 className="section-title">Connect with Earphan Alam Enterprises</h2>
          <p className="section-subtitle">
            Contact our central office and sales desk for contracts, bulk purchase orders, 
            technical specifications, or pan-India supply dispatch.
          </p>
        </div>

        <div className="contact-grid">
          {/* Corporate Info Column */}
          <div className="contact-info-col">
            <div className="contact-card primary-contact-card">
              <div className="card-top-icon">
                <Building size={28} />
              </div>

              <h3>{settings.companyName} (EAP)</h3>
              <p className="lead-note">Multi-Sector Industrial, Engineering & Agribusiness Conglomerate</p>

              <div className="contact-methods">
                <div className="contact-method-item">
                  <div className="method-icon">
                    <Phone size={18} />
                  </div>
                  <div className="method-details">
                    <span className="label">Primary Phone & WhatsApp</span>
                    <a href={`tel:${settings.primaryPhone}`} className="value">
                      +91 {settings.primaryPhone}
                    </a>
                  </div>
                </div>

                <div className="contact-method-item">
                  <div className="method-icon">
                    <Phone size={18} />
                  </div>
                  <div className="method-details">
                    <span className="label">Secondary Helpline</span>
                    <a href={`tel:${settings.secondaryPhone}`} className="value">
                      +91 {settings.secondaryPhone}
                    </a>
                  </div>
                </div>

                <div className="contact-method-item">
                  <div className="method-icon">
                    <Mail size={18} />
                  </div>
                  <div className="method-details">
                    <span className="label">Official Business Email</span>
                    <a href={`mailto:${settings.email}`} className="value">
                      {settings.email}
                    </a>
                  </div>
                </div>

                <div className="contact-method-item">
                  <div className="method-icon">
                    <MapPin size={18} />
                  </div>
                  <div className="method-details">
                    <span className="label">Headquarters & Supply Network</span>
                    <span className="value text-white">
                      {settings.address}
                    </span>
                  </div>
                </div>
              </div>

              <div className="quick-call-actions">
                <a href={`tel:${settings.primaryPhone}`} className="btn btn-cyan btn-full">
                  <Phone size={16} /> Call +91 {settings.primaryPhone}
                </a>
                <a
                  href={`https://wa.me/${settings.whatsappNumber}?text=Hello%20Earphan%20Alam%20Enterprises,%20I%20have%20an%20inquiry%20regarding%20your%20services.`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-whatsapp-header btn-full"
                >
                  <MessageCircle size={16} /> Instant WhatsApp Chat
                </a>
              </div>
            </div>
          </div>

          {/* Form Column */}
          <div className="contact-form-col">
            <div className="contact-form-card">
              <h3 className="form-title">Send a Direct Inquiry</h3>
              <p className="form-subtitle">Fill in the form below and our team will respond within 24 hours.</p>

              <form onSubmit={handleSubmit}>
                <div className="input-grid-2">
                  <div className="form-group">
                    <label>Your Name / Firm <span className="text-cyan">*</span></label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="e.g. Ramesh Patel / Buildwell Corp"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>Phone Number <span className="text-cyan">*</span></label>
                    <input
                      type="tel"
                      className="form-input"
                      placeholder="e.g. 9876543210"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div className="input-grid-2">
                  <div className="form-group">
                    <label>Email Address</label>
                    <input
                      type="email"
                      className="form-input"
                      placeholder="name@company.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    />
                  </div>

                  <div className="form-group">
                    <label>Division of Interest <span className="text-cyan">*</span></label>
                    <select
                      className="form-select"
                      value={formData.division}
                      onChange={(e) => setFormData({ ...formData, division: e.target.value })}
                      required
                    >
                      <option value="Electrical Contractor & Manpower">1. Electrical Contractor & Manpower Supplier</option>
                      <option value="Metal Fabrication">2. Metal Fabrication & Heavy Structural Works</option>
                      <option value="Integrated Farming (Poultry & Fish)">3. Integrated Farming (Poultry & Fish)</option>
                      <option value="Bricks Manufacturing">4. Bricks Manufacturing</option>
                      <option value="Multiple Divisions / Turnkey">Multiple Divisions / Turnkey Partnership</option>
                    </select>
                  </div>
                </div>

                <div className="form-group">
                  <label>Site / Delivery Location (City & State)</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="e.g. Hyderabad, Telangana / All India"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label>Requirement Details <span className="text-cyan">*</span></label>
                  <textarea
                    rows={4}
                    className="form-textarea"
                    placeholder="Describe your required quantities, electrical capacity, fabrication specifications, or workforce timeline..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    required
                  ></textarea>
                </div>

                <div className="form-actions-row">
                  <button type="submit" className="btn btn-primary btn-lg">
                    <Send size={18} /> <span>Submit Inquiry</span>
                  </button>

                  <button
                    type="button"
                    className="btn btn-whatsapp-header btn-lg"
                    onClick={handleDirectWhatsApp}
                  >
                    <MessageCircle size={18} /> <span>Send via WhatsApp</span>
                  </button>
                </div>
              </form>

              {isSent && (
                <div className="alert-success-banner mt-3">
                  <CheckCircle2 size={20} className="text-emerald" />
                  <div>
                    <strong>Inquiry Received!</strong> Your details have been stored in our customer pipeline. An EAP representative will call you shortly.
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
