"use client";

import { useState } from "react";

interface StudyCardProps {
  front: string;
  back: string;
  category: string;
  index: number;
}

const categoryColors: Record<string, string> = {
  definition: "from-blue-400 to-blue-600",
  concept: "from-emerald-400 to-teal-600",
  formula: "from-purple-400 to-indigo-600",
  example: "from-amber-400 to-orange-600",
};

const categoryLabels: Record<string, string> = {
  definition: "📖 Definition",
  concept: "💡 Concept",
  formula: "🔢 Formula",
  example: "🌟 Example",
};

export function StudyCard({
  front,
  back,
  category,
  index,
}: StudyCardProps) {
  const [flipped, setFlipped] = useState(false);

  return (
    <div
      className="group h-56 w-full cursor-pointer perspective-1000"
      onClick={() => setFlipped(!flipped)}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          setFlipped(!flipped);
        }
      }}
      role="button"
      aria-label={`Study card: ${front}. Click to ${flipped ? "hide" : "reveal"} answer.`}
      tabIndex={0}
    >
      <div
        className={`relative h-full w-full transition-transform duration-500 [transform-style:preserve-3d] ${
          flipped ? "[transform:rotateY(180deg)]" : ""
        }`}
      >
        {/* Front */}
        <div className="absolute inset-0 rounded-2xl bg-white p-5 shadow-md border border-border/50 [backface-visibility:hidden]">
          <div className="mb-2 flex items-center justify-between">
            <span className="rounded-full bg-[var(--cb-warm)] px-2.5 py-0.5 text-[11px] font-semibold text-[var(--cb-text-muted)]">
              Card {index + 1}
            </span>
            <span className={`rounded-full bg-gradient-to-r ${categoryColors[category] || "from-gray-400 to-gray-600"} px-2.5 py-0.5 text-[11px] font-semibold text-white`}>
              {categoryLabels[category] || category}
            </span>
          </div>
          <div className="mt-4 flex h-28 items-center justify-center">
            <p className="text-center text-lg font-bold text-[var(--cb-text)] leading-snug">
              {front}
            </p>
          </div>
          <p className="text-center text-xs text-[var(--cb-text-muted)]">
            Tap to reveal answer
          </p>
        </div>

        {/* Back */}
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-[var(--cb-primary)] to-[var(--cb-secondary)] p-5 text-white shadow-md [backface-visibility:hidden] [transform:rotateY(180deg)]">
          <div className="mb-2 flex items-center justify-between">
            <span className="rounded-full bg-white/20 px-2.5 py-0.5 text-[11px] font-semibold text-white">
              Answer
            </span>
          </div>
          <div className="mt-3 flex h-28 items-center justify-center overflow-auto">
            <p className="text-center text-sm font-medium leading-relaxed text-white/95">
              {back}
            </p>
          </div>
          <p className="text-center text-xs text-white/70">
            Tap to flip back
          </p>
        </div>
      </div>
    </div>
  );
}
