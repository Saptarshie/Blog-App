// hooks/useReadAloud.js
import { useState } from 'react';

export default function useReadAloud() {
  const [isSpeaking, setIsSpeaking] = useState(false);

  const speak = (text, lang = 'en-US') => {
    if (!window.speechSynthesis) {
      alert('Your browser does not support text‑to‑speech.');
      return;
    }
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang;
    utterance.rate = 1;
    utterance.onend = () => setIsSpeaking(false);
    setIsSpeaking(true);
    window.speechSynthesis.speak(utterance);
  };

  const stop = () => {
    window.speechSynthesis.cancel();
    setIsSpeaking(false);
  };

  return { isSpeaking, speak, stop };
}
