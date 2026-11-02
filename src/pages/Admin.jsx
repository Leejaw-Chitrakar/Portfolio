import React, { useState, useEffect } from "react";
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
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import {
  subscribeCollection,
  addProject,
  updateProject,
  deleteProject,
  addEvent,
  updateEvent,
  deleteEvent,
  addMilestone,
  updateMilestone,
  deleteMilestone,
  addCertification,
  updateCertification,
  deleteCertification,
} from "../services/portfolioService";
import "../styles/Admin.css";

/* ─── Blank templates ─── */
const BLANK_PROJECT = {
  title: "", description: "", tech: "", image: "", liveUrl: "", githubUrl: "", order: 0,
};
const BLANK_EVENT = {
  title: "", role: "", date: "", venue: "", attendees: "", tag: "", tagColor: "primary", desc: "", order: 0,
};
const BLANK_MILESTONE = {
  title: "", date: "", desc: "", order: 0,
};
const BLANK_CERTIFICATION = {
  title: "", issuer: "", date: "", credentialUrl: "", logo: "", order: 0,
};

/* ─── Generic Modal ─── */
const Modal = ({ title, onClose, onSave, saving, children }) => (
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

/* ─── Field helper ─── */
const Field = ({ label, name, value, onChange, type = "text", rows }) => (
  <div className="modal-field">
    <label>{label}</label>
    {rows ? (
      <textarea rows={rows} name={name} value={value} onChange={onChange} />
    ) : (
      <input type={type} name={name} value={value} onChange={onChange} />
    )}
  </div>
);

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

  /* Subscribe to Firestore */
  useEffect(() => {
    const u1 = subscribeCollection("projects",       setProjects);
    const u2 = subscribeCollection("events",         setEvents);
    const u3 = subscribeCollection("milestones",     setMilestones);
    const u4 = subscribeCollection("certifications", setCertifications);
    return () => { u1(); u2(); u3(); u4(); };
  }, []);

  /* Logout */
  const handleLogout = async () => {
    try { await logout(); navigate("/login"); }
    catch (err) { console.error("Logout error:", err); }
  };

  /* ── Open modals ── */
  const openAdd = (type) => {
    const blank = type === "project" 
      ? BLANK_PROJECT 
      : type === "event" 
      ? BLANK_EVENT 
      : type === "milestone" 
      ? BLANK_MILESTONE 
      : BLANK_CERTIFICATION;
    setFormData({ ...blank });
    setModal({ type, mode: "add" });
    setError("");
  };
  const openEdit = (type, item) => {
    setFormData({ ...item });
    setModal({ type, mode: "edit", id: item.id });
    setError("");
  };
  const closeModal = () => { setModal(null); setFormData({}); setError(""); };

  /* ── Form change ── */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
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
              <h2>Portfolio Projects</h2>
              <button className="btn btn-primary" style={{ fontSize: "0.85rem", padding: "0.5rem 1rem" }}
                onClick={() => openAdd("project")}>
                <Plus size={16} /> Add Project
              </button>
            </div>
            <div className="admin-table-container">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>#</th><th>Title</th><th>Tech</th><th>Live URL</th><th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {projects.map((p, i) => (
                    <tr key={p.id}>
                      <td>{p.order ?? i + 1}</td>
                      <td><strong>{p.title}</strong></td>
                      <td><code style={{ fontSize: "0.78rem" }}>{techStr(p.tech)}</code></td>
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
                    <tr><td colSpan={5} style={{ textAlign: "center", color: "var(--text-muted)", padding: "2rem" }}>No projects yet — click Add Project.</td></tr>
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
              <h2>Events &amp; Facilitation</h2>
              <button className="btn btn-primary" style={{ fontSize: "0.85rem", padding: "0.5rem 1rem" }}
                onClick={() => openAdd("event")}>
                <Plus size={16} /> Add Event
              </button>
            </div>
            <div className="admin-table-container">
              <table className="admin-table">
                <thead>
                  <tr><th>#</th><th>Title</th><th>Role</th><th>Venue</th><th>Date</th><th>Actions</th></tr>
                </thead>
                <tbody>
                  {events.map((e, i) => (
                    <tr key={e.id}>
                      <td>{e.order ?? i + 1}</td>
                      <td><strong>{e.title}</strong></td>
                      <td><span className="table-badge badge-purple">{e.role}</span></td>
                      <td>{e.venue}</td>
                      <td>{e.date}</td>
                      <td className="action-cell">
                        <button className="icon-btn edit-btn" onClick={() => openEdit("event", e)}><Pencil size={15}/></button>
                        <button className="icon-btn del-btn"  onClick={() => handleDelete("event", e.id)}><Trash2 size={15}/></button>
                      </td>
                    </tr>
                  ))}
                  {events.length === 0 && (
                    <tr><td colSpan={6} style={{ textAlign: "center", color: "var(--text-muted)", padding: "2rem" }}>No events yet — click Add Event.</td></tr>
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
              <h2>Journey Milestones</h2>
              <button className="btn btn-primary" style={{ fontSize: "0.85rem", padding: "0.5rem 1rem" }}
                onClick={() => openAdd("milestone")}>
                <Plus size={16} /> Add Milestone
              </button>
            </div>
            <div className="admin-table-container">
              <table className="admin-table">
                <thead>
                  <tr><th>#</th><th>Title</th><th>Date / Phase</th><th>Description</th><th>Actions</th></tr>
                </thead>
                <tbody>
                  {milestones.map((m, i) => (
                    <tr key={m.id}>
                      <td>{m.order ?? i + 1}</td>
                      <td><strong>{m.title}</strong></td>
                      <td><span className="table-badge badge-blue">{m.date}</span></td>
                      <td style={{ maxWidth: 260, fontSize: "0.82rem" }}>{m.desc}</td>
                      <td className="action-cell">
                        <button className="icon-btn edit-btn" onClick={() => openEdit("milestone", m)}><Pencil size={15}/></button>
                        <button className="icon-btn del-btn"  onClick={() => handleDelete("milestone", m.id)}><Trash2 size={15}/></button>
                      </td>
                    </tr>
                  ))}
                  {milestones.length === 0 && (
                    <tr><td colSpan={5} style={{ textAlign: "center", color: "var(--text-muted)", padding: "2rem" }}>No milestones yet — click Add Milestone.</td></tr>
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
              <h2>Certifications &amp; Credentials</h2>
              <button className="btn btn-primary" style={{ fontSize: "0.85rem", padding: "0.5rem 1rem" }}
                onClick={() => openAdd("certification")}>
                <Plus size={16} /> Add Certificate
              </button>
            </div>
            <div className="admin-table-container">
              <table className="admin-table">
                <thead>
                  <tr><th>#</th><th>Title</th><th>Issuer</th><th>Date</th><th>Credential Link</th><th>Actions</th></tr>
                </thead>
                <tbody>
                  {certifications.map((c, i) => (
                    <tr key={c.id}>
                      <td>{c.order ?? i + 1}</td>
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
                    <tr><td colSpan={6} style={{ textAlign: "center", color: "var(--text-muted)", padding: "2rem" }}>No certifications yet — click Add Certificate.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
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
              <Field label="Description"   name="description" value={formData.description || ""} onChange={handleChange} rows={3} />
              <div className="modal-grid-2">
                <Field label="Tech (comma-separated)" name="tech" value={Array.isArray(formData.tech) ? formData.tech.join(", ") : formData.tech || ""} onChange={handleChange} />
                <Field label="Image URL"     name="image"       value={formData.image || ""}       onChange={handleChange} />
              </div>
              <div className="modal-grid-2">
                <Field label="Live URL"      name="liveUrl"     value={formData.liveUrl || ""}     onChange={handleChange} />
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
              <Field label="Description" name="desc"      value={formData.desc || ""}      onChange={handleChange} rows={3} />
              <Field label="Order"       name="order"     value={formData.order || ""}     onChange={handleChange} type="number" />
            </>
          )}

          {modal.type === "milestone" && (
            <>
              <div className="modal-grid-2">
                <Field label="Title *"          name="title" value={formData.title || ""} onChange={handleChange} />
                <Field label="Date / Phase"     name="date"  value={formData.date || ""}  onChange={handleChange} />
              </div>
              <Field label="Description"      name="desc"  value={formData.desc || ""}  onChange={handleChange} rows={3} />
              <Field label="Order"            name="order" value={formData.order || ""} onChange={handleChange} type="number" />
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
                <Field label="Credential Image URL" name="credentialUrl" value={formData.credentialUrl || ""} onChange={handleChange} />
                <Field label="Issuer Logo URL"      name="logo"          value={formData.logo || ""}          onChange={handleChange} />
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
