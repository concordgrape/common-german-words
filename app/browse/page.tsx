"use client";

import React from 'react';

import { WordTable } from '@/app/components/WordTable';
import { WordInfo } from '@/app/components/WordInfo';
import { Word } from '@/app/components/WordTable';

const words: Word[] = [
  { id: 11, term: 'improve', type: 'verb', tags: ['plan', 'modify'] }]

const MainWordPage: React.FC = () => {
    const [selectedWord, setSelectedWord] = React.useState<Word>(words[0]);
  return (
<div className="min-h-screen bg-[#323944] pt-20 p-4 text-white flex flex-col md:flex-row md:justify-start md:items-start md:space-x-8 max-w-7xl mx-auto">
      {/* WordTable Component */}
      <WordTable onRowClick={setSelectedWord} /*selectedWord={words[0]}*//>

      {/* Information Display Component */}
      <div className='hidden md:block sm:block'>
        <WordInfo selectedWord={selectedWord} />
      </div>
    </div>
  );
};

export default MainWordPage;
