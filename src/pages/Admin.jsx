import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  ShieldCheck,
  LogOut,
  ExternalLink,
  Layers,
  Calendar,
  Award,
  Clock,
  FolderKanban,
  Activity,
  UserCheck,
  Compass,
  Plus,
  Pencil,
  Trash2,
  X,
  Save,
  Upload,
  Loader2,
  Check,
  GripVertical,
  Eye,
  EyeOff,
  Palette,
  SlidersHorizontal,
  ArrowUpDown,
  Settings,
} from "lucide-react";
import ThemeStudio from "../components/ThemeStudio.jsx";
import SettingsPanel from "../components/SettingsPanel.jsx";
import { useAuth } from "../context/AuthContext";
import { uploadToImgBB } from "../services/imageUploadService";
import {
  subscribeCollection,
  addProject,
  updateProject,
  deleteProject,
  reorderProjects,
  addEvent,
  updateEvent,
  deleteEvent,
  reorderEvents,
  toggleEventVisibility,
  setEventsSectionSetting,
  addMilestone,
  updateMilestone,
  deleteMilestone,
  reorderMilestones,
  addCertification,
  updateCertification,
  deleteCertification,
  reorderCertifications,
  parseDateString,
} from "../services/portfolioService";
import "../styles/Admin.css";

/* ─── Blank templates ─── */
const BLANK_PROJECT = {
  title: "", description: "", tech: "", image: "", liveUrl: "", githubUrl: "", date: "", order: 0,
};
const BLANK_EVENT = {
  title: "", role: "", date: "", venue: "", attendees: "", tag: "", tagColor: "primary", desc: "", polaroidNote: "", image: "", visible: true, order: 0,
};
const BLANK_MILESTONE = {
  title: "", date: "", desc: "", category: "Key Milestone", tags: "", link: "", order: 0,
};
const BLANK_CERTIFICATION = {
  title: "", issuer: "", date: "", credentialUrl: "", logo: "", order: 0,
};

/* ─── Generic Modal ─── */
const Modal = ({ title, onClose, onSave, saving, children }) => {
  useEffect(() => {
    // Lock background scroll when popup is active
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, []);

  const modalContent = (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box glass" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>{title}</h3>
          <button className="modal-close" onClick={onClose}><X size={20} /></button>
        </div>
        <div className="modal-body">{children}</div>
        <div className="modal-footer">
          <button className="btn btn-outline" onClick={onClose} disabled={saving}>Cancel</button>
          <button className="btn btn-primary" onClick={onSave} disabled={saving}>
            <Save size={16} /> {saving ? "Saving…" : "Save"}
          </button>
        </div>
      </div>
    </div>
  );

  // Mount directly to document.body to break out of all parent CSS transforms & padding
  return typeof document !== "undefined"
    ? createPortal(modalContent, document.body)
    : modalContent;
};

/* ─── Field helper ─── */
const Field = ({ label, name, value, onChange, type = "text", rows, placeholder }) => (
  <div className="modal-field">
    <label>{label}</label>
    {rows ? (
      <textarea rows={rows} name={name} value={value} onChange={onChange} placeholder={placeholder} />
    ) : (
      <input type={type} name={name} value={value} onChange={onChange} placeholder={placeholder} />
    )}
  </div>
);

/* ─── Image Upload + URL Field ─── */
const ImageUploadField = ({ label, name, value, onChange, onUploadSuccess, onError }) => {
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState("");
  const [localPreview, setLocalPreview] = useState(null);

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Immediate local preview using Object URL while upload takes place
    const objectUrl = URL.createObjectURL(file);
    setLocalPreview(objectUrl);
    setUploading(true);
    setUploadProgress("Uploading to ImgBB...");

    try {
      const url = await uploadToImgBB(file);
      onUploadSuccess(name, url);
      setUploadProgress("Uploaded successfully!");
      setTimeout(() => setUploadProgress(""), 3000);
    } catch (err) {
      if (onError) onError(err.message || "Failed to upload image.");
      setUploadProgress("");
      setLocalPreview(null);
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  const handleClearImage = () => {
    onUploadSuccess(name, "");
    setLocalPreview(null);
    setUploadProgress("");
  };

  // Active display image is either the remote hosted URL or immediate local preview
  const displayImage = localPreview || value;

  return (
    <div className="modal-field">
      <div className="image-field-header">
        <label>{label}</label>
        <label className={`upload-btn-pill ${uploading ? "disabled" : ""}`}>
          {uploading ? (
            <>
              <Loader2 size={13} className="spin-icon" />
              <span>Uploading...</span>
            </>
          ) : (
            <>
              <Upload size={13} />
              <span>Upload Image</span>
            </>
          )}
          <input
            type="file"
            accept="image/*"
            style={{ display: "none" }}
            onChange={handleFileChange}
            disabled={uploading}
          />
        </label>
      </div>

      <div className="image-input-wrap">
        <input
          type="text"
          name={name}
          value={value}
          onChange={(e) => {
            setLocalPreview(null);
            onChange(e);
          }}
          placeholder="Paste URL or click Upload Image above"
        />
      </div>

      {/* Dedicated Uploaded Image Preview Box */}
      {displayImage && (
        <div className="image-live-preview-card">
          <div className="preview-img-container">
            <img
              src={displayImage}
              alt="Uploaded Preview"
              onError={(e) => {
                e.target.style.display = "none";
              }}
            />
            {uploading && (
              <div className="preview-uploading-overlay">
                <Loader2 size={24} className="spin-icon" />
                <span>Uploading to ImgBB...</span>
              </div>
            )}
          </div>
          <div className="preview-meta">
            <div className="preview-status">
              {uploading ? (
                <span className="status-uploading">⏳ In Progress</span>
              ) : uploadProgress ? (
                <span className="status-success">✓ {uploadProgress}</span>
              ) : (
                <span className="status-ready">✓ Image Ready</span>
              )}
            </div>
            <button
              type="button"
              className="preview-remove-btn"
              onClick={handleClearImage}
              disabled={uploading}
              title="Remove image"
            >
              <Trash2 size={13} /> Remove
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

/* ═══════════════════════════════════════════════════════ ADMIN ══ */
const Admin = () => {
  const { currentUser, logout } = useAuth();
  const [activeTab, setActiveTab] = useState("overview");
  const navigate = useNavigate();

  /* Firestore live state */
  const [projects, setProjects]             = useState([]);
  const [events, setEvents]                 = useState([]);
  const [milestones, setMilestones]         = useState([]);
  const [certifications, setCertifications] = useState([]);

  /* Modal state */
  const [modal, setModal] = useState(null); // { type: 'project'|'event'|'milestone'|'certification', mode: 'add'|'edit', data, id }
  const [formData, setFormData] = useState({});
  const [saving, setSaving] = useState(false);
  const [error, setError]   = useState("");

  /* Drag-and-drop state for events */
  const [draggedEventIndex, setDraggedEventIndex] = useState(null);
  const [dragOverEventIndex, setDragOverEventIndex] = useState(null);
  const [reorderingEvents, setReorderingEvents] = useState(false);
  const [reorderSuccess, setReorderSuccess] = useState(false);

  /* Drag-and-drop state for milestones */
  const [draggedMilestoneIndex, setDraggedMilestoneIndex] = useState(null);
  const [dragOverMilestoneIndex, setDragOverMilestoneIndex] = useState(null);
  const [reorderingMilestones, setReorderingMilestones] = useState(false);
  const [milestoneReorderSuccess, setMilestoneReorderSuccess] = useState(false);

  /* Drag-and-drop state for certifications */
  const [draggedCertIndex, setDraggedCertIndex] = useState(null);
  const [dragOverCertIndex, setDragOverCertIndex] = useState(null);
  const [reorderingCerts, setReorderingCerts] = useState(false);
  const [certReorderSuccess, setCertReorderSuccess] = useState(false);

  /* Section setting state */
  const [showEventsSection, setShowEventsSection] = useState(true);

  /* Sorting states */
  const [projectSort, setProjectSort] = useState("default");
  const [eventSort, setEventSort] = useState("default");
  const [milestoneSort, setMilestoneSort] = useState("default");
  const [certSort, setCertSort] = useState("default");
  const [sortingType, setSortingType] = useState(null);

  /* Sort helper function */
  const getSortedList = (items, sortMode) => {
    const cloned = [...items];
    if (sortMode === "newest") {
      return cloned.sort((a, b) => {
        const diff = parseDateString(b) - parseDateString(a);
        if (diff !== 0) return diff;
        return (Number(a.order) || 0) - (Number(b.order) || 0);
      });
    }
    if (sortMode === "oldest") {
      return cloned.sort((a, b) => {
        const diff = parseDateString(a) - parseDateString(b);
        if (diff !== 0) return diff;
        return (Number(a.order) || 0) - (Number(b.order) || 0);
      });
    }
    if (sortMode === "title") {
      return cloned.sort((a, b) => (a.title || "").localeCompare(b.title || ""));
    }
    return cloned.sort((a, b) => (Number(a.order) || 0) - (Number(b.order) || 0));
  };

  /* Persist sorted order to Firestore */
  const handleApplySortOrder = async (type, sortMode) => {
    setSortingType(type);
    try {
      if (type === "project") {
        const sorted = getSortedList(projects, sortMode);
        setProjects(sorted);
        await reorderProjects(sorted);
      } else if (type === "event") {
        const sorted = getSortedList(events, sortMode);
        setEvents(sorted);
        await reorderEvents(sorted);
      } else if (type === "milestone") {
        const sorted = getSortedList(milestones, sortMode);
        setMilestones(sorted);
        await reorderMilestones(sorted);
      } else if (type === "certification") {
        const sorted = getSortedList(certifications, sortMode);
        setCertifications(sorted);
        await reorderCertifications(sorted);
      }
      setReorderSuccess(true);
      setTimeout(() => setReorderSuccess(false), 2500);
    } catch (err) {
      alert("Failed to save order to Firestore: " + err.message);
    } finally {
      setSortingType(null);
    }
  };

  /* Subscribe to Firestore */
  useEffect(() => {
    const u1 = subscribeCollection("projects", setProjects);
    const u2 = subscribeCollection("events", (data) => {
      if (data) {
        const settingsDoc = data.find(d => d.id === "_settings");
        if (settingsDoc && typeof settingsDoc.showEventsSection === "boolean") {
          setShowEventsSection(settingsDoc.showEventsSection);
        }
        const actualEvents = data.filter(d => d.id !== "_settings" && d.id !== "_theme");
        setEvents(actualEvents);
      }
    });
    const u3 = subscribeCollection("milestones", setMilestones);
    const u4 = subscribeCollection("certifications", setCertifications);
    return () => { u1(); u2(); u3(); u4(); };
  }, []);

  /* Toggle individual event visibility */
  const handleToggleEventVisibility = async (eventItem) => {
    const nextVis = eventItem.visible === false ? true : false;
    setEvents(prev => prev.map(ev => ev.id === eventItem.id ? { ...ev, visible: nextVis } : ev));
    try {
      if (eventItem.id) {
        await toggleEventVisibility(eventItem.id, nextVis);
      }
    } catch (err) {
      console.error("Failed to toggle event visibility:", err);
      alert("Failed to update visibility: " + err.message);
    }
  };

  /* Toggle whole section visibility on homepage */
  const handleToggleSectionVisibility = async () => {
    const nextVal = !showEventsSection;
    setShowEventsSection(nextVal);
    try {
      await setEventsSectionSetting(nextVal);
    } catch (err) {
      console.error("Failed to toggle section setting:", err);
      alert("Failed to update section setting: " + err.message);
    }
  };

  /* Drag handlers for Events */
  const handleEventDragStart = (e, index) => {
    setDraggedEventIndex(index);
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/plain", index);
  };

  const handleEventDragOver = (e, index) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    if (dragOverEventIndex !== index) {
      setDragOverEventIndex(index);
    }
  };

  const handleEventDrop = async (e, targetIndex) => {
    e.preventDefault();
    if (draggedEventIndex === null || draggedEventIndex === targetIndex) {
      setDraggedEventIndex(null);
      setDragOverEventIndex(null);
      return;
    }

    const reordered = [...events];
    const [movedItem] = reordered.splice(draggedEventIndex, 1);
    reordered.splice(targetIndex, 0, movedItem);

    // Re-assign sequential order
    const updatedEvents = reordered.map((item, idx) => ({
      ...item,
      order: idx + 1,
    }));

    // Optimistic UI update
    setEvents(updatedEvents);
    setDraggedEventIndex(null);
    setDragOverEventIndex(null);

    // Persist to Firestore
    try {
      setReorderingEvents(true);
      await reorderEvents(updatedEvents);
      setReorderSuccess(true);
      setTimeout(() => setReorderSuccess(false), 2500);
    } catch (err) {
      console.error("Failed to reorder events in Firestore:", err);
      alert("Failed to save new event order: " + err.message);
    } finally {
      setReorderingEvents(false);
    }
  };

  const handleEventDragEnd = () => {
    setDraggedEventIndex(null);
    setDragOverEventIndex(null);
  };

  /* Drag handlers for Milestones */
  const handleMilestoneDragStart = (e, index) => {
    setDraggedMilestoneIndex(index);
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/plain", index);
  };

  const handleMilestoneDragOver = (e, index) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    if (dragOverMilestoneIndex !== index) {
      setDragOverMilestoneIndex(index);
    }
  };

  const handleMilestoneDrop = async (e, targetIndex) => {
    e.preventDefault();
    if (draggedMilestoneIndex === null || draggedMilestoneIndex === targetIndex) {
      setDraggedMilestoneIndex(null);
      setDragOverMilestoneIndex(null);
      return;
    }

    const reordered = [...milestones];
    const [movedItem] = reordered.splice(draggedMilestoneIndex, 1);
    reordered.splice(targetIndex, 0, movedItem);

    const updatedMilestones = reordered.map((item, idx) => ({
      ...item,
      order: idx + 1,
    }));

    setMilestones(updatedMilestones);
    setDraggedMilestoneIndex(null);
    setDragOverMilestoneIndex(null);

    try {
      setReorderingMilestones(true);
      await reorderMilestones(updatedMilestones);
      setMilestoneReorderSuccess(true);
      setTimeout(() => setMilestoneReorderSuccess(false), 2500);
    } catch (err) {
      console.error("Failed to reorder milestones in Firestore:", err);
      alert("Failed to save new milestone order: " + err.message);
    } finally {
      setReorderingMilestones(false);
    }
  };

  const handleMilestoneDragEnd = () => {
    setDraggedMilestoneIndex(null);
    setDragOverMilestoneIndex(null);
  };

  /* Drag handlers for Certifications */
  const handleCertDragStart = (e, index) => {
    setDraggedCertIndex(index);
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/plain", index);
  };

  const handleCertDragOver = (e, index) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    if (dragOverCertIndex !== index) {
      setDragOverCertIndex(index);
    }
  };

  const handleCertDrop = async (e, targetIndex) => {
    e.preventDefault();
    if (draggedCertIndex === null || draggedCertIndex === targetIndex) {
      setDraggedCertIndex(null);
      setDragOverCertIndex(null);
      return;
    }

    const reordered = [...certifications];
    const [movedItem] = reordered.splice(draggedCertIndex, 1);
    reordered.splice(targetIndex, 0, movedItem);

    const updatedCerts = reordered.map((item, idx) => ({
      ...item,
      order: idx + 1,
    }));

    setCertifications(updatedCerts);
    setDraggedCertIndex(null);
    setDragOverCertIndex(null);

    try {
      setReorderingCerts(true);
      await reorderCertifications(updatedCerts);
      setCertReorderSuccess(true);
      setTimeout(() => setCertReorderSuccess(false), 2500);
    } catch (err) {
      console.error("Failed to reorder certifications in Firestore:", err);
      alert("Failed to save new certification order: " + err.message);
    } finally {
      setReorderingCerts(false);
    }
  };

  const handleCertDragEnd = () => {
    setDraggedCertIndex(null);
    setDragOverCertIndex(null);
  };

  /* Logout */
  const handleLogout = async () => {
    try { await logout(); navigate("/login"); }
    catch (err) { console.error("Logout error:", err); }
  };

  /* ── Open modals ── */
  const openAdd = (type) => {
    const blank = type === "project" 
      ? { ...BLANK_PROJECT, order: projects.length + 1 }
      : type === "event" 
      ? { ...BLANK_EVENT, order: events.length + 1 } 
      : type === "milestone" 
      ? { ...BLANK_MILESTONE, order: milestones.length + 1 }
      : { ...BLANK_CERTIFICATION, order: certifications.length + 1 };
    setFormData({ ...blank });
    setModal({ type, mode: "add" });
    setError("");
  };
  const openEdit = (type, item) => {
    const data = { ...item };
    if (type === "milestone" && Array.isArray(data.tags)) {
      data.tags = data.tags.join(", ");
    }
    setFormData(data);
    setModal({ type, mode: "edit", id: item.id });
    setError("");
  };
  const closeModal = () => { setModal(null); setFormData({}); setError(""); };

  /* ── Form change ── */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageUploaded = (fieldName, url) => {
    setFormData((prev) => ({ ...prev, [fieldName]: url }));
  };

  /* ── Save (add or update) ── */
  const handleSave = async () => {
    setSaving(true);
    setError("");
    try {
      const { type, mode, id } = modal;
      // Normalise tech field (string → array)
      const payload = { ...formData };
      if (type === "project" && typeof payload.tech === "string") {
        payload.tech = payload.tech.split(",").map((t) => t.trim()).filter(Boolean);
      }
      if (type === "milestone" && typeof payload.tags === "string") {
        payload.tags = payload.tags.split(",").map((t) => t.trim()).filter(Boolean);
      }
      payload.order = Number(payload.order) || 0;

      if (type === "project") {
        mode === "add" ? await addProject(payload) : await updateProject(id, payload);
      } else if (type === "event") {
        mode === "add" ? await addEvent(payload) : await updateEvent(id, payload);
      } else if (type === "milestone") {
        mode === "add" ? await addMilestone(payload) : await updateMilestone(id, payload);
      } else if (type === "certification") {
        mode === "add" ? await addCertification(payload) : await updateCertification(id, payload);
      }
      closeModal();
    } catch (err) {
      setError(err.message || "Save failed. Check Firestore rules.");
    } finally {
      setSaving(false);
    }
  };

  /* ── Delete ── */
  const handleDelete = async (type, id) => {
    if (!window.confirm("Delete this item permanently?")) return;
    try {
      if (type === "project")        await deleteProject(id);
      else if (type === "event")     await deleteEvent(id);
      else if (type === "milestone") await deleteMilestone(id);
      else if (type === "certification") await deleteCertification(id);
    } catch (err) {
      alert("Delete failed: " + err.message);
    }
  };

  /* ── Tech display helper ── */
  const techStr = (tech) => Array.isArray(tech) ? tech.join(", ") : tech || "";

  return (
    <div className="admin-page container fade-in">

      {/* ── Header ── */}
      <motion.div
        className="admin-header glass"
        initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
      >
        <div className="admin-title-wrap">
          <div className="admin-badge-icon"><ShieldCheck size={28} /></div>
          <div>
            <h1>Portfolio Command Center</h1>
            <div className="admin-user-pill">
              <span className="status-dot"></span>
              <span>Signed in as <strong>{currentUser?.email || "Admin"}</strong></span>
            </div>
          </div>
        </div>
        <div className="admin-actions">
          <Link to="/" className="btn btn-outline" style={{ padding: "0.6rem 1rem", fontSize: "0.88rem" }}>
            <ExternalLink size={16} /> View Live Site
          </Link>
          <button onClick={handleLogout} className="btn btn-primary" style={{ padding: "0.6rem 1.1rem", fontSize: "0.88rem" }}>
            <LogOut size={16} /> Sign Out
          </button>
        </div>
      </motion.div>

      {/* ── Stats ── */}
      <div className="admin-stats-grid">
        {[
          { icon: <Layers size={24}/>,   cls: "icon-indigo",  count: projects.length,       label: "Projects" },
          { icon: <Calendar size={24}/>, cls: "icon-pink",    count: events.length,         label: "Events" },
          { icon: <Clock size={24}/>,    cls: "icon-amber",   count: milestones.length,     label: "Milestones" },
          { icon: <Award size={24}/>,    cls: "icon-emerald", count: certifications.length, label: "Credentials" },
        ].map((s, i) => (
          <div key={i} className="admin-stat-card glass">
            <div className={`admin-stat-icon ${s.cls}`}>{s.icon}</div>
            <div className="admin-stat-info"><h3>{s.count}</h3><p>{s.label}</p></div>
          </div>
        ))}
      </div>

      {/* ── Tabs ── */}
      <div className="admin-tabs glass">
        {[
          { key: "overview",       icon: <Activity size={18}/>,     label: "Overview" },
          { key: "projects",       icon: <FolderKanban size={18}/>, label: "Projects" },
          { key: "events",         icon: <Calendar size={18}/>,     label: "Events" },
          { key: "milestones",     icon: <Compass size={18}/>,      label: "Milestones" },
          { key: "certifications", icon: <Award size={18}/>,        label: "Certifications" },
          { key: "theme",          icon: <Palette size={18}/>,      label: "Theme" },
          { key: "settings",       icon: <Settings size={18}/>,     label: "Settings" },
        ].map((t) => (
          <button
            key={t.key}
            className={`admin-tab-btn ${activeTab === t.key ? "active" : ""}`}
            onClick={() => setActiveTab(t.key)}
          >
            {t.icon} {t.label}
          </button>
        ))}
      </div>

      {/* ── Panels ── */}
      <AnimatePresence mode="wait">

        {/* OVERVIEW */}
        {activeTab === "overview" && (
          <motion.div key="overview" className="admin-panel-card glass"
            initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }} transition={{ duration: 0.3 }}
          >
            <div className="panel-section-title">
              <h2>Overview &amp; Quick Actions</h2>
              <span className="table-badge badge-green">Operational</span>
            </div>
            <div className="quick-actions-grid">
              {[
                { tab: "projects",   icon: <FolderKanban size={28} color="var(--primary)"/>,  title: "Projects Inventory",   desc: "Manage and inspect your live, prototype, and team projects." },
                { tab: "events",     icon: <Calendar size={28} color="var(--secondary)"/>,    title: "Events & Workshops",   desc: "Review speaking engagements, facilitator roles, and visits." },
                { tab: "theme",      icon: <Palette size={28} color="var(--primary-dark)"/>,  title: "Theme Studio",         desc: "Customize colors, card radius, typography, and presets live." },
                { tab: "milestones", icon: <Clock size={28} color="var(--accent)"/>,          title: "Journey Timeline",     desc: "View chronological milestones featured on your About page." },
              ].map((q) => (
                <button key={q.tab} onClick={() => setActiveTab(q.tab)} className="quick-action-card"
                  style={{ textAlign: "left", cursor: "pointer", border: "1px solid var(--border)" }}>
                  {q.icon}<h4>{q.title}</h4><p>{q.desc}</p>
                </button>
              ))}
              <Link to="/contact" className="quick-action-card">
                <UserCheck size={28} color="#10b981"/>
                <h4>Inquiry Channel</h4>
                <p>Verify your contact and inquiry response flow directly on the site.</p>
              </Link>
            </div>

            <h3 style={{ fontSize: "1.1rem", margin: "1.5rem 0 1rem", color: "var(--text)" }}>Recent Events</h3>
            <div className="admin-table-container">
              <table className="admin-table">
                <thead><tr><th>Initiative</th><th>Role</th><th>Venue</th><th>Date</th></tr></thead>
                <tbody>
                  {events.slice(0, 4).map((evt) => (
                    <tr key={evt.id}>
                      <td><strong>{evt.title}</strong></td>
                      <td><span className="table-badge badge-blue">{evt.role}</span></td>
                      <td>{evt.venue}</td>
                      <td>{evt.date}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}

        {/* PROJECTS */}
        {activeTab === "projects" && (
          <motion.div key="projects" className="admin-panel-card glass"
            initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }} transition={{ duration: 0.3 }}
          >
            <div className="panel-section-title">
              <div>
                <h2>Portfolio Projects</h2>
                <p className="section-subtitle-hint">
                  Manage projects, preview deployments, and organize display order.
                </p>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", flexWrap: "wrap" }}>
                <div className="table-sort-control">
                  <span className="sort-label"><SlidersHorizontal size={13} /> Sort:</span>
                  <select
                    value={projectSort}
                    onChange={(e) => setProjectSort(e.target.value)}
                    className="admin-sort-select"
                  >
                    <option value="default">Default (Order #)</option>
                    <option value="newest">Date (Newest First)</option>
                    <option value="oldest">Date (Oldest First)</option>
                    <option value="title">Title (A-Z)</option>
                  </select>
                  {projectSort !== "default" && (
                    <button
                      type="button"
                      className="btn-apply-order"
                      onClick={() => handleApplySortOrder("project", projectSort)}
                      disabled={sortingType === "project"}
                      title="Save this sorted order to Firestore so the live website displays it"
                    >
                      {sortingType === "project" ? <Loader2 size={12} className="spin-icon" /> : <Save size={12} />}
                      <span>Save as Site Order</span>
                    </button>
                  )}
                </div>

                <button className="btn btn-primary" style={{ fontSize: "0.85rem", padding: "0.5rem 1rem" }}
                  onClick={() => openAdd("project")}>
                  <Plus size={16} /> Add Project
                </button>
              </div>
            </div>
            <div className="admin-table-container">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>#</th><th>Title</th><th>Tech</th><th>Date / Timeline</th><th>Live URL</th><th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {getSortedList(projects, projectSort).map((p, i) => (
                    <tr key={p.id}>
                      <td>{p.order ?? i + 1}</td>
                      <td><strong>{p.title}</strong></td>
                      <td><code style={{ fontSize: "0.78rem" }}>{techStr(p.tech)}</code></td>
                      <td>
                        {p.date ? (
                          <span className="table-badge badge-blue">{p.date}</span>
                        ) : (
                          <span style={{ color: "var(--text-muted)" }}>—</span>
                        )}
                      </td>
                      <td>
                        {p.liveUrl && p.liveUrl !== "#"
                          ? <a href={p.liveUrl} target="_blank" rel="noreferrer" style={{ color: "var(--primary)" }}>Live ↗</a>
                          : <span style={{ color: "var(--text-muted)" }}>—</span>}
                      </td>
                      <td className="action-cell">
                        <button className="icon-btn edit-btn" title="Edit" onClick={() => openEdit("project", p)}><Pencil size={15}/></button>
                        <button className="icon-btn del-btn"  title="Delete" onClick={() => handleDelete("project", p.id)}><Trash2 size={15}/></button>
                      </td>
                    </tr>
                  ))}
                  {projects.length === 0 && (
                    <tr><td colSpan={6} style={{ textAlign: "center", color: "var(--text-muted)", padding: "2rem" }}>No projects yet — click Add Project.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}

        {/* EVENTS */}
        {activeTab === "events" && (
          <motion.div key="events" className="admin-panel-card glass"
            initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }} transition={{ duration: 0.3 }}
          >
            <div className="panel-section-title">
              <div>
                <h2>Events &amp; Facilitation</h2>
                <p className="section-subtitle-hint">
                  <GripVertical size={14} /> Drag rows using the handle icon to set and save the order.
                </p>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", flexWrap: "wrap" }}>
                {/* Homepage Section Toggle */}
                <button
                  type="button"
                  className={`section-visibility-toggle ${showEventsSection ? "is-visible" : "is-hidden"}`}
                  onClick={handleToggleSectionVisibility}
                  title={showEventsSection ? "Events section is currently shown on homepage. Click to hide." : "Events section is currently hidden from homepage. Click to show."}
                >
                  {showEventsSection ? <Eye size={14} /> : <EyeOff size={14} />}
                  <span>Homepage Section: {showEventsSection ? "Shown" : "Hidden"}</span>
                </button>

                {/* Table Sort Toolbar */}
                <div className="table-sort-control">
                  <span className="sort-label"><SlidersHorizontal size={13} /> Sort:</span>
                  <select
                    value={eventSort}
                    onChange={(e) => setEventSort(e.target.value)}
                    className="admin-sort-select"
                  >
                    <option value="default">Default (Manual Order)</option>
                    <option value="newest">Date (Newest First)</option>
                    <option value="oldest">Date (Oldest First)</option>
                    <option value="title">Title (A-Z)</option>
                  </select>
                  {eventSort !== "default" && (
                    <button
                      type="button"
                      className="btn-apply-order"
                      onClick={() => handleApplySortOrder("event", eventSort)}
                      disabled={sortingType === "event"}
                      title="Save this sorted order to Firestore so the live website displays it"
                    >
                      {sortingType === "event" ? <Loader2 size={12} className="spin-icon" /> : <Save size={12} />}
                      <span>Save as Site Order</span>
                    </button>
                  )}
                </div>

                {reorderingEvents && (
                  <span className="reorder-pill saving">
                    <Loader2 size={13} className="spin-icon" /> Saving order...
                  </span>
                )}
                {reorderSuccess && (
                  <span className="reorder-pill success">
                    <Check size={13} /> Order saved!
                  </span>
                )}
                <button className="btn btn-primary" style={{ fontSize: "0.85rem", padding: "0.5rem 1rem" }}
                  onClick={() => openAdd("event")}>
                  <Plus size={16} /> Add Event
                </button>
              </div>
            </div>
            <div className="admin-table-container">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th style={{ width: "36px", textAlign: "center" }} title="Drag handle"></th>
                    <th style={{ width: "48px" }}>#</th>
                    <th>Photo</th>
                    <th>Title</th>
                    <th>Role</th>
                    <th>Venue</th>
                    <th>Date</th>
                    <th>Homepage</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {getSortedList(events, eventSort).map((e, i) => (
                    <tr 
                      key={e.id || i}
                      draggable
                      onDragStart={(evt) => handleEventDragStart(evt, i)}
                      onDragOver={(evt) => handleEventDragOver(evt, i)}
                      onDrop={(evt) => handleEventDrop(evt, i)}
                      onDragEnd={handleEventDragEnd}
                      className={`draggable-row ${draggedEventIndex === i ? "is-dragging" : ""} ${dragOverEventIndex === i && draggedEventIndex !== i ? "is-drag-over" : ""}`}
                    >
                      <td className="drag-handle-cell" title="Drag to reorder">
                        <span className="drag-handle-icon">
                          <GripVertical size={16} />
                        </span>
                      </td>
                      <td>
                        <span className="order-number-badge">{i + 1}</span>
                      </td>
                      <td>
                        {e.image ? (
                          <img 
                            src={e.image} 
                            alt={e.title} 
                            style={{ width: "36px", height: "36px", objectFit: "cover", borderRadius: "6px", border: "1px solid var(--border)" }} 
                          />
                        ) : (
                          <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>—</span>
                        )}
                      </td>
                      <td>
                        <strong>{e.title}</strong>
                        {e.polaroidNote && (
                          <div style={{ fontSize: "0.75rem", color: "var(--accent)", fontStyle: "italic" }}>
                            "{e.polaroidNote}"
                          </div>
                        )}
                      </td>
                      <td><span className="table-badge badge-purple">{e.role}</span></td>
                      <td>{e.venue}</td>
                      <td>{e.date}</td>
                      <td>
                        <button
                          type="button"
                          className={`visibility-toggle-pill ${e.visible !== false ? "is-visible" : "is-hidden"}`}
                          onClick={() => handleToggleEventVisibility(e)}
                          title={e.visible !== false ? "Shown on homepage (click to hide)" : "Hidden from homepage (click to show)"}
                        >
                          {e.visible !== false ? <Eye size={13} /> : <EyeOff size={13} />}
                          <span>{e.visible !== false ? "Shown" : "Hidden"}</span>
                        </button>
                      </td>
                      <td className="action-cell">
                        <button className="icon-btn edit-btn" onClick={() => openEdit("event", e)} title="Edit Event"><Pencil size={15}/></button>
                        <button className="icon-btn del-btn"  onClick={() => handleDelete("event", e.id)} title="Delete Event"><Trash2 size={15}/></button>
                      </td>
                    </tr>
                  ))}
                  {events.length === 0 && (
                    <tr><td colSpan={9} style={{ textAlign: "center", color: "var(--text-muted)", padding: "2rem" }}>No events yet — click Add Event.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}

        {/* MILESTONES */}
        {activeTab === "milestones" && (
          <motion.div key="milestones" className="admin-panel-card glass"
            initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }} transition={{ duration: 0.3 }}
          >
            <div className="panel-section-title">
              <div>
                <h2>Journey Milestones</h2>
                <p className="section-subtitle-hint">
                  <GripVertical size={14} /> Drag rows using the handle icon to set and save the order.
                </p>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", flexWrap: "wrap" }}>
                <div className="table-sort-control">
                  <span className="sort-label"><SlidersHorizontal size={13} /> Sort:</span>
                  <select
                    value={milestoneSort}
                    onChange={(e) => setMilestoneSort(e.target.value)}
                    className="admin-sort-select"
                  >
                    <option value="default">Default (Manual Order)</option>
                    <option value="newest">Date (Newest First)</option>
                    <option value="oldest">Date (Oldest First)</option>
                    <option value="title">Title (A-Z)</option>
                  </select>
                  {milestoneSort !== "default" && (
                    <button
                      type="button"
                      className="btn-apply-order"
                      onClick={() => handleApplySortOrder("milestone", milestoneSort)}
                      disabled={sortingType === "milestone"}
                      title="Save this sorted order to Firestore"
                    >
                      {sortingType === "milestone" ? <Loader2 size={12} className="spin-icon" /> : <Save size={12} />}
                      <span>Save as Site Order</span>
                    </button>
                  )}
                </div>
                {milestoneReorderSuccess && (
                  <span className="reorder-pill success">
                    <Check size={13} /> Order saved!
                  </span>
                )}
                <button className="btn btn-primary" style={{ fontSize: "0.85rem", padding: "0.5rem 1rem" }}
                  onClick={() => openAdd("milestone")}>
                  <Plus size={16} /> Add Milestone
                </button>
              </div>
            </div>
            <div className="admin-table-container">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th style={{ width: "36px", textAlign: "center" }} title="Drag handle"></th>
                    <th style={{ width: "48px" }}>#</th>
                    <th>Title</th>
                    <th>Category</th>
                    <th>Date / Phase</th>
                    <th>Tags</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {getSortedList(milestones, milestoneSort).map((m, i) => (
                    <tr 
                      key={m.id || i}
                      draggable
                      onDragStart={(evt) => handleMilestoneDragStart(evt, i)}
                      onDragOver={(evt) => handleMilestoneDragOver(evt, i)}
                      onDrop={(evt) => handleMilestoneDrop(evt, i)}
                      onDragEnd={handleMilestoneDragEnd}
                      className={`draggable-row ${draggedMilestoneIndex === i ? "is-dragging" : ""} ${dragOverMilestoneIndex === i && draggedMilestoneIndex !== i ? "is-drag-over" : ""}`}
                    >
                      <td className="drag-handle-cell" title="Drag to reorder">
                        <span className="drag-handle-icon">
                          <GripVertical size={16} />
                        </span>
                      </td>
                      <td>
                        <span className="order-number-badge">{i + 1}</span>
                      </td>
                      <td><strong>{m.title}</strong></td>
                      <td>
                        <span className="table-badge badge-blue" style={{ fontSize: "0.75rem" }}>
                          {m.category || "Key Milestone"}
                        </span>
                      </td>
                      <td><span className="table-badge badge-blue">{m.date}</span></td>
                      <td style={{ maxWidth: 200, fontSize: "0.8rem", color: "var(--text-muted)" }}>
                        {Array.isArray(m.tags) ? m.tags.join(", ") : (m.tags || "—")}
                      </td>
                      <td className="action-cell">
                        <button className="icon-btn edit-btn" onClick={() => openEdit("milestone", m)}><Pencil size={15}/></button>
                        <button className="icon-btn del-btn"  onClick={() => handleDelete("milestone", m.id)}><Trash2 size={15}/></button>
                      </td>
                    </tr>
                  ))}
                  {milestones.length === 0 && (
                    <tr><td colSpan={7} style={{ textAlign: "center", color: "var(--text-muted)", padding: "2rem" }}>No milestones yet — click Add Milestone.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}

        {/* CERTIFICATIONS */}
        {activeTab === "certifications" && (
          <motion.div key="certifications" className="admin-panel-card glass"
            initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }} transition={{ duration: 0.3 }}
          >
            <div className="panel-section-title">
              <div>
                <h2>Certifications &amp; Credentials</h2>
                <p className="section-subtitle-hint">
                  <GripVertical size={14} /> Drag rows using the handle icon to set and save the order.
                </p>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", flexWrap: "wrap" }}>
                <div className="table-sort-control">
                  <span className="sort-label"><SlidersHorizontal size={13} /> Sort:</span>
                  <select
                    value={certSort}
                    onChange={(e) => setCertSort(e.target.value)}
                    className="admin-sort-select"
                  >
                    <option value="default">Default (Manual Order)</option>
                    <option value="newest">Date (Newest First)</option>
                    <option value="oldest">Date (Oldest First)</option>
                    <option value="title">Title (A-Z)</option>
                  </select>
                  {certSort !== "default" && (
                    <button
                      type="button"
                      className="btn-apply-order"
                      onClick={() => handleApplySortOrder("certification", certSort)}
                      disabled={sortingType === "certification"}
                      title="Save this sorted order to Firestore"
                    >
                      {sortingType === "certification" ? <Loader2 size={12} className="spin-icon" /> : <Save size={12} />}
                      <span>Save as Site Order</span>
                    </button>
                  )}
                </div>
                {certReorderSuccess && (
                  <span className="reorder-pill success">
                    <Check size={13} /> Order saved!
                  </span>
                )}
                <button className="btn btn-primary" style={{ fontSize: "0.85rem", padding: "0.5rem 1rem" }}
                  onClick={() => openAdd("certification")}>
                  <Plus size={16} /> Add Certificate
                </button>
              </div>
            </div>
            <div className="admin-table-container">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th style={{ width: "36px", textAlign: "center" }} title="Drag handle"></th>
                    <th style={{ width: "48px" }}>#</th>
                    <th>Title</th>
                    <th>Issuer</th>
                    <th>Date</th>
                    <th>Credential Link</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {getSortedList(certifications, certSort).map((c, i) => (
                    <tr 
                      key={c.id || i}
                      draggable
                      onDragStart={(evt) => handleCertDragStart(evt, i)}
                      onDragOver={(evt) => handleCertDragOver(evt, i)}
                      onDrop={(evt) => handleCertDrop(evt, i)}
                      onDragEnd={handleCertDragEnd}
                      className={`draggable-row ${draggedCertIndex === i ? "is-dragging" : ""} ${dragOverCertIndex === i && draggedCertIndex !== i ? "is-drag-over" : ""}`}
                    >
                      <td className="drag-handle-cell" title="Drag to reorder">
                        <span className="drag-handle-icon">
                          <GripVertical size={16} />
                        </span>
                      </td>
                      <td>
                        <span className="order-number-badge">{i + 1}</span>
                      </td>
                      <td><strong>{c.title}</strong></td>
                      <td><span className="table-badge badge-purple">{c.issuer}</span></td>
                      <td>{c.date}</td>
                      <td>
                        {c.credentialUrl && c.credentialUrl !== "#" ? (
                          <a href={c.credentialUrl} target="_blank" rel="noreferrer" style={{ color: "var(--primary)" }}>
                            View Image ↗
                          </a>
                        ) : (
                          <span style={{ color: "var(--text-muted)" }}>—</span>
                        )}
                      </td>
                      <td className="action-cell">
                        <button className="icon-btn edit-btn" onClick={() => openEdit("certification", c)}><Pencil size={15}/></button>
                        <button className="icon-btn del-btn"  onClick={() => handleDelete("certification", c.id)}><Trash2 size={15}/></button>
                      </td>
                    </tr>
                  ))}
                  {certifications.length === 0 && (
                    <tr><td colSpan={7} style={{ textAlign: "center", color: "var(--text-muted)", padding: "2rem" }}>No certifications yet — click Add Certificate.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}

        {/* THEME STUDIO */}
        {activeTab === "theme" && (
          <motion.div key="theme" className="admin-panel-card glass"
            initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }} transition={{ duration: 0.3 }}
          >
            <ThemeStudio />
          </motion.div>
        )}

        {/* SETTINGS PANEL */}
        {activeTab === "settings" && (
          <motion.div key="settings" className="admin-panel-card glass"
            initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }} transition={{ duration: 0.3 }}
          >
            <SettingsPanel
              projects={projects}
              events={events}
              milestones={milestones}
              certifications={certifications}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── CRUD Modal ── */}
      {modal && (
        <Modal
          title={`${modal.mode === "add" ? "Add" : "Edit"} ${modal.type.charAt(0).toUpperCase() + modal.type.slice(1)}`}
          onClose={closeModal}
          onSave={handleSave}
          saving={saving}
        >
          {error && <p className="modal-error">{error}</p>}

          {modal.type === "project" && (
            <>
              <div className="modal-grid-2">
                <Field label="Title *"       name="title"       value={formData.title || ""}       onChange={handleChange} />
                <Field label="Order"         name="order"       value={formData.order || ""}       onChange={handleChange} type="number" />
              </div>
              <div className="modal-grid-2">
                <Field label="Timeline / Date" name="date" value={formData.date || ""} onChange={handleChange} placeholder="e.g. October 2026" />
                <Field label="Tech (comma-separated)" name="tech" value={Array.isArray(formData.tech) ? formData.tech.join(", ") : formData.tech || ""} onChange={handleChange} />
              </div>
              <Field label="Description"   name="description" value={formData.description || ""} onChange={handleChange} rows={3} />
              <div className="modal-grid-2">
                <ImageUploadField
                  label="Project Banner / Image"
                  name="image"
                  value={formData.image || ""}
                  onChange={handleChange}
                  onUploadSuccess={handleImageUploaded}
                  onError={(msg) => setError(msg)}
                />
                <Field label="Live URL"      name="liveUrl"     value={formData.liveUrl || ""}     onChange={handleChange} />
              </div>
              <div className="modal-grid-2">
                <Field label="GitHub URL"    name="githubUrl"   value={formData.githubUrl || ""}   onChange={handleChange} />
              </div>
            </>
          )}

          {modal.type === "event" && (
            <>
              <div className="modal-grid-2">
                <Field label="Title *"     name="title"     value={formData.title || ""}     onChange={handleChange} />
                <Field label="Role"        name="role"      value={formData.role || ""}      onChange={handleChange} />
              </div>
              <div className="modal-grid-2">
                <Field label="Date"        name="date"      value={formData.date || ""}      onChange={handleChange} />
                <Field label="Venue"       name="venue"     value={formData.venue || ""}     onChange={handleChange} />
              </div>
              <div className="modal-grid-2">
                <Field label="Attendees"   name="attendees" value={formData.attendees || ""} onChange={handleChange} />
                <Field label="Tag"         name="tag"       value={formData.tag || ""}       onChange={handleChange} />
              </div>
              <Field 
                label="Polaroid Caption (Handwritten Note)" 
                name="polaroidNote" 
                value={formData.polaroidNote || ""} 
                onChange={handleChange} 
                placeholder="e.g. Inspiring Grade 8 minds on AI & Prompting! 💡" 
              />
              <ImageUploadField
                label="Event Snapshot / Polaroid Photo"
                name="image"
                value={formData.image || ""}
                onChange={handleChange}
                onUploadSuccess={handleImageUploaded}
                onError={(msg) => setError(msg)}
              />
              <Field label="Story / Description" name="desc" value={formData.desc || ""} onChange={handleChange} rows={3} />
              
              <div className="visibility-switch-card">
                <div className="switch-info">
                  <strong>Show on Homepage</strong>
                  <span>{formData.visible !== false ? "Visible in the homepage moments gallery" : "Hidden from homepage"}</span>
                </div>
                <button
                  type="button"
                  className={`visibility-switch-btn ${formData.visible !== false ? "active" : "inactive"}`}
                  onClick={() => setFormData(prev => ({ ...prev, visible: prev.visible === false ? true : false }))}
                >
                  {formData.visible !== false ? <Eye size={15} /> : <EyeOff size={15} />}
                  <span>{formData.visible !== false ? "Visible" : "Hidden"}</span>
                </button>
              </div>

              <div className="order-helper-badge">
                <span>Display Order: <strong>#{formData.order || events.length + 1}</strong></span>
                <span className="order-helper-hint">💡 Drag and drop rows in the Events table to rearrange order anytime!</span>
              </div>
            </>
          )}

          {modal.type === "milestone" && (
            <>
              <div className="modal-grid-2">
                <Field label="Title *" name="title" value={formData.title || ""} onChange={handleChange} placeholder="e.g. Kaaputale — E-Commerce" />
                <Field label="Date / Phase" name="date" value={formData.date || ""} onChange={handleChange} placeholder="e.g. April 2026 | Public" />
              </div>

              <div className="modal-grid-2">
                <div className="modal-field">
                  <label>Category Theme &amp; Icon</label>
                  <select
                    name="category"
                    value={formData.category || "Key Milestone"}
                    onChange={handleChange}
                  >
                    <option value="Education & Degree">🎓 Education &amp; Degree (Blue Theme)</option>
                    <option value="Project Launch">🚀 Project Launch (Emerald Theme)</option>
                    <option value="Early Exploration">💡 Early Exploration (Warm Amber Theme)</option>
                    <option value="Industry Experience">🧭 Industry Experience (Purple Theme)</option>
                    <option value="Key Milestone">✨ Key Milestone (Indigo/Primary Theme)</option>
                  </select>
                </div>
                <Field label="Order #" name="order" value={formData.order || ""} onChange={handleChange} type="number" />
              </div>

              <Field
                label="Tech Stack / Tags (Comma separated)"
                name="tags"
                value={formData.tags || ""}
                onChange={handleChange}
                placeholder="e.g. React, Vite, Firebase, JavaScript"
              />

              <Field
                label="Project Link / URL (Optional)"
                name="link"
                value={formData.link || ""}
                onChange={handleChange}
                placeholder="e.g. /projects or https://github.com/..."
              />

              <Field label="Description" name="desc" value={formData.desc || ""} onChange={handleChange} rows={3} placeholder="Describe this milestone..." />

              <div className="order-helper-badge">
                <span>Display Order: <strong>#{formData.order || milestones.length + 1}</strong></span>
                <span className="order-helper-hint">💡 Drag and drop rows in the Milestones table to rearrange order anytime!</span>
              </div>
            </>
          )}

          {modal.type === "certification" && (
            <>
              <div className="modal-grid-2">
                <Field label="Title *"         name="title"         value={formData.title || ""}         onChange={handleChange} />
                <Field label="Issuer *"        name="issuer"        value={formData.issuer || ""}        onChange={handleChange} />
              </div>
              <div className="modal-grid-2">
                <Field label="Date"            name="date"          value={formData.date || ""}          onChange={handleChange} />
                <Field label="Order"           name="order"         value={formData.order || ""}         onChange={handleChange} type="number" />
              </div>
              <div className="modal-grid-2">
                <ImageUploadField
                  label="Certificate Image"
                  name="credentialUrl"
                  value={formData.credentialUrl || ""}
                  onChange={handleChange}
                  onUploadSuccess={handleImageUploaded}
                  onError={(msg) => setError(msg)}
                />
                <ImageUploadField
                  label="Issuer Logo"
                  name="logo"
                  value={formData.logo || ""}
                  onChange={handleChange}
                  onUploadSuccess={handleImageUploaded}
                  onError={(msg) => setError(msg)}
                />
              </div>

              <div className="order-helper-badge">
                <span>Display Order: <strong>#{formData.order || certifications.length + 1}</strong></span>
                <span className="order-helper-hint">💡 Drag and drop rows in the Certifications table to rearrange order anytime!</span>
              </div>
            </>
          )}

          {saving && <p style={{ color: "var(--primary)", marginTop: "0.5rem", fontSize: "0.85rem" }}>Saving to Firestore…</p>}
        </Modal>
      )}
    </div>
  );
};

export default Admin;
