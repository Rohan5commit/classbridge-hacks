"use client";

import { AccessibilityProvider } from "@/lib/accessibility/accessibility-context";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Navbar } from "@/components/navbar";
import { AccessibilityPanel } from "@/components/accessibility-panel";

export function ClientProviders({ children }: { children: React.ReactNode }) {
  return (
    <AccessibilityProvider>
      <TooltipProvider>
        <Navbar />
        <main id="main-content" className="flex-1">
          {children}
        </main>
        <footer className="border-t border-border/50 bg-[var(--cb-surface)] py-8 text-center text-sm text-[var(--cb-text-muted)] no-print">
          <div className="mx-auto max-w-6xl px-4">
            <p className="font-semibold text-[var(--cb-text)]">ClassBridge</p>
            <p className="mt-1">
              Making school content accessible for every student.
            </p>
            <p className="mt-2 text-xs">
              Built for TechCommons Hacks V1 · Global & Local Impact · Education & Accessibility
            </p>
          </div>
        </footer>
        <AccessibilityPanel />
      </TooltipProvider>
    </AccessibilityProvider>
  );
}
