"use client";

export interface TTSState {
  speaking: boolean;
  paused: boolean;
  supported: boolean;
  currentText: string;
}

type TTSListener = (state: TTSState) => void;

class TextToSpeechService {
  private synth: SpeechSynthesis | null = null;
  private utterance: SpeechSynthesisUtterance | null = null;
  private listeners: TTSListener[] = [];
  private state: TTSState = {
    speaking: false,
    paused: false,
    supported: false,
    currentText: "",
  };

  constructor() {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      this.synth = window.speechSynthesis;
      this.state.supported = true;
    }
  }

  subscribe(listener: TTSListener): () => void {
    this.listeners.push(listener);
    listener(this.state);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener);
    };
  }

  private setState(partial: Partial<TTSState>) {
    this.state = { ...this.state, ...partial };
    this.listeners.forEach((l) => l(this.state));
  }

  speak(text: string) {
    if (!this.synth) return;

    // Cancel any ongoing speech
    this.synth.cancel();

    // Clean text of markdown/HTML
    const cleanText = text
      .replace(/<[^>]*>/g, "")
      .replace(/[#*_`~]/g, "")
      .replace(/\s+/g, " ")
      .trim();

    this.utterance = new SpeechSynthesisUtterance(cleanText);
    this.utterance.rate = 0.9;
    this.utterance.pitch = 1.0;
    this.utterance.volume = 1.0;

    // Try to find a good English voice
    const voices = this.synth.getVoices();
    const preferredVoice =
      voices.find((v) => v.lang.startsWith("en") && v.name.includes("Samantha")) ||
      voices.find((v) => v.lang.startsWith("en-US")) ||
      voices.find((v) => v.lang.startsWith("en"));
    if (preferredVoice) {
      this.utterance.voice = preferredVoice;
    }

    this.utterance.onstart = () => {
      this.setState({ speaking: true, paused: false, currentText: cleanText });
    };

    this.utterance.onend = () => {
      this.setState({ speaking: false, paused: false, currentText: "" });
    };

    this.utterance.onerror = () => {
      this.setState({ speaking: false, paused: false, currentText: "" });
    };

    this.synth.speak(this.utterance);
  }

  pause() {
    if (this.synth && this.state.speaking) {
      this.synth.pause();
      this.setState({ paused: true });
    }
  }

  resume() {
    if (this.synth && this.state.paused) {
      this.synth.resume();
      this.setState({ paused: false });
    }
  }

  stop() {
    if (this.synth) {
      this.synth.cancel();
      this.setState({ speaking: false, paused: false, currentText: "" });
    }
  }

  replay(text: string) {
    this.stop();
    // Small delay to ensure cancel completes
    setTimeout(() => this.speak(text), 100);
  }

  getVoices(): SpeechSynthesisVoice[] {
    if (!this.synth) return [];
    return this.synth.getVoices();
  }

  getState(): TTSState {
    return this.state;
  }
}

// Singleton
export const tts = typeof window !== "undefined" ? new TextToSpeechService() : null;

/**
 * Read-aloud button component hook
 */
export function useTTS() {
  return tts;
}
