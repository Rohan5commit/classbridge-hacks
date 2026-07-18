# ClassBridge — Architecture

## System Overview

ClassBridge is a Next.js 15 application using the App Router pattern. It consists of client-side React components for the UI and server-side API routes for AI inference via NVIDIA NIM.

## Upload & Extraction Flow

```
User Input (Demo/Upload/Paste)
        ↓
    [Client] → Store content in sessionStorage
        ↓
    [Client] → Navigate to /learning-pack
        ↓
    [Client] → POST /api/generate-learning-pack
        ↓
    [Server] → Validate input with Zod
        ↓
    [Server] → Send to NVIDIA NIM API
        ↓
    [Server] → Parse & validate AI response with Zod
        ↓
    [Client] → Render Learning Pack UI
```

## NVIDIA NIM Inference Flow

All AI inference goes through a centralized NIM client (`lib/ai/nim-client.ts`):

1. **Configuration:** API key, URL, and model are set via environment variables
2. **Chat completion:** `nimChat()` sends messages and returns raw text
3. **Structured output:** `nimStructuredResponse()` requests JSON-formatted responses
4. **JSON parsing:** Strips markdown code fences and parses JSON
5. **Schema validation:** Results are validated against Zod schemas

### Models Used
- **Primary:** `meta/llama-3.1-8b-instruct` (default)
- **Configurable:** Via `NIM_MODEL` environment variable

### Prompt Design
Each AI task uses a dedicated system prompt:
- `EXTRACTION_SYSTEM_PROMPT` — for content extraction
- `LEARNING_PACK_SYSTEM_PROMPT` — for learning pack generation
- `SIMPLIFY_SYSTEM_PROMPT` — for text simplification
- `SUMMARY_SYSTEM_PROMPT` — for parent/teacher summaries

## Schema Validation

Every AI output is validated using Zod schemas defined in `lib/schemas/`:

- `ExtractedContentSchema` — validated extraction results
- `LearningPackSchema` — complete learning pack validation
- `SimplifiedExplanationSchema` — explanation structure
- `TranslationOutputSchema` — bilingual content
- `StudyCardSchema` — flashcard data
- `PracticeQuestionSchema` — question structure
- `AdultSupportSummarySchema` — adult summary

If validation fails, the raw AI output is still returned (with graceful degradation) rather than showing an error.

## Accessibility Preferences

Managed via React Context (`lib/accessibility/accessibility-context.tsx`):

- **State:** `AccessibilityPrefs` type with defaults
- **Persistence:** Saved to localStorage on change
- **Application:** CSS classes applied to `<html>` element
- **Features:**
  - Font size: inline style on root element
  - Dyslexia mode: CSS class with font-family and letter-spacing
  - High contrast: CSS class overriding color variables
  - Reduced motion: CSS class disabling animations
  - Line spacing: CSS class on root element

## Client-Side Read-Aloud Flow

```
User clicks "Read Aloud"
        ↓
    [Browser] → SpeechSynthesis.speak(utterance)
        ↓
    [Browser] → onstart → Update UI state
        ↓
    [Browser] → onend → Update UI state
        ↓
    Controls: Pause → speechSynthesis.pause()
              Resume → speechSynthesis.resume()
              Stop → speechSynthesis.cancel()
              Replay → Cancel + speak again
```

No external TTS API is used. The browser's built-in SpeechSynthesis API handles all audio output.

## File Structure

```
app/
  page.tsx              — Landing page
  upload/page.tsx       — Demo selection / upload
  learning-pack/page.tsx — Learning pack display
  practice/page.tsx     — Practice mode
  summary/page.tsx      — Parent/teacher summary
  about/page.tsx        — How it works
  api/
    generate-learning-pack/route.ts — NIM learning pack API
    simplify/route.ts              — NIM simplification API
  globals.css           — Design system & accessibility styles
  layout.tsx            — Root layout with providers

components/
  navbar.tsx            — Navigation bar
  accessibility-panel.tsx — Accessibility settings panel
  read-aloud-button.tsx  — TTS controls
  study-card.tsx         — Flashcard component
  practice-mode.tsx      — Practice question engine
  adult-summary-view.tsx — Parent/teacher summary
  simplify-modal.tsx     — Selected text simplification
  explanation-view.tsx   — Explanation display
  translation-view.tsx   — Bilingual view
  original-text-view.tsx — Original text display

lib/
  ai/
    nim-client.ts         — NVIDIA NIM API client
    extraction-service.ts — AI service functions
  schemas/
    index.ts              — Zod schema definitions
    validation.ts         — Schema validation utilities
    demo-materials.ts     — Demo worksheet content
  accessibility/
    accessibility-context.tsx — React context
    text-to-speech.ts       — TTS service
  learning-pack/
    store.ts              — Client state management
```
