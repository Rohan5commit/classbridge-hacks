import Link from "next/link";
import {
  ArrowRight,
  Globe,
  Heart,
  Users,
  BookOpen,
  Accessibility,
  Languages,
  Brain,
  Zap,
  Shield,
} from "lucide-react";

const features = [
  {
    icon: Brain,
    title: "AI-Powered Simplification",
    description:
      "Our AI reads your worksheet and rewrites it in plain, grade-appropriate language. Every explanation is tailored to your reading level.",
  },
  {
    icon: Languages,
    title: "Bilingual Learning",
    description:
      "See content side-by-side in English, Tamil, or Hindi. More languages coming soon. Understand in the language you\u2019re most comfortable with.",
  },
  {
    icon: Globe,
    title: "Read-Aloud Support",
    description:
      "Browser-native text-to-speech lets you listen to any explanation, vocabulary, or summary. Play, pause, and replay anytime.",
  },
  {
    icon: Accessibility,
    title: "Accessibility First",
    description:
      "Font-size controls, dyslexia-friendly spacing, high-contrast mode, and reduced-motion support. Designed for every student.",
  },
  {
    icon: Shield,
    title: "Safe & Transparent",
    description:
      "AI explanations are always grounded in the original content. We never invent facts. The original text is always available for comparison.",
  },
  {
    icon: Zap,
    title: "Instant Practice",
    description:
      "Get practice questions and study cards generated from your worksheet. Reinforce learning immediately.",
  },
];

const faqs = [
  {
    q: "Is ClassBridge free?",
    a: "Yes. ClassBridge is a free educational tool built to help students access learning material.",
  },
  {
    q: "What languages are supported?",
    a: "Currently English, Tamil, and Hindi. The architecture supports adding more languages easily.",
  },
  {
    q: "Does it replace teachers?",
    a: "No. ClassBridge is a support tool. It helps students understand material better, but it does not replace professional teaching or learning support.",
  },
  {
    q: "Is my data safe?",
    a: "ClassBridge processes content in-session and does not store student data persistently. We prioritize student privacy.",
  },
];

export default function AboutPage() {
  return (
    <div className="overflow-hidden">
      {/* Hero */}
      <section className="px-4 pb-12 pt-16 sm:px-6 sm:pb-20 sm:pt-24">
        <div className="mx-auto max-w-4xl text-center">
          <h1 className="text-4xl font-bold tracking-tight text-[var(--cb-text)] sm:text-5xl">
            How ClassBridge Works
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-[var(--cb-text-muted)]">
            An AI-powered accessibility tool that transforms difficult school
            material into something every student can understand.
          </p>
        </div>
      </section>

      {/* Features */}
      <section className="px-4 py-16 sm:px-6">
        <div className="mx-auto max-w-6xl">
          <h2 className="mb-12 text-center text-3xl font-bold text-[var(--cb-text)]">
            Built for accessibility
          </h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="rounded-2xl border border-border/50 bg-white p-6 shadow-sm"
              >
                <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--cb-primary)]/10 text-[var(--cb-primary)]">
                  <feature.icon className="h-5 w-5" />
                </div>
                <h3 className="mb-2 text-base font-bold text-[var(--cb-text)]">
                  {feature.title}
                </h3>
                <p className="text-sm leading-relaxed text-[var(--cb-text-muted)]">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Impact */}
      <section className="bg-[var(--cb-warm)] px-4 py-16 sm:px-6">
        <div className="mx-auto max-w-4xl">
          <h2 className="mb-12 text-center text-3xl font-bold text-[var(--cb-text)]">
            Why this matters
          </h2>
          <div className="space-y-8">
            <div className="rounded-2xl bg-white p-6 shadow-sm">
              <h3 className="flex items-center gap-2 text-lg font-bold text-[var(--cb-text)]">
                <Globe className="h-5 w-5 text-[var(--cb-primary)]" />
                Global Impact
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-[var(--cb-text-muted)]">
                Over 2 billion students worldwide learn in a language other than their mother
                tongue. ClassBridge bridges this gap by providing instant translation and
                simplified explanations, making quality education accessible regardless of
                language barriers.
              </p>
            </div>
            <div className="rounded-2xl bg-white p-6 shadow-sm">
              <h3 className="flex items-center gap-2 text-lg font-bold text-[var(--cb-text)]">
                <Heart className="h-5 w-5 text-red-400" />
                Local Impact
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-[var(--cb-text-muted)]">
                In many communities, students struggle not because they lack intelligence,
                but because the language of instruction is not their first language. ClassBridge
                provides Tamil and Hindi support, directly serving multilingual students who need
                accessible learning tools.
              </p>
            </div>
            <div className="rounded-2xl bg-white p-6 shadow-sm">
              <h3 className="flex items-center gap-2 text-lg font-bold text-[var(--cb-text)]">
                <Users className="h-5 w-5 text-emerald-500" />
                Supporting Under-Resourced Schools
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-[var(--cb-text-muted)]">
                Schools with limited access to tutoring, special education, or one-on-one
                teacher support can use ClassBridge as a supplementary learning assistant.
                It’s like having a patient tutor available 24/7.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="px-4 py-16 sm:px-6">
        <div className="mx-auto max-w-2xl">
          <h2 className="mb-8 text-center text-3xl font-bold text-[var(--cb-text)]">
            Frequently Asked Questions
          </h2>
          <div className="space-y-4">
            {faqs.map((faq, i) => (
              <div key={i} className="rounded-2xl border border-border/50 bg-white p-6">
                <h3 className="text-base font-bold text-[var(--cb-text)]">
                  {faq.q}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-[var(--cb-text-muted)]">
                  {faq.a}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-4 pb-20 sm:px-6">
        <div className="mx-auto max-w-3xl rounded-3xl bg-gradient-to-r from-[var(--cb-primary)] to-[var(--cb-secondary)] p-8 text-center shadow-xl sm:p-12">
          <BookOpen className="mx-auto mb-4 h-10 w-10 text-white/80" />
          <h2 className="text-2xl font-bold text-white sm:text-3xl">
            Try ClassBridge now
          </h2>
          <p className="mx-auto mt-4 max-w-lg text-white/80">
            Upload a worksheet or try a demo to see how ClassBridge makes learning
            accessible.
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
