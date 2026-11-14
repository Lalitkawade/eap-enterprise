import React, { useState } from "react";
import { useApp } from "../context/AppContext";
import { numberToWordsIndian } from "../utils/numberToWords";
import {
  Users,
  Plus,
  Search,
  Filter,
  Printer,
  Edit3,
  Trash2,
  CheckCircle2,
  Clock,
  ArrowRightCircle,
  X,
  Building,
  UserCheck,
  Calculator,
  RotateCcw,
  FileText,
  Calendar,
  Check,
  ChevronRight,
  Sun
} from "lucide-react";

// Get number of days for month string (e.g. "November 2026" -> 30)
function getDaysInMonthFromPeriod(periodStr) {
  if (!periodStr) return 30;
  const lower = periodStr.toLowerCase();
  if (lower.includes("feb")) return 28;
  if (lower.includes("apr") || lower.includes("jun") || lower.includes("sep") || lower.includes("nov")) return 30;
  return 31;
}

// Generate sample daily attendance object (1..totalDays)
function generateInitialDailyAttendance(targetDays = 26, targetOt = 30, totalDays = 30) {
  const daily = {};
  let daysAllocated = 0;
  let otRemaining = targetOt;

  for (let d = 1; d <= totalDays; d++) {
    const isSunday = (d % 7 === 0);
    if (isSunday) {
      daily[d] = { status: "WO", ot: 0 };
    } else if (daysAllocated < targetDays) {
      const avgOt = targetOt > 0 ? Math.min(Math.round((targetOt / targetDays) * 2) / 2 || 2, otRemaining) : 0;
      const otForToday = otRemaining > 0 ? avgOt : 0;
      otRemaining = Math.max(0, otRemaining - otForToday);
      daily[d] = { status: "P", ot: otForToday };
      daysAllocated += 1;
    } else {
      daily[d] = { status: "A", ot: 0 };
    }
  }

  return daily;
}

// Recompute totals from dailyAttendance object
function computeWorkerTotalsFromDaily(dailyAttendance, dayRate = 1200, otRate = 150) {
  if (!dailyAttendance) return { daysWorked: 0, otHours: 0, totalAmount: 0 };

  let days = 0;
  let ot = 0;

  Object.values(dailyAttendance).forEach((entry) => {
    if (entry.status === "P") days += 1;
    else if (entry.status === "HD") days += 0.5;
    ot += Number(entry.ot) || 0;
  });

  const rateD = Number(dayRate) || 0;
  const rateO = Number(otRate) || 0;
  const totalAmount = Number(((days * rateD) + (ot * rateO)).toFixed(2));

  return {
    daysWorked: Number(days.toFixed(2)),
    otHours: Number(ot.toFixed(2)),
    totalAmount
  };
}

// Helper function to automatically aggregate workers into Trade Summary rows
function calculateTradeSummaryFromWorkers(workers) {
  if (!workers || workers.length === 0) return [];

  const tradeMap = {};

  workers.forEach((worker) => {
    const trade = (worker.trade || "Technician").trim();
    if (!tradeMap[trade]) {
      tradeMap[trade] = {
        trade,
        days: 0,
        otHours: 0,
        dayRate: Number(worker.dayRate) || 0,
        otRate: Number(worker.otRate) || 0
      };
    }
    tradeMap[trade].days += Number(worker.daysWorked) || 0;
    tradeMap[trade].otHours += Number(worker.otHours) || 0;
    if (Number(worker.dayRate) > 0) tradeMap[trade].dayRate = Number(worker.dayRate);
    if (Number(worker.otRate) > 0) tradeMap[trade].otRate = Number(worker.otRate);
  });

  const summary = [];

  Object.values(tradeMap).forEach((t) => {
    // Days row
    if (t.days > 0 || t.dayRate > 0) {
      summary.push({
        trade: `${t.trade} (Days)`,
        unit: "Days",
        billQty: Number(t.days.toFixed(2)),
        rate: t.dayRate,
        amount: Number((t.days * t.dayRate).toFixed(2))
      });
    }

    // OT row
    if (t.otHours > 0 || t.otRate > 0) {
      summary.push({
        trade: `${t.trade} (OT)`,
        unit: "Hours",
        billQty: Number(t.otHours.toFixed(2)),
        rate: t.otRate,
        amount: Number((t.otHours * t.otRate).toFixed(2))
      });
    }
  });

  return summary;
}

export const AttendanceManager = () => {
  const {
    attendanceRecords,
    addAttendanceRecord,
    updateAttendanceRecord,
    deleteAttendanceRecord,
    convertAttendanceToInvoice,
    setActiveAdminTab,
    getNextSequentialId,
    settings
  } = useApp();

  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRecordId, setEditingRecordId] = useState(null);
  const [previewRecord, setPreviewRecord] = useState(null);
  const [previewTab, setPreviewTab] = useState("bill"); // 'bill' | 'muster' | 'both'

  // Day-wise Attendance Editor Sub-Modal State
  const [activeWorkerIndexForDaily, setActiveWorkerIndexForDaily] = useState(null);
  const [tempDailyAttendance, setTempDailyAttendance] = useState({});
  const [rosterViewMode, setRosterViewMode] = useState("table"); // 'table' | 'matrix'

  // Clean blank worker row generator for fresh attendance muster sheets
  const createBlankWorker = (id = 1) => ({
    id,
    name: "",
    trade: "Electrician",
    daysWorked: "",
    otHours: "",
    dayRate: "",
    otRate: "",
    totalAmount: 0,
    dailyAttendance: {}
  });

  const getInitialFormState = () => {
    const initialWorker = createBlankWorker(1);

    return {
      siteName: "",
      clientName: "",
      billingMonth: `${new Date().toLocaleString("en-US", { month: "long" })} ${new Date().getFullYear()}`,
      referenceNo: getNextSequentialId(attendanceRecords, "ATT-", "referenceNo", 3),
      dateCreated: new Date().toISOString().split("T")[0],
      status: "Pending Billing",
      autoCalculateSummary: true,
      workers: [initialWorker],
      summaryByTrade: [],
      notes: "Verified against site biometric / physical muster roll registers."
    };
  };

  const [formData, setFormData] = useState(getInitialFormState);

  // Month days count for current sheet
  const monthDaysCount = getDaysInMonthFromPeriod(formData.billingMonth);
  const daysArray = Array.from({ length: monthDaysCount }, (_, i) => i + 1);

  // Filtered records
  const filteredRecords = (attendanceRecords || []).filter((rec) => {
    const matchesSearch =
      (rec.siteName || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (rec.clientName || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (rec.billingMonth || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (rec.id || "").toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = filterStatus === "all" || rec.status === filterStatus;

    return matchesSearch && matchesStatus;
  });

  // KPI Calculations
  const totalSites = new Set((attendanceRecords || []).map((r) => r.siteName)).size;
  const totalDays = (attendanceRecords || []).reduce((sum, rec) => {
    const dayRows = (rec.summaryByTrade || []).filter((t) => t.unit === "Days");
    return sum + dayRows.reduce((s, row) => s + (Number(row.billQty) || 0), 0);
  }, 0);

  const totalOTHours = (attendanceRecords || []).reduce((sum, rec) => {
    const otRows = (rec.summaryByTrade || []).filter((t) => t.unit === "Hours");
    return sum + otRows.reduce((s, row) => s + (Number(row.billQty) || 0), 0);
  }, 0);

  const totalBillableValue = (attendanceRecords || []).reduce((sum, rec) => {
    return sum + (Number(rec.grandTotal) || (rec.summaryByTrade || []).reduce((s, r) => s + (Number(r.amount) || 0), 0));
  }, 0);

  const calculateTotal = (trades) => {
    return trades.reduce((sum, item) => sum + (Number(item.amount) || 0), 0);
  };

  // --- Worker Row Handlers ---
  const handleWorkerChange = (index, field, value) => {
    const updatedWorkers = [...formData.workers];
    const worker = { ...updatedWorkers[index], [field]: value };

    const days = field === "daysWorked" ? Number(value) || 0 : Number(worker.daysWorked) || 0;
    const ot = field === "otHours" ? Number(value) || 0 : Number(worker.otHours) || 0;
    const dRate = field === "dayRate" ? Number(value) || 0 : Number(worker.dayRate) || 0;
    const oRate = field === "otRate" ? Number(value) || 0 : Number(worker.otRate) || 0;

    worker.totalAmount = Number(((days * dRate) + (ot * oRate)).toFixed(2));

    // If days or OT changed manually, update daily attendance roughly
    if (field === "daysWorked" || field === "otHours") {
      worker.dailyAttendance = generateInitialDailyAttendance(days, ot, monthDaysCount);
    }

    updatedWorkers[index] = worker;

    const updatedSummary = formData.autoCalculateSummary
      ? calculateTradeSummaryFromWorkers(updatedWorkers)
      : formData.summaryByTrade;

    setFormData({
      ...formData,
      workers: updatedWorkers,
      summaryByTrade: updatedSummary
    });
  };

  const addWorkerRow = () => {
    const nextId = formData.workers.length > 0 ? Math.max(...formData.workers.map((w) => Number(w.id) || 0)) + 1 : 1;
    const newWorker = createBlankWorker(nextId);
    const updatedWorkers = [...formData.workers, newWorker];
    const updatedSummary = formData.autoCalculateSummary
      ? calculateTradeSummaryFromWorkers(updatedWorkers)
      : formData.summaryByTrade;

    setFormData({
      ...formData,
      workers: updatedWorkers,
      summaryByTrade: updatedSummary
    });
  };

  const removeWorkerRow = (index) => {
    if (formData.workers.length <= 1) return;
    const updatedWorkers = formData.workers.filter((_, idx) => idx !== index);
    const updatedSummary = formData.autoCalculateSummary
      ? calculateTradeSummaryFromWorkers(updatedWorkers)
      : formData.summaryByTrade;

    setFormData({
      ...formData,
      workers: updatedWorkers,
      summaryByTrade: updatedSummary
    });
  };

  // --- Day-Wise Attendance Calendar Modal Handlers ---
  const openDailyAttendanceModal = (workerIndex) => {
    const worker = formData.workers[workerIndex];
    const initialDaily = worker.dailyAttendance && Object.keys(worker.dailyAttendance).length > 0
      ? { ...worker.dailyAttendance }
      : generateInitialDailyAttendance(Number(worker.daysWorked) || 26, Number(worker.otHours) || 0, monthDaysCount);

    setActiveWorkerIndexForDaily(workerIndex);
    setTempDailyAttendance(initialDaily);
  };

  const handleDayStatusCycle = (day) => {
    const current = tempDailyAttendance[day] || { status: "P", ot: 0 };
    // Cycle: P -> HD -> A -> WO -> P
    const nextStatus = current.status === "P"
      ? "HD"
      : current.status === "HD"
      ? "A"
      : current.status === "A"
      ? "WO"
      : "P";

    setTempDailyAttendance({
      ...tempDailyAttendance,
      [day]: { ...current, status: nextStatus }
    });
  };

  const handleDayOtChange = (day, otValue) => {
    const current = tempDailyAttendance[day] || { status: "P", ot: 0 };
    setTempDailyAttendance({
      ...tempDailyAttendance,
      [day]: { ...current, ot: Number(otValue) || 0 }
    });
  };

  const markAllDaysPresent = () => {
    const updated = {};
    for (let d = 1; d <= monthDaysCount; d++) {
      const prevOt = tempDailyAttendance[d]?.ot || 0;
      updated[d] = { status: "P", ot: prevOt };
    }
    setTempDailyAttendance(updated);
  };

  const autoMarkSundaysOff = () => {
    const updated = { ...tempDailyAttendance };
    for (let d = 1; d <= monthDaysCount; d++) {
      if (d % 7 === 0) {
        updated[d] = { status: "WO", ot: 0 };
      }
    }
    setTempDailyAttendance(updated);
  };

  const saveDayWiseAttendance = () => {
    if (activeWorkerIndexForDaily === null) return;
    const worker = formData.workers[activeWorkerIndexForDaily];
    const recomputed = computeWorkerTotalsFromDaily(tempDailyAttendance, worker.dayRate, worker.otRate);

    const updatedWorkers = [...formData.workers];
    updatedWorkers[activeWorkerIndexForDaily] = {
      ...worker,
      dailyAttendance: tempDailyAttendance,
      daysWorked: recomputed.daysWorked,
      otHours: recomputed.otHours,
      totalAmount: recomputed.totalAmount
    };

    const updatedSummary = formData.autoCalculateSummary
      ? calculateTradeSummaryFromWorkers(updatedWorkers)
      : formData.summaryByTrade;

    setFormData({
      ...formData,
      workers: updatedWorkers,
      summaryByTrade: updatedSummary
    });

    setActiveWorkerIndexForDaily(null);
  };

  // Matrix cell toggle in Full Matrix Mode
  const handleMatrixCellToggle = (workerIdx, day) => {
    const worker = formData.workers[workerIdx];
    const daily = worker.dailyAttendance || generateInitialDailyAttendance(Number(worker.daysWorked) || 26, Number(worker.otHours) || 0, monthDaysCount);
    const current = daily[day] || { status: "P", ot: 0 };

    const nextStatus = current.status === "P"
      ? "HD"
      : current.status === "HD"
      ? "A"
      : current.status === "A"
      ? "WO"
      : "P";

    const updatedDaily = {
      ...daily,
      [day]: { ...current, status: nextStatus }
    };

    const recomputed = computeWorkerTotalsFromDaily(updatedDaily, worker.dayRate, worker.otRate);
    const updatedWorkers = [...formData.workers];
    updatedWorkers[workerIdx] = {
      ...worker,
      dailyAttendance: updatedDaily,
      daysWorked: recomputed.daysWorked,
      otHours: recomputed.otHours,
      totalAmount: recomputed.totalAmount
    };

    const updatedSummary = formData.autoCalculateSummary
      ? calculateTradeSummaryFromWorkers(updatedWorkers)
      : formData.summaryByTrade;

    setFormData({
      ...formData,
      workers: updatedWorkers,
      summaryByTrade: updatedSummary
    });
  };

  // Manual Trade Row Handlers
  const handleTradeChange = (index, field, value) => {
    const updatedTrades = [...formData.summaryByTrade];
    const currentItem = { ...updatedTrades[index], [field]: value };

    if (field === "billQty" || field === "rate") {
      const q = field === "billQty" ? Number(value) || 0 : Number(currentItem.billQty) || 0;
      const r = field === "rate" ? Number(value) || 0 : Number(currentItem.rate) || 0;
      currentItem.amount = Number((q * r).toFixed(2));
    }

    updatedTrades[index] = currentItem;
    setFormData({ ...formData, summaryByTrade: updatedTrades, autoCalculateSummary: false });
  };

  const addTradeRow = () => {
    setFormData({
      ...formData,
      autoCalculateSummary: false,
      summaryByTrade: [
        ...formData.summaryByTrade,
        { trade: "Technician / Worker", unit: "Days", billQty: 1, rate: 1000, amount: 1000 }
      ]
    });
  };

  const removeTradeRow = (index) => {
    if (formData.summaryByTrade.length <= 1) return;
    const updatedTrades = formData.summaryByTrade.filter((_, idx) => idx !== index);
    setFormData({ ...formData, summaryByTrade: updatedTrades, autoCalculateSummary: false });
  };

  const recomputeFromWorkers = () => {
    const recalculated = calculateTradeSummaryFromWorkers(formData.workers);
    setFormData({
      ...formData,
      autoCalculateSummary: true,
      summaryByTrade: recalculated
    });
  };

  const openCreateModal = () => {
    setEditingRecordId(null);
    setFormData(getInitialFormState());
    setIsModalOpen(true);
  };

  const openEditModal = (rec) => {
    setEditingRecordId(rec.id);
    const defaultState = getInitialFormState();
    const days = getDaysInMonthFromPeriod(rec.billingMonth);
    const workers = (rec.workers && rec.workers.length > 0 ? rec.workers : defaultState.workers).map((w) => ({
      ...w,
      dailyAttendance: w.dailyAttendance || generateInitialDailyAttendance(Number(w.daysWorked) || 26, Number(w.otHours) || 0, days)
    }));

    const summary = rec.summaryByTrade && rec.summaryByTrade.length > 0
      ? rec.summaryByTrade
      : calculateTradeSummaryFromWorkers(workers);

    setFormData({
      siteName: rec.siteName || "",
      clientName: rec.clientName || "",
      billingMonth: rec.billingMonth || "",
      referenceNo: rec.referenceNo || "",
      dateCreated: rec.dateCreated || "",
      status: rec.status || "Pending Billing",
      autoCalculateSummary: rec.autoCalculateSummary !== false,
      workers: workers,
      summaryByTrade: summary,
      notes: rec.notes || ""
    });
    setIsModalOpen(true);
  };

  const handleSaveAttendance = (e) => {
    e.preventDefault();
    const grandTotal = calculateTotal(formData.summaryByTrade);
    const payload = {
      ...formData,
      grandTotal
    };

    if (editingRecordId) {
      updateAttendanceRecord(editingRecordId, payload);
    } else {
      addAttendanceRecord(payload);
    }

    setIsModalOpen(false);
  };

  const handlePrint = () => {
    window.print();
  };

  // Live Worker Roster Totals
  const workerTotalDays = (formData.workers || []).reduce((sum, w) => sum + (Number(w.daysWorked) || 0), 0);
  const workerTotalOT = (formData.workers || []).reduce((sum, w) => sum + (Number(w.otHours) || 0), 0);
  const workerTotalPayout = (formData.workers || []).reduce((sum, w) => sum + (Number(w.totalAmount) || 0), 0);

  // Active Worker in Daily Editor
  const activeWorkerForDaily = activeWorkerIndexForDaily !== null ? formData.workers[activeWorkerIndexForDaily] : null;
  const activeWorkerDailyComputed = activeWorkerForDaily
    ? computeWorkerTotalsFromDaily(tempDailyAttendance, activeWorkerForDaily.dayRate, activeWorkerForDaily.otRate)
    : { daysWorked: 0, otHours: 0, totalAmount: 0 };

  return (
    <div className="attendance-manager-container">
      {/* Top Header */}
      <div className="admin-content-header">
        <div>
          <h1 className="admin-page-title">Manpower Attendance & Site Billing</h1>
          <p className="admin-page-subtitle">
            Manage day-by-day worker attendance logs (1–31 days). Trade days, overtime hours, and commercial bills calculate automatically in real time.
          </p>
        </div>
        <div className="header-actions">
          <button className="btn btn-primary" onClick={openCreateModal}>
            <Plus size={15} />
            <span className="text-full">New Attendance Sheet</span>
            <span className="text-mobile">New Sheet</span>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="admin-kpi-grid">
        <div className="kpi-card">
          <div className="kpi-card-header">
            <span className="kpi-label">Active Deployment Sites</span>
            <span className="kpi-icon-badge bg-blue-subtle text-primary">
              <Building size={18} />
            </span>
          </div>
          <div className="kpi-number">{totalSites}</div>
          <div className="kpi-footer text-muted">Across industrial projects</div>
        </div>

        <div className="kpi-card">
          <div className="kpi-card-header">
            <span className="kpi-label">Total Man-Days Logged</span>
            <span className="kpi-icon-badge bg-cyan-subtle text-cyan">
              <Users size={18} />
            </span>
          </div>
          <div className="kpi-number">{totalDays.toLocaleString("en-IN")}</div>
          <div className="kpi-footer text-muted">Full day manpower shifts</div>
        </div>

        <div className="kpi-card">
          <div className="kpi-card-header">
            <span className="kpi-label">Total Overtime (OT)</span>
            <span className="kpi-icon-badge bg-amber-subtle text-amber">
              <Clock size={18} />
            </span>
          </div>
          <div className="kpi-number text-amber">{totalOTHours.toLocaleString("en-IN")} <small className="text-sm">Hrs</small></div>
          <div className="kpi-footer text-muted">Night shift & emergency OT</div>
        </div>

        <div className="kpi-card">
          <div className="kpi-card-header">
            <span className="kpi-label">Total Billable Value</span>
            <span className="kpi-icon-badge bg-emerald-subtle text-emerald">
              <CheckCircle2 size={18} />
            </span>
          </div>
          <div className="kpi-number text-emerald">₹{totalBillableValue.toLocaleString("en-IN", { maximumFractionDigits: 2 })}</div>
          <div className="kpi-footer text-muted">Direct contractor supply</div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="admin-card mb-3 filter-toolbar-card">
        <div className="filter-bar-grid">
          <div className="search-input-wrapper">
            <Search size={16} className="search-icon" />
            <input
              type="text"
              placeholder="Search by site, client, month..."
              className="admin-input search-input"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="filter-selectors">
            <div className="filter-select-group">
              <select
                className="admin-select"
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
              >
                <option value="all">All Billing Statuses</option>
                <option value="Billed">Billed / Invoiced</option>
                <option value="Pending Billing">Pending Billing</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Attendance Records Table */}
      <div className="admin-card table-data-card">
        <div className="table-responsive">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Sheet ID</th>
                <th>Site & Project</th>
                <th>Client Name</th>
                <th>Billing Month</th>
                <th>Manpower Breakdown</th>
                <th>Total Value (₹)</th>
                <th>Status</th>
                <th className="text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredRecords.length === 0 ? (
                <tr>
                  <td colSpan="8" className="text-center py-5 text-muted">
                    <Users size={40} className="mb-2 opacity-50" />
                    <p>No manpower attendance sheets found.</p>
                  </td>
                </tr>
              ) : (
                filteredRecords.map((rec) => {
                  const daysCount = (rec.summaryByTrade || [])
                    .filter((t) => t.unit === "Days")
                    .reduce((sum, t) => sum + (Number(t.billQty) || 0), 0);
                  const otCount = (rec.summaryByTrade || [])
                    .filter((t) => t.unit === "Hours")
                    .reduce((sum, t) => sum + (Number(t.billQty) || 0), 0);
                  const totalAmt = Number(rec.grandTotal || 0);
                  const workerCount = (rec.workers || []).length;

                  return (
                    <tr key={rec.id}>
                      <td>
                        <div className="font-semibold text-primary">{rec.id}</div>
                        <div className="cell-sub-text">{rec.referenceNo || "Muster Roll"}</div>
                      </td>
                      <td>
                        <div className="font-medium text-dark">{rec.siteName}</div>
                        <div className="cell-sub-text">{rec.dateCreated}</div>
                      </td>
                      <td>
                        <div className="font-medium">{rec.clientName}</div>
                      </td>
                      <td>
                        <span className="badge-pill badge-neutral font-medium">
                          {rec.billingMonth}
                        </span>
                      </td>
                      <td>
                        <div className="cell-main-text">
                          <strong>{daysCount}</strong> Days | <strong>{otCount}</strong> OT Hrs
                        </div>
                        <div className="cell-sub-text">
                          {workerCount > 0 ? `${workerCount} Workers Logged • ` : ""}{(rec.summaryByTrade || []).length} trades
                        </div>
                      </td>
                      <td>
                        <div className="font-bold text-dark">
                          ₹{totalAmt.toLocaleString("en-IN", { maximumFractionDigits: 2 })}
                        </div>
                      </td>
                      <td>
                        {rec.status === "Billed" ? (
                          <span className="status-pill status-paid" title={`Linked Invoice: ${rec.linkedInvoiceId}`}>
                            Billed ({rec.linkedInvoiceId || "Done"})
                          </span>
                        ) : (
                          <span className="status-pill status-pending">
                            Pending Billing
                          </span>
                        )}
                      </td>
                      <td className="text-right">
                        <div className="action-buttons-group">
                          {rec.status !== "Billed" && (
                            <button
                              className="btn btn-sm btn-outline-cyan"
                              title="Generate Official Tax Invoice from this Attendance Sheet"
                              onClick={() => {
                                if (window.confirm(`Convert attendance for "${rec.siteName}" into an official Tax Invoice?`)) {
                                  convertAttendanceToInvoice(rec.id);
                                  setActiveAdminTab("quotations");
                                }
                              }}
                            >
                              <ArrowRightCircle size={14} /> To Invoice
                            </button>
                          )}
                          <button
                            className="btn-action-icon text-cyan"
                            title="Print / Save Supply Bill & Muster Roll PDF"
                            onClick={() => {
                              setPreviewRecord(rec);
                              setPreviewTab("bill");
                            }}
                          >
                            <Printer size={16} />
                          </button>
                          <button
                            className="btn-action-icon text-primary"
                            title="Edit Sheet & Worker Attendance"
                            onClick={() => openEditModal(rec)}
                          >
                            <Edit3 size={16} />
                          </button>
                          <button
                            className="btn-action-icon text-danger"
                            title="Delete Record"
                            onClick={() => {
                              if (window.confirm(`Delete attendance record ${rec.id}?`)) {
                                deleteAttendanceRecord(rec.id);
                              }
                            }}
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* CREATE / EDIT ATTENDANCE MODAL */}
      {isModalOpen && (
        <div className="modal-overlay" onClick={() => setIsModalOpen(false)}>
          <div className="admin-modal-card modal-lg" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div>
                <h2 className="modal-title">
                  {editingRecordId ? "Edit Attendance Sheet" : "New Manpower Attendance Record"}
                </h2>
                <p className="modal-subtitle">
                  Record deployed site manpower. Manage individual day-wise attendance (1–{monthDaysCount} {formData.billingMonth}) to automatically calculate bill quantities.
                </p>
              </div>
              <button className="modal-close-btn" onClick={() => setIsModalOpen(false)}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSaveAttendance} className="modal-body-form">
              {/* Site and Client Metadata */}
              <div className="form-grid-3">
                <div className="form-group">
                  <label className="form-label">Site / Project Location *</label>
                  <input
                    type="text"
                    className="admin-input"
                    placeholder="e.g. Dhurr India Pvt Ltd, Bidkin DMIC"
                    value={formData.siteName}
                    onChange={(e) => setFormData({ ...formData, siteName: e.target.value })}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Client / Contractor *</label>
                  <input
                    type="text"
                    className="admin-input"
                    placeholder="e.g. Sameer Electro Pvt Ltd"
                    value={formData.clientName}
                    onChange={(e) => setFormData({ ...formData, clientName: e.target.value })}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Billing Month / Period *</label>
                  <input
                    type="text"
                    className="admin-input"
                    placeholder="e.g. November 2026"
                    value={formData.billingMonth}
                    onChange={(e) => setFormData({ ...formData, billingMonth: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="form-grid-3">
                <div className="form-group">
                  <label className="form-label">Reference No / Bill Ref</label>
                  <input
                    type="text"
                    className="admin-input"
                    placeholder="e.g. INV-001 / ATT-01"
                    value={formData.referenceNo}
                    onChange={(e) => setFormData({ ...formData, referenceNo: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Date Created</label>
                  <input
                    type="date"
                    className="admin-input"
                    value={formData.dateCreated}
                    onChange={(e) => setFormData({ ...formData, dateCreated: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Billing Status</label>
                  <select
                    className="admin-select"
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  >
                    <option value="Pending Billing">Pending Billing</option>
                    <option value="Billed">Billed</option>
                  </select>
                </div>
              </div>

              {/* SECTION 1: MANPOWER INDIVIDUAL ATTENDANCE ROSTER */}
              <div className="form-section-heading line-items-header">
                <div>
                  <div className="section-step-tag">STEP 1: LOG INDIVIDUAL WORKER ATTENDANCE</div>
                  <span className="font-bold text-dark">Manpower Worker Attendance Roster</span>
                  <span className="text-muted text-xs ml-2">Click "Day-Wise Register" on any worker to toggle daily shifts</span>
                </div>
                <div className="header-preset-buttons">
                  <div className="view-toggle-pills mr-2">
                    <button
                      type="button"
                      className={`view-toggle-btn ${rosterViewMode === "table" ? "active" : ""}`}
                      onClick={() => setRosterViewMode("table")}
                    >
                      Worker List
                    </button>
                    <button
                      type="button"
                      className={`view-toggle-btn ${rosterViewMode === "matrix" ? "active" : ""}`}
                      onClick={() => setRosterViewMode("matrix")}
                    >
                      Day 1–{monthDaysCount} Matrix
                    </button>
                  </div>
                  <button type="button" className="btn btn-xs btn-primary" onClick={addWorkerRow}>
                    <Plus size={13} /> Add Worker
                  </button>
                </div>
              </div>

              {/* VIEW MODE 1: Standard Table with Direct Day-Wise Button */}
              {rosterViewMode === "table" ? (
                <div className="line-items-table-wrapper">
                  <table className="line-items-input-table">
                    <thead>
                      <tr>
                        <th style={{ width: "22%" }}>Worker Name</th>
                        <th style={{ width: "16%" }}>Trade Category</th>
                        <th style={{ width: "18%" }}>Day-Wise Attendance</th>
                        <th style={{ width: "10%" }}>Days</th>
                        <th style={{ width: "10%" }}>OT (Hrs)</th>
                        <th style={{ width: "11%" }}>Day Rate (₹)</th>
                        <th style={{ width: "9%" }} className="text-right">Total (₹)</th>
                        <th style={{ width: "4%" }}></th>
                      </tr>
                    </thead>
                    <tbody>
                      {formData.workers.map((w, idx) => (
                        <tr key={w.id || idx}>
                          <td>
                            <input
                              type="text"
                              className="admin-input input-sm"
                              placeholder="e.g. Ramesh Kumar"
                              value={w.name}
                              onChange={(e) => handleWorkerChange(idx, "name", e.target.value)}
                              required
                            />
                          </td>
                          <td>
                            <select
                              className="admin-select input-sm"
                              value={w.trade}
                              onChange={(e) => handleWorkerChange(idx, "trade", e.target.value)}
                            >
                              <option value="Electrician">Electrician</option>
                              <option value="Fitter">Fitter</option>
                              <option value="Welder">Welder</option>
                              <option value="Helper">Helper</option>
                              <option value="Senior Wiremen">Senior Wiremen</option>
                              <option value="Cable Tray Technicians">Cable Tray Technicians</option>
                              <option value="Industrial Riggers & Fitters">Industrial Riggers</option>
                              <option value="General Helpers & Assist">General Helpers</option>
                            </select>
                          </td>
                          <td>
                            <button
                              type="button"
                              className="btn-open-daily-log"
                              onClick={() => openDailyAttendanceModal(idx)}
                              title="Click to manage day-by-day attendance for this worker"
                            >
                              <Calendar size={13} />
                              <span>Log 1–{monthDaysCount} {formData.billingMonth.split(" ")[0]}</span>
                              <ChevronRight size={12} />
                            </button>
                          </td>
                          <td>
                            <input
                              type="number"
                              step="any"
                              className="admin-input input-sm font-semibold"
                              placeholder="Days"
                              value={w.daysWorked}
                              onChange={(e) => handleWorkerChange(idx, "daysWorked", e.target.value)}
                              required
                            />
                          </td>
                          <td>
                            <input
                              type="number"
                              step="any"
                              className="admin-input input-sm font-semibold"
                              placeholder="Hours"
                              value={w.otHours}
                              onChange={(e) => handleWorkerChange(idx, "otHours", e.target.value)}
                              required
                            />
                          </td>
                          <td>
                            <input
                              type="number"
                              step="any"
                              className="admin-input input-sm"
                              placeholder="Rate/Day"
                              value={w.dayRate}
                              onChange={(e) => handleWorkerChange(idx, "dayRate", e.target.value)}
                              required
                            />
                          </td>
                          <td className="text-right font-medium">
                            ₹{Number(w.totalAmount || 0).toLocaleString("en-IN", { maximumFractionDigits: 2 })}
                          </td>
                          <td>
                            {formData.workers.length > 1 && (
                              <button
                                type="button"
                                className="btn-trash-item"
                                onClick={() => removeWorkerRow(idx)}
                                title="Remove worker"
                              >
                                <X size={14} />
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                /* VIEW MODE 2: Full Site Daily Matrix (All Days 1..N) */
                <div className="site-matrix-wrapper">
                  <div className="matrix-instruction-banner">
                    <span>💡 Click any day box to cycle: <strong>P</strong> (Present) → <strong>HD</strong> (Half Day) → <strong>A</strong> (Absent) → <strong>WO</strong> (Off). Totals calculate instantly.</span>
                  </div>
                  <div className="table-responsive">
                    <table className="site-attendance-matrix-table">
                      <thead>
                        <tr>
                          <th className="sticky-col worker-name-col">Worker & Trade</th>
                          {daysArray.map((d) => (
                            <th key={d} className={`day-col-header ${d % 7 === 0 ? "sunday-col" : ""}`}>
                              <span>{d}</span>
                            </th>
                          ))}
                          <th className="sticky-col-right text-right">Days</th>
                          <th className="sticky-col-right text-right">OT</th>
                          <th className="sticky-col-right text-right">Wages (₹)</th>
                        </tr>
                      </thead>
                      <tbody>
                        {formData.workers.map((w, wIdx) => {
                          const daily = w.dailyAttendance || generateInitialDailyAttendance(Number(w.daysWorked) || 26, Number(w.otHours) || 0, monthDaysCount);
                          return (
                            <tr key={w.id || wIdx}>
                              <td className="sticky-col worker-name-cell">
                                <strong>{w.name || `Worker #${wIdx + 1}`}</strong>
                                <span className="cell-sub-text">{w.trade}</span>
                              </td>
                              {daysArray.map((d) => {
                                const entry = daily[d] || { status: "P", ot: 0 };
                                const st = entry.status;
                                return (
                                  <td
                                    key={d}
                                    className={`matrix-day-cell ${d % 7 === 0 ? "sunday-cell" : ""}`}
                                    onClick={() => handleMatrixCellToggle(wIdx, d)}
                                    title={`Day ${d}: ${st} ${entry.ot > 0 ? `(${entry.ot}h OT)` : ""}. Click to change`}
                                  >
                                    <span className={`matrix-status-pill status-${st.toLowerCase()}`}>
                                      {st}
                                    </span>
                                    {entry.ot > 0 && <span className="matrix-ot-badge">+{entry.ot}</span>}
                                  </td>
                                );
                              })}
                              <td className="sticky-col-right font-bold text-center">{w.daysWorked}</td>
                              <td className="sticky-col-right font-bold text-center text-amber">{w.otHours}</td>
                              <td className="sticky-col-right font-bold text-right">
                                ₹{Number(w.totalAmount || 0).toLocaleString("en-IN", { maximumFractionDigits: 0 })}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Roster Live Stats Banner */}
              <div className="roster-live-summary-bar">
                <div className="summary-pill">
                  <UserCheck size={14} className="text-cyan" />
                  <span>Workers: <strong>{formData.workers.length}</strong></span>
                </div>
                <div className="summary-pill">
                  <Users size={14} className="text-primary" />
                  <span>Man-Days: <strong>{workerTotalDays.toFixed(2)}</strong></span>
                </div>
                <div className="summary-pill">
                  <Clock size={14} className="text-amber" />
                  <span>Overtime: <strong>{workerTotalOT.toFixed(2)} Hrs</strong></span>
                </div>
                <div className="summary-pill ml-auto highlight-pill">
                  <span>Gross Worker Payout: <strong>₹{workerTotalPayout.toLocaleString("en-IN", { maximumFractionDigits: 2 })}</strong></span>
                </div>
              </div>

              {/* SECTION 2: AUTO-CALCULATED TRADE BREAKDOWN */}
              <div className="form-section-heading line-items-header mt-4">
                <div>
                  <div className="section-step-tag">STEP 2: CLIENT BILL SUMMARY</div>
                  <div className="d-flex align-items-center gap-2">
                    <span className="font-bold text-dark">Trade Breakdown (Days & Overtime)</span>
                    <span className="badge-auto-calc">
                      <Calculator size={12} /> Automatically Calculated from Day-Wise Attendance
                    </span>
                  </div>
                  <p className="text-muted text-xs mb-0">Quantities and bill amounts are automatically compiled from the workers entered above.</p>
                </div>
                <div className="header-preset-buttons">
                  <button
                    type="button"
                    className="btn btn-xs btn-outline-light mr-2"
                    onClick={recomputeFromWorkers}
                    title="Re-sync from workers roster"
                  >
                    <RotateCcw size={12} /> Re-Sync
                  </button>
                  <button type="button" className="btn btn-xs btn-outline-light" onClick={addTradeRow}>
                    <Plus size={12} /> Add Trade Row
                  </button>
                </div>
              </div>

              <div className="line-items-table-wrapper">
                <table className="line-items-input-table">
                  <thead>
                    <tr>
                      <th style={{ width: "38%" }}>Trade / Designation</th>
                      <th style={{ width: "15%" }}>Unit (Days/Hours)</th>
                      <th style={{ width: "15%" }}>Bill Qty (Auto-Summed)</th>
                      <th style={{ width: "15%" }}>Rate (₹)</th>
                      <th style={{ width: "15%" }}>Total Amount (₹)</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {formData.summaryByTrade.map((item, idx) => (
                      <tr key={idx}>
                        <td>
                          <input
                            type="text"
                            className="admin-input input-sm"
                            placeholder="e.g. Electrician (Days) or Electrician (OT)"
                            value={item.trade}
                            onChange={(e) => handleTradeChange(idx, "trade", e.target.value)}
                            required
                          />
                        </td>
                        <td>
                          <select
                            className="admin-select input-sm"
                            value={item.unit}
                            onChange={(e) => handleTradeChange(idx, "unit", e.target.value)}
                          >
                            <option value="Days">Days</option>
                            <option value="Hours">Hours</option>
                            <option value="Man-Months">Man-Months</option>
                          </select>
                        </td>
                        <td>
                          <input
                            type="number"
                            step="any"
                            className="admin-input input-sm font-semibold text-primary"
                            value={item.billQty}
                            onChange={(e) => handleTradeChange(idx, "billQty", e.target.value)}
                            required
                          />
                        </td>
                        <td>
                          <input
                            type="number"
                            step="any"
                            className="admin-input input-sm"
                            value={item.rate}
                            onChange={(e) => handleTradeChange(idx, "rate", e.target.value)}
                            required
                          />
                        </td>
                        <td className="text-right font-medium">
                          ₹{Number(item.amount || 0).toLocaleString("en-IN", { maximumFractionDigits: 2 })}
                        </td>
                        <td>
                          {formData.summaryByTrade.length > 1 && (
                            <button
                              type="button"
                              className="btn-trash-item"
                              onClick={() => removeTradeRow(idx)}
                              title="Remove trade"
                            >
                              <X size={14} />
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Total Summary */}
              <div className="attendance-calc-summary">
                <div className="calc-left-notes">
                  <div className="form-group">
                    <label className="form-label">Site Remarks / Engineer Verification</label>
                    <textarea
                      rows="2"
                      className="admin-textarea"
                      value={formData.notes}
                      onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    />
                  </div>
                </div>

                <div className="calc-right-breakdown">
                  <div className="breakdown-row grand-total-row">
                    <span>Total Manpower Bill:</span>
                    <strong className="grand-total-amount">
                      ₹{calculateTotal(formData.summaryByTrade).toLocaleString("en-IN", { maximumFractionDigits: 2 })}
                    </strong>
                  </div>
                  <div className="text-xs text-muted text-right">
                    Amount in words: {numberToWordsIndian(calculateTotal(formData.summaryByTrade))}
                  </div>
                </div>
              </div>

              {/* Modal Actions */}
              <div className="modal-footer-actions">
                <button type="button" className="btn btn-outline-light" onClick={() => setIsModalOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  {editingRecordId ? "Save Attendance Sheet" : "Save Record"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* SUB-MODAL: INDIVIDUAL WORKER DAY-WISE ATTENDANCE CALENDAR (1..30/31 DAYS) */}
      {activeWorkerForDaily && (
        <div className="modal-overlay sub-modal-overlay" onClick={() => setActiveWorkerIndexForDaily(null)}>
          <div className="admin-modal-card daily-attendance-card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div>
                <div className="section-step-tag">INDIVIDUAL WORKER DAILY REGISTER</div>
                <h2 className="modal-title">
                  {activeWorkerForDaily.name || `Worker #${activeWorkerIndexForDaily + 1}`} ({activeWorkerForDaily.trade})
                </h2>
                <p className="modal-subtitle">
                  Billing Period: <strong>{formData.billingMonth}</strong> (1 to {monthDaysCount} Days) • Day Rate: ₹{activeWorkerForDaily.dayRate} • OT Rate: ₹{activeWorkerForDaily.otRate}/hr
                </p>
              </div>
              <button className="modal-close-btn" onClick={() => setActiveWorkerIndexForDaily(null)}>
                <X size={20} />
              </button>
            </div>

            <div className="daily-modal-body">
              {/* Quick Actions Bar */}
              <div className="daily-quick-actions">
                <button type="button" className="btn btn-xs btn-outline-light" onClick={markAllDaysPresent}>
                  <Check size={13} /> Mark All Present (P)
                </button>
                <button type="button" className="btn btn-xs btn-outline-cyan" onClick={autoMarkSundaysOff}>
                  <Sun size={13} /> Set Sundays as Off (WO)
                </button>
                <div className="legend-strip ml-auto">
                  <span className="legend-item"><span className="legend-dot bg-emerald"></span> P = Full Day (1.0)</span>
                  <span className="legend-item"><span className="legend-dot bg-amber"></span> HD = Half Day (0.5)</span>
                  <span className="legend-item"><span className="legend-dot bg-danger"></span> A = Absent</span>
                  <span className="legend-item"><span className="legend-dot bg-gray"></span> WO = Weekly Off</span>
                </div>
              </div>

              {/* 30-Day Grid */}
              <div className="daily-grid-container">
                {daysArray.map((dayNum) => {
                  const entry = tempDailyAttendance[dayNum] || { status: "P", ot: 0 };
                  const isSunday = (dayNum % 7 === 0);

                  return (
                    <div
                      key={dayNum}
                      className={`day-card ${isSunday ? "sunday-card" : ""} status-box-${entry.status.toLowerCase()}`}
                    >
                      <div className="day-card-header">
                        <span className="day-num-tag">Day {dayNum < 10 ? `0${dayNum}` : dayNum}</span>
                        {isSunday && <span className="sunday-tag">Sun</span>}
                      </div>

                      <div className="day-card-body">
                        {/* Status Toggle Button */}
                        <button
                          type="button"
                          className={`day-status-btn btn-status-${entry.status.toLowerCase()}`}
                          onClick={() => handleDayStatusCycle(dayNum)}
                          title="Click to toggle: P -> HD -> A -> WO"
                        >
                          <strong>{entry.status}</strong>
                          <span className="status-label-sub">
                            {entry.status === "P" ? "Present" : entry.status === "HD" ? "Half Day" : entry.status === "A" ? "Absent" : "Off"}
                          </span>
                        </button>

                        {/* OT Hours Input */}
                        <div className="day-ot-input-row">
                          <label className="ot-label">OT Hrs:</label>
                          <input
                            type="number"
                            min="0"
                            max="24"
                            step="0.5"
                            className="day-ot-input"
                            value={entry.ot}
                            onChange={(e) => handleDayOtChange(dayNum, e.target.value)}
                            placeholder="0"
                          />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Live Recalculated Summary Banner */}
              <div className="daily-modal-summary-banner">
                <div className="calc-pill">
                  <span>Days Worked:</span>
                  <strong className="text-primary">{activeWorkerDailyComputed.daysWorked} Days</strong>
                </div>
                <div className="calc-pill">
                  <span>Overtime:</span>
                  <strong className="text-amber">{activeWorkerDailyComputed.otHours} Hours</strong>
                </div>
                <div className="calc-pill">
                  <span>Calculated Wages:</span>
                  <strong className="text-emerald">₹{activeWorkerDailyComputed.totalAmount.toLocaleString("en-IN", { maximumFractionDigits: 2 })}</strong>
                </div>
              </div>

              <div className="modal-footer-actions">
                <button type="button" className="btn btn-outline-light" onClick={() => setActiveWorkerIndexForDaily(null)}>
                  Cancel
                </button>
                <button type="button" className="btn btn-primary" onClick={saveDayWiseAttendance}>
                  Save & Apply to Attendance Sheet
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* PRINT-READY MAN POWER SUPPLY BILL & MUSTER ROLL MODAL */}
      {previewRecord && (
        <div className="modal-overlay print-preview-modal-overlay" onClick={() => setPreviewRecord(null)}>
          <div className="print-modal-container" onClick={(e) => e.stopPropagation()}>
            {/* Action Bar (hidden in browser print) */}
            <div className="print-action-bar no-print">
              <div className="print-title-info">
                <Printer size={18} />
                <span>
                  Print Preview: <strong>{previewRecord.siteName}</strong> ({previewRecord.billingMonth})
                </span>
              </div>
              <div className="print-action-buttons">
                {/* Preview View Selector */}
                <div className="preview-tab-selector mr-2">
                  <button
                    className={`preview-tab-btn ${previewTab === "bill" ? "active" : ""}`}
                    onClick={() => setPreviewTab("bill")}
                  >
                    <FileText size={13} /> Supply Bill
                  </button>
                  <button
                    className={`preview-tab-btn ${previewTab === "muster" ? "active" : ""}`}
                    onClick={() => setPreviewTab("muster")}
                  >
                    <Users size={13} /> Worker Muster Roll
                  </button>
                  <button
                    className={`preview-tab-btn ${previewTab === "both" ? "active" : ""}`}
                    onClick={() => setPreviewTab("both")}
                  >
                    Complete Dossier (Both)
                  </button>
                </div>

                {previewRecord.status !== "Billed" && (
                  <button
                    className="btn btn-secondary btn-sm"
                    onClick={() => {
                      convertAttendanceToInvoice(previewRecord.id);
                      setPreviewRecord(null);
                      setActiveAdminTab("quotations");
                    }}
                  >
                    <ArrowRightCircle size={14} /> To Invoice
                  </button>
                )}
                <button className="btn btn-primary btn-sm" onClick={handlePrint}>
                  <Printer size={15} /> Print / Save as PDF
                </button>
                <button className="btn btn-outline-light btn-sm" onClick={() => setPreviewRecord(null)}>
                  <X size={15} /> Close Preview
                </button>
              </div>
            </div>

            {/* DOCUMENT PAGE 1: MAN POWER SUPPLY BILL (Matches user's Irfan_new.XLSX_-_Sheet1_(1).pdf) */}
            {(previewTab === "bill" || previewTab === "both") && (
              <div className="a4-printable-sheet mb-4" id="attendance-printable-sheet">
                {/* Header Letterhead */}
                <div className="inv-sheet-header">
                  <div className="inv-header-brand">
                    <img
                      src="/Client logos/User Logo/eap-logo.png"
                      alt="Erphan Alam Enterprises"
                      className="inv-header-emblem"
                    />
                    <div>
                      <h1 className="inv-company-name">{settings.companyName || "ERPHAN ALAM ENTERPRISES"}</h1>
                      <p className="inv-company-subtitle">TECHNICAL MANPOWER SUPPLY & INDUSTRIAL SUBCONTRACTING</p>
                      <p className="inv-company-address">
                        {settings.address || "West Champaran, Bihar"}
                      </p>
                      <div className="inv-company-contacts">
                        <span>Phone: {settings.primaryPhone}{settings.secondaryPhone ? `, ${settings.secondaryPhone}` : ""}</span>
                        <span>Email: {settings.email}</span>
                      </div>
                    </div>
                  </div>
                  <div className="inv-header-tax-id">
                    {settings.gstin && (
                      <div className="tax-id-badge">
                        <strong>GSTIN:</strong> {settings.gstin}
                      </div>
                    )}
                    {settings.pan && (
                      <div className="tax-id-badge">
                        <strong>PAN:</strong> {settings.pan}
                      </div>
                    )}
                  </div>
                </div>

                {/* Title Ribbon */}
                <div className="inv-title-ribbon">
                  <h2>MAN POWER SUPPLY BILL</h2>
                </div>

                {/* Metadata Box */}
                <div className="inv-meta-grid">
                  <div className="inv-meta-col-left">
                    <div className="meta-block-title">Client & Contractor Details:</div>
                    <div className="meta-client-name"><strong>{previewRecord.clientName}</strong></div>
                    <div className="meta-client-row">
                      <strong>Project Site:</strong> {previewRecord.siteName}
                    </div>
                    <div className="meta-client-row">
                      <strong>Billing Period:</strong> {previewRecord.billingMonth}
                    </div>
                  </div>

                  <div className="inv-meta-col-right">
                    <table className="inv-meta-table">
                      <tbody>
                        <tr>
                          <td><strong>Bill / Ref No:</strong></td>
                          <td>{previewRecord.referenceNo || previewRecord.id}</td>
                        </tr>
                        <tr>
                          <td><strong>Date:</strong></td>
                          <td>{previewRecord.dateCreated}</td>
                        </tr>
                        <tr>
                          <td><strong>Contractor:</strong></td>
                          <td>Erphan Alam Enterprises</td>
                        </tr>
                        <tr>
                          <td><strong>Status:</strong></td>
                          <td>{previewRecord.status}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Trade Breakdown Table */}
                <table className="inv-items-table">
                  <thead>
                    <tr>
                      <th style={{ width: "8%" }} className="text-center">Sr. No</th>
                      <th style={{ width: "42%" }}>Trade / Category</th>
                      <th style={{ width: "12%" }} className="text-center">Unit</th>
                      <th style={{ width: "12%" }} className="text-right">Bill Qty</th>
                      <th style={{ width: "13%" }} className="text-right">Rate (₹)</th>
                      <th style={{ width: "13%" }} className="text-right">Total Amount (₹)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(previewRecord.summaryByTrade || []).map((row, idx) => (
                      <tr key={idx}>
                        <td className="text-center">{idx + 1}</td>
                        <td>
                          <strong>{row.trade}</strong>
                        </td>
                        <td className="text-center">{row.unit}</td>
                        <td className="text-right">{Number(row.billQty || 0).toFixed(2)}</td>
                        <td className="text-right">
                          {Number(row.rate || 0).toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </td>
                        <td className="text-right font-medium">
                          {Number(row.amount || 0).toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </td>
                      </tr>
                    ))}
                    <tr className="grand-total-row-highlight">
                      <td colSpan="5" className="text-right font-bold">Total Amount (₹):</td>
                      <td className="text-right font-bold">
                        ₹{Number(previewRecord.grandTotal || (previewRecord.summaryByTrade || []).reduce((s, r) => s + (Number(r.amount) || 0), 0)).toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </td>
                    </tr>
                  </tbody>
                </table>

                {/* Totals & Bank Details */}
                <div className="inv-totals-section">
                  <div className="inv-totals-left">
                    <div className="amount-in-words-box">
                      <span className="words-label">Amount in Words:</span>
                      <div className="words-content">
                        {numberToWordsIndian(previewRecord.grandTotal || (previewRecord.summaryByTrade || []).reduce((s, r) => s + (Number(r.amount) || 0), 0))}
                      </div>
                    </div>

                    {/* Bank Details */}
                    <div className="inv-bank-details-box">
                      <div className="bank-details-title">Contractor Bank Details:</div>
                      <table className="bank-details-table">
                        <tbody>
                          <tr>
                            <td><strong>Bank Name:</strong></td>
                            <td>{settings.bankDetails?.bankName || "HDFC Bank"}</td>
                          </tr>
                          <tr>
                            <td><strong>Account Beneficiary:</strong></td>
                            <td>{settings.bankDetails?.accountName || settings.companyName}</td>
                          </tr>
                          <tr>
                            <td><strong>Account No:</strong></td>
                            <td>{settings.bankDetails?.accountNumber || "-"}</td>
                          </tr>
                          <tr>
                            <td><strong>IFSC Code:</strong></td>
                            <td>{settings.bankDetails?.ifsc || "-"}</td>
                          </tr>
                          <tr>
                            <td><strong>Branch:</strong></td>
                            <td>{settings.bankDetails?.branch || "-"}</td>
                          </tr>
                          {settings.pan && (
                            <tr>
                              <td><strong>PAN:</strong></td>
                              <td>{settings.pan}</td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  <div className="inv-totals-right">
                    {/* Site Verification Remarks */}
                    <div className="attendance-notes-box">
                      <strong>Site Verification Note:</strong>
                      <p>{previewRecord.notes || "All manpower days & OT verified against project muster register."}</p>
                    </div>

                    {/* Authorized Signatory */}
                    <div className="inv-signature-block">
                      <p className="signatory-company">For ERPHAN ALAM ENTERPRISES</p>
                      <div className="signature-space"></div>
                      <p className="signatory-role">Authorized Signatory</p>
                    </div>
                  </div>
                </div>

                {/* Footer Declaration */}
                <div className="inv-terms-footer">
                  <p><strong>Declaration:</strong> Certified that the skilled and unskilled manpower listed above was deployed for project execution during the period stated and verified by client in-charge.</p>
                </div>
              </div>
            )}

            {/* DOCUMENT PAGE 2: WORKER ATTENDANCE MUSTER ROLL ANNEXURE */}
            {(previewTab === "muster" || previewTab === "both") && (
              <div className="a4-printable-sheet" id="muster-roll-printable-sheet">
                {/* Header Letterhead */}
                <div className="inv-sheet-header">
                  <div className="inv-header-brand">
                    <img
                      src="/Client logos/User Logo/eap-logo.png"
                      alt="Erphan Alam Enterprises"
                      className="inv-header-emblem"
                    />
                    <div>
                      <h1 className="inv-company-name">{settings.companyName || "ERPHAN ALAM ENTERPRISES"}</h1>
                      <p className="inv-company-subtitle">MANPOWER ATTENDANCE MUSTER ROLL & WAGE ANNEXURE</p>
                      <p className="inv-company-address">
                        {settings.address || "West Champaran, Bihar"}
                      </p>
                    </div>
                  </div>
                  <div className="inv-header-tax-id">
                    {settings.gstin && (
                      <div className="tax-id-badge">
                        <strong>GSTIN:</strong> {settings.gstin}
                      </div>
                    )}
                    <div className="tax-id-badge">
                      <strong>Ref:</strong> {previewRecord.referenceNo || previewRecord.id}
                    </div>
                  </div>
                </div>

                {/* Title Ribbon */}
                <div className="inv-title-ribbon bg-dark">
                  <h2>ANNEXURE-A: INDIVIDUAL WORKER ATTENDANCE LOG</h2>
                </div>

                {/* Site Metadata Bar */}
                <div className="muster-meta-strip">
                  <div><strong>Site / Project:</strong> {previewRecord.siteName}</div>
                  <div><strong>Client:</strong> {previewRecord.clientName}</div>
                  <div><strong>Month / Period:</strong> {previewRecord.billingMonth}</div>
                  <div><strong>Total Workers:</strong> {(previewRecord.workers || []).length}</div>
                </div>

                {/* Worker by Worker Table */}
                <table className="inv-items-table muster-roll-table">
                  <thead>
                    <tr>
                      <th style={{ width: "5%" }} className="text-center">Sr.</th>
                      <th style={{ width: "27%" }}>Worker Full Name</th>
                      <th style={{ width: "20%" }}>Trade / Skill</th>
                      <th style={{ width: "10%" }} className="text-center">Days</th>
                      <th style={{ width: "10%" }} className="text-center">OT Hrs</th>
                      <th style={{ width: "12%" }} className="text-right">Shift Rate (₹)</th>
                      <th style={{ width: "16%" }} className="text-right">Total Payout (₹)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(previewRecord.workers || []).map((w, idx) => (
                      <tr key={idx}>
                        <td className="text-center">{idx + 1}</td>
                        <td>
                          <strong>{w.name || `Worker #${idx + 1}`}</strong>
                        </td>
                        <td>{w.trade}</td>
                        <td className="text-center">{Number(w.daysWorked || 0).toFixed(1)}</td>
                        <td className="text-center">{Number(w.otHours || 0).toFixed(1)}</td>
                        <td className="text-right">₹{Number(w.dayRate || 0).toLocaleString("en-IN")}</td>
                        <td className="text-right font-medium">
                          ₹{Number(w.totalAmount || (Number(w.daysWorked) * Number(w.dayRate) + Number(w.otHours) * Number(w.otRate))).toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </td>
                      </tr>
                    ))}
                    <tr className="grand-total-row-highlight">
                      <td colSpan="3" className="text-right font-bold">Muster Roll Totals:</td>
                      <td className="text-center font-bold">
                        {(previewRecord.workers || []).reduce((s, w) => s + (Number(w.daysWorked) || 0), 0).toFixed(1)}
                      </td>
                      <td className="text-center font-bold">
                        {(previewRecord.workers || []).reduce((s, w) => s + (Number(w.otHours) || 0), 0).toFixed(1)}
                      </td>
                      <td className="text-right font-bold">-</td>
                      <td className="text-right font-bold">
                        ₹{(previewRecord.workers || []).reduce((s, w) => s + (Number(w.totalAmount) || (Number(w.daysWorked) * Number(w.dayRate) + Number(w.otHours) * Number(w.otRate))), 0).toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </td>
                    </tr>
                  </tbody>
                </table>

                {/* Double Signature Block for Audit */}
                <div className="muster-sign-grid">
                  <div className="muster-sign-box">
                    <p className="muster-sign-title">Prepared & Submitted By:</p>
                    <p className="muster-sign-name">For ERPHAN ALAM ENTERPRISES</p>
                    <div className="muster-sign-space"></div>
                    <p className="muster-sign-role">Authorized Signatory</p>
                  </div>
                  <div className="muster-sign-box text-right">
                    <p className="muster-sign-title">Verified & Certified By:</p>
                    <p className="muster-sign-name">{previewRecord.clientName || "Client Representative"}</p>
                    <div className="muster-sign-space"></div>
                    <p className="muster-sign-role">Authorized Signatory</p>
                  </div>
                </div>

                <div className="inv-terms-footer mt-auto">
                  <p className="text-center text-xs text-muted">
                    This attendance annexure forms an integral part of Tax Invoice / Manpower Supply Bill {previewRecord.referenceNo || previewRecord.id}.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
