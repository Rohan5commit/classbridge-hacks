"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { ReadAloudButton } from "./read-aloud-button";
import { SimplifyModal } from "./simplify-modal";
import { SimplifySelectionResponse } from "@/lib/schemas";
import {
  ArrowRight,
  ArrowLeft,
  CheckCircle,
  Copy,
  ExternalLink,
} from "lucide-react";

interface OriginalTextViewProps {
  text: string;
  title: string;
  subject: string;
  confidence: number;
  needsReview: boolean;
}

export function OriginalTextView({
  text,
  title,
  subject,
  confidence,
  needsReview,
}: OriginalTextViewProps) {
  return (
    <div className="rounded-2xl border border-border/50 bg-white p-6">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h3 className="text-lg font-bold text-[var(--cb-text)]">{title}</h3>
          <p className="text-sm text-[var(--cb-text-muted)]">{subject}</p>
        </div>
        <div className="flex items-center gap-2">
          <span
            className={cn(
              "rounded-full px-3 py-1 text-xs font-semibold",
              confidence >= 0.8
                ? "bg-green-50 text-green-600"
                : "bg-amber-50 text-amber-600"
            )}
          >
            {Math.round(confidence * 100)}% confidence
          </span>
          {needsReview && (
            <span className="rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-600">
              Review needed
            </span>
          )}
        </div>
      </div>
      <ReadAloudButton text={text} className="mb-4" />
      <div className="max-h-64 overflow-y-auto rounded-xl bg-[var(--cb-warm)] p-4">
        <pre className="whitespace-pre-wrap text-sm leading-relaxed text-[var(--cb-text)] font-sans">
          {text}
        </pre>
      </div>
    </div>
  );
}
