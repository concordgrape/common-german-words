"use client";

import React, { Suspense, useEffect } from 'react';
import { LearnForm } from './LearnForm';
import { LearnFormConfirm } from './LearnFormConfirm';
import { useWordForm } from '../context/WordFormContext';
import { fetchBasicWords } from '../helpers/fetchBasicWordList';

const LearnWordPage: React.FC = () => {
  const { setFilteredWords } = useWordForm();

  useEffect(() => {
    async function loadWords() {
      const words = await fetchBasicWords("german", process.env.NEXT_PUBLIC_API_PASSWORD || "");
      setFilteredWords(words);
    }
    loadWords();
  }, [setFilteredWords]);

  return (
      <div className="min-h-screen w-full sm:top-15 md:top-15 pt-15 sm:p-4 md:p-4 text-black grid grid-cols-1 sm:grid-cols-[2fr_1fr] md:grid-cols-[2fr_1fr] gap-0 max-w-7xl mx-auto relative z-0">
      {/* WordTable (left column) */}
      <div className="z-10">
        <LearnForm />
      </div>

      {/* WordInfo (right column) */}
      <div className="flex mt-5 sm:mt-0 md:mt-0 lg:mt-0 sticky top-25 self-start z-20 flex-col items-center w-full">
        <LearnFormConfirm />
        <button className="bg-blue-500 text-white font-bold font-mono p-4 rounded-2xl mt-5 cursor-pointer hover:shadow-lg">
          &gt; Add Words &lt;
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
