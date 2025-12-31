"use client";

import React, { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";

import { WordTable } from "@/app/components/WordTable";
import { WordInfo } from "@/app/components/WordInfo";
import { fetchTopWords, Word } from "../../helpers/fetchBasicWordList";
import { useOnlineStatus } from "@/app/hooks/useOnlineStatus";
import { useToast } from "../../hooks/useToast";
import Article from "@/app/components/Article/Article";
import { kLANG_NAME } from "@/app/lib/constants";

const TopAdverbs: React.FC = () => {
  const [selectedWord, setSelectedWord] = useState<Word | null>(null);
  const [words, setWords] = useState<Word[]>([]);
  const searchParams = useSearchParams();
  const isOnline = useOnlineStatus();
  const toast = useToast();

  // Fetch words
  useEffect(() => {
    fetchTopWords(kLANG_NAME, "Adverb", 500).then(setWords);
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
    <div className="sm:top-15 md:top-15 pt-15 text-left justify-left">
      <div className="min-h-screen w-full sm:p-4 md:p-4 pb-0 text-black grid grid-cols-1 sm:grid-cols-[2fr_1fr] md:grid-cols-[2fr_1fr] gap-0 max-w-7xl mx-auto relative z-0 dark:[#1B263B]">
        {/* Left column (Article + WordTable) */}
        <div className="z-10 flex flex-col">
          <Article type="Adverbs" count={500} />
          <WordTable
            onRowClick={(word) => setSelectedWord(word)}
            selectedWord={selectedWord}
            words={words}
            showUpTo500Rows={true}
          />
        </div>

        {/* Right column (WordInfo) */}
        <div className="hidden sm:block md:block sticky top-25 self-start z-20">
          <WordInfo selectedWord={selectedWord} />
        </div>
      </div>
    </div>
  );
};

export default function TopNounsPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <TopAdverbs />
    </Suspense>
  );
}
