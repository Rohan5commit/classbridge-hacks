"use client";

import { useState, useEffect, useCallback, Suspense } from "react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { ExplanationView } from "@/components/explanation-view";
import { TranslationView } from "@/components/translation-view";
import { ReadAloudButton } from "@/components/read-aloud-button";
import { SimplifyModal } from "@/components/simplify-modal";
import { StudyCard as StudyCardComponent } from "@/components/study-card";
import {
  SimplifiedExplanation,
  TranslationOutput,
  StudyCard,
  PracticeQuestion,
  AdultSupportSummary,
  ExtractedContent,
  LearningPreferences,
  SimplifySelectionResponse,
} from "@/lib/schemas";
import {
  ArrowRight,
  Loader2,
  Settings,
  BookOpen,
  Globe,
  Brain,
  MessageSquare,
  ArrowLeft,
} from "lucide-react";

function LearningPackContent() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"explanation" | "translation" | "cards" | "practice" | "summary">("explanation");

  // Data states
  const [extractedContent, setExtractedContent] = useState<ExtractedContent | null>(null);
  const [explanation, setExplanation] = useState<SimplifiedExplanation | null>(null);
  const [translation, setTranslation] = useState<TranslationOutput | null>(null);
  const [studyCards, setStudyCards] = useState<StudyCard[]>([]);
  const [practiceQuestions, setPracticeQuestions] = useState<PracticeQuestion[]>([]);
  const [adultSummary, setAdultSummary] = useState<AdultSupportSummary | null>(null);
  const [preferences, setPreferences] = useState<LearningPreferences>({
    gradeLevel: "Grade 7",
    language: "Tamil",
    learningMode: "Explain simply",
  });

  // Simplify modal
  const [simplifyResult, setSimplifyResult] = useState<SimplifySelectionResponse | null>(null);
  const [showSimplifyModal, setShowSimplifyModal] = useState(false);

  // Track selected text for simplify feature
  const [lastSelectedText, setLastSelectedText] = useState("");

  useEffect(() => {
    const handleMouseUp = () => {
      const selection = window.getSelection();
      const text = selection?.toString().trim();
      if (text && text.length > 10) {
        setLastSelectedText(text);
      }
    };
    document.addEventListener("mouseup", handleMouseUp);
    return () => document.removeEventListener("mouseup", handleMouseUp);
  }, []);

  // Load data and generate learning pack
  useEffect(() => {
    let cancelled = false;

    const generate = async () => {
      try {
        const stored = sessionStorage.getItem("classbridge-content");
        if (!stored) {
          router.push("/upload");
          return;
        }

        const { text, title, subject } = JSON.parse(stored);
        setExtractedContent({
          originalText: text,
          confidence: 0.95,
          title,
          subject,
          wordCount: text.split(/\s+/).length,
          needsReview: false,
        });

        // Load saved preferences
        const savedPrefs = sessionStorage.getItem("classbridge-preferences");
        let prefs: LearningPreferences = preferences;
        if (savedPrefs) {
          prefs = JSON.parse(savedPrefs);
          setPreferences(prefs);
        }

        // Generate learning pack via API
        const response = await fetch("/api/generate-learning-pack", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            text,
            title,
            subject,
            preferences: prefs,
          }),
        });

        if (!response.ok) {
          const errData = await response.json();
          throw new Error(errData.error || "Failed to generate learning pack");
        }

        const data = await response.json();

        if (cancelled) return;

        setExplanation(data.explanation);
        setTranslation(data.translation);
        setStudyCards(data.studyCards || []);
        setPracticeQuestions(data.practiceQuestions || []);
        setAdultSummary(data.adultSummary);

        // Save practice questions and summary for other pages
        if (data.practiceQuestions) {
          sessionStorage.setItem("classbridge-practice-questions", JSON.stringify(data.practiceQuestions));
        }
        if (data.adultSummary) {
          sessionStorage.setItem("classbridge-adult-summary", JSON.stringify(data.adultSummary));
        }

        setLoading(false);
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "Something went wrong");
          setLoading(false);
        }
      }
    };

    generate();
    return () => { cancelled = true; };
  // eslint-disable-next-line react-hooks/exhaustive-deps -- only run once on mount, preferences loaded from sessionStorage inside
  }, [router]);

  // Handle simplify selection
  const handleSimplify = useCallback(async () => {
    if (!lastSelectedText) return;
    const selectedText = lastSelectedText;

    try {
      const response = await fetch("/api/simplify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          selectedText,
          context: extractedContent?.originalText?.slice(0, 500) || "",
          language: preferences.language,
        }),
      });

      if (!response.ok) throw new Error("Failed to simplify");
      const data = await response.json();
      setSimplifyResult(data);
      setShowSimplifyModal(true);
    } catch (err) {
      console.error("Simplify error:", err);
    }
  }, [extractedContent, preferences.language, lastSelectedText]);

  const tabs = [
    { key: "explanation" as const, label: "Explanation", icon: BookOpen },
    { key: "translation" as const, label: "Translation", icon: Globe, disabled: !translation },
    { key: "cards" as const, label: "Study Cards", icon: Brain },
    { key: "practice" as const, label: "Practice", icon: MessageSquare },
    { key: "summary" as const, label: "Parent Summary", icon: Settings },
  ];

  if (loading) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center px-4">
        <div className="relative">
          <div className="h-16 w-16 rounded-full border-4 border-[var(--cb-primary)]/20 border-t-[var(--cb-primary)] animate-spin" />
          <Loader2 className="absolute inset-0 m-auto h-6 w-6 text-[var(--cb-primary)] animate-spin" />
        </div>
        <h2 className="mt-6 text-xl font-bold text-[var(--cb-text)]">
          Building your learning pack...
        </h2>
        <p className="mt-2 text-sm text-[var(--cb-text-muted)]">
          Our AI is simplifying and translating the content for you.
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center px-4">
        <div className="max-w-md rounded-2xl border border-red-200 bg-red-50 p-8 text-center">
          <h2 className="text-xl font-bold text-red-700">Something went wrong</h2>
          <p className="mt-2 text-sm text-red-600">{error}</p>
          <button
            onClick={() => router.push("/upload")}
            className="mt-4 rounded-xl bg-red-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-red-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <button
          onClick={() => router.push("/upload")}
          className="flex items-center gap-2 text-sm text-[var(--cb-text-muted)] hover:text-[var(--cb-text)]"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </button>
        <h1 className="text-lg font-bold text-[var(--cb-text)]">
          Learning Pack
        </h1>
        <ReadAloudButton
          text={explanation?.simpleExplanation || ""}
          label="Read explanation"
        />
      </div>

      {/* Tab navigation */}
      <div className="mb-8 flex gap-1 overflow-x-auto rounded-xl bg-[var(--cb-warm)] p-1">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => !tab.disabled && setActiveTab(tab.key)}
            disabled={tab.disabled}
            className={cn(
              "flex items-center gap-2 whitespace-nowrap rounded-lg px-4 py-2.5 text-sm font-medium transition-all",
              activeTab === tab.key
                ? "bg-white text-[var(--cb-primary)] shadow-sm"
                : tab.disabled
                ? "text-[var(--cb-text-muted)]/40 cursor-not-allowed"
                : "text-[var(--cb-text-muted)] hover:text-[var(--cb-text)]"
            )}
          >
            <tab.icon className="h-4 w-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="min-h-[400px]">
        {activeTab === "explanation" && explanation && (
          <ExplanationView explanation={explanation} />
        )}
        {activeTab === "translation" && translation && (
          <TranslationView translation={translation} />
        )}
        {activeTab === "cards" && (
          <div>
            <h2 className="mb-6 text-2xl font-bold text-[var(--cb-text)]">
              Study Cards
            </h2>
            <p className="mb-6 text-sm text-[var(--cb-text-muted)]">
              Tap any card to reveal the answer. Use the read-aloud button to listen.
            </p>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {studyCards.map((card, i) => (
                <StudyCardComponent key={card.id} front={card.front} back={card.back} category={card.category} index={i} />
              ))}
            </div>
          </div>
        )}
        {activeTab === "practice" && (
          <div>
            <h2 className="mb-6 text-2xl font-bold text-[var(--cb-text)]">
              Practice Questions
            </h2>
            <p className="mb-6 text-sm text-[var(--cb-text-muted)]">
              Test your understanding with these questions.
            </p>
            <div className="space-y-6">
              {practiceQuestions.map((q, i) => (
                <div key={q.id} className="rounded-2xl border border-border/50 bg-white p-6">
                  <div className="mb-3 flex items-center gap-2">
                    <span className={cn(
                      "rounded-full px-3 py-1 text-xs font-semibold",
                      q.type === "multiple_choice" && "bg-blue-50 text-blue-600",
                      q.type === "short_answer" && "bg-emerald-50 text-emerald-600",
                      q.type === "explain_own_words" && "bg-purple-50 text-purple-600"
                    )}>
                      {q.type === "multiple_choice" ? "Multiple Choice" :
                       q.type === "short_answer" ? "Short Answer" : "Explain in Own Words"}
                    </span>
                  </div>
                  <h3 className="mb-4 text-base font-semibold text-[var(--cb-text)]">
                    Q{i + 1}. {q.question}
                  </h3>
                  {q.type === "multiple_choice" && q.options && (
                    <div className="space-y-2">
                      {q.options.map((opt, j) => (
                        <div key={j} className="rounded-xl border border-border/30 px-4 py-2.5 text-sm text-[var(--cb-text)] hover:bg-[var(--cb-warm)]">
                          {String.fromCharCode(65 + j)}. {opt}
                        </div>
                      ))}
                    </div>
                  )}
                  {q.type !== "multiple_choice" && (
                    <textarea
                      placeholder="Type your answer..."
                      className="w-full rounded-xl border border-border/50 p-3 text-sm focus:border-[var(--cb-primary)] focus:outline-none"
                      rows={q.type === "explain_own_words" ? 3 : 2}
                    />
                  )}
                  <div className="mt-3 rounded-xl bg-[var(--cb-warm)] p-3">
                    <p className="text-xs font-semibold text-[var(--cb-text-muted)]">Answer:</p>
                    <p className="text-sm text-[var(--cb-text)]">{q.correctAnswer}</p>
                    <p className="mt-1 text-xs text-[var(--cb-text-muted)]">{q.explanation}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        {activeTab === "summary" && adultSummary && (
          <div className="mx-auto max-w-2xl">
            <h2 className="mb-6 text-2xl font-bold text-[var(--cb-text)]">
              Parent / Teacher Summary
            </h2>
            <div className="space-y-4">
              <div className="rounded-xl border border-border/50 bg-white p-5">
                <h3 className="text-xs font-bold text-[var(--cb-text-muted)] uppercase tracking-wide">Topic</h3>
                <p className="mt-1 font-semibold text-[var(--cb-text)]">{adultSummary.topicCovered}</p>
              </div>
              <div className="rounded-xl border border-border/50 bg-white p-5">
                <h3 className="text-xs font-bold text-[var(--cb-text-muted)] uppercase tracking-wide">Key Concepts</h3>
                <div className="mt-2 flex flex-wrap gap-2">
                  {adultSummary.keyConcepts.map((c, i) => (
                    <span key={i} className="rounded-full bg-[var(--cb-primary)]/10 px-3 py-1 text-xs font-medium text-[var(--cb-primary)]">{c}</span>
                  ))}
                </div>
              </div>
              <div className="rounded-xl border border-amber-200 bg-amber-50/50 p-5">
                <h3 className="text-xs font-bold text-amber-700 uppercase tracking-wide">Difficult Concepts</h3>
                <div className="mt-2 space-y-2">
                  {adultSummary.difficultConcepts.map((d, i) => (
                    <div key={i} className="rounded-lg bg-white p-3">
                      <p className="font-semibold text-[var(--cb-text)]">{d.concept}</p>
                      <p className="text-xs text-[var(--cb-text-muted)]">{d.whyDifficult}</p>
                    </div>
                  ))}
                </div>
              </div>
              <div className="rounded-xl border border-border/50 bg-white p-5">
                <h3 className="text-xs font-bold text-[var(--cb-text-muted)] uppercase tracking-wide">Revision Suggestion</h3>
                <p className="mt-1 text-sm text-[var(--cb-text)]">{adultSummary.revisionSuggestion}</p>
              </div>
              <div className="rounded-xl border border-emerald-200 bg-emerald-50/50 p-5">
                <h3 className="text-xs font-bold text-emerald-700 uppercase tracking-wide">How Adults Can Help</h3>
                <p className="mt-1 text-sm text-[var(--cb-text)]">{adultSummary.adultSupportSuggestion}</p>
              </div>
              <div className="rounded-2xl bg-gradient-to-r from-[var(--cb-accent)]/10 to-[var(--cb-primary)]/10 p-6 text-center">
                <p className="text-lg font-semibold text-[var(--cb-text)]">{adultSummary.encouragementNote}</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Bottom actions */}
      <div className="mt-12 flex justify-center gap-4">
        <button
          onClick={handleSimplify}
          className="inline-flex items-center gap-2 rounded-xl border border-border/50 bg-white px-6 py-3 text-sm font-medium text-[var(--cb-text)] hover:bg-[var(--cb-warm)]"
        >
          <MessageSquare className="h-4 w-4" />
          Explain Selected Text
        </button>
        <button
          onClick={() => router.push("/upload")}
          className="inline-flex items-center gap-2 rounded-xl bg-[var(--cb-primary)] px-6 py-3 text-sm font-semibold text-white hover:bg-[var(--cb-primary-dark)]"
        >
          New Session
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>

      {/* Simplify modal */}
      {showSimplifyModal && simplifyResult && (
        <SimplifyModal
          result={simplifyResult}
          onClose={() => setShowSimplifyModal(false)}
        />
      )}
    </div>
  );
}

export default function LearningPackPage() {
  return (
    <Suspense fallback={
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-[var(--cb-primary)]" />
      </div>
    }>
      <LearningPackContent />
    </Suspense>
  );
}
