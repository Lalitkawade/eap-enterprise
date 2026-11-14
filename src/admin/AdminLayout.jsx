import React, { useState } from "react";
import { useApp } from "../context/AppContext";
import { DashboardOverview } from "./DashboardOverview";
import { InquiriesManager } from "./InquiriesManager";
import { DivisionsCMS } from "./DivisionsCMS";
import { InventoryTracker } from "./InventoryTracker";
import { SettingsManager } from "./SettingsManager";
import { InvoicesManager } from "./InvoicesManager";
import { AttendanceManager } from "./AttendanceManager";
import {
  LayoutDashboard,
  Inbox,
  Layers,
  Boxes,
  Settings,
  LogOut,
  ExternalLink,
  ShieldCheck,
  Menu,
  X,
  FileText,
  Users
} from "lucide-react";

export const AdminLayout = () => {
  const {
    settings,
    logoutAdmin,
    setCurrentView,
    inquiries,
    activeAdminTab,
    setActiveAdminTab,
    adminUser
  } = useApp();

  const [sidebarOpen, setSidebarOpen] = useState(false);

  const newLeadsCount = inquiries.filter((inq) => inq.status === "New").length;

  const renderContent = () => {
    switch (activeAdminTab) {
      case "dashboard":
        return <DashboardOverview setActiveTab={setActiveAdminTab} />;
      case "quotations":
        return <InvoicesManager />;
      case "attendance":
        return <AttendanceManager />;
      case "inquiries":
        return <InquiriesManager />;
      case "divisions":
        return <DivisionsCMS />;
      case "inventory":
        return <InventoryTracker />;
      case "settings":
        return <SettingsManager />;
      default:
        return <DashboardOverview setActiveTab={setActiveAdminTab} />;
    }
  };

  return (
    <div className="admin-portal-wrapper">
      {/* Admin Sidebar */}
      <aside className={`admin-sidebar ${sidebarOpen ? "open" : ""}`}>
        <div className="admin-sidebar-header">
          <div className="admin-brand-logo">
            <div className="admin-logo-badge">
              <img 
                src="/Client logos/User Logo/eap-logo.png" 
                alt="EAP Logo" 
                className="admin-sidebar-emblem"
              />
            </div>
            <div className="admin-logo-text">
              <span className="admin-logo-title">Erphan Alam</span>
              <span className="admin-logo-subtitle">OPERATIONS CONSOLE</span>
            </div>
          </div>
          <button className="sidebar-close-btn" onClick={() => setSidebarOpen(false)} aria-label="Close Sidebar">
            <X size={18} />
          </button>
        </div>

        <nav className="admin-nav-menu">
          <button
            className={`admin-nav-item ${activeAdminTab === "dashboard" ? "active" : ""}`}
            onClick={() => {
              setActiveAdminTab("dashboard");
              setSidebarOpen(false);
            }}
          >
            <LayoutDashboard size={18} />
            <span>Dashboard Overview</span>
          </button>

          <button
            className={`admin-nav-item ${activeAdminTab === "quotations" ? "active" : ""}`}
            onClick={() => {
              setActiveAdminTab("quotations");
              setSidebarOpen(false);
            }}
          >
            <FileText size={18} />
            <span>Quotations & Invoices</span>
          </button>

          <button
            className={`admin-nav-item ${activeAdminTab === "attendance" ? "active" : ""}`}
            onClick={() => {
              setActiveAdminTab("attendance");
              setSidebarOpen(false);
            }}
          >
            <Users size={18} />
            <span>Manpower Attendance</span>
          </button>

          <button
            className={`admin-nav-item ${activeAdminTab === "inquiries" ? "active" : ""}`}
            onClick={() => {
              setActiveAdminTab("inquiries");
              setSidebarOpen(false);
            }}
          >
            <Inbox size={18} />
            <span>Inquiries & Leads</span>
            {newLeadsCount > 0 && (
              <span className="nav-badge-pill">{newLeadsCount}</span>
            )}
          </button>

          <button
            className={`admin-nav-item ${activeAdminTab === "divisions" ? "active" : ""}`}
            onClick={() => {
              setActiveAdminTab("divisions");
              setSidebarOpen(false);
            }}
          >
            <Layers size={18} />
            <span>Divisions CMS</span>
          </button>

          <button
            className={`admin-nav-item ${activeAdminTab === "inventory" ? "active" : ""}`}
            onClick={() => {
              setActiveAdminTab("inventory");
              setSidebarOpen(false);
            }}
          >
            <Boxes size={18} />
            <span>Operations & Stock</span>
          </button>

          <button
            className={`admin-nav-item ${activeAdminTab === "settings" ? "active" : ""}`}
            onClick={() => {
              setActiveAdminTab("settings");
              setSidebarOpen(false);
            }}
          >
            <Settings size={18} />
            <span>Site & Contact Settings</span>
          </button>
        </nav>

        <div className="admin-sidebar-footer">
          <div className="admin-user-info">
            <div className="user-avatar">
              <ShieldCheck size={20} className="text-cyan" />
            </div>
            <div className="user-details" style={{ overflow: "hidden", textOverflow: "ellipsis" }}>
              <strong style={{ fontSize: "0.82rem", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", display: "block" }}>
                {adminUser?.email || settings.proprietor}
              </strong>
              <span>{adminUser ? "Supabase Authenticated" : "Executive Superadmin"}</span>
            </div>
          </div>

          <div className="sidebar-footer-buttons">
            <button
              className="btn btn-outline-light btn-sm w-100 mb-2"
              onClick={() => setCurrentView("client")}
            >
              <ExternalLink size={14} /> View Public Website
            </button>
            <button
              className="btn btn-danger-outline btn-sm w-100"
              onClick={logoutAdmin}
            >
              <LogOut size={14} /> Sign Out
            </button>
          </div>
        </div>
      </aside>

      {sidebarOpen && (
        <div className="drawer-backdrop" onClick={() => setSidebarOpen(false)}></div>
      )}

      {/* Main Admin Content Body */}
      <div className="admin-main-container">
        {/* Top Header */}
        <header className="admin-top-header">
          <div className="header-left">
            <button
              className="admin-menu-toggle"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              aria-label="Toggle Sidebar Menu"
            >
              <Menu size={20} />
            </button>
            <div className="admin-header-title">
              <span className="live-status-dot"></span>
              <span className="admin-header-brand-name">
                <span className="text-full">Erphan Alam Enterprises (EAP)</span>
                <span className="text-mobile">EAP Admin</span>
              </span>
              <span className="admin-header-sep">•</span>
              <span className="admin-header-scope">All India Operations Console</span>
            </div>
          </div>

          <div className="header-right">
            <button
              className="admin-header-btn btn-view-website"
              onClick={() => setCurrentView("client")}
              title="Open Public Website in Viewer"
            >
              <ExternalLink size={14} />
              <span className="text-full">Open Client Website</span>
              <span className="text-mobile">Website</span>
            </button>
            <button
              className="admin-header-btn btn-logout-action"
              onClick={logoutAdmin}
              title="Sign Out of Operations Console"
            >
              <LogOut size={14} />
              <span>Logout</span>
            </button>
          </div>
        </header>

        {/* Content Area */}
        <main className="admin-content-viewport">
          {renderContent()}
        </main>
      </div>
    </div>
  );
};
