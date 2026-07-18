"use client";

import { ReadAloudButton } from "./read-aloud-button";
import { SimplifiedExplanation } from "@/lib/schemas";
import {
  Lightbulb,
  BookOpen,
  Star,
  ArrowRight,
  HelpCircle,
} from "lucide-react";

interface ExplanationViewProps {
  explanation: SimplifiedExplanation;
}

export function ExplanationView({ explanation }: ExplanationViewProps) {
  return (
    <div className="space-y-6">
      {/* Title & Read Aloud */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-[var(--cb-text)]">
            {explanation.title}
          </h2>
          <p className="mt-1 text-sm text-[var(--cb-text-muted)]">
            Simplified for {explanation.gradeLevel}
          </p>
        </div>
        <ReadAloudButton
          text={`${explanation.simpleExplanation}. ${explanation.stepByStep.join(". ")}`}
          label="Read explanation"
        />
      </div>

      {/* Simple Explanation */}
      <div className="rounded-2xl bg-blue-50/80 p-6">
        <h3 className="mb-3 flex items-center gap-2 text-base font-bold text-blue-800">
          <Lightbulb className="h-5 w-5" />
          Simple Explanation
        </h3>
        <p className="text-[15px] leading-relaxed text-[var(--cb-text)]">
          {explanation.simpleExplanation}
        </p>
      </div>

      {/* Step by Step */}
      <div className="rounded-2xl border border-border/50 bg-white p-6">
        <h3 className="mb-4 flex items-center gap-2 text-base font-bold text-[var(--cb-text)]">
          <ArrowRight className="h-5 w-5 text-[var(--cb-primary)]" />
          Step-by-Step Breakdown
        </h3>
        <ol className="space-y-3">
          {explanation.stepByStep.map((step, i) => (
            <li key={i} className="flex gap-3">
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[var(--cb-primary)] text-xs font-bold text-white">
                {i + 1}
              </span>
              <p className="text-sm leading-relaxed text-[var(--cb-text)] pt-1">
                {step}
              </p>
            </li>
          ))}
        </ol>
      </div>

      {/* Key Vocabulary */}
      <div className="rounded-2xl border border-border/50 bg-white p-6">
        <h3 className="mb-4 flex items-center gap-2 text-base font-bold text-[var(--cb-text)]">
          <BookOpen className="h-5 w-5 text-[var(--cb-primary)]" />
          Key Vocabulary
        </h3>
        <div className="space-y-3">
          {explanation.keyVocabulary.map((vocab, i) => (
            <div key={i} className="rounded-xl bg-[var(--cb-warm)] p-4">
              <p className="font-semibold text-[var(--cb-text)]">{vocab.term}</p>
              <p className="mt-1 text-sm text-[var(--cb-text-muted)]">
                {vocab.definition}
              </p>
              {vocab.example && (
                <p className="mt-1 text-xs text-[var(--cb-text-muted)] italic">
                  Example: {vocab.example}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Real-life Analogy */}
      <div className="rounded-2xl bg-emerald-50/80 p-6">
        <h3 className="mb-3 flex items-center gap-2 text-base font-bold text-emerald-800">
          <Star className="h-5 w-5" />
          Real-Life Analogy
        </h3>
        <p className="text-[15px] leading-relaxed text-[var(--cb-text)]">
          {explanation.realLifeAnalogy}
        </p>
      </div>

      {/* Important Facts */}
      <div className="rounded-2xl bg-amber-50/80 p-6">
        <h3 className="mb-3 flex items-center gap-2 text-base font-bold text-amber-800">
          <HelpCircle className="h-5 w-5" />
          Important Facts
        </h3>
        <ul className="space-y-2">
          {explanation.importantFacts.map((fact, i) => (
            <li key={i} className="flex gap-2 text-sm text-[var(--cb-text)]">
              <span className="text-amber-500">•</span>
              <span>{fact}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
