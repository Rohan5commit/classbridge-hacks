# ClassBridge

**Turn any difficult school worksheet into an accessible learning pack in seconds.**

## What is ClassBridge?

ClassBridge is an AI-powered education accessibility app that helps students who struggle with difficult language, reading load, language barriers, or inaccessible study material. A student uploads a worksheet image, textbook page, PDF, or pasted question — ClassBridge extracts the content, explains it at a selected grade level, translates it into a selected language, creates visual study cards, generates short practice questions, and provides browser-based read-aloud support.

## Problem & Impact

**The Problem:** Millions of students worldwide struggle not because they lack intelligence, but because:
- The language of instruction isn't their first language
- Reading material is written above their reading level
- They have learning differences like dyslexia or ADHD
- They lack access to tutoring or special education support

**The Impact:** ClassBridge directly addresses these challenges by providing instant, AI-powered simplification, translation, and practice — making quality education accessible to every student.

## Who It Helps

- **Multilingual students** learning in English while their native language is Tamil, Hindi, or another language
- **Students with reading difficulties** who need simplified explanations
- **Students in under-resourced schools** without access to tutors or special education
- **Parents and teachers** who want to understand what a student is learning and how to help

## How AI is Used Safely

ClassBridge uses NVIDIA NIM (LLaMA 3.1 8B Instruct) for all AI inference with the following safety measures:

- **Grounded in content:** AI explanations are always based on the uploaded material — the model never invents facts not in the original text
- **Schema validation:** Every AI output is validated against Zod schemas before display
- **Transparency:** The original text is always available for comparison with simplified versions
- **No data storage:** Content is processed in-session and not stored persistently
- **Uncertainty disclosure:** If extraction confidence is low, the student is asked to review

## NVIDIA NIM Setup

1. Get your API key from [build.nvidia.com](https://build.nvidia.com/)
2. Copy `.env.example` to `.env.local`
3. Set your API key:
   ```
   NIM_API_KEY=your_key_here
   ```
4. The default model is `meta/llama-3.1-8b-instruct` — you can change it via `NIM_MODEL` env var

## Accessibility Features

- **Font-size controls** (12px to 28px)
- **Dyslexia-friendly spacing mode** with adjustable letter spacing
- **High-contrast mode** for visual clarity
- **Reduced-motion support** for users sensitive to animation
- **Keyboard-accessible controls** throughout the app
- **Browser-native read-aloud** using SpeechSynthesis API
- **Skip-to-content link** for screen reader users
- **ARIA labels** on all interactive elements

## Demo Instructions

1. Open the app
2. Click "Try Demo" on the landing page
3. Select a demo worksheet (e.g., Grade 8 Photosynthesis)
4. Click "Generate Learning Pack"
5. Explore the Explanation, Translation, Study Cards, Practice, and Parent Summary tabs
6. Try the "Explain Selected Text" feature by highlighting text
7. Use the accessibility panel (gear icon, bottom-right) to adjust settings

## Deployment Instructions

### Deploy to Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy
vercel

# Set environment variables
vercel env add NIM_API_KEY
```

### Deploy via GitHub

1. Push to GitHub
2. Import project on [vercel.com/new](https://vercel.com/new)
3. Add `NIM_API_KEY` in project settings
4. Deploy

## Tech Stack

- Next.js 15 (App Router)
- React 19
- TypeScript
- Tailwind CSS v4
- shadcn/ui
- Zod (schema validation)
- NVIDIA NIM (AI inference)
- Browser SpeechSynthesis API (read-aloud)

## Limitations

ClassBridge is a support tool that helps students understand learning material better. It does **not** replace professional teachers, tutors, or learning support specialists. It is designed to supplement, not substitute, quality education.

## License

Built for TechCommons Hacks V1 — Global & Local Impact theme.
