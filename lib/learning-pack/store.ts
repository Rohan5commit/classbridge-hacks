"use client";

import { useState, useCallback } from "react";
import {
  LearningMaterial,
  ExtractedContent,
  LearningPreferences,
  LearningPack,
  SimplifySelectionResponse,
  PracticeAttempt,
} from "../schemas";

interface AppState {
  // Material
  material: LearningMaterial | null;
  setMaterial: (m: LearningMaterial | null) => void;

  // Extraction
  extractedContent: ExtractedContent | null;
  setExtractedContent: (e: ExtractedContent | null) => void;

  // Preferences
  preferences: LearningPreferences;
  setPreferences: (p: LearningPreferences) => void;

  // Learning Pack
  learningPack: LearningPack | null;
  setLearningPack: (lp: LearningPack | null) => void;

  // Simplification
  simplification: SimplifySelectionResponse | null;
  setSimplification: (s: SimplifySelectionResponse | null) => void;

  // Practice
  practiceAttempts: PracticeAttempt[];
  addAttempt: (a: PracticeAttempt) => void;
  clearAttempts: () => void;

  // Loading
  isLoading: boolean;
  setIsLoading: (l: boolean) => void;
  loadingMessage: string;
  setLoadingMessage: (m: string) => void;

  // Error
  error: string | null;
  setError: (e: string | null) => void;

  // Reset
  reset: () => void;
}

const defaultPreferences: LearningPreferences = {
  gradeLevel: "Grade 7",
  language: "English",
  learningMode: "Explain simply",
};

export function useLearningStore() {
  const [material, setMaterial] = useState<LearningMaterial | null>(null);
  const [extractedContent, setExtractedContent] = useState<ExtractedContent | null>(null);
  const [preferences, setPreferences] = useState<LearningPreferences>(defaultPreferences);
  const [learningPack, setLearningPack] = useState<LearningPack | null>(null);
  const [simplification, setSimplification] = useState<SimplifySelectionResponse | null>(null);
  const [practiceAttempts, setPracticeAttempts] = useState<PracticeAttempt[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState("");
  const [error, setError] = useState<string | null>(null);

  const addAttempt = useCallback((attempt: PracticeAttempt) => {
    setPracticeAttempts((prev) => [...prev, attempt]);
  }, []);

  const clearAttempts = useCallback(() => {
    setPracticeAttempts([]);
  }, []);

  const reset = useCallback(() => {
    setMaterial(null);
    setExtractedContent(null);
    setLearningPack(null);
    setSimplification(null);
    setPracticeAttempts([]);
    setIsLoading(false);
    setLoadingMessage("");
    setError(null);
  }, []);

  return {
    material,
    setMaterial,
    extractedContent,
    setExtractedContent,
    preferences,
    setPreferences,
    learningPack,
    setLearningPack,
    simplification,
    setSimplification,
    practiceAttempts,
    addAttempt,
    clearAttempts,
    isLoading,
    setIsLoading,
    loadingMessage,
    setLoadingMessage,
    error,
    setError,
    reset,
  };
}
