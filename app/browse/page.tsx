"use client";

import React from 'react';
import { useEffect } from 'react';

import { WordTable } from '@/app/components/WordTable';
import { WordInfo } from '@/app/components/WordInfo';
import { fetchBasicWords, Word } from '../helpers/fetchBasicWordList';

const MainWordPage: React.FC = () => {
    const [selectedWord, setSelectedWord] = React.useState<Word>();
    const [words, setWords] = React.useState<Word[]>([]);

useEffect(() => {
    fetchBasicWords("german", process.env.NEXT_PUBLIC_API_PASSWORD || "").then(setWords);
  }, []);

  useEffect(() => {
    console.log("Words fetched:", words);
    setSelectedWord(words[0]);
  }, [words]);

  return (
<div className="min-h-screen max-w-[1000px] pt-20 p-2 sm:p-4 sm:pt-20 md:p-4 md:pt-20 text-black grid grid-cols-1 sm:grid-cols-[2fr_1fr] md:grid-cols-[2fr_1fr] gap-0 max-w-7xl mx-auto relative z-0">
  {/* WordTable (left column) */}
  <div className="z-10">
    <WordTable onRowClick={setSelectedWord} words={words} />
  </div>

  {/* WordInfo (right column) */}
  <div className="hidden sm:block md:block sticky ml-10 top-40 self-start z-20">
    <WordInfo selectedWord={selectedWord} />
  </div>
</div>


  );
};

export default MainWordPage;
