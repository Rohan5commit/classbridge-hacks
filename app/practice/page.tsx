"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { PracticeMode } from "@/components/practice-mode";
import { PracticeQuestion, PracticeAttempt } from "@/lib/schemas";
import {
  ArrowRight,
  Trophy,
  ArrowLeft,
  RotateCcw,
} from "lucide-react";

function getStoredQuestions(): PracticeQuestion[] {
  if (typeof window === "undefined") return [];
  const stored = sessionStorage.getItem("classbridge-practice-questions");
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch {
      return [];
    }
  }
  return [];
}

export default function PracticePage() {
  const router = useRouter();
  const [questions] = useState<PracticeQuestion[]>(getStoredQuestions);
  const [attempts, setAttempts] = useState<PracticeAttempt[]>([]);
  const [completed, setCompleted] = useState(false);

  useEffect(() => {
    if (questions.length === 0) {
      router.push("/learning-pack");
    }
  }, [questions.length, router]);

  const handleAttempt = useCallback((attempt: PracticeAttempt) => {
    setAttempts((prev) => [...prev, attempt]);
  }, []);

  const totalCorrect = attempts.filter((a) => a.isCorrect).length;
  const totalAttempted = attempts.length;
  const allAnswered = totalAttempted >= questions.length;

  useEffect(() => {
    if (allAnswered && !completed) {
      const timer = setTimeout(() => setCompleted(true), 500);
      return () => clearTimeout(timer);
    }
  }, [allAnswered, completed]);

  if (questions.length === 0) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <p className="text-[var(--cb-text-muted)]">Redirecting to learning pack...</p>
      </div>
    );
  }

  if (completed) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center px-4">
        <div className="max-w-md rounded-3xl bg-white p-10 text-center shadow-lg">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-amber-400 to-orange-500">
            <Trophy className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-[var(--cb-text)]">
            Practice Complete! 🎉
          </h1>
          <p className="mt-3 text-[var(--cb-text-muted)]">
            You answered <span className="font-bold text-[var(--cb-primary)]">{totalCorrect}</span> out of{" "}
            <span className="font-bold">{questions.length}</span> questions correctly.
          </p>
          <div className="mt-4 h-3 rounded-full bg-[var(--cb-warm)]">
            <div
              className="h-3 rounded-full bg-gradient-to-r from-[var(--cb-primary)] to-[var(--cb-accent)] transition-all duration-1000"
              style={{ width: `${(totalCorrect / questions.length) * 100}%` }}
            />
          </div>
          <p className="mt-4 text-sm text-[var(--cb-text-muted)]">
            {totalCorrect === questions.length
              ? "Perfect score! You've mastered this material!"
              : totalCorrect >= questions.length * 0.7
              ? "Great job! You're doing really well!"
              : "Keep practicing! Every attempt helps you learn."}
          </p>
          <div className="mt-6 flex flex-col gap-3">
            <button
              onClick={() => router.push("/learning-pack")}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-[var(--cb-primary)] px-6 py-3 text-sm font-semibold text-white hover:bg-[var(--cb-primary-dark)]"
            >
              <ArrowRight className="h-4 w-4" />
              View Learning Pack
            </button>
            <button
              onClick={() => {
                setAttempts([]);
                setCompleted(false);
              }}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-border/50 bg-white px-6 py-3 text-sm font-medium text-[var(--cb-text-muted)] hover:bg-[var(--cb-warm)]"
            >
              <RotateCcw className="h-4 w-4" />
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-[var(--cb-text)]">
          Practice Mode
        </h1>
        <p className="mt-2 text-[var(--cb-text-muted)]">
          Test your understanding with these questions.
        </p>
      </div>

      <PracticeMode questions={questions} onAttempt={handleAttempt} />

      <div className="mt-8 text-center">
        <button
          onClick={() => router.push("/learning-pack")}
          className="inline-flex items-center gap-2 text-sm text-[var(--cb-text-muted)] hover:text-[var(--cb-text)]"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Learning Pack
        </button>
      </div>
    </div>
  );
}
