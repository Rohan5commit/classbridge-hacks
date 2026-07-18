import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ClientProviders } from "@/components/client-providers";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ClassBridge — Turn Any Worksheet into a Learning Pack",
  description:
    "ClassBridge makes school content understandable for every student, regardless of reading level or language. Upload a worksheet and get a simplified, translated learning pack with practice questions.",
  keywords: [
    "education",
    "accessibility",
    "learning",
    "AI",
    "worksheet",
    "simplification",
    "translation",
    "Tamil",
    "Hindi",
    "dyslexia",
  ],
  openGraph: {
    title: "ClassBridge — Every Worksheet Deserves to Be Understandable",
    description:
      "AI-powered education accessibility. Upload a worksheet, get a simplified learning pack.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[var(--cb-surface)] text-[var(--cb-text)]">
        <a href="#main-content" className="skip-to-content">
          Skip to main content
        </a>
        <ClientProviders>{children}</ClientProviders>
      </body>
    </html>
  );
}
