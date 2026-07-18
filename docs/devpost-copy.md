# ClassBridge — Devpost Submission

## Project Title
ClassBridge

## Tagline
Turn any difficult school worksheet into an accessible learning pack in seconds.

## Inspiration

We saw students struggling not because they lacked intelligence, but because their learning material was written in language above their reading level, or in a language that wasn't their first language. In many communities, students don't have access to tutors, special education support, or even teachers who can explain concepts in simpler terms. We wanted to build something that could bridge this gap — literally — using AI to make school content accessible to every student, regardless of their reading level or native language.

## What It Does

ClassBridge is an AI-powered education accessibility app that:

1. **Accepts input** — students can upload worksheet images, PDFs, paste text, or use pre-made demo worksheets
2. **Extracts content** — AI reads and extracts the educational text from uploaded material
3. **Simplifies** — rewrites complex content at the student's chosen grade level (Grade 5–10) in plain language
4. **Translates** — provides side-by-side bilingual view in English, Tamil, or Hindi
5. **Creates study materials** — generates visual study cards and practice questions (multiple choice, short answer, explain-in-own-words)
6. **Reads aloud** — browser-native text-to-speech for every explanation, vocabulary, and summary
7. **Informs adults** — generates a parent/teacher summary covering what the student is learning, what's difficult, and how adults can help

The app also includes full accessibility controls: font-size adjustment, dyslexia-friendly spacing, high-contrast mode, reduced-motion support, and keyboard navigation.

## How We Built It

- **Frontend:** Next.js 15 with App Router, React 19, TypeScript, Tailwind CSS v4, shadcn/ui
- **AI Backend:** NVIDIA NIM with LLaMA 3.1 8B Instruct for all inference — extraction, simplification, translation, study card generation, practice questions, and adult summaries
- **Schema Validation:** Zod schemas validate every AI output before display, ensuring reliable structured data
- **Read-Aloud:** Browser-native SpeechSynthesis API — no external TTS costs
- **Accessibility:** Custom React context for persistent accessibility preferences with localStorage

## Challenges We Ran Into

- **Structured AI output:** Getting consistent JSON from LLMs required careful prompt engineering and robust schema validation with fallback handling
- **Bilingual content quality:** Ensuring translations maintained educational meaning while staying natural in Tamil and Hindi
- **Accessibility across browsers:** SpeechSynthesis API has inconsistent voice support across browsers and OSes
- **Design coherence:** Balancing a warm, student-friendly aesthetic with professional polish required many iterations

## Accomplishments

- Complete end-to-end flow from upload to learning pack in a single session
- Real AI-powered simplification, translation, and question generation via NVIDIA NIM
- Polished, accessible UI with dyslexia-friendly mode, high contrast, and keyboard navigation
- Parent/teacher summary for adult support
- Demo-ready with three prepared worksheets (Biology, Math, History)
- Zero external costs — uses browser TTS and free NIM API tier

## What We Learned

- AI is incredibly powerful for education accessibility when properly constrained with schema validation
- Students engage better with visual study cards and practice questions than plain text
- Accessibility features like dyslexia-friendly spacing can dramatically improve readability
- The bilingual side-by-side view was the most requested feature in our testing
- Parents and teachers want actionable summaries, not just the simplified content

## What's Next for ClassBridge

- **OCR integration** for actual image/PDF text extraction using NVIDIA vision models
- **More languages** — Spanish, French, Mandarin, Arabic
- **Image generation** for study card visuals using AI
- **Teacher dashboard** for tracking class-wide learning patterns
- **Offline mode** with cached models for areas with limited internet
- **Integration with school LMS** platforms like Google Classroom
