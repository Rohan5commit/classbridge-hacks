"use client";

import { useState, useCallback } from "react";
import { cn } from "@/lib/utils";
import { CheckCircle, XCircle, MessageSquare, Lightbulb } from "lucide-react";
import { PracticeQuestion, PracticeAttempt } from "@/lib/schemas";

interface PracticeModeProps {
  questions: PracticeQuestion[];
  onAttempt: (attempt: PracticeAttempt) => void;
}

function normalizeAnswer(answer: string, questionType: string): string {
  const trimmed = answer.trim().toLowerCase();
  if (questionType === "multiple_choice") {
    const letterMatch = trimmed.match(/^\(?([a-d])\)?/i);
    if (letterMatch) return letterMatch[1].toUpperCase();
  }
  return trimmed;
}

export function PracticeMode({ questions, onAttempt }: PracticeModeProps) {
  const [currentQ, setCurrentQ] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [attempts, setAttempts] = useState<Record<string, { answer: string; correct: boolean; feedback: string }>>({});

  const question = questions[currentQ];
  const progress = Object.keys(attempts).length;
  const totalCorrect = Object.values(attempts).filter((a) => a.correct).length;

  const handleSubmit = useCallback(() => {
    if (!question || !selectedAnswer.trim()) return;

    const normalizedUserAnswer = normalizeAnswer(selectedAnswer, question.type);
    const normalizedCorrect = normalizeAnswer(question.correctAnswer, question.type);
    const isCorrect = normalizedUserAnswer === normalizedCorrect;
    const attempt: PracticeAttempt = {
      questionId: question.id,
      answer: selectedAnswer,
      isCorrect,
      feedback: isCorrect
        ? "Great job! That's correct! 🎉"
        : `Not quite. ${question.explanation}`,
      timestamp: new Date().toISOString(),
    };

    setAttempts((prev) => ({
      ...prev,
      [question.id]: {
        answer: selectedAnswer,
        correct: isCorrect,
        feedback: attempt.feedback,
      },
    }));

    setSubmitted(true);
    onAttempt(attempt);
  }, [question, selectedAnswer, onAttempt]);

  const handleNext = () => {
    setCurrentQ((prev) => Math.min(prev + 1, questions.length - 1));
    setSelectedAnswer("");
    setSubmitted(false);
  };

  if (!question) return null;

  return (
    <div className="mx-auto max-w-2xl">
      {/* Progress bar */}
      <div className="mb-6">
        <div className="flex items-center justify-between text-sm text-[var(--cb-text-muted)]">
          <span>Question {currentQ + 1} of {questions.length}</span>
          <span>{totalCorrect}/{progress} correct</span>
        </div>
        <div className="mt-2 h-2 rounded-full bg-[var(--cb-warm)]">
          <div
            className="h-2 rounded-full bg-gradient-to-r from-[var(--cb-primary)] to-[var(--cb-accent)] transition-all duration-500"
            style={{ width: `${((currentQ + 1) / questions.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Question card */}
      <div className="rounded-2xl border border-border/50 bg-white p-6 shadow-sm">
        {/* Type badge */}
        <div className="mb-4 flex items-center gap-2">
          <span className={cn(
            "rounded-full px-3 py-1 text-xs font-semibold",
            question.type === "multiple_choice" && "bg-blue-50 text-blue-600",
            question.type === "short_answer" && "bg-emerald-50 text-emerald-600",
            question.type === "explain_own_words" && "bg-purple-50 text-purple-600"
          )}>
            {question.type === "multiple_choice" ? "Multiple Choice" :
             question.type === "short_answer" ? "Short Answer" : "Explain in Your Own Words"}
          </span>
        </div>

        {/* Question text */}
        <h3 className="mb-5 text-lg font-semibold text-[var(--cb-text)] leading-relaxed">
          {question.question}
        </h3>

        {/* Answer options */}
        {question.type === "multiple_choice" && question.options ? (
          <div className="space-y-2">
            {question.options.map((option, i) => {
              const letter = String.fromCharCode(65 + i);
              const isSelected = selectedAnswer === letter;
              const isCorrectAnswer = submitted && normalizeAnswer(letter, question.type) === normalizeAnswer(question.correctAnswer, question.type);
              const isWrong = submitted && isSelected && !isCorrectAnswer;

              return (
                <button
                  key={i}
                  onClick={() => !submitted && setSelectedAnswer(letter)}
                  disabled={submitted}
                  className={cn(
                    "flex w-full items-center gap-3 rounded-xl border-2 p-4 text-left transition-all",
                    !submitted && !isSelected && "border-border/50 hover:border-[var(--cb-primary)]/30 hover:bg-[var(--cb-warm)]",
                    isSelected && !submitted && "border-[var(--cb-primary)] bg-[var(--cb-primary)]/5",
                    isCorrectAnswer && "border-green-400 bg-green-50",
                    isWrong && "border-red-300 bg-red-50",
                    submitted && !isCorrectAnswer && !isWrong && "border-border/30 opacity-50"
                  )}
                >
                  <span className={cn(
                    "flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-bold",
                    isCorrectAnswer && "bg-green-400 text-white",
                    isWrong && "bg-red-300 text-white",
                    isSelected && !submitted && "bg-[var(--cb-primary)] text-white",
                    !isSelected && "bg-[var(--cb-warm)] text-[var(--cb-text-muted)]"
                  )}>
                    {isCorrectAnswer && <CheckCircle className="h-4 w-4" />}
                    {isWrong && <XCircle className="h-4 w-4" />}
                    {!isCorrectAnswer && !isWrong && letter}
                  </span>
                  <span className="text-sm font-medium text-[var(--cb-text)]">{option}</span>
                </button>
              );
            })}
          </div>
        ) : (
          <div>
            <textarea
              value={selectedAnswer}
              onChange={(e) => setSelectedAnswer(e.target.value)}
              disabled={submitted}
              placeholder={
                question.type === "short_answer"
                  ? "Type your answer here..."
                  : "Explain in your own words..."
              }
              className="w-full rounded-xl border-2 border-border/50 p-4 text-sm text-[var(--cb-text)] placeholder:text-[var(--cb-text-muted)]/50 focus:border-[var(--cb-primary)] focus:outline-none disabled:opacity-60"
              rows={question.type === "explain_own_words" ? 4 : 2}
            />
          </div>
        )}

        {/* Feedback */}
        {submitted && (
          <div className={cn(
            "mt-4 rounded-xl p-4 text-sm",
            attempts[question.id]?.correct
              ? "bg-green-50 text-green-800"
              : "bg-amber-50 text-amber-800"
          )}>
            <p className="flex items-center gap-2 font-semibold">
              {attempts[question.id]?.correct ? (
                <><CheckCircle className="h-4 w-4 text-green-500" /> Correct!</>
              ) : (
                <><Lightbulb className="h-4 w-4 text-amber-500" /> Not quite right</>
              )}
            </p>
            <p className="mt-1 text-[var(--cb-text-muted)]">
              {attempts[question.id]?.feedback}
            </p>
            {question.hint && !attempts[question.id]?.correct && (
              <p className="mt-2 flex items-center gap-1 text-xs text-[var(--cb-text-muted)]">
                <MessageSquare className="h-3 w-3" /> Hint: {question.hint}
              </p>
            )}
          </div>
        )}

        {/* Actions */}
        <div className="mt-6 flex justify-between">
          {!submitted ? (
            <>
              <button
                onClick={() => setCurrentQ((prev) => Math.max(prev - 1, 0))}
                disabled={currentQ === 0}
                className="rounded-xl px-5 py-2.5 text-sm font-medium text-[var(--cb-text-muted)] hover:bg-[var(--cb-warm)] disabled:opacity-30"
              >
                Previous
              </button>
              <button
                onClick={handleSubmit}
                disabled={!selectedAnswer.trim()}
                className="rounded-xl bg-[var(--cb-primary)] px-6 py-2.5 text-sm font-semibold text-white transition-all hover:bg-[var(--cb-primary-dark)] disabled:opacity-40"
              >
                Check Answer
              </button>
            </>
          ) : (
            <button
              onClick={handleNext}
              disabled={currentQ >= questions.length - 1}
              className="ml-auto rounded-xl bg-[var(--cb-primary)] px-6 py-2.5 text-sm font-semibold text-white transition-all hover:bg-[var(--cb-primary-dark)] disabled:opacity-40"
            >
              {currentQ >= questions.length - 1 ? "Finish" : "Next Question"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
