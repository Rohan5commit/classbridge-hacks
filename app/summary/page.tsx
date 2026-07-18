"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AdultSummaryView } from "@/components/adult-summary-view";
import { AdultSupportSummary } from "@/lib/schemas";
import { ArrowLeft, Loader2 } from "lucide-react";

export default function SummaryPage() {
  const router = useRouter();
  const [summary, setSummary] = useState<AdultSupportSummary | null>(null);

  useEffect(() => {
    const stored = sessionStorage.getItem("classbridge-adult-summary");
    if (stored) {
      setSummary(JSON.parse(stored));
    } else {
      router.push("/learning-pack");
    }
  }, [router]);

  if (!summary) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-[var(--cb-primary)]" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
      <div className="mb-8">
        <button
          onClick={() => router.push("/learning-pack")}
          className="flex items-center gap-2 text-sm text-[var(--cb-text-muted)] hover:text-[var(--cb-text)]"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Learning Pack
        </button>
      </div>

      <AdultSummaryView summary={summary} />
    </div>
  );
}
