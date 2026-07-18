# ClassBridge — Setup Guide

## Prerequisites

- Node.js 18+ installed
- npm or yarn
- A NVIDIA NIM API key ([get one here](https://build.nvidia.com/))
- A Vercel account (for deployment)

## Local Development

```bash
# Clone the repository
git clone https://github.com/Rohan5commit/classbridge-hacks.git
cd classbridge-hacks

# Install dependencies
npm install

# Create environment file
cp .env.example .env.local

# Add your NIM API key to .env.local
# NIM_API_KEY=your_key_here

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `NIM_API_KEY` | NVIDIA NIM API key | Yes |
| `NIM_API_URL` | NIM API endpoint | No (default: `https://integrate.api.nvidia.com/v1/chat/completions`) |
| `NIM_MODEL` | Model to use | No (default: `meta/llama-3.1-8b-instruct`) |

## Testing

```bash
# Run all tests
npm test

# Run tests in watch mode
npm test -- --watch
```

## Building

```bash
# Build for production
npm run build

# Start production server
npm start
```

## Deployment to Vercel

### Option 1: Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy to preview
vercel

# Deploy to production
vercel --prod

# Set environment variables
vercel env add NIM_API_KEY
```

### Option 2: GitHub Integration

1. Push your code to GitHub
2. Go to [vercel.com/new](https://vercel.com/new)
3. Import your GitHub repository
4. Vercel auto-detects Next.js — configure settings
5. Add `NIM_API_KEY` in Project Settings → Environment Variables
6. Deploy

## Troubleshooting

### NIM API errors
- Verify your API key is correct in `.env.local`
- Check you have quota remaining at [build.nvidia.com](https://build.nvidia.com/)
- Ensure `NIM_API_URL` is set correctly

### Build errors
- Run `npm run lint` to check for code issues
- Ensure all TypeScript types are correct with `npx tsc --noEmit`

### Read-aloud not working
- SpeechSynthesis requires user interaction to start
- Some browsers have limited voice support
- Works best in Chrome and Edge
