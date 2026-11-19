import React, { createContext, useContext, useState, useEffect } from "react";
import { doc, onSnapshot, setDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase/config";

export const THEME_PRESETS = [
  {
    id: "blush-rose",
    name: "Blush Rose (Current)",
    description: "Soft warm ivory canvas with delicate dusty rose and elegant charcoal typography.",
    background: "#FFF5F5",
    surface: "#F7D6D0",
    surfaceRaised: "#fce9e6",
    primary: "#E2B4BD",
    primaryDark: "#c99aa5",
    secondary: "#F7D6D0",
    accent: "#c99aa5",
    text: "#4A4A4A",
    textMuted: "#8a7072",
    border: "rgba(226, 180, 189, 0.45)",
    borderStrong: "rgba(201, 154, 165, 0.65)",
    cardRadius: "1.25rem",
    glassBlur: "16px",
    fontFamily: "'Inter', sans-serif",
  },
  {
    id: "midnight-cyber",
    name: "Midnight Cyber",
    description: "Deep obsidian dark mode with futuristic indigo glow and neon pink accents.",
    background: "#0f172a",
    surface: "#1e293b",
    surfaceRaised: "#273549",
    primary: "#6366f1",
    primaryDark: "#4f46e5",
    secondary: "#ec4899",
    accent: "#f59e0b",
    text: "#f8fafc",
    textMuted: "#94a3b8",
    border: "rgba(255, 255, 255, 0.1)",
    borderStrong: "rgba(99, 102, 241, 0.45)",
    cardRadius: "1.25rem",
    glassBlur: "16px",
    fontFamily: "'Inter', sans-serif",
  },
  {
    id: "emerald-sage",
    name: "Emerald Sage",
    description: "Natural organic botanical theme with tranquil forest greens and warm parchment.",
    background: "#F5F8F5",
    surface: "#E4EDE4",
    surfaceRaised: "#ebf2eb",
    primary: "#3b7a57",
    primaryDark: "#2d5e43",
    secondary: "#52796F",
    accent: "#84a98c",
    text: "#223322",
    textMuted: "#556b55",
    border: "rgba(82, 121, 111, 0.28)",
    borderStrong: "rgba(82, 121, 111, 0.55)",
    cardRadius: "1.25rem",
    glassBlur: "16px",
    fontFamily: "'Plus Jakarta Sans', sans-serif",
  },
  {
    id: "sunset-amber",
    name: "Sunset Amber",
    description: "Warm golden hour terracotta, burnt sienna accents and cozy cream surface.",
    background: "#FAF6F0",
    surface: "#F3E9DD",
    surfaceRaised: "#faefe3",
    primary: "#E07A5F",
    primaryDark: "#c8674c",
    secondary: "#F4A261",
    accent: "#2A9D8F",
    text: "#3D405B",
    textMuted: "#72758d",
    border: "rgba(224, 122, 95, 0.28)",
    borderStrong: "rgba(224, 122, 95, 0.55)",
    cardRadius: "1.25rem",
    glassBlur: "16px",
    fontFamily: "'Inter', sans-serif",
  },
  {
    id: "clean-noir",
    name: "Clean Noir",
    description: "Ultra-sharp high-contrast monochromatic minimalism with dark charcoal slate.",
    background: "#FFFFFF",
    surface: "#F4F4F5",
    surfaceRaised: "#FAFAFA",
    primary: "#18181B",
    primaryDark: "#09090B",
    secondary: "#3F3F46",
    accent: "#71717A",
    text: "#18181B",
    textMuted: "#71717A",
    border: "rgba(0, 0, 0, 0.12)",
    borderStrong: "rgba(0, 0, 0, 0.35)",
    cardRadius: "0.75rem",
    glassBlur: "12px",
    fontFamily: "'Space Grotesk', sans-serif",
  },
  {
    id: "violet-dream",
    name: "Violet Dream",
    description: "Luminous synthwave aesthetic with radiant violet gradients and cyan glow.",
    background: "#0c0a17",
    surface: "#1a162b",
    surfaceRaised: "#25203d",
    primary: "#a855f7",
    primaryDark: "#9333ea",
    secondary: "#ec4899",
    accent: "#38bdf8",
    text: "#f3f4f6",
    textMuted: "#a1a1aa",
    border: "rgba(168, 85, 247, 0.28)",
    borderStrong: "rgba(168, 85, 247, 0.55)",
    cardRadius: "1.25rem",
    glassBlur: "18px",
    fontFamily: "'Outfit', sans-serif",
  },
];

export const DEFAULT_THEME = THEME_PRESETS[0];

/* ── Harmonic Archetypes for Intelligent Random Generation ── */
export const HARMONIC_ARCHETYPES = [
  {
    namePrefix: "Sakura",
    isDark: false,
    background: "#FFF5F7",
    surface: "#FCE7EC",
    surfaceRaised: "#FAEDF0",
    primary: "#E05375",
    primaryDark: "#BE3253",
    secondary: "#F9A8BA",
    accent: "#98203E",
    text: "#3B1F27",
    textMuted: "#78535D",
    border: "rgba(224, 83, 117, 0.35)",
    borderStrong: "rgba(224, 83, 117, 0.65)",
  },
  {
    namePrefix: "Nordic Frost",
    isDark: false,
    background: "#F4F8FA",
    surface: "#E3EFF4",
    surfaceRaised: "#EDF4F7",
    primary: "#0284C7",
    primaryDark: "#0369A1",
    secondary: "#7DD3FC",
    accent: "#0284C7",
    text: "#0C2331",
    textMuted: "#476475",
    border: "rgba(2, 132, 199, 0.32)",
    borderStrong: "rgba(2, 132, 199, 0.6)",
  },
  {
    namePrefix: "Matcha Mist",
    isDark: false,
    background: "#F6F9F4",
    surface: "#E8F2E4",
    surfaceRaised: "#EFF6EB",
    primary: "#4E8543",
    primaryDark: "#37622E",
    secondary: "#A3D497",
    accent: "#37622E",
    text: "#1D2C1A",
    textMuted: "#4F684A",
    border: "rgba(78, 133, 67, 0.32)",
    borderStrong: "rgba(78, 133, 67, 0.6)",
  },
  {
    namePrefix: "Tokyo Cyber",
    isDark: true,
    background: "#090A13",
    surface: "#131626",
    surfaceRaised: "#1B1F35",
    primary: "#EC4899",
    primaryDark: "#BE185D",
    secondary: "#8B5CF6",
    accent: "#06B6D4",
    text: "#F9FAFB",
    textMuted: "#9CA3AF",
    border: "rgba(236, 72, 153, 0.32)",
    borderStrong: "rgba(236, 72, 153, 0.6)",
  },
  {
    namePrefix: "Electric Neon",
    isDark: true,
    background: "#060814",
    surface: "#101328",
    surfaceRaised: "#191D3D",
    primary: "#6366F1",
    primaryDark: "#4338CA",
    secondary: "#06B6D4",
    accent: "#F43F5E",
    text: "#F8FAFC",
    textMuted: "#94A3B8",
    border: "rgba(99, 102, 241, 0.35)",
    borderStrong: "rgba(99, 102, 241, 0.65)",
  },
  {
    namePrefix: "Amber Sunset",
    isDark: false,
    background: "#FFF9F5",
    surface: "#FEEADF",
    surfaceRaised: "#FDF0E8",
    primary: "#E05A47",
    primaryDark: "#B83E2D",
    secondary: "#FDBA74",
    accent: "#C2410C",
    text: "#371A12",
    textMuted: "#7C5347",
    border: "rgba(224, 90, 71, 0.32)",
    borderStrong: "rgba(224, 90, 71, 0.6)",
  },
  {
    namePrefix: "Cyber Mint",
    isDark: true,
    background: "#061311",
    surface: "#0D2521",
    surfaceRaised: "#143731",
    primary: "#10B981",
    primaryDark: "#047857",
    secondary: "#34D399",
    accent: "#6EE7B7",
    text: "#F0FDF4",
    textMuted: "#86EFAC",
    border: "rgba(16, 185, 129, 0.32)",
    borderStrong: "rgba(16, 185, 129, 0.6)",
  },
  {
    namePrefix: "Velvet Plum",
    isDark: true,
    background: "#0D0A18",
    surface: "#1A142F",
    surfaceRaised: "#251D42",
    primary: "#A855F7",
    primaryDark: "#7E22CE",
    secondary: "#E879F9",
    accent: "#C084FC",
    text: "#FAF5FF",
    textMuted: "#D8B4FE",
    border: "rgba(168, 85, 247, 0.35)",
    borderStrong: "rgba(168, 85, 247, 0.65)",
  },
  {
    namePrefix: "Caramel Macchiato",
    isDark: false,
    background: "#FDFBF7",
    surface: "#F4EDE2",
    surfaceRaised: "#F9F4EC",
    primary: "#935C30",
    primaryDark: "#6E3F19",
    secondary: "#D4A373",
    accent: "#B45309",
    text: "#2B1D11",
    textMuted: "#6B5542",
    border: "rgba(147, 92, 48, 0.32)",
    borderStrong: "rgba(147, 92, 48, 0.6)",
  },
  {
    namePrefix: "Ocean Abyss",
    isDark: true,
    background: "#070E1B",
    surface: "#0E1C34",
    surfaceRaised: "#15284B",
    primary: "#3B82F6",
    primaryDark: "#1D4ED8",
    secondary: "#60A5FA",
    accent: "#38BDF8",
    text: "#F0F7FF",
    textMuted: "#93C5FD",
    border: "rgba(59, 130, 246, 0.32)",
    borderStrong: "rgba(59, 130, 246, 0.6)",
  },
  {
    namePrefix: "Eucalyptus Mist",
    isDark: false,
    background: "#F2F7F6",
    surface: "#DEECE9",
    surfaceRaised: "#E9F2F0",
    primary: "#238276",
    primaryDark: "#165E55",
    secondary: "#78C0B7",
    accent: "#0F766E",
    text: "#152E2B",
    textMuted: "#4B6B66",
    border: "rgba(35, 130, 118, 0.32)",
    borderStrong: "rgba(35, 130, 118, 0.6)",
  },
  {
    namePrefix: "Solar Flare",
    isDark: true,
    background: "#100B05",
    surface: "#21150A",
    surfaceRaised: "#312010",
    primary: "#F59E0B",
    primaryDark: "#B45309",
    secondary: "#FB923C",
    accent: "#FCD34D",
    text: "#FFFBEB",
    textMuted: "#FDE68A",
    border: "rgba(245, 158, 11, 0.35)",
    borderStrong: "rgba(245, 158, 11, 0.65)",
  }
];

const SUFFIXES = ["Aura", "Vibe", "Glow", "Horizon", "Echo", "Luxe", "Bloom", "Essence", "Pulse", "Wave", "Flow", "Breeze"];
const RADII = ["0.5rem", "0.85rem", "1.25rem", "1.8rem"];
const FONTS = [
  "'Inter', sans-serif", 
  "'Plus Jakarta Sans', sans-serif", 
  "'Space Grotesk', sans-serif", 
  "'Outfit', sans-serif"
];

export const generateHarmonicTheme = () => {
  const archetype = HARMONIC_ARCHETYPES[Math.floor(Math.random() * HARMONIC_ARCHETYPES.length)];
  const suffix = SUFFIXES[Math.floor(Math.random() * SUFFIXES.length)];
  const cardRadius = RADII[Math.floor(Math.random() * RADII.length)];
  const fontFamily = FONTS[Math.floor(Math.random() * FONTS.length)];

  return {
    id: `random-${Date.now()}`,
    name: `${archetype.namePrefix} ${suffix}`,
    description: `A generated ${archetype.isDark ? "dark" : "light"} aesthetic theme with harmonious contrast.`,
    background: archetype.background,
    surface: archetype.surface,
    surfaceRaised: archetype.surfaceRaised,
    primary: archetype.primary,
    primaryDark: archetype.primaryDark,
    secondary: archetype.secondary,
    accent: archetype.accent,
    text: archetype.text,
    textMuted: archetype.textMuted,
    border: archetype.border,
    borderStrong: archetype.borderStrong,
    cardRadius,
    glassBlur: "16px",
    fontFamily,
  };
};

const ThemeContext = createContext();

export const applyThemeToDOM = (t) => {
  if (!t || typeof document === "undefined") return;
  const root = document.documentElement;

  if (t.primary) root.style.setProperty("--primary", t.primary);
  if (t.primaryDark) root.style.setProperty("--primary-dark", t.primaryDark);
  if (t.secondary) root.style.setProperty("--secondary", t.secondary);
  if (t.accent) root.style.setProperty("--accent", t.accent);
  if (t.background) root.style.setProperty("--background", t.background);
  if (t.surface) root.style.setProperty("--surface", t.surface);
  if (t.surfaceRaised) root.style.setProperty("--surface-raised", t.surfaceRaised);
  if (t.text) root.style.setProperty("--text", t.text);
  if (t.textMuted) root.style.setProperty("--text-muted", t.textMuted);
  if (t.border) root.style.setProperty("--border", t.border);
  if (t.borderStrong) root.style.setProperty("--border-strong", t.borderStrong);

  // Dynamic gradients
  const primaryEnd = t.primaryDark || t.secondary || t.primary;
  root.style.setProperty("--grad-primary", `linear-gradient(135deg, ${t.primary} 0%, ${primaryEnd} 100%)`);
  root.style.setProperty("--grad-secondary", `linear-gradient(135deg, ${t.secondary || t.surface} 0%, ${t.primary} 100%)`);
  root.style.setProperty("--grad-surface", `linear-gradient(180deg, ${t.surface} 0%, ${t.background} 100%)`);

  // Glowing shadows and glass transparency
  root.style.setProperty("--shadow-glow", `0 0 24px ${t.primary}55`);
  root.style.setProperty("--glass", `${t.surface}bf`);

  // Micro-details
  if (t.cardRadius) root.style.setProperty("--radius-card", t.cardRadius);
  if (t.glassBlur) root.style.setProperty("--glass-blur", t.glassBlur);
  if (t.fontFamily) {
    document.body.style.fontFamily = t.fontFamily;
  }
};

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(() => {
    try {
      const cached = localStorage.getItem("devportfolio_theme");
      if (cached) {
        const parsed = JSON.parse(cached);
        applyThemeToDOM(parsed);
        return parsed;
      }
    } catch (e) {
      console.warn("Theme cache read failed:", e);
    }
    applyThemeToDOM(DEFAULT_THEME);
    return DEFAULT_THEME;
  });

  const [savedCustomThemes, setSavedCustomThemes] = useState(() => {
    try {
      const cachedCustom = localStorage.getItem("devportfolio_custom_themes");
      if (cachedCustom) {
        return JSON.parse(cachedCustom);
      }
    } catch (e) {
      console.warn("Custom themes cache read failed:", e);
    }
    return [];
  });

  const [savingTheme, setSavingTheme] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Real-time synchronization of active theme from Firestore
  useEffect(() => {
    if (!db) return;
    const themeDocRef = doc(db, "events", "_theme");

    const unsubscribe = onSnapshot(themeDocRef, (snap) => {
      if (snap.exists()) {
        const data = snap.data();
        if (data && data.background) {
          setTheme(data);
          applyThemeToDOM(data);
          try {
            localStorage.setItem("devportfolio_theme", JSON.stringify(data));
          } catch (e) {
            console.warn("Theme storage write failed:", e);
          }
        }
      }
    }, (err) => {
      console.warn("Theme subscription notice (using local theme):", err.message);
    });

    return () => unsubscribe();
  }, []);

  // Real-time synchronization of saved custom themes from Firestore
  useEffect(() => {
    if (!db) return;
    const libraryDocRef = doc(db, "events", "_theme_library");

    const unsubscribe = onSnapshot(libraryDocRef, (snap) => {
      if (snap.exists()) {
        const data = snap.data();
        if (data && Array.isArray(data.themes)) {
          setSavedCustomThemes(data.themes);
          try {
            localStorage.setItem("devportfolio_custom_themes", JSON.stringify(data.themes));
          } catch (e) {
            console.warn("Custom themes storage write failed:", e);
          }
        }
      }
    }, (err) => {
      console.warn("Theme library subscription notice:", err.message);
    });

    return () => unsubscribe();
  }, []);

  // Update theme in memory & DOM immediately for real-time live preview
  const previewTheme = (newValues) => {
    const updated = { ...theme, ...newValues };
    setTheme(updated);
    applyThemeToDOM(updated);
  };

  // Apply one of the curated presets
  const applyPreset = (presetId) => {
    const found = THEME_PRESETS.find((p) => p.id === presetId);
    if (found) {
      previewTheme(found);
    }
  };

  // Save the customized theme permanently to Firestore as the LIVE portfolio theme
  const saveThemeLive = async (customThemeObj) => {
    const target = customThemeObj || theme;
    setSavingTheme(true);
    setSaveSuccess(false);

    try {
      if (db) {
        const themeDocRef = doc(db, "events", "_theme");
        await setDoc(themeDocRef, {
          ...target,
          updatedAt: serverTimestamp(),
        }, { merge: true });
      }

      localStorage.setItem("devportfolio_theme", JSON.stringify(target));
      applyThemeToDOM(target);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
      return true;
    } catch (err) {
      console.error("Save theme error:", err);
      localStorage.setItem("devportfolio_theme", JSON.stringify(target));
      applyThemeToDOM(target);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
      return true;
    } finally {
      setSavingTheme(false);
    }
  };

  // Save a theme into the User's Custom Saved Themes Library with a custom name
  const saveCustomTheme = async (customName, themeData) => {
    const newEntry = {
      ...themeData,
      id: themeData.id && themeData.id.startsWith("custom-") ? themeData.id : `custom-${Date.now()}`,
      name: customName.trim() || `My Theme #${savedCustomThemes.length + 1}`,
      createdAt: new Date().toISOString(),
    };

    const existingIndex = savedCustomThemes.findIndex((t) => t.id === newEntry.id);
    let updatedList;
    if (existingIndex >= 0) {
      updatedList = [...savedCustomThemes];
      updatedList[existingIndex] = newEntry;
    } else {
      updatedList = [newEntry, ...savedCustomThemes];
    }

    setSavedCustomThemes(updatedList);
    try {
      localStorage.setItem("devportfolio_custom_themes", JSON.stringify(updatedList));
      if (db) {
        const libraryDocRef = doc(db, "events", "_theme_library");
        await setDoc(libraryDocRef, {
          themes: updatedList,
          updatedAt: serverTimestamp(),
        }, { merge: true });
      }
      return newEntry;
    } catch (e) {
      console.error("Error saving custom theme to library:", e);
      return newEntry;
    }
  };

  // Delete a theme from User's Custom Saved Themes Library
  const deleteCustomTheme = async (id) => {
    const updatedList = savedCustomThemes.filter((t) => t.id !== id);
    setSavedCustomThemes(updatedList);
    try {
      localStorage.setItem("devportfolio_custom_themes", JSON.stringify(updatedList));
      if (db) {
        const libraryDocRef = doc(db, "events", "_theme_library");
        await setDoc(libraryDocRef, {
          themes: updatedList,
          updatedAt: serverTimestamp(),
        }, { merge: true });
      }
    } catch (e) {
      console.error("Error deleting custom theme:", e);
    }
  };

  // Reset to default Blush Rose palette
  const resetToDefaultTheme = async () => {
    previewTheme(DEFAULT_THEME);
    await saveThemeLive(DEFAULT_THEME);
  };

  return (
    <ThemeContext.Provider
      value={{
        theme,
        previewTheme,
        applyPreset,
        saveThemeLive,
        resetToDefaultTheme,
        generateHarmonicTheme,
        savedCustomThemes,
        saveCustomTheme,
        deleteCustomTheme,
        savingTheme,
        saveSuccess,
        presets: THEME_PRESETS,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};
