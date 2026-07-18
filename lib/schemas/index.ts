import { z } from "zod";

// ─── Learning Material ───────────────────────────────────────────────
export const LearningMaterialSchema = z.object({
  id: z.string(),
  title: z.string(),
  type: z.enum(["image", "pdf", "text", "demo"]),
  content: z.string(),
  gradeLevel: z.string().optional(),
  createdAt: z.string().datetime(),
});

export type LearningMaterial = z.infer<typeof LearningMaterialSchema>;

// ─── Extracted Content ───────────────────────────────────────────────
export const ExtractedContentSchema = z.object({
  originalText: z.string().describe("The raw extracted text from the worksheet"),
  confidence: z.number().min(0).max(1).describe("Extraction confidence score"),
  title: z.string().describe("Detected topic or title of the material"),
  subject: z.string().describe("Detected subject area"),
  wordCount: z.number(),
  needsReview: z.boolean().describe("Whether the student should review the extracted text"),
});

export type ExtractedContent = z.infer<typeof ExtractedContentSchema>;

// ─── Learning Preferences ────────────────────────────────────────────
export const LearningPreferencesSchema = z.object({
  gradeLevel: z.enum(["Grade 5", "Grade 6", "Grade 7", "Grade 8", "Grade 9", "Grade 10"]),
  language: z.enum(["English", "Tamil", "Hindi"]),
  learningMode: z.enum(["Explain simply", "Step by step", "With examples"]),
});

export type LearningPreferences = z.infer<typeof LearningPreferencesSchema>;

// ─── Simplified Explanation ──────────────────────────────────────────
export const SimplifiedExplanationSchema = z.object({
  title: z.string(),
  originalTopic: z.string(),
  gradeLevel: z.string(),
  simpleExplanation: z.string().describe("A clear, grade-appropriate explanation of the content"),
  stepByStep: z.array(z.string()).describe("Step-by-step breakdown of the concept"),
  keyVocabulary: z.array(z.object({
    term: z.string(),
    definition: z.string(),
    example: z.string().optional(),
  })),
  realLifeAnalogy: z.string().describe("A relatable real-life analogy for the concept"),
  importantFacts: z.array(z.string()).describe("Key facts, formulas, or principles"),
});

export type SimplifiedExplanation = z.infer<typeof SimplifiedExplanationSchema>;

// ─── Translation Output ──────────────────────────────────────────────
export const TranslationOutputSchema = z.object({
  language: z.string(),
  translatedTitle: z.string(),
  translatedExplanation: z.string(),
  translatedVocabulary: z.array(z.object({
    term: z.string(),
    definition: z.string(),
  })),
  sideBySide: z.array(z.object({
    english: z.string(),
    translated: z.string(),
  })).describe("Side-by-side bilingual content"),
});

export type TranslationOutput = z.infer<typeof TranslationOutputSchema>;

// ─── Study Card ──────────────────────────────────────────────────────
export const StudyCardSchema = z.object({
  id: z.string(),
  front: z.string(),
  back: z.string(),
  category: z.enum(["definition", "concept", "formula", "example"]),
  visualDescription: z.string().describe("Description of a visual illustration for this card"),
  color: z.string().optional(),
});

export type StudyCard = z.infer<typeof StudyCardSchema>;

// ─── Practice Question ───────────────────────────────────────────────
export const PracticeQuestionSchema = z.object({
  id: z.string(),
  type: z.enum(["multiple_choice", "short_answer", "explain_own_words"]),
  question: z.string(),
  options: z.array(z.string()).optional().describe("Options for multiple choice questions"),
  correctAnswer: z.string(),
  explanation: z.string().describe("Supportive explanation of the correct answer"),
  hint: z.string().optional(),
});

export type PracticeQuestion = z.infer<typeof PracticeQuestionSchema>;

// ─── Practice Attempt ────────────────────────────────────────────────
export const PracticeAttemptSchema = z.object({
  questionId: z.string(),
  answer: z.string(),
  isCorrect: z.boolean(),
  feedback: z.string(),
  timestamp: z.string().datetime(),
});

export type PracticeAttempt = z.infer<typeof PracticeAttemptSchema>;

// ─── Adult Support Summary ───────────────────────────────────────────
export const AdultSupportSummarySchema = z.object({
  topicCovered: z.string(),
  keyConcepts: z.array(z.string()),
  difficultConcepts: z.array(z.object({
    concept: z.string(),
    whyDifficult: z.string(),
  })),
  revisionSuggestion: z.string().describe("Student-friendly revision tip"),
  adultSupportSuggestion: z.string().describe("How a parent or teacher can help"),
  encouragementNote: z.string(),
});

export type AdultSupportSummary = z.infer<typeof AdultSupportSummarySchema>;

// ─── Learning Pack (Complete Output) ─────────────────────────────────
export const LearningPackSchema = z.object({
  explanation: SimplifiedExplanationSchema,
  translation: TranslationOutputSchema.nullable(),
  studyCards: z.array(StudyCardSchema),
  practiceQuestions: z.array(PracticeQuestionSchema),
  adultSummary: AdultSupportSummarySchema,
  extractedContent: ExtractedContentSchema,
  preferences: LearningPreferencesSchema,
});

export type LearningPack = z.infer<typeof LearningPackSchema>;

// ─── Simplify Selection Request ──────────────────────────────────────
export const SimplifySelectionSchema = z.object({
  selectedText: z.string(),
  context: z.string().describe("Surrounding text for context"),
  language: z.enum(["English", "Tamil", "Hindi"]),
});

export type SimplifySelectionRequest = z.infer<typeof SimplifySelectionSchema>;

export const SimplifySelectionResponseSchema = z.object({
  simpleRewrite: z.string(),
  analogy: z.string(),
  keyWords: z.array(z.string()),
  translation: z.string().nullable(),
});

export type SimplifySelectionResponse = z.infer<typeof SimplifySelectionResponseSchema>;

// ─── Accessibility Preferences ───────────────────────────────────────
export const AccessibilityPrefsSchema = z.object({
  fontSize: z.number().min(12).max(28).default(16),
  dyslexiaMode: z.boolean().default(false),
  highContrast: z.boolean().default(false),
  reducedMotion: z.boolean().default(false),
  letterSpacing: z.enum(["normal", "wide", "wider"]).default("normal"),
  lineSpacing: z.enum(["normal", "relaxed", "loose"]).default("normal"),
});

export type AccessibilityPrefs = z.infer<typeof AccessibilityPrefsSchema>;
