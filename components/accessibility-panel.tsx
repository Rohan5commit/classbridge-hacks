"use client";

import { useState } from "react";
import { useAccessibility } from "@/lib/accessibility/accessibility-context";
import {
  Settings,
  Type,
  Contrast,
  Zap,
  Space,
  X,
  RotateCcw,
} from "lucide-react";
import { cn } from "@/lib/utils";

export function AccessibilityPanel() {
  const { prefs, updatePref, resetPrefs } = useAccessibility();
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Floating trigger button */}
      <button
        onClick={() => setOpen(!open)}
        className={cn(
          "fixed bottom-6 right-6 z-50 flex h-12 w-12 items-center justify-center rounded-full shadow-lg transition-all duration-200 no-print",
          open
            ? "bg-[var(--cb-text)] text-white"
            : "bg-[var(--cb-primary)] text-white hover:bg-[var(--cb-primary-dark)] hover:shadow-xl"
        )}
        aria-label="Accessibility settings"
        aria-expanded={open}
      >
        {open ? <X className="h-5 w-5" /> : <Settings className="h-5 w-5" />}
      </button>

      {/* Panel */}
      {open && (
        <div className="fixed bottom-20 right-6 z-50 w-80 rounded-2xl border border-border bg-white p-6 shadow-2xl no-print" role="dialog" aria-label="Accessibility preferences">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-base font-bold text-[var(--cb-text)]">Accessibility</h3>
            <button onClick={resetPrefs} className="flex items-center gap-1 text-xs text-[var(--cb-text-muted)] hover:text-[var(--cb-primary)]" aria-label="Reset all preferences">
              <RotateCcw className="h-3 w-3" />
              Reset
            </button>
          </div>

          {/* Font Size */}
          <div className="mb-4">
            <label className="mb-1 flex items-center gap-2 text-xs font-semibold text-[var(--cb-text-muted)]">
              <Type className="h-3.5 w-3.5" /> Font Size: {prefs.fontSize}px
            </label>
            <input
              type="range"
              min={12}
              max={28}
              value={prefs.fontSize}
              onChange={(e) => updatePref("fontSize", Number(e.target.value))}
              className="w-full accent-[var(--cb-primary)]"
              aria-label={`Font size: ${prefs.fontSize}px`}
            />
            <div className="flex justify-between text-[10px] text-[var(--cb-text-muted)]">
              <span>Small</span>
              <span>Large</span>
            </div>
          </div>

          {/* Toggle switches */}
          <div className="space-y-3">
            <ToggleRow
              icon={<Space className="h-3.5 w-3.5" />}
              label="Dyslexia-friendly spacing"
              checked={prefs.dyslexiaMode}
              onChange={(v) => updatePref("dyslexiaMode", v)}
            />
            <ToggleRow
              icon={<Contrast className="h-3.5 w-3.5" />}
              label="High contrast"
              checked={prefs.highContrast}
              onChange={(v) => updatePref("highContrast", v)}
            />
            <ToggleRow
              icon={<Zap className="h-3.5 w-3.5" />}
              label="Reduced motion"
              checked={prefs.reducedMotion}
              onChange={(v) => updatePref("reducedMotion", v)}
            />
          </div>

          {/* Letter spacing (shown when dyslexia mode is on) */}
          {prefs.dyslexiaMode && (
            <div className="mt-4 rounded-lg bg-[var(--cb-warm)] p-3">
              <label className="mb-2 block text-xs font-semibold text-[var(--cb-text-muted)]">
                Letter Spacing
              </label>
              <div className="flex gap-2">
                {(["normal", "wide", "wider"] as const).map((level) => (
                  <button
                    key={level}
                    onClick={() => updatePref("letterSpacing", level)}
                    className={cn(
                      "flex-1 rounded-lg px-3 py-1.5 text-xs font-medium capitalize transition-all",
                      prefs.letterSpacing === level
                        ? "bg-[var(--cb-primary)] text-white"
                        : "bg-white text-[var(--cb-text-muted)] hover:bg-white/80"
                    )}
                  >
                    {level}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Line spacing */}
          <div className="mt-4">
            <label className="mb-2 block text-xs font-semibold text-[var(--cb-text-muted)]">
              Line Spacing
            </label>
            <div className="flex gap-2">
              {(["normal", "relaxed", "loose"] as const).map((level) => (
                <button
                  key={level}
                  onClick={() => updatePref("lineSpacing", level)}
                  className={cn(
                    "flex-1 rounded-lg px-3 py-1.5 text-xs font-medium capitalize transition-all",
                    prefs.lineSpacing === level
                      ? "bg-[var(--cb-primary)] text-white"
                      : "bg-white text-[var(--cb-text-muted)] hover:bg-white/80"
                  )}
                >
                  {level}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function ToggleRow({
  icon,
  label,
  checked,
  onChange,
}: {
  icon: React.ReactNode;
  label: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <label className="flex cursor-pointer items-center justify-between rounded-lg px-3 py-2 hover:bg-[var(--cb-warm)]">
      <span className="flex items-center gap-2 text-sm text-[var(--cb-text)]">
        {icon}
        {label}
      </span>
      <button
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={cn(
          "relative inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full transition-colors duration-200",
          checked ? "bg-[var(--cb-primary)]" : "bg-gray-300"
        )}
      >
        <span
          className={cn(
            "inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform duration-200",
            checked ? "translate-x-6" : "translate-x-1"
          )}
        />
      </button>
    </label>
  );
}
