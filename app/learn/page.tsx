"use client";

import React, { Suspense, useEffect, useState } from 'react';
import { LearnForm } from './LearnForm';
import { LearnFormConfirm } from './LearnFormConfirm';
import { useWordForm } from '../context/WordFormContext';
import { fetchAllWords } from '../helpers/fetchBasicWordList';
import { useToast } from '../hooks/useToast';
import Link from 'next/link';

export type Mode = 'flashcards' | 'quiz' | 'fill';

const LearnWordPage: React.FC = () => {
  const { setFilteredWords, setAllWords, allWords, submittedWords } = useWordForm();
  const [mode, setMode] = useState<Mode>('flashcards');
  const toast = useToast();

  useEffect(() => {
    async function loadWords() {
      console.log('Loading words...');
      try {
        const words = await fetchAllWords("german", process.env.NEXT_PUBLIC_API_PASSWORD || "");
        console.log('Fetched words:', words.length);
        setFilteredWords(words);
        setAllWords(words);
      } catch (err) {
        console.error("Failed to fetch words", err);
      }
    }
    loadWords();
  }, [setFilteredWords, setAllWords]);

  return (
      <div className="min-h-screen w-full sm:top-15 md:top-15 pt-15 sm:p-4 md:p-4 text-black grid grid-cols-1 sm:grid-cols-[2fr_1fr] md:grid-cols-[2fr_1fr] gap-0 max-w-7xl mx-auto relative z-0">
      {/* WordTable (left column) */}
      <div className="z-10">
        <LearnForm setMode={setMode} />
      </div>

      {/* WordInfo (right column) */}
      <div className="flex mt-5 sm:mt-0 md:mt-0 lg:mt-0 sticky top-25 self-start z-20 flex-col items-center w-full">
        <LearnFormConfirm />
        {(allWords.length == 0 || submittedWords.length == 0) ?
          <button onClick={() => {
            toast({ title: 'No Words Selected', subtitle: `You cannot start with zero words selected`, variant: 'error' });
          }} className={`${allWords.length == 0 ? 'skeleton opacity-20 fill-[#027AFB]' : ''} bg-blue-500 text-white font-bold font-mono p-4 rounded-2xl mt-5 cursor-pointer hover:shadow-lg`}>
            &gt; Start &lt;
            <span className='block text-xs mt-1'><i>{mode}</i></span>
          </button>
        :
        <Link href="/learn/cards">
          <button className={`${allWords.length == 0 ? 'skeleton opacity-20 fill-[#027AFB]' : ''} bg-blue-500 text-white font-bold font-mono p-4 rounded-2xl mt-5 cursor-pointer hover:shadow-lg`}>
            &gt; Start &lt;
            <span className='block text-xs mt-1'><i>{mode}</i></span>
          </button>
        </Link>
        }
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
