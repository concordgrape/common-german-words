"use client";

import React, { useState, useEffect, useCallback } from "react";
import Flashcard from "./components/Flashcard/Flashcard";
import { isWord, useWordForm } from "@/app/context/WordFormContext";
import Link from "next/link";
import { ImExit } from "react-icons/im";
import Lottie from "lottie-react";
import confettiAnimation from "../../external/Lottie/confetti3.json";
import { motion, AnimatePresence } from "framer-motion";
import { FaChevronLeft, FaChevronRight, FaRedo } from "react-icons/fa";
import QuizFlashcard from "./components/Quiz/Quiz";
import { useGoNavigation } from "@/app/lib/navigation";
import { FaLightbulb } from "react-icons/fa6";
import WordStatusButtons from "@/app/components/WordStatusButtons/WordStatusButtons";
import { useToggleWordStatus } from "@/app/helpers/userWordLibrary";
import { hasWordStatus } from "@/app/helpers/localWordStore";

const LearnCardsPage: React.FC = () => {
  const { submittedWords } = useWordForm();
  const { go } = useGoNavigation();
  const { toggleSavedStatus, toggleKnownStatus } = useToggleWordStatus();
  const [idx, setIdx] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [isKnown, setIsKnown] = useState(false);

  const total = submittedWords.length;
  const current = submittedWords[Math.min(idx, total - 1)]; // fallback

  const prev = useCallback(() => {
    setIdx((i) => Math.max(i - 1, 0));
    setIsComplete(false);
  }, []);

  const next = useCallback(() => {
    setIdx((i) => {
      if (i + 1 >= total) {
        setIsComplete(true);
      }
      return i + 1;
    });
  }, [total]);

  const handleExit = () => {
    const confirmed = window.confirm(
      "Are you sure? Your progress will be lost",
    );
    if (confirmed) {
      go("/learn");
    }
  };

  // keyboard nav
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.code === "ArrowLeft") prev();
      if (e.code === "ArrowRight") next();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [prev, next]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    if (!isWord(current)) {
      setIsSaved(false);
      setIsKnown(false);
      return;
    }

    setIsSaved(hasWordStatus(current.word, "saved"));
    setIsKnown(hasWordStatus(current.word, "known"));
  }, [current]);

  if (!total) {
    return (
      <div className="min-h-screen w-full pt-15 pt-50 text-center items-center justify-center">
        <p className="text-gray-500">No words submitted</p>
        <Link href="/learn">
          <button className="bg-blue-500 text-white font-bold font-mono p-4 rounded-2xl mt-5 cursor-pointer hover:shadow-lg">
            &gt; Let&apos;s Add Words &lt;
          </button>
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full pt-15 flex justify-center relative overflow-hidden">
      <div className="w-full max-w-[800px] p-1 sm:p-4 md:p-4 mt-5 px-2 lg:px-5 z-10">
        <button
          onClick={handleExit}
          data-tip="Go Back"
          className="flex tooltip tooltip-bottom text-gray-500 dark:text-white bg-white dark:bg-transparent rounded-full p-2 px-4 hover:bg-white/50 dark:hover:bg-[#3E3F53] dark:hover:text-gray-300 lg:mb-0"
        >
          <ImExit size={16} className="mt-1 mr-1" /> Exit
        </button>
        <div className="bg-white dark:bg-[#0D1B2A] min-h-100 border border-gray-200 dark:border-gray-700 px-6 py-4 pt-5 rounded-lg mt-3 shadow-sm mx-auto">
          <progress
            className="progress progress-info w-full"
            value={Math.min(idx + 1, total)}
            max={total}
          ></progress>
          <div className="relative mt-2 h-5">
            {/* Centered count */}
            <span className="absolute left-1/2 -translate-x-1/2 text-md font-mono font-bold text-gray-500 dark:text-gray-300">
              {Math.min(idx + 1, total)} / {total}
            </span>

            {isWord(current) ? (
              <></>
            ) : (
              <FaLightbulb
                size={18}
                onClick={() => setShowHint(true)}
                className="absolute right-0 text-orange-400 cursor-pointer hover:scale-110 transition-transform"
                title="Hint"
              />
            )}
          </div>
          {idx < total && (
            <div className="mt-10">
              {isWord(current) ? (
                <Flashcard key={current.word} word={current} />
              ) : (
                <QuizFlashcard
                  key={idx}
                  question={current.sentence}
                  answer={current.answer}
                  question_translated={current.sentence_translated}
                  hint={current.hint || ""}
                  showHint={showHint}
                  onHintUsed={() => setShowHint(false)}
                  onNext={next}
                />
              )}
            </div>
          )}

          <div className="flex items-center justify-between mt-15">
            {/* Prev */}
            <button
              onClick={prev}
              disabled={idx === 0}
              aria-label="Previous card"
              className="p-2 rounded disabled:cursor-not-allowed disabled:opacity-30 bg-gray-200 lg:bg-white dark:bg-[#0093F5] hover:bg-gray-100 dark:hover:bg-[#0093F5]/50 transition"
            >
              <FaChevronLeft size={22} />
            </button>

            {isWord(current) && (
              <WordStatusButtons
                large
                isPlusEnabled={isSaved}
                isCheckEnabled={isKnown}
                onPlusClick={async (e) => {
                  e.stopPropagation();
                  const prev = isSaved;
                  setIsSaved(!prev);
                  try {
                    await toggleSavedStatus(current.word);
                  } catch {
                    setIsSaved(prev);
                  }
                }}
                onCheckClick={async (e) => {
                  e.stopPropagation();
                  const prev = isKnown;
                  setIsKnown(!prev);
                  try {
                    await toggleKnownStatus(current.word);
                  } catch {
                    setIsKnown(prev);
                  }
                }}
              />
            )}

            {/* Next */}
            <button
              onClick={next}
              aria-label="Next card"
              className="p-2 rounded disabled:cursor-not-allowed disabled:opacity-30 bg-gray-200 lg:bg-white dark:bg-[#0093F5] hover:bg-gray-100 dark:hover:bg-[#0093F5]/50 transition"
            >
              <FaChevronRight size={22} />
            </button>
          </div>
        </div>
      </div>
      <AnimatePresence>
        {isComplete && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0 z-50 flex items-center justify-center bg-white/60 dark:bg-black/60 backdrop-blur-xs px-4"
          >
            <div className="w-full max-w-md sm:max-w-lg bg-white dark:bg-[#313248] rounded-xl p-6 shadow-lg flex flex-col items-center text-center relative">
              <div className="absolute top-0 right-0 mt-3 mr-3">
                <button
                  onClick={() => {
                    setIsComplete(false);
                    setIdx(0);
                  }}
                  className="cursor-pointer text-black dark:text-white hover:text-gray-500 dark:hover:text-gray-400"
                  aria-label="Close"
                >
                  <svg
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
              <div className="w-full max-w-[200px] mb-4">
                <Lottie animationData={confettiAnimation} loop={true} />
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-gray-800 dark:text-white mb-4">
                You completed this set!
              </h2>
              <Link href="/learn">
                <button className="cursor-pointer bg-blue-500 text-white font-mono font-bold py-2 px-6 rounded-lg hover:bg-blue-600 shadow-md w-full sm:w-auto mb-2">
                  &gt; Learn More &lt;
                </button>
              </Link>
              <button
                className="flex bg-gray-100 dark:bg-gray-900 text-black dark:text-white text-xs font-mono py-2 px-6 rounded-lg hover:bg-gray-200 dark:hover:bg-black max-w-100 max-w-100 sm:w-auto"
                onClick={() => {
                  setIsComplete(false);
                  setIdx(0);
                }}
              >
                <FaRedo className="mr-1 mt-[1px]" />
                <span className="font-bold">Redo</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default LearnCardsPage;
