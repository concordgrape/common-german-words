"use client";

import React, { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { WordTable } from "@/app/components/WordTable";
import { WordInfo } from "@/app/components/WordInfo";
import { fetchBasicWords, Word } from "@/app/helpers/fetchBasicWordList";
import { useToast } from "@/app/hooks/useToast";
import { useOnlineStatus } from "@/app/hooks/useOnlineStatus";
import Link from "next/link";
import { kESTIMATE_TOTAL_WORD_COUNT, kLANG_NAME } from "@/app/lib/constants";

const KnownWordList: React.FC = () => {
  const [selectedWord, setSelectedWord] = useState<Word | null>(null);
  const [words, setWords] = useState<Word[]>([]);
  const searchParams = useSearchParams();
  const isOnline = useOnlineStatus();
  const toast = useToast();

  // Fetch words
  useEffect(() => {
    fetchBasicWords(kLANG_NAME, setWords).then(setWords);
  }, []);

  useEffect(() => {
    if (!isOnline) {
      toast({
        title: "You are offline",
        subtitle: "Check your internet connection.",
        variant: "error",
      });
    }
  }, [isOnline]);

  // Select word from ?word= if present
  useEffect(() => {
    if (words.length === 0) return;

    const wordParam = searchParams.get("word");
    if (wordParam) {
      const match = words.find(
        (w) => w.word.toLowerCase() === wordParam.toLowerCase(),
      );
      if (match) {
        setSelectedWord(match);
        return;
      }
    }

    if (typeof window !== "undefined" && window.innerWidth >= 768) {
      setSelectedWord(words[0]);
    }
  }, [words, searchParams]);

  return (
    <div className="min-h-screen w-full sm:top-15 md:top-15 pt-20 sm:p-4 md:p-4 text-black grid grid-cols-1 sm:grid-cols-[2fr_1fr] md:grid-cols-[2fr_1fr] gap-0 max-w-7xl mx-auto relative z-0 dark:[#1B263B">
      {/* WordTable (left column) */}
      <div className="z-10">
        <div className="mx-3 my-6">
          <h1 className="text-black dark:text-white font-bold text-2xl flex">
            My known words
          </h1>
          <p className="text-black dark:text-white text-sm">
            <Link href="/browse" className="text-blue-500 hover:underline">
              Click here
            </Link>{" "}
            to see the full list of{" "}
            <span className="font-mono font-bold">
              {kESTIMATE_TOTAL_WORD_COUNT}+
            </span>{" "}
            words
          </p>
        </div>
        <WordTable
          onRowClick={(word) => {
            setSelectedWord(word);
          }}
          selectedWord={selectedWord}
          words={words}
          showOnlyKnown
        />
      </div>

      {/* WordInfo (right column) */}
      <div className="hidden sm:block md:block sticky top-25 self-start z-20">
        <WordInfo selectedWord={selectedWord} />
      </div>
    </div>
  );
};

export default function KnownWordListPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <KnownWordList />
    </Suspense>
  );
}
