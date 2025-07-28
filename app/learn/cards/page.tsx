"use client";

import React, { useState, useEffect, useCallback } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Flashcard from "./components/Flashcard/Flashcard";
import { useWordForm } from "@/app/context/WordFormContext";
import Link from "next/link";
import { ImExit } from "react-icons/im";
import Lottie from "lottie-react";
import confettiAnimation from "../../external/Lottie/confetti3.json";
import { motion, AnimatePresence } from "framer-motion";

const LearnCardsPage: React.FC = () => {
  const { submittedWords } = useWordForm();
  const [idx, setIdx] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

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
        <Link href="/learn">
          <button
            data-tip="Go Back"
            className="flex tooltip tooltip-bottom text-gray-500 bg-white rounded-full p-2 px-4 hover:bg-white/50 lg:mb-0"
          >
            <ImExit size={16} className="mt-1 mr-1" /> Exit
          </button>
        </Link>
        <div className="bg-white min-h-100 border border-gray-200 px-6 py-4 pt-5 rounded-lg mt-3 shadow-sm mx-auto">
          <progress
            className="progress progress-info w-full"
            value={Math.min(idx + 1, total)}
            max={total}
          ></progress>
          <div className="flex justify-center mt-2">
            <span className="text-md font-mono font-bold text-gray-500">
              {Math.min(idx + 1, total)} / {total}
            </span>
          </div>

          {idx < total && (
            <div className="mt-10">
              <Flashcard key={current.word} word={current} />
            </div>
          )}

          <div className="flex items-center justify-between mt-15">
            <button
              onClick={prev}
              disabled={idx === 0}
              aria-label="Previous card"
              className="p-2 rounded disabled:opacity-30 bg-gray-100 lg:bg-white hover:bg-gray-100 transition"
            >
              <ChevronLeft size={22} />
            </button>

            <button
              onClick={next}
              aria-label="Next card"
              className="p-2 rounded bg-gray-100 lg:bg-white hover:bg-gray-100 transition"
            >
              <ChevronRight size={22} />
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
            className="absolute inset-0 z-50 flex items-center justify-center bg-white/60 backdrop-blur-xs px-4"
          >
            <div className="w-full max-w-md sm:max-w-lg bg-white rounded-xl p-6 shadow-lg flex flex-col items-center text-center">
              <div className="w-full max-w-[200px] mb-4">
                <Lottie animationData={confettiAnimation} loop={true} />
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4">
                You completed this set!
              </h2>
              <Link href="/learn">
                <button className="bg-blue-500 text-white font-mono font-bold py-2 px-6 rounded-lg hover:bg-blue-600 shadow-md w-full sm:w-auto mb-2">
                  &gt; Learn More &lt;
                </button>
              </Link>
              <button
                className="bg-gray-100 text-black text-xs font-mono py-2 px-6 rounded-lg hover:bg-gray-200 max-w-100 lg:w-full sm:w-auto"
                onClick={() => {
                  setIsComplete(false);
                  setIdx(0);
                }}
              >
                Dismiss
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default LearnCardsPage;
