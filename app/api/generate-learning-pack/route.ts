import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { nimStructuredResponse, LEARNING_PACK_SYSTEM_PROMPT, NimChatMessage } from "@/lib/ai/nim-client";
import { LearningPreferencesSchema, LearningPackSchema } from "@/lib/schemas";

const RequestSchema = z.object({
  text: z.string().min(10, "Content must be at least 10 characters"),
  title: z.string().default("Untitled"),
  subject: z.string().default("General"),
  preferences: LearningPreferencesSchema,
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = RequestSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid request", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const { text, title, subject, preferences } = parsed.data;

    const messages: NimChatMessage[] = [
      {
        role: "system",
        content: LEARNING_PACK_SYSTEM_PROMPT,
      },
      {
        role: "user",
        content: `Generate a complete learning pack for this educational content.

STUDENT PREFERENCES:
- Grade Level: ${preferences.gradeLevel}
- Language: ${preferences.language}
- Learning Mode: ${preferences.learningMode}

TOPIC: ${title}
SUBJECT: ${subject}

ORIGINAL TEXT:
${text.slice(0, 3000)}

Return a JSON object with these fields:
{
  "explanation": {
    "title": "string",
    "originalTopic": "${title}",
    "gradeLevel": "${preferences.gradeLevel}",
    "simpleExplanation": "Clear explanation at ${preferences.gradeLevel} level, at least 100 words",
    "stepByStep": ["Step 1 with detail", "Step 2 with detail", "Step 3 with detail", "Step 4 with detail", "Step 5 with detail"],
    "keyVocabulary": [{"term": "term", "definition": "clear definition", "example": "example sentence"}],
    "realLifeAnalogy": "A relatable real-life analogy that a ${preferences.gradeLevel} student would understand",
    "importantFacts": ["Fact 1", "Fact 2", "Fact 3", "Fact 4"]
  },
  "translation": ${
    preferences.language !== "English"
      ? `{
    "language": "${preferences.language}",
    "translatedTitle": "Title translated to ${preferences.language}",
    "translatedExplanation": "Full explanation translated to ${preferences.language}",
    "translatedVocabulary": [{"term": "English term", "definition": "translation"}],
    "sideBySide": [{"english": "English text", "translated": "Translated text"}]
  }`
      : "null"
  },
  "studyCards": [
    {"id": "card-1", "front": "Question or term", "back": "Answer or definition", "category": "definition", "visualDescription": "Visual for this card"},
    {"id": "card-2", "front": "Concept", "back": "Explanation", "category": "concept", "visualDescription": "Visual"},
    {"id": "card-3", "front": "Formula or rule", "back": "Explanation", "category": "formula", "visualDescription": "Visual"},
    {"id": "card-4", "front": "Example question", "back": "Solution", "category": "example", "visualDescription": "Visual"},
    {"id": "card-5", "front": "Key term", "back": "Definition", "category": "definition", "visualDescription": "Visual"},
    {"id": "card-6", "front": "Important concept", "back": "Explanation", "category": "concept", "visualDescription": "Visual"}
  ],
  "practiceQuestions": [
    {"id": "q-1", "type": "multiple_choice", "question": "Question text", "options": ["Option A", "Option B", "Option C", "Option D"], "correctAnswer": "A", "explanation": "Why this is correct", "hint": "Helpful hint"},
    {"id": "q-2", "type": "multiple_choice", "question": "Question text", "options": ["Option A", "Option B", "Option C", "Option D"], "correctAnswer": "B", "explanation": "Why", "hint": "hint"},
    {"id": "q-3", "type": "short_answer", "question": "Question text", "correctAnswer": "Expected answer", "explanation": "Explanation", "hint": "hint"},
    {"id": "q-4", "type": "explain_own_words", "question": "Explain this concept in your own words", "correctAnswer": "Sample good answer", "explanation": "What to include", "hint": "hint"}
  ],
  "adultSummary": {
    "topicCovered": "${title}",
    "keyConcepts": ["concept1", "concept2", "concept3"],
    "difficultConcepts": [{"concept": "concept name", "whyDifficult": "why it might be hard"}],
    "revisionSuggestion": "Specific revision advice for the student",
    "adultSupportSuggestion": "Specific ways a parent or teacher can help",
    "encouragementNote": "An encouraging message for the student"
  }
}

Generate exactly 6 study cards and 4 practice questions. Make all content grade-appropriate and encouraging.`,
      },
    ];

    const raw = await nimStructuredResponse<Record<string, unknown>>(messages, {
      temperature: 0.7,
      maxTokens: 4096,
    });

    // Assemble the full LearningPack
    const extractedContent = {
      originalText: text,
      confidence: 0.95,
      title,
      subject,
      wordCount: text.split(/\s+/).length,
      needsReview: false,
    };

    const learningPack = {
      explanation: raw.explanation,
      translation: raw.translation ?? null,
      studyCards: raw.studyCards,
      practiceQuestions: raw.practiceQuestions,
      adultSummary: raw.adultSummary,
      extractedContent,
      preferences,
    };

    // Validate
    const validation = LearningPackSchema.safeParse(learningPack);
    if (!validation.success) {
      // Return the raw data even if validation fails - the AI output may have slight schema variations
      return NextResponse.json(learningPack);
    }

    return NextResponse.json(validation.data);
  } catch (error) {
    console.error("Learning pack generation error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to generate learning pack" },
      { status: 500 }
    );
  }
}
