import { z } from "zod";
import {
  LearningPackSchema,
  SimplifiedExplanationSchema,
  TranslationOutputSchema,
  StudyCardSchema,
  PracticeQuestionSchema,
  AdultSupportSummarySchema,
  ExtractedContentSchema,
  SimplifySelectionResponseSchema,
} from "./index";

export function validateLearningPack(data: unknown) {
  return LearningPackSchema.safeParse(data);
}

export function validateExtractedContent(data: unknown) {
  return ExtractedContentSchema.safeParse(data);
}

export function validateSimplifiedExplanation(data: unknown) {
  return SimplifiedExplanationSchema.safeParse(data);
}

export function validateTranslation(data: unknown) {
  return TranslationOutputSchema.safeParse(data);
}

export function validateStudyCards(data: unknown) {
  return z.array(StudyCardSchema).safeParse(data);
}

export function validatePracticeQuestions(data: unknown) {
  return z.array(PracticeQuestionSchema).safeParse(data);
}

export function validateAdultSummary(data: unknown) {
  return AdultSupportSummarySchema.safeParse(data);
}

export function validateSimplifySelection(data: unknown) {
  return SimplifySelectionResponseSchema.safeParse(data);
}

/**
 * Parse AI JSON response, stripping markdown code fences if present.
 */
export function parseAIJsonResponse(raw: string): unknown {
  let cleaned = raw.trim();
  // Remove markdown code fences
  if (cleaned.startsWith("```json")) {
    cleaned = cleaned.slice(7);
  } else if (cleaned.startsWith("```")) {
    cleaned = cleaned.slice(3);
  }
  if (cleaned.endsWith("```")) {
    cleaned = cleaned.slice(0, -3);
  }
  cleaned = cleaned.trim();

  try {
    return JSON.parse(cleaned);
  } catch {
    throw new Error("Failed to parse AI response as JSON");
  }
}
