"use client";

import { useState, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { demoWorksheets, getDemoWorksheet } from "@/lib/schemas/demo-materials";
import {
  Upload,
  FileText,
  ClipboardPaste,
  Sparkles,
  ArrowRight,
  AlertCircle,
  Loader2,
  CheckCircle,
  Image,
  FileUp,
} from "lucide-react";

type InputMode = "demo" | "upload" | "paste";

export default function UploadPage() {
  const router = useRouter();
  const [mode, setMode] = useState<InputMode>("demo");
  const [selectedDemo, setSelectedDemo] = useState<string | null>(null);
  const [pastedText, setPastedText] = useState("");
  const [fileName, setFileName] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileName(file.name);
    setError(null);

    // For text files, read content
    if (file.type === "text/plain" || file.name.endsWith(".txt")) {
      const text = await file.text();
      setPastedText(text);
      setMode("paste");
      return;
    }

    // For other files, we'll handle in the processing step
    setMode("upload");
  }, []);

  const handleProcess = useCallback(async () => {
    setError(null);
    setIsProcessing(true);

    try {
      let content = "";
      let title = "";
      let subject = "";

      if (mode === "demo" && selectedDemo) {
        const demo = getDemoWorksheet(selectedDemo);
        if (!demo) {
          setError("Demo worksheet not found");
          setIsProcessing(false);
          return;
        }
        content = demo.content;
        title = demo.title;
        subject = demo.subject;
      } else if (mode === "paste" && pastedText.trim()) {
        content = pastedText.trim();
        title = "Pasted Content";
        subject = "General";
      } else if (mode === "upload" && fileName) {
        // For uploads, we'll use a demo placeholder since we don't have OCR yet
        setError("Image/PDF extraction is being processed. For the demo, please use a demo worksheet or paste text.");
        setIsProcessing(false);
        return;
      } else {
        setError("Please select a demo, upload a file, or paste some text.");
        setIsProcessing(false);
        return;
      }

      // Store content in sessionStorage for the learning pack page
      sessionStorage.setItem("classbridge-content", JSON.stringify({
        text: content,
        title,
        subject,
        source: mode,
      }));

      router.push("/learning-pack");
    } catch (err) {
      setError("Something went wrong. Please try again.");
      setIsProcessing(false);
    }
  }, [mode, selectedDemo, pastedText, fileName, router]);

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-[var(--cb-text)]">
          Get Started with ClassBridge
        </h1>
        <p className="mt-2 text-[var(--cb-text-muted)]">
          Choose a demo worksheet, upload a file, or paste text to begin.
        </p>
      </div>

      {/* Mode tabs */}
      <div className="mb-8 flex justify-center gap-2">
        {[
          { key: "demo" as const, label: "Demo Worksheets", icon: Sparkles },
          { key: "upload" as const, label: "Upload File", icon: FileUp },
          { key: "paste" as const, label: "Paste Text", icon: ClipboardPaste },
        ].map(({ key, label, icon: Icon }) => (
          <button
            key={key}
            onClick={() => setMode(key)}
            className={cn(
              "flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-medium transition-all",
              mode === key
                ? "bg-[var(--cb-primary)] text-white shadow-md"
                : "bg-white text-[var(--cb-text-muted)] hover:bg-[var(--cb-warm)] border border-border/50"
            )}
          >
            <Icon className="h-4 w-4" />
            {label}
          </button>
        ))}
      </div>

      {/* Demo worksheets */}
      {mode === "demo" && (
        <div className="grid gap-4 sm:grid-cols-3">
          {demoWorksheets.map((demo) => (
            <button
              key={demo.id}
              onClick={() => setSelectedDemo(demo.id)}
              className={cn(
                "group rounded-2xl border-2 p-5 text-left transition-all duration-200",
                selectedDemo === demo.id
                  ? "border-[var(--cb-primary)] bg-[var(--cb-primary)]/5 shadow-md"
                  : "border-border/50 bg-white hover:border-[var(--cb-primary)]/30 hover:shadow-sm"
              )}
            >
              <div className={`mb-3 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${demo.color} text-2xl shadow-sm`}>
                {demo.icon}
              </div>
              <h3 className="text-base font-bold text-[var(--cb-text)]">
                {demo.title}
              </h3>
              <p className="mt-1 text-xs text-[var(--cb-text-muted)]">
                {demo.subject} · {demo.gradeLevel} · {demo.difficulty}
              </p>
              <p className="mt-2 text-xs leading-relaxed text-[var(--cb-text-muted)]">
                {demo.description}
              </p>
              {selectedDemo === demo.id && (
                <div className="mt-3 flex items-center gap-1 text-xs font-semibold text-[var(--cb-primary)]">
                  <CheckCircle className="h-3.5 w-3.5" /> Selected
                </div>
              )}
            </button>
          ))}
        </div>
      )}

      {/* Upload */}
      {mode === "upload" && (
        <div className="rounded-2xl border-2 border-dashed border-border/50 bg-white p-12 text-center transition-all hover:border-[var(--cb-primary)]/30">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*,.pdf,.txt"
            onChange={handleFileSelect}
            className="hidden"
            aria-label="Upload a file"
          />
          <FileUp className="mx-auto mb-4 h-12 w-12 text-[var(--cb-text-muted)]/40" />
          <p className="text-base font-semibold text-[var(--cb-text)]">
            Drop a file here or click to browse
          </p>
          <p className="mt-1 text-sm text-[var(--cb-text-muted)]">
            Supports images (JPG, PNG), PDFs, and text files
          </p>
          <button
            onClick={() => fileInputRef.current?.click()}
            className="mt-4 rounded-xl bg-[var(--cb-primary)]/10 px-6 py-2.5 text-sm font-medium text-[var(--cb-primary)] hover:bg-[var(--cb-primary)]/20"
          >
            Choose File
          </button>
          {fileName && (
            <p className="mt-3 flex items-center justify-center gap-2 text-sm text-[var(--cb-primary)]">
              <CheckCircle className="h-4 w-4" /> {fileName}
            </p>
          )}
        </div>
      )}

      {/* Paste */}
      {mode === "paste" && (
        <div className="rounded-2xl border border-border/50 bg-white p-6">
          <label className="mb-2 block text-sm font-semibold text-[var(--cb-text)]">
            Paste your worksheet text here
          </label>
          <textarea
            value={pastedText}
            onChange={(e) => setPastedText(e.target.value)}
            placeholder="Paste the text from a worksheet, textbook page, or exam question..."
            className="min-h-[200px] w-full rounded-xl border border-border/50 p-4 text-sm text-[var(--cb-text)] placeholder:text-[var(--cb-text-muted)]/50 focus:border-[var(--cb-primary)] focus:outline-none"
            aria-label="Paste worksheet text"
          />
          <p className="mt-2 text-xs text-[var(--cb-text-muted)]">
            {pastedText.length} characters · {pastedText.split(/\s+/).filter(Boolean).length} words
          </p>
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="mt-4 flex items-center gap-2 rounded-xl bg-red-50 p-4 text-sm text-red-700">
          <AlertCircle className="h-4 w-4 shrink-0" />
          {error}
        </div>
      )}

      {/* Process button */}
      <div className="mt-8 flex justify-center">
        <button
          onClick={handleProcess}
          disabled={
            isProcessing ||
            (mode === "demo" && !selectedDemo) ||
            (mode === "paste" && !pastedText.trim())
          }
          className="inline-flex items-center gap-2 rounded-xl bg-[var(--cb-primary)] px-8 py-3.5 text-base font-semibold text-white shadow-lg transition-all hover:bg-[var(--cb-primary-dark)] hover:shadow-xl disabled:opacity-40 disabled:cursor-not-allowed active:scale-[0.98]"
        >
          {isProcessing ? (
            <>
              <Loader2 className="h-5 w-5 animate-spin" />
              Processing...
            </>
          ) : (
            <>
              Generate Learning Pack
              <ArrowRight className="h-4 w-4" />
            </>
          )}
        </button>
      </div>
    </div>
  );
}
