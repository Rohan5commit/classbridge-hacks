const NIM_API_URL =
  process.env.NIM_API_URL ||
  "https://integrate.api.nvidia.com/v1/chat/completions";

const NIM_API_KEY = process.env.NIM_API_KEY || "";

const NIM_MODEL =
  process.env.NIM_MODEL || "meta/llama-3.1-8b-instruct";

if (!NIM_API_KEY) {
  console.warn(
    "⚠️ NIM_API_KEY not set. AI features will not work. Set it in .env.local or Vercel environment variables."
  );
}

export interface NimChatMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

export interface NimChatResponse {
  id: string;
  choices: {
    message: { role: string; content: string };
    finish_reason: string;
  }[];
  usage?: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

/**
 * Send a chat completion request to NVIDIA NIM.
 */
export async function nimChat(
  messages: NimChatMessage[],
  options?: {
    temperature?: number;
    maxTokens?: number;
    responseFormat?: { type: "json_object" };
  }
): Promise<string> {
  if (!NIM_API_KEY) {
    throw new Error(
      "NIM API key is not configured. Please set NIM_API_KEY environment variable."
    );
  }

  const body: Record<string, unknown> = {
    model: NIM_MODEL,
    messages,
    temperature: options?.temperature ?? 0.7,
    max_tokens: options?.maxTokens ?? 4096,
    stream: false,
  };

  if (options?.responseFormat) {
    body.response_format = options.responseFormat;
  }

  const response = await fetch(NIM_API_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${NIM_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(
      `NIM API error (${response.status}): ${errorText.slice(0, 500)}`
    );
  }

  const data: NimChatResponse = await response.json();

  if (!data.choices || data.choices.length === 0) {
    throw new Error("NIM API returned no choices");
  }

  return data.choices[0].message.content;
}

/**
 * Generate a structured JSON response from NIM.
 */
export async function nimStructuredResponse<T>(
  messages: NimChatMessage[],
  options?: { temperature?: number; maxTokens?: number }
): Promise<T> {
  const raw = await nimChat(messages, {
    ...options,
    responseFormat: { type: "json_object" },
  });

  let cleaned = raw.trim();
  if (cleaned.startsWith("```json")) cleaned = cleaned.slice(7);
  else if (cleaned.startsWith("```")) cleaned = cleaned.slice(3);
  if (cleaned.endsWith("```")) cleaned = cleaned.slice(0, -3);
  cleaned = cleaned.trim();

  return JSON.parse(cleaned) as T;
}

/**
 * System prompt for text extraction.
 */
export const EXTRACTION_SYSTEM_PROMPT = `You are an educational content extraction assistant. 
Extract text from worksheets and educational materials. 
Always return valid JSON matching the requested schema.
Be accurate and preserve the original meaning.`;

/**
 * System prompt for learning pack generation.
 */
export const LEARNING_PACK_SYSTEM_PROMPT = `You are ClassBridge, an AI education accessibility assistant. 
Your job is to make difficult school material understandable for students.

Rules:
- Write at the exact grade level requested.
- Use simple, clear language.
- Include real-life analogies a teenager would understand.
- Generate practical study cards and practice questions.
- Be encouraging and supportive.
- Do NOT invent facts not present in the original material.
- Always return valid JSON matching the requested schema.`;

/**
 * System prompt for text simplification.
 */
export const SIMPLIFY_SYSTEM_PROMPT = `You are an educational simplification assistant.
When a student selects difficult text, rewrite it simply.
Use short sentences and common words.
Create a relatable analogy.
Return valid JSON matching the requested schema.`;

/**
 * System prompt for parent/teacher summary.
 */
export const SUMMARY_SYSTEM_PROMPT = `You are an educational support assistant generating 
a brief parent/teacher summary for a student's learning pack.
Keep it professional, concise, and actionable.
Focus on what the student is learning, what's hard, and how adults can help.
Always return valid JSON matching the requested schema.`;
