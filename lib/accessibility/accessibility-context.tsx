"use client";

import { createContext, useContext, useState, useCallback, useEffect } from "react";
import { AccessibilityPrefs } from "../schemas";

interface AccessibilityContextType {
  prefs: AccessibilityPrefs;
  setPrefs: (prefs: AccessibilityPrefs) => void;
  updatePref: <K extends keyof AccessibilityPrefs>(key: K, value: AccessibilityPrefs[K]) => void;
  resetPrefs: () => void;
}

const defaultPrefs: AccessibilityPrefs = {
  fontSize: 16,
  dyslexiaMode: false,
  highContrast: false,
  reducedMotion: false,
  letterSpacing: "normal",
  lineSpacing: "normal",
};

const AccessibilityContext = createContext<AccessibilityContextType | undefined>(undefined);

export function AccessibilityProvider({ children }: { children: React.ReactNode }) {
  const [prefs, setPrefsState] = useState<AccessibilityPrefs>(() => {
    if (typeof window === "undefined") return defaultPrefs;
    try {
      const stored = localStorage.getItem("classbridge-a11y");
      if (stored) {
        const parsed = JSON.parse(stored);
        return { ...defaultPrefs, ...parsed };
      }
    } catch {
      // ignore
    }
    return defaultPrefs;
  });

  // Save to localStorage and apply to document on change
  useEffect(() => {
    try {
      localStorage.setItem("classbridge-a11y", JSON.stringify(prefs));
    } catch {
      // ignore
    }

    // Apply classes to document root
    const root = document.documentElement;
    root.style.fontSize = `${prefs.fontSize}px`;
    root.classList.toggle("high-contrast", prefs.highContrast);
    root.classList.toggle("dyslexia-mode", prefs.dyslexiaMode);
    root.classList.toggle("reduced-motion", prefs.reducedMotion);
    root.classList.toggle("wide", prefs.letterSpacing === "wide" && prefs.dyslexiaMode);
    root.classList.toggle("wider", prefs.letterSpacing === "wider" && prefs.dyslexiaMode);
    root.classList.toggle("line-relaxed", prefs.lineSpacing === "relaxed");
    root.classList.toggle("line-loose", prefs.lineSpacing === "loose");
  }, [prefs]);

  const setPrefs = useCallback((newPrefs: AccessibilityPrefs) => {
    setPrefsState(newPrefs);
  }, []);

  const updatePref = useCallback(
    <K extends keyof AccessibilityPrefs>(key: K, value: AccessibilityPrefs[K]) => {
      setPrefsState((prev) => ({ ...prev, [key]: value }));
    },
    []
  );

  const resetPrefs = useCallback(() => {
    setPrefsState(defaultPrefs);
  }, []);

  return (
    <AccessibilityContext.Provider value={{ prefs, setPrefs, updatePref, resetPrefs }}>
      {children}
    </AccessibilityContext.Provider>
  );
}

export function useAccessibility() {
  const context = useContext(AccessibilityContext);
  if (!context) {
    throw new Error("useAccessibility must be used within an AccessibilityProvider");
  }
  return context;
}
