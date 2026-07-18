"use client";

import { useEffect, useState, useCallback } from "react";
import { Play, Pause, RotateCcw, Volume2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface ReadAloudButtonProps {
  text: string;
  className?: string;
  label?: string;
}

export function ReadAloudButton({ text, className, label }: ReadAloudButtonProps) {
  const [speaking, setSpeaking] = useState(false);
  const [paused, setPaused] = useState(false);
  const [supported] = useState(() => typeof window !== "undefined" && "speechSynthesis" in window);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (typeof window !== "undefined" && window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const cleanText = text
    .replace(/<[^>]*>/g, "")
    .replace(/[#*_`~]/g, "")
    .replace(/\s+/g, " ")
    .trim();

  const speak = useCallback(() => {
    if (!supported) return;
    const synth = window.speechSynthesis;
    synth.cancel();

    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.rate = 0.9;
    utterance.pitch = 1.0;

    const voices = synth.getVoices();
    const preferredVoice =
      voices.find((v) => v.lang.startsWith("en-US")) ||
      voices.find((v) => v.lang.startsWith("en"));
    if (preferredVoice) utterance.voice = preferredVoice;

    utterance.onstart = () => { setSpeaking(true); setPaused(false); };
    utterance.onend = () => { setSpeaking(false); setPaused(false); };
    utterance.onerror = () => { setSpeaking(false); setPaused(false); };

    synth.speak(utterance);
  }, [supported, cleanText]);

  const pause = useCallback(() => {
    if (supported && speaking) {
      window.speechSynthesis.pause();
      setPaused(true);
    }
  }, [supported, speaking]);

  const resume = useCallback(() => {
    if (supported && paused) {
      window.speechSynthesis.resume();
      setPaused(false);
    }
  }, [supported, paused]);

  const replay = useCallback(() => {
    speak();
  }, [speak]);

  const stop = useCallback(() => {
    if (supported) {
      window.speechSynthesis.cancel();
      setSpeaking(false);
      setPaused(false);
    }
  }, [supported]);

  if (!supported) {
    return (
      <span className="inline-flex items-center gap-1.5 text-xs text-[var(--cb-text-muted)]">
        <Volume2 className="h-3.5 w-3.5" />
        Read-aloud not available in this browser
      </span>
    );
  }

  return (
    <div className={cn("inline-flex items-center gap-1.5", className)} role="group" aria-label={label || "Read aloud controls"}>
      {!speaking ? (
        <button
          onClick={speak}
          className="inline-flex items-center gap-2 rounded-xl bg-[var(--cb-primary)]/10 px-4 py-2 text-sm font-medium text-[var(--cb-primary)] transition-all hover:bg-[var(--cb-primary)]/20 active:scale-[0.97]"
          aria-label="Read aloud"
        >
          <Play className="h-4 w-4" fill="currentColor" />
          {label || "Read Aloud"}
        </button>
      ) : (
        <>
          <button
            onClick={paused ? resume : pause}
            className="inline-flex items-center gap-2 rounded-xl bg-[var(--cb-primary)]/10 px-4 py-2 text-sm font-medium text-[var(--cb-primary)] transition-all hover:bg-[var(--cb-primary)]/20"
            aria-label={paused ? "Resume reading" : "Pause reading"}
          >
            {paused ? <Play className="h-4 w-4" fill="currentColor" /> : <Pause className="h-4 w-4" />}
            {paused ? "Resume" : "Pause"}
          </button>
          <button
            onClick={replay}
            className="inline-flex items-center gap-1 rounded-lg bg-[var(--cb-warm)] px-3 py-2 text-xs text-[var(--cb-text-muted)] transition-colors hover:bg-[var(--cb-warm)]/80"
            aria-label="Replay"
          >
            <RotateCcw className="h-3.5 w-3.5" />
          </button>
          <button
            onClick={stop}
            className="inline-flex items-center gap-1 rounded-lg px-3 py-2 text-xs text-[var(--cb-text-muted)] transition-colors hover:bg-[var(--cb-warm)]"
            aria-label="Stop"
          >
            Stop
          </button>
        </>
      )}
    </div>
  );
}
