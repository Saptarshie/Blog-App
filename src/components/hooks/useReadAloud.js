"use client";
// hooks/useReadAloud.js
import { useState, useEffect } from 'react';

export default function useReadAloud() {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [voices, setVoices] = useState([]);

  // Load available voices
  useEffect(() => {
    const loadVoices = () => {
      const availableVoices = window.speechSynthesis.getVoices();
      setVoices(availableVoices);
    };

    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;
  }, []);

  const speak = (text, lang = 'en-US', voiceName = null) => {
    if (!window.speechSynthesis) {
      alert('Your browser does not support text‑to‑speech.');
      return;
    }
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang;
    utterance.rate = 1;

    // Pick a specific voice if provided
    if (voiceName) {
      const selectedVoice = voices.find(v => v.name === voiceName);
      if (selectedVoice) {
        utterance.voice = selectedVoice;
      }
    }

    utterance.onend = () => setIsSpeaking(false);
    setIsSpeaking(true);
    window.speechSynthesis.speak(utterance);
  };

  const stop = () => {
    window.speechSynthesis.cancel();
    setIsSpeaking(false);
  };

  return { isSpeaking, speak, stop, voices };
}
