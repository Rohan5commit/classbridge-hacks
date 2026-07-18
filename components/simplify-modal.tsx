"use client";

import { SimplifySelectionResponse } from "@/lib/schemas";
import { X, Lightbulb, MessageSquare, Languages } from "lucide-react";

interface SimplifyModalProps {
  result: SimplifySelectionResponse;
  onClose: () => void;
}

export function SimplifyModal({ result, onClose }: SimplifyModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="flex items-center gap-2 text-lg font-bold text-[var(--cb-text)]">
            <Lightbulb className="h-5 w-5 text-amber-500" />
            Explain This Simply
          </h3>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 hover:bg-[var(--cb-warm)]"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Simple Rewrite */}
        <div className="mb-4 rounded-xl bg-blue-50 p-4">
          <h4 className="mb-1 text-xs font-bold text-blue-600 uppercase tracking-wide">
            Simple Version
          </h4>
          <p className="text-sm leading-relaxed text-[var(--cb-text)]">
            {result.simpleRewrite}
          </p>
        </div>

        {/* Analogy */}
        <div className="mb-4 rounded-xl bg-emerald-50 p-4">
          <h4 className="mb-1 flex items-center gap-1 text-xs font-bold text-emerald-600 uppercase tracking-wide">
            <MessageSquare className="h-3 w-3" /> Analogy
          </h4>
          <p className="text-sm leading-relaxed text-[var(--cb-text)]">
            {result.analogy}
          </p>
        </div>

        {/* Key Words */}
        <div className="mb-4">
          <h4 className="mb-2 text-xs font-bold text-[var(--cb-text-muted)] uppercase tracking-wide">
            Key Words
          </h4>
          <div className="flex flex-wrap gap-2">
            {result.keyWords.map((word, i) => (
              <span
                key={i}
                className="rounded-full bg-purple-100 px-3 py-1 text-xs font-semibold text-purple-700"
              >
                {word}
              </span>
            ))}
          </div>
        </div>

        {/* Translation */}
        {result.translation && (
          <div className="rounded-xl bg-amber-50 p-4">
            <h4 className="mb-1 flex items-center gap-1 text-xs font-bold text-amber-600 uppercase tracking-wide">
              <Languages className="h-3 w-3" /> Translation
            </h4>
            <p className="text-sm leading-relaxed text-[var(--cb-text)]">
              {result.translation}
            </p>
          </div>
        )}

        <button
          onClick={onClose}
          className="mt-4 w-full rounded-xl bg-[var(--cb-primary)] py-2.5 text-sm font-semibold text-white hover:bg-[var(--cb-primary-dark)]"
        >
          Got it!
        </button>
      </div>
    </div>
  );
}
