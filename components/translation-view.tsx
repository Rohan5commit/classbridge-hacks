"use client";

import { ReadAloudButton } from "./read-aloud-button";
import { TranslationOutput } from "@/lib/schemas";
import { Languages, ArrowRightLeft } from "lucide-react";

interface TranslationViewProps {
  translation: TranslationOutput;
}

export function TranslationView({ translation }: TranslationViewProps) {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="flex items-center gap-2 text-xl font-bold text-[var(--cb-text)]">
          <Languages className="h-5 w-5 text-[var(--cb-primary)]" />
          Bilingual View — {translation.language}
        </h2>
        <ReadAloudButton
          text={`${translation.translatedTitle}. ${translation.translatedExplanation}`}
          label={`Read in ${translation.language}`}
        />
      </div>

      {/* Translated Title */}
      <div className="rounded-xl bg-[var(--cb-primary)]/5 p-4">
        <p className="text-xs font-bold text-[var(--cb-text-muted)] uppercase tracking-wide">
          Translated Title
        </p>
        <p className="mt-1 text-lg font-bold text-[var(--cb-text)]">
          {translation.translatedTitle}
        </p>
      </div>

      {/* Side by Side */}
      <div>
        <h3 className="mb-3 flex items-center gap-2 text-base font-bold text-[var(--cb-text)]">
          <ArrowRightLeft className="h-4 w-4 text-[var(--cb-primary)]" />
          Side-by-Side Comparison
        </h3>
        <div className="space-y-3">
          {translation.sideBySide.map((pair, i) => (
            <div key={i} className="grid grid-cols-2 gap-3">
              <div className="rounded-xl bg-blue-50/80 p-4">
                <p className="text-[11px] font-bold text-blue-600 uppercase tracking-wide mb-1">
                  English
                </p>
                <p className="text-sm leading-relaxed text-[var(--cb-text)]">
                  {pair.english}
                </p>
              </div>
              <div className="rounded-xl bg-emerald-50/80 p-4">
                <p className="text-[11px] font-bold text-emerald-600 uppercase tracking-wide mb-1">
                  {translation.language}
                </p>
                <p className="text-sm leading-relaxed text-[var(--cb-text)]">
                  {pair.translated}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Translated Explanation */}
      <div className="rounded-2xl border border-border/50 bg-white p-6">
        <h3 className="mb-3 text-base font-bold text-[var(--cb-text)]">
          Translated Explanation
        </h3>
        <p className="text-sm leading-relaxed text-[var(--cb-text)]">
          {translation.translatedExplanation}
        </p>
      </div>

      {/* Translated Vocabulary */}
      <div className="rounded-2xl border border-border/50 bg-white p-6">
        <h3 className="mb-3 text-base font-bold text-[var(--cb-text)]">
          Translated Vocabulary
        </h3>
        <div className="space-y-2">
          {translation.translatedVocabulary.map((vocab, i) => (
            <div key={i} className="flex items-center justify-between rounded-lg bg-[var(--cb-warm)] px-4 py-2">
              <span className="font-medium text-[var(--cb-text)]">{vocab.term}</span>
              <span className="text-sm text-[var(--cb-text-muted)]">{vocab.definition}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
