"use client";

import { useState, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { demoWorksheets, getDemoWorksheet } from "@/lib/schemas/demo-materials";
import {
  ClipboardPaste,
  Sparkles,
  ArrowRight,
  AlertCircle,
  Loader2,
  CheckCircle,
  FileUp,
} from "lucide-react";

type InputMode = "demo" | "upload" | "paste";

export default function UploadPage() {
  const router = useRouter();
  const [mode, setMode] = useState<InputMode>("demo");
  const [selectedDemo, setSelectedDemo] = useState<string | null>(null);
  const [pastedText, setPastedText] = useState("");
  const [fileName, setFileName] = useState<string | null>(null);
  const [filePreview, setFilePreview] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showPrefs, setShowPrefs] = useState(false);
  const [prefs, setPrefs] = useState({ gradeLevel: "Grade 7", language: "Tamil", learningMode: "Explain simply" });
  const fileInputRef = useRef<HTMLInputElement>(null);

  const processFile = useCallback(async (file: File) => {
    setFileName(file.name);
    setError(null);

    // For text files, read content
    if (file.type === "text/plain" || file.name.endsWith(".txt")) {
      const text = await file.text();
      setPastedText(text);
      setMode("paste");
      return;
    }

    // For images, show preview
    if (file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = (e) => setFilePreview(e.target?.result as string);
      reader.readAsDataURL(file);
    } else {
      setFilePreview(null);
    }

    setMode("upload");
  }, []);

  const handleFileSelect = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) await processFile(file);
  }, [processFile]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback(async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) await processFile(file);
  }, [processFile]);

  const clearFile = useCallback(() => {
    setFileName(null);
    setFilePreview(null);
    setPastedText("");
    setMode("upload");
    if (fileInputRef.current) fileInputRef.current.value = "";
  }, []);

  const handleSelectPrefs = useCallback(() => {
    let content = "";
    let title = "";
    let subject = "";

    if (mode === "demo" && selectedDemo) {
      const demo = getDemoWorksheet(selectedDemo);
      if (!demo) { setError("Demo worksheet not found"); return; }
      content = demo.content;
      title = demo.title;
      subject = demo.subject;
    } else if (mode === "paste" && pastedText.trim()) {
      content = pastedText.trim();
      title = "Pasted Content";
      subject = "General";
    } else if (mode === "upload" && fileName) {
      // For uploads, extract text from uploaded file
      content = pastedText.trim() || "Uploaded content";
      title = fileName;
      subject = "General";
    } else {
      setError("Please select a demo, upload a file, or paste some text.");
      return;
    }

    sessionStorage.setItem("classbridge-content", JSON.stringify({ text: content, title, subject, source: mode }));
    setShowPrefs(true);
  }, [mode, selectedDemo, pastedText, fileName]);

  const handleProcess = useCallback(async () => {
    setError(null);
    setIsProcessing(true);
    try {
      sessionStorage.setItem("classbridge-preferences", JSON.stringify(prefs));
      router.push("/learning-pack");
    } catch {
      setError("Something went wrong. Please try again.");
      setIsProcessing(false);
    }
  }, [prefs, router]);

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
                  ? "border-[var(--cb-primary)] bg-[var(--cb-primary)]/5 shadow-md ring-2 ring-[var(--cb-primary)]/20"
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
                <div className="mt-3 flex items-center gap-1.5 rounded-lg bg-[var(--cb-primary)]/10 px-3 py-1.5 text-xs font-semibold text-[var(--cb-primary)]">
                  <CheckCircle className="h-4 w-4" /> Selected
                </div>
              )}
            </button>
          ))}
        </div>
      )}

      {/* Upload */}
      {mode === "upload" && (
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={cn(
            "rounded-2xl border-2 border-dashed bg-white p-12 text-center transition-all",
            isDragging
              ? "border-[var(--cb-primary)] bg-[var(--cb-primary)]/5"
              : "border-border/50 hover:border-[var(--cb-primary)]/30"
          )}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*,.pdf,.txt"
            onChange={handleFileSelect}
            className="hidden"
            tabIndex={-1}
            id="file-upload-input"
            aria-label="Upload a file"
          />
          {filePreview ? (
            <div className="relative inline-block">
              <img src={filePreview} alt="File preview" className="mx-auto max-h-[200px] rounded-xl object-contain" />
              <button
                onClick={clearFile}
                className="absolute -right-2 -top-2 flex h-7 w-7 items-center justify-center rounded-full bg-red-500 text-white shadow-lg hover:bg-red-600"
                aria-label="Remove file"
              >
                <span className="text-lg leading-none">×</span>
              </button>
            </div>
          ) : fileName ? (
            <div className="flex flex-col items-center gap-2">
              <FileUp className="h-12 w-12 text-[var(--cb-primary)]" />
              <p className="text-sm font-medium text-[var(--cb-text)]">{fileName}</p>
              <button onClick={clearFile} className="text-xs text-red-500 hover:text-red-600">Remove</button>
            </div>
          ) : (
            <>
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
            </>
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
        {showPrefs ? (
          <div className="w-full max-w-md rounded-2xl border border-border/50 bg-white p-6 shadow-sm">
            <h3 className="mb-4 text-base font-bold text-[var(--cb-text)]">Learning Preferences</h3>
            <div className="space-y-4">
              <div>
                <label htmlFor="grade-level-select" className="mb-1 block text-xs font-semibold text-[var(--cb-text-muted)]">Grade Level</label>
                <select
                  id="grade-level-select"
                  value={prefs.gradeLevel}
                  onChange={(e) => setPrefs({ ...prefs, gradeLevel: e.target.value })}
                  className="w-full rounded-xl border border-border/50 px-4 py-2.5 text-sm focus:border-[var(--cb-primary)] focus:outline-none"
                >
                  {["Grade 5","Grade 6","Grade 7","Grade 8","Grade 9","Grade 10"].map((g) => (
                    <option key={g} value={g}>{g}</option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="language-select" className="mb-1 block text-xs font-semibold text-[var(--cb-text-muted)]">Language</label>
                <select
                  id="language-select"
                  value={prefs.language}
                  onChange={(e) => setPrefs({ ...prefs, language: e.target.value })}
                  className="w-full rounded-xl border border-border/50 px-4 py-2.5 text-sm focus:border-[var(--cb-primary)] focus:outline-none"
                >
                  {["English","Tamil","Hindi"].map((l) => (
                    <option key={l} value={l}>{l}</option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="learning-mode-select" className="mb-1 block text-xs font-semibold text-[var(--cb-text-muted)]">Learning Mode</label>
                <select
                  id="learning-mode-select"
                  value={prefs.learningMode}
                  onChange={(e) => setPrefs({ ...prefs, learningMode: e.target.value })}
                  className="w-full rounded-xl border border-border/50 px-4 py-2.5 text-sm focus:border-[var(--cb-primary)] focus:outline-none"
                >
                  {["Explain simply","Step by step","With examples"].map((m) => (
                    <option key={m} value={m}>{m}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="mt-6 flex justify-between">
              <button
                onClick={() => setShowPrefs(false)}
                className="rounded-xl px-5 py-2.5 text-sm font-medium text-[var(--cb-text-muted)] hover:bg-[var(--cb-warm)]"
              >
                Back
              </button>
              <button
                onClick={handleProcess}
                disabled={isProcessing}
                className="inline-flex items-center gap-2 rounded-xl bg-[var(--cb-primary)] px-6 py-2.5 text-sm font-semibold text-white hover:bg-[var(--cb-primary-dark)] disabled:opacity-40"
              >
                {isProcessing ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
                Generate Learning Pack
              </button>
            </div>
          </div>
        ) : (
          <button
            onClick={handleSelectPrefs}
            disabled={
              (mode === "demo" && !selectedDemo) ||
              (mode === "paste" && !pastedText.trim())
            }
            className="inline-flex items-center gap-2 rounded-xl bg-[var(--cb-primary)] px-8 py-3.5 text-base font-semibold text-white shadow-lg transition-all hover:bg-[var(--cb-primary-dark)] hover:shadow-xl disabled:opacity-40 disabled:cursor-not-allowed active:scale-[0.98]"
          >
            Continue
            <ArrowRight className="h-4 w-4" />
          </button>
        )}
      </div>
    </div>
  );
}
