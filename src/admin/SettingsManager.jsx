import React, { useState } from "react";
import { useApp } from "../context/AppContext";
import {
  Save,
  Phone,
  Megaphone,
  ShieldCheck,
  CreditCard,
  RotateCcw,
  Building
} from "lucide-react";

export const SettingsManager = () => {
  const { settings, updateSettings, resetAllData, adminUser } = useApp();
  const [formData, setFormData] = useState({ ...settings });

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleBankChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      bankDetails: {
        ...(prev.bankDetails || {}),
        [field]: value
      }
    }));
  };

  const handleSave = (e) => {
    e.preventDefault();
    updateSettings(formData);
  };

  return (
    <div className="admin-settings-view">
      <div className="view-header-bar">
        <div>
          <h2>Corporate Identity & Contact Settings</h2>
          <p>Update phone numbers, email, address, announcement notice, and security PIN</p>
        </div>
        <button className="btn btn-primary" onClick={handleSave}>
          <Save size={16} /> Save Settings
        </button>
      </div>

      <form onSubmit={handleSave} className="admin-settings-form">
        <div className="settings-cards-grid">
          {/* Company Identity */}
          <div className="settings-section-card">
            <div className="settings-card-header">
            <Building size={20} className="text-cyan" />
            <h3>Corporate Identity</h3>
          </div>

          <div className="input-grid-2">
            <div className="form-group">
              <label>Full Enterprise Name</label>
              <input
                type="text"
                className="form-input"
                value={formData.companyName}
                onChange={(e) => handleInputChange("companyName", e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label>Abbreviation / Brand Badge</label>
              <input
                type="text"
                className="form-input"
                value={formData.shortName}
                onChange={(e) => handleInputChange("shortName", e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label>Proprietor / Managing Director</label>
              <input
                type="text"
                className="form-input"
                value={formData.proprietor}
                onChange={(e) => handleInputChange("proprietor", e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label>Corporate & Yard Address Description</label>
              <input
                type="text"
                className="form-input"
                value={formData.address}
                onChange={(e) => handleInputChange("address", e.target.value)}
                required
              />
            </div>
          </div>
        </div>

        {/* Official Contact Desk */}
        <div className="settings-section-card">
          <div className="settings-card-header">
            <Phone size={20} className="text-emerald" />
            <h3>Public Contact Numbers & Desk Channels</h3>
          </div>

          <div className="input-grid-2">
            <div className="form-group">
              <label>Primary Phone Number (Click-to-Call)</label>
              <input
                type="text"
                className="form-input"
                value={formData.primaryPhone}
                onChange={(e) => handleInputChange("primaryPhone", e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label>Secondary Helpline Number</label>
              <input
                type="text"
                className="form-input"
                value={formData.secondaryPhone}
                onChange={(e) => handleInputChange("secondaryPhone", e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label>Official Business Email</label>
              <input
                type="email"
                className="form-input"
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label>WhatsApp Helpline (Country Code + Number)</label>
              <input
                type="text"
                className="form-input"
                value={formData.whatsappNumber}
                onChange={(e) => handleInputChange("whatsappNumber", e.target.value)}
                required
              />
            </div>
          </div>
        </div>

        {/* Tax & Banking Credentials (Full Span Card) */}
        <div className="settings-section-card settings-card-full-span">
          <div className="settings-card-header">
            <CreditCard size={20} className="text-cyan" />
            <h3>Tax & Banking Configuration (Invoices & Billing)</h3>
          </div>

          <div className="input-grid-2">
            <div className="form-group">
              <label>GSTIN (Goods & Services Tax ID)</label>
              <input
                type="text"
                className="form-input"
                value={formData.gstin || ""}
                onChange={(e) => handleInputChange("gstin", e.target.value)}
                placeholder="e.g. 10EJDPA3213H1Z5"
              />
            </div>

            <div className="form-group">
              <label>PAN (Permanent Account Number)</label>
              <input
                type="text"
                className="form-input"
                value={formData.pan || ""}
                onChange={(e) => handleInputChange("pan", e.target.value)}
                placeholder="e.g. EJDPA3213H"
              />
            </div>

            <div className="form-group">
              <label>Bank Name</label>
              <input
                type="text"
                className="form-input"
                value={formData.bankDetails?.bankName || ""}
                onChange={(e) => handleBankChange("bankName", e.target.value)}
                placeholder="e.g. HDFC Bank"
              />
            </div>

            <div className="form-group">
              <label>Account Beneficiary Name</label>
              <input
                type="text"
                className="form-input"
                value={formData.bankDetails?.accountName || ""}
                onChange={(e) => handleBankChange("accountName", e.target.value)}
                placeholder="e.g. Erphan Alam Enterprises"
              />
            </div>

            <div className="form-group">
              <label>Bank Account Number</label>
              <input
                type="text"
                className="form-input"
                value={formData.bankDetails?.accountNumber || ""}
                onChange={(e) => handleBankChange("accountNumber", e.target.value)}
                placeholder="Enter bank account number"
              />
            </div>

            <div className="form-group">
              <label>IFSC Code</label>
              <input
                type="text"
                className="form-input"
                value={formData.bankDetails?.ifsc || ""}
                onChange={(e) => handleBankChange("ifsc", e.target.value)}
                placeholder="e.g. HDFC0006994"
              />
            </div>

            <div className="form-group">
              <label>Branch Name & Location</label>
              <input
                type="text"
                className="form-input"
                value={formData.bankDetails?.branch || ""}
                onChange={(e) => handleBankChange("branch", e.target.value)}
                placeholder="e.g. Narkatia Ganj Branch, Bihar"
              />
            </div>
          </div>
        </div>

        {/* Live Announcement Marquee Card */}
        <div className="settings-section-card">
          <div className="settings-card-header">
            <Megaphone size={20} className="text-amber" />
            <h3>Top Marquee / Announcement Banner</h3>
          </div>

          <div className="form-group">
            <label>Header Marquee Text (Displayed across public website top bar)</label>
            <input
              type="text"
              className="form-input"
              value={formData.announcementNotice}
              onChange={(e) => handleInputChange("announcementNotice", e.target.value)}
              required
            />
            <span className="text-muted small mt-1">
              Real-time ticker shown across the desktop top navigation bar.
            </span>
          </div>
        </div>

        {/* Security & Access Card */}
        <div className="settings-section-card">
          <div className="settings-card-header">
            <ShieldCheck size={20} className="text-emerald" />
            <h3>Cloud Authentication & Security</h3>
          </div>

          <div style={{ background: "#fcfaf7", borderRadius: "8px", border: "1px solid #ebd9c8", padding: "16px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "8px" }}>
              <span style={{ background: "#e8f5e9", color: "#2e7d32", padding: "4px 10px", borderRadius: "12px", fontSize: "0.8rem", fontWeight: 600 }}>
                ● Active Cloud Session
              </span>
              <strong style={{ fontSize: "0.95rem", color: "#2d241e" }}>
                {adminUser?.email || "Supabase Authenticated Administrator"}
              </strong>
            </div>
            <p className="text-muted small mb-0" style={{ lineHeight: 1.5 }}>
              Security Notice: Hardcoded access PINs and local bypasses have been disabled for production. Administrator authentication, JWT encryption, and access permissions are securely managed via Supabase Cloud Auth. Passwords and users can be managed in your Supabase Dashboard under <em>Authentication &rarr; Users</em>.
            </p>
          </div>
        </div>
      </div>

        <div className="settings-actions-footer">
          <button type="submit" className="btn btn-primary btn-lg">
            <Save size={18} /> Save & Apply All Settings
          </button>

          <button
            type="button"
            className="btn btn-danger-outline"
            onClick={resetAllData}
          >
            <RotateCcw size={16} /> Reset All Data to Defaults
          </button>
        </div>
      </form>
    </div>
  );
};
