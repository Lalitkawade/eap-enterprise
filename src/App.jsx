import React from "react";
import { AppProvider, useApp } from "./context/AppContext";
import { FloatingNav } from "./components/FloatingNav";
import { HeroSlider } from "./components/HeroSlider";
import { ClientPartners } from "./components/ClientPartners";
import { ArchitecturalAbout } from "./components/ArchitecturalAbout";
import { ArchitecturalDivisions } from "./components/ArchitecturalDivisions";
import { ArchitecturalPanIndia } from "./components/ArchitecturalPanIndia";
import { ArchitecturalContact } from "./components/ArchitecturalContact";
import { ArchitecturalFooter } from "./components/ArchitecturalFooter";
import { InquiryModal } from "./components/InquiryModal";
import { AdminLayout } from "./admin/AdminLayout";
import { AdminLogin } from "./admin/AdminLogin";
import { CheckCircle2, AlertTriangle, Info } from "lucide-react";
import "./App.css";

const AppContent = () => {
  const { currentView, isAdminLoggedIn, toast } = useApp();

  return (
    <div className="arch-app-root">
      {/* Global Toast Notification */}
      {toast.show && (
        <div className={`global-toast toast-${toast.type}`}>
          {toast.type === "success" && <CheckCircle2 size={18} />}
          {toast.type === "error" && <AlertTriangle size={18} />}
          {toast.type === "info" && <Info size={18} />}
          <span>{toast.message}</span>
        </div>
      )}

      {/* Main View Switcher: Public Architectural Portal vs. Executive Admin Portal */}
      {currentView === "admin" ? (
        isAdminLoggedIn ? (
          <AdminLayout />
        ) : (
          <AdminLogin />
        )
      ) : (
        <div className="public-portal-flow">
          {/* Top Belgrade Arbor Floating Island Pill Navigation */}
          <FloatingNav />

          <main>
            {/* The Signature Framed Cinematic Hero Slider */}
            <HeroSlider />

            {/* Trusted Enterprise Clients Marquee */}
            <ClientPartners />

            {/* Enterprise Manifesto / About */}
            <ArchitecturalAbout />

            {/* Curated 4 Business Divisions Showcase */}
            <ArchitecturalDivisions />

            {/* All-India Logistics & Supply Grid */}
            <ArchitecturalPanIndia />

            {/* Unified Project Specification, RFP & Operations Desk */}
            <ArchitecturalContact />
          </main>

          <ArchitecturalFooter />
          <InquiryModal />
        </div>
      )}
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
