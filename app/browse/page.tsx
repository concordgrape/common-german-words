'use client';

import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';

import { WordTable } from '@/app/components/WordTable';
import { WordInfo } from '@/app/components/WordInfo';
import { fetchBasicWords, Word } from '../helpers/fetchBasicWordList';
import { useToast } from '../hooks/useToast';
import { useOnlineStatus } from '../hooks/useOnlineStatus';

export default function BrowsePage() {
  const [selectedWord, setSelectedWord] = useState<Word | null>(null);
  const [words, setWords] = useState<Word[]>([]);
  const searchParams = useSearchParams();
  const isOnline = useOnlineStatus();
  const toast = useToast();

  useEffect(() => {
    fetchBasicWords("german", process.env.NEXT_PUBLIC_API_PASSWORD || "").then(setWords);
  }, []);

  useEffect(() => {
    if (!isOnline) {
      toast({ title: 'You are offline', subtitle: 'Check your internet connection.', variant: 'error' });
    }
  }, [isOnline]);

  useEffect(() => {
    if (words.length === 0) return;

    const wordParam = searchParams.get("word");
    if (wordParam) {
      const match = words.find((w) => w.word.toLowerCase() === wordParam.toLowerCase());
      if (match) {
        setSelectedWord(match);
        return;
      }
    }

    if (typeof window !== 'undefined' && window.innerWidth >= 768) {
      setSelectedWord(words[0]);
    }
  }, [words, searchParams]);

  return (
    <div className="min-h-screen w-full sm:top-15 md:top-15 pt-15 sm:p-4 md:p-4 text-black grid grid-cols-1 sm:grid-cols-[2fr_1fr] md:grid-cols-[2fr_1fr] gap-0 max-w-7xl mx-auto relative z-0">
      <div className="z-10">
        <WordTable
          onRowClick={(word) => { setSelectedWord(word) }}
          selectedWord={selectedWord}
          words={words}
        />
      </div>

      <div className="hidden sm:block md:block sticky top-25 self-start z-20">
        <WordInfo selectedWord={selectedWord} />
      </div>
    </div>
  );
}
