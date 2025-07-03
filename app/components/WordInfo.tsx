"use client";

import React from 'react';

import { Word } from './WordTable';

interface WordInfoProps {
  selectedWord?: Word | null;
}

// New WordInfo component to display selected word details
export const WordInfo: React.FC<WordInfoProps> = ({ selectedWord }) => {
  return (
<div className="w-full">
  <div className="w-full bg-[#027AFB] rounded-lg shadow-lg p-6 flex flex-col">
    {selectedWord ? (
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2 text-white">{selectedWord.term}</h2>
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
        <p className="mt-4 text-gray-200 text-sm">
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