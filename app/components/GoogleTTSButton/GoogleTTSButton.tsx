'use client';

import { useState, useRef } from 'react';

export default function GoogleTTSButton({ text, color }: { text: string; color?: string }) {
  const [loading, setLoading] = useState(false);
  const lastPlayedRef = useRef<number>(0);

  const speak = async () => {
    const now = Date.now();
    const cooldownMs = 5_000;

    if (now - lastPlayedRef.current < cooldownMs) {
      const secondsLeft = Math.ceil((cooldownMs - (now - lastPlayedRef.current)) / 1000);
      console.warn(`Please wait ${secondsLeft}s before playing again.`);
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/speak', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text }),
      });

      if (!res.ok) throw new Error('TTS failed');

      const audioBlob = await res.blob();
      const audioUrl = URL.createObjectURL(audioBlob);
      const audio = new Audio(audioUrl);
      audio.play();

      lastPlayedRef.current = now;
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={(e) => {
        e.stopPropagation();
        speak();
      }}
      disabled={loading}
      className={`${
        color ? color + ' lg:mt-1 h-8 w-8 pl-2' : 'text-blue-500 flex items-center justify-center hover:bg-gray-100 w-6 h-6'
      } rounded`}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 14 14"
        width="1em"
        height="1em"
      >
        <path
          fill="none"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M3 5H1.5a1 1 0 0 0-1 1v2a1 1 0 0 0 1 1H3Zm0 4l3.91 2.81a1 1 0 0 0 1 .08A1 1 0 0 0 8.5 11V3a1 1 0 0 0-.5-.89a1 1 0 0 0-1 .08L3 5m9.5-1a4.38 4.38 0 0 1 1 3a6.92 6.92 0 0 1-1 3.5m-2-5A2.19 2.19 0 0 1 11 7a2.19 2.19 0 0 1-.5 1.5"
        ></path>
      </svg>
    </button>
  );
}
