"use client";

import React, { useState, useEffect, useCallback } from "react";
import styles from "./Flashcard.module.css";

type FlashcardProps = {
  front: React.ReactNode;
  back: React.ReactNode;
  className?: string;
};

export default function Flashcard({ front, back, className }: FlashcardProps) {
  const [flipped, setFlipped] = useState(false);

  const toggle = useCallback(() => setFlipped(f => !f), []);

  // Space bar support
  useEffect(() => {
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
        <div className={styles.face + " " + styles.front}>{front}</div>
        <div className={styles.face + " " + styles.back}>{back}</div>
      </div>
    </button>
  );
}
