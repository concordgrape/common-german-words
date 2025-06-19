"use client";

import React, { useState } from 'react';

import { Word } from './components/WordTable';
import { WordTable } from './components/WordTable';
import { WordInfo } from './components/WordInfo';

const App: React.FC = () => {
  const [selectedWord, setSelectedWord] = useState<Word | null>(null);

  const handleRowClick = (word: Word) => {
    setSelectedWord(word);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-4 flex flex-col md:flex-row items-start justify-center space-y-4 md:space-y-0 md:space-x-4">
      
      {/* WordTable Component */}
      <WordTable onRowClick={handleRowClick} />

      {/* Information Display Component */}
      <div className='hidden md:block sm:block'>
        <WordInfo selectedWord={selectedWord} />
      </div>
    </div>
  );
};

export default App;