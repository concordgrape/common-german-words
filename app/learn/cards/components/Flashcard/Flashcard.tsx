"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Word } from "@/app/helpers/fetchBasicWordList";
import styles from "./Flashcard.module.css";
import GoogleTTSButton from "@/app/components/GoogleTTSButton/GoogleTTSButton";

type FlashcardProps = {
  word: Word;
  className?: string;
};

export default function Flashcard({ word, className }: FlashcardProps) {
  const [flipped, setFlipped] = useState(false);

  const toggle = useCallback(() => setFlipped((f) => !f), []);

  // Space bar support
  useEffect(() => {
    console.log(word);
    const onKey = (e: KeyboardEvent) => {
      if (e.code === "Space") {
        e.preventDefault();
        toggle();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [toggle]);

  return (
    <div
      role="button"
      tabIndex={0}
      aria-pressed={flipped}
      onClick={toggle}
      onKeyDown={(e) => {
        if (e.code === "Space" || e.code === "Enter") {
          e.preventDefault();
          toggle();
        }
      }}
      className={`mx-auto ${styles.wrapper} ${
        className ?? ""
      } items-center justify-center focus:outline-none`}
    >
      <div className={`${styles.card} ${flipped ? styles.flipped : ""}`}>
        <div
          className={`${styles.face} ${styles.front} relative flex flex-col h-full`}
        >
          {/* rank + TTS in the corners */}
          <span className="absolute top-2 left-2 text-xs text-gray-600">
            {word.rank}
          </span>

          {/* center‑of‑card word */}
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <div className="text-3xl font-bold break-all max-w-full">
                {word.word}
              </div>
              <div className="mt-1 text-xs text-gray-600 italic">
                [{word.phonetic_spelling}]
              </div>
              <div className="mt-2 flex justify-center text-sm">
                <GoogleTTSButton text={word.word} />
              </div>
            </div>
          </div>
          {/* bottom of card example */}
          <div className="px-4 py-2 text-sm text-gray-700 text-center">
            {word.examples?.[1]?.sentence?.replace(".", "") || ""}
          </div>
          <span className="absolute bottom-2 right-2 text-sm text-gray-600">
            <GoogleTTSButton
              text={word.examples?.[1]?.sentence?.replace(".", "") || ""}
            />
          </span>
        </div>

        {/* back face */}
        <div className={`${styles.face} ${styles.back} flex flex-col h-full`}>
          {/* 1. Centered main translation */}
          <div className="flex-1 flex items-center justify-center">
            <div className="text-3xl font-bold text-center">
              {word.translation}
            </div>
          </div>

          {/* 2. Bottom‑centered example translation */}
          <div className="py-2 text-sm text-white text-center">
            {word.examples[1]
              ? word.examples[1].translation.replace(".", "")
              : ""}
          </div>
        </div>
      </div>
    </div>
  );
}
