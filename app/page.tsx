import Link from "next/link";
import {
  ArrowRight,
  Upload,
  Sparkles,
  Languages,
  Brain,
  BookOpen,
  Globe,
  Heart,
  Users,
  Star,
  ChevronRight,
} from "lucide-react";

const steps = [
  {
    icon: Upload,
    title: "Upload",
    description: "Take a photo of a worksheet, upload a PDF, or paste text.",
    color: "from-blue-400 to-indigo-500",
  },
  {
    icon: Sparkles,
    title: "Simplify",
    description: "AI explains the content at your grade level in plain language.",
    color: "from-emerald-400 to-teal-500",
  },
  {
    icon: Languages,
    title: "Translate",
    description: "See explanations side-by-side in English, Tamil, or Hindi.",
    color: "from-purple-400 to-indigo-500",
  },
  {
    icon: Brain,
    title: "Practice",
    description: "Reinforce learning with study cards and practice questions.",
    color: "from-amber-400 to-orange-500",
  },
];

const impacts = [
  {
    icon: Globe,
    title: "Global Accessibility",
    description: "Breaking language barriers for 2 billion+ students worldwide who learn in a language other than English.",
  },
  {
    icon: Heart,
    title: "Inclusive Education",
    description: "Supporting students with dyslexia, ADHD, and learning differences through adaptive reading modes.",
  },
  {
    icon: Users,
    title: "Community Impact",
    description: "Helping students in under-resourced schools who lack access to tutoring or special education support.",
  },
];

export default function HomePage() {
  return (
    <div className="overflow-hidden">
      {/* ─── Hero ────────────────────────────────────────────── */}
      <section className="relative px-4 pb-16 pt-20 sm:px-6 sm:pb-24 sm:pt-32">
        {/* Background decoration */}
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute -top-40 left-1/2 h-[500px] w-[800px] -translate-x-1/2 rounded-full bg-gradient-to-b from-[var(--cb-primary)]/8 to-transparent blur-3xl" />
        </div>

        <div className="mx-auto max-w-4xl text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-[var(--cb-primary)]/10 px-4 py-1.5 text-sm font-semibold text-[var(--cb-primary)]">
            <Star className="h-3.5 w-3.5" />
            Built for TechCommons Hacks V1
          </div>
          <h1 className="text-4xl font-bold tracking-tight text-[var(--cb-text)] sm:text-5xl lg:text-6xl">
            Every worksheet deserves to be{" "}
            <span className="bg-gradient-to-r from-[var(--cb-primary)] to-[var(--cb-accent)] bg-clip-text text-transparent">
              understandable.
            </span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-[var(--cb-text-muted)] sm:text-xl">
            ClassBridge turns any difficult school worksheet into an accessible
            learning pack — simplified, translated, and ready to practice.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              href="/upload"
              className="inline-flex items-center gap-2 rounded-xl bg-[var(--cb-primary)] px-8 py-3.5 text-base font-semibold text-white shadow-lg transition-all hover:bg-[var(--cb-primary-dark)] hover:shadow-xl active:scale-[0.98]"
            >
              Try Demo
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/about"
              className="inline-flex items-center gap-2 rounded-xl border border-border/50 bg-white px-8 py-3.5 text-base font-semibold text-[var(--cb-text)] transition-all hover:bg-[var(--cb-warm)]"
            >
              How It Works
              <ChevronRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ─── How It Works (4 Steps) ─────────────────────────── */}
      <section className="px-4 py-20 sm:px-6">
        <div className="mx-auto max-w-6xl">
          <h2 className="mb-3 text-center text-3xl font-bold text-[var(--cb-text)]">
            Four simple steps
          </h2>
          <p className="mx-auto mb-12 max-w-xl text-center text-[var(--cb-text-muted)]">
            From a confusing worksheet to a personalized learning pack in under a minute.
          </p>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {steps.map((step, i) => (
              <div
                key={step.title}
                className="group relative rounded-2xl border border-border/50 bg-white p-6 shadow-sm transition-all duration-300 hover:shadow-md hover:-translate-y-1"
              >
                <div className="absolute -top-3 -left-3 flex h-8 w-8 items-center justify-center rounded-full bg-[var(--cb-text)] text-xs font-bold text-white shadow">
                  {i + 1}
                </div>
                <div className={`mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${step.color} text-white shadow-md`}>
                  <step.icon className="h-6 w-6" />
                </div>
                <h3 className="mb-2 text-lg font-bold text-[var(--cb-text)]">
                  {step.title}
                </h3>
                <p className="text-sm leading-relaxed text-[var(--cb-text-muted)]">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Social Impact ───────────────────────────────────── */}
      <section className="bg-[var(--cb-warm)] px-4 py-20 sm:px-6">
        <div className="mx-auto max-w-6xl">
          <h2 className="mb-3 text-center text-3xl font-bold text-[var(--cb-text)]">
            Real impact for real students
          </h2>
          <p className="mx-auto mb-12 max-w-xl text-center text-[var(--cb-text-muted)]">
            Education should not depend on your reading level or native language.
          </p>
          <div className="grid gap-6 sm:grid-cols-3">
            {impacts.map((impact) => (
              <div
                key={impact.title}
                className="rounded-2xl border border-border/50 bg-white p-6 shadow-sm"
              >
                <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--cb-primary)]/10 text-[var(--cb-primary)]">
                  <impact.icon className="h-5 w-5" />
                </div>
                <h3 className="mb-2 text-base font-bold text-[var(--cb-text)]">
                  {impact.title}
                </h3>
                <p className="text-sm leading-relaxed text-[var(--cb-text-muted)]">
                  {impact.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CTA ─────────────────────────────────────────────── */}
      <section className="px-4 py-20 sm:px-6">
        <div className="mx-auto max-w-3xl rounded-3xl bg-gradient-to-r from-[var(--cb-primary)] to-[var(--cb-secondary)] p-8 text-center shadow-xl sm:p-12">
          <BookOpen className="mx-auto mb-4 h-10 w-10 text-white/80" />
          <h2 className="text-2xl font-bold text-white sm:text-3xl">
            Ready to make learning accessible?
          </h2>
          <p className="mx-auto mt-4 max-w-lg text-white/80">
            Upload a worksheet or try our demo to see ClassBridge in action.
          </p>
          <Link
            href="/upload"
            className="mt-8 inline-flex items-center gap-2 rounded-xl bg-white px-8 py-3.5 text-base font-semibold text-[var(--cb-primary)] shadow-lg transition-all hover:shadow-xl hover:bg-white/95 active:scale-[0.98]"
          >
            Get Started
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </div>
  );
}
