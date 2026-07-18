import {
  ExtractedContent,
  LearningPreferences,
  LearningPack,
  SimplifySelectionResponse,
  AdultSupportSummary,
} from "../schemas";
import {
  nimChat,
  nimStructuredResponse,
  EXTRACTION_SYSTEM_PROMPT,
  LEARNING_PACK_SYSTEM_PROMPT,
  SIMPLIFY_SYSTEM_PROMPT,
  SUMMARY_SYSTEM_PROMPT,
  NimChatMessage,
} from "./nim-client";

// ─── Extract Content ─────────────────────────────────────────────────

export async function extractContent(text: string): Promise<ExtractedContent> {
  const messages: NimChatMessage[] = [
    {
      role: "system",
      content: `${EXTRACTION_SYSTEM_PROMPT}

You must return JSON with this exact structure:
{
  "originalText": string - the full extracted text,
  "confidence": number between 0 and 1,
  "title": string - detected topic title,
  "subject": string - subject area like "Science", "Mathematics", "History",
  "wordCount": number,
  "needsReview": boolean - true if confidence < 0.7
}`,
    },
    {
      role: "user",
      content: `Extract and analyze this educational content:\n\n"${text}"`,
    },
  ];

  return nimStructuredResponse<ExtractedContent>(messages, {
    temperature: 0.3,
    maxTokens: 2048,
  });
}

// ─── Generate Learning Pack ──────────────────────────────────────────

export async function generateLearningPack(
  extractedText: string,
  preferences: LearningPreferences,
  topic: string,
  subject: string
): Promise<LearningPack> {
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

TOPIC: ${topic}
SUBJECT: ${subject}

ORIGINAL TEXT:
${extractedText}

Return a JSON object with these fields:
{
  "explanation": {
    "title": string,
    "originalTopic": "${topic}",
    "gradeLevel": "${preferences.gradeLevel}",
    "simpleExplanation": "Clear explanation at ${preferences.gradeLevel} level",
    "stepByStep": ["Step 1", "Step 2", "Step 3", "Step 4", "Step 5"],
    "keyVocabulary": [{"term": string, "definition": string, "example": string}],
    "realLifeAnalogy": "Relatable everyday analogy",
    "importantFacts": ["Fact 1", "Fact 2", "Fact 3"]
  },
  "translation": ${
    preferences.language !== "English"
      ? `{
    "language": "${preferences.language}",
    "translatedTitle": "Title in ${preferences.language}",
    "translatedExplanation": "Full explanation translated to ${preferences.language}",
    "translatedVocabulary": [{"term": string, "definition": string}],
    "sideBySide": [{"english": string, "translated": string}]
  }`
      : "null"
  },
  "studyCards": [{"id": "card-1", "front": "term or concept", "back": "definition or explanation", "category": "definition|concept|formula|example", "visualDescription": "Description of visual for this card"}],
  "practiceQuestions": [{"id": "q-1", "type": "multiple_choice|short_answer|explain_own_words", "question": string, "options": ["a", "b", "c", "d"] or null, "correctAnswer": string, "explanation": "Supportive explanation", "hint": "optional hint"}],
  "adultSummary": {
    "topicCovered": "${topic}",
    "keyConcepts": ["concept1", "concept2"],
    "difficultConcepts": [{"concept": string, "whyDifficult": string}],
    "revisionSuggestion": "How the student can review",
    "adultSupportSuggestion": "How a parent/teacher can help",
    "encouragementNote": "Encouraging message"
  }
}

Generate exactly 6 study cards and exactly 4 practice questions (2 multiple choice, 1 short answer, 1 explain in own words). Make content grade-appropriate.`,
    },
  ];

  const raw = await nimStructuredResponse<Record<string, unknown>>(messages, {
    temperature: 0.7,
    maxTokens: 4096,
  });

  // Assemble the full LearningPack
  const extractedContent = {
    originalText: extractedText,
    confidence: 0.95,
    title: topic,
    subject: subject,
    wordCount: extractedText.split(/\s+/).length,
    needsReview: false,
  };

  return {
    explanation: raw.explanation as LearningPack["explanation"],
    translation: (raw.translation as LearningPack["translation"]) ?? null,
    studyCards: raw.studyCards as LearningPack["studyCards"],
    practiceQuestions: raw.practiceQuestions as LearningPack["practiceQuestions"],
    adultSummary: raw.adultSummary as LearningPack["adultSummary"],
    extractedContent,
    preferences,
  };
}

// ─── Simplify Selected Text ──────────────────────────────────────────

export async function simplifySelectedText(
  selectedText: string,
  context: string,
  language: string
): Promise<SimplifySelectionResponse> {
  const messages: NimChatMessage[] = [
    {
      role: "system",
      content: SIMPLIFY_SYSTEM_PROMPT,
    },
    {
      role: "user",
      content: `A student selected this difficult text:

SELECTED TEXT: "${selectedText}"

CONTEXT (surrounding text): "${context}"

Language for translation: ${language}

Return JSON:
{
  "simpleRewrite": "The selected text rewritten in simple language",
  "analogy": "A relatable everyday analogy",
  "keyWords": ["word1", "word2", "word3"],
  "translation": ${language !== "English" ? `"Translation to ${language}"` : "null"}
}`,
    },
  ];

  return nimStructuredResponse<SimplifySelectionResponse>(messages, {
    temperature: 0.6,
    maxTokens: 1024,
  });
}

// ─── Generate Adult Summary ──────────────────────────────────────────

export async function generateAdultSummary(
  topic: string,
  concepts: string[],
  difficultConcepts: { concept: string; whyDifficult: string }[],
  subject: string
): Promise<AdultSupportSummary> {
  const messages: NimChatMessage[] = [
    {
      role: "system",
      content: SUMMARY_SYSTEM_PROMPT,
    },
    {
      role: "user",
      content: `Generate a parent/teacher summary for a learning session.

TOPIC: ${topic}
SUBJECT: ${subject}
KEY CONCEPTS: ${concepts.join(", ")}
DIFFICULT CONCEPTS: ${difficultConcepts.map((c) => `${c.concept} (${c.whyDifficult})`).join("; ")}

Return JSON:
{
  "topicCovered": "The main topic",
  "keyConcepts": ["concept1", "concept2"],
  "difficultConcepts": [{"concept": "name", "whyDifficult": "reason"}],
  "revisionSuggestion": "How the student can review effectively",
  "adultSupportSuggestion": "Specific ways a parent or teacher can help",
  "encouragementNote": "An encouraging message for the student"
}`,
    },
  ];

  return nimStructuredResponse<AdultSupportSummary>(messages, {
    temperature: 0.6,
    maxTokens: 1500,
  });
}
