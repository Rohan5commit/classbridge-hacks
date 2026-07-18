"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { ReadAloudButton } from "./read-aloud-button";
import {
  BookOpen,
  Target,
  AlertTriangle,
  Heart,
  ArrowRight,
  ArrowLeft,
  CheckCircle,
} from "lucide-react";
import { AdultSupportSummary } from "@/lib/schemas";

interface AdultSummaryViewProps {
  summary: AdultSupportSummary;
}

export function AdultSummaryView({ summary }: AdultSummaryViewProps) {
  const [showFull, setShowFull] = useState(false);

  return (
    <div className="mx-auto max-w-2xl">
      {/* Header */}
      <div className="mb-6 rounded-2xl bg-gradient-to-r from-[var(--cb-primary)]/10 to-[var(--cb-accent)]/10 p-6">
        <h2 className="flex items-center gap-2 text-xl font-bold text-[var(--cb-text)]">
          <BookOpen className="h-5 w-5 text-[var(--cb-primary)]" />
          Parent / Teacher Summary
        </h2>
        <p className="mt-1 text-sm text-[var(--cb-text-muted)]">
          A quick overview to help adults support the student&apos;s learning
        </p>
      </div>

      {/* Topic covered */}
      <div className="mb-4 rounded-xl border border-border/50 bg-white p-5">
        <h3 className="mb-2 text-sm font-bold text-[var(--cb-text-muted)] uppercase tracking-wide">
          Topic Covered
        </h3>
        <p className="text-base font-semibold text-[var(--cb-text)]">
          {summary.topicCovered}
        </p>
      </div>

      {/* Key Concepts */}
      <div className="mb-4 rounded-xl border border-border/50 bg-white p-5">
        <h3 className="mb-3 flex items-center gap-2 text-sm font-bold text-[var(--cb-text-muted)] uppercase tracking-wide">
          <Target className="h-4 w-4" /> Key Concepts
        </h3>
        <div className="flex flex-wrap gap-2">
          {summary.keyConcepts.map((concept, i) => (
            <span
              key={i}
              className="rounded-full bg-[var(--cb-primary)]/10 px-3 py-1 text-sm font-medium text-[var(--cb-primary)]"
            >
              {concept}
            </span>
          ))}
        </div>
      </div>

      {/* Difficult Concepts */}
      <div className="mb-4 rounded-xl border border-amber-200 bg-amber-50/50 p-5">
        <h3 className="mb-3 flex items-center gap-2 text-sm font-bold text-amber-700 uppercase tracking-wide">
          <AlertTriangle className="h-4 w-4" /> Concepts That May Be Difficult
        </h3>
        <div className="space-y-3">
          {summary.difficultConcepts.map((item, i) => (
            <div key={i} className="rounded-lg bg-white p-3">
              <p className="font-semibold text-[var(--cb-text)]">{item.concept}</p>
              <p className="mt-1 text-sm text-[var(--cb-text-muted)]">{item.whyDifficult}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Revision Suggestion */}
      <div className="mb-4 rounded-xl border border-border/50 bg-white p-5">
        <h3 className="mb-2 text-sm font-bold text-[var(--cb-text-muted)] uppercase tracking-wide">
          📝 Revision Suggestion
        </h3>
        <p className="text-sm leading-relaxed text-[var(--cb-text)]">
          {summary.revisionSuggestion}
        </p>
      </div>

      {/* Adult Support */}
      <div className="mb-4 rounded-xl border border-emerald-200 bg-emerald-50/50 p-5">
        <h3 className="mb-2 flex items-center gap-2 text-sm font-bold text-emerald-700 uppercase tracking-wide">
          <Heart className="h-4 w-4" /> How an Adult Can Help
        </h3>
        <p className="text-sm leading-relaxed text-[var(--cb-text)]">
          {summary.adultSupportSuggestion}
        </p>
      </div>

      {/* Encouragement */}
      <div className="mt-6 rounded-2xl bg-gradient-to-r from-[var(--cb-accent)]/10 to-[var(--cb-primary)]/10 p-6 text-center">
        <p className="text-lg font-semibold text-[var(--cb-text)]">
          {summary.encouragementNote}
        </p>
        <ReadAloudButton
          text={summary.encouragementNote}
          className="mt-3 justify-center"
          label="Read encouragement aloud"
        />
      </div>

      {/* Action */}
      <div className="mt-8 flex justify-center">
        <a
          href="/upload"
          className="inline-flex items-center gap-2 rounded-xl bg-[var(--cb-primary)] px-8 py-3 text-sm font-semibold text-white shadow-md transition-all hover:bg-[var(--cb-primary-dark)] hover:shadow-lg"
        >
          Start New Session
          <ArrowRight className="h-4 w-4" />
        </a>
      </div>
    </div>
  );
}
