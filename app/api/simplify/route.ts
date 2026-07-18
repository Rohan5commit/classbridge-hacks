import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { nimStructuredResponse, SIMPLIFY_SYSTEM_PROMPT, NimChatMessage } from "@/lib/ai/nim-client";

const RequestSchema = z.object({
  selectedText: z.string().min(5),
  context: z.string().default(""),
  language: z.enum(["English", "Tamil", "Hindi"]).default("English"),
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

    const { selectedText, context, language } = parsed.data;

    const messages: NimChatMessage[] = [
      {
        role: "system",
        content: SIMPLIFY_SYSTEM_PROMPT,
      },
      {
        role: "user",
        content: `A student selected this difficult text:

SELECTED TEXT: "${selectedText}"

CONTEXT (surrounding text): "${context.slice(0, 1000)}"

Language for translation: ${language}

Return JSON:
{
  "simpleRewrite": "The selected text rewritten in simple, clear language",
  "analogy": "A relatable everyday analogy a teenager would understand",
  "keyWords": ["important", "terms", "from", "the", "text"],
  "translation": ${language !== "English" ? `"Translation to ${language}"` : "null"}
}`,
      },
    ];

    const result = await nimStructuredResponse<{
      simpleRewrite: string;
      analogy: string;
      keyWords: string[];
      translation: string | null;
    }>(messages, {
      temperature: 0.6,
      maxTokens: 1024,
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error("Simplify error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to simplify text" },
      { status: 500 }
    );
  }
}
