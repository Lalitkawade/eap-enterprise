import React, { useState } from "react";
import { useApp } from "../context/AppContext";
import {
  Search,
  Download,
  Phone,
  MessageCircle,
  Trash2,
  Eye,
  X,
  MapPin
} from "lucide-react";

export const InquiriesManager = () => {
  const { inquiries, updateInquiryStatus, updateInquiryNotes, deleteInquiry, showToast } = useApp();

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDivision, setSelectedDivision] = useState("All");
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [activeLeadModal, setActiveLeadModal] = useState(null);
  const [editNotesText, setEditNotesText] = useState("");

  const filteredInquiries = inquiries.filter((inq) => {
    const matchesSearch =
      inq.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inq.phone.includes(searchTerm) ||
      (inq.company && inq.company.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (inq.location && inq.location.toLowerCase().includes(searchTerm.toLowerCase())) ||
      inq.scope.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesDivision =
      selectedDivision === "All" || inq.division.toLowerCase().includes(selectedDivision.toLowerCase());

    const matchesStatus =
      selectedStatus === "All" || inq.status.toLowerCase() === selectedStatus.toLowerCase();

    return matchesSearch && matchesDivision && matchesStatus;
  });

  const openLeadDetails = (lead) => {
    setActiveLeadModal(lead);
    setEditNotesText(lead.notes || "");
  };

  const handleSaveNotes = () => {
    if (activeLeadModal) {
      updateInquiryNotes(activeLeadModal.id, editNotesText);
      setActiveLeadModal({ ...activeLeadModal, notes: editNotesText });
    }
  };

  const exportCSV = () => {
    const headers = ["ID", "Name", "Company", "Phone", "Email", "Division", "Scope", "Location", "Timeline", "Status", "Date", "Notes"];
    const rows = filteredInquiries.map((inq) => [
      inq.id,
      `"${inq.name}"`,
      `"${inq.company || ""}"`,
      inq.phone,
      inq.email,
      `"${inq.division}"`,
      `"${(inq.scope || "").replace(/"/g, '""')}"`,
      `"${inq.location || ""}"`,
      `"${inq.timeline || ""}"`,
      inq.status,
      inq.date,
      `"${(inq.notes || "").replace(/"/g, '""')}"`
    ]);

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `EAP_Leads_Report_${new Date().toISOString().split("T")[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast("Leads successfully exported to CSV spreadsheet!");
  };

  return (
    <div className="admin-inquiries-view">
      <div className="view-header-bar">
        <div>
          <h2>Client Inquiries & RFPs Pipeline</h2>
          <p>Real-time customer inquiries across all 4 child businesses</p>
        </div>
        <div className="view-header-actions">
          <button className="btn btn-outline-light" onClick={exportCSV}>
            <Download size={16} /> Export ({filteredInquiries.length}) to CSV
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="admin-filter-bar">
        <div className="search-input-box">
          <Search size={18} className="search-icon" />
          <input
            type="text"
            className="form-input search-input"
            placeholder="Search by client name, firm, phone, city, or scope..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {searchTerm && (
            <button className="clear-search-btn" onClick={() => setSearchTerm("")}>
              <X size={15} />
            </button>
          )}
        </div>

        <div className="filter-select-group">
          <select
            className="form-select filter-select"
            value={selectedDivision}
            onChange={(e) => setSelectedDivision(e.target.value)}
          >
            <option value="All">All Divisions & Operations</option>
            <option value="Electrical">Electrical & Manpower</option>
            <option value="Fabrication">Metal Fabrication</option>
            <option value="Bricks">Bricks Manufacturing</option>
            <option value="Farming">Aquaculture & Farming</option>
            <option value="Turnkey">Turnkey Plant Work</option>
          </select>

          <select
            className="form-select filter-select"
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
          >
            <option value="All">All Statuses</option>
            <option value="New">New</option>
            <option value="Contacted">Contacted</option>
            <option value="In Progress">In Progress</option>
            <option value="Negotiation">Negotiation</option>
            <option value="Closed">Closed</option>
          </select>
        </div>
      </div>

      {/* Leads Table */}
      <div className="admin-table-container">
        <table className="admin-leads-table">
          <thead>
            <tr>
              <th>Lead ID & Date</th>
              <th>Client / Company</th>
              <th>Division & Scope</th>
              <th>Site Destination</th>
              <th>Status</th>
              <th>Quick Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredInquiries.length === 0 ? (
              <tr>
                <td colSpan="6" className="text-center py-5 text-muted">
                  No inquiries found matching your current filter criteria.
                </td>
              </tr>
            ) : (
              filteredInquiries.map((inq) => (
                <tr key={inq.id}>
                  <td>
                    <span className="font-bold text-dark d-block">{inq.id}</span>
                    <span className="text-muted small">{inq.date}</span>
                  </td>

                  <td>
                    <strong className="text-dark d-block">{inq.name}</strong>
                    <span className="text-muted small">{inq.company || "Individual Client"}</span>
                    <div className="small text-cyan mt-1">
                      <Phone size={12} className="inline-icon" /> +91 {inq.phone}
                    </div>
                  </td>

                  <td>
                    <span className="badge-division-pill d-inline-block mb-1">
                      {inq.division}
                    </span>
                    <p className="lead-table-scope">{inq.scope}</p>
                    <span className="text-muted small">Timeline: {inq.timeline || "Standard"}</span>
                  </td>

                  <td>
                    <span className="text-dark d-block">
                      <MapPin size={12} className="inline-icon text-muted" /> {inq.location || "Pan-India"}
                    </span>
                  </td>

                  <td>
                    <select
                      className={`status-select-pill status-${inq.status.toLowerCase().replace(/\s+/g, "-")}`}
                      value={inq.status}
                      onChange={(e) => updateInquiryStatus(inq.id, e.target.value)}
                    >
                      <option value="New">New</option>
                      <option value="Contacted">Contacted</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Negotiation">Negotiation</option>
                      <option value="Closed">Closed</option>
                    </select>
                  </td>

                  <td>
                    <div className="table-actions-row">
                      <button
                        className="btn-action-icon text-cyan"
                        onClick={() => openLeadDetails(inq)}
                        title="View Full Details & Notes"
                      >
                        <Eye size={16} />
                      </button>

                      <a
                        href={`tel:${inq.phone}`}
                        className="btn-action-icon text-emerald"
                        title={`Call ${inq.phone}`}
                      >
                        <Phone size={16} />
                      </a>

                      <a
                        href={`https://wa.me/91${inq.phone.replace(/[^0-9]/g, "")}?text=Hello%20${encodeURIComponent(inq.name)},%20this%20is%20Erphan%20Alam%20Enterprises%20regarding%20your%20inquiry%20for%20${encodeURIComponent(inq.division)}.`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn-action-icon text-emerald"
                        title="Chat on WhatsApp"
                      >
                        <MessageCircle size={16} />
                      </a>

                      <button
                        className="btn-action-icon text-danger"
                        onClick={() => {
                          if (window.confirm(`Delete inquiry ${inq.id} for ${inq.name}?`)) {
                            deleteInquiry(inq.id);
                          }
                        }}
                        title="Delete Inquiry"
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

      {/* Lead Detail Modal */}
      {activeLeadModal && (
        <div className="modal-backdrop" onClick={() => setActiveLeadModal(null)}>
          <div className="modal-dialog modal-dialog-lg" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div>
                <span className="modal-subtitle">CLIENT INQUIRY DOSSIER</span>
                <h3 className="modal-title">{activeLeadModal.id} - {activeLeadModal.name}</h3>
              </div>
              <button className="modal-close-btn" onClick={() => setActiveLeadModal(null)}>
                <X size={20} />
              </button>
            </div>

            <div className="modal-body">
              <div className="lead-dossier-grid">
                <div className="dossier-item">
                  <span className="dossier-label">Client Name</span>
                  <span className="dossier-val">{activeLeadModal.name}</span>
                </div>
                <div className="dossier-item">
                  <span className="dossier-label">Company / Firm</span>
                  <span className="dossier-val">{activeLeadModal.company || "Individual"}</span>
                </div>
                <div className="dossier-item">
                  <span className="dossier-label">Contact Phone</span>
                  <a href={`tel:${activeLeadModal.phone}`} className="dossier-val text-cyan">
                    +91 {activeLeadModal.phone}
                  </a>
                </div>
                <div className="dossier-item">
                  <span className="dossier-label">Email Address</span>
                  <span className="dossier-val">{activeLeadModal.email || "Not Provided"}</span>
                </div>
                <div className="dossier-item">
                  <span className="dossier-label">Division</span>
                  <span className="dossier-val text-amber">{activeLeadModal.division}</span>
                </div>
                <div className="dossier-item">
                  <span className="dossier-label">Destination Location</span>
                  <span className="dossier-val">{activeLeadModal.location || "India"}</span>
                </div>
                <div className="dossier-item">
                  <span className="dossier-label">Execution Timeline</span>
                  <span className="dossier-val">{activeLeadModal.timeline || "Standard"}</span>
                </div>
                <div className="dossier-item">
                  <span className="dossier-label">Current Pipeline Status</span>
                  <select
                    className="form-select form-select-sm mt-1"
                    value={activeLeadModal.status}
                    onChange={(e) => {
                      updateInquiryStatus(activeLeadModal.id, e.target.value);
                      setActiveLeadModal({ ...activeLeadModal, status: e.target.value });
                    }}
                  >
                    <option value="New">New</option>
                    <option value="Contacted">Contacted</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Negotiation">Negotiation</option>
                    <option value="Closed">Closed</option>
                  </select>
                </div>
              </div>

              <div className="dossier-full-message mt-3">
                <label className="dossier-label">Client Detailed Requirements</label>
                <div className="message-quote-box">
                  {activeLeadModal.message || activeLeadModal.scope}
                </div>
              </div>

              <div className="dossier-internal-notes mt-3">
                <label className="dossier-label">Staff Internal Notes & Follow-up History</label>
                <textarea
                  rows={3}
                  className="form-textarea"
                  placeholder="Record call summary, quotation amount, agreed dispatch dates, site notes..."
                  value={editNotesText}
                  onChange={(e) => setEditNotesText(e.target.value)}
                ></textarea>
                <button className="btn btn-sm btn-outline-cyan mt-2" onClick={handleSaveNotes}>
                  Save Notes
                </button>
              </div>

              <div className="dossier-quick-contact-bar mt-4">
                <a
                  href={`tel:${activeLeadModal.phone}`}
                  className="btn btn-cyan"
                >
                  <Phone size={16} /> Direct Phone Call
                </a>
                <a
                  href={`https://wa.me/91${activeLeadModal.phone.replace(/[^0-9]/g, "")}?text=Hello%20${encodeURIComponent(activeLeadModal.name)},%20this%20is%20Erphan%20Alam%20Enterprises%20regarding%20your%20inquiry%20for%20${encodeURIComponent(activeLeadModal.division)}.`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-whatsapp-header"
                >
                  <MessageCircle size={16} /> Reply on WhatsApp
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
