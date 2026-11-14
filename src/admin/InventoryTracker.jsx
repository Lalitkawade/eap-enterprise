import React, { useState } from "react";
import { useApp } from "../context/AppContext";
import {
  Boxes,
  Users,
  Flame,
  Sprout,
  Save
} from "lucide-react";

export const InventoryTracker = () => {
  const { inventory, updateInventoryField, showToast } = useApp();

  const [localInv, setLocalInv] = useState({ ...inventory });

  const handleFieldChange = (section, field, value) => {
    setLocalInv((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  };

  const saveAll = () => {
    Object.keys(localInv).forEach((sec) => {
      Object.keys(localInv[sec]).forEach((fld) => {
        updateInventoryField(sec, fld, localInv[sec][fld]);
      });
    });
    showToast("Operational metrics & inventory updated successfully!");
  };

  return (
    <div className="admin-inventory-view">
      <div className="view-header-bar">
        <div>
          <h2>Operational Capacity & Inventory Tracker</h2>
          <p>Real-time manufacturing yards, manpower reserves, and harvest metrics</p>
        </div>
        <button className="btn btn-primary" onClick={saveAll}>
          <Save size={15} />
          <span className="text-full">Save All Operational Data</span>
          <span className="text-mobile">Save Data</span>
        </button>
      </div>

      <div className="inventory-cards-grid">
        {/* 1. BRICKS MANUFACTURING */}
        <div className="inventory-card card-terracotta-border">
          <div className="inv-card-header">
            <div className="inv-header-icon text-terracotta">
              <Boxes size={22} />
            </div>
            <div>
              <h3>Division 4: Bricks Manufacturing</h3>
              <span>Automated Kiln Units & Stockyard</span>
            </div>
          </div>

          <div className="inv-fields-stack">
            <div className="form-group">
              <label>Current Ready Yard Stock (Bricks)</label>
              <input
                type="number"
                className="form-input"
                value={localInv.bricks.yardStock}
                onChange={(e) => handleFieldChange("bricks", "yardStock", parseInt(e.target.value) || 0)}
              />
            </div>

            <div className="form-group">
              <label>Daily Kiln Production Rate (Bricks/Day)</label>
              <input
                type="number"
                className="form-input"
                value={localInv.bricks.dailyProduction}
                onChange={(e) => handleFieldChange("bricks", "dailyProduction", parseInt(e.target.value) || 0)}
              />
            </div>

            <div className="form-group">
              <label>Kiln Operational Status</label>
              <select
                className="form-select"
                value={localInv.bricks.kilnStatus}
                onChange={(e) => handleFieldChange("bricks", "kilnStatus", e.target.value)}
              >
                <option value="Fully Operational">Fully Operational (100% Output)</option>
                <option value="High Surge Production">High Surge Production</option>
                <option value="Scheduled Maintenance">Scheduled Maintenance</option>
              </select>
            </div>

            <div className="form-group">
              <label>Min Order Quantity (Pan-India)</label>
              <input
                type="text"
                className="form-input"
                value={localInv.bricks.minOrderPanIndia}
                onChange={(e) => handleFieldChange("bricks", "minOrderPanIndia", e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* 2. MANPOWER & ELECTRICAL */}
        <div className="inventory-card card-cyan-border">
          <div className="inv-card-header">
            <div className="inv-header-icon text-cyan">
              <Users size={22} />
            </div>
            <div>
              <h3>Division 1: Electrical & Manpower</h3>
              <span>Technical Workforce Reserves</span>
            </div>
          </div>

          <div className="inv-fields-stack">
            <div className="form-group">
              <label>Total Deployed Personnel</label>
              <input
                type="number"
                className="form-input"
                value={localInv.manpower.totalDeployed}
                onChange={(e) => handleFieldChange("manpower", "totalDeployed", parseInt(e.target.value) || 0)}
              />
            </div>

            <div className="form-group">
              <label>Immediate Bench Available (Staff)</label>
              <input
                type="number"
                className="form-input"
                value={localInv.manpower.benchAvailable}
                onChange={(e) => handleFieldChange("manpower", "benchAvailable", parseInt(e.target.value) || 0)}
              />
            </div>

            <div className="form-group">
              <label>Active Client Project Sites</label>
              <input
                type="number"
                className="form-input"
                value={localInv.manpower.activeSites}
                onChange={(e) => handleFieldChange("manpower", "activeSites", parseInt(e.target.value) || 0)}
              />
            </div>

            <div className="inv-bench-note">
              <span>Ready for Immediate Deputation within 48h</span>
            </div>
          </div>
        </div>

        {/* 3. HEAVY METAL FABRICATION */}
        <div className="inventory-card card-amber-border">
          <div className="inv-card-header">
            <div className="inv-header-icon text-amber">
              <Flame size={22} />
            </div>
            <div>
              <h3>Division 2: Metal Fabrication</h3>
              <span>Heavy Workshop & PEB Fabrication</span>
            </div>
          </div>

          <div className="inv-fields-stack">
            <div className="form-group">
              <label>Monthly Fabrication Capacity (Metric Tons)</label>
              <input
                type="number"
                className="form-input"
                value={localInv.fabrication.monthlyCapacityTons}
                onChange={(e) => handleFieldChange("fabrication", "monthlyCapacityTons", parseInt(e.target.value) || 0)}
              />
            </div>

            <div className="form-group">
              <label>Active Heavy Fabrication Bays</label>
              <input
                type="number"
                className="form-input"
                value={localInv.fabrication.activeBayCount}
                onChange={(e) => handleFieldChange("fabrication", "activeBayCount", parseInt(e.target.value) || 0)}
              />
            </div>

            <div className="form-group">
              <label>Current Running Structural Projects</label>
              <input
                type="number"
                className="form-input"
                value={localInv.fabrication.currentRunningProjects}
                onChange={(e) => handleFieldChange("fabrication", "currentRunningProjects", parseInt(e.target.value) || 0)}
              />
            </div>

            <div className="form-group">
              <label>Overhead Crane Handling</label>
              <input
                type="text"
                className="form-input"
                value={localInv.fabrication.craneCapacityTons}
                onChange={(e) => handleFieldChange("fabrication", "craneCapacityTons", e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* 4. INTEGRATED FARMING */}
        <div className="inventory-card card-emerald-border">
          <div className="inv-card-header">
            <div className="inv-header-icon text-emerald">
              <Sprout size={22} />
            </div>
            <div>
              <h3>Division 3: Integrated Farming</h3>
              <span>Poultry Houses & Aquaculture Ponds</span>
            </div>
          </div>

          <div className="inv-fields-stack">
            <div className="form-group">
              <label>Current Poultry Flock (Broilers & Layers)</label>
              <input
                type="number"
                className="form-input"
                value={localInv.farming.poultryBirdsCurrent}
                onChange={(e) => handleFieldChange("farming", "poultryBirdsCurrent", parseInt(e.target.value) || 0)}
              />
            </div>

            <div className="form-group">
              <label>Next Wholesale Harvest Batch Date</label>
              <input
                type="text"
                className="form-input"
                value={localInv.farming.poultryBatchReadyDate}
                onChange={(e) => handleFieldChange("farming", "poultryBatchReadyDate", e.target.value)}
              />
            </div>

            <div className="form-group">
              <label>Active Aerated Fish Ponds</label>
              <input
                type="number"
                className="form-input"
                value={localInv.farming.activeFishPonds}
                onChange={(e) => handleFieldChange("farming", "activeFishPonds", parseInt(e.target.value) || 0)}
              />
            </div>

            <div className="form-group">
              <label>Standing Biomass Ready for Market (Tons)</label>
              <input
                type="number"
                className="form-input"
                value={localInv.farming.standingFishBiomassTons}
                onChange={(e) => handleFieldChange("farming", "standingFishBiomassTons", parseInt(e.target.value) || 0)}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
