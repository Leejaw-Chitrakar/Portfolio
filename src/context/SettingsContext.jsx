import React, { createContext, useContext, useState, useEffect } from "react";
import { doc, onSnapshot, setDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase/config";

export const DEFAULT_SETTINGS = {
  mouseEffect: true,
  mouseDensity: "balanced", // "subtle" | "balanced" | "dense"
  reducedMotion: false,
  showEventsSection: true,
  siteStatusBadge: "Available for new projects",
};

const SettingsContext = createContext();

export const SettingsProvider = ({ children }) => {
  const [settings, setSettings] = useState(() => {
    try {
      const cached = localStorage.getItem("devportfolio_settings");
      if (cached) {
        return { ...DEFAULT_SETTINGS, ...JSON.parse(cached) };
      }
    } catch (e) {
      console.warn("Settings local storage read failed:", e);
    }
    return DEFAULT_SETTINGS;
  });

  const [savingSettings, setSavingSettings] = useState(false);

  // Real-time synchronization of settings from Firestore
  useEffect(() => {
    if (!db) return;
    const settingsRef = doc(db, "events", "_settings");

    const unsubscribe = onSnapshot(settingsRef, (snap) => {
      if (snap.exists()) {
        const remoteData = snap.data();
        if (remoteData) {
          setSettings((prev) => {
            const merged = { ...prev, ...remoteData };
            try {
              localStorage.setItem("devportfolio_settings", JSON.stringify(merged));
            } catch (err) {
              console.warn("Settings storage write failed:", err);
            }
            return merged;
          });
        }
      }
    }, (err) => {
      console.warn("Settings subscription notice (using local):", err.message);
    });

    return () => unsubscribe();
  }, []);

  // Update a single setting or multiple settings
  const updateSettings = async (partial) => {
    setSavingSettings(true);
    const updated = { ...settings, ...partial };
    setSettings(updated);

    try {
      localStorage.setItem("devportfolio_settings", JSON.stringify(updated));
    } catch (e) {
      console.warn("Settings cache write error:", e);
    }

    if (db) {
      try {
        const settingsRef = doc(db, "events", "_settings");
        await setDoc(settingsRef, {
          ...partial,
          updatedAt: serverTimestamp()
        }, { merge: true });
      } catch (err) {
        console.error("Failed to persist settings to Firestore:", err);
      }
    }
    setSavingSettings(false);
  };

  const resetSettings = async () => {
    setSavingSettings(true);
    setSettings(DEFAULT_SETTINGS);
    try {
      localStorage.setItem("devportfolio_settings", JSON.stringify(DEFAULT_SETTINGS));
    } catch (e) {
      console.warn("Settings cache clear error:", e);
    }

    if (db) {
      try {
        const settingsRef = doc(db, "events", "_settings");
        await setDoc(settingsRef, {
          ...DEFAULT_SETTINGS,
          updatedAt: serverTimestamp()
        });
      } catch (err) {
        console.error("Failed to reset settings in Firestore:", err);
      }
    }
    setSavingSettings(false);
  };

  return (
    <SettingsContext.Provider
      value={{
        settings,
        updateSettings,
        resetSettings,
        savingSettings,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => {
  const ctx = useContext(SettingsContext);
  if (!ctx) {
    return {
      settings: DEFAULT_SETTINGS,
      updateSettings: () => {},
      resetSettings: () => {},
      savingSettings: false,
    };
  }
  return ctx;
};
