import React, { useState } from "react";
import { useApp } from "../context/AppContext";
import { numberToWordsIndian } from "../utils/numberToWords";
import {
  FileText,
  Plus,
  Search,
  Filter,
  Printer,
  Edit3,
  Trash2,
  CheckCircle2,
  Clock,
  X,
  DollarSign
} from "lucide-react";

export const InvoicesManager = () => {
  const { invoices, addInvoice, updateInvoice, deleteInvoice, getNextSequentialId, settings } = useApp();

  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all"); // 'all' | 'Tax Invoice' | 'Official Quotation'
  const [filterStatus, setFilterStatus] = useState("all");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingInvoiceId, setEditingInvoiceId] = useState(null);
  const [previewInvoice, setPreviewInvoice] = useState(null);

  // Initial Form State
  const getInitialFormState = () => ({
    type: "Tax Invoice",
    invoiceNumber: "",
    date: new Date().toISOString().split("T")[0],
    dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
    status: "Sent",
    clientName: "",
    clientAddress: "",
    clientGst: "",
    clientPhone: "",
    clientEmail: "",
    projectName: "",
    workOrderNo: "",
    workOrderDate: new Date().toISOString().split("T")[0],
    srnDocNo: "",
    srnDate: new Date().toISOString().split("T")[0],
    srnId: "",
    taxType: "IGST",
    taxRate: 18,
    items: [
      { id: 1, hsnSac: "998517", description: "Technical Manpower Deployment / Technical Services", unit: "Days", qty: 1, rate: 0, amount: 0 }
    ],
    notes: "Payment due within 30 days of invoice receipt. Please deposit directly to company bank account."
  });

  const [formData, setFormData] = useState(getInitialFormState);

  // Filtered Invoices
  const filteredInvoices = (invoices || []).filter((inv) => {
    const matchesSearch =
      (inv.invoiceNumber || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (inv.clientName || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (inv.projectName || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (inv.workOrderNo || "").toLowerCase().includes(searchTerm.toLowerCase());

    const matchesType = filterType === "all" || inv.type === filterType;
    const matchesStatus = filterStatus === "all" || inv.status === filterStatus;

    return matchesSearch && matchesType && matchesStatus;
  });

  // KPI Calculations
  const totalBilledValue = (invoices || []).reduce((sum, inv) => sum + (Number(inv.grandTotal) || 0), 0);
  const totalPaidValue = (invoices || [])
    .filter((inv) => inv.status === "Paid")
    .reduce((sum, inv) => sum + (Number(inv.grandTotal) || 0), 0);
  const totalPendingValue = (invoices || [])
    .filter((inv) => inv.status === "Sent" || inv.status === "Pending")
    .reduce((sum, inv) => sum + (Number(inv.grandTotal) || 0), 0);

  // Calculations for Form Items
  const calculateSubtotal = (items) => {
    return items.reduce((sum, item) => sum + (Number(item.amount) || 0), 0);
  };

  const handleItemChange = (index, field, value) => {
    const updatedItems = [...formData.items];
    const currentItem = { ...updatedItems[index], [field]: value };

    if (field === "qty" || field === "rate") {
      const q = field === "qty" ? Number(value) || 0 : Number(currentItem.qty) || 0;
      const r = field === "rate" ? Number(value) || 0 : Number(currentItem.rate) || 0;
      currentItem.amount = Number((q * r).toFixed(2));
    }

    updatedItems[index] = currentItem;
    setFormData({ ...formData, items: updatedItems });
  };

  const addItemRow = () => {
    setFormData({
      ...formData,
      items: [
        ...formData.items,
        {
          id: Date.now(),
          hsnSac: "998517",
          description: "",
          unit: "Days",
          qty: 1,
          rate: 0,
          amount: 0
        }
      ]
    });
  };

  const removeItemRow = (index) => {
    if (formData.items.length <= 1) return;
    const updatedItems = formData.items.filter((_, idx) => idx !== index);
    setFormData({ ...formData, items: updatedItems });
  };

  const openCreateModal = (docType = "Official Quotation") => {
    setEditingInvoiceId(null);
    const isQuotation = docType === "Official Quotation";
    const prefix = isQuotation ? "QT-" : "INV-";
    const targetInvoices = (invoices || []).filter(
      (inv) => (inv.type === "Official Quotation") === isQuotation
    );
    const nextNum = getNextSequentialId(targetInvoices, prefix, "invoiceNumber", 3);
    setFormData({
      ...getInitialFormState(),
      type: docType,
      invoiceNumber: nextNum
    });
    setIsModalOpen(true);
  };

  const openEditModal = (inv) => {
    setEditingInvoiceId(inv.id);
    const defaultState = getInitialFormState();
    setFormData({
      type: inv.type || "Tax Invoice",
      invoiceNumber: inv.invoiceNumber || inv.id,
      date: inv.date || "",
      dueDate: inv.dueDate || "",
      status: inv.status || "Sent",
      clientName: inv.clientName || "",
      clientAddress: inv.clientAddress || "",
      clientGst: inv.clientGst || "",
      clientPhone: inv.clientPhone || "",
      clientEmail: inv.clientEmail || "",
      projectName: inv.projectName || "",
      workOrderNo: inv.workOrderNo || "",
      workOrderDate: inv.workOrderDate || "",
      srnDocNo: inv.srnDocNo || "",
      srnDate: inv.srnDate || "",
      srnId: inv.srnId || "",
      taxType: inv.taxType || "IGST",
      taxRate: inv.taxRate || 18,
      items: inv.items && inv.items.length > 0 ? inv.items : defaultState.items,
      notes: inv.notes || defaultState.notes
    });
    setIsModalOpen(true);
  };

  const handleSaveInvoice = (e) => {
    e.preventDefault();
    const subtotal = calculateSubtotal(formData.items);
    const taxRate = Number(formData.taxRate) || 18;
    const taxAmount = Number(((subtotal * taxRate) / 100).toFixed(2));
    const grandTotal = Number((subtotal + taxAmount).toFixed(2));

    const invoicePayload = {
      ...formData,
      subtotal,
      taxAmount,
      grandTotal
    };

    if (editingInvoiceId) {
      updateInvoice(editingInvoiceId, invoicePayload);
    } else {
      addInvoice(invoicePayload);
    }

    setIsModalOpen(false);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="invoices-manager-container">
      {/* Top Header */}
      <div className="admin-content-header">
        <div>
          <h1 className="admin-page-title">Quotations & Invoices</h1>
          <p className="admin-page-subtitle">
            Create, manage and export GST-compliant Tax Invoices and Quotations with print-ready A4 PDF layout.
          </p>
        </div>
        <div className="header-actions">
          <button className="btn btn-primary" onClick={() => openCreateModal("Official Quotation")}>
            <Plus size={15} />
            <span className="text-full">New Quotation</span>
            <span className="text-mobile">Quotation</span>
          </button>
          <button className="btn btn-outline-light" onClick={() => openCreateModal("Tax Invoice")}>
            <Plus size={15} />
            <span className="text-full">New Tax Invoice</span>
            <span className="text-mobile">Tax Invoice</span>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="admin-kpi-grid">
        <div className="kpi-card">
          <div className="kpi-card-header">
            <span className="kpi-label">Total Documents</span>
            <span className="kpi-icon-badge bg-blue-subtle text-primary">
              <FileText size={18} />
            </span>
          </div>
          <div className="kpi-number">{invoices.length}</div>
          <div className="kpi-footer text-muted">Invoices & Quotations active</div>
        </div>

        <div className="kpi-card">
          <div className="kpi-card-header">
            <span className="kpi-label">Total Billed Value</span>
            <span className="kpi-icon-badge bg-cyan-subtle text-cyan">
              <DollarSign size={18} />
            </span>
          </div>
          <div className="kpi-number">₹{totalBilledValue.toLocaleString("en-IN", { maximumFractionDigits: 2 })}</div>
          <div className="kpi-footer text-muted">Across all commercial projects</div>
        </div>

        <div className="kpi-card">
          <div className="kpi-card-header">
            <span className="kpi-label">Received / Paid</span>
            <span className="kpi-icon-badge bg-emerald-subtle text-emerald">
              <CheckCircle2 size={18} />
            </span>
          </div>
          <div className="kpi-number text-emerald">₹{totalPaidValue.toLocaleString("en-IN", { maximumFractionDigits: 2 })}</div>
          <div className="kpi-footer text-muted">Cleared in HDFC Account</div>
        </div>

        <div className="kpi-card">
          <div className="kpi-card-header">
            <span className="kpi-label">Pending Collection</span>
            <span className="kpi-icon-badge bg-amber-subtle text-amber">
              <Clock size={18} />
            </span>
          </div>
          <div className="kpi-number text-amber">₹{totalPendingValue.toLocaleString("en-IN", { maximumFractionDigits: 2 })}</div>
          <div className="kpi-footer text-muted">Payment awaited from clients</div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="admin-card mb-3 filter-toolbar-card">
        <div className="filter-bar-grid">
          <div className="search-input-wrapper">
            <Search size={16} className="search-icon" />
            <input
              type="text"
              placeholder="Search by Invoice #, client, project..."
              className="admin-input search-input"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="filter-selectors">
            <div className="filter-select-group">
              <select
                className="admin-select"
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
              >
                <option value="all">All Document Types</option>
                <option value="Tax Invoice">Tax Invoices</option>
                <option value="Official Quotation">Official Quotations</option>
              </select>
            </div>

            <div className="filter-select-group">
              <select
                className="admin-select"
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
              >
                <option value="all">All Statuses</option>
                <option value="Paid">Paid</option>
                <option value="Sent">Sent</option>
                <option value="Pending">Pending</option>
                <option value="Draft">Draft</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Invoices List Table */}
      <div className="admin-card table-data-card">
        <div className="table-responsive">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Document #</th>
                <th>Type</th>
                <th>Date / Due</th>
                <th>Client Name & Site</th>
                <th>Work Order / SRN</th>
                <th>Taxable Subtotal</th>
                <th>Grand Total (₹)</th>
                <th>Status</th>
                <th className="text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredInvoices.length === 0 ? (
                <tr>
                  <td colSpan="9" className="text-center py-5 text-muted">
                    <FileText size={40} className="mb-2 opacity-50" />
                    <p>No invoices or quotations match your search criteria.</p>
                  </td>
                </tr>
              ) : (
                filteredInvoices.map((inv) => (
                  <tr key={inv.id}>
                    <td>
                      <div className="font-semibold text-primary">{inv.invoiceNumber || inv.id}</div>
                    </td>
                    <td>
                      <span className={`badge-pill ${inv.type === "Official Quotation" ? "badge-amber" : "badge-blue"}`}>
                        {inv.type || "Tax Invoice"}
                      </span>
                    </td>
                    <td>
                      <div className="cell-main-text">{inv.date}</div>
                      <div className="cell-sub-text">Due: {inv.dueDate || "N/A"}</div>
                    </td>
                    <td>
                      <div className="cell-main-text font-medium">{inv.clientName}</div>
                      <div className="cell-sub-text">{inv.projectName || "Standard Site"}</div>
                    </td>
                    <td>
                      <div className="cell-main-text">{inv.workOrderNo || "-"}</div>
                      {inv.srnDocNo && inv.srnDocNo !== "-" && (
                        <div className="cell-sub-text">SRN: {inv.srnDocNo}</div>
                      )}
                    </td>
                    <td>₹{Number(inv.subtotal || 0).toLocaleString("en-IN", { maximumFractionDigits: 2 })}</td>
                    <td>
                      <div className="font-bold text-dark">
                        ₹{Number(inv.grandTotal || 0).toLocaleString("en-IN", { maximumFractionDigits: 2 })}
                      </div>
                      <div className="cell-sub-text">Incl. {inv.taxRate || 18}% {inv.taxType || "IGST"}</div>
                    </td>
                    <td>
                      <span
                        className={`status-pill ${
                          inv.status === "Paid"
                            ? "status-paid"
                            : inv.status === "Sent"
                            ? "status-sent"
                            : inv.status === "Pending"
                            ? "status-pending"
                            : "status-draft"
                        }`}
                      >
                        {inv.status}
                      </span>
                    </td>
                    <td className="text-right">
                      <div className="action-buttons-group">
                        <button
                          className="btn-action-icon text-cyan"
                          title="Print / Save PDF"
                          onClick={() => setPreviewInvoice(inv)}
                        >
                          <Printer size={16} />
                        </button>
                        <button
                          className="btn-action-icon text-primary"
                          title="Edit Document"
                          onClick={() => openEditModal(inv)}
                        >
                          <Edit3 size={16} />
                        </button>
                        <button
                          className="btn-action-icon text-danger"
                          title="Delete Document"
                          onClick={() => {
                            if (window.confirm(`Are you sure you want to delete ${inv.invoiceNumber || inv.id}?`)) {
                              deleteInvoice(inv.id);
                            }
                          }}
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* CREATE / EDIT MODAL */}
      {isModalOpen && (
        <div className="modal-overlay" onClick={() => setIsModalOpen(false)}>
          <div className="admin-modal-card modal-lg" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div>
                <h2 className="modal-title">
                  {editingInvoiceId
                    ? `Edit ${formData.type}`
                    : formData.type === "Official Quotation"
                    ? "New Official Quotation"
                    : "New Tax Invoice"}
                </h2>
                <p className="modal-subtitle">
                  Fill in client billing information, work orders, and trade / material line items.
                </p>
              </div>
              <button className="modal-close-btn" onClick={() => setIsModalOpen(false)}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSaveInvoice} className="modal-body-form">
              {/* Document Type & Reference */}
              <div className="form-grid-3">
                <div className="form-group">
                  <label className="form-label">Document Type *</label>
                  <select
                    className="admin-select"
                    value={formData.type}
                    onChange={(e) => {
                      const newType = e.target.value;
                      let updatedNum = formData.invoiceNumber;
                      if (!editingInvoiceId) {
                        const isQuot = newType === "Official Quotation";
                        const prefix = isQuot ? "QT-" : "INV-";
                        const targetInvoices = (invoices || []).filter(
                          (inv) => (inv.type === "Official Quotation") === isQuot
                        );
                        updatedNum = getNextSequentialId(targetInvoices, prefix, "invoiceNumber", 3);
                      }
                      setFormData({ ...formData, type: newType, invoiceNumber: updatedNum });
                    }}
                  >
                    <option value="Tax Invoice">Tax Invoice</option>
                    <option value="Official Quotation">Official Quotation</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Document Number *</label>
                  <input
                    type="text"
                    className="admin-input"
                    placeholder="e.g. INV-001 / QT-001"
                    value={formData.invoiceNumber}
                    onChange={(e) => setFormData({ ...formData, invoiceNumber: e.target.value })}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Document Status</label>
                  <select
                    className="admin-select"
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  >
                    <option value="Sent">Sent / Issued</option>
                    <option value="Pending">Pending Collection</option>
                    <option value="Paid">Paid / Cleared</option>
                    <option value="Draft">Draft</option>
                  </select>
                </div>
              </div>

              {/* Dates */}
              <div className="form-grid-2">
                <div className="form-group">
                  <label className="form-label">Issue Date *</label>
                  <input
                    type="date"
                    className="admin-input"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Payment Due Date</label>
                  <input
                    type="date"
                    className="admin-input"
                    value={formData.dueDate}
                    onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                  />
                </div>
              </div>

              {/* Client Information */}
              <div className="form-section-heading">Client & Project Details</div>
              <div className="form-grid-2">
                <div className="form-group">
                  <label className="form-label">Client / Company Name *</label>
                  <input
                    type="text"
                    className="admin-input"
                    placeholder="e.g. VK Building Services Pvt Ltd, Bengaluru"
                    value={formData.clientName}
                    onChange={(e) => setFormData({ ...formData, clientName: e.target.value })}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Client GSTIN / UIN</label>
                  <input
                    type="text"
                    className="admin-input"
                    placeholder="e.g. 29AABCV7295G1Z5"
                    value={formData.clientGst}
                    onChange={(e) => setFormData({ ...formData, clientGst: e.target.value })}
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Client Full Address</label>
                <input
                  type="text"
                  className="admin-input"
                  placeholder="Street, Industrial Area, City, State & PIN"
                  value={formData.clientAddress}
                  onChange={(e) => setFormData({ ...formData, clientAddress: e.target.value })}
                />
              </div>

              <div className="form-grid-3">
                <div className="form-group">
                  <label className="form-label">Project / Site Name *</label>
                  <input
                    type="text"
                    className="admin-input"
                    placeholder="e.g. ITC PHASE 2 Building 3"
                    value={formData.projectName}
                    onChange={(e) => setFormData({ ...formData, projectName: e.target.value })}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Work Order / PO Number</label>
                  <input
                    type="text"
                    className="admin-input"
                    placeholder="e.g. 4800009166"
                    value={formData.workOrderNo}
                    onChange={(e) => setFormData({ ...formData, workOrderNo: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">SRN Document No / ID</label>
                  <input
                    type="text"
                    className="admin-input"
                    placeholder="e.g. 1000018639"
                    value={formData.srnDocNo}
                    onChange={(e) => setFormData({ ...formData, srnDocNo: e.target.value })}
                  />
                </div>
              </div>

              {/* Line Items */}
              <div className="form-section-heading line-items-header">
                <span>Line Items (Goods & Services)</span>
                <button type="button" className="btn btn-sm btn-outline-light" onClick={addItemRow}>
                  <Plus size={14} /> Add Line Item
                </button>
              </div>

              <div className="line-items-table-wrapper">
                <table className="line-items-input-table">
                  <thead>
                    <tr>
                      <th style={{ width: "35%" }}>Description of Goods / Services</th>
                      <th style={{ width: "15%" }}>HSN / SAC</th>
                      <th style={{ width: "12%" }}>Unit</th>
                      <th style={{ width: "12%" }}>Qty</th>
                      <th style={{ width: "13%" }}>Rate (₹)</th>
                      <th style={{ width: "13%" }}>Amount (₹)</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {formData.items.map((item, idx) => (
                      <tr key={item.id || idx}>
                        <td>
                          <input
                            type="text"
                            className="admin-input input-sm"
                            placeholder="Description"
                            value={item.description}
                            onChange={(e) => handleItemChange(idx, "description", e.target.value)}
                            required
                          />
                        </td>
                        <td>
                          <input
                            type="text"
                            className="admin-input input-sm"
                            placeholder="SAC/HSN"
                            value={item.hsnSac}
                            onChange={(e) => handleItemChange(idx, "hsnSac", e.target.value)}
                          />
                        </td>
                        <td>
                          <input
                            type="text"
                            className="admin-input input-sm"
                            placeholder="Nos/Days"
                            value={item.unit}
                            onChange={(e) => handleItemChange(idx, "unit", e.target.value)}
                          />
                        </td>
                        <td>
                          <input
                            type="number"
                            step="any"
                            className="admin-input input-sm"
                            value={item.qty}
                            onChange={(e) => handleItemChange(idx, "qty", e.target.value)}
                            required
                          />
                        </td>
                        <td>
                          <input
                            type="number"
                            step="any"
                            className="admin-input input-sm"
                            value={item.rate}
                            onChange={(e) => handleItemChange(idx, "rate", e.target.value)}
                            required
                          />
                        </td>
                        <td className="text-right font-medium">
                          ₹{Number(item.amount || 0).toLocaleString("en-IN", { maximumFractionDigits: 2 })}
                        </td>
                        <td>
                          {formData.items.length > 1 && (
                            <button
                              type="button"
                              className="btn-trash-item"
                              onClick={() => removeItemRow(idx)}
                              title="Remove item"
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

              {/* Tax & Total Summary */}
              <div className="invoice-calc-summary-grid">
                <div className="calc-left-notes">
                  <div className="form-group">
                    <label className="form-label">Payment Terms & Notes</label>
                    <textarea
                      rows="3"
                      className="admin-textarea"
                      value={formData.notes}
                      onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    />
                  </div>
                </div>

                <div className="calc-right-breakdown">
                  <div className="breakdown-row">
                    <span>Taxable Subtotal:</span>
                    <strong>₹{calculateSubtotal(formData.items).toLocaleString("en-IN", { maximumFractionDigits: 2 })}</strong>
                  </div>

                  <div className="breakdown-row-tax-select">
                    <div className="tax-type-toggle">
                      <label className="radio-label">
                        <input
                          type="radio"
                          name="taxType"
                          value="IGST"
                          checked={formData.taxType === "IGST"}
                          onChange={() => setFormData({ ...formData, taxType: "IGST" })}
                        />
                        IGST (18%)
                      </label>
                      <label className="radio-label">
                        <input
                          type="radio"
                          name="taxType"
                          value="CGST_SGST"
                          checked={formData.taxType === "CGST_SGST"}
                          onChange={() => setFormData({ ...formData, taxType: "CGST_SGST" })}
                        />
                        CGST (9%) + SGST (9%)
                      </label>
                    </div>
                  </div>

                  <div className="breakdown-row">
                    <span>GST ({formData.taxType === "IGST" ? "18% IGST" : "9% CGST + 9% SGST"}):</span>
                    <span>
                      ₹{((calculateSubtotal(formData.items) * (Number(formData.taxRate) || 18)) / 100).toLocaleString("en-IN", { maximumFractionDigits: 2 })}
                    </span>
                  </div>

                  <div className="breakdown-row grand-total-row">
                    <span>Grand Total:</span>
                    <strong className="grand-total-amount">
                      ₹{(calculateSubtotal(formData.items) * (1 + (Number(formData.taxRate) || 18) / 100)).toLocaleString("en-IN", { maximumFractionDigits: 2 })}
                    </strong>
                  </div>
                </div>
              </div>

              {/* Modal Actions */}
              <div className="modal-footer-actions">
                <button type="button" className="btn btn-outline-light" onClick={() => setIsModalOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  {editingInvoiceId ? "Save Changes" : "Create Document"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* PRINT-READY A4 PREVIEW MODAL */}
      {previewInvoice && (
        <div className="modal-overlay print-preview-modal-overlay" onClick={() => setPreviewInvoice(null)}>
          <div className="print-modal-container" onClick={(e) => e.stopPropagation()}>
            {/* Action Bar (hidden during browser window.print()) */}
            <div className="print-action-bar no-print">
              <div className="print-title-info">
                <Printer size={18} />
                <span>
                  Print Preview: <strong>{previewInvoice.invoiceNumber || previewInvoice.id}</strong> ({previewInvoice.type})
                </span>
              </div>
              <div className="print-action-buttons">
                <button className="btn btn-primary btn-sm" onClick={handlePrint}>
                  <Printer size={15} /> Print / Save as PDF
                </button>
                <button className="btn btn-outline-light btn-sm" onClick={() => setPreviewInvoice(null)}>
                  <X size={15} /> Close Preview
                </button>
              </div>
            </div>

            {/* A4 Document Sheet (Matches user's authentic invoice.pdf) */}
            <div className="a4-printable-sheet" id="invoice-printable-sheet">
              {/* Company Header with Logo */}
              <div className="inv-sheet-header">
                <div className="inv-header-brand">
                  <img
                    src="/Client logos/User Logo/eap-logo.png"
                    alt="Erphan Alam Enterprises"
                    className="inv-header-emblem"
                  />
                  <div>
                    <h1 className="inv-company-name">{settings.companyName || "ERPHAN ALAM ENTERPRISES"}</h1>
                    <p className="inv-company-subtitle">CONTRACTING • HEAVY FABRICATION • INDUSTRIAL SERVICES</p>
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
                <h2>{previewInvoice.type ? previewInvoice.type.toUpperCase() : "TAX INVOICE"}</h2>
              </div>

              {/* Two-Column Metadata Box */}
              <div className="inv-meta-grid">
                <div className="inv-meta-col-left">
                  <div className="meta-block-title">Details of Receiver / Billed To:</div>
                  <div className="meta-client-name"><strong>{previewInvoice.clientName}</strong></div>
                  <div className="meta-client-addr">{previewInvoice.clientAddress || "Client Registered Address"}</div>
                  <div className="meta-client-row">
                    <strong>GSTIN:</strong> {previewInvoice.clientGst || "N/A"}
                  </div>
                  <div className="meta-client-row">
                    <strong>Project / Site:</strong> {previewInvoice.projectName}
                  </div>
                </div>

                <div className="inv-meta-col-right">
                  <table className="inv-meta-table">
                    <tbody>
                      <tr>
                        <td><strong>Invoice No:</strong></td>
                        <td>{previewInvoice.invoiceNumber || previewInvoice.id}</td>
                      </tr>
                      <tr>
                        <td><strong>Date:</strong></td>
                        <td>{previewInvoice.date}</td>
                      </tr>
                      <tr>
                        <td><strong>Work Order No:</strong></td>
                        <td>{previewInvoice.workOrderNo || "N/A"}</td>
                      </tr>
                      <tr>
                        <td><strong>W.O. Date:</strong></td>
                        <td>{previewInvoice.workOrderDate || previewInvoice.date}</td>
                      </tr>
                      {previewInvoice.srnDocNo && (
                        <tr>
                          <td><strong>SRN Doc No:</strong></td>
                          <td>{previewInvoice.srnDocNo}</td>
                        </tr>
                      )}
                      <tr>
                        <td><strong>Reverse Charge:</strong></td>
                        <td>No</td>
                      </tr>
                      <tr>
                        <td><strong>Place of Supply:</strong></td>
                        <td>{previewInvoice.taxType === "IGST" ? "Inter-State (IGST 18%)" : "Intra-State (CGST+SGST)"}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Line Items Table */}
              <table className="inv-items-table">
                <thead>
                  <tr>
                    <th style={{ width: "5%" }}>#</th>
                    <th style={{ width: "45%" }}>Description of Goods / Services</th>
                    <th style={{ width: "12%" }}>HSN / SAC</th>
                    <th style={{ width: "8%" }}>Unit</th>
                    <th style={{ width: "8%" }}>Qty</th>
                    <th style={{ width: "11%" }} className="text-right">Rate (₹)</th>
                    <th style={{ width: "11%" }} className="text-right">Amount (₹)</th>
                  </tr>
                </thead>
                <tbody>
                  {(previewInvoice.items || []).map((item, idx) => (
                    <tr key={idx}>
                      <td className="text-center">{idx + 1}</td>
                      <td>
                        <strong>{item.description}</strong>
                      </td>
                      <td>{item.hsnSac || "998517"}</td>
                      <td>{item.unit || "Nos"}</td>
                      <td className="text-center">{item.qty}</td>
                      <td className="text-right">
                        {Number(item.rate || 0).toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </td>
                      <td className="text-right font-medium">
                        {Number(item.amount || 0).toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Totals & Tax Calculation Breakdown */}
              <div className="inv-totals-section">
                <div className="inv-totals-left">
                  <div className="amount-in-words-box">
                    <span className="words-label">Amount in Words:</span>
                    <div className="words-content">
                      {numberToWordsIndian(previewInvoice.grandTotal)}
                    </div>
                  </div>

                  {/* Bank Details Box */}
                  <div className="inv-bank-details-box">
                    <div className="bank-details-title">Company Bank Details for RTGS / NEFT:</div>
                    <table className="bank-details-table">
                      <tbody>
                        <tr>
                          <td><strong>Bank Name:</strong></td>
                          <td>{settings.bankDetails?.bankName || "HDFC Bank"}</td>
                        </tr>
                        <tr>
                          <td><strong>Account Name:</strong></td>
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
                      </tbody>
                    </table>
                  </div>
                </div>

                <div className="inv-totals-right">
                  <table className="inv-summary-table">
                    <tbody>
                      <tr>
                        <td>Subtotal (Taxable Value):</td>
                        <td className="text-right">
                          ₹{Number(previewInvoice.subtotal || 0).toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </td>
                      </tr>
                      {previewInvoice.taxType === "CGST_SGST" ? (
                        <>
                          <tr>
                            <td>CGST @ 9%:</td>
                            <td className="text-right">
                              ₹{(Number(previewInvoice.taxAmount || 0) / 2).toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                            </td>
                          </tr>
                          <tr>
                            <td>SGST @ 9%:</td>
                            <td className="text-right">
                              ₹{(Number(previewInvoice.taxAmount || 0) / 2).toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                            </td>
                          </tr>
                        </>
                      ) : (
                        <tr>
                          <td>IGST @ {previewInvoice.taxRate || 18}%:</td>
                          <td className="text-right">
                            ₹{Number(previewInvoice.taxAmount || 0).toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                          </td>
                        </tr>
                      )}
                      <tr className="grand-total-row-highlight">
                        <td><strong>Grand Total (INR):</strong></td>
                        <td className="text-right">
                          <strong>₹{Number(previewInvoice.grandTotal || 0).toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</strong>
                        </td>
                      </tr>
                    </tbody>
                  </table>

                  {/* Authorized Signatory */}
                  <div className="inv-signature-block">
                    <p className="signatory-company">For ERPHAN ALAM ENTERPRISES</p>
                    <div className="signature-space"></div>
                    <p className="signatory-role">Authorized Signatory</p>
                  </div>
                </div>
              </div>

              {/* Terms and Footer */}
              <div className="inv-terms-footer">
                <p><strong>Terms & Conditions:</strong> 1. Goods/Services once supplied cannot be taken back. 2. Interest @ 18% p.a. will be charged if payment is delayed beyond agreed tenure. 3. Subject to Bettiah / West Champaran jurisdiction.</p>
                <p className="text-center mt-1 text-muted text-xs">This is a computer generated invoice authorized by Erphan Alam Enterprises.</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
