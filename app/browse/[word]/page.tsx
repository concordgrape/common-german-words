"use client";

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';

import { Word } from '@/app/components/WordTable';
import { WordTable } from '@/app/components/WordTable';
import { WordInfo } from '@/app/components/WordInfo';

const words: Word[] = [
  { id: 1, term: 'produce', type: 'verb', tags: ['cause', 'make'] },
  { id: 2, term: 'make', type: 'verb', tags: ['produce', 'do'] },
  { id: 3, term: 'establish', type: 'verb', tags: ['start', 'develop'] },
  { id: 4, term: 'build', type: 'verb', tags: ['produce', 'assemble'] },
  { id: 5, term: 'generate', type: 'verb', tags: ['cause', 'make'] },
  { id: 6, term: 'form', type: 'verb', tags: ['produce', 'build'] },
  { id: 7, term: 'construct', type: 'verb', tags: ['build', 'form'] },
  { id: 8, term: 'cause', type: 'verb', tags: ['make', 'work'] },
  { id: 9, term: 'originate', type: 'verb', tags: ['make', 'start'] },
  { id: 10, term: 'set up', type: 'verb', tags: ['start', 'establish'] },
];

const WordPage: React.FC = () => {
  const [selectedWord, setSelectedWord] = useState<Word | null>(null);
  const params = useParams();

useEffect(() => {
  const wordParam = params?.word?.toString();
  if (wordParam && typeof wordParam === 'string') {
    const decoded = decodeURIComponent(wordParam).toLowerCase().trim();
    const match = words.find(w => w.term.toLowerCase() === decoded);
    if (match) {
      setSelectedWord(match);
    }
  }
}, [params?.word]);

  return (
    <div className="min-h-screen bg-[#262839] text-white p-4 flex flex-col md:flex-row items-start justify-center space-y-4 md:space-y-0 md:space-x-4">
      {/* WordTable Component */}
      <WordTable /*onRowClick={setSelectedWord}*/ selectedWord={selectedWord} />

      {/* Information Display Component */}
      <div className='hidden md:block sm:block'>
        <WordInfo selectedWord={selectedWord} />
      </div>
    </div>
  );
};

export default WordPage;
