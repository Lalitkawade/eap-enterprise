import React, { createContext, useContext, useState, useEffect } from "react";
import {
  initialDivisions,
  initialInquiries,
  initialInventory,
  initialSettings,
  initialInvoices,
  initialAttendance
} from "../data/initialData";
import {
  signInWithEmail,
  signOut as supabaseSignOut,
  getStoredUser,
  isSessionValid,
  refreshSession,
  isSupabaseConfigured,
  createInquiry
} from "../services/supabaseClient";

const AppContext = createContext();

const DATA_VERSION = "v10_prod_secured_no_backdoors";

// Sequential ID Generator: produces padded sequences like INQ-001, QT-001, INV-001, ATT-001
export const getNextSequentialId = (items = [], prefix = "INQ-", field = "id", padLength = 3) => {
  let maxNum = 0;
  const escaped = prefix.replace(/[-\\/\\^$*+?.()|[\\]{}]/g, "\\$&");
  const regex = new RegExp(`^${escaped}(\\d+)$`, "i");

  (items || []).forEach((item) => {
    const rawVal = item[field] || item.id || item.invoiceNumber || item.referenceNo || "";
    const match = String(rawVal).match(regex);
    if (match) {
      const num = parseInt(match[1], 10);
      if (!isNaN(num) && num < 1000 && num > maxNum) {
        maxNum = num;
      }
    }
  });

  const nextNum = maxNum + 1;
  return `${prefix}${String(nextNum).padStart(padLength, "0")}`;
};

// Normalizer: cleans up legacy unpadded / random numbers (e.g. INQ-3960 -> INQ-001)
const normalizeSequentialList = (list = [], prefix = "INQ-", field = "id") => {
  if (!Array.isArray(list)) return [];
  let seq = 1;
  return list.map((item) => {
    const val = item[field] || item.id || "";
    const match = String(val).match(new RegExp(`^${prefix}(\\d{3,})$`, "i"));
    if (match && parseInt(match[1], 10) < 1000) {
      return item;
    }
    const newId = `${prefix}${String(seq).padStart(3, "0")}`;
    seq++;
    const updated = { ...item, [field]: newId };
    if (field !== "id") updated.id = newId;
    if (field === "invoiceNumber") updated.invoiceNumber = newId;
    if (field === "referenceNo") updated.referenceNo = newId;
    return updated;
  });
};

export const AppProvider = ({ children }) => {
  // Check data version to refresh cache if schema or images changed
  useEffect(() => {
    const version = localStorage.getItem("eap_data_version");
    if (version !== DATA_VERSION) {
      localStorage.setItem("eap_data_version", DATA_VERSION);
      localStorage.setItem("eap_divisions", JSON.stringify(initialDivisions));
      localStorage.setItem("eap_settings", JSON.stringify(initialSettings));
      localStorage.setItem("eap_inventory", JSON.stringify(initialInventory));
      localStorage.setItem("eap_invoices", JSON.stringify(initialInvoices));
      localStorage.setItem("eap_attendance", JSON.stringify(initialAttendance));
      localStorage.setItem("eap_inquiries", JSON.stringify(initialInquiries));
    }
  }, []);

  // Load persisted state from localStorage or fallback to initial
  const [divisions, setDivisions] = useState(() => {
    const version = localStorage.getItem("eap_data_version");
    if (version !== DATA_VERSION) {
      return initialDivisions;
    }
    const saved = localStorage.getItem("eap_divisions");
    return saved ? JSON.parse(saved) : initialDivisions;
  });

  const [inquiries, setInquiries] = useState(() => {
    const version = localStorage.getItem("eap_data_version");
    if (version !== DATA_VERSION) {
      return initialInquiries;
    }
    const saved = localStorage.getItem("eap_inquiries");
    if (!saved) return initialInquiries;
    try {
      const parsed = JSON.parse(saved);
      return normalizeSequentialList(parsed, "INQ-", "id");
    } catch {
      return initialInquiries;
    }
  });

  const [inventory, setInventory] = useState(() => {
    const version = localStorage.getItem("eap_data_version");
    if (version !== DATA_VERSION) {
      return initialInventory;
    }
    const saved = localStorage.getItem("eap_inventory");
    return saved ? JSON.parse(saved) : initialInventory;
  });

  const [settings, setSettings] = useState(() => {
    const version = localStorage.getItem("eap_data_version");
    if (version !== DATA_VERSION) {
      return initialSettings;
    }
    const saved = localStorage.getItem("eap_settings");
    return saved ? JSON.parse(saved) : initialSettings;
  });

  const [invoices, setInvoices] = useState(() => {
    const version = localStorage.getItem("eap_data_version");
    if (version !== DATA_VERSION) {
      return initialInvoices;
    }
    const saved = localStorage.getItem("eap_invoices");
    if (!saved) return initialInvoices;
    try {
      const parsed = JSON.parse(saved);
      let invSeq = 1;
      let qtSeq = 1;
      return parsed.map((item) => {
        const isQuot = item.type === "Official Quotation";
        const prefix = isQuot ? "QT-" : "INV-";
        const val = item.invoiceNumber || item.id || "";
        const match = String(val).match(new RegExp(`^${prefix}(\\d{3,})$`, "i"));
        if (match && parseInt(match[1], 10) < 1000) {
          return item;
        }
        const seq = isQuot ? qtSeq++ : invSeq++;
        const newNum = `${prefix}${String(seq).padStart(3, "0")}`;
        return { ...item, id: newNum, invoiceNumber: newNum };
      });
    } catch {
      return initialInvoices;
    }
  });

  const [attendanceRecords, setAttendanceRecords] = useState(() => {
    const version = localStorage.getItem("eap_data_version");
    if (version !== DATA_VERSION) {
      return initialAttendance;
    }
    const saved = localStorage.getItem("eap_attendance");
    if (!saved) return initialAttendance;
    try {
      const parsed = JSON.parse(saved);
      return normalizeSequentialList(parsed, "ATT-", "referenceNo");
    } catch {
      return initialAttendance;
    }
  });

  // Admin View & Verified Supabase Authentication State
  const [adminUser, setAdminUser] = useState(() => getStoredUser());
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(() => isSessionValid());

  // Periodically verify session validity and refresh token if needed
  useEffect(() => {
    const verifyAuth = async () => {
      if (isAdminLoggedIn && !isSessionValid()) {
        const refreshed = await refreshSession();
        if (refreshed) {
          setAdminUser(refreshed.user);
          setIsAdminLoggedIn(true);
        } else {
          setAdminUser(null);
          setIsAdminLoggedIn(false);
        }
      }
    };
    verifyAuth();
  }, [isAdminLoggedIn]);

  // URL Path Synchronization: Domain/admin Route Management
  const [currentView, setCurrentViewState] = useState(() => {
    if (typeof window !== "undefined") {
      const path = window.location.pathname.toLowerCase();
      if (path === "/admin" || path.startsWith("/admin/")) {
        return "admin";
      }
    }
    return "client";
  });

  const setCurrentView = (view) => {
    setCurrentViewState(view);
    if (typeof window !== "undefined") {
      const targetPath = view === "admin" ? "/admin" : "/";
      if (window.location.pathname !== targetPath) {
        window.history.pushState({ view }, "", targetPath);
      }
    }
  };

  useEffect(() => {
    const handlePopState = () => {
      if (typeof window !== "undefined") {
        const path = window.location.pathname.toLowerCase();
        if (path === "/admin" || path.startsWith("/admin/")) {
          setCurrentViewState("admin");
        } else {
          setCurrentViewState("client");
        }
      }
    };

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);
  const [activeAdminTab, setActiveAdminTab] = useState("dashboard"); // 'dashboard' | 'inquiries' | 'divisions' | 'inventory' | 'settings'

  // Pre-fill Modal State for Division Inquiry
  const [inquiryModalData, setInquiryModalData] = useState({
    isOpen: false,
    divisionName: ""
  });

  // Notification Toast State
  const [toast, setToast] = useState({
    show: false,
    message: "",
    type: "success" // 'success' | 'error' | 'info'
  });

  const showToast = (message, type = "success") => {
    setToast({ show: true, message, type });
    setTimeout(() => {
      setToast({ show: false, message: "", type: "success" });
    }, 4000);
  };

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem("eap_divisions", JSON.stringify(divisions));
  }, [divisions]);

  useEffect(() => {
    localStorage.setItem("eap_inquiries", JSON.stringify(inquiries));
  }, [inquiries]);

  useEffect(() => {
    localStorage.setItem("eap_inventory", JSON.stringify(inventory));
  }, [inventory]);

  useEffect(() => {
    localStorage.setItem("eap_settings", JSON.stringify(settings));
  }, [settings]);

  useEffect(() => {
    localStorage.setItem("eap_invoices", JSON.stringify(invoices));
  }, [invoices]);

  useEffect(() => {
    localStorage.setItem("eap_attendance", JSON.stringify(attendanceRecords));
  }, [attendanceRecords]);

  // Lead / Inquiry Operations
  const addInquiry = (data) => {
    const nextId = getNextSequentialId(inquiries, "INQ-", "id", 3);
    const newInquiry = {
      id: nextId,
      name: data.name || "Client",
      company: data.company || "Individual",
      phone: data.phone || "",
      email: data.email || "",
      division: data.division || "General Inquiry",
      volume: data.volume || "Standard Commercial",
      scope: data.scope || data.message || "Custom requirement",
      location: data.location || "India",
      timeline: data.timeline || "Within 15 to 30 Days",
      message: data.message || "",
      status: "New",
      date: new Date().toISOString().split("T")[0],
      notes: "Submitted via Website Online Portal"
    };

    setInquiries((prev) => [newInquiry, ...prev]);

    // Securely sync lead to Supabase cloud database if configured
    if (isSupabaseConfigured()) {
      createInquiry({
        id: newInquiry.id,
        name: newInquiry.name,
        company: newInquiry.company,
        phone: newInquiry.phone,
        email: newInquiry.email,
        division: newInquiry.division,
        scope: newInquiry.scope,
        location: newInquiry.location,
        timeline: newInquiry.timeline,
        status: "New",
        notes: newInquiry.notes
      }).catch((err) => {
        console.warn("Supabase lead cloud backup notice:", err?.message || err);
      });
    }

    showToast(`Inquiry #${newInquiry.id} submitted! Our team will contact you shortly.`);
    return newInquiry;
  };

  const updateInquiryStatus = (id, newStatus) => {
    setInquiries((prev) =>
      prev.map((item) => (item.id === id ? { ...item, status: newStatus } : item))
    );
    showToast(`Inquiry ${id} status changed to "${newStatus}"`);
  };

  const updateInquiryNotes = (id, notes) => {
    setInquiries((prev) =>
      prev.map((item) => (item.id === id ? { ...item, notes } : item))
    );
    showToast(`Notes updated for ${id}`);
  };

  const deleteInquiry = (id) => {
    setInquiries((prev) => prev.filter((item) => item.id !== id));
    showToast(`Inquiry ${id} removed`, "info");
  };

  // Division CMS Operations
  const updateDivision = (id, updatedFields) => {
    setDivisions((prev) =>
      prev.map((div) => (div.id === id ? { ...div, ...updatedFields } : div))
    );
    showToast(`Division "${updatedFields.name || id}" updated successfully!`);
  };

  // Inventory Tracker Operations
  const updateInventoryField = (section, field, value) => {
    setInventory((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
    showToast(`Updated ${section} operational records`);
  };

  // Invoice & Quotation Operations (Sequential: QT-001, INV-001)
  const addInvoice = (data) => {
    const isQuotation = data.type === "Official Quotation";
    const prefix = isQuotation ? "QT-" : "INV-";
    const targetInvoices = (invoices || []).filter(
      (inv) => (inv.type === "Official Quotation") === isQuotation
    );
    const generatedId = data.invoiceNumber || getNextSequentialId(targetInvoices, prefix, "invoiceNumber", 3);
    const newInvoice = {
      ...data,
      id: generatedId,
      invoiceNumber: generatedId,
      date: data.date || new Date().toISOString().split("T")[0],
      createdAt: new Date().toISOString()
    };
    setInvoices((prev) => [newInvoice, ...prev]);
    showToast(`${isQuotation ? "Quotation" : "Tax Invoice"} #${newInvoice.invoiceNumber} created successfully!`);
    return newInvoice;
  };

  const updateInvoice = (id, updatedFields) => {
    setInvoices((prev) =>
      prev.map((inv) => (inv.id === id ? { ...inv, ...updatedFields } : inv))
    );
    showToast(`Document ${id} updated successfully!`);
  };

  const deleteInvoice = (id) => {
    setInvoices((prev) => prev.filter((inv) => inv.id !== id));
    showToast(`Document ${id} removed`, "info");
  };

  // Manpower Attendance Operations (Sequential: ATT-001, ATT-002)
  const addAttendanceRecord = (data) => {
    const generatedId = data.referenceNo || getNextSequentialId(attendanceRecords, "ATT-", "referenceNo", 3);
    const newRecord = {
      ...data,
      id: generatedId,
      referenceNo: generatedId,
      dateCreated: data.dateCreated || new Date().toISOString().split("T")[0],
      status: data.status || "Pending Billing"
    };
    setAttendanceRecords((prev) => [newRecord, ...prev]);
    showToast(`Attendance Sheet #${newRecord.id} for "${newRecord.siteName}" saved!`);
    return newRecord;
  };

  const updateAttendanceRecord = (id, updatedFields) => {
    setAttendanceRecords((prev) =>
      prev.map((rec) => (rec.id === id ? { ...rec, ...updatedFields } : rec))
    );
    showToast(`Attendance record ${id} updated!`);
  };

  const deleteAttendanceRecord = (id) => {
    setAttendanceRecords((prev) => prev.filter((rec) => rec.id !== id));
    showToast(`Attendance record ${id} removed`, "info");
  };

  // 1-Click Convert Attendance to Invoice (Sequential: INV-001, INV-002)
  const convertAttendanceToInvoice = (attendanceId) => {
    const att = attendanceRecords.find((r) => r.id === attendanceId);
    if (!att) return null;

    const targetInvoices = (invoices || []).filter((inv) => inv.type !== "Official Quotation");
    const invoiceNum = getNextSequentialId(targetInvoices, "INV-", "invoiceNumber", 3);
    const items = (att.summaryByTrade || []).map((t, idx) => ({
      id: idx + 1,
      hsnSac: "998517",
      description: `${t.trade} deployment - ${att.siteName}`,
      unit: t.unit || "Days",
      qty: Number(t.billQty) || 1,
      rate: Number(t.rate) || 0,
      amount: Number(t.amount) || (Number(t.billQty) * Number(t.rate))
    }));

    const subtotal = items.reduce((sum, item) => sum + Number(item.amount || 0), 0);
    const taxRate = 18;
    const taxAmount = Number((subtotal * (taxRate / 100)).toFixed(2));
    const grandTotal = Number((subtotal + taxAmount).toFixed(2));

    const newInvoice = {
      id: invoiceNum,
      type: "Tax Invoice",
      invoiceNumber: invoiceNum,
      date: new Date().toISOString().split("T")[0],
      dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
      status: "Sent",
      projectName: att.siteName,
      clientName: att.clientName,
      clientAddress: "Project Site Client Office",
      clientGst: "29AABCV7295G1Z5",
      clientPhone: settings.contactPhone || "",
      clientEmail: settings.contactEmail || "",
      workOrderNo: att.referenceNo || "WO-ATT-BILL",
      workOrderDate: att.dateCreated,
      srnDocNo: att.referenceNo || "-",
      srnDate: att.dateCreated,
      srnId: att.referenceNo || "-",
      items,
      subtotal,
      taxType: "IGST",
      taxRate,
      taxAmount,
      grandTotal,
      notes: `Generated from Manpower Attendance Sheet (${att.id} - ${att.billingMonth}) for site: ${att.siteName}.`
    };

    setInvoices((prev) => [newInvoice, ...prev]);

    // Mark attendance as Billed
    setAttendanceRecords((prev) =>
      prev.map((rec) =>
        rec.id === attendanceId
          ? { ...rec, status: "Billed", linkedInvoiceId: invoiceNum }
          : rec
      )
    );

    showToast(`Converted Attendance ${att.id} into Tax Invoice #${invoiceNum}!`);
    return newInvoice;
  };

  // Site Settings Operations
  const updateSettings = (updatedFields) => {
    setSettings((prev) => ({ ...prev, ...updatedFields }));
    showToast("Corporate settings & contact information updated!");
  };

  // Auth Operations
  const loginWithSupabase = async (email, password) => {
    try {
      const result = await signInWithEmail(email, password);
      if (result.success) {
        setAdminUser(result.user);
        setIsAdminLoggedIn(true);
        setCurrentView("admin");
        showToast(`Welcome back, ${result.user?.email || "Admin"}!`);
        return { success: true };
      } else {
        showToast(result.error || "Authentication failed", "error");
        return { success: false, error: result.error };
      }
    } catch (err) {
      const msg = err.message || "Failed to connect to Supabase Auth";
      showToast(msg, "error");
      return { success: false, error: msg };
    }
  };

  const logoutAdmin = async () => {
    try {
      await supabaseSignOut();
    } catch (e) {
      console.warn("Supabase signout failed:", e);
    }
    setAdminUser(null);
    setIsAdminLoggedIn(false);
    localStorage.removeItem("eap_supabase_session");
    localStorage.removeItem("eap_admin_auth");
    setCurrentView("client");
    showToast("Logged out of Admin Portal", "info");
  };

  const openInquiryModal = (divisionName = "") => {
    setInquiryModalData({
      isOpen: true,
      divisionName
    });
  };

  const closeInquiryModal = () => {
    setInquiryModalData({
      isOpen: false,
      divisionName: ""
    });
  };

  const resetAllData = () => {
    if (window.confirm("Are you sure you want to reset all data, CMS edits, and inquiries back to original seed values?")) {
      setDivisions(initialDivisions);
      setInquiries(initialInquiries);
      setInventory(initialInventory);
      setSettings(initialSettings);
      setInvoices(initialInvoices);
      setAttendanceRecords(initialAttendance);
      localStorage.clear();
      showToast("All data successfully restored to system defaults", "info");
    }
  };

  return (
    <AppContext.Provider
      value={{
        divisions,
        inquiries,
        inventory,
        settings,
        invoices,
        attendanceRecords,
        isAdminLoggedIn,
        currentView,
        setCurrentView,
        activeAdminTab,
        setActiveAdminTab,
        inquiryModalData,
        openInquiryModal,
        closeInquiryModal,
        toast,
        showToast,
        addInquiry,
        updateInquiryStatus,
        updateInquiryNotes,
        deleteInquiry,
        updateDivision,
        updateInventoryField,
        updateSettings,
        addInvoice,
        updateInvoice,
        deleteInvoice,
        addAttendanceRecord,
        updateAttendanceRecord,
        deleteAttendanceRecord,
        convertAttendanceToInvoice,
        loginWithSupabase,
        logoutAdmin,
        adminUser,
        isSupabaseConfigured: isSupabaseConfigured(),
        getNextSequentialId,
        resetAllData
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
};
