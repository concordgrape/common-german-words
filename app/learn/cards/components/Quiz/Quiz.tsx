"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import clsx from "clsx";
import { FaDeleteLeft } from "react-icons/fa6";
import Lottie from "lottie-react";
import confettiAnimation from "../../../../external/Lottie/confetti2.json";
import { kLANGUAGE_ALPHABET } from "@/app/lib/constants";

type FillInTheBlankProps = {
  question: string;
  question_translated: string;
  answer: string;
  hint: string;
  showHint: boolean;
  onHintUsed: () => void;
  onNext: () => void;
};

export default function FillInTheBlankQuiz({
  question,
  answer,
  question_translated,
  hint,
  showHint,
  onHintUsed,
  onNext,
}: FillInTheBlankProps) {
  const [input, setInput] = useState("");
  const [status, setStatus] = useState<"idle" | "correct" | "incorrect">(
    "idle"
  );
  const [shake, setShake] = useState(false);
  const [revealedIndexes, setRevealedIndexes] = useState<Set<number>>(
    new Set()
  );
  const [displayLetters, setDisplayLetters] = useState<string[]>([]);
  const [showConfetti, setShowConfetti] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim().toLowerCase() === answer.toLowerCase()) {
      setStatus("correct");
      setShowConfetti(true);

      setTimeout(() => {
        setShowConfetti(false);
        setStatus("idle");
        setInput("");
        onNext();
      }, 1500); // duration of confetti + pause before next
    } else {
      setStatus("incorrect");
      setShake(true);
      setTimeout(() => {
        setShake(false);
        setInput("");
        setStatus("idle");
      }, 1000);
    }
  };

  useEffect(() => {
    if (showHint) {
      // Compute unrevealed indexes
      const allIndexes = [...Array(answer.length).keys()];
      const remainingIndexes = allIndexes.filter(
        (i) => !revealedIndexes.has(i)
      );

      if (remainingIndexes.length > 0) {
        const randomIndex =
          remainingIndexes[Math.floor(Math.random() * remainingIndexes.length)];
        setRevealedIndexes((prev) => new Set(prev).add(randomIndex));
      }

      onHintUsed(); // Reset hint flag
    }
  }, [showHint, answer, revealedIndexes, onHintUsed]);

  useEffect(() => {
    const answerLetters = [...new Set(answer.toUpperCase())];

    // Remove any duplicates from the extra letters too
    const availableExtras = kLANGUAGE_ALPHABET.filter(
      (letter) => !answerLetters.includes(letter.toUpperCase())
    );

    const extraLetters = [...availableExtras]
      .sort(() => 0.5 - Math.random())
      .slice(0, 4);

    // Combine and remove duplicates one last time
    const combined = [...new Set([...answerLetters, ...extraLetters])].sort(
      () => 0.5 - Math.random()
    );

    setDisplayLetters(combined);

    // Reset revealed letters and input when question changes
    setInput("");
    setRevealedIndexes(new Set());
  }, [answer]);

  return (
    <motion.div
      className={clsx(
        "max-w-xl h-[400px] flex flex-col justify-between text-center text-lg font-mono mx-auto lg:my-8 lg:p-4 rounded-lg transition-colors"
      )}
      animate={shake ? { x: [-10, 10, -8, 8, -5, 5, 0] } : {}}
      transition={{ duration: 0.3 }}
      onAnimationComplete={() => {
        if (status === "correct") {
          setTimeout(() => {
            onNext();
          }, 300);
        }
      }}
    >
      {showConfetti && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="w-[300px] sm:w-[400px] pointer-events-none">
            <Lottie animationData={confettiAnimation} loop={false} />
          </div>
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="flex flex-col flex-grow justify-between"
      >
        <div>
          <div className="text-black dark:text-white text-xl mb-4">
            {question.split("_____").map((chunk, i) => (
              <React.Fragment key={i}>
                {chunk}
                {i === 0 && (
                  <input
                    value={input.toLowerCase()}
                    onChange={(e) => setInput(e.target.value)}
                    spellCheck={false}
                    autoFocus
                    autoComplete={"off"}
                    className={clsx(
                      "inline-block w-32 px-2 py-1 mx-2 text-center border-b-2 border-blue-500 bg-transparent text-black dark:text-white placeholder-gray-500 outline-none",
                      {
                        "bg-green-400 border-green-500": status === "correct",
                        "bg-red-400 border-red-500": status === "incorrect",
                      }
                    )}
                    placeholder="?"
                    disabled={status === "correct"}
                  />
                )}
              </React.Fragment>
            ))}
          </div>

          <p className="mt-2 text-sm text-gray-400 dark:text-gray-300">
            {question_translated.includes(hint) ? (
              <>
                {question_translated.split(hint).map((part, i, arr) => (
                  <React.Fragment key={i}>
                    {part}
                    {i < arr.length - 1 && <strong>{hint}</strong>}
                  </React.Fragment>
                ))}
              </>
            ) : (
              question_translated
            )}
          </p>
        </div>
        <div className="bottom-0 mt-8">
          <motion.div
            className="flex justify-center flex-wrap gap-1"
            key={answer} // ensures remounting animation on question change
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
          >
            {displayLetters.map((char, i) => (
              <motion.span
                key={`letter-${i}`}
                whileTap={{ scale: 0.9 }}
                className="cursor-pointer mx-[1px] lg:mx-1 p-1 px-3 lg:p-3 lg:px-4 rounded-sm bg-gray-200 hover:bg-gray-100 hover:shadow-sm dark:bg-gray-500 dark:hover:bg-gray-600 flex items-center justify-center text-center"
                onClick={() => setInput((input) => input + char)}
              >
                {char.toLowerCase()}
              </motion.span>
            ))}
            <FaDeleteLeft
              onClick={() => setInput((input) => input.slice(0, -1))}
              className="cursor-pointer mt-1 h-10 p-2 w-10 mx-1 rounded-sm hover:bg-gray-100 hover:shadow-sm dark:hover:bg-gray-600"
            />
          </motion.div>
        </div>
        <br />
        <div className="bottom-0">
          <>
            <h3 className="mb-1 font-bold text-gray-400 text-sm">
              <i>Hint:</i>
            </h3>
           {[...answer].map((part, i) => (
              <React.Fragment key={i}>
                <span
                  className="mx-1 inline-block w-6 h-8 text-center font-mono text-lg leading-8 border-b-2 border-black dark:border-white text-black dark:text-white"
                >
                  {revealedIndexes.has(i) ? part : "_"}
                </span>
              </React.Fragment>
            ))}
          </>
        </div>
        <button
          type="submit"
          className={`mt-6 px-4 py-2 text-white rounded border self-center ${
            status === "incorrect"
              ? "bg-red-400 border-red-500"
              : "bg-blue-500 hover:bg-blue-600 border-blue-500"
          } ${
            status === "correct"
              ? "bg-green-400 border-green-500"
              : "bg-blue-500 hover:bg-blue-600 border-blue-500"
          }`}
        >
          Submit
        </button>
      </form>
    </motion.div>
  );
}
