import React, { useState } from "react";
import {
  Settings,
  MousePointer,
  Sparkles,
  Eye,
  EyeOff,
  Download,
  Upload,
  RefreshCw,
  Database,
  RotateCcw,
  Check,
  Save,
  Loader2,
  HardDrive,
  Sliders,
  CheckCircle2,
  AlertTriangle,
  FileJson,
  Layers,
  Calendar,
  Compass,
  Award,
  Zap,
} from "lucide-react";
import { useSettings } from "../context/SettingsContext";
import { useTheme } from "../context/ThemeContext";
import { db } from "../firebase/config";
import {
  reorderProjects,
  reorderEvents,
  reorderMilestones,
  reorderCertifications,
  addProject,
  addEvent,
  addMilestone,
  addCertification,
} from "../services/portfolioService";

const SettingsPanel = ({
  projects = [],
  events = [],
  milestones = [],
  certifications = [],
}) => {
  const { settings, updateSettings, resetSettings, savingSettings } = useSettings();
  const { theme } = useTheme();

  // Local form states
  const [badgeText, setBadgeText] = useState(settings.siteStatusBadge || "Available for new projects");
  const [badgeSaved, setBadgeSaved] = useState(false);
  const [reindexing, setReindexing] = useState(false);
  const [reindexSuccess, setReindexSuccess] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [cacheCleared, setCacheCleared] = useState(false);

  // Backup restore states
  const [importPreview, setImportPreview] = useState(null);
  const [importing, setImporting] = useState(false);
  const [importSuccess, setImportSuccess] = useState(false);
  const [importError, setImportError] = useState("");

  // Save Hero Badge text
  const handleSaveBadge = async (e) => {
    e.preventDefault();
    await updateSettings({ siteStatusBadge: badgeText.trim() });
    setBadgeSaved(true);
    setTimeout(() => setBadgeSaved(false), 2500);
  };

  // Re-index all collection orders sequentially 1..N
  const handleNormalizeOrders = async () => {
    if (!window.confirm("Re-index all Projects, Events, Milestones, and Certifications sequentially (1, 2, 3...)?")) {
      return;
    }
    setReindexing(true);
    try {
      if (projects.length > 0) await reorderProjects([...projects]);
      if (events.length > 0) await reorderEvents([...events]);
      if (milestones.length > 0) await reorderMilestones([...milestones]);
      if (certifications.length > 0) await reorderCertifications([...certifications]);
      setReindexSuccess(true);
      setTimeout(() => setReindexSuccess(false), 3000);
    } catch (err) {
      alert("Re-index failed: " + err.message);
    } finally {
      setReindexing(false);
    }
  };

  // Export full portfolio backup JSON file
  const handleExportJSON = () => {
    setExporting(true);
    try {
      const backupData = {
        exportedAt: new Date().toISOString(),
        siteVersion: "1.0.0",
        settings: settings,
        theme: theme,
        counts: {
          projects: projects.length,
          events: events.length,
          milestones: milestones.length,
          certifications: certifications.length,
        },
        data: {
          projects,
          events,
          milestones,
          certifications,
        },
      };

      const jsonStr = JSON.stringify(backupData, null, 2);
      const blob = new Blob([jsonStr], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      const dateStr = new Date().toISOString().split("T")[0];
      a.href = url;
      a.download = `portfolio-backup-${dateStr}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (err) {
      alert("Export failed: " + err.message);
    } finally {
      setTimeout(() => setExporting(false), 800);
    }
  };

  // Handle JSON file selection for restore
  const handleFileImportChange = (e) => {
    setImportError("");
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target.result);
        if (!parsed.data && !parsed.projects) {
          throw new Error("Invalid format: backup data missing collections.");
        }
        const data = parsed.data || parsed;
        setImportPreview({
          raw: data,
          projectsCount: Array.isArray(data.projects) ? data.projects.length : 0,
          eventsCount: Array.isArray(data.events) ? data.events.length : 0,
          milestonesCount: Array.isArray(data.milestones) ? data.milestones.length : 0,
          certificationsCount: Array.isArray(data.certifications) ? data.certifications.length : 0,
          hasSettings: Boolean(parsed.settings),
        });
      } catch (err) {
        setImportError("Failed to parse backup file: " + err.message);
        setImportPreview(null);
      }
    };
    reader.readAsText(file);
    e.target.value = "";
  };

  // Execute restore
  const handleExecuteRestore = async () => {
    if (!importPreview?.raw) return;
    if (!window.confirm("Restore items from this backup? Existing documents with unique IDs will be updated or created.")) {
      return;
    }

    setImporting(true);
    setImportError("");
    try {
      const { raw } = importPreview;
      if (Array.isArray(raw.projects)) {
        for (const p of raw.projects) {
          const { id, ...rest } = p;
          await addProject(rest);
        }
      }
      if (Array.isArray(raw.events)) {
        for (const ev of raw.events) {
          const { id, ...rest } = ev;
          await addEvent(rest);
        }
      }
      if (Array.isArray(raw.milestones)) {
        for (const m of raw.milestones) {
          const { id, ...rest } = m;
          await addMilestone(rest);
        }
      }
      if (Array.isArray(raw.certifications)) {
        for (const c of raw.certifications) {
          const { id, ...rest } = c;
          await addCertification(rest);
        }
      }

      setImportSuccess(true);
      setImportPreview(null);
      setTimeout(() => setImportSuccess(false), 3500);
    } catch (err) {
      setImportError("Restore error: " + err.message);
    } finally {
      setImporting(false);
    }
  };

  // Clear local storage cache
  const handleClearCache = () => {
    try {
      localStorage.removeItem("devportfolio_settings");
      localStorage.removeItem("devportfolio_theme");
      localStorage.removeItem("devportfolio_custom_themes");
      setCacheCleared(true);
      setTimeout(() => setCacheCleared(false), 2500);
    } catch (e) {
      console.warn("Storage clear error:", e);
    }
  };

  // Reset all settings to factory default
  const handleResetDefaults = async () => {
    if (window.confirm("Reset all settings back to original factory defaults?")) {
      await resetSettings();
      setBadgeText("Available for new projects");
    }
  };

  return (
    <div className="settings-studio">
      
      {/* ── Section Header ── */}
      <div className="settings-header-bar">
        <div>
          <h2>Site &amp; System Settings</h2>
          <p className="settings-header-subtitle">
            Configure visual effects, manage homepage displays, and execute database backup and maintenance operations.
          </p>
        </div>
        <div className="settings-header-badge">
          <span className="live-telemetry-dot"></span>
          <span>Firestore Online</span>
        </div>
      </div>

      <div className="settings-grid">

        {/* ── 1. Interactive Effects & Cursor Controls ── */}
        <div className="settings-card glass">
          <div className="settings-card-head">
            <div className="settings-card-icon icon-indigo">
              <MousePointer size={20} />
            </div>
            <div>
              <h3>Mouse &amp; Visual Effects</h3>
              <p>Control dynamic desktop cursor interactions and motion intensity.</p>
            </div>
          </div>

          <div className="settings-options-list">
            
            {/* Mouse Effect Master Toggle */}
            <div className="settings-row">
              <div className="settings-row-text">
                <div className="settings-row-title">
                  <strong>Custom Mouse Particle Effect</strong>
                  <span className={`status-pill ${settings.mouseEffect !== false ? "status-on" : "status-off"}`}>
                    {settings.mouseEffect !== false ? "Active" : "Disabled"}
                  </span>
                </div>
                <span className="settings-row-desc">
                  Renders the dynamic theme-colored smoke particle trail and glowing follower dot on desktop browsers.
                </span>
              </div>

              <button
                type="button"
                className={`switch-toggle ${settings.mouseEffect !== false ? "is-checked" : ""}`}
                onClick={() => updateSettings({ mouseEffect: settings.mouseEffect === false })}
                disabled={savingSettings}
                title="Toggle mouse effect on/off"
              >
                <span className="switch-handle"></span>
              </button>
            </div>

            {/* Particle Density Selector */}
            <div className={`settings-subrow ${settings.mouseEffect === false ? "is-disabled" : ""}`}>
              <div className="settings-row-text">
                <span className="settings-sub-label">Particle Smoke Density:</span>
                <span className="settings-row-desc">Adjust how many smoke particles spawn per movement.</span>
              </div>
              <div className="density-pills">
                {[
                  { key: "subtle", label: "Subtle" },
                  { key: "balanced", label: "Balanced" },
                  { key: "dense", label: "Dense / Lush" },
                ].map((d) => (
                  <button
                    key={d.key}
                    type="button"
                    className={`density-pill ${settings.mouseDensity === d.key || (!settings.mouseDensity && d.key === "balanced") ? "active" : ""}`}
                    onClick={() => updateSettings({ mouseDensity: d.key })}
                    disabled={settings.mouseEffect === false || savingSettings}
                  >
                    {d.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Reduced Motion Toggle */}
            <div className="settings-row">
              <div className="settings-row-text">
                <div className="settings-row-title">
                  <strong>Reduced Motion Mode</strong>
                  {settings.reducedMotion && <span className="status-pill status-amber">Enabled</span>}
                </div>
                <span className="settings-row-desc">
                  Minimizes parallax floating blobs and particle animations for accessibility or low-power devices.
                </span>
              </div>

              <button
                type="button"
                className={`switch-toggle ${settings.reducedMotion ? "is-checked" : ""}`}
                onClick={() => updateSettings({ reducedMotion: !settings.reducedMotion })}
                disabled={savingSettings}
                title="Toggle reduced motion"
              >
                <span className="switch-handle"></span>
              </button>
            </div>

          </div>
        </div>

        {/* ── 2. Homepage & Section Visibility ── */}
        <div className="settings-card glass">
          <div className="settings-card-head">
            <div className="settings-card-icon icon-pink">
              <Eye size={20} />
            </div>
            <div>
              <h3>Homepage &amp; Display Controls</h3>
              <p>Configure which sections and badges appear on your public landing page.</p>
            </div>
          </div>

          <div className="settings-options-list">

            {/* Events Section Toggle */}
            <div className="settings-row">
              <div className="settings-row-text">
                <div className="settings-row-title">
                  <strong>Events &amp; Polaroid Wall</strong>
                  <span className={`status-pill ${settings.showEventsSection !== false ? "status-on" : "status-off"}`}>
                    {settings.showEventsSection !== false ? "Visible on Home" : "Hidden"}
                  </span>
                </div>
                <span className="settings-row-desc">
                  Displays the "Captured Along the Way" interactive Polaroid photo gallery on the home page.
                </span>
              </div>

              <button
                type="button"
                className={`switch-toggle ${settings.showEventsSection !== false ? "is-checked" : ""}`}
                onClick={() => updateSettings({ showEventsSection: settings.showEventsSection === false })}
                disabled={savingSettings}
                title="Toggle events section visibility on homepage"
              >
                <span className="switch-handle"></span>
              </button>
            </div>

            {/* Hero Status Badge Text */}
            <form className="settings-badge-form" onSubmit={handleSaveBadge}>
              <div className="badge-field-wrap">
                <label className="settings-sub-label">
                  <Sparkles size={14} style={{ color: "var(--primary)" }} /> Hero Availability Badge:
                </label>
                <div className="badge-input-row">
                  <input
                    type="text"
                    className="settings-text-input"
                    value={badgeText}
                    onChange={(e) => setBadgeText(e.target.value)}
                    placeholder="e.g. Available for new projects"
                    required
                  />
                  <button type="submit" className="btn-small-action" disabled={savingSettings}>
                    {badgeSaved ? <Check size={14} /> : <Save size={14} />}
                    <span>{badgeSaved ? "Saved" : "Save"}</span>
                  </button>
                </div>
              </div>

              {/* Quick suggestions */}
              <div className="badge-quick-pills">
                <span className="quick-label">Presets:</span>
                {[
                  "Available for new projects",
                  "Open for freelance & full-time",
                  "Exploring new opportunities",
                ].map((preset, idx) => (
                  <button
                    key={idx}
                    type="button"
                    className="quick-pill-btn"
                    onClick={() => {
                      setBadgeText(preset);
                      updateSettings({ siteStatusBadge: preset });
                    }}
                  >
                    {preset}
                  </button>
                ))}
              </div>
            </form>

          </div>
        </div>

        {/* ── 3. Data Operations & Backup ── */}
        <div className="settings-card glass">
          <div className="settings-card-head">
            <div className="settings-card-icon icon-amber">
              <Database size={20} />
            </div>
            <div>
              <h3>Data Operations &amp; Backup</h3>
              <p>Export portable JSON archives, restore data, and repair ordering indexes.</p>
            </div>
          </div>

          <div className="settings-operations-grid">

            {/* Export Backup */}
            <div className="operation-item">
              <div className="operation-info">
                <FileJson size={18} className="op-icon" />
                <div>
                  <strong>Export Portfolio Backup (JSON)</strong>
                  <p>Download a complete structured JSON archive containing all projects, events, milestones, and credentials.</p>
                </div>
              </div>
              <button
                type="button"
                className="btn btn-outline op-btn"
                onClick={handleExportJSON}
                disabled={exporting}
              >
                {exporting ? <Loader2 size={15} className="spin-icon" /> : <Download size={15} />}
                <span>{exporting ? "Generating..." : "Download Backup"}</span>
              </button>
            </div>

            {/* Import / Restore */}
            <div className="operation-item">
              <div className="operation-info">
                <Upload size={18} className="op-icon" />
                <div>
                  <strong>Import &amp; Restore Portfolio Data</strong>
                  <p>Restore or seed content from a previously exported `.json` portfolio backup.</p>
                </div>
              </div>

              <div className="file-upload-wrapper">
                <label className="btn btn-outline op-btn file-label">
                  <Upload size={15} />
                  <span>Choose JSON File</span>
                  <input
                    type="file"
                    accept=".json"
                    onChange={handleFileImportChange}
                    style={{ display: "none" }}
                  />
                </label>
              </div>
            </div>

            {/* Import Preview Card if file selected */}
            {importPreview && (
              <div className="import-preview-box">
                <div className="preview-header">
                  <CheckCircle2 size={16} color="#10b981" />
                  <strong>Backup File Loaded:</strong>
                </div>
                <div className="preview-stats">
                  <span>Projects: <strong>{importPreview.projectsCount}</strong></span>
                  <span>Events: <strong>{importPreview.eventsCount}</strong></span>
                  <span>Milestones: <strong>{importPreview.milestonesCount}</strong></span>
                  <span>Certifications: <strong>{importPreview.certificationsCount}</strong></span>
                </div>
                <div className="preview-actions">
                  <button
                    type="button"
                    className="btn btn-primary"
                    style={{ padding: "0.45rem 0.95rem", fontSize: "0.82rem" }}
                    onClick={handleExecuteRestore}
                    disabled={importing}
                  >
                    {importing ? <Loader2 size={14} className="spin-icon" /> : <Upload size={14} />}
                    <span>{importing ? "Restoring Records..." : "Restore Documents to Firestore"}</span>
                  </button>
                  <button
                    type="button"
                    className="btn btn-outline"
                    style={{ padding: "0.45rem 0.95rem", fontSize: "0.82rem" }}
                    onClick={() => setImportPreview(null)}
                    disabled={importing}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}

            {importSuccess && (
              <div className="alert-box alert-success">
                <Check size={16} /> All documents from backup have been restored to Firestore!
              </div>
            )}
            {importError && (
              <div className="alert-box alert-error">
                <AlertTriangle size={16} /> {importError}
              </div>
            )}

            {/* Re-index sequential order */}
            <div className="operation-item">
              <div className="operation-info">
                <RefreshCw size={18} className="op-icon" />
                <div>
                  <strong>Normalize &amp; Re-index Ordering</strong>
                  <p>Calculates clean sequential order numbers (1, 2, 3...) across all collections to fix any index fragmentation.</p>
                </div>
              </div>
              <button
                type="button"
                className="btn btn-outline op-btn"
                onClick={handleNormalizeOrders}
                disabled={reindexing}
              >
                {reindexing ? <Loader2 size={15} className="spin-icon" /> : <RefreshCw size={15} />}
                <span>{reindexing ? "Re-indexing..." : reindexSuccess ? "Normalized!" : "Re-index Orders"}</span>
              </button>
            </div>

            {/* Clear Browser Cache */}
            <div className="operation-item">
              <div className="operation-info">
                <HardDrive size={18} className="op-icon" />
                <div>
                  <strong>Purge Local Storage Cache</strong>
                  <p>Removes cached theme and settings stored in this browser session and forces fresh synchronisation.</p>
                </div>
              </div>
              <button
                type="button"
                className="btn btn-outline op-btn"
                onClick={handleClearCache}
              >
                <RotateCcw size={15} />
                <span>{cacheCleared ? "Cache Purged!" : "Clear Cache"}</span>
              </button>
            </div>

          </div>
        </div>

        {/* ── 4. Telemetry & Danger Zone ── */}
        <div className="settings-card glass">
          <div className="settings-card-head">
            <div className="settings-card-icon icon-emerald">
              <Zap size={20} />
            </div>
            <div>
              <h3>System Telemetry &amp; Reset</h3>
              <p>Live health summary and administrative reset actions.</p>
            </div>
          </div>

          {/* Telemetry pill badges */}
          <div className="telemetry-badges-grid">
            <div className="telemetry-pill">
              <Layers size={14} />
              <span>Projects: <strong>{projects.length}</strong></span>
            </div>
            <div className="telemetry-pill">
              <Calendar size={14} />
              <span>Events: <strong>{events.length}</strong></span>
            </div>
            <div className="telemetry-pill">
              <Compass size={14} />
              <span>Milestones: <strong>{milestones.length}</strong></span>
            </div>
            <div className="telemetry-pill">
              <Award size={14} />
              <span>Certificates: <strong>{certifications.length}</strong></span>
            </div>
          </div>

          <div className="settings-danger-zone">
            <div className="danger-zone-text">
              <strong>Reset Settings to Defaults</strong>
              <p>Reverts mouse particle effects, hero availability text, and visibility toggles back to original factory defaults.</p>
            </div>
            <button
              type="button"
              className="btn-danger-outline"
              onClick={handleResetDefaults}
              disabled={savingSettings}
            >
              <RotateCcw size={14} /> Reset Settings
            </button>
          </div>
        </div>

      </div>

    </div>
  );
};

export default SettingsPanel;
