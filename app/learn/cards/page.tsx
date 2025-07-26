"use client";

import React, { useState, useEffect, useCallback } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Flashcard from "./components/Flashcard/Flashcard";
import { useWordForm } from "@/app/context/WordFormContext";
import Link from "next/link";
import { ImExit } from "react-icons/im";

const LearnCardsPage: React.FC = () => {
  const { submittedWords } = useWordForm();
  const [idx, setIdx] = useState(0);

  const total = submittedWords.length;
  const current = submittedWords[idx];

  const prev = useCallback(() => setIdx(i => Math.max(i - 1, 0)), []);
  const next = useCallback(() => setIdx(i => Math.min(i + 1, total - 1)), [total]);

  // Optional: keyboard left/right to navigate
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.code === "ArrowLeft") prev();
      if (e.code === "ArrowRight") next();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [prev, next]);

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
    <div className="min-h-screen w-full pt-15 flex justify-center">
      <div className="w-full max-w-[800px] p-1 sm:p-4 md:p-4 mt-5 px-2 lg:px-5">
        <div className="bg-white min-h-100 border border-gray-200 px-6 py-4 pt-5 rounded-lg mt-3 shadow-sm mx-auto">
          <Link href="/learn">
            <button data-tip='Exit' className="tooltip text-gray-500 bg-gray-100 rounded-full p-2 hover:bg-gray-200 mb-8 lg:mb-0">
              <ImExit size={16} />
            </button>
          </Link>
            {/* Card */}
            <Flashcard
                key={current.word} // helps reset flip when changing word
                word={current}
            />

            {/* Controls */}
            <div className="flex items-center justify-between mt-15">
                <button
                    onClick={prev}
                    disabled={idx === 0}
                    aria-label="Previous card"
                    className="p-2 rounded disabled:opacity-30 bg-gray-100 lg:bg-white hover:bg-gray-100 transition"
                >
                <ChevronLeft size={22} />
                </button>

                <span className="text-md font-mono font-bold text-gray-500">
                {idx + 1} / {total}
                </span>

                <button
                    onClick={next}
                    disabled={idx === total - 1}
                    aria-label="Next card"
                    className="p-2 rounded disabled:opacity-30 bg-gray-100 lg:bg-white hover:bg-gray-100 transition"
                >
                <ChevronRight size={22} />
                </button>
            </div>
        </div>
      </div>
    </div>
  );
};

export default LearnCardsPage;
