"use client";

import React from 'react';

import { Word } from './WordTable';

interface WordInfoProps {
  selectedWord?: Word | null;
}

// New WordInfo component to display selected word details
export const WordInfo: React.FC<WordInfoProps> = ({ selectedWord }) => {
  return (
<div className="fixed top-24 px-8 w-full max-w-7xl ml-15 flex">
  <div className="w-full max-w-sm bg-[#21252B] rounded-lg shadow-lg p-6 min-h-[500px] flex flex-col">
    {selectedWord ? (
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2 text-blue-400">{selectedWord.term}</h2>
        <p className="text-gray-300 mb-4">
          Type: <span className="font-medium text-gray-200">{selectedWord.type}</span>
        </p>
        <div className="flex flex-wrap justify-center gap-2">
          {selectedWord.tags.map((tag) => (
            <span key={tag} className="bg-blue-600 text-white text-sm px-3 py-1 rounded-full shadow-md">
              #{tag}
            </span>
          ))}
        </div>
        <p className="mt-4 text-gray-400 text-sm">
          More detailed information about &quot;{selectedWord.term}&quot; would appear here.
        </p>
      </div>
    ) : (
      <p className="text-gray-400 text-lg"></p>
    )}
  </div>
</div>

  );
};