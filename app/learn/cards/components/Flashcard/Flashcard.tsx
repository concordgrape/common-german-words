"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Word } from "@/app/helpers/fetchBasicWordList";
import styles from "./Flashcard.module.css";

type FlashcardProps = {
  word: Word;
  className?: string;
};

export default function Flashcard({ word, className }: FlashcardProps) {
  const [flipped, setFlipped] = useState(false);

  const toggle = useCallback(() => setFlipped(f => !f), []);

  // Space bar support
  useEffect(() => {
    console.log(word)
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
    <button
      type="button"
      aria-pressed={flipped}
      onClick={toggle}
      className={`mx-auto ${styles.wrapper} ${className ?? ""}`}
    >
      <div className={`${styles.card} ${flipped ? styles.flipped : ""}`}>
        <div className={`${styles.face} ${styles.front} relative`}>
          <span className="absolute top-2 right-2 text-xs text-gray-600">{word.rank}</span>
          {word.word}
        </div>
        <div className={styles.face + " " + styles.back}>{word.translation}</div>
      </div>
    </button>
  );
}
