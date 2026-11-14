import React, { useState } from "react";
import { useApp } from "../context/AppContext";
import {
  Save,
  Plus,
  Trash2
} from "lucide-react";

export const DivisionsCMS = () => {
  const { divisions, updateDivision } = useApp();

  const [activeDivId, setActiveDivId] = useState("elec");
  const currentDiv = divisions.find((d) => d.id === activeDivId) || divisions[0];

  // Local edit form state
  const [formData, setFormData] = useState({ ...currentDiv });

  // Update form data when tab changes
  const handleTabChange = (divId) => {
    setActiveDivId(divId);
    const target = divisions.find((d) => d.id === divId);
    if (target) {
      setFormData({ ...target });
    }
  };

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleCapabilityChange = (index, value) => {
    const updated = [...formData.keyCapabilities];
    updated[index] = value;
    setFormData((prev) => ({ ...prev, keyCapabilities: updated }));
  };

  const handleAddCapability = () => {
    setFormData((prev) => ({
      ...prev,
      keyCapabilities: [...prev.keyCapabilities, "New service capability description"]
    }));
  };

  const handleRemoveCapability = (index) => {
    const updated = formData.keyCapabilities.filter((_, idx) => idx !== index);
    setFormData((prev) => ({ ...prev, keyCapabilities: updated }));
  };

  const handleSpecChange = (index, field, value) => {
    const updated = [...formData.specs];
    updated[index] = { ...updated[index], [field]: value };
    setFormData((prev) => ({ ...prev, specs: updated }));
  };

  const handleSave = (e) => {
    e.preventDefault();
    updateDivision(activeDivId, formData);
  };

  return (
    <div className="admin-cms-view">
      <div className="view-header-bar">
        <div>
          <h2>Divisions Content Management (CMS)</h2>
          <p>Dynamically update descriptions, capabilities, and capacity metrics for each child business</p>
        </div>
        <button className="btn btn-primary" onClick={handleSave}>
          <Save size={15} />
          <span className="text-full">Save Changes to Website</span>
          <span className="text-mobile">Save Changes</span>
        </button>
      </div>

      {/* Division Selector Cards Grid */}
      <div className="cms-division-tabs-grid">
        {divisions.map((div) => (
          <button
            key={div.id}
            type="button"
            className={`cms-tab-card ${activeDivId === div.id ? "active" : ""}`}
            onClick={() => handleTabChange(div.id)}
          >
            <div className="cms-tab-num">{div.number}</div>
            <div className="cms-tab-text">
              <strong>{div.shortName}</strong>
              <span>{div.category}</span>
            </div>
          </button>
        ))}
      </div>

      {/* Editor Form */}
      <form onSubmit={handleSave} className="cms-editor-card">
        <div className="cms-editor-header">
          <div>
            <span className="cms-div-badge">EDITING DIVISION {formData.number}</span>
            <h3>{formData.name}</h3>
          </div>
          <span className="cms-accent-tag" style={{ color: formData.accentColor }}>
            ● Live on Website
          </span>
        </div>

        <div className="input-grid-2 mb-3">
          <div className="form-group">
            <label>Official Division Name</label>
            <input
              type="text"
              className="form-input"
              value={formData.name}
              onChange={(e) => handleInputChange("name", e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>Short Navigation Name</label>
            <input
              type="text"
              className="form-input"
              value={formData.shortName}
              onChange={(e) => handleInputChange("shortName", e.target.value)}
              required
            />
          </div>
        </div>

        <div className="input-grid-2 mb-3">
          <div className="form-group">
            <label>Category Title</label>
            <input
              type="text"
              className="form-input"
              value={formData.category}
              onChange={(e) => handleInputChange("category", e.target.value)}
            />
          </div>

          <div className="form-group">
            <label>Marketing Tagline / Subtitle</label>
            <input
              type="text"
              className="form-input"
              value={formData.tagline}
              onChange={(e) => handleInputChange("tagline", e.target.value)}
            />
          </div>
        </div>

        <div className="input-grid-2 mb-3">
          <div className="form-group">
            <label>Status Badge Text (e.g. High Demand, Ready Stock)</label>
            <input
              type="text"
              className="form-input"
              value={formData.statusLabel}
              onChange={(e) => handleInputChange("statusLabel", e.target.value)}
            />
          </div>

          <div className="form-group">
            <label>Highlight Stat Badge</label>
            <input
              type="text"
              className="form-input"
              value={formData.highlightStat}
              onChange={(e) => handleInputChange("highlightStat", e.target.value)}
            />
          </div>
        </div>

        <div className="form-group mb-4">
          <label>Executive Lead Description</label>
          <textarea
            rows={3}
            className="form-textarea"
            value={formData.leadDesc}
            onChange={(e) => handleInputChange("leadDesc", e.target.value)}
            required
          ></textarea>
        </div>

        {/* Key Offerings / Bullet Points */}
        <div className="cms-section-group mb-4">
          <div className="cms-sub-header">
            <h4>Key Capabilities & Offerings List</h4>
            <button
              type="button"
              className="btn btn-sm btn-outline-cyan"
              onClick={handleAddCapability}
            >
              <Plus size={14} /> Add Capability
            </button>
          </div>

          <div className="capabilities-editor-list">
            {formData.keyCapabilities.map((cap, cIdx) => (
              <div key={cIdx} className="capability-edit-row">
                <span className="cap-index">{cIdx + 1}</span>
                <input
                  type="text"
                  className="form-input"
                  value={cap}
                  onChange={(e) => handleCapabilityChange(cIdx, e.target.value)}
                />
                <button
                  type="button"
                  className="btn-trash"
                  onClick={() => handleRemoveCapability(cIdx)}
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Specifications Matrix */}
        <div className="cms-section-group mb-4">
          <div className="cms-sub-header">
            <h4>Technical Specifications Matrix</h4>
          </div>

          <div className="specs-editor-grid">
            {formData.specs.map((spec, sIdx) => (
              <div key={sIdx} className="spec-edit-card">
                <input
                  type="text"
                  className="form-input spec-label-input mb-1"
                  value={spec.label}
                  placeholder="Parameter Label"
                  onChange={(e) => handleSpecChange(sIdx, "label", e.target.value)}
                />
                <input
                  type="text"
                  className="form-input spec-value-input"
                  value={spec.value}
                  placeholder="Specification Value"
                  onChange={(e) => handleSpecChange(sIdx, "value", e.target.value)}
                />
              </div>
            ))}
          </div>
        </div>

        <div className="cms-form-footer">
          <button type="submit" className="btn btn-primary btn-lg">
            <Save size={18} /> Update Live Division Content
          </button>
        </div>
      </form>
    </div>
  );
};
