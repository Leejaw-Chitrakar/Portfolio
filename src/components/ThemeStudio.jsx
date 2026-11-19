import React, { useState, useEffect } from "react";
import { 
  Palette, 
  RotateCcw, 
  Check, 
  Loader2, 
  Sparkles, 
  Eye, 
  Sliders, 
  Type, 
  Square, 
  Layers, 
  Droplet,
  Dices,
  Bookmark,
  Trash2,
  Send,
  Wand2
} from "lucide-react";
import { useTheme } from "../context/ThemeContext";

const ThemeStudio = () => {
  const { 
    theme, 
    previewTheme, 
    saveThemeLive, 
    resetToDefaultTheme, 
    generateHarmonicTheme,
    savedCustomThemes,
    saveCustomTheme,
    deleteCustomTheme,
    savingTheme, 
    saveSuccess, 
  } = useTheme();

  const [formTheme, setFormTheme] = useState(theme);
  const [activeCustomId, setActiveCustomId] = useState(null);
  const [customThemeName, setCustomThemeName] = useState(theme.name || "My Custom Theme");
  const [saveCustomSuccess, setSaveCustomSuccess] = useState(false);

  useEffect(() => {
    setFormTheme(theme);
    if (theme.name) {
      setCustomThemeName(theme.name);
    }
  }, [theme]);

  const handleFieldChange = (key, value) => {
    const updated = { ...formTheme, [key]: value };
    setFormTheme(updated);
    previewTheme({ [key]: value });
  };

  const handleCustomThemeClick = (customPreset) => {
    setActiveCustomId(customPreset.id);
    setFormTheme(customPreset);
    setCustomThemeName(customPreset.name);
    previewTheme(customPreset);
  };

  // Generate a random harmonic aesthetic theme and update states
  const handleGenerateRandom = () => {
    const randomTheme = generateHarmonicTheme();
    setFormTheme(randomTheme);
    setCustomThemeName(randomTheme.name);
    setActiveCustomId(randomTheme.id);
    previewTheme(randomTheme);
  };

  // Save into Custom Themes library with chosen name
  const handleSaveCustom = async (e) => {
    e.preventDefault();
    if (!customThemeName.trim()) {
      alert("Please provide a name for your custom theme.");
      return;
    }
    const saved = await saveCustomTheme(customThemeName, formTheme);
    setActiveCustomId(saved.id);
    setSaveCustomSuccess(true);
    setTimeout(() => setSaveCustomSuccess(false), 3000);
  };

  // Delete a saved custom theme
  const handleDeleteCustom = async (e, id, name) => {
    e.stopPropagation();
    if (window.confirm(`Delete the custom theme "${name}"?`)) {
      await deleteCustomTheme(id);
    }
  };

  // Save as the LIVE site theme
  const handlePublishLive = async () => {
    const themeToPublish = {
      ...formTheme,
      name: customThemeName.trim() || formTheme.name || "Custom Palette",
    };
    await saveThemeLive(themeToPublish);
  };

  const handleReset = async () => {
    if (window.confirm("Reset all custom colors back to the default Blush Rose theme?")) {
      await resetToDefaultTheme();
      setActiveCustomId(null);
      setCustomThemeName("Blush Rose");
    }
  };

  // Convert rgba / hex safely for native color picker
  const getPickerHex = (val) => {
    if (!val) return "#ffffff";
    if (val.startsWith("#")) {
      return val.length === 7 ? val : val.slice(0, 7);
    }
    return "#e2b4bd";
  };

  return (
    <div className="theme-studio">
      
      {/* ── Studio Header ── */}
      <div className="theme-header-bar">
        <div>
          <h2>Theme Studio</h2>
          <p className="theme-header-subtitle">
            Generate unique color palettes, fine-tune design tokens, and save custom themes by name.
          </p>
        </div>
        <div className="theme-header-actions">
          <button
            type="button"
            className="theme-btn-secondary"
            onClick={handleReset}
            disabled={savingTheme}
            title="Reset to default theme"
          >
            <RotateCcw size={15} /> Reset Default
          </button>
          <button
            type="button"
            className="theme-btn-primary"
            onClick={handlePublishLive}
            disabled={savingTheme}
            style={{
              background: `linear-gradient(135deg, ${formTheme.primary} 0%, ${formTheme.primaryDark || formTheme.secondary || formTheme.primary} 100%)`,
              boxShadow: `0 8px 20px -4px ${formTheme.primary}66`,
            }}
          >
            {savingTheme ? (
              <>
                <Loader2 size={16} className="spin-icon" /> Publishing...
              </>
            ) : saveSuccess ? (
              <>
                <Check size={16} /> Theme Live!
              </>
            ) : (
              <>
                <Send size={16} /> Publish to Live Site
              </>
            )}
          </button>
        </div>
      </div>

      {/* ── Interactive Dynamic Theme Generator Card ── */}
      <div 
        className="generator-hero-box"
        style={{
          background: "linear-gradient(140deg, #131728 0%, #0c0e18 100%)",
          border: `1.5px solid ${formTheme.primary ? formTheme.primary + '55' : 'rgba(255, 255, 255, 0.15)'}`,
          boxShadow: `0 20px 45px -10px ${formTheme.primary ? formTheme.primary + '40' : 'rgba(0,0,0,0.5)'}, 0 4px 20px rgba(0, 0, 0, 0.45)`,
          color: "#ffffff",
          transition: "border-color 0.35s ease, box-shadow 0.35s ease",
        }}
      >
        <div className="generator-hero-top">
          <div className="generator-title-wrap">
            <span 
              className="generator-pill"
              style={{
                background: `${formTheme.primary}25`,
                borderColor: `${formTheme.primary}66`,
                color: formTheme.primary || "#c4b5fd",
                transition: "all 0.3s ease",
              }}
            >
              <Sparkles size={13} /> PALETTE GENERATOR
            </span>
            <h3 style={{ color: "#ffffff" }}>Generate &amp; Save Themes</h3>
            <p style={{ color: "#cbd5e1" }}>
              Click below to generate balanced, high-contrast themes. Customize any detail and save under your own name.
            </p>
          </div>

          <button
            type="button"
            className="generator-dice-btn"
            onClick={handleGenerateRandom}
            style={{
              background: `linear-gradient(135deg, ${formTheme.primary} 0%, ${formTheme.primaryDark || formTheme.secondary || formTheme.primary} 100%)`,
              color: "#ffffff",
              boxShadow: `0 10px 25px -4px ${formTheme.primary}77`,
              transition: "transform 0.25s ease, box-shadow 0.25s ease, background 0.35s ease",
            }}
          >
            <Dices size={20} className="dice-icon" />
            <span>Generate Random Theme</span>
          </button>
        </div>

        {/* Current Active Theme Swatch Strip */}
        <div 
          className="generator-swatch-strip"
          style={{
            background: "rgba(10, 13, 24, 0.65)",
            borderColor: "rgba(255, 255, 255, 0.12)",
          }}
        >
          <span className="swatch-label" style={{ color: "#94a3b8" }}>
            Current Palette Preview:
          </span>
          <div className="swatch-items">
            <div className="swatch-chip" style={{ background: "rgba(255, 255, 255, 0.08)", borderColor: "rgba(255, 255, 255, 0.15)", color: "#f1f5f9" }}>
              <span className="swatch-chip-dot" style={{ background: formTheme.background }}></span>
              <span className="swatch-chip-name">Canvas</span>
            </div>
            <div className="swatch-chip" style={{ background: "rgba(255, 255, 255, 0.08)", borderColor: "rgba(255, 255, 255, 0.15)", color: "#f1f5f9" }}>
              <span className="swatch-chip-dot" style={{ background: formTheme.surface }}></span>
              <span className="swatch-chip-name">Surface</span>
            </div>
            <div className="swatch-chip" style={{ background: "rgba(255, 255, 255, 0.08)", borderColor: "rgba(255, 255, 255, 0.15)", color: "#f1f5f9" }}>
              <span className="swatch-chip-dot" style={{ background: formTheme.primary }}></span>
              <span className="swatch-chip-name">Primary</span>
            </div>
            <div className="swatch-chip" style={{ background: "rgba(255, 255, 255, 0.08)", borderColor: "rgba(255, 255, 255, 0.15)", color: "#f1f5f9" }}>
              <span className="swatch-chip-dot" style={{ background: formTheme.text }}></span>
              <span className="swatch-chip-name">Text</span>
            </div>
          </div>
        </div>

        {/* Save Theme with Custom Name Form */}
        <form 
          className="generator-save-row" 
          onSubmit={handleSaveCustom}
          style={{ borderColor: "rgba(255, 255, 255, 0.12)" }}
        >
          <div className="generator-input-group">
            <label htmlFor="custom-theme-name" className="generator-field-label" style={{ color: "#f1f5f9" }}>
              <Bookmark size={14} style={{ color: formTheme.primary }} /> Theme Name:
            </label>
            <input
              id="custom-theme-name"
              type="text"
              className="generator-name-input"
              value={customThemeName}
              onChange={(e) => setCustomThemeName(e.target.value)}
              placeholder="e.g. Solar Flare Wave, Neon Sakura, Velvet Plum Flow"
              required
              style={{
                background: "rgba(10, 13, 24, 0.75)",
                borderColor: `${formTheme.primary}44`,
                color: "#ffffff",
              }}
            />
          </div>
          <button
            type="submit"
            className="generator-save-btn"
            style={{
              background: "rgba(255, 255, 255, 0.1)",
              borderColor: `${formTheme.primary}66`,
              color: "#ffffff",
            }}
          >
            {saveCustomSuccess ? (
              <>
                <Check size={16} /> Saved to Library!
              </>
            ) : (
              <>
                <Bookmark size={16} /> Save Theme
              </>
            )}
          </button>
        </form>
      </div>

      {/* ── Saved Custom Themes Section ── */}
      <div className="theme-section-card">
        <div className="section-title-wrap">
          <div className="section-title-icon" style={{ background: `${formTheme.primary}25`, color: formTheme.primaryDark || formTheme.primary }}>
            <Bookmark size={18} />
          </div>
          <div>
            <h3>Your Saved Themes ({savedCustomThemes.length})</h3>
            <p>Themes you have generated, tweaked, and saved with your chosen names.</p>
          </div>
        </div>

        {savedCustomThemes.length > 0 ? (
          <div className="custom-themes-grid">
            {savedCustomThemes.map((custom) => {
              const isSelected = activeCustomId === custom.id || formTheme.name === custom.name;

              return (
                <div
                  key={custom.id}
                  className={`saved-theme-card ${isSelected ? "selected" : ""}`}
                  onClick={() => handleCustomThemeClick(custom)}
                  style={{
                    borderColor: isSelected ? formTheme.primary : undefined,
                    boxShadow: isSelected ? `0 0 0 2px ${formTheme.primary}, 0 14px 28px -5px rgba(0, 0, 0, 0.3)` : undefined,
                  }}
                >
                  <div className="saved-theme-head">
                    <strong className="saved-theme-title">{custom.name}</strong>
                    <button
                      type="button"
                      className="saved-theme-del-btn"
                      onClick={(e) => handleDeleteCustom(e, custom.id, custom.name)}
                      title="Delete this saved theme"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                  
                  {/* Swatch Previews */}
                  <div className="saved-theme-swatches">
                    <span className="saved-swatch" style={{ background: custom.background }} title={`Canvas: ${custom.background}`}></span>
                    <span className="saved-swatch" style={{ background: custom.surface }} title={`Surface: ${custom.surface}`}></span>
                    <span className="saved-swatch" style={{ background: custom.primary }} title={`Primary: ${custom.primary}`}></span>
                    <span className="saved-swatch" style={{ background: custom.text }} title={`Text: ${custom.text}`}></span>
                  </div>

                  <div className="saved-theme-footer">
                    {isSelected ? (
                      <span className="active-pill" style={{ color: formTheme.primary }}>✓ Editing Now</span>
                    ) : (
                      <span className="click-to-load">Click to Load &amp; Edit</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="empty-saved-themes-box">
            <Sparkles size={24} className="empty-icon" style={{ color: formTheme.primary }} />
            <p><strong>No custom themes saved yet.</strong></p>
            <span>Click <em>"Generate Random Theme"</em> above or adjust the colors below, enter a name, and click <em>"Save Theme"</em>!</span>
          </div>
        )}
      </div>

      {/* ── Interactive Live Preview Mockup ── */}
      <div className="theme-section-card">
        <div className="section-title-wrap">
          <div className="section-title-icon" style={{ background: `${formTheme.primary}25`, color: formTheme.primaryDark || formTheme.primary }}>
            <Eye size={18} />
          </div>
          <div>
            <h3>Live Preview</h3>
            <p>Real-time look at navigation, cards, typography, and contrast as you tweak colors.</p>
          </div>
        </div>

        <div className="mockup-stage" style={{ backgroundColor: formTheme.background, color: formTheme.text }}>
          {/* Mini Nav */}
          <div className="mockup-nav" style={{ borderColor: formTheme.border, backgroundColor: formTheme.surface }}>
            <span className="mockup-logo" style={{ color: formTheme.text }}>
              Dev<span style={{ color: formTheme.primary }}>Portfolio</span>
            </span>
            <div className="mockup-nav-links">
              <span style={{ color: formTheme.primary, fontWeight: 700 }}>Home</span>
              <span style={{ color: formTheme.textMuted }}>About</span>
              <span style={{ color: formTheme.textMuted }}>Projects</span>
              <span className="mockup-pill" style={{ backgroundColor: formTheme.primary, color: formTheme.textOnPrimary || "#ffffff" }}>
                Resume
              </span>
            </div>
          </div>

          {/* Mini Hero Content */}
          <div className="mockup-hero">
            <div className="mockup-badge" style={{ backgroundColor: formTheme.surfaceRaised || formTheme.surface, color: formTheme.primary, borderColor: formTheme.border }}>
              <Sparkles size={12} /> Available for new projects
            </div>
            
            <h1 className="mockup-title" style={{ color: formTheme.text }}>
              Designing <span style={{ color: formTheme.primary }}>Exceptional</span> Digital Experiences
            </h1>

            <p className="mockup-text" style={{ color: formTheme.textMuted }}>
              Full-Stack Developer based in Kathmandu building modern, accessible web applications.
            </p>

            <div className="mockup-btn-row">
              <button 
                type="button"
                className="mockup-btn-primary" 
                style={{ 
                  background: `linear-gradient(135deg, ${formTheme.primary} 0%, ${formTheme.primaryDark || formTheme.secondary} 100%)`,
                  color: formTheme.textOnPrimary || "#ffffff"
                }}
              >
                Explore Work →
              </button>
              <button 
                type="button"
                className="mockup-btn-outline" 
                style={{ borderColor: formTheme.borderStrong || formTheme.border, color: formTheme.text }}
              >
                Let's Talk
              </button>
            </div>

            {/* Mini Card Example */}
            <div 
              className="mockup-sample-card" 
              style={{ 
                backgroundColor: formTheme.surface, 
                borderColor: formTheme.border, 
                borderRadius: formTheme.cardRadius || "1rem",
                color: formTheme.text 
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <strong style={{ fontSize: "0.95rem" }}>Chiya Jivan Café POS</strong>
                <span style={{ fontSize: "0.7rem", padding: "0.2rem 0.5rem", borderRadius: "1rem", backgroundColor: formTheme.primary + "33", color: formTheme.primary, fontWeight: 700 }}>
                  Full Stack
                </span>
              </div>
              <p style={{ fontSize: "0.82rem", color: formTheme.textMuted, marginTop: "0.4rem" }}>
                Offline-first SaaS POS with real-time order routing, KDS kitchen display, and digital Khata.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ── Fine-Grained Theme Controls ── */}
      <div className="theme-controls-grid">
        
        {/* Section 1: Canvas & Backgrounds */}
        <div className="theme-control-card">
          <div className="control-head">
            <Layers size={16} />
            <h4>Canvas &amp; Surfaces</h4>
          </div>
          <p className="control-sub">Base canvas and content surfaces</p>

          <div className="color-field-row">
            <label>
              <span className="color-name">Page Canvas Background</span>
              <small className="color-hint">Body and root page container</small>
            </label>
            <div className="color-input-combo">
              <input 
                type="color" 
                value={getPickerHex(formTheme.background)} 
                onChange={(e) => handleFieldChange("background", e.target.value)} 
              />
              <input 
                type="text" 
                value={formTheme.background || ""} 
                onChange={(e) => handleFieldChange("background", e.target.value)} 
                placeholder="#FFF5F5" 
              />
            </div>
          </div>

          <div className="color-field-row">
            <label>
              <span className="color-name">Card &amp; Panel Surface</span>
              <small className="color-hint">Cards, modals, and navigation bar</small>
            </label>
            <div className="color-input-combo">
              <input 
                type="color" 
                value={getPickerHex(formTheme.surface)} 
                onChange={(e) => handleFieldChange("surface", e.target.value)} 
              />
              <input 
                type="text" 
                value={formTheme.surface || ""} 
                onChange={(e) => handleFieldChange("surface", e.target.value)} 
                placeholder="#F7D6D0" 
              />
            </div>
          </div>

          <div className="color-field-row">
            <label>
              <span className="color-name">Raised Surface</span>
              <small className="color-hint">Elevated cards, popovers, dropdowns</small>
            </label>
            <div className="color-input-combo">
              <input 
                type="color" 
                value={getPickerHex(formTheme.surfaceRaised)} 
                onChange={(e) => handleFieldChange("surfaceRaised", e.target.value)} 
              />
              <input 
                type="text" 
                value={formTheme.surfaceRaised || ""} 
                onChange={(e) => handleFieldChange("surfaceRaised", e.target.value)} 
                placeholder="#fce9e6" 
              />
            </div>
          </div>
        </div>

        {/* Section 2: Brand & Accents */}
        <div className="theme-control-card">
          <div className="control-head">
            <Droplet size={16} />
            <h4>Brand &amp; Accent Highlights</h4>
          </div>
          <p className="control-sub">Buttons, links, and glowing accents</p>

          <div className="color-field-row">
            <label>
              <span className="color-name">Primary Brand Color</span>
              <small className="color-hint">Main CTA buttons, active links, badges</small>
            </label>
            <div className="color-input-combo">
              <input 
                type="color" 
                value={getPickerHex(formTheme.primary)} 
                onChange={(e) => handleFieldChange("primary", e.target.value)} 
              />
              <input 
                type="text" 
                value={formTheme.primary || ""} 
                onChange={(e) => handleFieldChange("primary", e.target.value)} 
                placeholder="#E2B4BD" 
              />
            </div>
          </div>

          <div className="color-field-row">
            <label>
              <span className="color-name">Primary Dark / Hover</span>
              <small className="color-hint">Gradient end, hover, and pressed states</small>
            </label>
            <div className="color-input-combo">
              <input 
                type="color" 
                value={getPickerHex(formTheme.primaryDark)} 
                onChange={(e) => handleFieldChange("primaryDark", e.target.value)} 
              />
              <input 
                type="text" 
                value={formTheme.primaryDark || ""} 
                onChange={(e) => handleFieldChange("primaryDark", e.target.value)} 
                placeholder="#c99aa5" 
              />
            </div>
          </div>

          <div className="color-field-row">
            <label>
              <span className="color-name">Secondary Tint</span>
              <small className="color-hint">Tags, subtle highlight chips, secondary elements</small>
            </label>
            <div className="color-input-combo">
              <input 
                type="color" 
                value={getPickerHex(formTheme.secondary)} 
                onChange={(e) => handleFieldChange("secondary", e.target.value)} 
              />
              <input 
                type="text" 
                value={formTheme.secondary || ""} 
                onChange={(e) => handleFieldChange("secondary", e.target.value)} 
                placeholder="#F7D6D0" 
              />
            </div>
          </div>
        </div>

        {/* Section 3: Typography & Text */}
        <div className="theme-control-card">
          <div className="control-head">
            <Type size={16} />
            <h4>Typography Colors</h4>
          </div>
          <p className="control-sub">Readability and contrast hierarchy</p>

          <div className="color-field-row">
            <label>
              <span className="color-name">Primary Text &amp; Headings</span>
              <small className="color-hint">Titles, headings, and high-contrast body</small>
            </label>
            <div className="color-input-combo">
              <input 
                type="color" 
                value={getPickerHex(formTheme.text)} 
                onChange={(e) => handleFieldChange("text", e.target.value)} 
              />
              <input 
                type="text" 
                value={formTheme.text || ""} 
                onChange={(e) => handleFieldChange("text", e.target.value)} 
                placeholder="#4A4A4A" 
              />
            </div>
          </div>

          <div className="color-field-row">
            <label>
              <span className="color-name">Muted Text &amp; Subtitles</span>
              <small className="color-hint">Descriptions, meta dates, icons</small>
            </label>
            <div className="color-input-combo">
              <input 
                type="color" 
                value={getPickerHex(formTheme.textMuted)} 
                onChange={(e) => handleFieldChange("textMuted", e.target.value)} 
              />
              <input 
                type="text" 
                value={formTheme.textMuted || ""} 
                onChange={(e) => handleFieldChange("textMuted", e.target.value)} 
                placeholder="#8a7072" 
              />
            </div>
          </div>
        </div>

        {/* Section 4: Micro-Details (Borders, Radii, Fonts) */}
        <div className="theme-control-card">
          <div className="control-head">
            <Square size={16} />
            <h4>Micro-Details &amp; Geometry</h4>
          </div>
          <p className="control-sub">Finishing touches from small things to bigger</p>

          <div className="color-field-row">
            <label>
              <span className="color-name">Border Outline</span>
              <small className="color-hint">Card borders, table dividers, glass seams</small>
            </label>
            <div className="color-input-combo">
              <input 
                type="text" 
                value={formTheme.border || ""} 
                onChange={(e) => handleFieldChange("border", e.target.value)} 
                placeholder="rgba(226, 180, 189, 0.45)" 
              />
            </div>
          </div>

          <div className="select-field-row">
            <label>
              <span className="color-name">Font Family</span>
              <small className="color-hint">Global typeface for the portfolio</small>
            </label>
            <select
              value={formTheme.fontFamily || "'Inter', sans-serif"}
              onChange={(e) => handleFieldChange("fontFamily", e.target.value)}
              className="theme-select"
            >
              <option value="'Inter', sans-serif">Inter (Modern &amp; Balanced)</option>
              <option value="'Plus Jakarta Sans', sans-serif">Plus Jakarta Sans (Friendly &amp; Geometric)</option>
              <option value="'Space Grotesk', sans-serif">Space Grotesk (Tech &amp; Brutalist)</option>
              <option value="'Outfit', sans-serif">Outfit (Clean &amp; Fashion Forward)</option>
            </select>
          </div>

          <div className="select-field-row">
            <label>
              <span className="color-name">Card Corner Radius</span>
              <small className="color-hint">Roundness of buttons and cards</small>
            </label>
            <select
              value={formTheme.cardRadius || "1.25rem"}
              onChange={(e) => handleFieldChange("cardRadius", e.target.value)}
              className="theme-select"
            >
              <option value="0.5rem">Minimal Sharp (8px)</option>
              <option value="0.85rem">Subtle Rounded (14px)</option>
              <option value="1.25rem">Smooth Balanced (20px)</option>
              <option value="1.8rem">Curved Organic (28px)</option>
            </select>
          </div>
        </div>

      </div>

      {/* ── Publish Bar ── */}
      <div className="theme-publish-bar">
        <div>
          <strong>Ready to publish your custom look?</strong>
          <p>Clicking "Publish to Live Site" updates the active theme immediately for every visitor across the website.</p>
        </div>
        <button
          type="button"
          className="theme-btn-primary"
          onClick={handlePublishLive}
          disabled={savingTheme}
          style={{
            background: `linear-gradient(135deg, ${formTheme.primary} 0%, ${formTheme.primaryDark || formTheme.secondary || formTheme.primary} 100%)`,
            boxShadow: `0 8px 20px -4px ${formTheme.primary}66`,
          }}
        >
          {savingTheme ? (
            <>
              <Loader2 size={16} className="spin-icon" /> Publishing Theme...
            </>
          ) : saveSuccess ? (
            <>
              <Check size={16} /> Theme Live!
            </>
          ) : (
            <>
              <Send size={16} /> Publish to Live Site
            </>
          )}
        </button>
      </div>

    </div>
  );
};

export default ThemeStudio;
