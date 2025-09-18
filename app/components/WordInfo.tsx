"use client";

import React, { useEffect, useState, useRef } from "react";
import { Word } from "../helpers/fetchBasicWordList";
import GoogleTTSButton from "./GoogleTTSButton/GoogleTTSButton";
import Link from "next/link";
import { motion, AnimatePresence, MotionConfig } from "framer-motion";
import { kARTICLES_BY_GENDER, kCOUNTRY_FLAG_EMOJI, kCOUNTRY_LANG_CODE, kLANG_NAME } from "../lib/constants";

interface WordInfoProps {
  selectedWord?: Word | null;
}

export interface FullWordData {
  connected_words: string[];
  definitions: string[];
  examples: { sentence: string; translation: string }[];
  language: string;
  part_of_speech: string;
  phonetic_spelling: string;
  same_words: string[];
  gender: string;
  translation: string;
}

export const WordInfo: React.FC<WordInfoProps> = ({ selectedWord }) => {
  const [fullData, setFullData] = useState<FullWordData | null>(null);
  // Add this to your component state
  const [visibleExamples, setVisibleExamples] = useState(4);
  const lastFetchedWord = useRef<string | null>(null);
  const wordRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    if (!wordRef.current) return;

    const resizeObserver = new ResizeObserver(() => {
      if (!wordRef.current) return;
    });

    resizeObserver.observe(wordRef.current);

    return () => resizeObserver.disconnect();
  }, [selectedWord?.word]);

  useEffect(() => {
    if (!selectedWord || selectedWord.word === lastFetchedWord.current) {
      return;
    }

    const fetchData = async () => {
      try {
        const res = await fetch(
          `/api/word?language=${kLANG_NAME}&word=${selectedWord.word}`
        );
        const json = await res.json();
        if (json.word) {
          setFullData(json.word);
        } else {
          setFullData(null);
        }
        lastFetchedWord.current = selectedWord.word;
      } catch {
        setFullData(null);
      }
    };

    fetchData();
    setVisibleExamples(4); // reset
  }, [selectedWord]);

  if (!selectedWord) {
    return <div className="w-full" />;
  }

  return (
    <MotionConfig reducedMotion="user">
      <AnimatePresence mode="wait">
        <motion.div
          key={selectedWord.word}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          className="space-y-4"
        >
          <div className="w-full">
            <div className="w-full bg-[#027AFB] poppins rounded-sm shadow-lg px-6 py-4 flex flex-col max-h-[65vh] overflow-y-auto">
              {fullData ? (
                <div className="text-white space-y-4">
                  <div className="relative w-full">
                    <div className="relative flex items-center justify-center w-full h-10">
                      {/* Left: Rank */}
                      <div className="absolute left-0">
                        <h2 className="text-lg font-bold">
                          <i>{selectedWord.rank}</i>
                        </h2>
                      </div>

                      {/* Center: WordStatusButtons */}
                      <motion.div
                        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
                        key={
                          (fullData?.gender ?? "") +
                          (fullData?.part_of_speech ?? "")
                        }
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.15 }}
                      >
                        {" "}
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                          {fullData.part_of_speech?.toLowerCase() !==
                            "determiner" &&
                            fullData.gender && (
                              <span className="text-white text-xs italic whitespace-nowrap">
                                {
                                  kARTICLES_BY_GENDER[
                                    (fullData.gender.toLowerCase() ===
                                    "femininen"
                                      ? "feminine"
                                      : fullData.gender.toLowerCase()) as keyof typeof kARTICLES_BY_GENDER
                                  ]?.singular
                                }{" "}
                                /{" "}
                                {
                                  kARTICLES_BY_GENDER[
                                    (fullData.gender.toLowerCase() ===
                                    "femininen"
                                      ? "feminine"
                                      : fullData.gender.toLowerCase()) as keyof typeof kARTICLES_BY_GENDER
                                  ]?.plural
                                }
                              </span>
                            )}
                        </div>
                      </motion.div>

                      {/* Right: TTS Button */}
                      <div className="absolute right-0">
                        <GoogleTTSButton
                          text={selectedWord.word}
                          color={"text-white hover:bg-blue-400"}
                        />
                      </div>
                    </div>
                    {/* Centered Word */}

                    <motion.div
                      layout
                      className="grid grid-cols-2 left-1/2 -translate-x-1/2 relative h-40 lg:h-34 w-fit rounded overflow-hidden"
                      transition={{
                        type: "spring",
                        stiffness: 300,
                        damping: 28,
                      }}
                    >
                      {" "}
                      {/* Left Column: Word (right aligned, auto-shrink if long) */}
                      <div className="flex items-center justify-end border-r-2 border-blue-600 px-4 min-w-0">
                        <h2
                          className="font-bold text-right break-words overflow-hidden flex items-center"
                          style={{
                            fontSize: "clamp(1rem, 4vw, 1.8rem)", // scales between 16px and 30px
                            hyphens: "auto",
                            overflowWrap: "break-word",
                            wordBreak: "break-word",
                            lineHeight: "1.5rem", // adjust based on font size
                            maxHeight: "6rem", // 4 lines × 1.5rem line-height
                            minHeight: "6rem", // reserve space for 4 lines even if shorter
                            alignItems: "center", // center vertically
                          }}
                        >
                          {selectedWord.word}
                        </h2>
                      </div>
                      {/* Right Column: Translation (left aligned) */}
                      <div className="flex items-center justify-start px-4 min-w-0">
                        <div className="text-lg md:text-xl text-left">
                          <AnimatePresence initial={false}>
                            {selectedWord.translation
                              .split(/[,;]/) // split by , or ;
                              .map((part, idx) => (
                                <div key={idx} className="truncate">
                                  {part.trim()}
                                </div>
                              ))}
                          </AnimatePresence>
                        </div>
                      </div>
                    </motion.div>
                  </div>
                  <motion.p
                    key={
                      (fullData?.part_of_speech ?? "") +
                      (fullData?.gender ?? "") +
                      (fullData?.phonetic_spelling ?? "")
                    }
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.15 }}
                    className="text-center text-gray-200 italic"
                  >
                    {fullData?.part_of_speech} ·{" "}
                    {fullData?.gender ? `${fullData.gender} · ` : ""}[
                    {fullData?.phonetic_spelling}]
                  </motion.p>

                  <hr className="h-px my-4 border-0 bg-blue-400" />

                  {/* Example Sentences */}
                  <div>
                    <h3 className="text-lg font-semibold mb-1">Examples</h3>
                    <ul className="space-y-2">
                        {fullData?.examples
                          .slice(0, visibleExamples)
                          .map((ex, idx) => (
                            <motion.li
                              key={ex.sentence + idx}
                              className="text-white/90"
                              initial={{ opacity: 0, y: 8 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -8 }}
                              transition={{
                                duration: 0.18,
                                delay: idx * 0.025,
                              }}
                            >
                              <div className="flex justify-between items-center">
                                <span className="flex flex-wrap gap-1">
                                  {kCOUNTRY_FLAG_EMOJI}
                                  {ex.sentence
                                    .replace(/[.,!?;:]/g, "")
                                    .split(" ")
                                    .map((word, i) => (
                                      <Link
                                        key={i}
                                        href={`/${kCOUNTRY_LANG_CODE}/browse?word=${word}`}
                                      >
                                        <span
                                          key={i}
                                          className="hover:bg-blue-300 cursor-pointer rounded"
                                        >
                                          {word}
                                        </span>
                                      </Link>
                                    ))}
                                </span>
                                <GoogleTTSButton
                                  text={ex.sentence}
                                  color="text-white hover:bg-blue-400"
                                />
                              </div>
                              <div className="text-white/70">
                                🇬🇧 {ex.translation.replace(/\./g, "")}
                              </div>
                            </motion.li>
                          ))}
                    </ul>

                    {visibleExamples < fullData.examples.length && (
                      <motion.button
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setVisibleExamples((prev) => prev + 4)}
                        className="mt-4 text-sm text-blue-100 hover:text-white underline"
                      >
                        Load more examples
                      </motion.button>
                    )}
                  </div>

                  {/* Definitions */}
                  <div>
                    <h3 className="text-lg font-semibold mb-1">Definitions</h3>
                    <ul className="list-disc list-inside text-white/90">
                      <AnimatePresence initial={false}>
                        {fullData?.definitions.slice(0, 3).map((def, idx) => (
                          <motion.li
                            key={def + idx}
                            initial={{ opacity: 0, y: 6 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -6 }}
                            transition={{ duration: 0.15, delay: idx * 0.03 }}
                          >
                            {def}
                          </motion.li>
                        ))}
                      </AnimatePresence>
                    </ul>
                  </div>

                  {/* Connected Words */}
                  {fullData.connected_words.length > 0 && (
                    <div>
                      <h3 className="text-lg font-semibold mb-1">
                        Related Words
                      </h3>
                      <motion.div
                        layout
                        className="flex flex-wrap gap-2"
                        transition={{
                          type: "spring",
                          stiffness: 300,
                          damping: 26,
                        }}
                      >
                        <AnimatePresence initial={false}>
                          {fullData.connected_words.map((w, index) => (
                            <Link
                              key={w + index}
                              href={`/${kCOUNTRY_LANG_CODE}/browse?word=${w}`}
                            >
                              <motion.span
                                key={w + index}
                                initial={{ opacity: 0, y: 6 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -6 }}
                                transition={{
                                  duration: 0.15,
                                  delay: index * 0.02,
                                }}
                                className="bg-white/10 px-3 py-1 rounded-full text-sm hover:bg-blue-400"
                              >
                                {w}
                              </motion.span>
                            </Link>
                          ))}
                        </AnimatePresence>
                      </motion.div>
                    </div>
                  )}
                </div>
              ) : (
                <p className="text-white">
                  No details available for &quot;{selectedWord.word}&quot;.
                </p>
              )}
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </MotionConfig>
  );
};
