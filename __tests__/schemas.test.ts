import { describe, it, expect } from "vitest";
import {
  LearningMaterialSchema,
  ExtractedContentSchema,
  LearningPreferencesSchema,
  LearningPackSchema,
  SimplifiedExplanationSchema,
  StudyCardSchema,
  PracticeQuestionSchema,
  AdultSupportSummarySchema,
  SimplifySelectionResponseSchema,
  AccessibilityPrefsSchema,
} from "@/lib/schemas";

describe("Zod Schema Validation", () => {
  describe("LearningMaterialSchema", () => {
    it("validates a valid learning material", () => {
      const result = LearningMaterialSchema.safeParse({
        id: "mat-1",
        title: "Photosynthesis",
        type: "demo",
        content: "Some content about photosynthesis",
        gradeLevel: "Grade 8",
        createdAt: new Date().toISOString(),
      });
      expect(result.success).toBe(true);
    });

    it("rejects invalid type", () => {
      const result = LearningMaterialSchema.safeParse({
        id: "mat-1",
        title: "Test",
        type: "invalid",
        content: "content",
        createdAt: new Date().toISOString(),
      });
      expect(result.success).toBe(false);
    });
  });

  describe("ExtractedContentSchema", () => {
    it("validates extracted content", () => {
      const result = ExtractedContentSchema.safeParse({
        originalText: "Some extracted text from a worksheet",
        confidence: 0.92,
        title: "Photosynthesis",
        subject: "Biology",
        wordCount: 250,
        needsReview: false,
      });
      expect(result.success).toBe(true);
    });

    it("rejects confidence out of range", () => {
      const result = ExtractedContentSchema.safeParse({
        originalText: "text",
        confidence: 1.5,
        title: "Test",
        subject: "Science",
        wordCount: 10,
        needsReview: false,
      });
      expect(result.success).toBe(false);
    });
  });

  describe("LearningPreferencesSchema", () => {
    it("validates valid preferences", () => {
      const result = LearningPreferencesSchema.safeParse({
        gradeLevel: "Grade 7",
        language: "Tamil",
        learningMode: "Explain simply",
      });
      expect(result.success).toBe(true);
    });

    it("rejects invalid grade level", () => {
      const result = LearningPreferencesSchema.safeParse({
        gradeLevel: "Grade 11",
        language: "English",
        learningMode: "Explain simply",
      });
      expect(result.success).toBe(false);
    });
  });

  describe("SimplifiedExplanationSchema", () => {
    it("validates a complete explanation", () => {
      const result = SimplifiedExplanationSchema.safeParse({
        title: "Photosynthesis",
        originalTopic: "Photosynthesis",
        gradeLevel: "Grade 7",
        simpleExplanation: "Photosynthesis is how plants make food using sunlight.",
        stepByStep: ["Step 1", "Step 2", "Step 3"],
        keyVocabulary: [
          { term: "Chlorophyll", definition: "Green pigment in plants", example: "Leaves are green because of chlorophyll" },
        ],
        realLifeAnalogy: "Like a solar panel converting sunlight to electricity",
        importantFacts: ["Plants produce oxygen", "Requires CO2 and water"],
      });
      expect(result.success).toBe(true);
    });
  });

  describe("StudyCardSchema", () => {
    it("validates a study card", () => {
      const result = StudyCardSchema.safeParse({
        id: "card-1",
        front: "What is photosynthesis?",
        back: "The process by which plants convert light energy to chemical energy",
        category: "concept",
        visualDescription: "A diagram of a leaf with arrows showing light input and glucose output",
      });
      expect(result.success).toBe(true);
    });

    it("rejects invalid category", () => {
      const result = StudyCardSchema.safeParse({
        id: "card-1",
        front: "Q?",
        back: "A",
        category: "invalid",
        visualDescription: "desc",
      });
      expect(result.success).toBe(false);
    });
  });

  describe("PracticeQuestionSchema", () => {
    it("validates multiple choice question", () => {
      const result = PracticeQuestionSchema.safeParse({
        id: "q-1",
        type: "multiple_choice",
        question: "What is 2+2?",
        options: ["3", "4", "5", "6"],
        correctAnswer: "B",
        explanation: "2+2 equals 4",
        hint: "Think about counting",
      });
      expect(result.success).toBe(true);
    });

    it("validates short answer question without options", () => {
      const result = PracticeQuestionSchema.safeParse({
        id: "q-2",
        type: "short_answer",
        question: "Describe photosynthesis",
        correctAnswer: "Plants make food from sunlight",
        explanation: "It involves light energy conversion",
      });
      expect(result.success).toBe(true);
    });

    it("validates explain in own words question", () => {
      const result = PracticeQuestionSchema.safeParse({
        id: "q-3",
        type: "explain_own_words",
        question: "Explain why plants are important",
        correctAnswer: "Plants produce oxygen and food",
        explanation: "They support life on Earth",
      });
      expect(result.success).toBe(true);
    });
  });

  describe("AdultSupportSummarySchema", () => {
    it("validates a complete summary", () => {
      const result = AdultSupportSummarySchema.safeParse({
        topicCovered: "Photosynthesis",
        keyConcepts: ["Light reactions", "Calvin cycle"],
        difficultConcepts: [
          { concept: "ATP synthesis", whyDifficult: "Abstract energy concept" },
        ],
        revisionSuggestion: "Review the two main stages",
        adultSupportSuggestion: "Help the student draw a diagram",
        encouragementNote: "You're doing great!",
      });
      expect(result.success).toBe(true);
    });
  });

  describe("SimplifySelectionResponseSchema", () => {
    it("validates simplify response", () => {
      const result = SimplifySelectionResponseSchema.safeParse({
        simpleRewrite: "This means plants use sunlight to make food",
        analogy: "Like a kitchen using energy to cook food",
        keyWords: ["sunlight", "food", "energy"],
        translation: "Tamil translation here",
      });
      expect(result.success).toBe(true);
    });

    it("validates with null translation", () => {
      const result = SimplifySelectionResponseSchema.safeParse({
        simpleRewrite: "Simple version",
        analogy: "Analogy",
        keyWords: ["word"],
        translation: null,
      });
      expect(result.success).toBe(true);
    });
  });

  describe("AccessibilityPrefsSchema", () => {
    it("validates with defaults", () => {
      const result = AccessibilityPrefsSchema.safeParse({});
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.fontSize).toBe(16);
        expect(result.data.dyslexiaMode).toBe(false);
        expect(result.data.highContrast).toBe(false);
        expect(result.data.reducedMotion).toBe(false);
      }
    });

    it("validates custom values", () => {
      const result = AccessibilityPrefsSchema.safeParse({
        fontSize: 22,
        dyslexiaMode: true,
        highContrast: true,
        reducedMotion: true,
        letterSpacing: "wide",
        lineSpacing: "relaxed",
      });
      expect(result.success).toBe(true);
    });
  });

  describe("LearningPackSchema", () => {
    it("validates a complete learning pack", () => {
      const result = LearningPackSchema.safeParse({
        explanation: {
          title: "Test",
          originalTopic: "Test",
          gradeLevel: "Grade 7",
          simpleExplanation: "Simple explanation",
          stepByStep: ["Step 1"],
          keyVocabulary: [{ term: "Term", definition: "Def" }],
          realLifeAnalogy: "Analogy",
          importantFacts: ["Fact"],
        },
        translation: null,
        studyCards: [
          { id: "c1", front: "Q", back: "A", category: "concept", visualDescription: "desc" },
        ],
        practiceQuestions: [
          { id: "q1", type: "multiple_choice", question: "Q", options: ["A", "B"], correctAnswer: "A", explanation: "why" },
        ],
        adultSummary: {
          topicCovered: "Topic",
          keyConcepts: ["c1"],
          difficultConcepts: [{ concept: "c", whyDifficult: "why" }],
          revisionSuggestion: "revise",
          adultSupportSuggestion: "help",
          encouragementNote: "good job",
        },
        extractedContent: {
          originalText: "text",
          confidence: 0.9,
          title: "Title",
          subject: "Subject",
          wordCount: 100,
          needsReview: false,
        },
        preferences: {
          gradeLevel: "Grade 7",
          language: "English",
          learningMode: "Explain simply",
        },
      });
      expect(result.success).toBe(true);
    });
  });
});
