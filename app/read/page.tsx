"use client";

import React, { Suspense, useState } from 'react';
import { BookSection } from './BookSection';
import { WordInfo } from '../components/WordInfo';
import { Word } from '../helpers/fetchBasicWordList';

const ReadPageContent: React.FC = () => {
  const [selectedWord, setSelectedWord] = useState<Word | null>(null);
  return (
      <div className="min-h-screen w-full sm:top-15 md:top-15 pt-15 text-black grid grid-cols-1 sm:grid-cols-[2fr_1fr] md:grid-cols-[2fr_1fr] gap-0 max-w-7xl mx-auto relative z-0">
      {/* WordTable (left column) */}
      <div className="z-10">
        <BookSection setSelectedWord={setSelectedWord} />
      </div>

      {/* WordInfo (right column) */}
      <div className="flex mt-5 sm:mt-0 md:mt-0 lg:mt-0 sticky top-25 self-start z-20 flex-col items-center w-full">
        <WordInfo 
          selectedWord={selectedWord} 
        />
      </div>
    </div>
  );
};

export default function ReadPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ReadPageContent />
    </Suspense>
  );
}
