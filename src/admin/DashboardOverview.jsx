import React from "react";
import { useApp } from "../context/AppContext";
import {
  Users,
  Inbox,
  Boxes,
  ArrowRight,
  TrendingUp,
  Download,
  AlertCircle,
  Phone,
  MessageCircle,
  FileText
} from "lucide-react";

export const DashboardOverview = ({ setActiveTab }) => {
  const { inquiries, divisions, inventory, settings, invoices, attendanceRecords, updateInquiryStatus } = useApp();

  const totalInquiries = inquiries.length;
  const newInquiries = inquiries.filter((inq) => inq.status === "New").length;

  const exportCSV = () => {
    const headers = ["ID", "Name", "Company", "Phone", "Email", "Division", "Scope", "Location", "Timeline", "Status", "Date"];
    const rows = inquiries.map((inq) => [
      inq.id,
      `"${inq.name}"`,
      `"${inq.company}"`,
      inq.phone,
      inq.email,
      `"${inq.division}"`,
      `"${inq.scope.replace(/"/g, '""')}"`,
      `"${inq.location}"`,
      `"${inq.timeline}"`,
      inq.status,
      inq.date
    ]);

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `EAP_Inquiries_Export_${new Date().toISOString().split("T")[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="admin-dashboard-view">
      {/* Top Banner */}
      <div className="dashboard-welcome-card compact-welcome">
        <div>
          <h2>Welcome, {settings.proprietor}</h2>
          <p>
            {settings.companyName} Executive Operations & Lead Management System. 
            All India supply channels, invoices, and manpower deployments are active.
          </p>
        </div>
        <div className="welcome-live-badge">
          <span className="live-status-dot"></span>
          <span>Operations Active • All India Grid</span>
        </div>
      </div>

      {/* Operational Shortcut Action Grid (Standard 4-Column Grid on Desktop, 2x2 Grid on Mobile) */}
      <div className="dashboard-shortcuts-grid">
        <button
          className="shortcut-card"
          onClick={() => setActiveTab("quotations")}
          title="Manage Quotations & Tax Invoices"
        >
          <div className="shortcut-card-header">
            <div className="shortcut-icon-box bg-blue-subtle text-cyan">
              <FileText size={18} />
            </div>
            <span className="shortcut-badge">{(invoices || []).length}</span>
          </div>
          <div className="shortcut-info">
            <span className="shortcut-title">
              <span className="text-full">Quotations & Invoices</span>
              <span className="text-mobile">Invoices & Quotes</span>
            </span>
            <span className="shortcut-subtitle">Billing, taxes & quotations</span>
          </div>
          <ArrowRight size={13} className="shortcut-arrow" />
        </button>

        <button
          className="shortcut-card"
          onClick={() => setActiveTab("attendance")}
          title="Open Manpower Attendance & Muster Rolls"
        >
          <div className="shortcut-card-header">
            <div className="shortcut-icon-box bg-emerald-subtle text-emerald">
              <Users size={18} />
            </div>
            <span className="shortcut-badge">{(attendanceRecords || []).length}</span>
          </div>
          <div className="shortcut-info">
            <span className="shortcut-title">
              <span className="text-full">Manpower Attendance</span>
              <span className="text-mobile">Site Attendance</span>
            </span>
            <span className="shortcut-subtitle">Muster rolls & site logs</span>
          </div>
          <ArrowRight size={13} className="shortcut-arrow" />
        </button>

        <button
          className="shortcut-card"
          onClick={() => setActiveTab("inquiries")}
          title="Review Client Inquiries & Leads"
        >
          <div className="shortcut-card-header">
            <div className="shortcut-icon-box bg-amber-subtle text-amber">
              <Inbox size={18} />
            </div>
            <span className="shortcut-badge badge-alert">{newInquiries > 0 ? `${newInquiries} New` : totalInquiries}</span>
          </div>
          <div className="shortcut-info">
            <span className="shortcut-title">
              <span className="text-full">Client Leads & RFPs</span>
              <span className="text-mobile">Client Leads</span>
            </span>
            <span className="shortcut-subtitle">Procurement inquiries</span>
          </div>
          <ArrowRight size={13} className="shortcut-arrow" />
        </button>

        <button
          className="shortcut-card"
          onClick={exportCSV}
          title="Export All Leads as CSV"
        >
          <div className="shortcut-card-header">
            <div className="shortcut-icon-box bg-terracotta-soft text-terracotta">
              <Download size={18} />
            </div>
            <span className="shortcut-badge">.CSV</span>
          </div>
          <div className="shortcut-info">
            <span className="shortcut-title">
              <span className="text-full">Export Leads Data</span>
              <span className="text-mobile">Export Leads</span>
            </span>
            <span className="shortcut-subtitle">Download master sheet</span>
          </div>
          <ArrowRight size={13} className="shortcut-arrow" />
        </button>
      </div>

      {/* KPI Cards */}
      <div className="admin-kpi-grid">
        <div className="admin-kpi-card">
          <div className="kpi-icon-box bg-cyan-soft text-cyan">
            <Inbox size={24} />
          </div>
          <div className="kpi-data">
            <span className="kpi-title">Total RFPs & Leads</span>
            <span className="kpi-value">{totalInquiries}</span>
            <span className="kpi-trend text-emerald">
              <TrendingUp size={13} className="inline-icon" /> +4 this week
            </span>
          </div>
        </div>

        <div className="admin-kpi-card">
          <div className="kpi-icon-box bg-amber-soft text-amber">
            <AlertCircle size={24} />
          </div>
          <div className="kpi-data">
            <span className="kpi-title">New Inquiries to Call</span>
            <span className="kpi-value">{newInquiries}</span>
            <span className="kpi-subtext text-warning">Requires Response</span>
          </div>
        </div>

        <div className="admin-kpi-card">
          <div className="kpi-icon-box bg-terracotta-soft text-terracotta">
            <Boxes size={24} />
          </div>
          <div className="kpi-data">
            <span className="kpi-title">Bricks Ready in Yard</span>
            <span className="kpi-value">{(inventory.bricks.yardStock).toLocaleString("en-IN")}</span>
            <span className="kpi-subtext">Continuous Kiln Firing</span>
          </div>
        </div>

        <div className="admin-kpi-card">
          <div className="kpi-icon-box bg-emerald-soft text-emerald">
            <Users size={24} />
          </div>
          <div className="kpi-data">
            <span className="kpi-title">Active Manpower Pool</span>
            <span className="kpi-value">{inventory.manpower.totalDeployed + inventory.manpower.benchAvailable}</span>
            <span className="kpi-subtext">{inventory.manpower.totalDeployed} Deployed • {inventory.manpower.benchAvailable} Bench</span>
          </div>
        </div>
      </div>

      {/* Two Column Layout: Recent Inquiries + Operations Status */}
      <div className="admin-dashboard-columns">
        {/* Left Column: Recent Leads */}
        <div className="admin-content-box">
          <div className="box-header">
            <div>
              <h3>Recent Inquiries & RFPs</h3>
              <p>Latest customer requests received from the website</p>
            </div>
            <button
              className="btn btn-sm btn-outline-light"
              onClick={() => setActiveTab("inquiries")}
            >
              Manage All <ArrowRight size={14} />
            </button>
          </div>

          <div className="recent-leads-list">
            {inquiries.length === 0 ? (
              <div className="text-center py-4 text-muted empty-leads-box">
                <Inbox size={32} className="mx-auto mb-2 opacity-40 text-amber" />
                <p className="mb-1 font-semibold text-dark">No inquiries or leads yet</p>
                <p className="small text-muted mb-0">Client RFPs and inquiries submitted through the website will appear here in real time.</p>
              </div>
            ) : (
              inquiries.slice(0, 4).map((inq) => (
              <div key={inq.id} className="lead-item-card">
                <div className="lead-left">
                  <div className="lead-header-row">
                    <span className="lead-id">{inq.id}</span>
                    <span className={`status-pill status-${inq.status.toLowerCase().replace(/\s+/g, "-")}`}>
                      {inq.status}
                    </span>
                    <span className="lead-date">{inq.date}</span>
                  </div>
                  <h4 className="lead-client-name">
                    {inq.name} {inq.company && inq.company !== "Individual" ? `(${inq.company})` : ""}
                  </h4>
                  <p className="lead-scope-text">
                    <strong>{inq.division}:</strong> {inq.scope}
                  </p>
                  <span className="lead-loc">{inq.location} • {inq.timeline}</span>
                </div>

                <div className="lead-quick-actions">
                  <a
                    href={`tel:${inq.phone}`}
                    className="lead-action-btn btn-call"
                    title={`Call ${inq.phone}`}
                  >
                    <Phone size={15} />
                  </a>
                  <a
                    href={`https://wa.me/91${inq.phone.replace(/[^0-9]/g, "")}?text=Hello%20${encodeURIComponent(inq.name)},%20this%20is%20Erphan%20Alam%20Enterprises%20regarding%20your%20inquiry%20for%20${encodeURIComponent(inq.division)}.`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="lead-action-btn btn-whatsapp"
                    title="Reply on WhatsApp"
                  >
                    <MessageCircle size={15} />
                  </a>
                  <select
                    className="status-quick-select"
                    value={inq.status}
                    onChange={(e) => updateInquiryStatus(inq.id, e.target.value)}
                  >
                    <option value="New">New</option>
                    <option value="Contacted">Contacted</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Negotiation">Negotiation</option>
                    <option value="Closed">Closed</option>
                  </select>
                </div>
              </div>
            )))}
          </div>
        </div>

        {/* Right Column: 4 Child Businesses Snapshot */}
        <div className="admin-content-box">
          <div className="box-header">
            <div>
              <h3>{divisions.length} Divisions Status</h3>
              <p>Live operational capacity across business pillars</p>
            </div>
            <button
              className="btn btn-sm btn-outline-light"
              onClick={() => setActiveTab("divisions")}
            >
              Edit CMS <ArrowRight size={14} />
            </button>
          </div>

          <div className="divisions-admin-summary-grid">
            {divisions.map((div) => (
              <div key={div.id} className="div-admin-summary-card">
                <div className="div-summary-title-row">
                  <span className="div-summary-name">
                    <strong>{div.number}.</strong> {div.shortName}
                  </span>
                  <span className={`status-badge-sm badge-${div.status}`}>
                    {div.statusLabel}
                  </span>
                </div>
                <p className="div-summary-desc">{div.leadDesc.substring(0, 95)}...</p>
                <div className="div-summary-footer">
                  <span className="div-summary-stat">{div.highlightStat}</span>
                  <button
                    className="btn-link-sm"
                    onClick={() => setActiveTab("divisions")}
                  >
                    Edit Content
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
