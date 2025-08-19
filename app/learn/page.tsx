"use client";

import React, { Suspense, useEffect, useState } from "react";
import { LearnForm } from "./LearnForm";
import { LearnFormConfirm } from "./LearnFormConfirm";
import { useWordForm } from "../context/WordFormContext";
import { useRouter } from "next/navigation";
import {
  fetchBasicWords,
  fetchRandomWords,
} from "../helpers/fetchBasicWordList";
import { useToast } from "../hooks/useToast";
import { formatFillInTheBlankQuestions } from "../helpers/userWordLibrary";
import { kDEFAULT_WORD_COUNT, kLANG_NAME_CAPITAL } from "../lib/constants";

export type Mode = "flashcards" | "quiz" | "fill";

const LearnWordPage: React.FC = () => {
  const {
    setFilteredWords,
    setAllWords,
    allWords,
    setSubmittedWords,
    savedWords,
    setSavedWords
  } = useWordForm();
  const [mode, setMode] = useState<Mode>("flashcards");
  const [wordType, setWordType] = useState<string>("All");
  const [wordCount, setWordCount] = useState<number>(kDEFAULT_WORD_COUNT);
  const [priority, setPriority] = useState<"common-words" | "random">(
    "common-words"
  );
  const [rank, setRank] = useState<number>(0);
  const [loading, setLoading] = useState(false);
  const toast = useToast();
  const router = useRouter();

  useEffect(() => {
    async function loadWords() {
      console.log("Loading words...");
      try {
        const words = await fetchBasicWords(kLANG_NAME);
        console.log("Fetched words:", words.length);
        setFilteredWords(words);
        setAllWords(words);
        setSavedWords([]);
      } catch (err) {
        console.error("Failed to fetch words", err);
      }
    }
    loadWords();
  }, [setFilteredWords, setAllWords]);

  const handleStartClick = async () => {
    if (wordCount === 0 && savedWords.length === 0) {
      toast({
        title: "No Words Found",
        subtitle: "Try a different filter or part of speech.",
        variant: "error",
      });
      return;
    }

    setLoading(true);
    const start = Date.now();

    try {
      const words = await fetchRandomWords(
        kLANG_NAME,
        wordType,
        wordCount,
        rank === 0 ? null : rank,
        priority,
        savedWords
      );

      if (words.length === 0 && savedWords.length === 0) {
        toast({
          title: "No Words Found",
          subtitle: "Try a different filter or part of speech.",
          variant: "error",
        });
        return;
      }

      if (mode === "quiz") {
        const quizWords = formatFillInTheBlankQuestions(words);
        setSubmittedWords(quizWords);
      } else {
        setSubmittedWords(words);
      }

      // ensure at least 500ms loading
      const elapsed = Date.now() - start;
      const remaining = 500 - elapsed;
      setTimeout(
        () => {
          setLoading(false);
          router.push("/learn/cards");
        },
        remaining > 0 ? remaining : 0
      );
    } catch (err) {
      console.error("Error fetching words:", err);
      toast({
        title: "Error",
        subtitle: "Failed to fetch words",
        variant: "error",
      });
      setLoading(false);
    }
  };

  useEffect(() => {
    console.log("wordCount: ", wordCount);
  }, [wordCount]);

  useEffect(() => {
    console.log("priority ", priority);
  }, [priority]);

  return (
    <div className="min-h-screen w-full sm:top-15 md:top-15 pt-15 sm:p-4 md:p-4 text-black grid grid-cols-1 sm:grid-cols-[2fr_1fr] md:grid-cols-[2fr_1fr] gap-0 max-w-7xl mx-auto relative z-0">
      {/* WordTable (left column) */}
      <div className="z-10">
        <LearnForm
          wordCount={wordCount}
          setWordCount={setWordCount}
          priority={priority}
          setPriority={setPriority}
          rank={rank}
          setRank={setRank}
          wordType={wordType}
          setWordType={setWordType}
          setMode={setMode}
          mode={mode}
          loading={loading}
        />
      </div>

      {/* WordInfo (right column) */}
      <div className="flex mt-5 sm:mt-0 md:mt-0 lg:mt-0 sticky top-25 self-start z-20 flex-col items-center w-full">
        <LearnFormConfirm wordCount={wordCount} />
        <button
          onClick={() => {
            /*if (submittedWords.length === 0) {
      toast({ title: 'No Words Selected', subtitle: `You cannot start with zero words selected`, variant: 'error' });
      return;
    }*/
            handleStartClick();
          }}
          disabled={loading}
          className={`relative flex flex-col items-center justify-center bg-blue-500 text-white font-bold font-mono p-4 rounded-2xl mt-5 cursor-pointer hover:shadow-lg transition-opacity ${
            loading || allWords.length === 0
              ? "opacity-50 cursor-not-allowed"
              : ""
          }`}
        >
          {loading ? (
            <svg
              className="animate-spin h-6 w-6 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v8H4z"
              />
            </svg>
          ) : (
            <>
              <span>&gt; Start &lt;</span>
              <span className="text-xs mt-1 italic">{mode}</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default function LearnPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <LearnWordPage />
    </Suspense>
  );
}
