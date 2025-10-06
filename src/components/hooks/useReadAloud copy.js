// "use client";
// // hooks/useReadAloud.js
// import { useState, useEffect } from 'react';

// export default function useReadAloud() {
//   const [isSpeaking, setIsSpeaking] = useState(false);
//   const [voices, setVoices] = useState([]);

//   // Load available voices
//   useEffect(() => {
//     const loadVoices = () => {
//       const availableVoices = window.speechSynthesis.getVoices();
//       setVoices(availableVoices);
//     };

//     loadVoices();
//     window.speechSynthesis.onvoiceschanged = loadVoices;
//   }, []);

//   const speak = (text, lang = 'en-US', voiceName = null) => {
//     if (!window.speechSynthesis) {
//       alert('Your browser does not support text‑to‑speech.');
//       return;
//     }
//     const utterance = new SpeechSynthesisUtterance(text);
//     utterance.lang = lang;
//     utterance.rate = 1;

//     // Pick a specific voice if provided
//     if (voiceName) {
//       const selectedVoice = voices.find(v => v.name === voiceName);
//       if (selectedVoice) {
//         utterance.voice = selectedVoice;
//       }
//     }

//     utterance.onend = () => setIsSpeaking(false);
//     setIsSpeaking(true);
//     window.speechSynthesis.speak(utterance);
//   };

//   const stop = () => {
//     window.speechSynthesis.cancel();
//     setIsSpeaking(false);
//   };

//   return { isSpeaking, speak, stop, voices };
// }


// ---------------------------------------------------------------------

// src/components/hooks/useReadAloud.js

"use client";
import { useState, useEffect, useRef } from 'react';

export default function useReadAloud() {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [voices, setVoices] = useState([]);
  // Use a ref to ensure the utterance is stable across re-renders
  const utteranceRef = useRef(null); 

  // This effect is now more robust for loading voices
  useEffect(() => {
    const loadVoices = () => {
      const availableVoices = window.speechSynthesis.getVoices();
      if (availableVoices.length > 0) {
        setVoices(availableVoices);
      }
    };

    // Load voices immediately
    loadVoices();

    // And listen for changes, as they can load asynchronously
    window.speechSynthesis.onvoiceschanged = loadVoices;

    // Cleanup the event listener when the component unmounts
    return () => {
      window.speechSynthesis.onvoiceschanged = null;
      // Also ensure speech stops when the component is unmounted
      window.speechSynthesis.cancel(); 
    };
  }, []);

  const speak = (text, lang = 'en-US') => {
    if (!window.speechSynthesis) {
      console.error('Text-to-speech not supported in this browser.');
      return;
    }

    // ✅ IMPORTANT: Always cancel previous speech before starting new.
    // This prevents errors if the button is clicked while the engine is busy.
    window.speechSynthesis.cancel();

    const newUtterance = new SpeechSynthesisUtterance(text);
    utteranceRef.current = newUtterance; // Store it in the ref

    newUtterance.lang = lang;
    newUtterance.rate = 1;

    // Let the browser pick a default voice initially, which is more reliable.
    // You can add voice selection logic later if needed.
    // For example: newUtterance.voice = voices.find(v => v.name === 'Google US English');
    
    newUtterance.onstart = () => setIsSpeaking(true);
    newUtterance.onend = () => setIsSpeaking(false);
    newUtterance.onerror = (event) => {
      console.error('SpeechSynthesisUtterance.onerror', event);
      setIsSpeaking(false);
    };

    window.speechSynthesis.speak(newUtterance);
  };

  const stop = () => {
    window.speechSynthesis.cancel();
    setIsSpeaking(false);
  };

  return { isSpeaking, speak, stop, voices };
}