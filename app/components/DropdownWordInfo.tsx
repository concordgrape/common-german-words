"use client";

import React, { useEffect, useState } from "react";
import { Word } from "../helpers/fetchBasicWordList";
import GoogleTTSButton from "./GoogleTTSButton/GoogleTTSButton";
import { FullWordData } from "./WordInfo";
import { motion, AnimatePresence, MotionConfig } from "framer-motion";
import {
  kARTICLES_BY_GENDER,
  kCOUNTRY_LANG_CODE,
  kLANG_NAME,
} from "../lib/constants";
import { Flag } from "./Flag";

import "../globals.css";

interface DropdownWordInfoProps {
  word: Word;
  isOpen: boolean;
}

const InnerDropdownWordInfo: React.FC<DropdownWordInfoProps> = ({
  word,
  isOpen,
}) => {
  const [fullData, setFullData] = useState<FullWordData | null>(null);
  const [visibleExamples, setVisibleExamples] = useState(4);

  useEffect(() => {
    if (!isOpen) return;

    const fetchData = async () => {
      try {
        const res = await fetch(
          `/api/word?language=${kLANG_NAME}&word=${word.word}`,
        );
        const json = await res.json();
        setFullData(json.word || null);
      } catch (error) {
        console.error("Error fetching word info:", error);
        setFullData(null);
      }
    };

    fetchData();
    setVisibleExamples(4);
  }, [word.word, isOpen]);

  return (
    <MotionConfig reducedMotion="user">
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            key={word.word} // re-run enter when a different row opens
            initial={{ opacity: 0, y: -4, height: 0 }}
            animate={{ opacity: 1, y: 0, height: "auto" }}
            exit={{ opacity: 0, y: -4, height: 0 }}
            transition={{ duration: 0.18, ease: "easeOut" }}
            className="sm:hidden md:hidden overflow-hidden"
          >
            {fullData ? (
              <motion.div
                // subtle content fade once height is settled
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.12 }}
                className="poppins max-h-[400px] poppins overflow-y-auto p-4 px-6 bg-[#027AFB] text-white space-y-4 rounded-b-lg"
              >
                {/* ------- Top bar ------- */}
                <div className="relative mb-0 flex items-center justify-center w-full h-10">
                  {/* Left: Rank (tiny spring) */}
                  <div className="absolute left-0">
                    <motion.h2
                      layout
                      transition={{
                        type: "spring",
                        stiffness: 350,
                        damping: 28,
                      }}
                      className="text-lg font-bold poppins"
                    >
                      <i>{word.rank}</i>
                    </motion.h2>
                  </div>

                  {/* Center: Articles (no-wrap + tiny crossfade) */}
                  <motion.div
                    key={
                      (fullData.gender ?? "") + (fullData.part_of_speech ?? "")
                    }
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.12 }}
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
                  >
                    {fullData.part_of_speech?.toLowerCase() !== "determiner" &&
                      fullData.gender && (
                        <span className="poppins text-white text-xs italic whitespace-nowrap">
                          {
                            kARTICLES_BY_GENDER[
                              (fullData.gender.toLowerCase() === "femininen"
                                ? "feminine"
                                : fullData.gender.toLowerCase()) as keyof typeof kARTICLES_BY_GENDER
                            ]?.singular
                          }{" "}
                          /{" "}
                          {
                            kARTICLES_BY_GENDER[
                              (fullData.gender.toLowerCase() === "femininen"
                                ? "feminine"
                                : fullData.gender.toLowerCase()) as keyof typeof kARTICLES_BY_GENDER
                            ]?.plural
                          }
                        </span>
                      )}
                  </motion.div>

                  {/* Right: TTS */}
                  <div className="absolute right-0">
                    <GoogleTTSButton
                      text={word.word}
                      color={"text-white hover:bg-blue-400"}
                    />
                  </div>
                </div>

                {/* ------- Centered Word / Translation ------- */}
                <motion.div
                  layout
                  transition={{ type: "spring", stiffness: 320, damping: 26 }}
                  className="grid grid-cols-2 left-1/2 -translate-x-1/2 relative h-40 lg:h-34 w-fit rounded overflow-hidden"
                >
                  {/* Word */}
                  <div className="flex items-center justify-end border-r-2 border-blue-600 px-4 min-w-0">
                    <motion.h2
                      layout
                      transition={{
                        type: "spring",
                        stiffness: 340,
                        damping: 28,
                      }}
                      className="font-bold text-right text-2xl break-words overflow-hidden flex items-center"
                      style={{
                        hyphens: "auto",
                        overflowWrap: "break-word",
                        wordBreak: "break-word",
                        lineHeight: "1.5rem",
                        maxHeight: "6rem",
                        minHeight: "6rem",
                        alignItems: "center",
                      }}
                    >
                      {word.word}
                    </motion.h2>
                  </div>

                  {/* Translation */}
                  <div className="flex items-center justify-start px-4 min-w-0">
                    <div className="text-lg md:text-xl text-left">
                      <AnimatePresence initial={false}>
                        {word.translation.split(/[,;]/).map((part, idx) => (
                          <motion.div
                            key={part + idx}
                            initial={{ opacity: 0, y: 4 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -4 }}
                            transition={{ duration: 0.1, delay: idx * 0.015 }}
                            className="truncate"
                          >
                            {part.trim()}
                          </motion.div>
                        ))}
                      </AnimatePresence>
                    </div>
                  </div>
                </motion.div>

                {/* POS / Gender / Phonetics */}
                <motion.p
                  key={
                    (fullData.part_of_speech ?? "") +
                    (fullData.gender ?? "") +
                    (fullData.phonetic_spelling ?? "")
                  }
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.12 }}
                  className="text-center text-gray-200 italic"
                >
                  {fullData?.part_of_speech}
                  {fullData?.gender?.length ? ` · ${fullData.gender}` : ""}
                  {fullData?.phonetic_spelling
                    ? ` · [${fullData.phonetic_spelling}]`
                    : ""}
                </motion.p>

                <hr className="h-px my-4 border-0 bg-blue-400" />

                {/* Examples (tiny stagger) */}
                <div>
                  <h3 className="text-lg font-semibold mb-1 poppins">
                    Examples
                  </h3>
                  <ul className="space-y-2">
                    <AnimatePresence initial={false}>
                      {fullData.examples
                        .slice(0, visibleExamples)
                        .map((ex, idx) => (
                          <motion.li
                            key={ex.sentence + idx}
                            initial={{ opacity: 0, y: 6 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -6 }}
                            transition={{ duration: 0.12, delay: idx * 0.02 }}
                            className="text-white/90"
                          >
                            <div className="flex justify-between items-center">
                              <span>
                                <Flag code={kCOUNTRY_LANG_CODE} />{" "}
                                {ex.sentence.replace(/\./g, "")}
                              </span>
                              <GoogleTTSButton
                                text={ex.sentence}
                                color="text-white hover:bg-blue-400"
                              />
                            </div>
                            <div className="text-white/70">
                              <Flag code="gb" />{" "}
                              {ex.translation.replace(/\./g, "")}
                            </div>
                          </motion.li>
                        ))}
                    </AnimatePresence>
                  </ul>
                  {visibleExamples < fullData.examples.length && (
                    <motion.button
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setVisibleExamples((p) => p + 4)}
                      className="mt-2 text-sm text-blue-100 hover:text-white underline"
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
                      {fullData.definitions.slice(0, 3).map((def, idx) => (
                        <motion.li
                          key={def + idx}
                          initial={{ opacity: 0, y: 4 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -4 }}
                          transition={{ duration: 0.1, delay: idx * 0.015 }}
                        >
                          {def}
                        </motion.li>
                      ))}
                    </AnimatePresence>
                  </ul>
                </div>

                {/* Related Words */}
                {!!fullData.connected_words.length && (
                  <div>
                    <h3 className="text-lg font-semibold mb-1">
                      Related Words
                    </h3>
                    <motion.div layout className="flex flex-wrap gap-2">
                      <AnimatePresence initial={false}>
                        {fullData.connected_words.map((w, index) => (
                          <motion.span
                            key={w + index}
                            initial={{ opacity: 0, y: 4 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -4 }}
                            transition={{ duration: 0.1, delay: index * 0.015 }}
                            className="bg-white/10 px-3 py-1 rounded-full text-sm"
                          >
                            {w}
                          </motion.span>
                        ))}
                      </AnimatePresence>
                    </motion.div>
                  </div>
                )}
              </motion.div>
            ) : (
              // Spinner fades in, respects the same parent height animation
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.12 }}
                className="flex justify-center items-center py-6"
              >
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-white border-t-transparent" />
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </MotionConfig>
  );
};

export const DropdownWordInfo = React.memo(
  InnerDropdownWordInfo,
  (prev, next) => {
    return prev.word.word === next.word.word && prev.isOpen === next.isOpen;
  },
);
